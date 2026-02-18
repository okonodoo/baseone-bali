/**
 * Xendit Integration Tests
 * Tests for xendit.ts and xendit-products.ts
 */
import { describe, it, expect, vi } from "vitest";
import { PRODUCTS, getXenditAmount, getDisplayPrice, getDisplayPriceUSD } from "./xendit-products";
import type { ProductDef } from "./xendit-products";

// ==================== PRODUCT DEFINITIONS ====================

describe("Xendit Products", () => {
  it("should export all required products", () => {
    expect(PRODUCTS).toHaveProperty("premium");
    expect(PRODUCTS).toHaveProperty("vip");
    expect(PRODUCTS).toHaveProperty("scoutingFee");
  });

  it("premium product has correct price", () => {
    expect(PRODUCTS.premium.priceUSD).toBe(19.90);
    expect(PRODUCTS.premium.tier).toBe("premium");
    expect(PRODUCTS.premium.displayPriceUSD).toBe("$19.90");
  });

  it("vip product has correct price", () => {
    expect(PRODUCTS.vip.priceUSD).toBe(200);
    expect(PRODUCTS.vip.tier).toBe("vip");
    expect(PRODUCTS.vip.displayPriceUSD).toBe("$200");
  });

  it("scoutingFee product has correct price", () => {
    expect(PRODUCTS.scoutingFee.priceUSD).toBe(500);
    expect(PRODUCTS.scoutingFee.tier).toBe("scouting");
    expect(PRODUCTS.scoutingFee.displayPriceUSD).toBe("$500");
  });
});

// ==================== AMOUNT CALCULATION ====================

describe("getXenditAmount", () => {
  it("converts USD to IDR correctly with given rate", () => {
    const rate = 15750;
    expect(getXenditAmount(PRODUCTS.premium, rate)).toBe(Math.round(19.90 * 15750));
    expect(getXenditAmount(PRODUCTS.vip, rate)).toBe(Math.round(200 * 15750));
    expect(getXenditAmount(PRODUCTS.scoutingFee, rate)).toBe(Math.round(500 * 15750));
  });

  it("uses default rate when none provided", () => {
    const amount = getXenditAmount(PRODUCTS.premium);
    expect(amount).toBe(Math.round(19.90 * 15750));
  });

  it("returns integer amounts (IDR is zero-decimal)", () => {
    const rate = 15823;
    for (const product of Object.values(PRODUCTS)) {
      const amount = getXenditAmount(product, rate);
      expect(Number.isInteger(amount)).toBe(true);
    }
  });

  it("handles various exchange rates", () => {
    const rates = [14000, 15000, 15750, 16000, 17000];
    for (const rate of rates) {
      const amount = getXenditAmount(PRODUCTS.vip, rate);
      expect(amount).toBe(Math.round(200 * rate));
      expect(amount).toBeGreaterThan(0);
    }
  });
});

// ==================== DISPLAY PRICE ====================

describe("getDisplayPrice (IDR)", () => {
  it("formats IDR prices with Rp prefix", () => {
    const rate = 15750;
    expect(getDisplayPrice(PRODUCTS.premium, rate)).toMatch(/^Rp /);
    expect(getDisplayPrice(PRODUCTS.vip, rate)).toMatch(/^Rp /);
    expect(getDisplayPrice(PRODUCTS.scoutingFee, rate)).toMatch(/^Rp /);
  });

  it("formats large IDR amounts with locale separators", () => {
    const rate = 15750;
    const vipDisplay = getDisplayPrice(PRODUCTS.vip, rate);
    // Rp 3.150.000 (id-ID locale)
    expect(vipDisplay).toContain("3");
    expect(vipDisplay).toContain("150");
    expect(vipDisplay).toContain("000");
  });
});

describe("getDisplayPriceUSD", () => {
  it("returns USD display price from product definition", () => {
    expect(getDisplayPriceUSD(PRODUCTS.premium)).toBe("$19.90");
    expect(getDisplayPriceUSD(PRODUCTS.vip)).toBe("$200");
    expect(getDisplayPriceUSD(PRODUCTS.scoutingFee)).toBe("$500");
  });
});

// ==================== XENDIT MODULE EXPORTS ====================

describe("Xendit module exports", () => {
  it("exports createXenditInvoice function", async () => {
    const xendit = await import("./xendit");
    expect(typeof xendit.createXenditInvoice).toBe("function");
  });

  it("exports registerXenditWebhook function", async () => {
    const xendit = await import("./xendit");
    expect(typeof xendit.registerXenditWebhook).toBe("function");
  });

  it("exports getExchangeRateInfo function", async () => {
    const xendit = await import("./xendit");
    expect(typeof xendit.getExchangeRateInfo).toBe("function");
  });
});

// ==================== XENDIT INVOICE CREATION ====================

describe("createXenditInvoice", () => {
  it("throws when XENDIT_SECRET_KEY is not set", async () => {
    const origKey = process.env.XENDIT_SECRET_KEY;
    delete process.env.XENDIT_SECRET_KEY;

    const { createXenditInvoice } = await import("./xendit");
    await expect(
      createXenditInvoice({
        productKey: "premium",
        userId: 1,
        userEmail: "test@example.com",
        userName: "Test User",
        origin: "https://baseone.id",
      })
    ).rejects.toThrow("Xendit not configured");

    if (origKey) process.env.XENDIT_SECRET_KEY = origKey;
  });

  it("throws for unknown product key", async () => {
    // Set a fake key to pass the first check
    const origKey = process.env.XENDIT_SECRET_KEY;
    process.env.XENDIT_SECRET_KEY = "xnd_development_test_key";

    const { createXenditInvoice } = await import("./xendit");
    await expect(
      createXenditInvoice({
        productKey: "nonexistent" as any,
        userId: 1,
        userEmail: "test@example.com",
        userName: "Test User",
        origin: "https://baseone.id",
      })
    ).rejects.toThrow("Unknown product");

    if (origKey) {
      process.env.XENDIT_SECRET_KEY = origKey;
    } else {
      delete process.env.XENDIT_SECRET_KEY;
    }
  });
});
