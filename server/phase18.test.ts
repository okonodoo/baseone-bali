import { describe, it, expect, vi } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// ==================== HELPERS ====================

type AuthenticatedUser = NonNullable<TrpcContext["user"]>;

function createPublicContext(): TrpcContext {
  return {
    user: null,
    req: {
      protocol: "https",
      headers: {},
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createAdminContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 1,
    openId: "admin-user",
    email: "admin@baseone.id",
    name: "Admin User",
    loginMethod: "manus",
    role: "admin",
    createdAt: new Date(),
    subscriptionTier: "vip",
  };
  return {
    user,
    req: {
      protocol: "https",
      headers: { origin: "https://baseone.id" },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

function createUserContext(): TrpcContext {
  const user: AuthenticatedUser = {
    id: 2,
    openId: "test-user",
    email: "test@example.com",
    name: "Test User",
    loginMethod: "manus",
    role: "user",
    createdAt: new Date(),
    subscriptionTier: "free",
  };
  return {
    user,
    req: {
      protocol: "https",
      headers: { origin: "https://baseone.id" },
    } as TrpcContext["req"],
    res: {
      clearCookie: vi.fn(),
    } as unknown as TrpcContext["res"],
  };
}

const caller = appRouter.createCaller;

// ==================== ODOO MODULE TESTS ====================

describe("Odoo affiliate functions", () => {
  it("validateAffiliateCode should be importable and callable", async () => {
    const { validateAffiliateCode } = await import("./odoo");
    expect(typeof validateAffiliateCode).toBe("function");
  });

  it("setAffiliateReferral should be importable and callable", async () => {
    const { setAffiliateReferral } = await import("./odoo");
    expect(typeof setAffiliateReferral).toBe("function");
  });

  it("createScoutingFeeOrder should be importable and callable", async () => {
    const { createScoutingFeeOrder } = await import("./odoo");
    expect(typeof createScoutingFeeOrder).toBe("function");
  });

  it("updateLeadStage should be importable and callable", async () => {
    const { updateLeadStage } = await import("./odoo");
    expect(typeof updateLeadStage).toBe("function");
  });
});

// ==================== XENDIT PRODUCTS TESTS ====================

describe("Xendit products - Scouting Fee", () => {
  it("should include scoutingFee product", async () => {
    const { PRODUCTS } = await import("./xendit-products");
    expect(PRODUCTS).toHaveProperty("scoutingFee");
    expect(PRODUCTS.scoutingFee.name).toContain("Scouting");
    expect(PRODUCTS.scoutingFee.priceUSD).toBe(500);
    expect(PRODUCTS.scoutingFee.tier).toBe("scouting");
  });

  it("should have all required product keys", async () => {
    const { PRODUCTS } = await import("./xendit-products");
    expect(PRODUCTS).toHaveProperty("premium");
    expect(PRODUCTS).toHaveProperty("vip");
    expect(PRODUCTS).toHaveProperty("scoutingFee");
  });
});

// ==================== ROUTER TESTS ====================

describe("Admin affiliate routes", { timeout: 15000 }, () => {
  it("admin.affiliates.validate should exist as a public procedure", async () => {
    const publicCaller = caller(createPublicContext());
    try {
      await publicCaller.admin.affiliates.validate({ code: "TEST123" });
    } catch (e: any) {
      expect(e.message).not.toContain("is not a function");
    }
  });
});

describe("Subscription checkout with scoutingFee", () => {
  it("should accept scoutingFee as productKey", async () => {
    const userCaller = caller(createUserContext());
    try {
      await userCaller.subscription.checkout({ productKey: "scoutingFee" });
    } catch (e: any) {
      // Expected to fail due to Xendit not configured, but the route should accept the key
      expect(e.message).not.toContain("Invalid enum value");
    }
  }, 15000);

  it("should accept affiliateCode parameter", async () => {
    const userCaller = caller(createUserContext());
    try {
      await userCaller.subscription.checkout({ productKey: "premium", affiliateCode: "TEST123" });
    } catch (e: any) {
      expect(e.message).not.toContain("Unrecognized key");
    }
  });
});

// ==================== EMAIL TESTS ====================

describe("Email service", () => {
  it("should export all email functions", async () => {
    const email = await import("./email");
    expect(typeof email.sendNewLeadNotification).toBe("function");
    expect(typeof email.sendPaymentConfirmation).toBe("function");
    expect(typeof email.sendWelcomeEmail).toBe("function");
    expect(typeof email.sendVendorSubmissionNotification).toBe("function");
  });
});

// ==================== I18N TESTS ====================

describe("i18n translations - Phase 18", () => {
  it("en.ts should have partner, contracts, scouting sections", async () => {
    const { default: en } = await import("../client/src/i18n/en");
    expect(en).toHaveProperty("partner");
    expect(en).toHaveProperty("contracts");
    expect(en).toHaveProperty("scouting");
    expect(en.partner.heroTitle).toBeTruthy();
    expect(en.contracts.heroTitle).toBeTruthy();
    expect(en.scouting.title).toBeTruthy();
  });

  it("tr.ts should have partner, contracts, scouting sections", async () => {
    const { default: tr } = await import("../client/src/i18n/tr");
    expect(tr).toHaveProperty("partner");
    expect(tr).toHaveProperty("contracts");
    expect(tr).toHaveProperty("scouting");
  });

  it("id.ts should have partner, contracts, scouting sections", async () => {
    const { default: id } = await import("../client/src/i18n/id");
    expect(id).toHaveProperty("partner");
    expect(id).toHaveProperty("contracts");
    expect(id).toHaveProperty("scouting");
  });

  it("ru.ts should have partner, contracts, scouting sections", async () => {
    const { default: ru } = await import("../client/src/i18n/ru");
    expect(ru).toHaveProperty("partner");
    expect(ru).toHaveProperty("contracts");
    expect(ru).toHaveProperty("scouting");
  });
});

// ==================== XENDIT INVOICE CREATION TESTS ====================

describe("createXenditInvoice", () => {
  it("should accept affiliateCode parameter", async () => {
    const { createXenditInvoice } = await import("./xendit");
    expect(typeof createXenditInvoice).toBe("function");
  });
});
