/**
 * Xendit Integration — Invoice Creation & Webhook Handler
 * 
 * Strategy:
 *   - All invoices created in IDR (Xendit's primary currency for Indonesia)
 *   - USD prices converted to IDR using Odoo's daily Bank Indonesia exchange rate
 *   - Xendit Invoice API provides hosted checkout page (redirect flow)
 *   - Webhook verifies x-callback-token header for security
 */
import { Xendit } from 'xendit-node';
import type { Express, Request, Response } from "express";
import { PRODUCTS, getXenditAmount, getDisplayPrice, type ProductKey } from "./xendit-products";
import { updateUserTier, getUserById } from "./db";
import { createOdooSaleOrder, createScoutingFeeOrder, updateAffiliateCommission, getUsdToIdrRate, updatePartnerMembershipLevel } from "./odoo";
import { sendPaymentConfirmation } from "./email";

let _xendit: Xendit | null = null;

function getXendit(): Xendit | null {
  if (!_xendit && process.env.XENDIT_SECRET_KEY) {
    _xendit = new Xendit({ secretKey: process.env.XENDIT_SECRET_KEY });
  }
  return _xendit;
}

/**
 * Create a Xendit Invoice for checkout.
 * Returns the hosted checkout URL where the user completes payment.
 */
export async function createXenditInvoice(opts: {
  productKey: ProductKey;
  userId: number;
  userEmail: string;
  userName: string;
  origin: string;
  affiliateCode?: string;
  userCountry?: string | null;
}) {
  const xendit = getXendit();
  if (!xendit) throw new Error("Xendit not configured — XENDIT_SECRET_KEY missing");

  const product = PRODUCTS[opts.productKey];
  if (!product) throw new Error(`Unknown product: ${opts.productKey}`);

  // Get exchange rate from Odoo (Bank Indonesia daily rate)
  const usdToIdrRate = await getUsdToIdrRate();
  console.log(`[Xendit] IDR checkout for ${opts.userEmail} — rate: 1 USD = ${usdToIdrRate} IDR`);

  const amountIDR = getXenditAmount(product, usdToIdrRate);
  const displayPrice = getDisplayPrice(product, usdToIdrRate);

  console.log(`[Xendit] Creating invoice: ${opts.productKey} → IDR ${amountIDR} (display: ${displayPrice})`);

  const externalId = `baseone-${opts.userId}-${opts.productKey}-${Date.now()}`;

  try {
    const invoice = await xendit.Invoice.createInvoice({
      data: {
        externalId,
        amount: amountIDR,
        payerEmail: opts.userEmail,
        description: `${product.name} — ${product.description}`,
        currency: "IDR",
        invoiceDuration: 86400, // 24 hours
        shouldSendEmail: true,
        successRedirectUrl: `${opts.origin}/payment-success?invoice_id=${externalId}`,
        failureRedirectUrl: `${opts.origin}/pricing?payment=failed`,
        items: [
          {
            name: product.name,
            quantity: 1,
            price: amountIDR,
          },
        ],
        metadata: {
          user_id: opts.userId.toString(),
          customer_email: opts.userEmail,
          customer_name: opts.userName,
          product_key: opts.productKey,
          tier: product.tier,
          display_price: displayPrice,
          exchange_rate: usdToIdrRate.toString(),
          ...(opts.affiliateCode ? { affiliate_code: opts.affiliateCode } : {}),
        },
      },
    });

    return {
      url: invoice.invoiceUrl,
      currency: "IDR",
      displayPrice,
    };
  } catch (xenditErr: unknown) {
    const msg = xenditErr instanceof Error ? xenditErr.message : String(xenditErr);
    console.error("[Xendit] Invoice creation failed:", msg);
    throw new Error("Payment system error. Please try again later or contact support.");
  }
}

/**
 * tRPC-callable: get current exchange rate info for frontend display.
 */
export async function getExchangeRateInfo(): Promise<{
  usdToIdr: number;
  source: string;
  updatedAt: string;
}> {
  const rate = await getUsdToIdrRate();
  return {
    usdToIdr: rate,
    source: "Odoo / Bank Indonesia",
    updatedAt: new Date().toISOString(),
  };
}

/**
 * Register Xendit webhook endpoint on Express app.
 * Xendit sends POST to /api/xendit-webhook with x-callback-token header.
 */
export function registerXenditWebhook(app: Express) {
  app.post(
    "/api/xendit-webhook",
    (req: Request, res: Response) => {
      const callbackToken = req.headers["x-callback-token"] as string | undefined;
      const expectedToken = process.env.XENDIT_WEBHOOK_TOKEN;

      // Verify webhook token
      if (!expectedToken) {
        console.warn("[Xendit Webhook] No XENDIT_WEBHOOK_TOKEN configured");
        return res.status(400).json({ error: "Webhook token not configured" });
      }

      if (callbackToken !== expectedToken) {
        console.error("[Xendit Webhook] Invalid callback token");
        return res.status(403).json({ error: "Invalid callback token" });
      }

      const body = req.body;
      console.log(`[Xendit Webhook] Received event: status=${body.status}, external_id=${body.external_id}`);

      // Process the webhook asynchronously
      handleXenditCallback(body).catch((err) => {
        console.error("[Xendit Webhook] Event handling error:", err);
      });

      // Respond immediately with 200
      res.json({ received: true });
    }
  );
}

/**
 * Handle Xendit invoice callback.
 * Xendit sends callbacks for: PAID, EXPIRED, PENDING.
 * We only act on PAID status.
 */
async function handleXenditCallback(body: {
  id: string;
  external_id: string;
  status: string;
  amount: number;
  payer_email?: string;
  paid_at?: string;
  payment_method?: string;
  payment_channel?: string;
  metadata?: Record<string, string>;
}) {
  const { status, external_id, metadata } = body;

  if (status !== "PAID") {
    console.log(`[Xendit Webhook] Ignoring non-PAID status: ${status} for ${external_id}`);
    return;
  }

  const userId = parseInt(metadata?.user_id || "0");
  const tier = metadata?.tier;
  const productKey = metadata?.product_key;
  const displayPrice = metadata?.display_price || "";
  const userEmail = metadata?.customer_email || body.payer_email || "";

  if (!userId) {
    console.warn("[Xendit Webhook] Missing user_id in metadata");
    return;
  }

  // Handle scouting fee separately
  if (productKey === "scoutingFee" || tier === "scouting") {
    console.log(`[Xendit Webhook] Scouting fee paid by user ${userId}`);
    const user = await getUserById(userId);
    if (user) {
      const userName = user.name || "Investor";
      const email = user.email || userEmail;
      createScoutingFeeOrder({
        email,
        name: userName,
      }).catch((e) => console.warn("[Xendit Webhook] Odoo scouting fee order failed:", e));
      if (email) {
        sendPaymentConfirmation({
          name: userName,
          email,
          tier: "scouting",
          amount: displayPrice || PRODUCTS.scoutingFee.displayPriceUSD,
        }).catch((e) => console.warn("[Xendit Webhook] Scouting fee email failed:", e));
      }
      const affiliateCode = metadata?.affiliate_code;
      if (affiliateCode) {
        updateAffiliateCommission(affiliateCode, 500).catch((e) => console.warn("[Xendit Webhook] Affiliate commission failed:", e));
      }
    }
    return;
  }

  if (!tier || (tier !== "premium" && tier !== "vip")) {
    console.warn("[Xendit Webhook] Unknown tier in metadata:", tier);
    return;
  }

  // Update user subscription tier
  await updateUserTier(userId, tier as "premium" | "vip");
  console.log(`[Xendit Webhook] User ${userId} upgraded to ${tier}`);

  // Get user info for Odoo sync and email
  const user = await getUserById(userId);
  if (user) {
    const userName = user.name || "Investor";
    const email = user.email || userEmail;

    if (email) {
      createOdooSaleOrder({
        email,
        name: userName,
        tier,
      }).catch((e) => console.warn("[Xendit Webhook] Odoo sale order failed:", e));

      // Update partner's membership_level in Odoo
      updatePartnerMembershipLevel(email, tier).catch((e) =>
        console.warn("[Xendit Webhook] Odoo membership level update failed:", e)
      );

      const product = PRODUCTS[tier as keyof typeof PRODUCTS];
      sendPaymentConfirmation({
        name: userName,
        email,
        tier,
        amount: displayPrice || product?.displayPriceUSD || tier,
      }).catch((e) => console.warn("[Xendit Webhook] Payment email failed:", e));
    }
  }

  // Handle affiliate commission
  const affiliateCode = metadata?.affiliate_code;
  if (affiliateCode) {
    const product = PRODUCTS[tier as keyof typeof PRODUCTS];
    const commissionUSD = product ? product.priceUSD : 0;
    updateAffiliateCommission(affiliateCode, commissionUSD).catch((e) =>
      console.warn("[Xendit Webhook] Affiliate commission failed:", e)
    );
  }
}
