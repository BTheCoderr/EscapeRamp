import json
import requests

# 🔁 UPDATED WITH YOUR ACTUAL CREDENTIALS
client_id = 'ABisp7RoMbe1i67ajK1qZJE1NXTFPBsk51IQDaSBr9MWFJn5mW'
client_secret = 'nf6zWDJQsKYdty9BvVVCfxpE4gGxvyHToYlWzEkU'

try:
    with open('token.json') as f:
        token = json.load(f)

    refresh_token = token['refresh_token']

    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
    }

    data = {
        'grant_type': 'refresh_token',
        'refresh_token': refresh_token,
        'client_id': client_id,
        'client_secret': client_secret
    }

    res = requests.post(
        'https://oauth.platform.intuit.com/oauth2/v1/tokens/bearer',
        headers=headers,
        data=data)
    
    if res.status_code == 200:
        new_token = res.json()
        
        with open('token.json', 'w') as f:
            json.dump(new_token, f, indent=4)

        print("✅ Token refreshed successfully!")
        print(f"🔑 New access token: {new_token.get('access_token', 'Not found')[:20]}...")
        print(f"⏰ Expires in: {new_token.get('expires_in', 'Not found')} seconds")
    else:
        print("❌ Failed to refresh token:", res.text)
        
except FileNotFoundError:
    print("❌ token.json not found. Run qb_auth.py first to get initial tokens.")
except KeyError:
    print("❌ refresh_token not found in token.json. Run qb_auth.py first.")
except Exception as e:
    print(f"❌ Error: {e}")
