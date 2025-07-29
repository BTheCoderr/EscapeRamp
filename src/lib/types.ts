export interface User {
  id: string;
  email: string;
  name: string;
  company_name?: string;
  created_at: string;
  updated_at: string;
}

export interface Migration {
  id: string;
  user_id: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  source_software: string;
  target_software: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  data_preservation_requirements: string[];
  estimated_completion_date?: string;
  created_at: string;
  updated_at: string;
}

export interface File {
  id: string;
  migration_id: string;
  filename: string;
  file_size: number;
  file_type: string;
  upload_status: 'pending' | 'uploaded' | 'processed' | 'failed';
  file_path: string;
  created_at: string;
}

export interface IntakeResponse {
  id: string;
  migration_id: string;
  current_software: string;
  target_software: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
  data_preservation_requirements: string[];
  additional_notes?: string;
  ai_summary?: string;
  created_at: string;
}

export interface AIAnalysis {
  id: string;
  migration_id: string;
  analysis_type: 'intake_summary' | 'file_analysis' | 'migration_plan';
  content: string;
  metadata?: Record<string, any>;
  created_at: string;
}

export interface MigrationProgress {
  migration_id: string;
  current_step: string;
  progress_percentage: number;
  estimated_time_remaining?: string;
  last_updated: string;
}

export type MigrationStatus = 'pending' | 'in_progress' | 'completed' | 'failed';
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';
export type FileUploadStatus = 'pending' | 'uploaded' | 'processed' | 'failed'; 