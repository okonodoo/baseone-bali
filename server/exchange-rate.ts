/**
 * Exchange Rate Service with Dual Sources
 * Primary: Odoo (4h cache)
 * Fallback: ExchangeRate-API (1h cache)
 */
import axios from "axios";
import { AXIOS_TIMEOUT_MS } from "../shared/const";

interface CachedRate {
  rate: number;
  fetchedAt: number;
  source: "odoo" | "external";
}

let _cachedRate: CachedRate | null = null;
const ODOO_CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours
const EXTERNAL_CACHE_TTL_MS = 1 * 60 * 60 * 1000; // 1 hour
const DEFAULT_USD_IDR_RATE = 15750; // Fallback rate

/**
 * Fetch USD/IDR rate from ExchangeRate-API (free tier)
 * API: https://api.exchangerate-api.com/v4/latest/USD
 */
async function fetchFromExchangeRateAPI(): Promise<number | null> {
  try {
    const response = await axios.get("https://api.exchangerate-api.com/v4/latest/USD", {
      timeout: AXIOS_TIMEOUT_MS,
    });

    const idrRate = response.data?.rates?.IDR;
    if (idrRate && typeof idrRate === "number" && idrRate > 0) {
      console.log(`[ExchangeRate-API] USD/IDR rate fetched: 1 USD = ${idrRate} IDR`);
      return idrRate;
    }

    console.warn("[ExchangeRate-API] Invalid response format");
    return null;
  } catch (error) {
    console.warn("[ExchangeRate-API] Failed to fetch rate:", error instanceof Error ? error.message : error);
    return null;
  }
}

/**
 * Fetch USD/IDR rate from Odoo (requires authentication)
 * Note: This is a placeholder. Actual implementation should use the odoo module's functions.
 * To avoid circular imports, the exchange rate fetching is handled directly in odoo.ts
 */
async function fetchFromOdoo(): Promise<number | null> {
  // This function is kept for documentation purposes.
  // The actual Odoo rate fetching is done in odoo.ts's getUsdToIdrRate function.
  return null;
}

/**
 * Get USD/IDR exchange rate with dual-source fallback
 * 1. Check cache (Odoo 4h, External 1h)
 * 2. Try Odoo API (primary)
 * 3. Try ExchangeRate-API (fallback)
 * 4. Return cached value or default
 */
export async function getUsdToIdrRate(): Promise<number> {
  // Return cached rate if still fresh
  if (_cachedRate) {
    const cacheTTL = _cachedRate.source === "odoo" ? ODOO_CACHE_TTL_MS : EXTERNAL_CACHE_TTL_MS;
    if (Date.now() - _cachedRate.fetchedAt < cacheTTL) {
      return _cachedRate.rate;
    }
  }

  // Try Odoo first (primary source)
  const odooRate = await fetchFromOdoo();
  if (odooRate !== null) {
    _cachedRate = { rate: odooRate, fetchedAt: Date.now(), source: "odoo" };
    return odooRate;
  }

  // Fallback to ExchangeRate-API
  const externalRate = await fetchFromExchangeRateAPI();
  if (externalRate !== null) {
    _cachedRate = { rate: externalRate, fetchedAt: Date.now(), source: "external" };
    console.log("[Exchange Rate] Using ExchangeRate-API as fallback (Odoo unavailable)");
    return externalRate;
  }

  // Return cached value if available
  if (_cachedRate) {
    console.warn("[Exchange Rate] Using cached rate (both sources unavailable)");
    return _cachedRate.rate;
  }

  // Last resort: return default
  console.error("[Exchange Rate] All sources failed, using default rate:", DEFAULT_USD_IDR_RATE);
  return DEFAULT_USD_IDR_RATE;
}

/**
 * Convert USD amount to IDR using dual-source exchange rate
 */
export async function convertUsdToIdr(usdAmount: number): Promise<{ idrAmount: number; rate: number }> {
  const rate = await getUsdToIdrRate();
  return { idrAmount: Math.round(usdAmount * rate), rate };
}

/**
 * Get current cache status (for monitoring/debugging)
 */
export function getCacheStatus(): {
  cached: boolean;
  source: "odoo" | "external" | null;
  rate: number | null;
  age: number | null;
} {
  if (!_cachedRate) {
    return { cached: false, source: null, rate: null, age: null };
  }

  return {
    cached: true,
    source: _cachedRate.source,
    rate: _cachedRate.rate,
    age: Date.now() - _cachedRate.fetchedAt,
  };
}

/**
 * Clear cache (for testing or manual refresh)
 */
export function clearCache(): void {
  _cachedRate = null;
  console.log("[Exchange Rate] Cache cleared");
}
