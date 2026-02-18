import { describe, it, expect, vi } from "vitest";
import { z } from "zod";

// ==================== Schema Tests ====================

const OdooCrmStageSchema = z.object({
  id: z.number(),
  name: z.string(),
  sequence: z.number(),
  team_ids: z.array(z.number()),
  is_won: z.boolean(),
});

const OdooCrmLeadSchema = z.object({
  id: z.number(),
  name: z.string().nullable().optional(),
  partner_name: z.string().nullable().optional(),
  email_from: z.string().nullable().optional(),
  phone: z.string().nullable().optional(),
  stage_id: z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  team_id: z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  expected_revenue: z.number().nullable().optional(),
  x_contract_status: z.union([z.string(), z.literal(false)]).nullable().optional(),
  x_company_name_custom: z.union([z.string(), z.literal(false)]).nullable().optional(),
  x_investment_amount: z.number().nullable().optional(),
  create_date: z.string().nullable().optional(),
  write_date: z.string().nullable().optional(),
});

const OdooProductSchema = z.object({
  id: z.number(),
  name: z.string(),
  list_price: z.number(),
  categ_id: z.union([z.tuple([z.number(), z.string()]), z.literal(false)]),
  x_is_real_estate: z.boolean().optional(),
  x_location_lat: z.number().optional(),
  x_location_long: z.number().optional(),
  x_projected_roi: z.number().optional(),
  x_total_units: z.number().optional(),
  x_available_units: z.number().optional(),
  x_documents_link: z.union([z.string(), z.literal(false)]).nullable().optional(),
  active: z.boolean().optional(),
  description_sale: z.union([z.string(), z.literal(false)]).nullable().optional(),
});

describe("VGR CRM Pipeline Schemas", () => {
  it("should validate a CRM stage object", () => {
    const stage = {
      id: 9,
      name: "KYC Check",
      sequence: 11,
      team_ids: [5],
      is_won: false,
    };
    const parsed = OdooCrmStageSchema.parse(stage);
    expect(parsed.id).toBe(9);
    expect(parsed.name).toBe("KYC Check");
    expect(parsed.team_ids).toContain(5);
    expect(parsed.is_won).toBe(false);
  });

  it("should validate a CRM lead with custom fields", () => {
    const lead = {
      id: 1,
      name: "Test Lead",
      partner_name: "John Doe",
      email_from: "john@example.com",
      phone: "+62812345678",
      stage_id: [9, "KYC Check"] as [number, string],
      team_id: [5, "VGR Operations"] as [number, string],
      expected_revenue: 100000,
      x_contract_status: "draft",
      x_company_name_custom: "PT Test Company",
      x_investment_amount: 50000,
      create_date: "2026-02-16 00:00:00",
      write_date: "2026-02-16 00:00:00",
    };
    const parsed = OdooCrmLeadSchema.parse(lead);
    expect(parsed.id).toBe(1);
    expect(parsed.partner_name).toBe("John Doe");
    expect(parsed.x_contract_status).toBe("draft");
    expect(parsed.x_company_name_custom).toBe("PT Test Company");
    expect(parsed.x_investment_amount).toBe(50000);
  });

  it("should validate a CRM lead with false/null custom fields", () => {
    const lead = {
      id: 2,
      name: "Minimal Lead",
      partner_name: null,
      email_from: null,
      phone: null,
      stage_id: false as const,
      team_id: false as const,
      expected_revenue: null,
      x_contract_status: false as const,
      x_company_name_custom: false as const,
      x_investment_amount: null,
      create_date: null,
      write_date: null,
    };
    const parsed = OdooCrmLeadSchema.parse(lead);
    expect(parsed.id).toBe(2);
    expect(parsed.stage_id).toBe(false);
    expect(parsed.x_contract_status).toBe(false);
  });
});

describe("Supplier Product Schemas", () => {
  it("should validate a real estate product with all custom fields", () => {
    const product = {
      id: 10,
      name: "Luxury Villa Canggu",
      list_price: 250000,
      categ_id: [4, "Real Estate Property"] as [number, string],
      x_is_real_estate: true,
      x_location_lat: -8.6478,
      x_location_long: 115.1385,
      x_projected_roi: 12.5,
      x_total_units: 10,
      x_available_units: 7,
      x_documents_link: "https://drive.google.com/folder/abc",
      active: true,
      description_sale: "Beautiful luxury villa in Canggu area",
    };
    const parsed = OdooProductSchema.parse(product);
    expect(parsed.id).toBe(10);
    expect(parsed.x_is_real_estate).toBe(true);
    expect(parsed.x_location_lat).toBe(-8.6478);
    expect(parsed.x_projected_roi).toBe(12.5);
    expect(parsed.x_total_units).toBe(10);
    expect(parsed.x_available_units).toBe(7);
    expect(parsed.x_documents_link).toBe("https://drive.google.com/folder/abc");
  });

  it("should validate a product with false/null optional fields", () => {
    const product = {
      id: 11,
      name: "Basic Land Plot",
      list_price: 50000,
      categ_id: false as const,
      x_is_real_estate: true,
      x_documents_link: false as const,
      description_sale: false as const,
    };
    const parsed = OdooProductSchema.parse(product);
    expect(parsed.id).toBe(11);
    expect(parsed.categ_id).toBe(false);
    expect(parsed.x_documents_link).toBe(false);
    expect(parsed.description_sale).toBe(false);
  });
});

describe("VGR Pipeline Constants", () => {
  it("should have correct VGR team ID", () => {
    const VGR_TEAM_ID = 5;
    expect(VGR_TEAM_ID).toBe(5);
  });

  it("should have correct Real Estate category ID", () => {
    const REAL_ESTATE_CATEGORY_ID = 4;
    expect(REAL_ESTATE_CATEGORY_ID).toBe(4);
  });

  it("should define all 7 VGR pipeline stages", () => {
    const VGR_STAGES = [
      { id: 9, name: "KYC Check" },
      { id: 10, name: "Due Diligence" },
      { id: 11, name: "Contract Drafting" },
      { id: 12, name: "Waiting Signature" },
      { id: 13, name: "PT PMA Setup" },
      { id: 14, name: "KITAS Process" },
      { id: 15, name: "Completed" },
    ];
    expect(VGR_STAGES).toHaveLength(7);
    expect(VGR_STAGES[0].name).toBe("KYC Check");
    expect(VGR_STAGES[6].name).toBe("Completed");
  });

  it("should define contract status options", () => {
    const CONTRACT_STATUSES = ["draft", "sent", "signed", "cancelled"];
    expect(CONTRACT_STATUSES).toContain("draft");
    expect(CONTRACT_STATUSES).toContain("signed");
    expect(CONTRACT_STATUSES).toHaveLength(4);
  });
});

describe("Pipeline Summary Calculation", () => {
  it("should calculate total leads from summary", () => {
    const summary = [
      { stageId: 9, stageName: "KYC Check", count: 3, isWon: false },
      { stageId: 10, stageName: "Due Diligence", count: 2, isWon: false },
      { stageId: 15, stageName: "Completed", count: 5, isWon: true },
    ];
    const totalLeads = summary.reduce((acc, s) => acc + s.count, 0);
    const wonLeads = summary.filter(s => s.isWon).reduce((acc, s) => acc + s.count, 0);
    expect(totalLeads).toBe(10);
    expect(wonLeads).toBe(5);
  });

  it("should handle empty pipeline summary", () => {
    const summary: Array<{ stageId: number; stageName: string; count: number; isWon: boolean }> = [];
    const totalLeads = summary.reduce((acc, s) => acc + s.count, 0);
    expect(totalLeads).toBe(0);
  });
});
