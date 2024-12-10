"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { BasicVoterIdForm } from "@/components/verification/forms/basic-voter-id/form";
import { VerificationStatus } from "@/components/verification/status";
import { useVerificationStore } from "@/lib/store/verification";
import { submitVerification } from "@/lib/services/verification/submit";
import { useToast } from "@/components/ui/use-toast";

export default function BasicVoterIdVerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const setVerification = useVerificationStore(state => state.setVerification);

  const type = searchParams.get("type") as "tenant" | "maid" | "driver" | "matrimonial" | "other";
  const purpose = searchParams.get("purpose");

  const handleSubmit = async (formData: any) => {
    try {
      setIsSubmitting(true);
      
      const verificationData = {
        type,
        method: "basic-voter-id",
        ...formData,
        ...(type === "other" && { purpose }),
      };

      const result = await submitVerification(verificationData);
      
      setVerification(result.id, {
        ...verificationData,
        id: result.id,
        status: "pending",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });

      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted successfully.",
      });

      router.push(`/verify/status/${result.id}`);
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
          title="Basic Voter ID Verification"
          description="Complete your verification using Voter ID"
          steps={[
            "Enter voter ID details",
            "Upload documents",
            "Capture photo",
            "Submit verification"
          ]}
          currentStep={1}
        />
      </Card>

      <BasicVoterIdForm
        onSubmit={handleSubmit}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}