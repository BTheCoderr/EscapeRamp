-- Escape Ramp Document Storage Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Documents table for storing uploaded files
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  original_filename TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  mime_type TEXT,
  storage_path TEXT NOT NULL,
  upload_status TEXT NOT NULL DEFAULT 'uploaded' CHECK (upload_status IN ('uploaded', 'processing', 'completed', 'failed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Parsed invoices table for storing extracted data
CREATE TABLE parsed_invoices (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  vendor_name TEXT,
  invoice_date DATE,
  invoice_number TEXT,
  total_amount DECIMAL(10,2),
  currency TEXT DEFAULT 'USD',
  line_items JSONB,
  extracted_text TEXT,
  confidence_score DECIMAL(3,2),
  processing_time DECIMAL(5,2),
  raw_ai_response JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Document processing logs
CREATE TABLE document_processing_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  document_id UUID REFERENCES documents(id) ON DELETE CASCADE,
  status TEXT NOT NULL,
  message TEXT,
  error_details JSONB,
  processing_time DECIMAL(5,2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_documents_user_id ON documents(user_id);
CREATE INDEX idx_documents_upload_status ON documents(upload_status);
CREATE INDEX idx_documents_created_at ON documents(created_at);
CREATE INDEX idx_parsed_invoices_document_id ON parsed_invoices(document_id);
CREATE INDEX idx_parsed_invoices_vendor_name ON parsed_invoices(vendor_name);
CREATE INDEX idx_parsed_invoices_invoice_date ON parsed_invoices(invoice_date);
CREATE INDEX idx_processing_logs_document_id ON document_processing_logs(document_id);

-- Create updated_at trigger function (if not exists)
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_parsed_invoices_updated_at BEFORE UPDATE ON parsed_invoices
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security (RLS) policies
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE parsed_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE document_processing_logs ENABLE ROW LEVEL SECURITY;

-- Documents policies
CREATE POLICY "Users can view their own documents" ON documents
    FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own documents" ON documents
    FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own documents" ON documents
    FOR UPDATE USING (auth.uid() = user_id);

-- Parsed invoices policies
CREATE POLICY "Users can view their own parsed invoices" ON parsed_invoices
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = parsed_invoices.document_id 
            AND documents.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can insert parsed invoices for their documents" ON parsed_invoices
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = parsed_invoices.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Processing logs policies
CREATE POLICY "Users can view logs for their documents" ON document_processing_logs
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM documents 
            WHERE documents.id = document_processing_logs.document_id 
            AND documents.user_id = auth.uid()
        )
    );

-- Function to get document with parsed data
CREATE OR REPLACE FUNCTION get_document_with_parsed_data(doc_id UUID)
RETURNS TABLE (
    document_id UUID,
    filename TEXT,
    file_type TEXT,
    upload_status TEXT,
    vendor_name TEXT,
    invoice_date DATE,
    invoice_number TEXT,
    total_amount DECIMAL(10,2),
    confidence_score DECIMAL(3,2),
    created_at TIMESTAMP WITH TIME ZONE
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        d.id,
        d.filename,
        d.file_type,
        d.upload_status,
        pi.vendor_name,
        pi.invoice_date,
        pi.invoice_number,
        pi.total_amount,
        pi.confidence_score,
        d.created_at
    FROM documents d
    LEFT JOIN parsed_invoices pi ON d.id = pi.document_id
    WHERE d.id = doc_id;
END;
$$ LANGUAGE plpgsql;

-- Function to get user's document summary
CREATE OR REPLACE FUNCTION get_user_document_summary(user_uuid UUID)
RETURNS TABLE (
    total_documents BIGINT,
    processed_documents BIGINT,
    total_invoices DECIMAL(10,2),
    avg_confidence DECIMAL(3,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COUNT(d.id) as total_documents,
        COUNT(CASE WHEN d.upload_status = 'completed' THEN 1 END) as processed_documents,
        COALESCE(SUM(pi.total_amount), 0) as total_invoices,
        COALESCE(AVG(pi.confidence_score), 0) as avg_confidence
    FROM documents d
    LEFT JOIN parsed_invoices pi ON d.id = pi.document_id
    WHERE d.user_id = user_uuid;
END;
$$ LANGUAGE plpgsql;

-- Insert sample data for testing
INSERT INTO documents (user_id, filename, original_filename, file_size, file_type, mime_type, storage_path, upload_status) VALUES
    ('00000000-0000-0000-0000-000000000000', 'sample_invoice.pdf', 'invoice_001.pdf', 1024000, 'pdf', 'application/pdf', 'uploads/sample_invoice.pdf', 'completed'),
    ('00000000-0000-0000-0000-000000000000', 'receipt.jpg', 'receipt_001.jpg', 512000, 'jpg', 'image/jpeg', 'uploads/receipt.jpg', 'completed');

INSERT INTO parsed_invoices (document_id, vendor_name, invoice_date, invoice_number, total_amount, line_items, extracted_text, confidence_score, processing_time) VALUES
    ((SELECT id FROM documents WHERE filename = 'sample_invoice.pdf'), 'ABC Supplies Co.', '2024-01-15', 'INV-2024-001', 1250.00, '[{"description": "Office Supplies", "quantity": 5, "unit_price": 250.00, "total": 1250.00}]', 'Sample extracted text...', 0.95, 2.3),
    ((SELECT id FROM documents WHERE filename = 'receipt.jpg'), 'XYZ Services Inc.', '2024-01-10', 'REC-2024-001', 450.00, '[{"description": "Consulting Services", "quantity": 1, "unit_price": 450.00, "total": 450.00}]', 'Sample extracted text...', 0.88, 1.8); 