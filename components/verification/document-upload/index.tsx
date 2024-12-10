"use client";

import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { AlertTriangle } from "lucide-react";
import { CameraCapture } from "../camera/camera-capture";
import { useToast } from "@/components/ui/use-toast";
import { UPLOAD_CONFIG } from "@/lib/api/upload/config";
import { DocumentUploadProps, UploadResponse } from '@/lib/types/upload';
import { documentRequirements } from './requirements';
import { DocumentPreview } from "./preview";
import { UploadButton } from "./upload-button";
import { CameraButton } from "./camera-button";

export function DocumentUpload({
  onUpload,
  maxFiles = UPLOAD_CONFIG.maxFiles,
  accept = "image/*,application/pdf",
  isSubmitting = false,
  existingDocuments,
  method
}: DocumentUploadProps) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  const requirements = method ? documentRequirements[method] : null;
  const effectiveMaxFiles = requirements?.maxFiles ?? maxFiles;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > effectiveMaxFiles) {
      toast({
        title: "Error",
        description: `Maximum ${effectiveMaxFiles} files allowed`,
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    try {
      const formData = new FormData();
      newFiles.forEach(file => formData.append('files', file));

      const response = await fetch('/api/verify/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const { urls }: UploadResponse = await response.json();
      setFiles(prev => [...prev, ...newFiles]);
      
      const docs = {
        governmentId: urls.map(url => ({
          url,
          type: "document",
          name: requirements?.title || "Government ID",
          size: 0
        }))
      };
      
      onUpload(docs);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "Failed to upload files",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemove = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    if (existingDocuments?.governmentId) {
      const updatedDocs = {
        ...existingDocuments,
        governmentId: existingDocuments.governmentId.filter((_, i) => i !== index)
      };
      onUpload(updatedDocs);
    }
  };

  const handleCameraCapture = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('files', file);

      const response = await fetch('/api/verify/upload', {
        method: 'POST',
        body: formData
      });

      if (!response.ok) {
        throw new Error('Failed to upload captured photo');
      }

      const { urls }: UploadResponse = await response.json();
      setFiles(prev => [...prev, file]);
      
      const docs = {
        governmentId: urls.map(url => ({
          url,
          type: "document",
          name: requirements?.title || "Government ID",
          size: file.size
        }))
      };
      
      onUpload(docs);
      setShowCamera(false);
    } catch (error) {
      toast({
        title: "Upload Failed",
        description: "Failed to upload captured photo",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          {requirements ? (
            <>
              <p className="font-medium mb-2">{requirements.description}</p>
              <ul className="list-disc list-inside">
                <li>Maximum file size: {UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB</li>
                <li>Supported formats: JPG, PNG, PDF</li>
                <li>Maximum {effectiveMaxFiles} files allowed</li>
              </ul>
            </>
          ) : (
            <ul className="list-disc list-inside">
              <li>Maximum file size: {UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB</li>
              <li>Supported formats: JPG, PNG, PDF</li>
              <li>Maximum {effectiveMaxFiles} files allowed</li>
            </ul>
          )}
        </AlertDescription>
      </Alert>

      {files.map((file, index) => (
        <DocumentPreview
          key={index}
          file={file}
          onRemove={() => handleRemove(index)}
          isSubmitting={isSubmitting}
        />
      ))}

      {files.length < effectiveMaxFiles && (
        <div className="grid grid-cols-2 gap-4">
          <UploadButton
            id="file-upload"
            onChange={handleFileChange}
            accept={accept}
            disabled={isUploading || isSubmitting}
          />

          <Dialog open={showCamera} onOpenChange={setShowCamera}>
            <CameraButton
              onClick={() => setShowCamera(true)}
              disabled={isUploading || isSubmitting}
            />
            <DialogContent className="max-w-3xl">
              <CameraCapture
                onCapture={handleCameraCapture}
                mode="document"
                aspectRatio={1.6}
              />
            </DialogContent>
          </Dialog>
        </div>
      )}
    </div>
  );
}