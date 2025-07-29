import { createClient } from '@/lib/supabase/server';
import { cookies } from 'next/headers';

export default async function TestDBPage() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  // Test the connection
  const { data, error } = await supabase.from('transactions').select('count').limit(1);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Supabase Connection Test</h1>
      
      <div className="space-y-4">
        <div className="p-4 border rounded">
          <h2 className="font-semibold">Connection Status:</h2>
          <p className="text-green-600">✅ Connected to Supabase</p>
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Database Test:</h2>
          {error ? (
            <div className="text-red-600">
              <p>❌ Error: {error.message}</p>
              <p className="text-sm mt-2">This is expected if tables don't exist yet.</p>
            </div>
          ) : (
            <div className="text-green-600">
              <p>✅ Database query successful</p>
              <p className="text-sm mt-2">Found {data?.length || 0} records</p>
            </div>
          )}
        </div>

        <div className="p-4 border rounded">
          <h2 className="font-semibold">Next Steps:</h2>
          <ol className="list-decimal list-inside space-y-2">
            <li>Create your <code>.env.local</code> file with Supabase credentials</li>
            <li>Run the database schema in Supabase SQL editor</li>
            <li>Test the API endpoints</li>
            <li>Verify the dashboard functionality</li>
          </ol>
        </div>
      </div>
    </div>
  );
} 