'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestQuickBooksPage() {
  const [status, setStatus] = useState<string>('Ready to test');
  const [loading, setLoading] = useState(false);

  const testOAuth = async () => {
    setLoading(true);
    setStatus('Testing OAuth connection...');
    
    try {
      const response = await fetch('/api/quickbooks/auth');
      if (response.ok) {
        setStatus('OAuth URL generated successfully! Check the redirect.');
      } else {
        setStatus(`Error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  const testCallback = async () => {
    setLoading(true);
    setStatus('Testing callback endpoint...');
    
    try {
      const response = await fetch('/api/quickbooks/callback?test=true');
      const data = await response.text();
      setStatus(`Callback test: ${response.status} - ${data.substring(0, 100)}`);
    } catch (error) {
      setStatus(`Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle>QuickBooks OAuth Test</CardTitle>
          <CardDescription>
            Test the QuickBooks OAuth connection and configuration
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Environment Variables:</h3>
            <div className="text-sm space-y-1">
              <div>Client ID: {process.env.NEXT_PUBLIC_QUICKBOOKS_CLIENT_ID || 'Not set (private)'}</div>
              <div>Environment: {process.env.NEXT_PUBLIC_QUICKBOOKS_ENVIRONMENT || 'Not set (private)'}</div>
              <div>Redirect URI: {process.env.NEXT_PUBLIC_QUICKBOOKS_REDIRECT_URI || 'Not set (private)'}</div>
            </div>
          </div>
          
          <div className="space-y-2">
            <h3 className="font-semibold">Status:</h3>
            <div className="p-3 bg-gray-100 rounded">{status}</div>
          </div>
          
          <div className="flex space-x-4">
            <Button 
              onClick={testOAuth} 
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              Test OAuth URL
            </Button>
            
            <Button 
              onClick={testCallback} 
              disabled={loading}
              variant="outline"
            >
              Test Callback
            </Button>
          </div>
          
          <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <h4 className="font-semibold text-yellow-800">Next Steps:</h4>
            <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1 mt-2">
              <li>Click "Test OAuth URL" to generate the authorization URL</li>
              <li>Copy the URL from the browser address bar</li>
              <li>Paste it in a new tab to test the OAuth flow</li>
              <li>Check if you're redirected to QuickBooks authorization</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 