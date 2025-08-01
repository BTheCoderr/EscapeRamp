-- Simple QuickBooks parsing schema
-- Run this in your Supabase SQL Editor

create table migrations (
  id uuid primary key default gen_random_uuid(),
  user_id text,
  filename text,
  status text default 'pending',
  created_at timestamp default now()
);

create table qb_entities (
  id uuid primary key default gen_random_uuid(),
  migration_id uuid references migrations(id),
  entity_type text,
  legacy_id text,
  name text,
  mapped_account text,
  amount numeric,
  date date,
  memo text,
  notes text,
  requires_review boolean,
  raw_json jsonb,
  row_index int,
  created_at timestamp default now()
);

-- Add indexes for performance
create index idx_migrations_user_id on migrations(user_id);
create index idx_migrations_status on migrations(status);
create index idx_qb_entities_migration_id on qb_entities(migration_id);
create index idx_qb_entities_requires_review on qb_entities(requires_review);

-- Enable RLS (Row Level Security)
alter table migrations enable row level security;
alter table qb_entities enable row level security;

-- Create policies (basic - you can enhance these)
create policy "Users can view own migrations" on migrations
  for select using (true);

create policy "Users can insert own migrations" on migrations
  for insert with check (true);

create policy "Users can view own qb entities" on qb_entities
  for select using (true);

create policy "Users can insert own qb entities" on qb_entities
  for insert with check (true); 