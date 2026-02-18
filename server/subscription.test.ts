import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock Xendit so checkout doesn't actually call Xendit API
vi.mock("./xendit", () => ({
  createXenditInvoice: vi.fn().mockResolvedValue({
    url: "https://checkout.xendit.co/test-invoice",
    currency: "IDR",
    displayPrice: "Rp 313.425",
  }),
  registerXenditWebhook: vi.fn(),
  getExchangeRateInfo: vi.fn().mockResolvedValue({
    usdToIdr: 15750,
    source: "Odoo / Bank Indonesia",
    updatedAt: new Date().toISOString(),
  }),
}));

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: { protocol: "https", headers: {} } as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

function createAuthContext(tier: string = "free"): TrpcContext {
  return {
    user: {
      id: 1,
      openId: "test-user",
      email: "test@example.com",
      name: "Test User",
      loginMethod: "baseoneglobal",
      role: "user",
      subscriptionTier: tier,
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    },
    req: { protocol: "https", headers: { origin: "https://example.com" } } as unknown as TrpcContext["req"],
    res: { clearCookie: vi.fn() } as unknown as TrpcContext["res"],
  };
}

describe("subscription.status", () => {
  it("returns free tier for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    const result = await caller.subscription.status();
    expect(result.tier).toBe("free");
    expect(result.isAuthenticated).toBe(false);
  });

  it("returns correct tier for authenticated free user", async () => {
    const ctx = createAuthContext("free");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.subscription.status();
    expect(result.tier).toBe("free");
    expect(result.isAuthenticated).toBe(true);
  });

  it("returns correct tier for premium user", async () => {
    const ctx = createAuthContext("premium");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.subscription.status();
    expect(result.tier).toBe("premium");
    expect(result.isAuthenticated).toBe(true);
  });

  it("returns correct tier for vip user", async () => {
    const ctx = createAuthContext("vip");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.subscription.status();
    expect(result.tier).toBe("vip");
    expect(result.isAuthenticated).toBe(true);
  });
});

describe("subscription.checkout", () => {
  it("returns checkout URL for authenticated user", async () => {
    const ctx = createAuthContext("free");
    const caller = appRouter.createCaller(ctx);
    const result = await caller.subscription.checkout({ productKey: "premium" });
    expect(result.url).toBe("https://checkout.xendit.co/test-invoice");
  });

  it("throws for unauthenticated user", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);
    await expect(caller.subscription.checkout({ productKey: "premium" })).rejects.toThrow();
  });
});
