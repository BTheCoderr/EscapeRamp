import requests
import json
import os
from urllib.parse import urlencode

# === CONFIG (DEV MODE for now) ===
CLIENT_ID = "ABisp7RoMbe1i67ajK1qZJE1NXTFPBsk51IQDaSBr9MWFJn5mW"  # Your NEW Client ID
CLIENT_SECRET = "nf6zWDJQsKYdty9BvVVCfxpE4gGxvyHToYlWzEkU"  # Your NEW Client Secret
REDIRECT_URI = "http://localhost:8000/callback"  # TODO: Replace with production redirect URI later
AUTH_BASE_URL = "https://appcenter.intuit.com/connect/oauth2"
TOKEN_URL = "https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer"
SCOPES = "com.intuit.quickbooks.accounting openid profile email"


# === AUTH STEP 1: Get user to visit auth URL ===
def get_auth_url():
    params = {
        "client_id": CLIENT_ID,
        "redirect_uri": REDIRECT_URI,
        "response_type": "code",
        "scope": SCOPES,
        "state": "secureRandomState"
    }
    return f"{AUTH_BASE_URL}?{urlencode(params)}"


print("👉 Go to this URL in your browser to authorize the app:")
print(get_auth_url())

# === AUTH STEP 2: Paste code manually (for now) ===
auth_code = input("🔑 Paste the authorization code from the callback URL: ")

# === AUTH STEP 3: Exchange code for tokens ===
headers = {
    "Accept": "application/json",
    "Content-Type": "application/x-www-form-urlencoded"
}
data = {
    "grant_type": "authorization_code",
    "code": auth_code,
    "redirect_uri": REDIRECT_URI
}
auth = requests.auth.HTTPBasicAuth(CLIENT_ID, CLIENT_SECRET)

response = requests.post(TOKEN_URL, headers=headers, data=data, auth=auth)

if response.status_code == 200:
    token_data = response.json()

    # Save token.json
    with open("token.json", "w") as f:
        json.dump(token_data, f, indent=4)

    print("✅ Token saved to token.json")
    print("🎉 Authorization successful!")
    print(f"📋 Realm ID: {token_data.get('realmId', 'Not found')}")
    print(f"🔑 Access Token: {token_data.get('access_token', 'Not found')[:20]}...")
else:
    print("❌ Failed to get token:", response.text) 