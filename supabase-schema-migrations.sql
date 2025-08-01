-- Migration parsing schema for Claude integration
-- This schema stores parsed QuickBooks exports and review state

CREATE TABLE migrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  filename text NOT NULL,
  file_url text,
  uploaded_at timestamp default now(),
  status text default 'pending' CHECK (status IN ('pending', 'parsing', 'parsed', 'review_required', 'completed', 'error')),
  error text,
  total_rows integer,
  requires_review_count integer default 0,
  parsed_at timestamp
);

CREATE TABLE qb_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_id uuid REFERENCES migrations(id) ON DELETE CASCADE,
  entity_type text NOT NULL,
  legacy_id text,
  name text,
  mapped_account text,
  amount numeric,
  date date,
  memo text,
  notes text,
  requires_review boolean DEFAULT false,
  review_reason text,
  raw_json jsonb,
  row_index integer,
  created_at timestamp default now()
);

-- Indexes for performance
CREATE INDEX idx_migrations_user_id ON migrations(user_id);
CREATE INDEX idx_migrations_status ON migrations(status);
CREATE INDEX idx_qb_entities_migration_id ON qb_entities(migration_id);
CREATE INDEX idx_qb_entities_requires_review ON qb_entities(requires_review);

-- RLS policies
ALTER TABLE migrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE qb_entities ENABLE ROW LEVEL SECURITY;

-- Users can only see their own migrations
CREATE POLICY "Users can view own migrations" ON migrations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own migrations" ON migrations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own migrations" ON migrations
  FOR UPDATE USING (auth.uid() = user_id);

-- Users can only see entities from their migrations
CREATE POLICY "Users can view own qb entities" ON qb_entities
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM migrations 
      WHERE migrations.id = qb_entities.migration_id 
      AND migrations.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own qb entities" ON qb_entities
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM migrations 
      WHERE migrations.id = qb_entities.migration_id 
      AND migrations.user_id = auth.uid()
    )
  );

-- Function to update migration status and counts
CREATE OR REPLACE FUNCTION update_migration_stats()
RETURNS TRIGGER AS $$
BEGIN
  -- Update the migration with parsed stats
  UPDATE migrations 
  SET 
    status = CASE 
      WHEN EXISTS (SELECT 1 FROM qb_entities WHERE migration_id = NEW.migration_id AND requires_review = true)
      THEN 'review_required'
      ELSE 'parsed'
    END,
    total_rows = (SELECT COUNT(*) FROM qb_entities WHERE migration_id = NEW.migration_id),
    requires_review_count = (SELECT COUNT(*) FROM qb_entities WHERE migration_id = NEW.migration_id AND requires_review = true),
    parsed_at = now()
  WHERE id = NEW.migration_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update migration stats when entities are inserted
CREATE TRIGGER update_migration_stats_trigger
  AFTER INSERT ON qb_entities
  FOR EACH ROW
  EXECUTE FUNCTION update_migration_stats(); 