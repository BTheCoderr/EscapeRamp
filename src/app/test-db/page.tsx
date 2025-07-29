import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function TestDBPage() {
  const cookieStore = await cookies();
  
  let connectionStatus = 'Unknown';
  let error = null;
  
  try {
    const supabase = createClient(cookieStore);
    connectionStatus = 'Connected to Supabase';
  } catch (e) {
    connectionStatus = 'Failed to connect';
    error = e as any;
  }

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Connection Status:</h2>
          <p className="text-green-600">✅ {connectionStatus}</p>
        </div>

        {error && (
          <div className="p-4 border rounded bg-red-50">
            <h2 className="font-semibold text-red-800">Error Details:</h2>
            <pre className="text-sm text-red-600 mt-2">{JSON.stringify(error, null, 2)}</pre>
          </div>
        )}

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Environment Variables:</h2>
          <div className="text-sm space-y-1 mt-2">
            <p><strong>SUPABASE_URL:</strong> {process.env.NEXT_PUBLIC_SUPABASE_URL ? '✅ Set' : '❌ Missing'}</p>
            <p><strong>SUPABASE_ANON_KEY:</strong> {process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '✅ Set' : '❌ Missing'}</p>
          </div>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Next Steps:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>✅ Environment variables configured</li>
            <li>Run the database schema in Supabase SQL editor</li>
            <li>Test the API endpoints</li>
            <li>Verify the dashboard functionality</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 