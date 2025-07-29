'use client';

import { useState, useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Upload, 
  FileText, 
  Image, 
  FileSpreadsheet, 
  X, 
  CheckCircle, 
  AlertCircle,
  Eye,
  Download,
  Trash2
} from 'lucide-react';

interface UploadedFile {
  id: string;
  file: File;
  status: 'uploading' | 'processing' | 'completed' | 'error';
  progress: number;
  parsedData?: any;
  error?: string;
}

interface ParsedInvoice {
  vendor_name: string;
  invoice_date: string;
  invoice_number: string;
  total_amount: number;
  line_items: Array<{
    description: string;
    quantity: number;
    unit_price: number;
    total: number;
  }>;
  extracted_text: string;
}

export function DocumentUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles: UploadedFile[] = acceptedFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      status: 'uploading',
      progress: 0
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Simulate upload progress
    newFiles.forEach(file => {
      simulateUpload(file.id);
    });
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif'],
      'application/pdf': ['.pdf'],
      'text/csv': ['.csv'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    multiple: true
  });

  const simulateUpload = async (fileId: string) => {
    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file) return;

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { ...f, progress: i, status: i === 100 ? 'processing' : 'uploading' }
            : f
        )
      );
    }

    // Simulate processing
    setTimeout(() => {
      setUploadedFiles(prev => 
        prev.map(f => 
          f.id === fileId 
            ? { 
                ...f, 
                status: 'completed',
                parsedData: generateMockParsedData(f.file.name)
              }
            : f
        )
      );
    }, 2000);
  };

  const generateMockParsedData = (fileName: string): ParsedInvoice => {
    return {
      vendor_name: fileName.includes('invoice') ? 'ABC Supplies Co.' : 'XYZ Services Inc.',
      invoice_date: new Date().toISOString().split('T')[0],
      invoice_number: `INV-${Math.random().toString(36).substr(2, 6).toUpperCase()}`,
      total_amount: Math.round(Math.random() * 1000 + 100),
      line_items: [
        {
          description: 'Office Supplies',
          quantity: Math.floor(Math.random() * 10) + 1,
          unit_price: Math.round(Math.random() * 50 + 10),
          total: 0
        },
        {
          description: 'Software License',
          quantity: 1,
          unit_price: Math.round(Math.random() * 200 + 50),
          total: 0
        }
      ],
      extracted_text: 'Sample extracted text from the document...'
    };
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const getFileIcon = (fileName: string) => {
    const ext = fileName.split('.').pop()?.toLowerCase();
    switch (ext) {
      case 'pdf':
        return <FileText className="w-6 h-6 text-red-500" />;
      case 'csv':
      case 'xlsx':
      case 'xls':
        return <FileSpreadsheet className="w-6 h-6 text-green-500" />;
      case 'png':
      case 'jpg':
      case 'jpeg':
      case 'gif':
        return <Image className="w-6 h-6 text-blue-500" />;
      default:
        return <FileText className="w-6 h-6 text-gray-500" />;
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'uploading':
        return <Upload className="w-4 h-4 animate-pulse" />;
      case 'processing':
        return <AlertCircle className="w-4 h-4 animate-spin" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'uploading':
        return 'bg-blue-100 text-blue-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Document Upload & Invoice Parsing
        </h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Upload your QuickBooks exports, invoices, receipts, and other financial documents. 
          Our AI will automatically extract and organize the data for your migration.
        </p>
      </div>

      {/* Upload Area */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Upload className="w-5 h-5" />
            Upload Documents
          </CardTitle>
          <CardDescription>
            Drag and drop files here, or click to select. Supports PDFs, images, CSV files, and Excel spreadsheets.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div
            {...getRootProps()}
            className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
              isDragActive 
                ? 'border-blue-500 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <input {...getInputProps()} />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            {isDragActive ? (
              <p className="text-lg text-blue-600">Drop the files here...</p>
            ) : (
              <div>
                <p className="text-lg text-gray-600 mb-2">
                  Drag & drop files here, or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supports: PDF, JPG, PNG, CSV, XLSX (Max 10MB per file)
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Files */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Uploaded Documents</CardTitle>
            <CardDescription>
              {uploadedFiles.length} file{uploadedFiles.length !== 1 ? 's' : ''} uploaded
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedFiles.map((file) => (
                <div key={file.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-3">
                      {getFileIcon(file.file.name)}
                      <div>
                        <p className="font-medium">{file.file.name}</p>
                        <p className="text-sm text-gray-500">
                          {(file.file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge className={getStatusColor(file.status)}>
                        {getStatusIcon(file.status)}
                        <span className="ml-1 capitalize">{file.status}</span>
                      </Badge>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(file.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {/* Progress Bar */}
                  {file.status === 'uploading' && (
                    <Progress value={file.progress} className="mb-3" />
                  )}

                  {/* Parsed Data Preview */}
                  {file.status === 'completed' && file.parsedData && (
                    <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                      <h4 className="font-medium mb-3 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        Parsed Data Preview
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Vendor</p>
                          <p className="font-medium">{file.parsedData.vendor_name}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Invoice #</p>
                          <p className="font-medium">{file.parsedData.invoice_number}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Date</p>
                          <p className="font-medium">{file.parsedData.invoice_date}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Total</p>
                          <p className="font-medium">${file.parsedData.total_amount}</p>
                        </div>
                      </div>
                      <div className="mt-3 flex gap-2">
                        <Button size="sm" variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Export Data
                        </Button>
                        <Button size="sm" variant="outline">
                          <Eye className="w-4 h-4 mr-2" />
                          View Full Details
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Error Message */}
                  {file.status === 'error' && file.error && (
                    <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                      <p className="text-red-700 text-sm">{file.error}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Processing Summary */}
      {uploadedFiles.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Processing Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">
                  {uploadedFiles.length}
                </p>
                <p className="text-sm text-gray-600">Total Files</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">
                  {uploadedFiles.filter(f => f.status === 'completed').length}
                </p>
                <p className="text-sm text-gray-600">Processed</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">
                  {uploadedFiles.filter(f => f.status === 'processing').length}
                </p>
                <p className="text-sm text-gray-600">Processing</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">
                  {uploadedFiles.filter(f => f.status === 'error').length}
                </p>
                <p className="text-sm text-gray-600">Errors</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
} 