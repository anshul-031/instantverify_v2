"use client";

import { useState, useEffect } from "react";
import { VerificationDetails, VerificationMethod } from "@/lib/types/verification";
import { AdditionalInfoForm } from "@/components/verification/additional-info-form";
import { useToast } from "@/components/ui/use-toast";
import { useVerificationStore } from "@/lib/store/verification";
import { deepvueService } from "@/lib/services/deepvue";
import logger from "@/lib/utils/logger";

interface Props {
  verification: VerificationDetails;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onComplete: () => void;
}

export function AdditionalInfoContent({ verification, isLoading, setIsLoading, onComplete }: Props) {
  const [extractedInfo, setExtractedInfo] = useState(verification.metadata?.extractedInfo);
  const { toast } = useToast();
  const setVerification = useVerificationStore(state => state.setVerification);

  // Extract Aadhaar number from OCR data or metadata
  const aadhaarNumber = verification.aadhaarNumber || verification.metadata?.extractedInfo?.idNumber || '';

  const handleSubmit = async (data: { aadhaarNumber: string; otp: string }) => {
    try {
      setIsLoading(true);
      logger.debug('Verifying Aadhaar OTP', { aadhaarNumber: data.aadhaarNumber });

      // Verify OTP
      const response = await deepvueService.verifyAadhaarOtp(data.otp, verification.metadata?.sessionId);

      if (response.success) {
        // Update verification with eKYC data
        setVerification(verification.id, {
          ...verification,
          status: 'verified',
          metadata: {
            ...verification.metadata,
            ekycData: response.ekycData,
          },
          updatedAt: new Date().toISOString(),
        });

        toast({
          title: "Verification Successful",
          description: "Your identity has been verified successfully.",
        });

        onComplete();
      } else {
        throw new Error(response.error || 'OTP verification failed');
      }
    } catch (error) {
      logger.error('OTP verification failed:', error);
      toast({
        title: "Verification Failed",
        description: error instanceof Error ? error.message : "Failed to verify OTP",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AdditionalInfoForm
      method={verification.method as VerificationMethod}
      onSubmit={handleSubmit}
      isSubmitting={isLoading}
      extractedInfo={extractedInfo}
      personPhotoUrl={verification.documents?.personPhoto?.[0]?.url}
      initialAadhaarNumber={aadhaarNumber} // Pass the initial Aadhaar number
    />
  );
}