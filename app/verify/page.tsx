"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { VerificationTypeSelect } from "@/components/verification/type-select";
import { CountrySelect } from "@/components/verification/country-select";
import { VerificationMethodSelect } from "@/components/verification/method-select";
import { DocumentUpload } from "@/components/verification/document-upload";
import { PersonPhotoCapture } from "@/components/verification/photo-capture";
import { 
  VerificationType, 
  VerificationMethod,
  VerificationDocuments 
} from "@/lib/types/verification";

interface FormData {
  type?: VerificationType;
  country?: string;
  method?: VerificationMethod;
  documents?: VerificationDocuments;
}

export default function VerificationPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({});
  const [documents, setDocuments] = useState<VerificationDocuments>({});
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.type || !formData.country || !formData.method) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    if (documents.governmentId?.length) {
      toast({
        title: "Error",
        description: "Please upload required documents",
        variant: "destructive",
      });
      return;
    }

    if (documents.personPhoto) {
      toast({
        title: "Error",
        description: "Please capture or upload your photo",
        variant: "destructive",
      });
      return;
    }

    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          documents,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit verification");
      }

      const { verificationId } = await response.json();
      router.push(`/verify/payment/${verificationId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDocumentsUpload = (newDocuments: VerificationDocuments) => {
    setDocuments(prev => ({
      ...prev,
      ...newDocuments
    }));
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!formData.type;
      case 2:
        return !!formData.country;
      case 3:
        return !!formData.method;
      case 4:
        return !!documents.governmentId?.length && !!documents.personPhoto;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <h1 className="text-3xl font-bold mb-8">Verification Process</h1>
          
          <form onSubmit={handleSubmit} className="space-y-8">
            {step === 1 && (
              <VerificationTypeSelect
                value={formData.type}
                onChange={(type) => setFormData({ ...formData, type })}
              />
            )}

            {step === 2 && (
              <CountrySelect
                value={formData.country}
                onChange={(country) => setFormData({ ...formData, country })}
              />
            )}

            {step === 3 && (
              <VerificationMethodSelect
                value={formData.method}
                country={formData.country}
                onChange={(method) => setFormData({ ...formData, method })}
              />
            )}

            {step === 4 && (
              <>
                <DocumentUpload
                  method={formData.method}
                  onUpload={handleDocumentsUpload}
                  existingDocuments={documents}
                />
                <PersonPhotoCapture
                  onCapture={(photo) => handleDocumentsUpload({ personPhoto: photo })}
                  existingPhoto={documents.personPhoto as File}
                />
              </>
            )}

            <div className="flex justify-between pt-6">
              {step > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setStep(step - 1)}
                >
                  Previous
                </Button>
              )}
              
              {step < 4 ? (
                <Button
                  type="button"
                  onClick={() => setStep(step + 1)}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              ) : (
                <Button 
                  type="submit"
                  disabled={canProceed()}
                >
                  Submit Verification
                </Button>
              )}
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
}