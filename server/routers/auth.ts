import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "../_core/trpc";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { getSessionCookieOptions } from "../_core/cookies";
import { sdk } from "../_core/sdk";
import { getUserByEmail, upsertUser, setUserPasswordHash } from "../db";
import { syncOdooContact } from "../odoo";
import { sendWelcomeEmail } from "../email";
import { ENV } from "../_core/env";
import bcrypt from "bcryptjs";
import crypto from "crypto";

/* ─── Turnstile Verification ─── */
async function verifyTurnstileToken(token: string): Promise<boolean> {
  const secret = ENV.turnstileSecretKey;
  if (!secret) {
    console.warn("[Turnstile] No secret key configured, skipping verification");
    return true; 
  }

  try {
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", token);

    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: formData.toString(),
      }
    );

    const data = await response.json() as { success: boolean; "error-codes"?: string[] };
    if (!data.success) {
      console.warn("[Turnstile] Verification failed:", data["error-codes"]);
    }
    return data.success;
  } catch (err) {
    console.error("[Turnstile] Verification error:", err);
    return false;
  }
}

/* ─── Schemas ─── */
const emailRegisterSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  turnstileToken: z.string().min(1, "Human verification is required"),
});

const emailLoginSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
  turnstileToken: z.string().min(1, "Human verification is required"),
});

export const authRouter = router({
  /**
   * Register a new user with email and password
   */
  register: publicProcedure
    .input(emailRegisterSchema)
    .mutation(async ({ ctx, input }) => {
      const isHuman = await verifyTurnstileToken(input.turnstileToken);
      if (!isHuman) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Human verification failed. Please try again.",
        });
      }

      const existingUser = await getUserByEmail(input.email);
      if (existingUser && existingUser.passwordHash) {
        throw new TRPCError({
          code: "CONFLICT",
          message: "An account with this email already exists. Please login instead.",
        });
      }

      const passwordHash = await bcrypt.hash(input.password, 12);
      const openId = `email_${crypto.randomUUID()}`;

      await upsertUser({
        openId,
        name: input.name,
        email: input.email,
        loginMethod: "email",
        lastSignedIn: new Date(),
      });

      const user = await getUserByEmail(input.email);
      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Failed to create user account",
        });
      }

      await setUserPasswordHash(user.id, passwordHash);

      syncOdooContact({
        name: input.name,
        email: input.email,
      }).catch((e: unknown) => console.warn("[Auth] Odoo contact sync failed:", e));

      sendWelcomeEmail({
        name: input.name,
        email: input.email,
      }).catch((e: unknown) => console.warn("[Auth] Welcome email failed:", e));

      // Create session token with correct fields
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "Investor",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return { success: true, user: { name: input.name, email: input.email } };
    }),

  /**
   * Login with email and password
   */
  login: publicProcedure
    .input(emailLoginSchema)
    .mutation(async ({ ctx, input }) => {
      const isHuman = await verifyTurnstileToken(input.turnstileToken);
      if (!isHuman) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Human verification failed. Please try again.",
        });
      }

      const user = await getUserByEmail(input.email);
      if (!user || !user.passwordHash) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      const isValid = await bcrypt.compare(input.password, user.passwordHash);
      if (!isValid) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "Invalid email or password",
        });
      }

      await upsertUser({
        openId: user.openId,
        lastSignedIn: new Date(),
      });

      // Create session token with correct fields
      const sessionToken = await sdk.createSessionToken(user.openId, {
        name: user.name || "Investor",
        expiresInMs: ONE_YEAR_MS,
      });

      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.cookie(COOKIE_NAME, sessionToken, { ...cookieOptions, maxAge: ONE_YEAR_MS });

      return { success: true, user: { name: user.name, email: user.email } };
    }),
});
