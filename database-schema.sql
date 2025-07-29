-- Escape Ramp Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    company_name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migrations table
CREATE TABLE migrations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed')),
    source_software VARCHAR(255) NOT NULL,
    target_software VARCHAR(255) NOT NULL,
    urgency VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    data_preservation_requirements TEXT[] NOT NULL DEFAULT '{}',
    estimated_completion_date TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Files table
CREATE TABLE files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migration_id UUID NOT NULL REFERENCES migrations(id) ON DELETE CASCADE,
    filename VARCHAR(255) NOT NULL,
    file_size BIGINT NOT NULL,
    file_type VARCHAR(100) NOT NULL,
    upload_status VARCHAR(50) NOT NULL DEFAULT 'pending' CHECK (upload_status IN ('pending', 'uploaded', 'processed', 'failed')),
    file_path VARCHAR(500) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Intake responses table
CREATE TABLE intake_responses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migration_id UUID NOT NULL REFERENCES migrations(id) ON DELETE CASCADE,
    current_software VARCHAR(255) NOT NULL,
    target_software VARCHAR(255) NOT NULL,
    urgency VARCHAR(50) NOT NULL CHECK (urgency IN ('low', 'medium', 'high', 'critical')),
    data_preservation_requirements TEXT[] NOT NULL,
    additional_notes TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- AI analyses table
CREATE TABLE ai_analyses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    migration_id UUID NOT NULL REFERENCES migrations(id) ON DELETE CASCADE,
    analysis_type VARCHAR(100) NOT NULL CHECK (analysis_type IN ('intake_summary', 'file_analysis', 'migration_plan')),
    content TEXT NOT NULL,
    metadata JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Migration progress table
CREATE TABLE migration_progress (
    migration_id UUID PRIMARY KEY REFERENCES migrations(id) ON DELETE CASCADE,
    current_step VARCHAR(255) NOT NULL DEFAULT 'Getting Started',
    progress_percentage INTEGER NOT NULL DEFAULT 0 CHECK (progress_percentage >= 0 AND progress_percentage <= 100),
    estimated_time_remaining VARCHAR(100),
    last_updated TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_migrations_user_id ON migrations(user_id);
CREATE INDEX idx_migrations_status ON migrations(status);
CREATE INDEX idx_files_migration_id ON files(migration_id);
CREATE INDEX idx_intake_responses_migration_id ON intake_responses(migration_id);
CREATE INDEX idx_ai_analyses_migration_id ON ai_analyses(migration_id);
CREATE INDEX idx_ai_analyses_type ON ai_analyses(analysis_type);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_migrations_updated_at BEFORE UPDATE ON migrations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE files ENABLE ROW LEVEL SECURITY;
ALTER TABLE intake_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE ai_analyses ENABLE ROW LEVEL SECURITY;
ALTER TABLE migration_progress ENABLE ROW LEVEL SECURITY;

-- Users can only access their own data
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid()::text = id::text);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid()::text = id::text);

-- Migrations policies
CREATE POLICY "Users can view own migrations" ON migrations
    FOR SELECT USING (auth.uid()::text = user_id::text);

CREATE POLICY "Users can create own migrations" ON migrations
    FOR INSERT WITH CHECK (auth.uid()::text = user_id::text);

CREATE POLICY "Users can update own migrations" ON migrations
    FOR UPDATE USING (auth.uid()::text = user_id::text);

-- Files policies
CREATE POLICY "Users can view own files" ON files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM migrations 
            WHERE migrations.id = files.migration_id 
            AND migrations.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can create own files" ON files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM migrations 
            WHERE migrations.id = files.migration_id 
            AND migrations.user_id::text = auth.uid()::text
        )
    );

-- Intake responses policies
CREATE POLICY "Users can view own intake responses" ON intake_responses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM migrations 
            WHERE migrations.id = intake_responses.migration_id 
            AND migrations.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can create own intake responses" ON intake_responses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM migrations 
            WHERE migrations.id = intake_responses.migration_id 
            AND migrations.user_id::text = auth.uid()::text
        )
    );

-- AI analyses policies
CREATE POLICY "Users can view own ai analyses" ON ai_analyses
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM migrations 
            WHERE migrations.id = ai_analyses.migration_id 
            AND migrations.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can create own ai analyses" ON ai_analyses
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM migrations 
            WHERE migrations.id = ai_analyses.migration_id 
            AND migrations.user_id::text = auth.uid()::text
        )
    );

-- Migration progress policies
CREATE POLICY "Users can view own migration progress" ON migration_progress
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM migrations 
            WHERE migrations.id = migration_progress.migration_id 
            AND migrations.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can update own migration progress" ON migration_progress
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM migrations 
            WHERE migrations.id = migration_progress.migration_id 
            AND migrations.user_id::text = auth.uid()::text
        )
    );

CREATE POLICY "Users can insert own migration progress" ON migration_progress
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM migrations 
            WHERE migrations.id = migration_progress.migration_id 
            AND migrations.user_id::text = auth.uid()::text
        )
    );

-- Insert sample data for testing (optional)
INSERT INTO users (id, email, name, company_name) VALUES 
    ('demo-user-123', 'demo@escaperamp.com', 'Demo User', 'Demo Company');

-- Create a function to get migration progress
CREATE OR REPLACE FUNCTION get_migration_progress(migration_uuid UUID)
RETURNS TABLE (
    migration_id UUID,
    current_step VARCHAR,
    progress_percentage INTEGER,
    estimated_time_remaining VARCHAR,
    last_updated TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        mp.migration_id,
        mp.current_step,
        mp.progress_percentage,
        mp.estimated_time_remaining,
        mp.last_updated
    FROM migration_progress mp
    WHERE mp.migration_id = migration_uuid;
END;
$$ LANGUAGE plpgsql; 