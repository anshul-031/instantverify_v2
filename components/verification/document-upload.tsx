"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUp, Camera, AlertTriangle, Loader2, X } from "lucide-react";
import { VerificationMethod, VerificationDocuments } from "@/lib/types/verification";
import { CameraFeed } from "@/components/camera/camera-feed";

interface Props {
  method?: VerificationMethod;
  onUpload: (documents: VerificationDocuments) => void;
  existingDocuments?: VerificationDocuments;
}

export function DocumentUpload({ method, onUpload, existingDocuments }: Props) {
  const [files, setFiles] = useState<File[]>(() => {
    if (!existingDocuments?.governmentId) return [];
    return existingDocuments.governmentId instanceof Array && existingDocuments.governmentId[0] instanceof File 
      ? existingDocuments.governmentId as File[]
      : [];
  });
  const [useCamera, setUseCamera] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      try {
        setUploading(true);
        setError(null);
        const newFiles = Array.from(e.target.files);
        
        // Validate file sizes
        const maxSize = 5 * 1024 * 1024; // 5MB
        const invalidFiles = newFiles.filter(file => file.size > maxSize);
        if (invalidFiles.length > 0) {
          throw new Error('Files must be less than 5MB');
        }

        const formData = new FormData();
        newFiles.forEach((file) => {
          formData.append('files', file);
        });

        const response = await fetch('/api/verify/upload', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) {
          throw new Error('Upload failed');
        }

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        onUpload({ governmentId: updatedFiles });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload files');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCapture = async (file: File, previewUrl: string) => {
    try {
      setUploading(true);
      setError(null);

      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/verify/upload', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const updatedFiles = [...files, file];
      setFiles(updatedFiles);
      onUpload({ governmentId: updatedFiles });
      setUseCamera(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload captured photo');
    } finally {
      setUploading(false);
    }
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUpload({ governmentId: updatedFiles });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Upload Documents (Optional)</h2>
      </div>

      {error && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          You can optionally upload government ID documents. Maximum file size is 5MB.
        </AlertDescription>
      </Alert>

      <Card className="p-6 space-y-4">
        <div className="space-y-4">
          <Label>Government ID</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*"
                multiple
                onChange={handleFileChange}
                className={useCamera ? "hidden" : ""}
                disabled={uploading}
              />
            </div>
            <Button
              type="button"
              variant="outline"
              onClick={() => setUseCamera(!useCamera)}
              disabled={uploading}
            >
              <Camera className="h-4 w-4 mr-2" />
              {useCamera ? "Use File Upload" : "Use Camera"}
            </Button>
          </div>

          {uploading && (
            <div className="flex items-center justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2">Uploading...</span>
            </div>
          )}

          {useCamera && (
            <CameraFeed 
              onCapture={handleCapture}
              facingMode="environment"
            />
          )}

          {files.length > 0 && (
            <ul className="space-y-2">
              {files.map((file, index) => (
                <li key={index} className="flex items-center justify-between bg-gray-50 p-2 rounded">
                  <div className="flex items-center">
                    <FileUp className="h-4 w-4 mr-2" />
                    <span className="text-sm text-gray-600">
                      {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(index)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </Card>
    </div>
  );
}