"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { AdvancedAadhaarForm } from "@/components/verification/forms/advanced-aadhaar/form";
import { VerificationStatus } from "@/components/verification/status";
import { useVerificationStore } from "@/lib/store/verification";
import { submitVerification } from "@/lib/services/verification/submit";
import { useToast } from "@/components/ui/use-toast";
import { VerificationType } from "@/lib/types/verification";

export default function AdvancedAadhaarVerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const setVerification = useVerificationStore(state => state.setVerification);

  // Get verification type from URL params
  const type = (searchParams.get("type") || "tenant") as VerificationType;
  const purpose = searchParams.get("purpose");

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      const verificationData = {
        type, // Use the type from URL params
        method: "advanced-aadhaar",
        ...formData,
        ...(type === "other" && { purpose }), // Include purpose only for "other" type
      };

      const result = await submitVerification(verificationData);
      
      setVerification(result.id, {
        ...verificationData,
        id: result.id,
        status: "payment-pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Documents Uploaded",
        description: "Please proceed with payment to continue verification.",
      });

      router.push(`/verify/payment/${result.id}`);
    } catch (error) {
      console.error("Verification submission error:", error);
      toast({
        title: "Submission Failed",
        description: "Failed to submit verification request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <VerificationStatus
          title="Advanced Aadhaar Verification"
          description="Complete your verification using Aadhaar with OTP and eKYC"
          steps={[
            "Upload documents",
            "Complete payment",
            "Verify with OTP",
            "Confirm information",
            "View report"
          ]}
          currentStep={1}
        />
      </Card>

      <AdvancedAadhaarForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}