# migrate_customers_to_supabase.py
# PURPOSE: Load customers from QuickBooks Online into your Supabase database

import json
import requests
from supabase import create_client

# 🔁 REPLACE THESE
SUPABASE_URL = "https://yylmxjqvwywayxbofrko.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bG14anF2d3l3YXl4Ym9mcmtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzgyODEwNSwiZXhwIjoyMDY5NDA0MTA1fQ.fBcoWWJYSB5z2yPMRI1xlf8DvU9rafl4kQL_YUDjMuA"

# Load saved token from qb_auth.py
with open('token.json') as f:
    token = json.load(f)

access_token = token['access_token']
realm_id = token.get('realmId')  # Get realm ID from token

if not realm_id:
    print("❌ realmId not found in token.json. Ensure authentication is complete.")
    exit(1)

# QuickBooks API call to get customers
url = f"https://sandbox-quickbooks.api.intuit.com/v3/company/{realm_id}/query"
query = "SELECT * FROM Customer"
headers = {
    "Authorization": f"Bearer {access_token}",
    "Accept": "application/json",
    "Content-Type": "application/text"
}

response = requests.post(url, headers=headers, data=query)
if response.status_code != 200:
    print("❌ Failed to fetch data:", response.text)
    exit()

customers = response.json().get("QueryResponse", {}).get("Customer", [])

# Format for Supabase
formatted = [{
    "display_name": c.get("DisplayName"),
    "email": c.get("PrimaryEmailAddr", {}).get("Address"),
    "phone": c.get("PrimaryPhone", {}).get("FreeFormNumber"),
    "created_at": c.get("MetaData", {}).get("CreateTime")
} for c in customers]

# Upload to Supabase
supabase = create_client(SUPABASE_URL, SUPABASE_KEY)

for entry in formatted:
    res = supabase.table("customers").insert(entry).execute()
    print("✅ Uploaded:", res.data) 