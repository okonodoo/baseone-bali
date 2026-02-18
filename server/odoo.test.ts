import { describe, expect, it } from "vitest";
import axios from "axios";

describe("Odoo CRM Integration", () => {
  it("authenticates with Odoo JSON-RPC using provided credentials", async () => {
    const url = process.env.ODOO_URL;
    const db = process.env.ODOO_DB;
    const username = process.env.ODOO_USERNAME;
    const password = process.env.ODOO_PASSWORD;

    // Skip if not configured
    if (!url || !db || !username || !password) {
      console.warn("Odoo credentials not configured, skipping test");
      return;
    }

    const response = await axios.post(
      `${url}/jsonrpc`,
      {
        jsonrpc: "2.0",
        method: "call",
        id: Date.now(),
        params: {
          service: "common",
          method: "authenticate",
          args: [db, username, password, {}],
        },
      },
      {
        headers: { "Content-Type": "application/json" },
        timeout: 15000,
      }
    );

    expect(response.status).toBe(200);
    expect(response.data.result).toBeTruthy();
    expect(typeof response.data.result).toBe("number");
    console.log("Odoo UID:", response.data.result);
  });
});
