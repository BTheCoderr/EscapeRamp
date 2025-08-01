'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Building2, 
  CheckCircle, 
  AlertCircle, 
  ExternalLink,
  RefreshCw,
  Database,
  Users,
  FileText
} from 'lucide-react';

interface QBData {
  accounts?: any[];
  customers?: any[];
  invoices?: any[];
  company?: any;
}

export default function QuickBooksConnection() {
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [realmId, setRealmId] = useState<string | null>(null);
  const [qbData, setQbData] = useState<QBData>({});
  const [error, setError] = useState<string | null>(null);

  // Check URL parameters for connection status
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const quickbooksStatus = urlParams.get('quickbooks');
    const realmIdParam = urlParams.get('realmId');

    if (quickbooksStatus === 'connected' && realmIdParam) {
      setIsConnected(true);
      setRealmId(realmIdParam);
      setError(null);
    } else if (quickbooksStatus === 'error') {
      setError('Failed to connect to QuickBooks. Please try again.');
    }
  }, []);

  const handleConnect = () => {
    setIsLoading(true);
    setError(null);
    
    // Redirect to QuickBooks OAuth
    window.location.href = '/api/quickbooks/auth';
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setRealmId(null);
    setQbData({});
    setError(null);
    
    // Clear URL parameters
    const url = new URL(window.location.href);
    url.searchParams.delete('quickbooks');
    url.searchParams.delete('realmId');
    window.history.replaceState({}, '', url.toString());
  };

  const fetchQBData = async (dataType: string) => {
    if (!realmId) return;

    setIsLoading(true);
    try {
      // In a real app, you'd get these tokens from your database
      // For demo purposes, we'll use placeholder values
      const response = await fetch(`/api/quickbooks/data?type=${dataType}&accessToken=demo&refreshToken=demo&realmId=${realmId}`);
      
      if (response.ok) {
        const result = await response.json();
        setQbData(prev => ({
          ...prev,
          [dataType]: result.data
        }));
      } else {
        throw new Error('Failed to fetch data');
      }
    } catch (err) {
      setError(`Failed to fetch ${dataType}: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            QuickBooks Online Connection
          </CardTitle>
          <CardDescription>
            Connect your QuickBooks Online account to sync data and perform migrations
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!isConnected ? (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto">
                <Building2 className="w-8 h-8 text-blue-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Connect to QuickBooks Online</h3>
                <p className="text-gray-600 mb-4">
                  Authorize Escape Ramp to access your QuickBooks Online data for migration and analysis.
                </p>
              </div>
              <Button 
                onClick={handleConnect} 
                disabled={isLoading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <ExternalLink className="w-4 h-4 mr-2" />
                    Connect QuickBooks Online
                  </>
                )}
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                    <CheckCircle className="w-6 h-6 text-green-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold">Connected to QuickBooks Online</h3>
                    <p className="text-sm text-gray-600">Realm ID: {realmId}</p>
                  </div>
                </div>
                <Badge className="bg-green-100 text-green-800">Connected</Badge>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  onClick={() => fetchQBData('accounts')}
                  disabled={isLoading}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Database className="w-5 h-5" />
                  <span>Fetch Accounts</span>
                  {qbData.accounts && (
                    <Badge variant="secondary">{qbData.accounts.length}</Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => fetchQBData('customers')}
                  disabled={isLoading}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <Users className="w-5 h-5" />
                  <span>Fetch Customers</span>
                  {qbData.customers && (
                    <Badge variant="secondary">{qbData.customers.length}</Badge>
                  )}
                </Button>

                <Button
                  variant="outline"
                  onClick={() => fetchQBData('invoices')}
                  disabled={isLoading}
                  className="h-auto p-4 flex flex-col items-center gap-2"
                >
                  <FileText className="w-5 h-5" />
                  <span>Fetch Invoices</span>
                  {qbData.invoices && (
                    <Badge variant="secondary">{qbData.invoices.length}</Badge>
                  )}
                </Button>
              </div>

              <Button
                variant="destructive"
                onClick={handleDisconnect}
                className="w-full"
              >
                Disconnect QuickBooks
              </Button>
            </div>
          )}

          {error && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {isLoading && (
            <div className="text-center py-4">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-600">Loading QuickBooks data...</p>
            </div>
          )}

          {/* Display fetched data */}
          {Object.keys(qbData).length > 0 && (
            <div className="space-y-4">
              <h4 className="font-semibold">QuickBooks Data</h4>
              {qbData.accounts && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Accounts ({qbData.accounts.length})</h5>
                  <div className="text-sm text-gray-600">
                    {qbData.accounts.slice(0, 3).map((account: any, index: number) => (
                      <div key={index}>• {account.Name} ({account.AccountType})</div>
                    ))}
                    {qbData.accounts.length > 3 && (
                      <div className="text-gray-500">... and {qbData.accounts.length - 3} more</div>
                    )}
                  </div>
                </div>
              )}
              
              {qbData.customers && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Customers ({qbData.customers.length})</h5>
                  <div className="text-sm text-gray-600">
                    {qbData.customers.slice(0, 3).map((customer: any, index: number) => (
                      <div key={index}>• {customer.DisplayName}</div>
                    ))}
                    {qbData.customers.length > 3 && (
                      <div className="text-gray-500">... and {qbData.customers.length - 3} more</div>
                    )}
                  </div>
                </div>
              )}

              {qbData.invoices && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h5 className="font-medium mb-2">Invoices ({qbData.invoices.length})</h5>
                  <div className="text-sm text-gray-600">
                    {qbData.invoices.slice(0, 3).map((invoice: any, index: number) => (
                      <div key={index}>• {invoice.DocNumber} - ${invoice.TotalAmt}</div>
                    ))}
                    {qbData.invoices.length > 3 && (
                      <div className="text-gray-500">... and {qbData.invoices.length - 3} more</div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
} 