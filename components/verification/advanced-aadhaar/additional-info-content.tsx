"use client";

import { useState, useEffect } from "react";
import { VerificationDetails, VerificationMethod } from "@/lib/types/verification";
import { AdditionalInfoForm } from "@/components/verification/additional-info-form";
import { useToast } from "@/components/ui/use-toast";
import { useVerificationStore } from "@/lib/store/verification";
import { verifyAadhaarOtp } from "@/lib/services/deepvue/api";
import logger from "@/lib/utils/logger";
import { useRouter } from "next/navigation";
import { storageService } from '@/lib/services/storage';
import { deepvueService } from '@/lib/services/deepvue';
import { ExtractedInfo } from "@/lib/types/deepvue";


interface Props {
  verification: VerificationDetails;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
  onComplete: () => void;
}

export function AdditionalInfoContent({ verification, isLoading, setIsLoading, onComplete }: Props) {
  const [extractedInfo, setExtractedInfo] = useState(verification.metadata?.extractedInfo);
  const { toast } = useToast();
  const router = useRouter();
  const setVerification = useVerificationStore(state => state.setVerification);

  useEffect(() => {
    // Fetch OCR data when component mounts
    const fetchOcrData = async () => {
      try {
        const response = await fetch('/api/ocr');
        if (response.ok) {
          const data = await response.json();
          setExtractedInfo(data);
        }
      } catch (error) {
        console.error('Failed to fetch OCR data:', error);
      }
    };

    fetchOcrData();
  }, []);

  // Extract Aadhaar number from OCR data or metadata
  const aadhaarNumber = verification.aadhaarNumber || verification.metadata?.extractedInfo?.idNumber || '';

  const handleSubmit = async (data: { aadhaarNumber: string; otp: string }) => {
    try {
      const ekycData = await verifyAadhaarOtp(//await deepvueService.getAadhaarEkyc(
        data.aadhaarNumber,
        data.otp
      );
      setIsLoading(true);
      logger.debug('Verifying Aadhaar OTP', { aadhaarNumber: data.aadhaarNumber });

      let faceMatchScore = 0;
      const personPhoto = verification.documents?.personPhoto?.[0];
      if (personPhoto?.url) {
        const personPhotoUrl = await storageService.getSignedUrl(personPhoto.url);
        faceMatchScore = await deepvueService.matchFaces(
          personPhotoUrl,
          ekycData.ekycData?.photo || ""
        );
      }

      // Verify OTP
      //const response = await deepvueService.verifyAadhaarOtp(data.otp, verification.metadata?.sessionId);

      const response = await fetch(`/api/verify/${verification.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          metadata: {
            ekycData,
            ocrData: extractedInfo,
            faceMatchScore,
            otpVerified: true,
            personPhotoUrl: verification.documents?.personPhoto?.[0]?.url
          }
        })
      });

      if (!response.ok) {
        throw new Error('Failed to update verification');
      }
        // Update verification with eKYC data
        const updatedVerification = await response.json();

        // Update store with new verification status
        setVerification(verification.id, {
          ...updatedVerification,
          status: 'verified',
          metadata: {
            ekycData,
            ocrData: extractedInfo,
            faceMatchScore,
            otpVerified: true,
            personPhotoUrl: verification.documents?.personPhoto?.[0]?.url
          }
        });
  
        toast({
          title: "Success",
          description: "Your verification has been processed successfully.",
        });
  
        // Use setTimeout to ensure state updates are processed before navigation
        setTimeout(() => {
          router.push(`/verify/report/${verification.id}`);
        }, 100);
  
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