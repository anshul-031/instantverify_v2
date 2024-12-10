"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { AadhaarInput } from "./aadhaar-input";
import { DocumentUpload } from "./document-upload";
import { PhotoCapture } from "./photo-capture";
import { useToast } from "@/components/ui/use-toast";
import { uploadFiles } from "@/lib/utils/upload";

interface Props {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

interface FormData {
  aadhaarNumber: string;
  documents: {
    aadhaarFront: File | null;
    aadhaarBack: File | null;
  };
  photo: File | null;
}

export function AdvancedAadhaarForm({ onSubmit, isSubmitting }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    aadhaarNumber: "",
    documents: {
      aadhaarFront: null,
      aadhaarBack: null,
    },
    photo: null,
  });
  
  const router = useRouter();
  const { toast } = useToast();

  const handleAadhaarSubmit = (aadhaarNumber: string) => {
    setFormData(prev => ({ ...prev, aadhaarNumber }));
    setStep(2);
  };

  const handleDocumentsSubmit = (documents: { aadhaarFront: File; aadhaarBack: File }) => {
    setFormData(prev => ({
      ...prev,
      documents
    }));
    setStep(3);
  };

  const handlePhotoSubmit = async (photo: File) => {
    try {
      // Upload all files first
      const filesToUpload = [
        formData.documents.aadhaarFront,
        formData.documents.aadhaarBack,
        photo
      ].filter((file): file is File => file !== null);

      const { urls } = await uploadFiles(filesToUpload);

      // Prepare final data with URLs
      const finalData = {
        aadhaarNumber: formData.aadhaarNumber,
        documents: {
          governmentId: [
            {
              url: urls[0],
              type: "document",
              name: "Aadhaar Front",
              size: formData.documents.aadhaarFront?.size || 0
            },
            {
              url: urls[1],
              type: "document",
              name: "Aadhaar Back",
              size: formData.documents.aadhaarBack?.size || 0
            }
          ],
          personPhoto: [{
            url: urls[2],
            type: "photo",
            name: "Person Photo",
            size: photo.size
          }]
        }
      };

      await onSubmit(finalData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload files. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleBack = () => {
    if (step === 1) {
      router.back();
    } else {
      setStep(step - 1);
    }
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={handleBack}
        className="flex items-center text-gray-600 hover:text-gray-900"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please ensure you have:
          <ul className="list-disc list-inside mt-2">
            <li>A valid Aadhaar card</li>
            <li>Clear photos of your Aadhaar card (front and back)</li>
            <li>Good lighting for photo capture</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        {step === 1 && (
          <AadhaarInput
            onSubmit={handleAadhaarSubmit}
            initialValue={formData.aadhaarNumber}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 2 && (
          <DocumentUpload
            onSubmit={handleDocumentsSubmit}
            initialDocuments={formData.documents}
            isSubmitting={isSubmitting}
          />
        )}

        {step === 3 && (
          <PhotoCapture
            onSubmit={handlePhotoSubmit}
            isSubmitting={isSubmitting}
          />
        )}
      </Card>
    </div>
  );
}