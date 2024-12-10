"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { VoterIdInput } from "./voter-id-input";
import { DocumentUpload } from "./document-upload";
import { PhotoCapture } from "./photo-capture";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  onSubmit: (data: any) => Promise<void>;
  isSubmitting: boolean;
}

export function BasicVoterIdForm({ onSubmit, isSubmitting }: Props) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    voterIdNumber: "",
    dateOfBirth: "",
    documents: {
      voterIdPhotos: null as File[] | null,
    },
    photo: null as File | null,
  });
  
  const router = useRouter();
  const { toast } = useToast();

  const handleVoterIdSubmit = (voterIdData: { number: string; dob: string }) => {
    setFormData(prev => ({
      ...prev,
      voterIdNumber: voterIdData.number,
      dateOfBirth: voterIdData.dob,
    }));
    setStep(2);
  };

  const handleDocumentsSubmit = (documents: { voterIdPhotos: File[] }) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        ...documents,
      },
    }));
    setStep(3);
  };

  const handlePhotoSubmit = async (photo: File) => {
    try {
      const finalData = {
        ...formData,
        photo,
      };
      await onSubmit(finalData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification. Please try again.",
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
            <li>A valid Voter ID card</li>
            <li>Clear photos of your Voter ID (front and back)</li>
            <li>Good lighting for photo capture</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        {step === 1 && (
          <VoterIdInput
            onSubmit={handleVoterIdSubmit}
            initialValues={{
              number: formData.voterIdNumber,
              dob: formData.dateOfBirth,
            }}
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