/**
 * Odoo CRM Pipeline Isolation Setup Script
 * 
 * Creates "VGR Operations" team and 7 custom stages.
 * Removes default Odoo stages from VGR team.
 * 
 * Run: node scripts/odoo-setup-crm.mjs
 */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;

if (!ODOO_URL || !ODOO_DB || !ODOO_USERNAME || !ODOO_PASSWORD) {
  console.error("Missing Odoo env vars (ODOO_URL, ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD)");
  process.exit(1);
}

async function odooRpc(method, params) {
  const res = await axios.post(`${ODOO_URL}/jsonrpc`, {
    jsonrpc: "2.0",
    method: "call",
    id: Date.now(),
    params,
  }, { headers: { "Content-Type": "application/json" }, timeout: 30000 });
  if (res.data.error) {
    throw new Error(res.data.error.data?.message || res.data.error.message || "Odoo RPC error");
  }
  return res.data.result;
}

async function authenticate() {
  const uid = await odooRpc("call", {
    service: "common",
    method: "authenticate",
    args: [ODOO_DB, ODOO_USERNAME, ODOO_PASSWORD, {}],
  });
  if (!uid || typeof uid !== "number") throw new Error("Auth failed");
  console.log(`✓ Authenticated as UID ${uid}`);
  return uid;
}

async function executeKw(uid, model, method, args, kwargs = {}) {
  return odooRpc("call", {
    service: "object",
    method: "execute_kw",
    args: [ODOO_DB, uid, ODOO_PASSWORD, model, method, args, kwargs],
  });
}

// VGR Operations custom stages
const VGR_STAGES = [
  { name: "KYC Check", sequence: 1, is_won: false, fold: false },
  { name: "Due Diligence", sequence: 2, is_won: false, fold: false },
  { name: "Contract Drafting", sequence: 3, is_won: false, fold: false },
  { name: "Waiting Signature", sequence: 4, is_won: false, fold: false },
  { name: "PT PMA Setup", sequence: 5, is_won: false, fold: false },
  { name: "KITAS Process", sequence: 6, is_won: false, fold: false },
  { name: "Completed", sequence: 7, is_won: true, fold: true },
];

// Default Odoo stages to remove from VGR team
const DEFAULT_STAGES = ["New", "Qualified", "Proposition", "Won"];

async function main() {
  const uid = await authenticate();

  // ============ STEP 1: Find or create "VGR Operations" team ============
  console.log("\n--- Step 1: VGR Operations Sales Team ---");
  let vgrTeamId;
  const existingTeams = await executeKw(uid, "crm.team", "search_read",
    [[["name", "=", "VGR Operations"]]],
    { fields: ["id", "name"], limit: 1 }
  );

  if (existingTeams && existingTeams.length > 0) {
    vgrTeamId = existingTeams[0].id;
    console.log(`✓ VGR Operations team already exists: ID ${vgrTeamId}`);
  } else {
    vgrTeamId = await executeKw(uid, "crm.team", "create", [{
      name: "VGR Operations",
      use_leads: true,
      use_opportunities: true,
    }]);
    console.log(`✓ VGR Operations team created: ID ${vgrTeamId}`);
  }

  // ============ STEP 2: Get all existing stages ============
  console.log("\n--- Step 2: Audit existing CRM stages ---");
  const allStages = await executeKw(uid, "crm.stage", "search_read",
    [[]],
    { fields: ["id", "name", "sequence", "is_won", "fold", "team_ids"] }
  );
  console.log(`Found ${allStages.length} existing stages:`);
  for (const s of allStages) {
    console.log(`  - [${s.id}] "${s.name}" seq=${s.sequence} is_won=${s.is_won} fold=${s.fold} teams=${JSON.stringify(s.team_ids)}`);
  }

  // ============ STEP 3: Remove default stages from VGR team ============
  console.log("\n--- Step 3: Remove default stages from VGR team ---");
  for (const defaultName of DEFAULT_STAGES) {
    const stage = allStages.find(s => s.name === defaultName);
    if (stage && stage.team_ids.includes(vgrTeamId)) {
      // Remove VGR team from this stage's team_ids using (3, id) command
      await executeKw(uid, "crm.stage", "write", [[stage.id], {
        team_ids: [[3, vgrTeamId, 0]], // (3, id, _) = unlink
      }]);
      console.log(`✓ Removed VGR team from default stage "${defaultName}" (ID ${stage.id})`);
    } else if (stage) {
      console.log(`  "${defaultName}" (ID ${stage.id}) — VGR team not linked, skipping`);
    } else {
      console.log(`  "${defaultName}" — not found, skipping`);
    }
  }

  // ============ STEP 4: Create or update VGR custom stages ============
  console.log("\n--- Step 4: Create/update VGR custom stages ---");
  for (const stageDef of VGR_STAGES) {
    const existing = allStages.find(s => s.name === stageDef.name);
    if (existing) {
      // Update existing stage: set sequence, is_won, fold, and link VGR team
      const updateVals = {
        sequence: stageDef.sequence,
        is_won: stageDef.is_won,
        fold: stageDef.fold,
      };
      // Add VGR team if not already linked
      if (!existing.team_ids.includes(vgrTeamId)) {
        updateVals.team_ids = [[4, vgrTeamId, 0]]; // (4, id, _) = link
      }
      await executeKw(uid, "crm.stage", "write", [[existing.id], updateVals]);
      console.log(`✓ Updated stage "${stageDef.name}" (ID ${existing.id}) — seq=${stageDef.sequence}, is_won=${stageDef.is_won}, fold=${stageDef.fold}`);
    } else {
      // Create new stage linked to VGR team
      const newId = await executeKw(uid, "crm.stage", "create", [{
        name: stageDef.name,
        sequence: stageDef.sequence,
        is_won: stageDef.is_won,
        fold: stageDef.fold,
        team_ids: [[4, vgrTeamId, 0]],
      }]);
      console.log(`✓ Created stage "${stageDef.name}" (ID ${newId}) — seq=${stageDef.sequence}`);
    }
  }

  // ============ STEP 5: Verify final state ============
  console.log("\n--- Step 5: Verify VGR stages ---");
  const vgrStages = await executeKw(uid, "crm.stage", "search_read",
    [[["team_ids", "in", [vgrTeamId]]]],
    { fields: ["id", "name", "sequence", "is_won", "fold"], order: "sequence asc" }
  );
  console.log(`VGR Operations team (ID ${vgrTeamId}) now has ${vgrStages.length} stages:`);
  for (const s of vgrStages) {
    console.log(`  ${s.sequence}. "${s.name}" (ID ${s.id}) is_won=${s.is_won} fold=${s.fold}`);
  }

  if (vgrStages.length === 7) {
    console.log("\n✅ CRM Pipeline Isolation COMPLETE — 7 stages configured for VGR Operations");
  } else {
    console.warn(`\n⚠️ Expected 7 stages but found ${vgrStages.length}. Please review manually.`);
  }

  return vgrTeamId;
}

main().catch(err => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
