import 'dotenv/config';

const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;

async function jsonRpc(url, method, params) {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ jsonrpc: "2.0", method, params, id: Date.now() }),
  });
  const data = await res.json();
  if (data.error) throw new Error(JSON.stringify(data.error));
  return data.result;
}

async function authenticate() {
  const uid = await jsonRpc(`${ODOO_URL}/jsonrpc`, "call", {
    service: "common",
    method: "authenticate",
    args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
  });
  if (!uid || typeof uid !== "number") throw new Error("Auth failed");
  return uid;
}

async function executeKw(uid, model, method, args, kwargs = {}) {
  return jsonRpc(`${ODOO_URL}/jsonrpc`, "call", {
    service: "object",
    method: "execute_kw",
    args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs],
  });
}

async function main() {
  const uid = await authenticate();
  console.log("Authenticated as UID:", uid);

  // 1. Check ir.attachment fields
  console.log("\n=== ir.attachment key fields ===");
  const attFields = await executeKw(uid, "ir.attachment", "fields_get", [], { attributes: ["string", "type"] });
  const relevantAtt = ["name", "res_model", "res_id", "datas", "mimetype", "type", "file_size", "store_fname", "description"];
  for (const f of relevantAtt) {
    if (attFields[f]) console.log(`  ${f}: ${attFields[f].string} (${attFields[f].type})`);
  }

  // 2. Check mail.activity fields
  console.log("\n=== mail.activity key fields ===");
  const actFields = await executeKw(uid, "mail.activity", "fields_get", [], { attributes: ["string", "type"] });
  const relevantAct = ["res_model_id", "res_model", "res_id", "activity_type_id", "summary", "note", "user_id", "date_deadline"];
  for (const f of relevantAct) {
    if (actFields[f]) console.log(`  ${f}: ${actFields[f].string} (${actFields[f].type})`);
  }

  // 3. Check mail.activity.type for available activity types
  console.log("\n=== mail.activity.type (available types) ===");
  const actTypes = await executeKw(uid, "mail.activity.type", "search_read", [[]], { fields: ["id", "name", "res_model"], limit: 20 });
  for (const t of actTypes) {
    console.log(`  ID ${t.id}: ${t.name} (model: ${t.res_model || 'all'})`);
  }

  // 4. Get KYC Check stage ID
  console.log("\n=== VGR Stages ===");
  const stages = await executeKw(uid, "crm.stage", "search_read", [[["team_ids", "in", [5]]]], { fields: ["id", "name", "sequence"], order: "sequence asc" });
  for (const s of stages) {
    console.log(`  ID ${s.id}: ${s.name} (seq: ${s.sequence})`);
  }

  // 5. Check existing attachments on CRM leads
  console.log("\n=== Existing CRM lead attachments ===");
  const attachments = await executeKw(uid, "ir.attachment", "search_read", [[["res_model", "=", "crm.lead"]]], { fields: ["id", "name", "res_id", "mimetype", "file_size"], limit: 10 });
  console.log(`  Found ${attachments.length} attachments on CRM leads`);
  for (const a of attachments) {
    console.log(`  ID ${a.id}: ${a.name} (lead ${a.res_id}, ${a.mimetype}, ${a.file_size} bytes)`);
  }

  // 6. Check ir.model for crm.lead model ID (needed for mail.activity)
  console.log("\n=== ir.model for crm.lead ===");
  const models = await executeKw(uid, "ir.model", "search_read", [[["model", "=", "crm.lead"]]], { fields: ["id", "model", "name"] });
  console.log(`  Model ID: ${models[0]?.id}, Name: ${models[0]?.name}`);
}

main().catch(console.error);
