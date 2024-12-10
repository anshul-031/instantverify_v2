"use client";

import { useState } from "react";
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

  const handleSubmit = async (data: { otp: string }) => {
    setIsLoading(true);
    try {
      if (!verification.aadhaarNumber) {
        throw new Error('Aadhaar number not found');
      }

      // Verify OTP and get eKYC data
      const ekycData = await deepvueService.getAadhaarEkyc(
        verification.aadhaarNumber,
        data.otp
      );

      // Safely access personPhoto
      const personPhoto = verification.documents?.personPhoto?.[0];
      if (!personPhoto) {
        throw new Error('Person photo not found');
      }

      // Match faces
      const faceMatchScore = await deepvueService.matchFaces(
        personPhoto.url,
        ekycData.photo
      );

      // Update verification and proceed
      onComplete();
    } catch (error) {
      toast({
        title: "Verification Failed",
        description: "Failed to complete verification. Please try again.",
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