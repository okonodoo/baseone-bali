/**
 * Xendit Products & Prices Configuration
 * Centralized product definitions for BaseOne Bali subscription tiers
 * 
 * Strategy:
 *   - All prices defined in USD (base currency for international investors)
 *   - Xendit invoices are created in IDR (Indonesian Rupiah) — Xendit's primary currency
 *   - USD → IDR conversion uses Odoo's daily Bank Indonesia rate at checkout time
 * 
 * Xendit notes:
 *   - IDR is a zero-decimal currency (amount in Rupiah, no cents)
 *   - All Xendit invoices use IDR as the billing currency
 */

export interface ProductDef {
  name: string;
  description: string;
  priceUSD: number;       // Price in USD (e.g. 19.90)
  tier: string;
  displayPriceUSD: string;
}

export const PRODUCTS: Record<string, ProductDef> = {
  premium: {
    name: "BaseOne Bali — Premium Access",
    description: "Full AI Advisor reports, detailed CAPEX analysis, tax & regulation details, region comparisons",
    priceUSD: 19.90,
    tier: "premium",
    displayPriceUSD: "$19.90",
  },
  vip: {
    name: "BaseOne Bali — VIP Access",
    description: "Complete Investment Wizard, personalized analysis, expert consultation, priority CRM lead",
    priceUSD: 200,
    tier: "vip",
    displayPriceUSD: "$200",
  },
  scoutingFee: {
    name: "BaseOne Bali — Scouting Fee",
    description: "Professional on-ground scouting service: site visits, market analysis, and detailed investment report",
    priceUSD: 500,
    tier: "scouting",
    displayPriceUSD: "$500",
  },
};

export type ProductKey = keyof typeof PRODUCTS;
export type SubscriptionTier = "free" | "premium" | "vip";

/**
 * Get Xendit-ready price for a product in IDR.
 * Xendit invoices are always in IDR (zero-decimal currency).
 * Converts USD price to IDR using provided exchange rate.
 */
export function getXenditAmount(product: ProductDef, usdToIdrRate?: number): number {
  const rate = usdToIdrRate || 15750;
  return Math.round(product.priceUSD * rate);
}

/**
 * Get display price string in IDR for a product.
 */
export function getDisplayPrice(product: ProductDef, usdToIdrRate?: number): string {
  const rate = usdToIdrRate || 15750;
  const idrAmount = Math.round(product.priceUSD * rate);
  return `Rp ${idrAmount.toLocaleString("id-ID")}`;
}

/**
 * Get display price string in USD for a product.
 */
export function getDisplayPriceUSD(product: ProductDef): string {
  return product.displayPriceUSD;
}
