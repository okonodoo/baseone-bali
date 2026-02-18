/**
 * Email notification service.
 * Uses nodemailer SMTP when configured, falls back to console.log.
 */
import nodemailer from "nodemailer";

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = parseInt(process.env.SMTP_PORT || "587", 10);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const FROM_EMAIL = process.env.SMTP_FROM || "noreply@baseone.id";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "ozgur@telkonone.com";

let transporter: nodemailer.Transporter | null = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  console.log("[Email] SMTP configured:", SMTP_HOST);
} else {
  console.log("[Email] SMTP not configured, using console.log fallback");
}

const baseTemplate = (title: string, body: string) => `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width"></head>
<body style="margin:0;padding:0;background:#0a0a0b;font-family:'Segoe UI',Arial,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="text-align:center;margin-bottom:32px;">
      <span style="font-size:28px;font-weight:700;color:#ffffff;">Base<span style="color:#c5a059;">One</span> Bali</span>
    </div>
    <div style="background:#141416;border:1px solid #222;border-radius:16px;padding:32px;color:#e0dcd8;">
      <h2 style="color:#c5a059;margin-top:0;font-size:20px;">${title}</h2>
      ${body}
    </div>
    <div style="text-align:center;margin-top:24px;color:#6b6560;font-size:12px;">
      <p>BaseOne Bali — Your Gateway to Bali Investment</p>
      <p>Jl. Pantai Batu Bolong, Canggu, Bali 80361</p>
    </div>
  </div>
</body>
</html>`;

async function sendEmail(to: string, subject: string, html: string): Promise<boolean> {
  if (transporter) {
    try {
      await transporter.sendMail({ from: FROM_EMAIL, to, subject, html });
      console.log(`[Email] Sent to ${to}: ${subject}`);
      return true;
    } catch (err) {
      console.error("[Email] Failed to send:", err);
      return false;
    }
  } else {
    console.log(`[Email][Fallback] To: ${to} | Subject: ${subject}`);
    console.log(`[Email][Fallback] HTML preview: ${html.substring(0, 200)}...`);
    return false;
  }
}

export async function sendNewLeadNotification(lead: {
  fullName: string;
  email: string;
  phone?: string;
  budget?: string;
  sector?: string;
  source?: string;
  notes?: string;
}): Promise<boolean> {
  const body = `
    <p style="color:#a09a94;">A new lead has been submitted on BaseOne Bali:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#6b6560;width:120px;">Name</td><td style="padding:8px 0;color:#e0dcd8;font-weight:600;">${lead.fullName}</td></tr>
      <tr><td style="padding:8px 0;color:#6b6560;">Email</td><td style="padding:8px 0;color:#e0dcd8;">${lead.email}</td></tr>
      ${lead.phone ? `<tr><td style="padding:8px 0;color:#6b6560;">Phone</td><td style="padding:8px 0;color:#e0dcd8;">${lead.phone}</td></tr>` : ""}
      ${lead.budget ? `<tr><td style="padding:8px 0;color:#6b6560;">Budget</td><td style="padding:8px 0;color:#c5a059;font-weight:600;">${lead.budget}</td></tr>` : ""}
      ${lead.sector ? `<tr><td style="padding:8px 0;color:#6b6560;">Sector</td><td style="padding:8px 0;color:#e0dcd8;">${lead.sector}</td></tr>` : ""}
      ${lead.source ? `<tr><td style="padding:8px 0;color:#6b6560;">Source</td><td style="padding:8px 0;color:#e0dcd8;">${lead.source}</td></tr>` : ""}
    </table>
    ${lead.notes ? `<p style="color:#6b6560;font-size:13px;border-top:1px solid #222;padding-top:12px;">Notes: ${lead.notes}</p>` : ""}
    <a href="https://baseone.id/admin" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#c5a059;color:#0a0a0b;border-radius:8px;text-decoration:none;font-weight:600;">View in Admin Panel</a>
  `;
  return sendEmail(ADMIN_EMAIL, `New Lead: ${lead.fullName} — BaseOne Bali`, baseTemplate("New Lead Received", body));
}

export async function sendPaymentConfirmation(user: {
  name: string;
  email: string;
  tier: string;
  amount: string;
}): Promise<boolean> {
  const body = `
    <p style="color:#a09a94;">Thank you for your purchase, <strong style="color:#e0dcd8;">${user.name}</strong>!</p>
    <div style="background:#1a1a1d;border:1px solid #c5a059;border-radius:12px;padding:20px;margin:16px 0;text-align:center;">
      <p style="color:#c5a059;font-size:24px;font-weight:700;margin:0;">${user.tier.toUpperCase()}</p>
      <p style="color:#6b6560;margin:4px 0 0;">Plan Activated</p>
    </div>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#6b6560;">Amount Paid</td><td style="padding:8px 0;color:#c5a059;font-weight:600;">${user.amount}</td></tr>
      <tr><td style="padding:8px 0;color:#6b6560;">Plan</td><td style="padding:8px 0;color:#e0dcd8;">${user.tier}</td></tr>
    </table>
    <p style="color:#a09a94;">You now have full access to all ${user.tier} features. Explore your upgraded experience:</p>
    <a href="https://baseone.id/profile" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#c5a059;color:#0a0a0b;border-radius:8px;text-decoration:none;font-weight:600;">View Your Profile</a>
  `;
  return sendEmail(user.email, `Payment Confirmed — ${user.tier} Plan Activated`, baseTemplate("Payment Confirmed", body));
}

export async function sendWelcomeEmail(user: {
  name: string;
  email: string;
}): Promise<boolean> {
  const body = `
    <p style="color:#a09a94;">Welcome to <strong style="color:#c5a059;">BaseOne Bali</strong>, <strong style="color:#e0dcd8;">${user.name}</strong>!</p>
    <p style="color:#a09a94;">You've joined the premier platform for foreign investors looking to invest in Bali, Indonesia. Here's what you can do:</p>
    <ul style="color:#a09a94;padding-left:20px;">
      <li style="margin-bottom:8px;"><strong style="color:#e0dcd8;">AI Investment Advisor</strong> — Get personalized investment analysis based on your budget</li>
      <li style="margin-bottom:8px;"><strong style="color:#e0dcd8;">Investment Wizard</strong> — Explore sectors, regulations, and CAPEX estimates</li>
      <li style="margin-bottom:8px;"><strong style="color:#e0dcd8;">Property Listings</strong> — Browse premium real estate in Bali's top locations</li>
      <li style="margin-bottom:8px;"><strong style="color:#e0dcd8;">Expert Consultation</strong> — Connect with our team for personalized guidance</li>
    </ul>
    <a href="https://baseone.id" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#c5a059;color:#0a0a0b;border-radius:8px;text-decoration:none;font-weight:600;">Start Exploring</a>
  `;
  return sendEmail(user.email, "Welcome to BaseOne Bali — Your Investment Journey Begins", baseTemplate("Welcome to BaseOne Bali", body));
}

export async function sendVendorSubmissionNotification(vendor: {
  contactName: string;
  contactEmail: string;
  title: string;
  type: string;
  region: string;
  priceUSD: number;
}): Promise<boolean> {
  // Notify admin
  const adminBody = `
    <p style="color:#a09a94;">A new property listing has been submitted for review:</p>
    <table style="width:100%;border-collapse:collapse;margin:16px 0;">
      <tr><td style="padding:8px 0;color:#6b6560;width:120px;">Property</td><td style="padding:8px 0;color:#e0dcd8;font-weight:600;">${vendor.title}</td></tr>
      <tr><td style="padding:8px 0;color:#6b6560;">Type</td><td style="padding:8px 0;color:#e0dcd8;">${vendor.type}</td></tr>
      <tr><td style="padding:8px 0;color:#6b6560;">Region</td><td style="padding:8px 0;color:#e0dcd8;">${vendor.region}</td></tr>
      <tr><td style="padding:8px 0;color:#6b6560;">Price</td><td style="padding:8px 0;color:#c5a059;font-weight:600;">$${vendor.priceUSD.toLocaleString()}</td></tr>
      <tr><td style="padding:8px 0;color:#6b6560;">Submitted by</td><td style="padding:8px 0;color:#e0dcd8;">${vendor.contactName} (${vendor.contactEmail})</td></tr>
    </table>
    <a href="https://baseone.id/admin" style="display:inline-block;margin-top:16px;padding:12px 24px;background:#c5a059;color:#0a0a0b;border-radius:8px;text-decoration:none;font-weight:600;">Review in Admin Panel</a>
  `;
  await sendEmail(ADMIN_EMAIL, `New Vendor Submission: ${vendor.title}`, baseTemplate("New Property Submission", adminBody));

  // Notify vendor
  const vendorBody = `
    <p style="color:#a09a94;">Thank you for submitting your property, <strong style="color:#e0dcd8;">${vendor.contactName}</strong>!</p>
    <div style="background:#1a1a1d;border-radius:12px;padding:20px;margin:16px 0;">
      <p style="color:#e0dcd8;font-weight:600;margin:0 0 8px;">${vendor.title}</p>
      <p style="color:#6b6560;margin:0;">${vendor.type} • ${vendor.region} • $${vendor.priceUSD.toLocaleString()}</p>
    </div>
    <p style="color:#a09a94;">Our team will review your listing within 24 hours. Once approved, it will be visible to our network of international investors.</p>
    <p style="color:#6b6560;font-size:13px;">If you have any questions, contact us at invest@baseone.id</p>
  `;
  return sendEmail(vendor.contactEmail, "Property Submission Received — BaseOne Bali", baseTemplate("Submission Received", vendorBody));
}


/**
 * Send a KYC document request email to the customer.
 * Triggered when a lead enters the KYC Check stage.
 */
export async function sendDocumentRequestEmail(data: {
  name: string;
  email: string;
  leadId: number;
}): Promise<boolean> {
  const uploadUrl = `https://baseone.id/profile`;
  const body = `
    <p style="color:#a09a94;">Sayın <strong style="color:#e0dcd8;">${data.name}</strong>,</p>
    <p style="color:#a09a94;">Yatırım sürecinize başlamak için KYC (Müşterini Tanı) doğrulamasını tamamlamamız gerekmektedir.</p>
    <div style="background:#1a1a1d;border:1px solid #c5a059;border-radius:12px;padding:20px;margin:16px 0;">
      <p style="color:#c5a059;font-size:16px;font-weight:700;margin:0 0 8px;">Gerekli Belge: Pasaport</p>
      <p style="color:#6b6560;margin:0;">Lütfen pasaportunuzun ön yüzünün net bir fotoğrafını veya taranmış kopyasını yükleyin.</p>
    </div>
    <p style="color:#a09a94;">Aşağıdaki butona tıklayarak pasaportunuzu güvenli portalımıza yükleyebilirsiniz:</p>
    <a href="${uploadUrl}" style="display:inline-block;margin-top:16px;padding:14px 28px;background:#c5a059;color:#0a0a0b;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Pasaportunuzu Yükleyin</a>
    <p style="color:#6b6560;font-size:13px;margin-top:20px;">Bu belge yalnızca KYC doğrulaması amacıyla kullanılacak ve güvenli bir şekilde saklanacaktır.</p>
    <p style="color:#6b6560;font-size:13px;">Sorularınız için: invest@baseone.id</p>
  `;
  return sendEmail(data.email, "KYC Doğrulaması — Pasaport Yükleme Talebi | BaseOne Bali", baseTemplate("KYC Document Request", body));
}
