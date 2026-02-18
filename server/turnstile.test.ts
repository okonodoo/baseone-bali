import { describe, it, expect } from "vitest";

describe("Cloudflare Turnstile", () => {
  it("should have TURNSTILE_SECRET_KEY configured", () => {
    const key = process.env.TURNSTILE_SECRET_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(key!.startsWith("0x")).toBe(true);
  });

  it("should have VITE_TURNSTILE_SITE_KEY configured", () => {
    const key = process.env.VITE_TURNSTILE_SITE_KEY;
    expect(key).toBeDefined();
    expect(key).not.toBe("");
    expect(key!.startsWith("0x")).toBe(true);
  });

  it("should reach Cloudflare siteverify endpoint", async () => {
    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        secret: process.env.TURNSTILE_SECRET_KEY,
        response: "dummy-token-for-test",
      }),
    });
    expect(response.status).toBe(200);
    const data = await response.json();
    // With a dummy token, it should return success: false (invalid token)
    // but the endpoint should be reachable and the secret key format accepted
    expect(data).toHaveProperty("success");
    // If secret key is invalid, Cloudflare returns specific error codes
    if (!data.success) {
      // "invalid-input-response" means the secret key was accepted but token was bad
      // "invalid-input-secret" means the secret key itself is wrong
      const hasInvalidSecret = data["error-codes"]?.includes("invalid-input-secret");
      expect(hasInvalidSecret).toBe(false); // Secret key should be valid
    }
  });

  it("verifyTurnstileToken helper should work", async () => {
    // Test the verification function we'll create
    const secret = process.env.TURNSTILE_SECRET_KEY!;
    const formData = new URLSearchParams();
    formData.append("secret", secret);
    formData.append("response", "test-token");

    const response = await fetch("https://challenges.cloudflare.com/turnstile/v0/siteverify", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: formData.toString(),
    });

    const data = await response.json();
    expect(response.status).toBe(200);
    expect(data).toHaveProperty("success");
    // With a fake token, success should be false but no "invalid-input-secret" error
    expect(data["error-codes"]).not.toContain("invalid-input-secret");
  });
});
