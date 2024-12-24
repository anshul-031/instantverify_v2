"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AdditionalInfoForm } from "@/components/verification/additional-info-form";
import { deepvueService } from '@/lib/services/deepvue';
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { VerificationDetails } from "@/lib/types/verification";
import { ExtractedInfo } from "@/lib/types/deepvue";
import { useVerificationStore } from "@/lib/store/verification";
import { storageService } from '@/lib/services/storage';
import { verifyAadhaarOtp } from "@/lib/services/deepvue/api";

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
  const router = useRouter();
  const setVerification = useVerificationStore(state => state.setVerification);

  // Extract information from documents when component mounts
  useEffect(() => {
    const extractDocumentInfo = async () => {
      const governmentId = verification.documents?.governmentId;
      
      // Check if we have both front and back documents
      if (governmentId && Array.isArray(governmentId) && governmentId.length >= 2) {
        try {
          const frontDoc = governmentId[0];
          const backDoc = governmentId[1];

          if (!frontDoc?.url || !backDoc?.url) {
            throw new Error('Missing document URLs');
          }

          // Get signed URLs for both front and back documents
          const frontSignedUrl = await storageService.getSignedUrl(frontDoc.url);
          const backSignedUrl = await storageService.getSignedUrl(backDoc.url);
          
          const info = await deepvueService.extractAadhaarOcr(frontSignedUrl, backSignedUrl);
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
      const ekycData = await verifyAadhaarOtp(//await deepvueService.getAadhaarEkyc(
        data.aadhaarNumber,
        data.otp
      );

      // Match faces if person photo exists
      let faceMatchScore = 0;
      const personPhoto = verification.documents?.personPhoto?.[0];
      if (personPhoto?.url) {
        const personPhotoUrl = await storageService.getSignedUrl(personPhoto.url);
        faceMatchScore = await deepvueService.matchFaces(
          personPhotoUrl,
          ekycData.ekycData?.photo || ""
        );
      }

      // Update verification status with both OCR and eKYC data
      const response = await fetch(`/api/verify/${verification.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'verified',
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
      personPhotoUrl={verification.documents?.personPhoto?.[0]?.url}
    />
  );
}
