import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock the odoo module
vi.mock("./odoo", () => ({
  createOdooLead: vi.fn().mockResolvedValue({ success: true, leadId: 42 }),
}));

import { createOdooLead } from "./odoo";

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

const validLeadInput = {
  fullName: "John Doe",
  email: "john@example.com",
  phone: "+1234567890",
  country: "United States",
  budget: "$50,000 - $100,000",
  sector: "Restaurant & Cafe",
  notes: "Interested in Canggu area",
  source: "talk_to_expert",
  aiRecommendations: "Budget: $75,000\nROI: 15-25%",
};

describe("lead.create", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("creates a lead with valid input and returns success", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.lead.create(validLeadInput);

    expect(result.success).toBe(true);
    expect(result.message).toContain("Lead created successfully");
    expect(createOdooLead).toHaveBeenCalledWith(validLeadInput);
  });

  it("returns success even when Odoo fails (graceful degradation)", async () => {
    (createOdooLead as ReturnType<typeof vi.fn>).mockResolvedValueOnce({
      success: false,
      error: "Odoo CRM not configured",
    });

    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const result = await caller.lead.create(validLeadInput);

    expect(result.success).toBe(true);
    expect(result.message).toContain("follow up");
  });

  it("validates required fields", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.lead.create({
        ...validLeadInput,
        email: "not-an-email",
      })
    ).rejects.toThrow();
  });

  it("validates empty fullName", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    await expect(
      caller.lead.create({
        ...validLeadInput,
        fullName: "",
      })
    ).rejects.toThrow();
  });

  it("passes wizard results context to Odoo", async () => {
    const ctx = createPublicContext();
    const caller = appRouter.createCaller(ctx);

    const wizardInput = {
      ...validLeadInput,
      source: "investment_wizard",
      wizardResults: "Budget: $50K-100K\nSector: Villa Rental\nTotal CAPEX: $85,000",
    };

    await caller.lead.create(wizardInput);

    expect(createOdooLead).toHaveBeenCalledWith(wizardInput);
  });
});
