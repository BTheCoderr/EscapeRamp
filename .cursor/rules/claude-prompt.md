# Claude Prompt for QuickBooks Parsing

## RULE: Parse QuickBooks export with Claude

### WHEN user uploads QuickBooks file THEN:
1. **Call Claude API** with the following prompt
2. **Parse response** into structured JSON
3. **Save to Supabase** in qb_entities table

### Claude Prompt Template:
```
You are Escape Ramp's migration assistant.

User uploaded a QuickBooks Desktop export (.IIF or .CSV).  
Task:
1. Identify entity types (Invoice, Customer, Account, etc.).  
2. For each entry, output JSON array matching:
[
  {
    "entityType": "...",
    "legacyId": "...",
    "name": "...",
    "mappedAccount": "...",
    "amount": ...,
    "date": "...",
    "memo": "...",
    "notes": "...",
    "requiresReview": false
  }
]
3. If export appears truncated or unsupported types found, flag "requiresReview": true with an explanation field.

Raw export data:
{{PASTE RAW IIF/CSV HERE}}
```

### API Endpoint:
- `POST /api/parse` - Handles file parsing
- Requires: `{ userId, fileUrl }`
- Returns: `{ ok: true, migrationId, parseResult }`

### Database Schema:
```sql
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
```

### Frontend Integration:
```typescript
await fetch("/api/parse", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ userId, fileUrl }),
});
```

### QuickBooks Limitations to Flag:
- **Row limit**: ~32,000 rows → multi-part export needed
- **IIF only exports lists** — not transactions
- **No attachments** or user permissions exported
- **Multi-currency not supported** in built-in export
- **Relationships** (invoice ↔ payment) not preserved in IIF 