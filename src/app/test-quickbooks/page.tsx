'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function TestQuickBooks() {
  const [testResults, setTestResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const testAuthFlow = async () => {
    setLoading(true);
    try {
      // Test the auth endpoint
      const authResponse = await fetch('/api/quickbooks/auth');
      const authUrl = authResponse.url;
      
      setTestResults({
        authUrl,
        status: 'Auth URL generated successfully',
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  const testCallback = async () => {
    setLoading(true);
    try {
      // Test the callback endpoint
      const response = await fetch('/api/quickbooks/callback?test=true');
      const data = await response.json();
      
      setTestResults({
        callbackTest: data,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  const simulateCallback = async () => {
    setLoading(true);
    try {
      // Simulate a callback with fake parameters
      const fakeCode = 'fake_auth_code_123';
      const fakeRealmId = 'fake_realm_id_456';
      const fakeState = 'teststate';
      
      const response = await fetch(`/api/quickbooks/callback?code=${fakeCode}&realmId=${fakeRealmId}&state=${fakeState}`);
      
      setTestResults({
        simulatedCallback: {
          status: response.status,
          statusText: response.statusText,
          url: response.url
        },
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      setTestResults({
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      });
    }
    setLoading(false);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <h1 className="text-3xl font-bold">QuickBooks OAuth Test</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Test Auth Flow</CardTitle>
            <CardDescription>Generate QuickBooks authorization URL</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testAuthFlow} disabled={loading}>
              {loading ? 'Testing...' : 'Test Auth'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Test Callback</CardTitle>
            <CardDescription>Test callback endpoint</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={testCallback} disabled={loading}>
              {loading ? 'Testing...' : 'Test Callback'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Simulate Callback</CardTitle>
            <CardDescription>Test with fake parameters</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={simulateCallback} disabled={loading}>
              {loading ? 'Testing...' : 'Simulate'}
            </Button>
          </CardContent>
        </Card>
      </div>

      {testResults && (
        <Card>
          <CardHeader>
            <CardTitle>Test Results</CardTitle>
            <CardDescription>Debug information</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto">
              {JSON.stringify(testResults, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Environment Info</CardTitle>
          <CardDescription>Current configuration</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm">
            <div>NODE_ENV: {process.env.NODE_ENV}</div>
            <div>QUICKBOOKS_ENVIRONMENT: {process.env.NEXT_PUBLIC_QUICKBOOKS_ENVIRONMENT || 'Not set (private)'}</div>
            <div>QUICKBOOKS_CLIENT_ID: {process.env.NEXT_PUBLIC_QUICKBOOKS_CLIENT_ID ? 'SET' : 'Not set (private)'}</div>
            <div>Redirect URI: {process.env.NEXT_PUBLIC_QUICKBOOKS_REDIRECT_URI || 'Not set (private)'}</div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 