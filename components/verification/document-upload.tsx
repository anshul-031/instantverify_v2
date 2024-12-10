"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Camera, Upload, X } from "lucide-react";
import { CameraCapture } from "./camera/camera-capture";
import { useToast } from "@/components/ui/use-toast";
import { UPLOAD_CONFIG } from "@/lib/api/upload/config";
import { VerificationDocuments } from "@/lib/types/verification";

interface Props {
  onUpload: (docs: VerificationDocuments) => void;
  maxFiles?: number;
  accept?: string;
  isSubmitting?: boolean;
  existingDocuments?: VerificationDocuments;
  method?: string;
}

interface UploadResponse {
  urls: string[]; // Assuming the response has a `urls` property that is an array of strings
}

export function DocumentUpload({
  onUpload,
  maxFiles = UPLOAD_CONFIG.maxFiles,
  accept = "image/*,application/pdf",
  isSubmitting = false,
  existingDocuments,
}: Props) {
  const [files, setFiles] = useState<File[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const { toast } = useToast();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length) return;

    const newFiles = Array.from(e.target.files);
    if (files.length + newFiles.length > maxFiles) {
      toast({
        title: "Error",
        description: `Maximum ${maxFiles} files allowed`,
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
        const data = await response.json();
        throw new Error(data.error || 'Upload failed');
      }

      const { urls }: UploadResponse = await response.json(); // Specify the type of the response here

      setFiles(prev => [...prev, ...newFiles]);
      
      // Convert URLs to VerificationDocuments format
      const docs: VerificationDocuments = {
        governmentId: urls.map((url: string) => ({ // Explicitly type `url` as a string
          url,
          type: "document",
          name: "Government ID",
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

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please upload clear photos or scanned copies:
          <ul className="list-disc list-inside mt-2">
            <li>Maximum file size: {UPLOAD_CONFIG.maxFileSize / (1024 * 1024)}MB</li>
            <li>Supported formats: JPG, PNG, PDF</li>
            <li>Maximum {maxFiles} files allowed</li>
          </ul>
        </AlertDescription>
      </Alert>

      {files.map((file, index) => (
        <div key={index} className="relative">
          {file.type.startsWith('image/') ? (
            <img
              src={URL.createObjectURL(file)}
              alt={file.name}
              className="w-full h-48 object-cover rounded-lg"
            />
          ) : (
            <div className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center">
              <p className="text-gray-500">{file.name}</p>
            </div>
          )}
          <Button
            type="button"
            variant="destructive"
            size="icon"
            className="absolute top-2 right-2"
            onClick={() => handleRemove(index)}
            disabled={isSubmitting}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      ))}

      {files.length < maxFiles && (
        <div className="grid grid-cols-2 gap-4">
          <div>
            <input
              type="file"
              accept={accept}
              onChange={handleFileChange}
              className="hidden"
              id="file-upload"
              multiple
              disabled={isUploading || isSubmitting}
            />
            <Label
              htmlFor="file-upload"
              className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
            >
              <Upload className="h-6 w-6 mb-2" />
              <span className="text-sm">
                {isUploading ? "Uploading..." : "Upload Files"}
              </span>
            </Label>
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="h-32"
                disabled={isUploading || isSubmitting}
              >
                <Camera className="h-6 w-6 mr-2" />
                Use Camera
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <CameraCapture
                onCapture={async (file) => {
                  const formData = new FormData();
                  formData.append('files', file);

                  try {
                    const response = await fetch('/api/verify/upload', {
                      method: 'POST',
                      body: formData
                    });

                    if (!response.ok) {
                      throw new Error('Failed to upload captured photo');
                    }

                    const { urls }: UploadResponse = await response.json(); // Specify the type of the response here
                    setFiles(prev => [...prev, file]);
                    
                    const docs: VerificationDocuments = {
                      governmentId: urls.map((url: string) => ({ // Explicitly type `url` as a string
                        url,
                        type: "document",
                        name: "Government ID",
                        size: file.size
                      }))
                    };
                    
                    onUpload(docs);
                  } catch (error) {
                    toast({
                      title: "Upload Failed",
                      description: "Failed to upload captured photo",
                      variant: "destructive",
                    });
                  }
                }}
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
