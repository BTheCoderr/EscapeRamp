'use client';

import { useState, useRef } from 'react';
import { useAppStore } from '@/lib/store';
import { formatFileSize } from '@/lib/utils';
import { Upload, File, X, CheckCircle, AlertCircle, Loader2 } from 'lucide-react';

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: 'uploading' | 'uploaded' | 'processing' | 'processed' | 'failed';
  error?: string;
}

export function FileUpload() {
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { currentMigration, addFile } = useAppStore();

  const allowedFileTypes = [
    '.qbb', '.qbm', '.qbo', '.csv', '.xlsx', '.xls', '.pdf', '.txt', '.json'
  ];

  const maxFileSize = 10 * 1024 * 1024; // 10MB

  const handleFileSelect = async (files: FileList) => {
    const newFiles: UploadedFile[] = Array.from(files).map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      size: file.size,
      type: file.type || getFileExtension(file.name),
      status: 'uploading' as const,
    }));

    setUploadedFiles(prev => [...prev, ...newFiles]);

    // Upload each file
    for (const file of Array.from(files)) {
      await uploadFile(file);
    }
  };

  const uploadFile = async (file: File) => {
    // const fileId = Math.random().toString(36).substr(2, 9);
    
    try {
      // Validate file
      if (file.size > maxFileSize) {
        throw new Error('File size exceeds 10MB limit');
      }

      const fileExtension = getFileExtension(file.name);
      if (!allowedFileTypes.includes(fileExtension.toLowerCase())) {
        throw new Error(`File type ${fileExtension} is not supported`);
      }

      // Read file content for text-based files
      let fileContent: string | undefined;
      if (isTextFile(file.type || fileExtension)) {
        fileContent = await readFileAsText(file);
      }

      // Upload to API
      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          migration_id: currentMigration?.id || 'demo-migration',
          filename: file.name,
          file_size: file.size,
          file_type: file.type || fileExtension,
          file_content: fileContent,
        }),
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const result = await response.json();

      // Update file status
      setUploadedFiles(prev => 
        prev.map(f => 
          f.name === file.name 
            ? { ...f, status: 'processed' as const, id: result.file_id }
            : f
        )
      );

      // Add to store
      addFile({
        id: result.file_id,
        migration_id: currentMigration?.id || 'demo-migration',
        filename: file.name,
        file_size: file.size,
        file_type: file.type || fileExtension,
        upload_status: 'processed',
        file_path: result.file_path,
        created_at: new Date().toISOString(),
      });

    } catch (error) {
      console.error('File upload error:', error);
      setUploadedFiles(prev => 
        prev.map(f => 
          f.name === file.name 
            ? { ...f, status: 'failed' as const, error: error instanceof Error ? error.message : 'Upload failed' }
            : f
        )
      );
    }
  };

  const readFileAsText = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsText(file);
    });
  };

  const getFileExtension = (filename: string): string => {
    return filename.substring(filename.lastIndexOf('.'));
  };

  const isTextFile = (fileType: string): boolean => {
    const textTypes = ['text/', 'application/json', 'application/xml', 'application/csv'];
    return textTypes.some(type => fileType.includes(type)) || 
           ['.txt', '.csv', '.json', '.xml', '.qbb', '.qbm', '.qbo'].some(ext => 
             fileType.toLowerCase().includes(ext)
           );
  };

  const removeFile = (fileId: string) => {
    setUploadedFiles(prev => prev.filter(f => f.id !== fileId));
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    handleFileSelect(e.dataTransfer.files);
  };

  const getStatusIcon = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return <Loader2 className="w-4 h-4 animate-spin" />;
      case 'uploaded':
        return <CheckCircle className="w-4 h-4 text-blue-500" />;
      case 'processing':
        return <Loader2 className="w-4 h-4 animate-spin text-yellow-500" />;
      case 'processed':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <File className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: UploadedFile['status']) => {
    switch (status) {
      case 'uploading':
        return 'Uploading...';
      case 'uploaded':
        return 'Uploaded';
      case 'processing':
        return 'Processing...';
      case 'processed':
        return 'Processed';
      case 'failed':
        return 'Failed';
      default:
        return 'Ready';
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Upload Your Files
        </h2>
        <p className="text-gray-600">
          Upload your QuickBooks files and other relevant documents for analysis
        </p>
      </div>

      {/* Upload Area */}
      <div
        className={`
          border-2 border-dashed rounded-lg p-8 text-center transition-colors
          ${isDragging 
            ? 'border-blue-500 bg-blue-50' 
            : 'border-gray-300 hover:border-gray-400'
          }
        `}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <p className="text-lg font-medium text-gray-900 mb-2">
          Drop files here or click to browse
        </p>
        <p className="text-sm text-gray-500 mb-4">
          Supported formats: QBB, QBM, QBO, CSV, Excel, PDF, TXT, JSON
        </p>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          Choose Files
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept={allowedFileTypes.join(',')}
          onChange={(e) => e.target.files && handleFileSelect(e.target.files)}
          className="hidden"
        />
      </div>

      {/* File List */}
      {uploadedFiles.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Uploaded Files</h3>
          <div className="space-y-2">
            {uploadedFiles.map((file) => (
              <div
                key={file.id}
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  {getStatusIcon(file.status)}
                  <div>
                    <p className="font-medium text-gray-900">{file.name}</p>
                    <p className="text-sm text-gray-500">
                      {formatFileSize(file.size)} • {getStatusText(file.status)}
                    </p>
                    {file.error && (
                      <p className="text-sm text-red-600">{file.error}</p>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => removeFile(file.id)}
                  className="text-gray-400 hover:text-red-500 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-semibold text-blue-900 mb-2">What files should I upload?</h3>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• QuickBooks backup files (.qbb)</li>
          <li>• QuickBooks portable files (.qbm)</li>
          <li>• Export files (.csv, .xlsx)</li>
          <li>• Any relevant documentation</li>
          <li>• Custom reports or templates</li>
        </ul>
      </div>
    </div>
  );
} 