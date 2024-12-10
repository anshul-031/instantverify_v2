"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileUp, AlertTriangle, X, Camera } from "lucide-react";
import { VerificationMethod, VerificationDocuments } from "@/lib/types/verification";
import { convertFileToFileData } from "@/lib/api/verification";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CameraCapture } from "./camera/camera-capture";
import { documentRequirements } from "@/lib/data/document-requirements";

interface Props {
  method: VerificationMethod;
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
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const requirement = documentRequirements[method];

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

        // Check max files limit
        if (files.length + newFiles.length > requirement.maxFiles) {
          throw new Error(`Maximum ${requirement.maxFiles} files allowed`);
        }

        const updatedFiles = [...files, ...newFiles];
        setFiles(updatedFiles);
        
        // Convert File objects to FileData before passing to parent
        onUpload({ 
          governmentId: updatedFiles.map(convertFileToFileData)
        });
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to upload files');
      } finally {
        setUploading(false);
      }
    }
  };

  const handleCameraCapture = (file: File) => {
    if (files.length >= requirement.maxFiles) {
      setError(`Maximum ${requirement.maxFiles} files allowed`);
      return;
    }

    const updatedFiles = [...files, file];
    setFiles(updatedFiles);
    onUpload({ 
      governmentId: updatedFiles.map(convertFileToFileData)
    });
    setIsDialogOpen(false);
  };

  const removeFile = (index: number) => {
    const updatedFiles = files.filter((_, i) => i !== index);
    setFiles(updatedFiles);
    onUpload({ 
      governmentId: updatedFiles.map(convertFileToFileData)
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <FileUp className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">{requirement.title}</h2>
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
          {requirement.description}. Maximum file size is 5MB per file.
          {files.length > 0 && (
            <p className="mt-2">
              Uploaded {files.length} of {requirement.maxFiles} files
            </p>
          )}
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <div className="space-y-4">
          <Label>Government ID Documents</Label>
          <div className="flex items-center space-x-4">
            <div className="flex-1">
              <Input
                type="file"
                accept="image/*,application/pdf"
                multiple
                onChange={handleFileChange}
                disabled={uploading || files.length >= requirement.maxFiles}
              />
            </div>
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="outline" disabled={files.length >= requirement.maxFiles}>
                  <Camera className="w-4 h-4 mr-2" />
                  Use Camera
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-3xl">
                <CameraCapture
                  onCapture={handleCameraCapture}
                  mode="document"
                  aspectRatio={1.4}
                />
              </DialogContent>
            </Dialog>
          </div>

          {uploading && (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary" />
              <span className="ml-2">Uploading...</span>
            </div>
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