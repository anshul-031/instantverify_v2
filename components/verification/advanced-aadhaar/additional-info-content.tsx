"use client";

import { useState, useEffect } from "react";
import { AdditionalInfoForm } from "@/components/verification/additional-info-form";
import { deepvueService } from "@/lib/services/deepvue";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { VerificationDetails } from "@/lib/types/verification";
import { ExtractedInfo } from "@/lib/types/deepvue";

interface Props {
  verification: VerificationDetails;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onComplete: () => void;
}

export function AdditionalInfoContent({
  verification,
  isLoading,
  setIsLoading,
  onComplete
}: Props) {
  const [extractedInfo, setExtractedInfo] = useState<ExtractedInfo | null>(null);
  const { toast } = useToast();

  // Extract information from documents when component mounts
  useEffect(() => {
    const extractDocumentInfo = async () => {
      if (verification.documents?.governmentId?.[0]) {
        try {
          const info = await deepvueService.extractAadhaarOcr(
            verification.documents.governmentId[0].url
          );
          setExtractedInfo(info);
        } catch (error) {
          console.error('Failed to extract document info:', error);
          toast({
            title: "Error",
            description: "Failed to extract document information",
            variant: "destructive",
          });
        }
      }
    };

    extractDocumentInfo();
  }, [verification.documents?.governmentId, toast]);

  const handleSubmit = async (data: { aadhaarNumber: string; otp: string }) => {
    setIsLoading(true);
    try {
      // Verify OTP and get eKYC data
      const ekycData = await deepvueService.getAadhaarEkyc(
        data.aadhaarNumber,
        data.otp
      );

      // Match faces if person photo exists
      let faceMatchScore = 0;
      if (verification.documents?.personPhoto?.[0]) {
        faceMatchScore = await deepvueService.matchFaces(
          verification.documents.personPhoto[0].url,
          ekycData.photo
        );
      }

      // Update verification status
      const response = await fetch(`/api/verify/${verification.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'verified',
          metadata: {
            ekycData,
            faceMatchScore,
            otpVerified: true
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update verification');
      }

      toast({
        title: "Verification Complete",
        description: "Your verification has been processed successfully.",
      });

      onComplete();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to complete verification",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!extractedInfo) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <AdditionalInfoForm
      method="advanced-aadhaar"
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      extractedInfo={extractedInfo}
    />
  );
}