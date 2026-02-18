#!/usr/bin/env node
/**
 * Activate Odoo portal access for all existing users
 */

import { activatePortalAccess } from '../server/odoo.ts';
import { getAllUsers } from '../server/db.ts';

async function main() {
  console.log('[Portal Activation] Starting...\n');

  try {
    // Get all users from database
    const users = await getAllUsers();
    console.log(`[Portal Activation] Found ${users.length} users in database\n`);

    let successCount = 0;
    let skipCount = 0;
    let errorCount = 0;

    for (const user of users) {
      if (!user.email) {
        console.log(`[Skip] User ${user.name} has no email`);
        skipCount++;
        continue;
      }

      console.log(`[Processing] ${user.email}...`);
      const result = await activatePortalAccess(user.email);

      if (result.success) {
        console.log(`✓ Portal access activated for ${user.email}\n`);
        successCount++;
      } else {
        console.log(`✗ Failed for ${user.email}: ${result.error}\n`);
        errorCount++;
      }

      // Add small delay to avoid overwhelming Odoo
      await new Promise(resolve => setTimeout(resolve, 500));
    }

    console.log('\n[Portal Activation] Summary:');
    console.log(`  ✓ Success: ${successCount}`);
    console.log(`  - Skipped: ${skipCount}`);
    console.log(`  ✗ Errors: ${errorCount}`);
    console.log(`  Total: ${users.length}`);
  } catch (error) {
    console.error('[Portal Activation] Fatal error:', error);
    process.exit(1);
  }
}

main();
