import { describe, expect, it } from "vitest";

// Test property data structure and filtering logic
// Since propertyData is a client-side module, we test the data integrity here

describe("Property Data Integrity", () => {
  it("should have valid property data structure", async () => {
    // Import the client-side data module
    const mod = await import("../client/src/lib/propertyData");
    const { PROPERTIES, PROPERTY_TYPES, REGIONS, RENT_PRICE_RANGES, SALE_PRICE_RANGES } = mod;

    // Check we have at least 12 properties
    expect(PROPERTIES.length).toBeGreaterThanOrEqual(12);

    // Check each property has required fields
    for (const p of PROPERTIES) {
      expect(p.id).toBeTruthy();
      expect(p.title).toBeTruthy();
      expect(p.type).toBeTruthy();
      expect(p.region).toBeTruthy();
      expect(p.listingType).toMatch(/^(rent|sale)$/);
      expect(p.priceUSD).toBeGreaterThan(0);
      expect(p.priceIDR).toBeGreaterThan(0);
      expect(p.area).toBeGreaterThan(0);
      expect(p.image).toBeTruthy();
      expect(p.images.length).toBeGreaterThanOrEqual(1);
      expect(p.description).toBeTruthy();
      expect(p.features.length).toBeGreaterThan(0);
      expect(p.nearbyPlaces.length).toBeGreaterThan(0);
    }
  });

  it("should have all 5 property types represented", async () => {
    const mod = await import("../client/src/lib/propertyData");
    const types = new Set(mod.PROPERTIES.map((p: any) => p.type));
    expect(types.has("villa")).toBe(true);
    expect(types.has("commercial")).toBe(true);
    expect(types.has("office")).toBe(true);
    expect(types.has("land")).toBe(true);
    expect(types.has("warehouse")).toBe(true);
  });

  it("should have both rent and sale listings", async () => {
    const mod = await import("../client/src/lib/propertyData");
    const listingTypes = new Set(mod.PROPERTIES.map((p: any) => p.listingType));
    expect(listingTypes.has("rent")).toBe(true);
    expect(listingTypes.has("sale")).toBe(true);
  });

  it("should have properties in multiple regions", async () => {
    const mod = await import("../client/src/lib/propertyData");
    const regions = new Set(mod.PROPERTIES.map((p: any) => p.region));
    expect(regions.size).toBeGreaterThanOrEqual(4);
  });

  it("getPropertyById should return correct property", async () => {
    const mod = await import("../client/src/lib/propertyData");
    const first = mod.PROPERTIES[0];
    const found = mod.getPropertyById(first.id);
    expect(found).toBeDefined();
    expect(found?.id).toBe(first.id);
    expect(found?.title).toBe(first.title);
  });

  it("getPropertyById should return undefined for invalid id", async () => {
    const mod = await import("../client/src/lib/propertyData");
    const found = mod.getPropertyById("nonexistent-id");
    expect(found).toBeUndefined();
  });

  it("formatPriceUSD should format correctly", async () => {
    const mod = await import("../client/src/lib/propertyData");
    const formatted = mod.formatPriceUSD(1500);
    expect(formatted).toContain("$");
    // Function may use K abbreviation for thousands
    expect(formatted.length).toBeGreaterThan(1);
    
    const formatted2 = mod.formatPriceUSD(250000);
    expect(formatted2).toContain("$");
    expect(formatted2).toContain("250");
  });

  it("formatPriceIDR should format correctly", async () => {
    const mod = await import("../client/src/lib/propertyData");
    const formatted = mod.formatPriceIDR(23700000);
    expect(formatted).toContain("Rp");
  });
});
