/**
 * Phase 19 Tests — Multi-Currency Checkout (USD/IDR) via Xendit
 */
import { describe, it, expect } from "vitest";
import { PRODUCTS, getXenditAmount, getDisplayPrice } from "./xendit-products";

describe("Phase 19: Multi-Currency Checkout (Xendit)", () => {
  // ==================== PRODUCT DEFINITIONS ====================
  describe("Product definitions", () => {
    it("all products have priceUSD defined", () => {
      for (const [key, product] of Object.entries(PRODUCTS)) {
        expect(product.priceUSD).toBeGreaterThan(0);
        expect(product.name).toBeTruthy();
        expect(product.description).toBeTruthy();
        expect(product.displayPriceUSD).toMatch(/^\$/);
      }
    });

    it("premium product is $19.90", () => {
      expect(PRODUCTS.premium.priceUSD).toBe(19.90);
    });

    it("vip product is $200", () => {
      expect(PRODUCTS.vip.priceUSD).toBe(200);
    });

    it("scoutingFee product is $500", () => {
      expect(PRODUCTS.scoutingFee.priceUSD).toBe(500);
    });
  });

  // ==================== XENDIT AMOUNT CALCULATION ====================
  describe("getXenditAmount", () => {
    it("IDR amounts use provided exchange rate", () => {
      const rate = 15750;
      expect(getXenditAmount(PRODUCTS.premium, rate)).toBe(Math.round(19.90 * 15750));
      expect(getXenditAmount(PRODUCTS.vip, rate)).toBe(Math.round(200 * 15750));
      expect(getXenditAmount(PRODUCTS.scoutingFee, rate)).toBe(Math.round(500 * 15750));
    });

    it("IDR uses default rate when none provided", () => {
      const premiumIDR = getXenditAmount(PRODUCTS.premium);
      expect(premiumIDR).toBe(Math.round(19.90 * 15750));
    });

    it("IDR amounts are integers (zero-decimal currency)", () => {
      const rate = 15823;
      for (const product of Object.values(PRODUCTS)) {
        const amount = getXenditAmount(product, rate);
        expect(Number.isInteger(amount)).toBe(true);
      }
    });
  });

  // ==================== DISPLAY PRICE ====================
  describe("getDisplayPrice", () => {
    it("IDR display prices start with Rp", () => {
      const rate = 15750;
      expect(getDisplayPrice(PRODUCTS.premium, rate)).toMatch(/^Rp /);
      expect(getDisplayPrice(PRODUCTS.vip, rate)).toMatch(/^Rp /);
      expect(getDisplayPrice(PRODUCTS.scoutingFee, rate)).toMatch(/^Rp /);
    });

    it("IDR display prices are formatted with locale separators", () => {
      const rate = 15750;
      const vipDisplay = getDisplayPrice(PRODUCTS.vip, rate);
      // Rp 3.150.000 or Rp 3,150,000 depending on locale
      expect(vipDisplay).toContain("3");
      expect(vipDisplay).toContain("150");
      expect(vipDisplay).toContain("000");
    });
  });

  // ==================== ODOO EXCHANGE RATE ====================
  describe("Odoo exchange rate module", () => {
    it("getUsdToIdrRate and convertUsdToIdr are exported from odoo.ts", async () => {
      const odoo = await import("./odoo");
      expect(typeof odoo.getUsdToIdrRate).toBe("function");
      expect(typeof odoo.convertUsdToIdr).toBe("function");
    });

    it("convertUsdToIdr returns idrAmount and rate", async () => {
      const odoo = await import("./odoo");
      const result = await odoo.convertUsdToIdr(100);
      expect(result).toHaveProperty("idrAmount");
      expect(result).toHaveProperty("rate");
      expect(result.idrAmount).toBeGreaterThan(0);
      expect(result.rate).toBeGreaterThan(10000);
    }, 35000);
  });

  // ==================== EXCHANGE RATE INFO ENDPOINT ====================
  describe("Exchange rate info endpoint", () => {
    it("getExchangeRateInfo returns rate info", async () => {
      const { getExchangeRateInfo } = await import("./xendit");
      const info = await getExchangeRateInfo();
      expect(info).toHaveProperty("usdToIdr");
      expect(info).toHaveProperty("source");
      expect(info).toHaveProperty("updatedAt");
      expect(info.usdToIdr).toBeGreaterThan(10000);
      expect(info.source).toContain("Odoo");
    }, 35000);
  });
});
