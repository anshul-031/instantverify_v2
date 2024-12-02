"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { VerificationTypeSelect } from "@/components/verification/type-select";
import { CountrySelect } from "@/components/verification/country-select";
import { VerificationMethodSelect } from "@/components/verification/method-select";
import { VerificationForm } from "@/components/verification/forms/verification-form";
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

  const handleVerificationFormSubmit = async (formData: any) => {
    try {
      const response = await fetch("/api/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
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

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!formData.type;
      case 2:
        return !!formData.country;
      case 3:
        return !!formData.method;
      default:
        return false;
    }
  };

  const handlePrevious = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const handleNext = () => {
    if (canProceed()) {
      setStep(step + 1);
    }
  };

  const renderStepContent = () => {
    switch (step) {
      case 1:
        return (
          <VerificationTypeSelect
            value={formData.type}
            onChange={(type) => setFormData({ ...formData, type })}
          />
        );
      case 2:
        return (
          <CountrySelect
            value={formData.country}
            onChange={(country) => setFormData({ ...formData, country })}
          />
        );
      case 3:
        return (
          <VerificationMethodSelect
            value={formData.method}
            country={formData.country}
            onChange={(method) => setFormData({ ...formData, method })}
          />
        );
      case 4:
        if (!formData.type || !formData.country || !formData.method) {
          return null;
        }
        return (
          <VerificationForm
            type={formData.type}
            country={formData.country}
            method={formData.method}
            onSubmit={handleVerificationFormSubmit}
            initialData={{
              ...formData,
              documents
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Verification Process</h1>
            <p className="text-gray-600 mt-2">Step {step} of 4</p>
          </div>
          
          <div className="space-y-8">
            {renderStepContent()}

            {step < 4 && (
              <div className="flex justify-between pt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handlePrevious}
                  disabled={step === 1}
                >
                  Previous
                </Button>
                
                <Button
                  type="button"
                  onClick={handleNext}
                  disabled={!canProceed()}
                >
                  Next
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}