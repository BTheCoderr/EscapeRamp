-- Support Portal Database Schema
-- This schema handles support tickets, messages, and related functionality

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Support Tickets Table
CREATE TABLE IF NOT EXISTS support_tickets (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'in-progress', 'resolved', 'closed')),
    priority VARCHAR(50) NOT NULL DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
    category VARCHAR(50) NOT NULL DEFAULT 'general' CHECK (category IN ('migration', 'technical', 'billing', 'general')),
    user_email VARCHAR(255) NOT NULL,
    assigned_to VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    resolved_at TIMESTAMP WITH TIME ZONE,
    estimated_resolution TIMESTAMP WITH TIME ZONE,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}'
);

-- Support Messages Table
CREATE TABLE IF NOT EXISTS support_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL CHECK (sender IN ('user', 'support')),
    message TEXT NOT NULL,
    timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    attachments TEXT[] DEFAULT '{}',
    is_internal BOOLEAN DEFAULT FALSE,
    metadata JSONB DEFAULT '{}'
);

-- Support Ticket Attachments Table
CREATE TABLE IF NOT EXISTS support_attachments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    message_id UUID REFERENCES support_messages(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size BIGINT NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    uploaded_by VARCHAR(255) NOT NULL,
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Support Knowledge Base Table
CREATE TABLE IF NOT EXISTS support_knowledge_base (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    tags TEXT[] DEFAULT '{}',
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by VARCHAR(255) NOT NULL,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0
);

-- Support FAQ Table
CREATE TABLE IF NOT EXISTS support_faq (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    priority INTEGER DEFAULT 0,
    is_published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    helpful_count INTEGER DEFAULT 0,
    not_helpful_count INTEGER DEFAULT 0
);

-- Support Ticket Categories Table
CREATE TABLE IF NOT EXISTS support_categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(100) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#3B82F6',
    icon VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Ticket Priorities Table
CREATE TABLE IF NOT EXISTS support_priorities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    color VARCHAR(7) DEFAULT '#6B7280',
    sla_hours INTEGER,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Team Members Table
CREATE TABLE IF NOT EXISTS support_team (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    role VARCHAR(100) NOT NULL DEFAULT 'support_agent',
    specialties TEXT[] DEFAULT '{}',
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Support Ticket Assignments Table
CREATE TABLE IF NOT EXISTS support_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    team_member_id UUID NOT NULL REFERENCES support_team(id) ON DELETE CASCADE,
    assigned_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    assigned_by VARCHAR(255) NOT NULL,
    notes TEXT,
    UNIQUE(ticket_id, team_member_id)
);

-- Support Ticket History Table
CREATE TABLE IF NOT EXISTS support_ticket_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    ticket_id UUID NOT NULL REFERENCES support_tickets(id) ON DELETE CASCADE,
    action VARCHAR(100) NOT NULL,
    field_name VARCHAR(100),
    old_value TEXT,
    new_value TEXT,
    changed_by VARCHAR(255) NOT NULL,
    changed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'
);

-- Support Ticket Metrics Table
CREATE TABLE IF NOT EXISTS support_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    date DATE NOT NULL,
    total_tickets INTEGER DEFAULT 0,
    open_tickets INTEGER DEFAULT 0,
    resolved_tickets INTEGER DEFAULT 0,
    avg_resolution_time_hours DECIMAL(10,2) DEFAULT 0,
    avg_response_time_hours DECIMAL(10,2) DEFAULT 0,
    customer_satisfaction_score DECIMAL(3,2) DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(date)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_support_tickets_user_email ON support_tickets(user_email);
CREATE INDEX IF NOT EXISTS idx_support_tickets_status ON support_tickets(status);
CREATE INDEX IF NOT EXISTS idx_support_tickets_priority ON support_tickets(priority);
CREATE INDEX IF NOT EXISTS idx_support_tickets_category ON support_tickets(category);
CREATE INDEX IF NOT EXISTS idx_support_tickets_created_at ON support_tickets(created_at);
CREATE INDEX IF NOT EXISTS idx_support_tickets_assigned_to ON support_tickets(assigned_to);

CREATE INDEX IF NOT EXISTS idx_support_messages_ticket_id ON support_messages(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_messages_timestamp ON support_messages(timestamp);
CREATE INDEX IF NOT EXISTS idx_support_messages_sender ON support_messages(sender);

CREATE INDEX IF NOT EXISTS idx_support_attachments_ticket_id ON support_attachments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_attachments_message_id ON support_attachments(message_id);

CREATE INDEX IF NOT EXISTS idx_support_knowledge_base_category ON support_knowledge_base(category);
CREATE INDEX IF NOT EXISTS idx_support_knowledge_base_tags ON support_knowledge_base USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_support_knowledge_base_published ON support_knowledge_base(is_published);

CREATE INDEX IF NOT EXISTS idx_support_faq_category ON support_faq(category);
CREATE INDEX IF NOT EXISTS idx_support_faq_published ON support_faq(is_published);

CREATE INDEX IF NOT EXISTS idx_support_assignments_ticket_id ON support_assignments(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_assignments_team_member_id ON support_assignments(team_member_id);

CREATE INDEX IF NOT EXISTS idx_support_ticket_history_ticket_id ON support_ticket_history(ticket_id);
CREATE INDEX IF NOT EXISTS idx_support_ticket_history_changed_at ON support_ticket_history(changed_at);

CREATE INDEX IF NOT EXISTS idx_support_metrics_date ON support_metrics(date);

-- Triggers for automatic timestamp updates
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_support_tickets_updated_at 
    BEFORE UPDATE ON support_tickets 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_knowledge_base_updated_at 
    BEFORE UPDATE ON support_knowledge_base 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_faq_updated_at 
    BEFORE UPDATE ON support_faq 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_support_team_updated_at 
    BEFORE UPDATE ON support_team 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger to update ticket history when ticket is modified
CREATE OR REPLACE FUNCTION log_ticket_changes()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'UPDATE' THEN
        IF OLD.status != NEW.status THEN
            INSERT INTO support_ticket_history (ticket_id, action, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'status_change', 'status', OLD.status, NEW.status, COALESCE(NEW.assigned_to, 'system'));
        END IF;
        
        IF OLD.priority != NEW.priority THEN
            INSERT INTO support_ticket_history (ticket_id, action, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'priority_change', 'priority', OLD.priority, NEW.priority, COALESCE(NEW.assigned_to, 'system'));
        END IF;
        
        IF OLD.assigned_to != NEW.assigned_to THEN
            INSERT INTO support_ticket_history (ticket_id, action, field_name, old_value, new_value, changed_by)
            VALUES (NEW.id, 'assignment_change', 'assigned_to', OLD.assigned_to, NEW.assigned_to, COALESCE(NEW.assigned_to, 'system'));
        END IF;
    END IF;
    
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER log_support_ticket_changes
    AFTER UPDATE ON support_tickets
    FOR EACH ROW EXECUTE FUNCTION log_ticket_changes();

-- Function to calculate support metrics
CREATE OR REPLACE FUNCTION calculate_daily_support_metrics(target_date DATE DEFAULT CURRENT_DATE)
RETURNS VOID AS $$
BEGIN
    INSERT INTO support_metrics (
        date,
        total_tickets,
        open_tickets,
        resolved_tickets,
        avg_resolution_time_hours,
        avg_response_time_hours
    )
    SELECT 
        target_date,
        COUNT(*) as total_tickets,
        COUNT(*) FILTER (WHERE status IN ('open', 'in-progress')) as open_tickets,
        COUNT(*) FILTER (WHERE status = 'resolved') as resolved_tickets,
        AVG(EXTRACT(EPOCH FROM (resolved_at - created_at)) / 3600) FILTER (WHERE status = 'resolved') as avg_resolution_time_hours,
        AVG(EXTRACT(EPOCH FROM (
            SELECT MIN(timestamp) FROM support_messages 
            WHERE ticket_id = t.id AND sender = 'support'
        ) - created_at) / 3600) as avg_response_time_hours
    FROM support_tickets t
    WHERE DATE(created_at) = target_date
    ON CONFLICT (date) DO UPDATE SET
        total_tickets = EXCLUDED.total_tickets,
        open_tickets = EXCLUDED.open_tickets,
        resolved_tickets = EXCLUDED.resolved_tickets,
        avg_resolution_time_hours = EXCLUDED.avg_resolution_time_hours,
        avg_response_time_hours = EXCLUDED.avg_response_time_hours;
END;
$$ language 'plpgsql';

-- Insert default categories
INSERT INTO support_categories (name, description, color, icon) VALUES
('migration', 'QuickBooks migration related issues', '#10B981', 'migration'),
('technical', 'Technical problems and bugs', '#EF4444', 'bug'),
('billing', 'Billing and payment questions', '#F59E0B', 'credit-card'),
('general', 'General questions and support', '#3B82F6', 'help-circle')
ON CONFLICT (name) DO NOTHING;

-- Insert default priorities
INSERT INTO support_priorities (name, description, color, sla_hours) VALUES
('low', 'Low priority issues', '#10B981', 72),
('medium', 'Medium priority issues', '#F59E0B', 24),
('high', 'High priority issues', '#EF4444', 4),
('urgent', 'Urgent issues requiring immediate attention', '#DC2626', 1)
ON CONFLICT (name) DO NOTHING;

-- Insert default team members
INSERT INTO support_team (name, email, role, specialties) VALUES
('Sarah Mitchell', 'sarah@escaperamp.com', 'senior_support', ARRAY['migration', 'technical']),
('Thomas Chen', 'thomas@escaperamp.com', 'support_agent', ARRAY['technical', 'billing']),
('Dante Rodriguez', 'dante@escaperamp.com', 'support_agent', ARRAY['migration', 'general'])
ON CONFLICT (email) DO NOTHING;

-- Row Level Security (RLS) policies
ALTER TABLE support_tickets ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE support_attachments ENABLE ROW LEVEL SECURITY;

-- Users can only see their own tickets
CREATE POLICY "Users can view own tickets" ON support_tickets
    FOR SELECT USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Users can create tickets
CREATE POLICY "Users can create tickets" ON support_tickets
    FOR INSERT WITH CHECK (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Users can update their own tickets
CREATE POLICY "Users can update own tickets" ON support_tickets
    FOR UPDATE USING (user_email = current_setting('request.jwt.claims', true)::json->>'email');

-- Users can only see messages for their tickets
CREATE POLICY "Users can view own ticket messages" ON support_messages
    FOR SELECT USING (
        ticket_id IN (
            SELECT id FROM support_tickets 
            WHERE user_email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Users can create messages for their tickets
CREATE POLICY "Users can create messages for own tickets" ON support_messages
    FOR INSERT WITH CHECK (
        ticket_id IN (
            SELECT id FROM support_tickets 
            WHERE user_email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Users can only see attachments for their tickets
CREATE POLICY "Users can view own ticket attachments" ON support_attachments
    FOR SELECT USING (
        ticket_id IN (
            SELECT id FROM support_tickets 
            WHERE user_email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    );

-- Users can upload attachments for their tickets
CREATE POLICY "Users can upload attachments for own tickets" ON support_attachments
    FOR INSERT WITH CHECK (
        ticket_id IN (
            SELECT id FROM support_tickets 
            WHERE user_email = current_setting('request.jwt.claims', true)::json->>'email'
        )
    ); 