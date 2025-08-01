import Anthropic from '@anthropic-ai/sdk';

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
});

export interface QBEntity {
  entityType: string;
  legacyId?: string;
  name?: string;
  mappedAccount?: string;
  amount?: number;
  date?: string;
  memo?: string;
  notes?: string;
  requiresReview: boolean;
  reviewReason?: string;
}

export interface QBParseResult {
  entities: QBEntity[];
  summary: {
    totalRows: number;
    requiresReview: number;
    entityTypes: Record<string, number>;
    warnings: string[];
  };
}

const QB_PARSE_PROMPT = `You are Escape Ramp's migration assistant, an expert in QuickBooks Desktop data parsing and migration.

TASK: Parse a QuickBooks Desktop export file (.IIF or .CSV) and extract structured data for migration.

INPUT: QuickBooks export content (IIF format or CSV)

OUTPUT: JSON array of parsed entities with the following structure:

[
  {
    "entityType": "Invoice|Customer|Account|Item|Transaction|Vendor|Employee|Class|Location",
    "legacyId": "Original QB ID if available",
    "name": "Entity name or description",
    "mappedAccount": "Suggested target account mapping",
    "amount": 123.45,
    "date": "YYYY-MM-DD",
    "memo": "Transaction memo or notes",
    "notes": "Additional parsing notes",
    "requiresReview": false,
    "reviewReason": "Explanation if requiresReview is true"
  }
]

PARSING RULES:
1. Identify entity types from IIF headers (INV, CUST, ACCT, ITEM, etc.)
2. Map common QuickBooks fields to our structure
3. Handle currency amounts (remove $, commas, convert to numbers)
4. Parse dates (convert to YYYY-MM-DD format)
5. Flag items requiring review:
   - Unsupported entity types
   - Missing required fields
   - Data format issues
   - Truncated exports
   - Multi-currency entries
   - Complex relationships

QUICKBOOKS LIMITATIONS TO FLAG:
- IIF exports limited to ~32,000 rows
- No attachments or user permissions
- Multi-currency not supported in basic export
- Relationships (invoice ↔ payment) not preserved
- Only lists exported, not full transaction history

Parse the following QuickBooks export:

`;

export async function parseQuickBooksExport(exportContent: string): Promise<QBParseResult> {
  try {
    const prompt = QB_PARSE_PROMPT + exportContent;

    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4000,
      temperature: 0.1,
      messages: [
        {
          role: 'user',
          content: prompt
        }
      ]
    });

    const content = response.content[0];
    if (content.type !== 'text') {
      throw new Error('Unexpected response type from Claude');
    }

    // Parse the JSON response
    const entities: QBEntity[] = JSON.parse(content.text);

    // Generate summary
    const summary = {
      totalRows: entities.length,
      requiresReview: entities.filter(e => e.requiresReview).length,
      entityTypes: entities.reduce((acc, entity) => {
        acc[entity.entityType] = (acc[entity.entityType] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
      warnings: entities
        .filter(e => e.requiresReview)
        .map(e => e.reviewReason)
        .filter(Boolean) as string[]
    };

    return {
      entities,
      summary
    };

  } catch (error) {
    console.error('Error parsing QuickBooks export:', error);
    throw new Error(`Failed to parse QuickBooks export: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

export async function analyzeMigrationComplexity(entities: QBEntity[]): Promise<{
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedHours: number;
  risks: string[];
  recommendations: string[];
}> {
  const totalEntities = entities.length;
  const reviewRequired = entities.filter(e => e.requiresReview).length;
  const entityTypeCount = Object.keys(entities.reduce((acc, e) => {
    acc[e.entityType] = true;
    return acc;
  }, {} as Record<string, boolean>)).length;

  let complexity: 'simple' | 'moderate' | 'complex' = 'simple';
  let estimatedHours = 2;

  if (totalEntities > 10000 || reviewRequired > 100) {
    complexity = 'complex';
    estimatedHours = 8;
  } else if (totalEntities > 5000 || reviewRequired > 50 || entityTypeCount > 5) {
    complexity = 'moderate';
    estimatedHours = 4;
  }

  const risks: string[] = [];
  const recommendations: string[] = [];

  if (reviewRequired > 0) {
    risks.push(`${reviewRequired} items require manual review`);
    recommendations.push('Review flagged items before proceeding');
  }

  if (totalEntities > 32000) {
    risks.push('Export may be truncated (QB limit: ~32,000 rows)');
    recommendations.push('Consider splitting into multiple exports');
  }

  if (entities.some(e => e.entityType === 'Transaction')) {
    risks.push('Transaction relationships may not be preserved');
    recommendations.push('Verify transaction matching after migration');
  }

  return {
    complexity,
    estimatedHours,
    risks,
    recommendations
  };
} 