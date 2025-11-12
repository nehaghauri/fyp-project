const ODOO_URL = "http://localhost:8069/jsonrpc";
const DB = "infiniserve_db";
const USERNAME = "nehasaleem596@gmail.com";
const PASSWORD = "fypproject2025";

export async function fetchCustomers() {
  // Authenticate
  const loginPayload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "common",
      method: "login",
      args: [DB, USERNAME, PASSWORD],
    },
    id: Date.now(),
  };

  const loginResponse = await fetch(ODOO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(loginPayload),
  });

  const loginData = await loginResponse.json();
  const uid = loginData.result;

  if (!uid) throw new Error("Login failed");

  // Fetch customers
  const customersPayload = {
    jsonrpc: "2.0",
    method: "call",
    params: {
      service: "object",
      method: "execute_kw",
      args: [
        DB,
        uid,
        PASSWORD,
        "res.partner",
        "search_read",
        [[]], // fetch all customers
        { fields: ["id", "name", "email"], limit: 50 },
      ],
    },
    id: Date.now() + 1,
  };

  const customersResponse = await fetch(ODOO_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(customersPayload),
  });

  const customersData = await customersResponse.json();
  return customersData.result;
}
