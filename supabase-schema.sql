-- Escape Ramp Supabase Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Intake Form Table
CREATE TABLE intake_form (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_email TEXT NOT NULL,
  software_used TEXT NOT NULL,
  urgency_level TEXT NOT NULL CHECK (urgency_level IN ('ASAP', '1-3 months', 'Just exploring')),
  pain_points TEXT,
  additional_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration Status Table
CREATE TABLE migration_status (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  intake_form_id UUID REFERENCES intake_form(id) ON DELETE CASCADE,
  status TEXT NOT NULL DEFAULT 'ready-for-review' CHECK (status IN ('ready-for-review', 'in-progress', 'completed', 'cancelled')),
  assigned_specialist TEXT,
  estimated_completion_date DATE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_intake_form_email ON intake_form(user_email);
CREATE INDEX idx_intake_form_created_at ON intake_form(created_at);
CREATE INDEX idx_migration_status_intake_id ON migration_status(intake_form_id);
CREATE INDEX idx_migration_status_status ON migration_status(status);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_intake_form_updated_at BEFORE UPDATE ON intake_form
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_migration_status_updated_at BEFORE UPDATE ON migration_status
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE intake_form ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_status ENABLE ROW LEVEL SECURITY;

-- Allow public access for intake form submissions
CREATE POLICY "Allow public intake form submissions" ON intake_form
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow users to view their own intake forms" ON intake_form
    FOR SELECT USING (true);

-- Allow public access for migration status
CREATE POLICY "Allow public migration status access" ON migration_status
    FOR ALL USING (true);

-- Insert sample data for testing (optional)
INSERT INTO intake_form (user_email, software_used, urgency_level, pain_points) VALUES
    ('demo@escaperamp.com', 'QuickBooks Desktop Pro', 'ASAP', 'Software is outdated and expensive'),
    ('test@company.com', 'QuickBooks Online', '1-3 months', 'Need better integration capabilities');

-- Create a function to get intake form with migration status
CREATE OR REPLACE FUNCTION get_intake_with_status(intake_id UUID)
RETURNS TABLE (
    intake_id UUID,
    user_email TEXT,
    software_used TEXT,
    urgency_level TEXT,
    pain_points TEXT,
    status TEXT,
    assigned_specialist TEXT,
    estimated_completion_date DATE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        i.id,
        i.user_email,
        i.software_used,
        i.urgency_level,
        i.pain_points,
        COALESCE(ms.status, 'ready-for-review') as status,
        ms.assigned_specialist,
        ms.estimated_completion_date
    FROM intake_form i
    LEFT JOIN migration_status ms ON i.id = ms.intake_form_id
    WHERE i.id = intake_id;
END;
$$ LANGUAGE plpgsql; 