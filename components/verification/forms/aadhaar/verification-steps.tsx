"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, CheckCircle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { 
  validateAadhaarDocument,
  extractAadhaarInfo,
  verifyAadhaarOTP 
} from "@/lib/services/verification/aadhaar";
import { verifyFaceMatch } from "@/lib/services/verification/biometric";

interface Props {
  aadhaarFiles: File[];
  personPhoto: File | null;
  onComplete: (data: any) => void;
  onError: (error: string) => void;
}

export function VerificationSteps({
  aadhaarFiles,
  personPhoto,
  onComplete,
  onError
}: Props) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [stepResults, setStepResults] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const steps = [
    {
      title: "Document Validation",
      description: "Validating Aadhaar card documents",
      action: async () => {
        for (const file of aadhaarFiles) {
          const result = await validateAadhaarDocument(file);
          if (!result.isValid) {
            throw new Error(result.error);
          }
        }
        return true;
      }
    },
    {
      title: "Information Extraction",
      description: "Extracting information from Aadhaar card",
      action: async () => {
        const result = await extractAadhaarInfo(aadhaarFiles[0]);
        if (!result.success) {
          throw new Error(result.error);
        }
        return result.data;
      }
    },
    {
      title: "Face Match Verification",
      description: "Verifying face match between person photo and ID",
      action: async () => {
        if (!personPhoto) {
          throw new Error("Person photo is required");
        }
        const result = await verifyFaceMatch(
          personPhoto,
          "https://example.com/id-photo.jpg" // In production, this would be the actual ID photo URL
        );
        if (!result.success) {
          throw new Error(result.error);
        }
        return result;
      }
    }
  ];

  const processStep = async () => {
    if (isProcessing || currentStep >= steps.length) return;

    setIsProcessing(true);
    const step = steps[currentStep];

    try {
      const result = await step.action();
      setStepResults(prev => ({ ...prev, [currentStep]: true }));
      
      if (currentStep === steps.length - 1) {
        onComplete(result);
      } else {
        setCurrentStep(prev => prev + 1);
        toast({
          title: "Step Completed",
          description: `${step.title} completed successfully`,
        });
      }
    } catch (error) {
      setStepResults(prev => ({ ...prev, [currentStep]: false }));
      const message = error instanceof Error ? error.message : "Step failed";
      onError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please wait while we verify your documents. This process may take a few minutes.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        {steps.map((step, index) => (
          <Card
            key={index}
            className={`p-4 ${
              currentStep === index
                ? "border-primary"
                : index < currentStep
                ? "opacity-50"
                : ""
            }`}
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-medium">{step.title}</h3>
                <p className="text-sm text-gray-600">{step.description}</p>
              </div>
              {stepResults[index] !== undefined && (
                <div className="flex items-center">
                  {stepResults[index] ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-5 w-5 text-red-500" />
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      {currentStep < steps.length && (
        <Button
          onClick={processStep}
          disabled={isProcessing}
          className="w-full"
        >
          {isProcessing ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Processing...
            </>
          ) : (
            `Start ${steps[currentStep].title}`
          )}
        </Button>
      )}
    </div>
  );
}