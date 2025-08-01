# QuickBooks Export Parsing Rules

## RULE: Parse QuickBooks export → Save to Supabase

### WHEN user uploads QuickBooks file THEN:
1. **Fetch and store file** in Supabase Storage
2. **Call Claude prompt** (from rule template)
3. **For each parsed row**, insert into `qb_entities`
4. **Return status** to UI

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
3. If export appears truncated or unsupported types found, flag `"requiresReview": true` with explanation.
```

### QuickBooks Limitations to Flag:
- **Row limit**: ~32,000 rows → multi-part export needed
- **IIF only exports lists** — not transactions
- **No attachments** or user permissions exported
- **Multi-currency not supported** in built-in export
- **Relationships** (invoice ↔ payment) not preserved in IIF

### Fallback Rules:
- IF `requires_review: true` THEN send alert in pipeline
- IF parsing fails THEN log error and notify user
- IF file too large THEN suggest splitting

### Database Schema:
```sql
CREATE TABLE migrations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id),
  filename text,
  uploaded_at timestamp default now(),
  status text default 'pending',
  error text
);

CREATE TABLE qb_entities (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  migration_id uuid REFERENCES migrations(id) ON DELETE CASCADE,
  entity_type text,
  legacy_id text,
  name text,
  mapped_account text,
  amount numeric,
  date date,
  memo text,
  notes text,
  requires_review boolean DEFAULT false,
  raw_json jsonb,
  row_index integer
);
```

### API Endpoints:
- `POST /api/migrations/parse` - Parse uploaded file
- `GET /api/migrations/parse?migrationId=...` - Get parsed results

### Component Integration:
- Use `QuickBooksUpload` component for file handling
- Display parsing progress and results
- Show complexity analysis and recommendations 