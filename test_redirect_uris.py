#!/usr/bin/env python3
"""
Test script to verify QuickBooks redirect URIs
"""

from urllib.parse import urlencode

# Test all redirect URIs
redirect_uris = [
    "http://localhost:3010/callback",
    "https://escaperamp.vercel.app/callback"
]

CLIENT_ID = "ABisp7RoMbe1i67ajK1qZJE1NXTFPBsk51IQDaSBr9MWFJn5mW"
AUTH_BASE_URL = "https://appcenter.intuit.com/connect/oauth2"
SCOPES = "com.intuit.quickbooks.accounting openid profile email phone address"

print("🔍 QuickBooks Redirect URI Test")
print("="*50)

for i, redirect_uri in enumerate(redirect_uris, 1):
    print(f"\n{i}. Testing: {redirect_uri}")
    
    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": redirect_uri,
        "response_type": "code",
        "scope": SCOPES,
        "state": "teststate"
    }
    
    auth_url = f"{AUTH_BASE_URL}?{urlencode(params)}"
    print(f"   Generated URL: {auth_url}")
    print(f"   Encoded redirect_uri: {urlencode({'redirect_uri': redirect_uri})}")

print("\n" + "="*50)
print("📋 SUMMARY:")
print("You need to add ALL THREE redirect URIs to your Intuit Developer Dashboard:")
for uri in redirect_uris:
    print(f"   ✅ {uri}")
print("\n🔗 Go to: https://developer.intuit.com/app/developer/qbo/dashboard")
print("   → Your App → Keys & Credentials → Redirect URIs") 