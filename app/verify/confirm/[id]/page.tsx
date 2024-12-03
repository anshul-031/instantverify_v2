"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle2, AlertTriangle } from "lucide-react";
import { VerificationDetails } from "@/lib/types/verification";
import { AdditionalInfoForm } from "@/components/verification/additional-info-form";
import { formatMethodName, formatSecurityLevel } from "@/lib/utils/format";

export default function ConfirmationPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [details, setDetails] = useState<VerificationDetails | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/verify/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch verification details");
        const data = await response.json();
        setDetails(data);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load verification details",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [params.id, toast]);

  const handleSubmit = async (additionalInfo: VerificationDetails['additionalInfo']) => {
    setSubmitting(true);
    try {
      const response = await fetch(`/api/verify/${params.id}/confirm`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(additionalInfo),
      });

      if (!response.ok) throw new Error("Failed to confirm verification");

      toast({
        title: "Verification Submitted",
        description: "Your verification request has been submitted successfully.",
      });

      router.push(`/verify/status/${params.id}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verification not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold mb-2">Payment Successful</h1>
            <p className="text-gray-600">
              Please confirm your information and provide any additional details required
            </p>
          </div>

          <div className="space-y-8">
            <div className="border-t border-b py-4">
              <h2 className="font-semibold mb-4">Verification Summary</h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Type</dt>
                  <dd className="font-medium capitalize">{details.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Method</dt>
                  <dd className="font-medium">{formatMethodName(details.method)}</dd>
                </div>
                {details.securityLevel && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Security Level</dt>
                    <dd className="font-medium capitalize">
                      {formatSecurityLevel(details.securityLevel)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <AdditionalInfoForm
              method={details.method}
              onSubmit={handleSubmit}
              isSubmitting={submitting}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}