import { IntakeResponse, AIAnalysis } from './types';

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = process.env.ANTHROPIC_API_KEY!;
    this.baseUrl = 'https://api.anthropic.com/v1/messages';
  }

  async analyzeIntake(intakeResponse: IntakeResponse): Promise<string> {
    const prompt = this.buildIntakeAnalysisPrompt(intakeResponse);
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1000,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('AI analysis failed:', error);
      throw new Error('Failed to analyze intake response');
    }
  }

  async generateMigrationPlan(migrationId: string, intakeSummary: string): Promise<string> {
    const prompt = this.buildMigrationPlanPrompt(intakeSummary);
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 1500,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('Migration plan generation failed:', error);
      throw new Error('Failed to generate migration plan');
    }
  }

  async analyzeFile(fileContent: string, fileName: string): Promise<string> {
    const prompt = this.buildFileAnalysisPrompt(fileContent, fileName);
    
    try {
      const response = await fetch(this.baseUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': this.apiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          max_tokens: 800,
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.status}`);
      }

      const data = await response.json();
      return data.content[0].text;
    } catch (error) {
      console.error('File analysis failed:', error);
      throw new Error('Failed to analyze file');
    }
  }

  private buildIntakeAnalysisPrompt(intakeResponse: IntakeResponse): string {
    return `You are an expert migration consultant for "Escape Ramp," a SaaS tool helping small businesses migrate off QuickBooks Desktop.

Please analyze this intake response and provide a comprehensive summary:

**Current Software:** ${intakeResponse.current_software}
**Target Software:** ${intakeResponse.target_software}
**Urgency Level:** ${intakeResponse.urgency}
**Data Preservation Requirements:** ${intakeResponse.data_preservation_requirements.join(', ')}
**Additional Notes:** ${intakeResponse.additional_notes || 'None'}

Please provide:
1. A concise summary of the migration scope
2. Key challenges and considerations
3. Recommended approach and timeline
4. Any immediate action items

Format your response in a clear, structured manner suitable for both technical and business stakeholders.`;
  }

  private buildMigrationPlanPrompt(intakeSummary: string): string {
    return `Based on this intake summary:

${intakeSummary}

Please create a detailed migration plan that includes:

1. **Pre-Migration Checklist**
   - Data backup requirements
   - System compatibility checks
   - User training needs

2. **Migration Steps**
   - Step-by-step process
   - Estimated time for each step
   - Risk mitigation strategies

3. **Post-Migration Tasks**
   - Data validation procedures
   - User acceptance testing
   - Go-live support plan

4. **Timeline and Milestones**
   - Realistic timeline based on urgency
   - Key milestones and deliverables
   - Resource requirements

Please provide this in a structured format that can be easily followed by both technical and business teams.`;
  }

  private buildFileAnalysisPrompt(fileContent: string, fileName: string): string {
    return `You are analyzing a file for migration purposes.

**File Name:** ${fileName}

Please analyze this file content and provide:
1. File type and format identification
2. Key data structures and relationships
3. Potential migration challenges
4. Recommended handling approach
5. Data validation requirements

File Content:
${fileContent.substring(0, 2000)}${fileContent.length > 2000 ? '...' : ''}

Provide a concise analysis focused on migration implications.`;
  }
}

export const aiService = new AIService(); 