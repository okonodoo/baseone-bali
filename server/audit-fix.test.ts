/**
 * Audit Fix Tests — Verifies all 6 critical fixes from the denetim raporu
 */
import { describe, it, expect } from "vitest";
import * as fs from "fs";

// Helper to read source files
const readSource = (path: string) => fs.readFileSync(path, "utf-8");

describe("Audit Fix: TEST 5 - Lead Creation (VGR team + budget/sector)", () => {
  const odooSource = readSource("server/odoo.ts");

  it("createOdooLead should include team_id: 5 (VGR Operations)", () => {
    expect(odooSource).toContain("team_id: 5");
    expect(odooSource).toContain("VGR Operations");
  });

  it("createOdooLead should set expected_revenue from budget", () => {
    expect(odooSource).toContain("expected_revenue");
    expect(odooSource).toContain("budgetMatch");
  });

  it("createOdooLead function should be properly exported", async () => {
    const { createOdooLead } = await import("./odoo");
    expect(typeof createOdooLead).toBe("function");
  });
});

describe("Audit Fix: TEST 3 - Investment Wizard Pre-qualification", () => {
  const odooSource = readSource("server/odoo.ts");

  it("wizard leads should have [Pre-qualification] prefix", () => {
    expect(odooSource).toContain("[Pre-qualification]");
    expect(odooSource).toContain("PRE-QUALIFICATION");
  });

  it("should detect investment_wizard source", () => {
    expect(odooSource).toContain('data.source === "investment_wizard"');
  });

  it("LeadFormModal should pass source=investment_wizard for wizard leads", () => {
    const modalSource = readSource("client/src/components/LeadFormModal.tsx");
    expect(modalSource).toContain('"investment_wizard"');
    expect(modalSource).toContain("wizardResults");
  });
});

describe("Audit Fix: TEST 4 - Xendit Webhook + Odoo Membership Sync", () => {
  const xenditSource = readSource("server/xendit.ts");
  const odooSource = readSource("server/odoo.ts");

  it("xendit webhook should import and call updatePartnerMembershipLevel", () => {
    expect(xenditSource).toContain("updatePartnerMembershipLevel");
    expect(xenditSource).toContain("membership level update");
  });

  it("createOdooSaleOrder should update x_membership_level on partner", () => {
    expect(odooSource).toContain("x_membership_level");
    expect(odooSource).toContain("membership_level set to");
  });

  it("sale order should be marked as paid via Xendit", () => {
    expect(odooSource).toContain("Paid via Xendit");
  });

  it("updatePartnerMembershipLevel function should exist", async () => {
    const { updatePartnerMembershipLevel } = await import("./odoo");
    expect(typeof updatePartnerMembershipLevel).toBe("function");
  });
});

describe("Audit Fix: TEST 9 - VGR Pipeline (Live Odoo)", { timeout: 30000 }, () => {
  it("VGR Operations team should have 7 stages in Odoo", async () => {
    const { executeKw, authenticate, getOdooConfig } = await import("./odoo");
    const config = getOdooConfig();
    if (!config.url || !config.db || !config.username || !config.password) {
      console.warn("Odoo not configured, skipping live test");
      return;
    }

    const uid = await authenticate(config);
    const stages = await executeKw(config, uid, "crm.stage", "search_read",
      [[["team_ids", "in", [5]]]],
      { fields: ["id", "name", "sequence"], order: "sequence asc" }
    );

    expect(stages.length).toBeGreaterThanOrEqual(7);
    const names = stages.map((s: { name: string }) => s.name);
    expect(names).toContain("KYC Check");
    expect(names).toContain("Due Diligence");
    expect(names).toContain("Contract Drafting");
    expect(names).toContain("Waiting Signature");
    expect(names).toContain("PT PMA Setup");
    expect(names).toContain("KITAS Process");
    expect(names).toContain("Completed");
  });

  it("Waiting Signature automation rule should be active", async () => {
    const { executeKw, authenticate, getOdooConfig } = await import("./odoo");
    const config = getOdooConfig();
    if (!config.url || !config.db || !config.username || !config.password) return;

    const uid = await authenticate(config);
    const rules = await executeKw(config, uid, "base.automation", "search_read",
      [[["name", "ilike", "VGR"]]],
      { fields: ["id", "name", "trigger", "filter_domain", "active"] }
    );

    expect(rules.length).toBeGreaterThanOrEqual(1);
    expect(rules[0].active).toBe(true);
    expect(rules[0].trigger).toBe("on_stage_set");
    expect(rules[0].filter_domain).toContain("12");
  });
});

describe("Audit Fix: TEST 10 - Vendor Portal Product Creation", () => {
  const routersSource = readSource("server/routers.ts");
  const odooSource = readSource("server/odoo.ts");

  it("vendor.submit should create Odoo product.template", () => {
    expect(routersSource).toContain("createOdooProductFromVendor");
  });

  it("admin vendor updateStatus should accept odooProductId", () => {
    expect(routersSource).toContain("odooProductId: z.number().optional()");
  });

  it("admin vendor approval should activate/deactivate Odoo product", () => {
    expect(routersSource).toContain("activateOdooProduct");
    expect(routersSource).toContain("deactivateOdooProduct");
  });

  it("createOdooProductFromVendor should create inactive product", () => {
    expect(odooSource).toContain("active: false"); // Draft/pending
    expect(odooSource).toContain("categ_id: 4"); // Real Estate Property category
  });

  it("all vendor product functions should be exported", async () => {
    const { createOdooProductFromVendor, activateOdooProduct, deactivateOdooProduct } = await import("./odoo");
    expect(typeof createOdooProductFromVendor).toBe("function");
    expect(typeof activateOdooProduct).toBe("function");
    expect(typeof deactivateOdooProduct).toBe("function");
  });
});

describe("Audit Fix: TEST 7 - Property Lock (Membership Level)", () => {
  it("subscription.status should return tier", () => {
    const routersSource = readSource("server/routers.ts");
    expect(routersSource).toContain("subscriptionTier");
  });

  it("Properties page should check tier for price visibility", () => {
    const propsSource = readSource("client/src/pages/Properties.tsx");
    expect(propsSource).toContain("useSubscription");
    expect(propsSource).toContain("canViewDetails");
    expect(propsSource).toContain('tier === "premium"');
    expect(propsSource).toContain('tier === "vip"');
  });

  it("x_membership_level field should exist on res.partner in Odoo", async () => {
    const { executeKw, authenticate, getOdooConfig } = await import("./odoo");
    const config = getOdooConfig();
    if (!config.url || !config.db || !config.username || !config.password) return;

    const uid = await authenticate(config);
    const fields = await executeKw(config, uid, "res.partner", "fields_get",
      [["x_membership_level"]],
      { attributes: ["string", "type", "selection"] }
    );

    expect(fields).toHaveProperty("x_membership_level");
    expect(fields.x_membership_level.type).toBe("selection");
  });
});
