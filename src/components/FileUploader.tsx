"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";

export default function FileUploader({ userId }: { userId: string }) {
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFile(e.target.files?.[0] || null);
    setStatus(null);
  };

  const handleUpload = async () => {
    if (!file || !userId) return;

    setIsLoading(true);
    setStatus("Uploading...");

    try {
      const formData = new FormData();
      formData.append("file", file);

      // Upload to storage or external service first (e.g., Supabase Storage or UploadThing)
      const uploadRes = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!uploadRes.ok) {
        throw new Error("Upload failed");
      }

      const { fileUrl } = await uploadRes.json();
      if (!fileUrl) {
        throw new Error("No file URL returned");
      }

      setStatus("Parsing with Claude AI...");

      const parseRes = await fetch("/api/parse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, fileUrl }),
      });

      if (parseRes.ok) {
        const result = await parseRes.json();
        setStatus(`✅ Migration parsed successfully! ${result.parseResult?.summary?.totalRows || 0} entities found.`);
      } else {
        const errorData = await parseRes.json();
        throw new Error(errorData.error || "Parsing failed");
      }
    } catch (error) {
      setStatus(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Upload className="w-5 h-5" />
          QuickBooks File Upload
        </CardTitle>
        <CardDescription>
          Upload your QuickBooks Desktop export (.IIF or .CSV) for AI-powered parsing
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <label htmlFor="file-upload" className="block text-sm font-medium">
            Select QuickBooks Export File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv,.iif,.txt"
            onChange={handleFileChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <Button
          onClick={handleUpload}
          disabled={!file || isLoading}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            <>
              <Upload className="w-4 h-4 mr-2" />
              Upload & Parse
            </>
          )}
        </Button>

        {status && (
          <Alert className={status.includes("✅") ? "border-green-200 bg-green-50" : status.includes("❌") ? "border-red-200 bg-red-50" : "border-blue-200 bg-blue-50"}>
            {status.includes("✅") ? (
              <CheckCircle className="h-4 w-4 text-green-600" />
            ) : status.includes("❌") ? (
              <AlertCircle className="h-4 w-4 text-red-600" />
            ) : (
              <Loader2 className="h-4 w-4 text-blue-600 animate-spin" />
            )}
            <AlertDescription className={status.includes("✅") ? "text-green-800" : status.includes("❌") ? "text-red-800" : "text-blue-800"}>
              {status}
            </AlertDescription>
          </Alert>
        )}

        <div className="text-xs text-gray-500 space-y-1">
          <p>• Supports .IIF and .CSV files from QuickBooks Desktop</p>
          <p>• AI-powered parsing with Claude</p>
          <p>• Automatic entity type detection</p>
          <p>• Data validation and error flagging</p>
        </div>
      </CardContent>
    </Card>
  );
} 