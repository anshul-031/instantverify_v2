// components/verification/forms/advanced-aadhaar/document-upload.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { AlertTriangle, Camera, Upload, X } from "lucide-react";
import { CameraCapture } from "@/components/verification/camera/camera-capture";
import { extractAadhaarOcr } from "@/lib/services/deepvue/api";
import { useToast } from "@/components/ui/use-toast";

interface DocumentUploadProps {
  onSubmit: (data: { 
    aadhaarFront: File; 
    aadhaarBack: File;
    extractedInfo?: any; 
  }) => void;
  initialDocuments?: {
    aadhaarFront: File | null;
    aadhaarBack: File | null;
  };
  isSubmitting?: boolean;
}

export function DocumentUpload({
  onSubmit,
  initialDocuments,
  isSubmitting = false,
}: DocumentUploadProps) {
  const [documents, setDocuments] = useState({
    aadhaarFront: initialDocuments?.aadhaarFront || null,
    aadhaarBack: initialDocuments?.aadhaarBack || null,
  });
  const [activeCamera, setActiveCamera] = useState<"front" | "back" | null>(null);
  const { toast } = useToast();

  const handleFileChange = (side: "front" | "back") => (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setDocuments(prev => ({
        ...prev,
        [`aadhaar${side.charAt(0).toUpperCase()}${side.slice(1)}`]: e.target.files![0],
      }));
    }
  };

  const handleCameraCapture = (file: File) => {
    if (activeCamera) {
      setDocuments(prev => ({
        ...prev,
        [`aadhaar${activeCamera.charAt(0).toUpperCase()}${activeCamera.slice(1)}`]: file,
      }));
      setActiveCamera(null);
    }
  };

  const handleRemove = (side: "front" | "back") => {
    setDocuments(prev => ({
      ...prev,
      [`aadhaar${side.charAt(0).toUpperCase()}${side.slice(1)}`]: null,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!documents.aadhaarFront || !documents.aadhaarBack) return;

    try {
      // Convert images to base64
      const document1 = await fileToBase64(documents.aadhaarFront);
      const document2 = await fileToBase64(documents.aadhaarBack);

      // Call OCR API
      const extractedInfo = await extractAadhaarOcr(document1, document2);

      // Submit data with extracted info
      onSubmit({
        aadhaarFront: documents.aadhaarFront,
        aadhaarBack: documents.aadhaarBack,
        extractedInfo
      });

    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to process Aadhaar card",
        variant: "destructive",
      });
    }
  };

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = reader.result as string;
        resolve(base64String.split(',')[1]);
      };
      reader.onerror = (error) => reject(error);
    });
  };

  // Rest of the component remains the same...
  // (Keep the existing JSX and UI code)

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please upload clear photos of your Aadhaar card:
          <ul className="list-disc list-inside mt-2">
            <li>Ensure all text is clearly visible</li>
            <li>Avoid glare and shadows</li>
            <li>Maximum file size: 5MB per image</li>
            <li>Supported formats: JPG, PNG, PDF</li>
          </ul>
        </AlertDescription>
      </Alert>

      <div className="grid gap-6">
        {/* Front Side */}
        <div className="space-y-4">
          <Label>Aadhaar Card (Front)</Label>
          {documents.aadhaarFront ? (
            <div className="relative aspect-[1.6] rounded-lg overflow-hidden border-2 border-primary">
              <img
                src={URL.createObjectURL(documents.aadhaarFront)}
                alt="Aadhaar Front"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleRemove("front")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange("front")}
                  className="hidden"
                  id="aadhaar-front"
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="aadhaar-front"
                  className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-sm">Upload File</span>
                </Label>
              </div>

              <Dialog open={activeCamera === "front"} onOpenChange={(open) => setActiveCamera(open ? "front" : null)}>
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

        {/* Back Side */}
        <div className="space-y-4">
          <Label>Aadhaar Card (Back)</Label>
          {documents.aadhaarBack ? (
            <div className="relative aspect-[1.6] rounded-lg overflow-hidden border-2 border-primary">
              <img
                src={URL.createObjectURL(documents.aadhaarBack)}
                alt="Aadhaar Back"
                className="w-full h-full object-cover"
              />
              <Button
                type="button"
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2"
                onClick={() => handleRemove("back")}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <input
                  type="file"
                  accept="image/*,application/pdf"
                  onChange={handleFileChange("back")}
                  className="hidden"
                  id="aadhaar-back"
                  disabled={isSubmitting}
                />
                <Label
                  htmlFor="aadhaar-back"
                  className="flex flex-col items-center justify-center h-32 border-2 border-dashed rounded-lg cursor-pointer hover:border-primary transition-colors"
                >
                  <Upload className="h-6 w-6 mb-2" />
                  <span className="text-sm">Upload File</span>
                </Label>
              </div>

              <Dialog open={activeCamera === "back"} onOpenChange={(open) => setActiveCamera(open ? "back" : null)}>
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
      </div>

      <Button
        type="submit"
        disabled={!documents.aadhaarFront || !documents.aadhaarBack || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
}
