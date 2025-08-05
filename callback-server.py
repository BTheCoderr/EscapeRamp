#!/usr/bin/env python3
"""
Simple callback server for QuickBooks OAuth
Listens on port 8000 and handles the OAuth redirect
"""

from http.server import HTTPServer, BaseHTTPRequestHandler
from urllib.parse import urlparse, parse_qs
import json
import webbrowser
import time

class CallbackHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Parse the URL and query parameters
        parsed_url = urlparse(self.path)
        query_params = parse_qs(parsed_url.query)
        
        # Extract the authorization code and realm ID
        code = query_params.get('code', [None])[0]
        realm_id = query_params.get('realmId', [None])[0]
        state = query_params.get('state', [None])[0]
        
        # Create response data
        response_data = {
            'success': True,
            'code': code,
            'realmId': realm_id,
            'state': state,
            'message': 'OAuth callback received successfully!'
        }
        
        # Send response
        self.send_response(200)
        self.send_header('Content-type', 'application/json')
        self.end_headers()
        
        response_json = json.dumps(response_data, indent=2)
        self.wfile.write(response_json.encode())
        
        # Print to console for debugging
        print("\n" + "="*50)
        print("🎉 QUICKBOOKS OAUTH CALLBACK RECEIVED!")
        print("="*50)
        print(f"Authorization Code: {code}")
        print(f"Realm ID: {realm_id}")
        print(f"State: {state}")
        print("="*50)
        print("\n✅ You can now close this browser tab and return to your app!")
        print("The authorization code and realm ID have been captured.")
        print("="*50 + "\n")
        
        # Stop the server after receiving the callback
        def shutdown():
            time.sleep(2)
            self.server.shutdown()
        
        import threading
        threading.Thread(target=shutdown).start()

def start_callback_server():
    """Start the callback server on port 8000"""
    server_address = ('localhost', 8000)
    httpd = HTTPServer(server_address, CallbackHandler)
    
    print("🚀 Starting QuickBooks OAuth callback server...")
    print(f"📡 Server listening on: http://localhost:8000")
    print("⏳ Waiting for QuickBooks OAuth redirect...")
    print("="*50)
    
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        print("\n🛑 Server stopped by user")
    finally:
        httpd.server_close()

if __name__ == "__main__":
    start_callback_server() 