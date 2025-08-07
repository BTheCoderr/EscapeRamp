#!/usr/bin/env python3
"""
Sync customers from QuickBooks to Supabase
Uses production QuickBooks API and your Supabase credentials
"""

import requests
import json

# === UPDATED WITH YOUR ACTUAL CREDENTIALS ===
QB_BASE_URL = "https://quickbooks.api.intuit.com"  # Production API
SUPABASE_URL = "https://yylmxjqvwywayxbofrko.supabase.co"
SUPABASE_API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inl5bG14anF2d3l3YXl4Ym9mcmtvIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1MzgyODEwNSwiZXhwIjoyMDY5NDA0MTA1fQ.fBcoWWJYSB5z2yPMRI1xlf8DvU9rafl4kQL_YUDjMuA"

try:
    # === Load token from file (created by qb_auth.py) ===
    with open("token.json", "r") as f:
        token_data = json.load(f)

    access_token = token_data["access_token"]
    realm_id = token_data.get("realmId", None)

    if not realm_id:
        print("❌ realmId not found in token.json. Run qb_auth.py first to authenticate.")
        exit(1)

    print(f"🔗 Using QuickBooks Company ID: {realm_id}")

    # === Headers for QuickBooks and Supabase ===
    qb_headers = {
        "Authorization": f"Bearer {access_token}",
        "Accept": "application/json"
    }

    supabase_headers = {
        "apikey": SUPABASE_API_KEY,
        "Authorization": f"Bearer {SUPABASE_API_KEY}",
        "Content-Type": "application/json"
    }

    # === Fetch customers from QuickBooks ===
    print("📡 Fetching customers from QuickBooks...")
    response = requests.get(
        f"{QB_BASE_URL}/v3/company/{realm_id}/query?query=SELECT * FROM Customer",
        headers=qb_headers
    )

    if response.status_code != 200:
        print("❌ Failed to fetch data:", response.text)
        exit(1)

    customers = response.json().get("QueryResponse", {}).get("Customer", [])
    print(f"✅ Fetched {len(customers)} customers from QuickBooks.")

    # === Push customers to Supabase ===
    print("📤 Syncing customers to Supabase...")
    success_count = 0
    
    for customer in customers:
        supabase_data = {
            "display_name": customer.get("DisplayName"),
            "email": customer.get("PrimaryEmailAddr", {}).get("Address"),
            "phone": customer.get("PrimaryPhone", {}).get("FreeFormNumber"),
            "active": customer.get("Active", True),
            "quickbooks_id": customer.get("Id"),
            "created_at": customer.get("MetaData", {}).get("CreateTime")
        }

        res = requests.post(
            f"{SUPABASE_URL}/rest/v1/customers",
            headers=supabase_headers,
            json=supabase_data
        )

        if res.status_code in [200, 201]:
            print(f"✅ Synced customer: {customer.get('DisplayName')}")
            success_count += 1
        else:
            print(f"⚠️ Failed to sync {customer.get('DisplayName')}: {res.text}")

    print(f"\n🎉 Sync complete! {success_count}/{len(customers)} customers synced successfully.")

except FileNotFoundError:
    print("❌ token.json not found. Run qb_auth.py first to authenticate.")
except Exception as e:
    print(f"❌ Error: {e}")
