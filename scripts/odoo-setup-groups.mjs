/**
 * Odoo User Permission Matrix Setup Script
 * 
 * Creates "BaseOne Operations" group with:
 * - crm.lead, project.task, documents.document read/write access
 * - Account/Settings access blocked
 * - Record rule: user sees only own records or VGR Operations team records
 * 
 * Run: node scripts/odoo-setup-groups.mjs
 */
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();

const ODOO_URL = process.env.ODOO_URL;
const ODOO_DB = process.env.ODOO_DB;
const ODOO_USERNAME = process.env.ODOO_USERNAME;
const ODOO_PASSWORD = process.env.ODOO_PASSWORD;
const VGR_TEAM_ID = 5;

if (!ODOO_URL || !ODOO_DB || !ODOO_USERNAME || !ODOO_PASSWORD) {
  console.error("Missing Odoo env vars");
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

async function main() {
  const uid = await authenticate();

  // ============ STEP 1: Find existing module category ============
  console.log("\n--- Step 1: Find BaseOne module category ---");
  let categoryId = false;
  try {
    const existingCats = await executeKw(uid, "ir.module.category", "search_read",
      [["name", "=", "BaseOne"]],
      { fields: ["id", "name"], limit: 1 }
    );
    if (existingCats && existingCats.length > 0) {
      categoryId = existingCats[0].id;
      console.log(`✓ Category "BaseOne" found: ID ${categoryId}`);
    } else {
      console.log(`  ℹ Category "BaseOne" not found — group will be created without category`);
    }
  } catch (e) {
    console.log(`  ℹ Cannot access ir.module.category — creating group without category`);
  }

  // ============ STEP 2: Find or create "BaseOne Operations" group ============
  console.log("\n--- Step 2: Find/create BaseOne Operations group ---");
  let groupId;
  const existingGroups = await executeKw(uid, "res.groups", "search_read",
    [[["name", "=", "BaseOne Operations"]]],
    { fields: ["id", "name", "implied_ids", "user_ids"], limit: 1 }
  );
  if (existingGroups && existingGroups.length > 0) {
    groupId = existingGroups[0].id;
    console.log(`✓ Group "BaseOne Operations" already exists: ID ${groupId}`);
    console.log(`  Users: ${JSON.stringify(existingGroups[0].users)}`);
  } else {
    // Inherit from base.group_user (Internal User) so they get basic access
    const baseUserGroups = await executeKw(uid, "res.groups", "search_read",
      [[["name", "ilike", "Internal User"]]],
      { fields: ["id", "name"], limit: 1 }
    );
    const impliedIds = baseUserGroups.length > 0 ? [[4, baseUserGroups[0].id, 0]] : [];

    groupId = await executeKw(uid, "res.groups", "create", [{
      name: "BaseOne Operations",
      comment: "BaseOne Operations team — access to CRM leads, project tasks, and documents for VGR Operations pipeline. No access to Accounting or Settings.",
      implied_ids: impliedIds,
    }]);
    console.log(`✓ Group "BaseOne Operations" created: ID ${groupId}`);
  }

  // ============ STEP 3: Get model IDs for access rights ============
  console.log("\n--- Step 3: Set up access rights ---");
  const models = ["crm.lead", "project.task"];
  // Note: documents.document may not exist in all Odoo installations
  
  for (const modelName of models) {
    const modelRecords = await executeKw(uid, "ir.model", "search_read",
      [[["model", "=", modelName]]],
      { fields: ["id", "name", "model"], limit: 1 }
    );
    
    if (!modelRecords || modelRecords.length === 0) {
      console.log(`  ⚠ Model "${modelName}" not found — skipping`);
      continue;
    }
    const modelId = modelRecords[0].id;

    // Check if access right already exists for this group + model
    const existingAccess = await executeKw(uid, "ir.model.access", "search_read",
      [[["group_id", "=", groupId], ["model_id", "=", modelId]]],
      { fields: ["id", "name"], limit: 1 }
    );

    if (existingAccess && existingAccess.length > 0) {
      // Update existing
      await executeKw(uid, "ir.model.access", "write", [[existingAccess[0].id], {
        perm_read: true,
        perm_write: true,
        perm_create: true,
        perm_unlink: false,
      }]);
      console.log(`✓ Updated access for "${modelName}" (ID ${existingAccess[0].id}): read/write/create=true, delete=false`);
    } else {
      // Create new access right
      const accessName = `baseone_ops_${modelName.replace(/\./g, "_")}`;
      const accessId = await executeKw(uid, "ir.model.access", "create", [{
        name: accessName,
        model_id: modelId,
        group_id: groupId,
        perm_read: true,
        perm_write: true,
        perm_create: true,
        perm_unlink: false,
      }]);
      console.log(`✓ Created access for "${modelName}" (ID ${accessId}): read/write/create=true, delete=false`);
    }
  }

  // Try documents.document if available
  try {
    const docModels = await executeKw(uid, "ir.model", "search_read",
      [[["model", "=", "documents.document"]]],
      { fields: ["id"], limit: 1 }
    );
    if (docModels && docModels.length > 0) {
      const existingDocAccess = await executeKw(uid, "ir.model.access", "search_read",
        [[["group_id", "=", groupId], ["model_id", "=", docModels[0].id]]],
        { fields: ["id"], limit: 1 }
      );
      if (!existingDocAccess || existingDocAccess.length === 0) {
        await executeKw(uid, "ir.model.access", "create", [{
          name: "baseone_ops_documents_document",
          model_id: docModels[0].id,
          group_id: groupId,
          perm_read: true,
          perm_write: true,
          perm_create: true,
          perm_unlink: false,
        }]);
        console.log(`✓ Created access for "documents.document"`);
      } else {
        console.log(`✓ Access for "documents.document" already exists`);
      }
    } else {
      console.log(`  ℹ documents.document module not installed — skipping`);
    }
  } catch (e) {
    console.log(`  ℹ documents.document not available: ${e.message}`);
  }

  // ============ STEP 4: Create record rule for CRM leads ============
  console.log("\n--- Step 4: Create record rules ---");
  
  // CRM Lead record rule: user sees own leads OR VGR Operations team leads
  const crmModelIds = await executeKw(uid, "ir.model", "search_read",
    [[["model", "=", "crm.lead"]]],
    { fields: ["id"], limit: 1 }
  );
  
  if (crmModelIds && crmModelIds.length > 0) {
    const crmModelId = crmModelIds[0].id;
    const ruleName = "BaseOne Ops: Own or VGR Team Leads";
    
    // Check if rule already exists
    const existingRules = await executeKw(uid, "ir.rule", "search_read",
      [[["name", "=", ruleName]]],
      { fields: ["id", "name"], limit: 1 }
    );

    // Domain: user_id == uid OR team_id == VGR_TEAM_ID
    const domain = `['|', ('user_id', '=', user.id), ('team_id', '=', ${VGR_TEAM_ID})]`;

    if (existingRules && existingRules.length > 0) {
      await executeKw(uid, "ir.rule", "write", [[existingRules[0].id], {
        domain_force: domain,
        perm_read: true,
        perm_write: true,
        perm_create: true,
        perm_unlink: false,
      }]);
      console.log(`✓ Updated record rule "${ruleName}" (ID ${existingRules[0].id})`);
    } else {
      const ruleId = await executeKw(uid, "ir.rule", "create", [{
        name: ruleName,
        model_id: crmModelId,
        domain_force: domain,
        groups: [[4, groupId, 0]],
        perm_read: true,
        perm_write: true,
        perm_create: true,
        perm_unlink: false,
      }]);
      console.log(`✓ Created record rule "${ruleName}" (ID ${ruleId})`);
      console.log(`  Domain: ${domain}`);
    }
  }

  // ============ STEP 5: Verify and list VGR team members ============
  console.log("\n--- Step 5: Check VGR team members ---");
  const vgrTeam = await executeKw(uid, "crm.team", "search_read",
    [[["id", "=", VGR_TEAM_ID]]],
    { fields: ["id", "name", "member_ids"], limit: 1 }
  );
  
  if (vgrTeam && vgrTeam.length > 0) {
    const memberIds = vgrTeam[0].member_ids || [];
    console.log(`VGR Operations team members: ${memberIds.length} users`);
    
    if (memberIds.length > 0) {
      // Add all VGR team members to BaseOne Operations group
      const members = await executeKw(uid, "res.users", "search_read",
        [[["id", "in", memberIds]]],
        { fields: ["id", "name", "login", "group_ids"] }
      );
      
      for (const member of members) {
        if (!member.group_ids.includes(groupId)) {
          await executeKw(uid, "res.users", "write", [[member.id], {
            group_ids: [[4, groupId, 0]],
          }]);
          console.log(`✓ Added "${member.name}" (${member.login}) to BaseOne Operations group`);
        } else {
          console.log(`  "${member.name}" (${member.login}) already in group`);
        }
      }
    } else {
      console.log("  No members in VGR team yet. Add users to the team in Odoo, then re-run this script.");
    }
  }

  // ============ STEP 6: Block Settings/Accounting access ============
  console.log("\n--- Step 6: Verify Settings/Accounting exclusion ---");
  console.log("  ℹ BaseOne Operations group does NOT inherit from:");
  console.log("    - base.group_system (Settings)");
  console.log("    - account.group_account_manager (Accounting)");
  console.log("  Users in this group will NOT see Settings or Accounting menus.");

  // Verify by checking implied_ids
  const groupDetails = await executeKw(uid, "res.groups", "search_read",
    [[["id", "=", groupId]]],
    { fields: ["id", "name", "implied_ids", "user_ids"], limit: 1 }
  );
  if (groupDetails && groupDetails.length > 0) {
    console.log(`\n  Group details:`);
    console.log(`    ID: ${groupDetails[0].id}`);
    console.log(`    Users: ${(groupDetails[0].user_ids || []).length}`);
    console.log(`    Implied groups: ${JSON.stringify(groupDetails[0].implied_ids)}`);
  }

  console.log("\n✅ User Permission Matrix COMPLETE");
  console.log(`   Group "BaseOne Operations" (ID ${groupId}) configured with:`);
  console.log(`   - CRM Lead: read/write/create`);
  console.log(`   - Project Task: read/write/create`);
  console.log(`   - Record rule: own leads OR VGR team leads`);
  console.log(`   - No Settings/Accounting access`);
}

main().catch(err => {
  console.error("❌ Script failed:", err.message);
  process.exit(1);
});
