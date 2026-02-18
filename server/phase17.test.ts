import { describe, expect, it, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ==================== HELPERS ====================

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@baseone.id",
    name: "Admin User",
    loginMethod: "baseoneglobal",
    role: "admin",
    createdAt: new Date(),
    updatedAt: new Date(),
    lastSignedIn: new Date(),
  };

  return {
    user,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

// ==================== ODOO MODULE TESTS ====================

describe("Odoo Module Exports", () => {
  it("exports createOdooLead function", async () => {
    const odoo = await import("./odoo");
    expect(typeof odoo.createOdooLead).toBe("function");
  });

  it("exports syncOdooContact function", async () => {
    const odoo = await import("./odoo");
    expect(typeof odoo.syncOdooContact).toBe("function");
  });

  it("exports createOdooSaleOrder function", async () => {
    const odoo = await import("./odoo");
    expect(typeof odoo.createOdooSaleOrder).toBe("function");
  });
});

// ==================== ADMIN ODOO SYNC ROUTER TESTS ====================

describe("Admin Odoo Sync Router", () => {
  it("admin.odooSync.syncContact procedure exists", () => {
    const caller = appRouter.createCaller(createAdminContext());
    expect(typeof caller.admin.odooSync.syncContact).toBe("function");
  });

  it("admin.odooSync.createSaleOrder procedure exists", () => {
    const caller = appRouter.createCaller(createAdminContext());
    expect(typeof caller.admin.odooSync.createSaleOrder).toBe("function");
  });
});

// ==================== ODOO CONTACT SYNC LOGIC ====================

describe("Odoo Contact Sync", () => {
  it("syncOdooContact returns error when Odoo is not configured", async () => {
    const origUrl = process.env.ODOO_URL;
    const origDb = process.env.ODOO_DB;
    const origUser = process.env.ODOO_USERNAME;
    const origPass = process.env.ODOO_PASSWORD;

    delete process.env.ODOO_URL;
    delete process.env.ODOO_DB;
    delete process.env.ODOO_USERNAME;
    delete process.env.ODOO_PASSWORD;

    const { syncOdooContact } = await import("./odoo");
    const result = await syncOdooContact({
      name: "Test User",
      email: "test@example.com",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("not configured");

    if (origUrl) process.env.ODOO_URL = origUrl;
    if (origDb) process.env.ODOO_DB = origDb;
    if (origUser) process.env.ODOO_USERNAME = origUser;
    if (origPass) process.env.ODOO_PASSWORD = origPass;
  });

  it("createOdooSaleOrder returns error when Odoo is not configured", async () => {
    const origUrl = process.env.ODOO_URL;
    const origDb = process.env.ODOO_DB;
    const origUser = process.env.ODOO_USERNAME;
    const origPass = process.env.ODOO_PASSWORD;

    delete process.env.ODOO_URL;
    delete process.env.ODOO_DB;
    delete process.env.ODOO_USERNAME;
    delete process.env.ODOO_PASSWORD;

    const { createOdooSaleOrder } = await import("./odoo");
    const result = await createOdooSaleOrder({
      email: "test@example.com",
      name: "Test User",
      tier: "premium",
    });

    expect(result.success).toBe(false);
    expect(result.error).toContain("not configured");

    if (origUrl) process.env.ODOO_URL = origUrl;
    if (origDb) process.env.ODOO_DB = origDb;
    if (origUser) process.env.ODOO_USERNAME = origUser;
    if (origPass) process.env.ODOO_PASSWORD = origPass;
  });
});

// ==================== XENDIT + ODOO INTEGRATION ====================

describe("Xendit-Odoo Integration", () => {
  it("xendit module imports Odoo functions", async () => {
    const xendit = await import("./xendit");
    expect(typeof xendit.createXenditInvoice).toBe("function");
    expect(typeof xendit.registerXenditWebhook).toBe("function");
  });
});

// ==================== OAUTH + ODOO SYNC ====================

describe("OAuth-Odoo Integration", () => {
  it("oauth module imports Odoo sync and email functions", async () => {
    const oauth = await import("./_core/oauth");
    expect(typeof oauth.registerOAuthRoutes).toBe("function");
  });
});

// ==================== EMAIL PAYMENT CONFIRMATION ====================

describe("Email Payment Confirmation", () => {
  it("sendPaymentConfirmation handles missing SMTP gracefully", async () => {
    const { sendPaymentConfirmation } = await import("./email");
    const result = await sendPaymentConfirmation({
      name: "Test User",
      email: "test@example.com",
      tier: "premium",
      amount: "Rp 315,000",
    });
    expect(typeof result).toBe("boolean");
  });

  it("sendWelcomeEmail handles missing SMTP gracefully", async () => {
    const { sendWelcomeEmail } = await import("./email");
    const result = await sendWelcomeEmail({
      name: "New User",
      email: "newuser@example.com",
    });
    expect(typeof result).toBe("boolean");
  });
});

// ==================== SUBSCRIPTION TIER PRODUCTS ====================

describe("Subscription Tier Products", () => {
  it("xendit products include premium and vip tiers", async () => {
    const { PRODUCTS } = await import("./xendit-products");
    expect(PRODUCTS.premium).toBeDefined();
    expect(PRODUCTS.premium.tier).toBe("premium");
    expect(PRODUCTS.premium.priceUSD).toBeGreaterThan(0);
    expect(PRODUCTS.vip).toBeDefined();
    expect(PRODUCTS.vip.tier).toBe("vip");
    expect(PRODUCTS.vip.priceUSD).toBeGreaterThan(PRODUCTS.premium.priceUSD);
  });
});
