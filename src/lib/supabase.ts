import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase = supabaseUrl && supabaseAnonKey
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;

// Server-side client with service role key
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error('Supabase environment variables are not configured');
  }

  return createClient(supabaseUrl, supabaseServiceKey);
};

// Database table names
export const TABLES = {
  USERS: 'users',
  MIGRATIONS: 'migrations',
  FILES: 'files',
  INTAKE_RESPONSES: 'intake_responses',
  AI_ANALYSES: 'ai_analyses',
  MIGRATION_PROGRESS: 'migration_progress',
  INTAKE_FORM: 'intake_form',
  MIGRATION_STATUS: 'migration_status',
  DOCUMENTS: 'documents',
  PARSED_INVOICES: 'parsed_invoices',
  TRANSACTIONS: 'transactions',
  TRANSACTION_CHANGES: 'transaction_changes',
  AUDIT_EVENTS: 'audit_events',
  DATA_SNAPSHOTS: 'data_snapshots',
} as const; 