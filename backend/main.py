from fastapi import FastAPI
import odoorpc

app = FastAPI()

@app.get("/health")
def health():
    return {"status": "ok", "message": "Backend connected successfully!"}

# Connect to Odoo
odoo = odoorpc.ODOO("localhost", port=8069)
odoo.login("infiniserve_db", "nehasaleem596@gmail.com", "fypproject2025")  # use your credentials

@app.get("/customers")
def get_customers():
    Partner = odoo.env['res.partner']
    customers = Partner.search_read([], ['name', 'email', 'phone'])
    return {"customers": customers}

@app.get("/leads")
def get_leads():
    Lead = odoo.env['crm.lead']
    leads = Lead.search_read([], ['name', 'email_from', 'stage_id'])
    return {"leads": leads}
