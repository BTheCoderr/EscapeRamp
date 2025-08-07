# migrate_customers_to_supabase.py
# PURPOSE: Load customers from QuickBooks Online into your Supabase database

import json
import requests
from supabase import create_client

# 🔁 UPDATED WITH YOUR ACTUAL CREDENTIALS
SUPABASE_URL = "https://yylmxjqvwywayxbofrko.supabase.co"
SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bG14anF2d3l3YXl4Ym9mcmtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzgyODEwNSwiZXhwIjoyMDY5NDA0MTA1fQ.fBcoWWJYSB5z2yPMRI1xlf8DvU9rafl4kQL_YUDjMuA"

try:
    # Load saved token from qb_auth.py
    with open('token.json') as f:
        token = json.load(f)

    access_token = token['access_token']
    realm_id = token.get('realmId')

    if not realm_id:
        print("❌ realmId not found in token.json. Run qb_auth.py first.")
        exit(1)

    print(f"🔗 Using QuickBooks Company ID: {realm_id}")

    # QuickBooks API call to get customers
    url = f"https://quickbooks.api.intuit.com/v3/company/{realm_id}/query"
    query = "SELECT * FROM Customer"
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json",
        "Content-Type": "application/text"
    }

    print("📡 Fetching customers from QuickBooks...")
    response = requests.post(url, headers=headers, data=query)
    
    if response.status_code != 200:
        print("❌ Failed to fetch data:", response.text)
        exit(1)

    customers = response.json().get("QueryResponse", {}).get("Customer", [])
    print(f"✅ Found {len(customers)} customers in QuickBooks")

    # Format for Supabase
    formatted = []
    for c in customers:
        customer_data = {
            "display_name": c.get("DisplayName"),
            "email": c.get("PrimaryEmailAddr", {}).get("Address"),
            "phone": c.get("PrimaryPhone", {}).get("FreeFormNumber"),
            "created_at": c.get("MetaData", {}).get("CreateTime"),
            "quickbooks_id": c.get("Id"),  # Store QuickBooks ID for reference
            "active": c.get("Active", True)
        }
        formatted.append(customer_data)

    # Upload to Supabase
    supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    
    print("📤 Uploading customers to Supabase...")
    success_count = 0
    
    for entry in formatted:
        try:
            res = supabase.table("customers").insert(entry).execute()
            print(f"✅ Uploaded: {entry['display_name']}")
            success_count += 1
        except Exception as e:
            print(f"⚠️ Failed to upload {entry['display_name']}: {e}")
    
    print(f"\n🎉 Migration complete! {success_count}/{len(formatted)} customers uploaded successfully.")

except FileNotFoundError:
    print("❌ token.json not found. Run qb_auth.py first to authenticate.")
except Exception as e:
    print(f"❌ Error: {e}") 