# QuickBooks OAuth Setup Guide

## 🚨 IMPORTANT: Redirect URI Configuration

You need to configure **BOTH** redirect URIs in your Intuit Developer Dashboard:

### 1. Go to Intuit Developer Dashboard
- Navigate to: https://developer.intuit.com/app/developer/qbo/dashboard
- Select your app
- Go to **Keys & Credentials**

### 2. Add Both Redirect URIs
In the **Redirect URIs** section, add these **exact** URLs:

```
http://localhost:3010/callback
https://escaperamp.vercel.app/api/quickbooks/callback
```

**⚠️ Make sure there are NO trailing slashes and the URLs match exactly!**

## 📁 Scripts Overview

### `qb_auth.py` - Production Script
- Uses: `https://escaperamp.vercel.app/api/quickbooks/callback`
- For: Production deployment
- Saves tokens to: `token.json`

### `qb_auth_dev.py` - Development Script  
- Uses: `http://localhost:3010/callback`
- For: Local development testing
- Saves tokens to: `token_dev.json`

## 🔧 QuickBooks Dashboard Configuration

### Required Redirect URIs:
1. `http://localhost:3010/callback` (for local development)
2. `https://escaperamp.vercel.app/api/quickbooks/callback` (for production)

### App Settings:
- **Environment**: Production (for live QuickBooks data)
- **Scopes**: `com.intuit.quickbooks.accounting openid profile email`
- **Client ID**: `ABisp7RoMbe1i67ajK1qZJE1NXTFPBsk51IQDaSBr9MWFJn5mW`

## 🚀 Testing Steps

### For Local Development:
1. Start callback server: `python3 callback-server.py`
2. Run dev script: `python3 qb_auth_dev.py`
3. Follow the OAuth flow

### For Production:
1. Run production script: `python3 qb_auth.py`
2. Follow the OAuth flow

## 🐛 Troubleshooting

### "redirect_uri query parameter value is invalid"
- ✅ Check that both redirect URIs are added to Intuit Dashboard
- ✅ Verify no trailing slashes
- ✅ Ensure exact URL match (including protocol)

### Support Ticket Info
- **Ticket #**: 00190048
- **App ID**: `ABisp7RoMbe1i67ajK1qZJE1NXTFPBsk51IQDaSBr9MWFJn5mW`
- **Production Redirect URI**: `https://escaperamp.vercel.app/api/quickbooks/callback`
- **Development Redirect URI**: `http://localhost:3010/callback` 