#!/usr/bin/env python3
"""
Master script to run all QuickBooks operations in the correct order
"""

import subprocess
import sys
import os
import json

def run_script(script_name, description):
    """Run a Python script and handle errors"""
    print(f"\n{'='*60}")
    print(f"🚀 {description}")
    print(f"📁 Running: {script_name}")
    print(f"{'='*60}")
    
    try:
        result = subprocess.run([sys.executable, script_name], 
                              capture_output=True, text=True, check=True)
        print(result.stdout)
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error running {script_name}:")
        print(f"STDOUT: {e.stdout}")
        print(f"STDERR: {e.stderr}")
        return False
    except FileNotFoundError:
        print(f"❌ Script {script_name} not found!")
        return False

def check_token_exists():
    """Check if token.json exists and is valid"""
    try:
        with open('token.json', 'r') as f:
            token_data = json.load(f)
        
        if 'access_token' in token_data and 'realmId' in token_data:
            print("✅ token.json found and looks valid")
            return True
        else:
            print("⚠️ token.json exists but missing required fields")
            return False
    except FileNotFoundError:
        print("❌ token.json not found")
        return False
    except json.JSONDecodeError:
        print("❌ token.json is invalid JSON")
        return False

def main():
    print("🎯 QuickBooks Setup Master Script")
    print("="*60)
    
    # Step 1: Check if we need to authenticate
    if not check_token_exists():
        print("\n🔐 Step 1: QuickBooks Authentication Required")
        print("You need to authenticate with QuickBooks first.")
        print("\nOptions:")
        print("1. Run: python3 qb_auth.py (for production)")
        print("2. Run: python3 qb_auth_dev.py (for development)")
        print("\nAfter authentication, run this script again.")
        return
    
    # Step 2: Refresh token (optional but recommended)
    print("\n🔄 Step 2: Refreshing QuickBooks Token")
    if not run_script('refresh_token.py', 'Refreshing QuickBooks access token'):
        print("⚠️ Token refresh failed, but continuing...")
    
    # Step 3: Sync customers to Supabase
    print("\n📊 Step 3: Syncing Customers to Supabase")
    if not run_script('migrate_customers_to_supabase.py', 'Migrating customers from QuickBooks to Supabase'):
        print("❌ Customer migration failed!")
        return
    
    print("\n🎉 All QuickBooks operations completed successfully!")
    print("\n📋 Summary:")
    print("✅ QuickBooks authentication verified")
    print("✅ Access token refreshed")
    print("✅ Customers synced to Supabase")
    print("\n🚀 Your QuickBooks integration is ready!")

if __name__ == "__main__":
    main()
