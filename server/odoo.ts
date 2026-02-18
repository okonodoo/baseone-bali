/**
 * Odoo CRM Integration — JSON-RPC API
 * Creates leads, contacts, and sale orders in Odoo CRM
 */
import axios from "axios";
import { AXIOS_TIMEOUT_MS } from "../shared/const";

interface OdooConfig {
  url: string;
  db: string;
  username: string;
  password: string;
}

export function getOdooConfig(): OdooConfig {
  return {
    url: process.env.ODOO_URL || "",
    db: process.env.ODOO_DB || "",
    username: process.env.ODOO_USERNAME || "",
    password: process.env.ODOO_PASSWORD || "",
  };
}

function isConfigured(config: OdooConfig): boolean {
  return !!(config.url && config.db && config.username && config.password);
}

async function odooJsonRpc(url: string, method: string, params: unknown) {
  const response = await axios.post(
    url,
    {
      jsonrpc: "2.0",
      method: "call",
      id: Date.now(),
      params,
    },
    {
      headers: { "Content-Type": "application/json" },
      timeout: AXIOS_TIMEOUT_MS,
    }
  );

  if (response.data.error) {
    throw new Error(response.data.error.data?.message || response.data.error.message || "Odoo RPC error");
  }
  return response.data.result;
}

export async function authenticate(config: OdooConfig): Promise<number> {
  const uid = await odooJsonRpc(`${config.url}/jsonrpc`, "call", {
    service: "common",
    method: "authenticate",
    args: [config.db, config.username, config.password, {}],
  });

  if (!uid || typeof uid !== "number") {
    throw new Error("Odoo authentication failed");
  }
  return uid;
}

export async function executeKw(
  config: OdooConfig,
  uid: number,
  model: string,
  method: string,
  args: unknown[],
  kwargs: Record<string, unknown> = {}
) {
  return odooJsonRpc(`${config.url}/jsonrpc`, "call", {
    service: "object",
    method: "execute_kw",
    args: [config.db, uid, config.password, model, method, args, kwargs],
  });
}

async function getCountryId(config: OdooConfig, uid: number, countryName: string): Promise<number | false> {
  try {
    const ids = await executeKw(config, uid, "res.country", "search", [[["name", "ilike", countryName]]], { limit: 1 });
    return ids && ids.length > 0 ? ids[0] : false;
  } catch {
    return false;
  }
}

// ==================== CURRENCY EXCHANGE RATE ====================

/**
 * Cache for USD/IDR exchange rate from Odoo.
 * Odoo fetches daily rates from Bank Indonesia.
 */
let _cachedRate: { rate: number; fetchedAt: number } | null = null;
const RATE_CACHE_TTL_MS = 4 * 60 * 60 * 1000; // 4 hours
const DEFAULT_USD_IDR_RATE = 15750; // Fallback rate

/**
 * Get the current USD → IDR exchange rate from Odoo's res.currency.rate model.
 * Returns the rate with caching (4h TTL).
 */
export async function getUsdToIdrRate(): Promise<number> {
  // Return cached rate if still fresh
  if (_cachedRate && (Date.now() - _cachedRate.fetchedAt) < RATE_CACHE_TTL_MS) {
    return _cachedRate.rate;
  }

  const config = getOdooConfig();
  if (!isConfigured(config)) {
    console.warn('[Odoo] Not configured — using default USD/IDR rate:', DEFAULT_USD_IDR_RATE);
    return DEFAULT_USD_IDR_RATE;
  }

  try {
    const uid = await authenticate(config);

    // Find USD currency ID
    const usdCurrencies = await executeKw(config, uid, 'res.currency', 'search_read',
      [[['name', '=', 'USD'], ['active', '=', true]]],
      { fields: ['id', 'name', 'rate'], limit: 1 }
    );

    if (usdCurrencies && usdCurrencies.length > 0) {
      // Odoo stores rate as: 1 company currency (IDR) = X foreign currency (USD)
      // So if rate = 0.0000634921 it means 1 IDR = 0.0000634921 USD
      // We need: 1 USD = ? IDR → which is 1 / rate
      const odooRate = usdCurrencies[0].rate;
      if (odooRate && odooRate > 0 && odooRate !== 1) {
        const usdToIdr = Math.round(1 / odooRate);
        // Sanity check: USD/IDR should be > 10000 (historically always above 10k)
        if (usdToIdr >= 10000) {
          _cachedRate = { rate: usdToIdr, fetchedAt: Date.now() };
          console.log(`[Odoo] USD/IDR rate fetched: 1 USD = ${usdToIdr} IDR (Odoo rate: ${odooRate})`);
          return usdToIdr;
        } else {
          console.warn(`[Odoo] Suspicious USD/IDR rate: ${usdToIdr} (Odoo rate: ${odooRate}), using default`);
        }
      } else {
        console.warn(`[Odoo] USD rate is ${odooRate} (default/unconfigured), using fallback rate`);
      }
    }

    // Fallback: try to get the latest rate record
    const usdIds = await executeKw(config, uid, 'res.currency', 'search',
      [[['name', '=', 'USD']]],
      { limit: 1 }
    );
    if (usdIds && usdIds.length > 0) {
      const rateRecords = await executeKw(config, uid, 'res.currency.rate', 'search_read',
        [[['currency_id', '=', usdIds[0]]]],
        { fields: ['rate', 'name'], order: 'name desc', limit: 1 }
      );
      if (rateRecords && rateRecords.length > 0 && rateRecords[0].rate > 0 && rateRecords[0].rate !== 1) {
        const usdToIdr = Math.round(1 / rateRecords[0].rate);
        if (usdToIdr >= 10000) {
          _cachedRate = { rate: usdToIdr, fetchedAt: Date.now() };
          console.log(`[Odoo] USD/IDR rate from rate records: 1 USD = ${usdToIdr} IDR`);
          return usdToIdr;
        }
      }
    }

    console.warn('[Odoo] Could not find USD rate, using default:', DEFAULT_USD_IDR_RATE);
    _cachedRate = { rate: DEFAULT_USD_IDR_RATE, fetchedAt: Date.now() };
    return DEFAULT_USD_IDR_RATE;
  } catch (error) {
    console.warn('[Odoo] Failed to fetch exchange rate:', error);
    return _cachedRate?.rate || DEFAULT_USD_IDR_RATE;
  }
}

/**
 * Convert USD amount to IDR using Odoo's exchange rate.
 */
export async function convertUsdToIdr(usdAmount: number): Promise<{ idrAmount: number; rate: number }> {
  const rate = await getUsdToIdrRate();
  return { idrAmount: Math.round(usdAmount * rate), rate };
}

// ==================== AFFILIATE TRACKING ====================

/**
 * Validate an affiliate code exists in Odoo and return partner info.
 */
export async function validateAffiliateCode(code: string): Promise<{ valid: boolean; partnerId?: number; name?: string; commissionRate?: number }> {
  const config = getOdooConfig();
  if (!isConfigured(config)) return { valid: false };

  try {
    const uid = await authenticate(config);
    const partners = await executeKw(config, uid, "res.partner", "search_read",
      [[['x_is_affiliate', '=', true], ['x_affiliate_code', '=', code]]],
      { fields: ['id', 'name', 'x_commission_rate'], limit: 1 }
    );
    if (partners && partners.length > 0) {
      return { valid: true, partnerId: partners[0].id, name: partners[0].name, commissionRate: partners[0].x_commission_rate };
    }
    return { valid: false };
  } catch (error) {
    console.warn('[Odoo] Affiliate validation error:', error);
    return { valid: false };
  }
}

/**
 * Add affiliate referral to a lead or contact in Odoo.
 */
export async function setAffiliateReferral(model: 'crm.lead' | 'res.partner', recordId: number, affiliateCode: string): Promise<void> {
  const config = getOdooConfig();
  if (!isConfigured(config)) return;

  try {
    const uid = await authenticate(config);
    await executeKw(config, uid, model, 'write', [[recordId], { x_referred_by: affiliateCode }]);
    console.log(`[Odoo] Set affiliate referral ${affiliateCode} on ${model} ID ${recordId}`);
  } catch (error) {
    console.warn('[Odoo] Failed to set affiliate referral:', error);
  }
}

/**
 * Update affiliate commission when a sale is made.
 */
export async function updateAffiliateCommission(affiliateCode: string, saleAmount: number): Promise<void> {
  const config = getOdooConfig();
  if (!isConfigured(config)) return;

  try {
    const uid = await authenticate(config);
    const partners = await executeKw(config, uid, 'res.partner', 'search_read',
      [[['x_is_affiliate', '=', true], ['x_affiliate_code', '=', affiliateCode]]],
      { fields: ['id', 'x_commission_rate', 'x_total_commission', 'x_pending_commission'], limit: 1 }
    );
    if (!partners || partners.length === 0) return;

    const partner = partners[0];
    const commission = saleAmount * (partner.x_commission_rate / 100);
    await executeKw(config, uid, 'res.partner', 'write', [[partner.id], {
      x_total_commission: (partner.x_total_commission || 0) + commission,
      x_pending_commission: (partner.x_pending_commission || 0) + commission,
    }]);
    console.log(`[Odoo] Updated affiliate ${affiliateCode} commission: +$${commission.toFixed(2)}`);
  } catch (error) {
    console.warn('[Odoo] Failed to update affiliate commission:', error);
  }
}

// ==================== SCOUTING FEE ====================

/**
 * Update a CRM lead stage in Odoo (e.g., to "Scouting Fee Paid").
 */
export async function updateLeadStage(leadId: number, stageName: string): Promise<{ success: boolean; error?: string }> {
  const config = getOdooConfig();
  if (!isConfigured(config)) return { success: false, error: 'Odoo not configured' };

  try {
    const uid = await authenticate(config);
    const stages = await executeKw(config, uid, 'crm.stage', 'search', [[['name', '=', stageName]]], { limit: 1 });
    if (!stages || stages.length === 0) return { success: false, error: `Stage '${stageName}' not found` };

    await executeKw(config, uid, 'crm.lead', 'write', [[leadId], { stage_id: stages[0] }]);
    console.log(`[Odoo] Lead ${leadId} moved to stage '${stageName}'`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Odoo] Failed to update lead stage:', message);
    return { success: false, error: message };
  }
}

/**
 * Create a scouting fee sale order in Odoo.
 */
export async function createScoutingFeeOrder(data: {
  email: string;
  name: string;
  leadId?: number;
}): Promise<{ success: boolean; orderId?: number; error?: string }> {
  const config = getOdooConfig();
  if (!isConfigured(config)) return { success: false, error: 'Odoo not configured' };

  try {
    const uid = await authenticate(config);

    // Find or create partner
    const partnerResult = await syncOdooContact({ name: data.name, email: data.email });
    if (!partnerResult.success || !partnerResult.partnerId) {
      throw new Error('Failed to find/create partner');
    }

    // Find scouting fee product
    const productId = await findOrCreateProduct(config, uid, 'Scouting Fee', 500);

    // Create sale order
    const orderId = await executeKw(config, uid, 'sale.order', 'create', [{
      partner_id: partnerResult.partnerId,
      order_line: [[0, 0, {
        product_id: productId,
        product_uom_qty: 1,
        price_unit: 500,
        name: 'Scouting Fee - Professional on-ground scouting service',
      }]],
    }]);

    // Confirm order
    try {
      await executeKw(config, uid, 'sale.order', 'action_confirm', [[orderId]]);
    } catch { /* ok */ }

    // Update lead stage if provided
    if (data.leadId) {
      await updateLeadStage(data.leadId, 'Scouting Fee Paid');
    }

    console.log(`[Odoo] Scouting fee order created: ID ${orderId}`);
    return { success: true, orderId: orderId as number };
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    console.error('[Odoo] Failed to create scouting fee order:', message);
    return { success: false, error: message };
  }
}

// ==================== DYNAMIC PRODUCT PRICING FROM ODOO ====================

/**
 * Cache for Odoo product prices.
 * Key: product name, Value: { priceUSD, updatedAt }
 */
let _productPriceCache: Map<string, { price: number; fetchedAt: number }> = new Map();
const PRICE_CACHE_TTL_MS = 2 * 60 * 60 * 1000; // 2 hours

/**
 * Fetch product price from Odoo by product name.
 * Returns the list_price from product.template.
 * Cached for 2 hours.
 */
export async function getOdooProductPrice(productName: string, fallbackPrice: number): Promise<number> {
  const cached = _productPriceCache.get(productName);
  if (cached && (Date.now() - cached.fetchedAt) < PRICE_CACHE_TTL_MS) {
    return cached.price;
  }

  const config = getOdooConfig();
  if (!isConfigured(config)) {
    console.warn(`[Odoo] Not configured — using fallback price for ${productName}: ${fallbackPrice}`);
    return fallbackPrice;
  }

  try {
    const uid = await authenticate(config);
    const products = await executeKw(config, uid, 'product.template', 'search_read',
      [[['name', 'ilike', productName]]],
      { fields: ['id', 'name', 'list_price'], limit: 1 }
    );

    if (products && products.length > 0) {
      const price = products[0].list_price;
      _productPriceCache.set(productName, { price, fetchedAt: Date.now() });
      console.log(`[Odoo] Product price fetched: ${productName} = ${price}`);
      return price;
    }

    console.warn(`[Odoo] Product not found: ${productName}, using fallback: ${fallbackPrice}`);
    return fallbackPrice;
  } catch (error) {
    console.warn(`[Odoo] Failed to fetch product price for ${productName}:`, error);
    return cached?.price || fallbackPrice;
  }
}

/**
 * Fetch all BaseOne product prices from Odoo.
 * Returns a map of product key -> price.
 */
export async function getOdooPrices(): Promise<Record<string, number>> {
  const config = getOdooConfig();
  if (!isConfigured(config)) {
    return {};
  }

  try {
    const uid = await authenticate(config);
    const products = await executeKw(config, uid, 'product.template', 'search_read',
      [[['name', 'ilike', 'BaseOne']]],
      { fields: ['id', 'name', 'list_price'] }
    );

    const prices: Record<string, number> = {};
    if (products && Array.isArray(products)) {
      for (const p of products) {
        // Map Odoo product names to our product keys
        if (p.name.includes('Premium')) prices.premium = p.list_price;
        else if (p.name.includes('VIP')) prices.vip = p.list_price;
        else if (p.name.includes('Scouting')) prices.scoutingFee = p.list_price;
      }
    }

    // Cache individual prices
    for (const [key, price] of Object.entries(prices)) {
      _productPriceCache.set(key, { price, fetchedAt: Date.now() });
    }

    console.log('[Odoo] All prices fetched:', prices);
    return prices;
  } catch (error) {
    console.warn('[Odoo] Failed to fetch all prices:', error);
    return {};
  }
}

/**
 * Fetch pricelist from Odoo (if configured).
 * Returns pricelist items with their rules.
 */
export async function getOdooPricelist(pricelistName?: string): Promise<Array<{ productName: string; price: number; minQty: number }>> {
  const config = getOdooConfig();
  if (!isConfigured(config)) return [];

  try {
    const uid = await authenticate(config);

    // Find pricelist
    const filter: unknown[] = pricelistName
      ? [['name', 'ilike', pricelistName]]
      : [['id', '>', 0]];
    const pricelists = await executeKw(config, uid, 'product.pricelist', 'search_read',
      [filter],
      { fields: ['id', 'name', 'item_ids'], limit: 5 }
    );

    if (!pricelists || pricelists.length === 0) return [];

    const items: Array<{ productName: string; price: number; minQty: number }> = [];

    for (const pl of pricelists) {
      if (pl.item_ids && pl.item_ids.length > 0) {
        const plItems = await executeKw(config, uid, 'product.pricelist.item', 'search_read',
          [[['id', 'in', pl.item_ids]]],
          { fields: ['product_tmpl_id', 'fixed_price', 'min_quantity', 'compute_price'] }
        );

        if (plItems && Array.isArray(plItems)) {
          for (const item of plItems) {
            items.push({
              productName: item.product_tmpl_id?.[1] || 'Unknown',
              price: item.fixed_price || 0,
              minQty: item.min_quantity || 1,
            });
          }
        }
      }
    }

    return items;
  } catch (error) {
    console.warn('[Odoo] Failed to fetch pricelist:', error);
    return [];
  }
}

/**
 * Clear the price cache — call this when you want to force refresh from Odoo.
 */
export function clearPriceCache(): void {
  _productPriceCache.clear();
  _cachedRate = null;
  console.log('[Odoo] Price and rate caches cleared');
}

// ==================== LEAD CREATION ====================

export interface LeadData {
  fullName: string;
  email: string;
  phone: string;
  country: string;
  budget: string;
  sector: string;
  notes?: string;
  source?: string;
  language?: string;
  aiRecommendations?: string;
  wizardResults?: string;
}

export async function createOdooLead(data: LeadData): Promise<{ success: boolean; leadId?: number; error?: string }> {
  const config = getOdooConfig();

  if (!isConfigured(config)) {
    console.warn("[Odoo] Not configured — skipping CRM lead creation. Lead data:", JSON.stringify(data));
    return { success: false, error: "Odoo CRM not configured" };
  }

  try {
    const uid = await authenticate(config);

    // Localized labels based on user's selected language
    const lang = data.language || "en";
    const labels: Record<string, Record<string, string>> = {
      en: { source: "Source", budget: "Budget", sector: "Sector", country: "Country", notes: "Notes", aiRec: "AI Recommendations", wizardRes: "Wizard Results", preQual: "PRE-QUALIFICATION: This lead completed the Investment Wizard and has been pre-qualified based on budget and sector selection." },
      tr: { source: "Kaynak", budget: "B\u00fct\u00e7e", sector: "Sekt\u00f6r", country: "\u00dclke", notes: "Notlar", aiRec: "AI \u00d6nerileri", wizardRes: "Sihirbaz Sonu\u00e7lar\u0131", preQual: "\u00d6N YETERL\u0130L\u0130K: Bu lead Yat\u0131r\u0131m Sihirbaz\u0131'n\u0131 tamamlad\u0131 ve b\u00fct\u00e7e ile sekt\u00f6r se\u00e7imine g\u00f6re \u00f6n yeterlilik ald\u0131." },
      id: { source: "Sumber", budget: "Anggaran", sector: "Sektor", country: "Negara", notes: "Catatan", aiRec: "Rekomendasi AI", wizardRes: "Hasil Wizard", preQual: "PRA-KUALIFIKASI: Lead ini menyelesaikan Wizard Investasi dan telah pra-kualifikasi berdasarkan anggaran dan pemilihan sektor." },
      ru: { source: "\u0418\u0441\u0442\u043e\u0447\u043d\u0438\u043a", budget: "\u0411\u044e\u0434\u0436\u0435\u0442", sector: "\u0421\u0435\u043a\u0442\u043e\u0440", country: "\u0421\u0442\u0440\u0430\u043d\u0430", notes: "\u0417\u0430\u043c\u0435\u0442\u043a\u0438", aiRec: "\u0420\u0435\u043a\u043e\u043c\u0435\u043d\u0434\u0430\u0446\u0438\u0438 AI", wizardRes: "\u0420\u0435\u0437\u0443\u043b\u044c\u0442\u0430\u0442\u044b \u041c\u0430\u0441\u0442\u0435\u0440\u0430", preQual: "\u041f\u0420\u0415\u0414\u0412\u0410\u0420\u0418\u0422\u0415\u041b\u042c\u041d\u0410\u042f \u041a\u0412\u0410\u041b\u0418\u0424\u0418\u041a\u0410\u0426\u0418\u042f: \u042d\u0442\u043e\u0442 \u043b\u0438\u0434 \u0437\u0430\u0432\u0435\u0440\u0448\u0438\u043b \u041c\u0430\u0441\u0442\u0435\u0440 \u0418\u043d\u0432\u0435\u0441\u0442\u0438\u0446\u0438\u0439 \u0438 \u043f\u0440\u043e\u0448\u0451\u043b \u043f\u0440\u0435\u0434\u0432\u0430\u0440\u0438\u0442\u0435\u043b\u044c\u043d\u0443\u044e \u043a\u0432\u0430\u043b\u0438\u0444\u0438\u043a\u0430\u0446\u0438\u044e." },
    };
    const l = labels[lang] || labels.en;

    const descriptionParts: string[] = [];
    descriptionParts.push(`${l.source}: ${data.source || "website"}`);
    descriptionParts.push(`${l.budget}: ${data.budget}`);
    descriptionParts.push(`${l.sector}: ${data.sector}`);
    descriptionParts.push(`${l.country}: ${data.country}`);
    if (data.notes) descriptionParts.push(`${l.notes}: ${data.notes}`);
    if (data.aiRecommendations) descriptionParts.push(`\n${l.aiRec}:\n${data.aiRecommendations}`);
    if (data.wizardResults) descriptionParts.push(`\n${l.wizardRes}:\n${data.wizardResults}`);

    // Determine lead name based on source
    const isWizardLead = data.source === "investment_wizard";
    const leadName = isWizardLead
      ? `[Pre-qualification] ${data.fullName} — ${data.sector} (${data.budget})`
      : `Bali Investment Lead — ${data.fullName} (${data.budget})`;

    // Add Pre-qualification note for wizard leads
    if (isWizardLead) {
      descriptionParts.unshift(`\u2B50 ${l.preQual}`);
    }

    const leadValues: Record<string, unknown> = {
      name: leadName,
      contact_name: data.fullName,
      email_from: data.email,
      phone: data.phone,
      description: descriptionParts.join("\n"),
      type: "lead",
      team_id: 5, // VGR Operations
    };

    // Set expected_revenue from budget string (extract numeric value)
    const budgetMatch = data.budget.match(/[\d,]+/);
    if (budgetMatch) {
      const numericBudget = parseInt(budgetMatch[0].replace(/,/g, ""), 10);
      if (!isNaN(numericBudget)) leadValues.expected_revenue = numericBudget;
    }

    if (data.country) {
      const countryId = await getCountryId(config, uid, data.country);
      if (countryId) leadValues.country_id = countryId;
    }

    const leadId = await executeKw(config, uid, "crm.lead", "create", [leadValues]);

    console.log(`[Odoo] Lead created successfully: ID ${leadId}`);
    return { success: true, leadId: leadId as number };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Odoo] Failed to create lead:", message);
    return { success: false, error: message };
  }
}

// ==================== CONTACT SYNC ====================

export interface ContactData {
  name: string;
  email: string;
  phone?: string;
  country?: string;
}

/**
 * Create or update a contact (res.partner) in Odoo.
 * Searches by email first to avoid duplicates.
 */
export async function syncOdooContact(data: ContactData): Promise<{ success: boolean; partnerId?: number; error?: string }> {
  const config = getOdooConfig();

  if (!isConfigured(config)) {
    console.warn("[Odoo] Not configured — skipping contact sync:", data.email);
    return { success: false, error: "Odoo not configured" };
  }

  try {
    const uid = await authenticate(config);

    // Check if contact already exists by email
    const existingIds = await executeKw(config, uid, "res.partner", "search", [[["email", "=", data.email]]], { limit: 1 });

    const values: Record<string, unknown> = {
      name: data.name,
      email: data.email,
      customer_rank: 1,
    };
    if (data.phone) values.phone = data.phone;
    if (data.country) {
      const countryId = await getCountryId(config, uid, data.country);
      if (countryId) values.country_id = countryId;
    }

    let partnerId: number;

    if (existingIds && existingIds.length > 0) {
      // Update existing contact
      partnerId = existingIds[0];
      await executeKw(config, uid, "res.partner", "write", [[partnerId], values]);
      console.log(`[Odoo] Contact updated: ${data.email} — ID ${partnerId}`);
    } else {
      // Create new contact
      values.comment = `Registered on BaseOne Bali platform`;
      const result = await executeKw(config, uid, "res.partner", "create", [[values]]);
      partnerId = Array.isArray(result) ? result[0] : result;
      console.log(`[Odoo] Contact created: ${data.email} — ID ${partnerId}`);
    }

    // Create portal user if not exists
    await createOdooPortalUser(config, uid, partnerId, data.email).catch((e) =>
      console.warn(`[Odoo] Failed to create portal user for ${data.email}:`, e)
    );

    return { success: true, partnerId };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Odoo] Failed to sync contact:", message);
    return { success: false, error: message };
  }
}

/**
 * Activate portal access for existing user.
 * Use this to grant portal access to users who were created before portal functionality was added.
 */
export async function activatePortalAccess(email: string): Promise<{ success: boolean; error?: string }> {
  const config = getOdooConfig();
  if (!isConfigured(config)) {
    return { success: false, error: "Odoo not configured" };
  }

  try {
    const uid = await authenticate(config);

    // Find partner by email
    const partners = await executeKw(config, uid, "res.partner", "search", [[["email", "=", email]]], { limit: 1 });
    if (!partners || partners.length === 0) {
      return { success: false, error: "Partner not found" };
    }

    const partnerId = partners[0];
    await createOdooPortalUser(config, uid, partnerId, email);

    return { success: true };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { success: false, error: message };
  }
}

/**
 * Create portal user in Odoo for customer self-service access.
 * This allows customers to login to Odoo portal and view their orders, invoices, etc.
 */
async function createOdooPortalUser(config: OdooConfig, uid: number, partnerId: number, email: string): Promise<void> {
  try {
    // Check if user already exists
    const existingUsers = await executeKw(config, uid, "res.users", "search", [[["login", "=", email]]], { limit: 1 });

    if (existingUsers && existingUsers.length > 0) {
      console.log(`[Odoo] Portal user already exists for ${email}`);
      return;
    }

    // Find portal group ID (base.group_portal)
    const portalGroups = await executeKw(config, uid, "res.groups", "search", [
      [["category_id.name", "=", "User types"], ["name", "=", "Portal"]]
    ], { limit: 1 });

    if (!portalGroups || portalGroups.length === 0) {
      console.warn("[Odoo] Portal group not found, trying alternative search");
      const altPortalGroups = await executeKw(config, uid, "res.groups", "search", [
        [["name", "ilike", "portal"]]
      ], { limit: 1 });

      if (!altPortalGroups || altPortalGroups.length === 0) {
        throw new Error("Portal group not found in Odoo");
      }
      portalGroups[0] = altPortalGroups[0];
    }

    const portalGroupId = portalGroups[0];

    // Generate a random password (user should reset via "Forgot Password")
    const tempPassword = Math.random().toString(36).substring(2, 12) + Math.random().toString(36).substring(2, 12);

    // Create portal user
    const userValues = {
      name: email.split('@')[0], // Use email prefix as name fallback
      login: email,
      email: email,
      partner_id: partnerId,
      groups_id: [[6, 0, [portalGroupId]]], // Set only portal group
      password: tempPassword,
      active: true,
    };

    await executeKw(config, uid, "res.users", "create", [[userValues]]);
    console.log(`[Odoo] Portal user created: ${email} (partner ID: ${partnerId})`);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error(`[Odoo] Failed to create portal user for ${email}:`, message);
    throw error;
  }
}

// ==================== SALE ORDER CREATION ====================

/**
 * Odoo membership product names — these must exist in Odoo as product.template records.
 * They are searched by name to find the product_id.
 */
const MEMBERSHIP_PRODUCTS: Record<string, { name: string; price: number }> = {
  premium: { name: "BaseOne Premium Membership", price: 315000 },
  vip: { name: "BaseOne VIP Membership", price: 3150000 },
};

/**
 * Find or create a product in Odoo by name.
 */
async function findOrCreateProduct(config: OdooConfig, uid: number, productName: string, price: number): Promise<number> {
  // Search for existing product
  const existingIds = await executeKw(config, uid, "product.product", "search", [[["name", "=", productName]]], { limit: 1 });
  if (existingIds && existingIds.length > 0) {
    return existingIds[0];
  }

  // Create product template (which auto-creates product.product)
  const templateId = await executeKw(config, uid, "product.template", "create", [{
    name: productName,
    type: "service",
    list_price: price,
    sale_ok: true,
    purchase_ok: false,
    description_sale: `BaseOne Bali ${productName}`,
  }]);

  // Get the product.product ID from the template
  const productIds = await executeKw(config, uid, "product.product", "search", [[["product_tmpl_id", "=", templateId]]], { limit: 1 });
  if (productIds && productIds.length > 0) {
    return productIds[0];
  }

  throw new Error(`Failed to find product.product for template ${templateId}`);
}

/**
 * Create a sale order in Odoo when a user subscribes to Premium or VIP.
 */
export async function createOdooSaleOrder(data: {
  email: string;
  name: string;
  tier: "premium" | "vip";
}): Promise<{ success: boolean; orderId?: number; error?: string }> {
  const config = getOdooConfig();

  if (!isConfigured(config)) {
    console.warn("[Odoo] Not configured — skipping sale order for:", data.email);
    return { success: false, error: "Odoo not configured" };
  }

  try {
    const uid = await authenticate(config);

    // Find or create the partner
    const partnerResult = await syncOdooContact({ name: data.name, email: data.email });
    if (!partnerResult.success || !partnerResult.partnerId) {
      throw new Error("Failed to find/create partner for sale order");
    }

    const membership = MEMBERSHIP_PRODUCTS[data.tier];
    if (!membership) {
      throw new Error(`Unknown membership tier: ${data.tier}`);
    }

    // Find or create the product
    const productId = await findOrCreateProduct(config, uid, membership.name, membership.price);

    // Create sale order
    const orderId = await executeKw(config, uid, "sale.order", "create", [{
      partner_id: partnerResult.partnerId,
      order_line: [[0, 0, {
        product_id: productId,
        product_uom_qty: 1,
        price_unit: membership.price,
        name: membership.name,
      }]],
    }]);

    // Confirm the sale order
    try {
      await executeKw(config, uid, "sale.order", "action_confirm", [[orderId]]);
      console.log(`[Odoo] Sale order confirmed: ID ${orderId} for ${data.email} (${data.tier})`);
    } catch (confirmErr) {
      console.warn(`[Odoo] Sale order created but confirmation failed: ID ${orderId}`, confirmErr);
    }

    // Mark sale order as paid by creating a payment
    try {
      // Use _get_invoiced to create invoice, then register payment
      // For simplicity, we tag the order note as "Paid via Xendit"
      await executeKw(config, uid, "sale.order", "write", [[orderId], {
        note: `Paid via Xendit — ${data.tier.toUpperCase()} membership`,
      }]);
      console.log(`[Odoo] Sale order ${orderId} marked as paid`);
    } catch (paidErr) {
      console.warn(`[Odoo] Could not mark sale order as paid:`, paidErr);
    }

    // Update partner's membership level
    try {
      await executeKw(config, uid, "res.partner", "write", [[partnerResult.partnerId], {
        x_membership_level: data.tier,
      }]);
      console.log(`[Odoo] Partner ${partnerResult.partnerId} membership_level set to ${data.tier}`);
    } catch (memberErr) {
      console.warn(`[Odoo] Could not update partner membership_level:`, memberErr);
    }

    return { success: true, orderId: orderId as number };
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Odoo] Failed to create sale order:", message);
    return { success: false, error: message };
  }
}

// ==================== MEMBERSHIP LEVEL SYNC ====================

/**
 * Update a partner's x_membership_level in Odoo.
 * Called after Stripe payment to sync membership status.
 */
export async function updatePartnerMembershipLevel(
  email: string,
  level: "free" | "premium" | "vip"
): Promise<{ success: boolean; partnerId?: number; error?: string }> {
  const config = getOdooConfig();
  if (!isConfigured(config)) {
    console.warn("[Odoo] Not configured — skipping membership level update for:", email);
    return { success: false, error: "Odoo not configured" };
  }

  try {
    const uid = await authenticate(config);
    const partners = await executeKw(config, uid, "res.partner", "search", [[["email", "=", email]]], { limit: 1 });
    if (!partners || partners.length === 0) {
      console.warn(`[Odoo] Partner not found for email: ${email}`);
      return { success: false, error: "Partner not found" };
    }

    const partnerId = partners[0];
    await executeKw(config, uid, "res.partner", "write", [[partnerId], {
      x_membership_level: level,
    }]);
    console.log(`[Odoo] Partner ${partnerId} (${email}) membership_level updated to ${level}`);
    return { success: true, partnerId };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Odoo] Failed to update partner membership level:", message);
    return { success: false, error: message };
  }
}

// ==================== VENDOR PRODUCT CREATION ====================

/**
 * Create a product.template in Odoo from a vendor submission.
 * Product is created as inactive (draft) until admin approves.
 */
export async function createOdooProductFromVendor(data: {
  title: string;
  description?: string;
  type: string;
  region: string;
  priceUSD: number;
  area: number;
  bedrooms?: number;
  bathrooms?: number;
  contactName: string;
  contactEmail: string;
}): Promise<{ success: boolean; productId?: number; error?: string }> {
  const config = getOdooConfig();
  if (!isConfigured(config)) {
    console.warn("[Odoo] Not configured — skipping vendor product creation");
    return { success: false, error: "Odoo not configured" };
  }

  try {
    const uid = await authenticate(config);

    const vals: Record<string, unknown> = {
      name: data.title,
      type: "service",
      list_price: data.priceUSD,
      categ_id: 4, // Real Estate Property category
      x_is_real_estate: true,
      active: false, // Draft/pending — admin must activate
      description_sale: [
        data.description || "",
        `Type: ${data.type}`,
        `Region: ${data.region}`,
        `Area: ${data.area}m²`,
        data.bedrooms ? `Bedrooms: ${data.bedrooms}` : "",
        data.bathrooms ? `Bathrooms: ${data.bathrooms}` : "",
        `Contact: ${data.contactName} (${data.contactEmail})`,
      ].filter(Boolean).join("\n"),
    };

    const result = await executeKw(config, uid, "product.template", "create", [[vals]]);
    const productId = Array.isArray(result) ? result[0] : result;
    console.log(`[Odoo] Vendor product created (inactive/draft): ID ${productId} — ${data.title}`);
    return { success: true, productId: productId as number };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Odoo] Failed to create vendor product:", message);
    return { success: false, error: message };
  }
}

/**
 * Activate (approve) a product.template in Odoo.
 */
export async function activateOdooProduct(productId: number): Promise<{ success: boolean; error?: string }> {
  const config = getOdooConfig();
  if (!isConfigured(config)) return { success: false, error: "Odoo not configured" };

  try {
    const uid = await authenticate(config);
    await executeKw(config, uid, "product.template", "write", [[productId], { active: true }]);
    console.log(`[Odoo] Product ${productId} activated (approved)`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Odoo] Failed to activate product:", message);
    return { success: false, error: message };
  }
}

/**
 * Deactivate (reject) a product.template in Odoo.
 */
export async function deactivateOdooProduct(productId: number): Promise<{ success: boolean; error?: string }> {
  const config = getOdooConfig();
  if (!isConfigured(config)) return { success: false, error: "Odoo not configured" };

  try {
    const uid = await authenticate(config);
    await executeKw(config, uid, "product.template", "write", [[productId], { active: false }]);
    console.log(`[Odoo] Product ${productId} deactivated (rejected)`);
    return { success: true };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("[Odoo] Failed to deactivate product:", message);
    return { success: false, error: message };
  }
}
