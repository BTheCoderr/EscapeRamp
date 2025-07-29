-- Escape Ramp Historical Data Tracker Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Transactions table for storing financial transactions
CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  description TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense', 'transfer')),
  category TEXT NOT NULL,
  vendor TEXT,
  status TEXT NOT NULL DEFAULT 'completed' CHECK (status IN ('completed', 'pending', 'cancelled')),
  reference_number TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  updated_by UUID REFERENCES auth.users(id)
);

-- Transaction changes history table
CREATE TABLE transaction_changes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  transaction_id UUID REFERENCES transactions(id) ON DELETE CASCADE,
  field_name TEXT NOT NULL,
  old_value TEXT,
  new_value TEXT,
  changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  changed_by UUID REFERENCES auth.users(id),
  change_reason TEXT
);

-- Audit trail table for system-wide activity logging
CREATE TABLE audit_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id),
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id UUID,
  details JSONB,
  ip_address INET,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Data snapshots table for version control
CREATE TABLE data_snapshots (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  snapshot_name TEXT NOT NULL,
  snapshot_type TEXT NOT NULL CHECK (snapshot_type IN ('daily', 'manual', 'before_migration', 'after_migration')),
  data_snapshot JSONB NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create indexes for better performance
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_transactions_date ON transactions(date);
CREATE INDEX idx_transactions_type ON transactions(type);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_transactions_vendor ON transactions(vendor);
CREATE INDEX idx_transactions_category ON transactions(category);
CREATE INDEX idx_transaction_changes_transaction_id ON transaction_changes(transaction_id);
CREATE INDEX idx_transaction_changes_changed_at ON transaction_changes(changed_at);
CREATE INDEX idx_audit_events_user_id ON audit_events(user_id);
CREATE INDEX idx_audit_events_entity_type ON audit_events(entity_type);
CREATE INDEX idx_audit_events_created_at ON audit_events(created_at);
CREATE INDEX idx_data_snapshots_user_id ON data_snapshots(user_id);
CREATE INDEX idx_data_snapshots_type ON data_snapshots(snapshot_type);
CREATE INDEX idx_data_snapshots_created_at ON data_snapshots(created_at);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to log transaction changes automatically
CREATE OR REPLACE FUNCTION log_transaction_changes()
RETURNS TRIGGER AS $$
BEGIN
    -- Log changes when a transaction is updated
    IF TG_OP = 'UPDATE' THEN
        -- Check each field for changes
        IF OLD.date != NEW.date THEN
            INSERT INTO transaction_changes (transaction_id, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'date', OLD.date::text, NEW.date::text, NEW.updated_by);
        END IF;
        
        IF OLD.description != NEW.description THEN
            INSERT INTO transaction_changes (transaction_id, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'description', OLD.description, NEW.description, NEW.updated_by);
        END IF;
        
        IF OLD.amount != NEW.amount THEN
            INSERT INTO transaction_changes (transaction_id, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'amount', OLD.amount::text, NEW.amount::text, NEW.updated_by);
        END IF;
        
        IF OLD.type != NEW.type THEN
            INSERT INTO transaction_changes (transaction_id, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'type', OLD.type, NEW.type, NEW.updated_by);
        END IF;
        
        IF OLD.category != NEW.category THEN
            INSERT INTO transaction_changes (transaction_id, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'category', OLD.category, NEW.category, NEW.updated_by);
        END IF;
        
        IF OLD.vendor IS DISTINCT FROM NEW.vendor THEN
            INSERT INTO transaction_changes (transaction_id, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'vendor', OLD.vendor, NEW.vendor, NEW.updated_by);
        END IF;
        
        IF OLD.status != NEW.status THEN
            INSERT INTO transaction_changes (transaction_id, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'status', OLD.status, NEW.status, NEW.updated_by);
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic change logging
CREATE TRIGGER log_transaction_changes_trigger
    AFTER UPDATE ON transactions
    FOR EACH ROW EXECUTE FUNCTION log_transaction_changes();

-- Function to create audit event
CREATE OR REPLACE FUNCTION create_audit_event(
    p_user_id UUID,
    p_action TEXT,
    p_entity_type TEXT,
    p_entity_id UUID,
    p_details JSONB DEFAULT NULL,
    p_ip_address INET DEFAULT NULL,
    p_user_agent TEXT DEFAULT NULL
)
RETURNS UUID AS $$
DECLARE
    event_id UUID;
BEGIN
    INSERT INTO audit_events (user_id, action, entity_type, entity_id, details, ip_address, user_agent)
    VALUES (p_user_id, p_action, p_entity_type, p_entity_id, p_details, p_ip_address, p_user_agent)
    RETURNING id INTO event_id;
    
    RETURN event_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get transaction with change history
CREATE OR REPLACE FUNCTION get_transaction_with_history(transaction_uuid UUID)
RETURNS TABLE (
    transaction_id UUID,
    date DATE,
    description TEXT,
    amount DECIMAL(10,2),
    type TEXT,
    category TEXT,
    vendor TEXT,
    status TEXT,
    version_count BIGINT,
    last_modified TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        t.id,
        t.date,
        t.description,
        t.amount,
        t.type,
        t.category,
        t.vendor,
        t.status,
        COUNT(tc.id) as version_count,
        t.updated_at as last_modified
    FROM transactions t
    LEFT JOIN transaction_changes tc ON t.id = tc.transaction_id
    WHERE t.id = transaction_uuid
    GROUP BY t.id, t.date, t.description, t.amount, t.type, t.category, t.vendor, t.status, t.updated_at;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's transaction summary
CREATE OR REPLACE FUNCTION get_user_transaction_summary(user_uuid UUID)
RETURNS TABLE (
    total_transactions BIGINT,
    total_income DECIMAL(10,2),
    total_expenses DECIMAL(10,2),
    pending_transactions BIGINT,
    recent_changes BIGINT
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(t.id) as total_transactions,
        COALESCE(SUM(CASE WHEN t.type = 'income' THEN t.amount ELSE 0 END), 0) as total_income,
        COALESCE(SUM(CASE WHEN t.type = 'expense' THEN t.amount ELSE 0 END), 0) as total_expenses,
        COUNT(CASE WHEN t.status = 'pending' THEN 1 END) as pending_transactions,
        COUNT(CASE WHEN tc.changed_at >= NOW() - INTERVAL '7 days' THEN 1 END) as recent_changes
    FROM transactions t
    LEFT JOIN transaction_changes tc ON t.id = tc.transaction_id
    WHERE t.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Row Level Security (RLS) policies
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_changes ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_snapshots ENABLE ROW LEVEL SECURITY;

-- Transactions policies
CREATE POLICY "Users can view their own transactions" ON transactions
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions" ON transactions
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions" ON transactions
    FOR UPDATE USING (auth.uid() = user_id);

-- Transaction changes policies
CREATE POLICY "Users can view changes for their transactions" ON transaction_changes
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM transactions 
            WHERE transactions.id = transaction_changes.transaction_id 
            AND transactions.user_id = auth.uid()
        )
    );

-- Audit events policies
CREATE POLICY "Users can view their own audit events" ON audit_events
    FOR SELECT USING (auth.uid() = user_id);

-- Data snapshots policies
CREATE POLICY "Users can view their own snapshots" ON data_snapshots
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own snapshots" ON data_snapshots
    FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Insert sample data for testing
INSERT INTO transactions (user_id, date, description, amount, type, category, vendor, status, reference_number, created_by, updated_by) VALUES
    ('00000000-0000-0000-0000-000000000000', '2024-01-15', 'Office Supplies Purchase', 1250.00, 'expense', 'Office Supplies', 'ABC Supplies Co.', 'completed', 'INV-2024-001', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000'),
    ('00000000-0000-0000-0000-000000000000', '2024-01-14', 'Client Payment - Project Alpha', 5000.00, 'income', 'Consulting', 'TechCorp Inc.', 'completed', 'PAY-2024-001', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000'),
    ('00000000-0000-0000-0000-000000000000', '2024-01-13', 'Software License Renewal', 299.99, 'expense', 'Software', 'Adobe Systems', 'pending', 'LIC-2024-001', '00000000-0000-0000-0000-000000000000', '00000000-0000-0000-0000-000000000000');

INSERT INTO transaction_changes (transaction_id, field_name, old_value, new_value, changed_by) VALUES
    ((SELECT id FROM transactions WHERE reference_number = 'INV-2024-001'), 'amount', '1200.00', '1250.00', '00000000-0000-0000-0000-000000000000'),
    ((SELECT id FROM transactions WHERE reference_number = 'INV-2024-001'), 'vendor', 'ABC Supplies', 'ABC Supplies Co.', '00000000-0000-0000-0000-000000000000'),
    ((SELECT id FROM transactions WHERE reference_number = 'LIC-2024-001'), 'status', 'completed', 'pending', '00000000-0000-0000-0000-000000000000');

INSERT INTO audit_events (user_id, action, entity_type, entity_id, details, ip_address) VALUES
    ('00000000-0000-0000-0000-000000000000', 'UPDATE', 'Transaction', (SELECT id FROM transactions WHERE reference_number = 'INV-2024-001'), '{"field": "amount", "old_value": "1200.00", "new_value": "1250.00"}', '192.168.1.100'),
    ('00000000-0000-0000-0000-000000000000', 'CREATE', 'Transaction', (SELECT id FROM transactions WHERE reference_number = 'PAY-2024-001'), '{"amount": "5000.00", "type": "income"}', '192.168.1.101'),
    ('00000000-0000-0000-0000-000000000000', 'DELETE', 'Transaction', '00000000-0000-0000-0000-000000000000', '{"reason": "Duplicate transaction"}', '192.168.1.102'); 