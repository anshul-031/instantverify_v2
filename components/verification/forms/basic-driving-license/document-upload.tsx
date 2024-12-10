"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Camera, Upload, X } from "lucide-react";
import { CameraCapture } from "@/components/verification/camera/camera-capture";

interface Props {
  onSubmit: (documents: { licensePhotos: File[] }) => void;
  initialDocuments?: {
    licensePhotos: File[] | null;
  };
  isSubmitting?: boolean;
}

export function DocumentUpload({
  onSubmit,
  initialDocuments,
  isSubmitting = false,
}: Props) {
  const [documents, setDocuments] = useState<File[]>(initialDocuments?.licensePhotos || []);
  const [activeCamera, setActiveCamera] = useState<"front" | "back" | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newFiles = Array.from(e.target.files);
      setDocuments(prev => [...prev, ...newFiles].slice(0, 2));
    }
  };

  const handleCameraCapture = (file: File) => {
    if (documents.length < 2) {
      setDocuments(prev => [...prev, file]);
    }
    setActiveCamera(null);
  };

  const handleRemove = (index: number) => {
    setDocuments(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (documents.length === 2) {
      onSubmit({ licensePhotos: documents });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please upload clear photos of your Driving License:
          <ul className="list-disc list-inside mt-2">
            <li>Front side of the license</li>
            <li>Back side of the license</li>
            <li>Ensure all text is clearly visible</li>
            <li>Maximum file size: 5MB per image</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {documents.map((doc, index) => (
          <div key={index} className="relative">
            <img
              src={URL.createObjectURL(doc)}
              alt={`License ${index === 0 ? 'Front' : 'Back'}`}
              className="w-full h-48 object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="destructive"
              size="icon"
              className="absolute top-2 right-2"
              onClick={() => handleRemove(index)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ))}

        {documents.length < 2 && (
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
                id="license-photo"
                disabled={isSubmitting}
              />
              <Label
                htmlFor="license-photo"
                className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
              >
                <Upload className="h-6 w-6 mb-2" />
                <span className="text-sm">Upload File</span>
              </Label>
            </div>

            <Dialog open={!!activeCamera} onOpenChange={(open) => setActiveCamera(open ? "front" : null)}>
              <DialogTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  className="h-32"
                  disabled={isSubmitting}
                >
                  <Camera className="h-6 w-6 mr-2" />
                  Use Camera
                </Button>
              </DialogTrigger>
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

      <Button
        type="submit"
        disabled={documents.length !== 2 || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
}