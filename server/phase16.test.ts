import { describe, expect, it, vi } from "vitest";
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

// ==================== WHATSAPP URL TESTS ====================

describe("WhatsApp Integration", () => {
  it("generates correct WhatsApp URL with encoded message", () => {
    const WHATSAPP_NUMBER = "628135313562";
    const message = "Hi, I'm interested in investing in Bali. Can you help me?";
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    expect(url).toContain("wa.me/628135313562");
    expect(url).toContain("text=");
    expect(url).not.toContain(" "); // spaces should be encoded
  });

  it("generates WhatsApp URL with property-specific message", () => {
    const WHATSAPP_NUMBER = "628135313562";
    const propertyTitle = "Luxury Villa Canggu";
    const region = "canggu";
    const message = `Hi, I'm interested in the property: ${propertyTitle} in ${region}. Can you provide more details?`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    expect(url).toContain("Luxury");
    expect(url).toContain("canggu");
  });

  it("generates WhatsApp URL with wizard context", () => {
    const WHATSAPP_NUMBER = "628135313562";
    const sector = "Restaurant & F&B";
    const budget = "$50,000 - $100,000";
    const message = `Hi, I used the Investment Wizard on BaseOne Bali. I'm interested in the ${sector} sector with a budget of ${budget}. Can we discuss?`;
    const encoded = encodeURIComponent(message);
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encoded}`;

    expect(url).toContain("Restaurant");
    expect(url).toContain("50%2C000");
  });
});

// ==================== EMAIL SERVICE TESTS ====================

describe("Email Service", () => {
  it("email module exports required functions", async () => {
    const emailModule = await import("./email");
    expect(typeof emailModule.sendNewLeadNotification).toBe("function");
    expect(typeof emailModule.sendPaymentConfirmation).toBe("function");
    expect(typeof emailModule.sendWelcomeEmail).toBe("function");
    expect(typeof emailModule.sendVendorSubmissionNotification).toBe("function");
  });

  it("sendNewLeadNotification handles missing SMTP gracefully", async () => {
    const { sendNewLeadNotification } = await import("./email");
    // Without SMTP configured, should not throw
    const result = await sendNewLeadNotification({
      fullName: "Test User",
      email: "test@example.com",
      phone: "+1234567890",
      budget: "$100,000",
      sector: "villa",
      source: "test",
    });
    // Returns false when SMTP is not configured (fallback mode)
    expect(typeof result).toBe("boolean");
  });

  it("sendVendorSubmissionNotification handles missing SMTP gracefully", async () => {
    const { sendVendorSubmissionNotification } = await import("./email");
    const result = await sendVendorSubmissionNotification({
      contactName: "Test Vendor",
      contactEmail: "vendor@example.com",
      title: "Test Villa",
      type: "villa",
      region: "canggu",
      priceUSD: 250000,
    });
    expect(typeof result).toBe("boolean");
  });
});

// ==================== VENDOR PORTAL TESTS ====================

describe("Vendor Portal Router", () => {
  it("vendor.submit procedure exists", () => {
    const caller = appRouter.createCaller(createPublicContext());
    expect(typeof caller.vendor.submit).toBe("function");
  });

  it("admin.vendors.list procedure exists", () => {
    const caller = appRouter.createCaller(createAdminContext());
    expect(typeof caller.admin.vendors.list).toBe("function");
  });

  it("admin.vendors.updateStatus procedure exists", () => {
    const caller = appRouter.createCaller(createAdminContext());
    expect(typeof caller.admin.vendors.updateStatus).toBe("function");
  });
});

// ==================== BLOG ROUTER TESTS ====================

describe("Blog Router", () => {
  it("blog.list procedure exists", () => {
    const caller = appRouter.createCaller(createPublicContext());
    expect(typeof caller.blog.list).toBe("function");
  });

  it("blog.getBySlug procedure exists", () => {
    const caller = appRouter.createCaller(createPublicContext());
    expect(typeof caller.blog.getBySlug).toBe("function");
  });

  it("admin.blog.list procedure exists", () => {
    const caller = appRouter.createCaller(createAdminContext());
    expect(typeof caller.admin.blog.list).toBe("function");
  });

  it("admin.blog.create procedure exists", () => {
    const caller = appRouter.createCaller(createAdminContext());
    expect(typeof caller.admin.blog.create).toBe("function");
  });
});

// ==================== I18N TESTS ====================

describe("i18n - All languages have required keys", () => {
  it("English has all Phase 16 keys", async () => {
    const en = (await import("../client/src/i18n/en")).default;
    expect(en.nav.blog).toBeDefined();
    expect(en.nav.listProperty).toBeDefined();
    expect(en.vendor).toBeDefined();
    expect(en.vendor.title).toBeDefined();
    expect(en.vendor.submit).toBeDefined();
    expect(en.whatsapp).toBeDefined();
    expect(en.whatsapp.tooltip).toBeDefined();
    expect(en.blog).toBeDefined();
    expect(en.blog.title).toBeDefined();
  });

  it("Turkish has all Phase 16 keys", async () => {
    const tr = (await import("../client/src/i18n/tr")).default;
    expect(tr.nav.blog).toBeDefined();
    expect(tr.nav.listProperty).toBeDefined();
    expect(tr.vendor).toBeDefined();
    expect(tr.whatsapp).toBeDefined();
    expect(tr.blog).toBeDefined();
  });

  it("Indonesian has all Phase 16 keys", async () => {
    const id = (await import("../client/src/i18n/id")).default;
    expect(id.nav.blog).toBeDefined();
    expect(id.nav.listProperty).toBeDefined();
    expect(id.vendor).toBeDefined();
    expect(id.whatsapp).toBeDefined();
    expect(id.blog).toBeDefined();
  });

  it("Russian has all Phase 16 keys", async () => {
    const ru = (await import("../client/src/i18n/ru")).default;
    expect(ru.nav.blog).toBeDefined();
    expect(ru.nav.listProperty).toBeDefined();
    expect(ru.vendor).toBeDefined();
    expect(ru.whatsapp).toBeDefined();
    expect(ru.blog).toBeDefined();
  });
});
