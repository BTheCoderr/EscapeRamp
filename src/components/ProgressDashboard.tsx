'use client';

import { useState, useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { formatDate, getStatusColor, getUrgencyColor } from '@/lib/utils';
import { 
  CheckCircle, 
  Clock, 
  FileText, 
  Upload, 
  Brain, 
  AlertCircle,
  ChevronDown,
  ChevronUp
} from 'lucide-react';

interface MigrationProgress {
  percentage: number;
  current_step: string;
  completed_steps: number;
  total_steps: number;
  estimated_time_remaining?: string;
}

interface MigrationWithProgress {
  id: string;
  status: string;
  source_software: string;
  target_software: string;
  urgency: string;
  created_at: string;
  progress: MigrationProgress;
  intake_responses?: unknown[];
  files?: unknown[];
  ai_analyses?: unknown[];
}

export function ProgressDashboard() {
  const [migrations, setMigrations] = useState<MigrationWithProgress[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedMigration, setExpandedMigration] = useState<string | null>(null);
  // const { currentMigration } = useAppStore();

  useEffect(() => {
    fetchProgress();
  }, []);

  const fetchProgress = async () => {
    try {
      const response = await fetch('/api/progress?user_id=demo-user-123');
      if (response.ok) {
        const data = await response.json();
        setMigrations(data.data || []);
      }
    } catch (error) {
      console.error('Failed to fetch progress:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleExpanded = (migrationId: string) => {
    setExpandedMigration(expandedMigration === migrationId ? null : migrationId);
  };

  const getStepIcon = (step: string) => {
    switch (step) {
      case 'Getting Started':
        return <FileText className="w-5 h-5" />;
      case 'Intake Submitted':
        return <CheckCircle className="w-5 h-5" />;
      case 'Files Uploaded':
        return <Upload className="w-5 h-5" />;
      case 'AI Analysis Complete':
        return <Brain className="w-5 h-5" />;
      case 'Migration Complete':
        return <CheckCircle className="w-5 h-5" />;
      default:
        return <Clock className="w-5 h-5" />;
    }
  };

  const getStepColor = (step: string) => {
    switch (step) {
      case 'Migration Complete':
        return 'text-green-600 bg-green-50 border-green-200';
      case 'AI Analysis Complete':
        return 'text-blue-600 bg-blue-50 border-blue-200';
      case 'Files Uploaded':
        return 'text-purple-600 bg-purple-50 border-purple-200';
      case 'Intake Submitted':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      default:
        return 'text-gray-600 bg-gray-50 border-gray-200';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (migrations.length === 0) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            No Migrations Found
          </h2>
          <p className="text-gray-600">
            Start by submitting an intake form to begin your migration journey.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Migration Progress
        </h1>
        <p className="text-gray-600">
          Track the status of your QuickBooks migrations
        </p>
      </div>

      <div className="space-y-6">
        {migrations.map((migration) => (
          <div
            key={migration.id}
            className="bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden"
          >
            {/* Migration Header */}
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {migration.source_software} → {migration.target_software}
                    </h3>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(migration.status)}`}>
                      {migration.status.replace('_', ' ')}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getUrgencyColor(migration.urgency)}`}>
                      {migration.urgency}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <span>Created: {formatDate(migration.created_at)}</span>
                    {migration.progress.estimated_time_remaining && (
                      <span>ETA: {migration.progress.estimated_time_remaining}</span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => toggleExpanded(migration.id)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  {expandedMigration === migration.id ? (
                    <ChevronUp className="w-5 h-5" />
                  ) : (
                    <ChevronDown className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                  <span>{migration.progress.current_step}</span>
                  <span>{migration.progress.percentage}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${migration.progress.percentage}%` }}
                  ></div>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  {getStepIcon(migration.progress.current_step)}
                  <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStepColor(migration.progress.current_step)}`}>
                    {migration.progress.current_step}
                  </span>
                </div>
              </div>
            </div>

            {/* Expanded Details */}
            {expandedMigration === migration.id && (
              <div className="border-t border-gray-200 p-6 bg-gray-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Intake Summary */}
                  {migration.intake_responses && migration.intake_responses.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Intake Summary</h4>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="space-y-2 text-sm">
                          <div>
                            <span className="font-medium">Current Software:</span> {migration.intake_responses[0].current_software}
                          </div>
                          <div>
                            <span className="font-medium">Target Software:</span> {migration.intake_responses[0].target_software}
                          </div>
                          <div>
                            <span className="font-medium">Data Requirements:</span>
                            <div className="mt-1">
                              {migration.intake_responses[0].data_preservation_requirements.map((req: string, index: number) => (
                                <span key={index} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded mr-1 mb-1">
                                  {req}
                                </span>
                              ))}
                            </div>
                          </div>
                          {migration.intake_responses[0].ai_summary && (
                            <div className="mt-3 p-3 bg-blue-50 rounded border-l-4 border-blue-400">
                              <p className="text-sm text-blue-800">
                                <strong>AI Analysis:</strong> {migration.intake_responses[0].ai_summary.substring(0, 200)}...
                              </p>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Files */}
                  {migration.files && migration.files.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-3">Uploaded Files</h4>
                      <div className="bg-white p-4 rounded-lg border">
                        <div className="space-y-2">
                          {migration.files.map((file: unknown) => (
                            <div key={file.id} className="flex items-center justify-between text-sm">
                              <div className="flex items-center space-x-2">
                                <FileText className="w-4 h-4 text-gray-400" />
                                <span className="font-medium">{file.filename}</span>
                              </div>
                              <span className="text-gray-500">{file.file_type}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* AI Analysis */}
                  {migration.ai_analyses && migration.ai_analyses.length > 0 && (
                    <div className="md:col-span-2">
                      <h4 className="font-semibold text-gray-900 mb-3">AI Analysis</h4>
                      <div className="space-y-3">
                        {migration.ai_analyses.map((analysis: unknown) => (
                          <div key={analysis.id} className="bg-white p-4 rounded-lg border">
                            <div className="flex items-center space-x-2 mb-2">
                              <Brain className="w-4 h-4 text-blue-500" />
                              <span className="font-medium text-sm capitalize">
                                {analysis.analysis_type.replace('_', ' ')}
                              </span>
                            </div>
                            <div className="text-sm text-gray-700 whitespace-pre-wrap">
                              {analysis.content.substring(0, 300)}
                              {analysis.content.length > 300 && '...'}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 