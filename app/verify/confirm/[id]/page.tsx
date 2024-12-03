"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2 } from "lucide-react";
import { AdditionalInfoForm } from "@/components/verification/additional-info-form";
import { formatMethodName } from "@/lib/utils/format";
import { getMethodDetails } from "@/lib/utils/verification";
import { useVerificationStore } from "@/lib/store/verification";

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const [submitting, setSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const { getVerification, setVerification } = useVerificationStore();
  const verification = getVerification(params.id);

  useEffect(() => {
    // Check if verification exists
    if (!verification) {
      toast({
        title: "Error",
        description: "Verification not found",
        variant: "destructive",
      });
      router.push('/verify');
      return;
    }

    // Allow both payment-complete and verified statuses
    const validStatuses = ['payment-complete', 'verified'];
    if (!validStatuses.includes(verification.status)) {
      toast({
        title: "Error",
        description: "Please complete payment first",
        variant: "destructive",
      });
      router.push(`/verify/payment/${params.id}`);
    }
  }, [verification, router, toast, params.id]);

  const handleSubmit = async (additionalInfo: NonNullable<typeof verification>['additionalInfo']) => {
    if (!verification) return;

    setSubmitting(true);
    try {
      const response = await fetch(`/api/verify/${params.id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...verification,
          additionalInfo,
          status: 'verified'
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to confirm verification");
      }

      const updatedVerification = await response.json();

      // Update verification status in store
      setVerification(params.id, {
        ...verification,
        ...updatedVerification,
        additionalInfo,
        status: 'verified',
        updatedAt: new Date().toISOString()
      });

      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted successfully.",
      });

      router.push(`/verify/status/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to submit verification",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (!verification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const methodDetails = getMethodDetails(verification.method);
  const requiresAdditionalInfo = methodDetails?.securityLevel === 'most-advanced';

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful</h1>
            <p className="text-gray-600">
              {requiresAdditionalInfo 
                ? "Please confirm your information and provide any additional details required"
                : "Your verification request is being processed"}
            </p>
          </div>

          <div className="space-y-8">
            <div className="border-t border-b py-4">
              <h2 className="font-semibold mb-4">Verification Summary</h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Type</dt>
                  <dd className="font-medium capitalize">{verification.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Method</dt>
                  <dd className="font-medium">{formatMethodName(verification.method)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Security Level</dt>
                  <dd className="font-medium capitalize">{verification.securityLevel.replace('-', ' ')}</dd>
                </div>
              </dl>
            </div>

            {requiresAdditionalInfo ? (
              <AdditionalInfoForm
                method={verification.method}
                onSubmit={handleSubmit}
                isSubmitting={submitting}
              />
            ) : (
              <div className="text-center">
                <Button
                  onClick={() => router.push(`/verify/status/${params.id}`)}
                  className="w-full max-w-md mx-auto"
                >
                  View Verification Status
                </Button>
              </div>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}