'use client';

import { useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Bot,
  Download,
  Eye,
  RefreshCw
} from 'lucide-react';

interface QBParseResult {
  entities: any[];
  summary: {
    totalRows: number;
    requiresReview: number;
    entityTypes: Record<string, number>;
    warnings: string[];
  };
}

interface ComplexityAnalysis {
  complexity: 'simple' | 'moderate' | 'complex';
  estimatedHours: number;
  risks: string[];
  recommendations: string[];
}

export function QuickBooksUpload() {
  const [uploading, setUploading] = useState(false);
  const [parsing, setParsing] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [parseProgress, setParseProgress] = useState(0);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [filename, setFilename] = useState<string | null>(null);
  const [parseResult, setParseResult] = useState<QBParseResult | null>(null);
  const [complexityAnalysis, setComplexityAnalysis] = useState<ComplexityAnalysis | null>(null);
  const [migrationId, setMigrationId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onDrop = async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    setError(null);
    setUploading(true);
    setUploadProgress(0);
    setFilename(file.name);

    try {
      // Simulate file upload to Supabase Storage
      const formData = new FormData();
      formData.append('file', file);

      // Upload to Supabase Storage (you'll need to implement this)
      const uploadResponse = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });

      if (!uploadResponse.ok) {
        throw new Error('Failed to upload file');
      }

      const { fileUrl: uploadedFileUrl } = await uploadResponse.json();
      setFileUrl(uploadedFileUrl);
      setUploadProgress(100);

      // Start parsing
      await parseQuickBooksFile(uploadedFileUrl, file.name);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
      setUploading(false);
    }
  };

  const parseQuickBooksFile = async (fileUrl: string, filename: string) => {
    setParsing(true);
    setParseProgress(0);

    try {
      // Simulate parsing progress
      const progressInterval = setInterval(() => {
        setParseProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 500);

      // Get current user ID (you'll need to implement this based on your auth)
      const userId = 'demo-user-id'; // Replace with actual user ID from auth
      
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ userId, fileUrl }),
      });

      clearInterval(progressInterval);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Parsing failed');
      }

      const result = await response.json();
      setParseResult(result.parseResult);
      setComplexityAnalysis(result.complexityAnalysis);
      setMigrationId(result.migrationId);
      setParseProgress(100);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Parsing failed');
    } finally {
      setParsing(false);
      setUploading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'text/csv': ['.csv'],
      'text/plain': ['.iif', '.txt'],
    },
    multiple: false,
    disabled: uploading || parsing
  });

  const getComplexityColor = (complexity: string) => {
    switch (complexity) {
      case 'simple': return 'bg-green-100 text-green-800';
      case 'moderate': return 'bg-yellow-100 text-yellow-800';
      case 'complex': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bot className="w-5 h-5" />
            AI-Powered QuickBooks Parsing
          </CardTitle>
          <CardDescription>
            Upload your QuickBooks Desktop export (.IIF or .CSV) and let our AI analyze your data for migration
          </CardDescription>
        </CardHeader>
        <CardContent>
          {!fileUrl && !parseResult && (
            <div
              {...getRootProps()}
              className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
                isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
              } ${uploading || parsing ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              <input {...getInputProps()} />
              <Upload className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p className="text-lg font-medium mb-2">
                {isDragActive ? 'Drop your QuickBooks file here' : 'Drag & drop QuickBooks export'}
              </p>
              <p className="text-gray-600 mb-4">
                Supports .IIF and .CSV files from QuickBooks Desktop
              </p>
              <Button disabled={uploading || parsing}>
                {uploading ? 'Uploading...' : parsing ? 'Parsing...' : 'Choose File'}
              </Button>
            </div>
          )}

          {(uploading || parsing) && (
            <div className="space-y-4">
              {uploading && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Uploading file...</span>
                    <span className="text-sm text-gray-500">{uploadProgress}%</span>
                  </div>
                  <Progress value={uploadProgress} className="w-full" />
                </div>
              )}

              {parsing && (
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">AI parsing with Claude...</span>
                    <span className="text-sm text-gray-500">{parseProgress}%</span>
                  </div>
                  <Progress value={parseProgress} className="w-full" />
                  <p className="text-sm text-gray-600 mt-2">
                    Analyzing {filename} with AI to identify entities and map data
                  </p>
                </div>
              )}
            </div>
          )}

          {error && (
            <Alert className="mt-4">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {parseResult && complexityAnalysis && (
        <div className="space-y-6">
          {/* Summary Card */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5 text-green-600" />
                Parsing Complete
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">{parseResult.summary.totalRows}</div>
                  <div className="text-sm text-gray-600">Total Rows</div>
                </div>
                <div className="text-center p-4 bg-yellow-50 rounded-lg">
                  <div className="text-2xl font-bold text-yellow-600">{parseResult.summary.requiresReview}</div>
                  <div className="text-sm text-gray-600">Needs Review</div>
                </div>
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">
                    {Object.keys(parseResult.summary.entityTypes).length}
                  </div>
                  <div className="text-sm text-gray-600">Entity Types</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600">{complexityAnalysis.estimatedHours}h</div>
                  <div className="text-sm text-gray-600">Est. Time</div>
                </div>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <Badge className={getComplexityColor(complexityAnalysis.complexity)}>
                  {complexityAnalysis.complexity.toUpperCase()} MIGRATION
                </Badge>
                <span className="text-sm text-gray-600">
                  Estimated completion: {complexityAnalysis.estimatedHours} hours
                </span>
              </div>

              {complexityAnalysis.risks.length > 0 && (
                <Alert className="mb-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    <div className="font-medium mb-2">Migration Risks:</div>
                    <ul className="list-disc list-inside space-y-1">
                      {complexityAnalysis.risks.map((risk, index) => (
                        <li key={index} className="text-sm">{risk}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              )}

              {complexityAnalysis.recommendations.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="font-medium mb-2 text-blue-800">Recommendations:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-blue-700">
                    {complexityAnalysis.recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Detailed Results */}
          <Card>
            <CardHeader>
              <CardTitle>Parsed Data Details</CardTitle>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="entities" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="entities">Entity Types</TabsTrigger>
                  <TabsTrigger value="review">Review Items</TabsTrigger>
                  <TabsTrigger value="data">Raw Data</TabsTrigger>
                </TabsList>

                <TabsContent value="entities" className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Object.entries(parseResult.summary.entityTypes).map(([type, count]) => (
                      <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                        <span className="font-medium">{type}</span>
                        <Badge variant="secondary">{count} items</Badge>
                      </div>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="review" className="space-y-4">
                  {parseResult.entities.filter(e => e.requiresReview).length > 0 ? (
                    <div className="space-y-3">
                      {parseResult.entities
                        .filter(e => e.requiresReview)
                        .slice(0, 10)
                        .map((entity, index) => (
                          <div key={index} className="p-3 border rounded-lg bg-yellow-50">
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium">{entity.entityType}</span>
                              <Badge variant="destructive">Review Required</Badge>
                            </div>
                            <p className="text-sm text-gray-600">{entity.reviewReason}</p>
                          </div>
                        ))}
                      {parseResult.entities.filter(e => e.requiresReview).length > 10 && (
                        <p className="text-sm text-gray-500 text-center">
                          ... and {parseResult.entities.filter(e => e.requiresReview).length - 10} more items
                        </p>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <CheckCircle className="w-12 h-12 mx-auto mb-4 text-green-500" />
                      <p>No items require review!</p>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="data" className="space-y-4">
                  <div className="flex gap-2">
                    <Button size="sm" variant="outline">
                      <Download className="w-4 h-4 mr-2" />
                      Export JSON
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="w-4 h-4 mr-2" />
                      View Raw
                    </Button>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-auto">
                    <pre className="text-xs text-gray-700">
                      {JSON.stringify(parseResult.entities.slice(0, 5), null, 2)}
                    </pre>
                  </div>
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button className="flex-1" size="lg">
              <RefreshCw className="w-4 h-4 mr-2" />
              Start Migration
            </Button>
            <Button variant="outline" size="lg">
              <Eye className="w-4 h-4 mr-2" />
              Review Details
            </Button>
          </div>
        </div>
      )}
    </div>
  );
} 