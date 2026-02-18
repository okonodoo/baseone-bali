/**
 * Odoo Seed Script — Send sample data to Odoo CRM
 * Sends: 3 CRM Leads, 3 Contacts (res.partner), 3 Products (product.template)
 */
import axios from "axios";

const ODOO_URL = "https://pt-telkon-one-group.odoo.com";
const ODOO_DB = "pt-telkon-one-group";
const ODOO_USERNAME = "ozgur@telkonone.com";
const ODOO_PASSWORD = "52c4e12551319be0ccc0cdae8db08db2f110590e";

async function odooJsonRpc(url, method, params) {
  const response = await axios.post(
    url,
    { jsonrpc: "2.0", method: "call", id: Date.now(), params },
    { headers: { "Content-Type": "application/json" }, timeout: 60000 }
  );
  if (response.data.error) {
    const msg = response.data.error.data?.message || response.data.error.message || "Odoo RPC error";
    throw new Error(msg);
  }
  return response.data.result;
}

async function authenticate() {
  const uid = await odooJsonRpc(`${ODOO_URL}/jsonrpc`, "call", {
    service: "common",
    method: "authenticate",
    args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
  });
  if (!uid || typeof uid !== "number") throw new Error("Authentication failed");
  console.log(`✅ Authenticated with Odoo — UID: ${uid}`);
  return uid;
}

async function executeKw(uid, model, method, args, kwargs = {}) {
  return odooJsonRpc(`${ODOO_URL}/jsonrpc`, "call", {
    service: "object",
    method: "execute_kw",
    args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs],
  });
}

async function getCountryId(uid, countryName) {
  try {
    const ids = await executeKw(uid, "res.country", "search", [[["name", "ilike", countryName]]], { limit: 1 });
    return ids && ids.length > 0 ? ids[0] : false;
  } catch {
    return false;
  }
}

async function main() {
  console.log("🚀 Starting Odoo seed script...\n");

  const uid = await authenticate();

  // ==================== 1. CREATE CONTACTS (res.partner) ====================
  console.log("\n📇 Creating Contacts (res.partner)...");

  const contacts = [
    {
      name: "John Smith",
      email: "john@example.com",
      phone: "+61412345678",
      country: "Australia",
      comment: "BaseOne Bali - Potential villa investor. Budget: $150,000",
    },
    {
      name: "Maria Schmidt",
      email: "maria@example.com",
      phone: "+4915123456789",
      country: "Germany",
      comment: "BaseOne Bali - Restaurant & F&B investor. Budget: $75,000",
    },
    {
      name: "Dmitry Petrov",
      email: "dmitry@example.com",
      phone: "+79161234567",
      country: "Russian Federation",
      comment: "BaseOne Bali - Digital Agency investor. Budget: $40,000",
    },
  ];

  const contactIds = [];
  for (const contact of contacts) {
    const countryId = await getCountryId(uid, contact.country);
    const values = {
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
      comment: contact.comment,
      customer_rank: 1,
    };
    if (countryId) values.country_id = countryId;

    const id = await executeKw(uid, "res.partner", "create", [values]);
    contactIds.push(id);
    console.log(`  ✅ Contact created: ${contact.name} — ID: ${id}`);
  }

  // ==================== 2. CREATE CRM LEADS (crm.lead) ====================
  console.log("\n📋 Creating CRM Leads (crm.lead)...");

  const crmLeads = [
    {
      name: "John Smith - Villa Investment $150K",
      contact_name: "John Smith",
      email_from: "john@example.com",
      phone: "+61412345678",
      country: "Australia",
      description:
        "Source: AI Advisor\nBudget: $150,000\nSector: Villa Rental\nCountry: Australia\n\nInvestor interested in villa rental business in Bali. Explored options through BaseOne AI Investment Advisor.",
      expected_revenue: 150000,
      partner_id: contactIds[0],
    },
    {
      name: "Maria Schmidt - Restaurant Setup $75K",
      contact_name: "Maria Schmidt",
      email_from: "maria@example.com",
      phone: "+4915123456789",
      country: "Germany",
      description:
        "Source: Investment Wizard\nBudget: $75,000\nSector: Restaurant & F&B\nCountry: Germany\n\nInvestor interested in opening a restaurant/café in Bali. Completed Investment Wizard on BaseOne platform.",
      expected_revenue: 75000,
      partner_id: contactIds[1],
    },
    {
      name: "Dmitry Petrov - Digital Agency $40K",
      contact_name: "Dmitry Petrov",
      email_from: "dmitry@example.com",
      phone: "+79161234567",
      country: "Russian Federation",
      description:
        "Source: Website Contact\nBudget: $40,000\nSector: Digital Agency\nCountry: Russia\n\nInvestor interested in setting up a digital agency in Bali. Contacted through BaseOne website.",
      expected_revenue: 40000,
      partner_id: contactIds[2],
    },
  ];

  const leadIds = [];
  for (const lead of crmLeads) {
    const countryId = await getCountryId(uid, lead.country);
    const values = {
      name: lead.name,
      contact_name: lead.contact_name,
      email_from: lead.email_from,
      phone: lead.phone,
      description: lead.description,
      expected_revenue: lead.expected_revenue,
      type: "lead",
    };
    if (countryId) values.country_id = countryId;
    if (lead.partner_id) values.partner_id = lead.partner_id;

    const id = await executeKw(uid, "crm.lead", "create", [values]);
    leadIds.push(id);
    console.log(`  ✅ CRM Lead created: ${lead.name} — ID: ${id}`);
  }

  // ==================== 3. CREATE PRODUCTS (product.template) ====================
  console.log("\n🏠 Creating Products (product.template)...");

  const products = [
    {
      name: "Luxury Villa Canggu - 3BR",
      type: "service",
      list_price: 2500,
      description_sale:
        "Premium 3-bedroom luxury villa in Canggu, Bali. Fully furnished with private pool, garden, and modern amenities. Perfect for monthly rental investment. Located near Echo Beach.",
    },
    {
      name: "Commercial Space Seminyak - Restaurant Ready",
      type: "service",
      list_price: 1800,
      description_sale:
        "Prime commercial space in Seminyak, fully equipped for restaurant/café operation. High foot traffic area near Eat Street. Includes kitchen setup, seating area, and outdoor terrace.",
    },
    {
      name: "Office Space Denpasar - Co-working",
      type: "service",
      list_price: 800,
      description_sale:
        "Modern office space in Denpasar business district. Suitable for co-working or private office setup. Air-conditioned, fiber internet, meeting room access. Ideal for digital agencies.",
    },
  ];

  const productIds = [];
  for (const product of products) {
    const values = {
      name: product.name,
      type: product.type,
      list_price: product.list_price,
      description_sale: product.description_sale,
      sale_ok: true,
      purchase_ok: false,
    };

    const id = await executeKw(uid, "product.template", "create", [values]);
    productIds.push(id);
    console.log(`  ✅ Product created: ${product.name} — ID: ${id} (Price: $${product.list_price}/month)`);
  }

  // ==================== SUMMARY ====================
  console.log("\n" + "=".repeat(60));
  console.log("📊 SEED DATA SUMMARY");
  console.log("=".repeat(60));
  console.log(`\n📇 Contacts (res.partner): ${contactIds.join(", ")}`);
  console.log(`📋 CRM Leads (crm.lead): ${leadIds.join(", ")}`);
  console.log(`🏠 Products (product.template): ${productIds.join(", ")}`);
  console.log(`\n✅ All ${contactIds.length + leadIds.length + productIds.length} records created successfully!`);
}

main().catch((err) => {
  console.error("❌ Error:", err.message);
  process.exit(1);
});
