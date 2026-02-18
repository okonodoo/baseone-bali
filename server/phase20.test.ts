/**
 * Phase 20 Tests: Form improvements, dynamic pricing, country select
 */
import { describe, it, expect } from "vitest";

describe("Phase 20: Form Improvements & Dynamic Pricing", () => {
  // CountrySelect component data
  describe("Country data structure", () => {
    it("should have proper country data with dialCode", async () => {
      const mod = await import("../client/src/components/CountrySelect");
      const { COUNTRIES } = mod;
      
      expect(COUNTRIES.length).toBeGreaterThan(20);
      
      const indonesia = COUNTRIES.find((c: any) => c.code === "ID");
      expect(indonesia).toBeDefined();
      expect(indonesia!.dialCode).toBe("+62");
      expect(indonesia!.name).toBe("Indonesia");
      expect(indonesia!.flag).toBeTruthy();
      
      const turkey = COUNTRIES.find((c: any) => c.code === "TR");
      expect(turkey).toBeDefined();
      expect(turkey!.dialCode).toBe("+90");
      
      for (const c of COUNTRIES) {
        expect(c.code).toBeTruthy();
        expect(c.name).toBeTruthy();
        expect(c.dialCode).toMatch(/^\+\d+$/);
        expect(c.flag).toBeTruthy();
      }
    });
  });

  // Dynamic pricing from Odoo
  describe("Odoo dynamic pricing", () => {
    it("should have getOdooPrices function", async () => {
      const mod = await import("./odoo");
      expect(typeof mod.getOdooPrices).toBe("function");
    });

    it("should have getUsdToIdrRate function", async () => {
      const mod = await import("./odoo");
      expect(typeof mod.getUsdToIdrRate).toBe("function");
    });
  });

  // Xendit products IDR currency
  describe("Xendit products with IDR currency", () => {
    it("should have getXenditAmount function", async () => {
      const mod = await import("./xendit-products");
      expect(typeof mod.getXenditAmount).toBe("function");
    });

    it("should have getDisplayPrice function", async () => {
      const mod = await import("./xendit-products");
      expect(typeof mod.getDisplayPrice).toBe("function");
    });

    it("should calculate correct IDR amounts for premium", async () => {
      const { getXenditAmount, PRODUCTS } = await import("./xendit-products");
      const premium = PRODUCTS["premium"];
      expect(premium).toBeDefined();
      const amount = getXenditAmount(premium, 15750);
      expect(amount).toBe(Math.round(19.90 * 15750));
    });

    it("should calculate correct IDR amounts for vip", async () => {
      const { getXenditAmount, PRODUCTS } = await import("./xendit-products");
      const vip = PRODUCTS["vip"];
      expect(vip).toBeDefined();
      const amount = getXenditAmount(vip, 15750);
      expect(amount).toBe(Math.round(200 * 15750));
    });

    it("should calculate IDR amounts for Indonesia users", async () => {
      const { getXenditAmount, PRODUCTS } = await import("./xendit-products");
      const premium = PRODUCTS["premium"];
      const amount = getXenditAmount(premium, 15750);
      expect(amount).toBeGreaterThan(100000);
    });

    it("should have scouting fee product", async () => {
      const { getXenditAmount, PRODUCTS } = await import("./xendit-products");
      const scouting = PRODUCTS["scoutingFee"];
      expect(scouting).toBeDefined();
      const amount = getXenditAmount(scouting, 15750);
      expect(amount).toBe(Math.round(500 * 15750));
    });
  });

  // i18n completeness for vendor section
  describe("i18n vendor section completeness", () => {
    it("should have contactCountry and selectCountry in all languages", async () => {
      const en = await import("../client/src/i18n/en");
      const tr = await import("../client/src/i18n/tr");
      const id = await import("../client/src/i18n/id");
      const ru = await import("../client/src/i18n/ru");

      for (const lang of [en.default, tr.default, id.default, ru.default]) {
        expect(lang.vendor.contactCountry).toBeTruthy();
        expect(lang.vendor.selectCountry).toBeTruthy();
        expect(lang.vendor.contactPhone).toBeTruthy();
      }
    });

    it("should have profile phonePlaceholder and selectCountry in all languages", async () => {
      const en = await import("../client/src/i18n/en");
      const tr = await import("../client/src/i18n/tr");
      const id = await import("../client/src/i18n/id");
      const ru = await import("../client/src/i18n/ru");

      for (const lang of [en.default, tr.default, id.default, ru.default]) {
        expect(lang.profile.phonePlaceholder).toBeTruthy();
        expect(lang.profile.selectCountry).toBeTruthy();
      }
    });
  });

  // Affiliate tracking in Odoo
  describe("Odoo affiliate functions", () => {
    it("should have setAffiliateReferral function", async () => {
      const mod = await import("./odoo");
      expect(typeof mod.setAffiliateReferral).toBe("function");
    });

    it("should have updateAffiliateCommission function", async () => {
      const mod = await import("./odoo");
      expect(typeof mod.updateAffiliateCommission).toBe("function");
    });

    it("should have updateLeadStage function", async () => {
      const mod = await import("./odoo");
      expect(typeof mod.updateLeadStage).toBe("function");
    });
  });
});
