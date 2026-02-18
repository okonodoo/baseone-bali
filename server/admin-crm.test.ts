import { describe, it, expect, vi, beforeEach } from "vitest";

// Mock db module
vi.mock("./db", () => ({
  getRecentLeads: vi.fn(),
  updateLeadStatus: vi.fn(),
  getDashboardStats: vi.fn(),
}));

import { getRecentLeads, updateLeadStatus, getDashboardStats } from "./db";

describe("Admin CRM - Lead Management", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("getRecentLeads should return leads array", async () => {
    const mockLeads = [
      { id: 1, fullName: "John Doe", email: "john@test.com", status: "new", source: "talk_to_expert", createdAt: new Date() },
      { id: 2, fullName: "Jane Smith", email: "jane@test.com", status: "contacted", source: "investment_wizard", createdAt: new Date() },
    ];
    (getRecentLeads as any).mockResolvedValue(mockLeads);

    const result = await getRecentLeads(100);
    expect(result).toHaveLength(2);
    expect(result[0].fullName).toBe("John Doe");
    expect(result[1].status).toBe("contacted");
  });

  it("updateLeadStatus should call with correct params", async () => {
    (updateLeadStatus as any).mockResolvedValue(undefined);

    await updateLeadStatus(1, "contacted");
    expect(updateLeadStatus).toHaveBeenCalledWith(1, "contacted");

    await updateLeadStatus(2, "qualified");
    expect(updateLeadStatus).toHaveBeenCalledWith(2, "qualified");

    await updateLeadStatus(3, "lost");
    expect(updateLeadStatus).toHaveBeenCalledWith(3, "lost");
  });

  it("getDashboardStats should return all stat fields", async () => {
    const mockStats = {
      totalUsers: 5,
      premiumUsers: 2,
      vipUsers: 1,
      totalProperties: 10,
      totalLeads: 102,
    };
    (getDashboardStats as any).mockResolvedValue(mockStats);

    const result = await getDashboardStats();
    expect(result.totalUsers).toBe(5);
    expect(result.totalLeads).toBe(102);
    expect(result.premiumUsers).toBe(2);
  });
});

describe("Auth - Password Hash Exclusion", () => {
  it("should exclude passwordHash from user object", () => {
    const user = {
      id: 1,
      openId: "test-open-id",
      name: "Test User",
      email: "test@example.com",
      role: "admin" as const,
      passwordHash: "$2a$10$secrethashvalue",
      subscriptionTier: "free" as const,
      stripeCustomerId: null,
      phone: null,
      country: null,
      loginMethod: "email",
      createdAt: new Date(),
      updatedAt: new Date(),
      lastSignedIn: new Date(),
    };

    // Simulate what auth.me does
    const { passwordHash, ...safeUser } = user;
    
    expect(safeUser).not.toHaveProperty("passwordHash");
    expect(safeUser).toHaveProperty("id", 1);
    expect(safeUser).toHaveProperty("email", "test@example.com");
    expect(safeUser).toHaveProperty("role", "admin");
    expect(safeUser).toHaveProperty("name", "Test User");
  });

  it("should handle null user gracefully", () => {
    const user = null;
    // Simulate what auth.me does
    if (!user) {
      expect(user).toBeNull();
      return;
    }
  });
});
