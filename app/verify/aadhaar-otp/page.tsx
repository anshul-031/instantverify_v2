"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { AadhaarVerificationForm } from "@/components/verification/forms/aadhaar/verification-form";
import { useToast } from "@/components/ui/use-toast";

export default function AadhaarVerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/verify/aadhaar-otp", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Verification submission failed");
      }

      const data = await response.json();
      router.push(`/verify/payment/${data.verificationId}`);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to submit verification. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Button
          variant="ghost"
          onClick={() => router.back()}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Advanced Aadhaar Verification</h1>
            <p className="text-gray-600 mt-2">
              Complete your verification using Aadhaar and OTP
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Prerequisites for Aadhaar verification:
              <ul className="list-disc list-inside mt-2">
                <li>Valid Aadhaar card</li>
                <li>Access to Aadhaar-linked mobile number</li>
                <li>Clear photos of Aadhaar card (front and back)</li>
                <li>Your recent photo</li>
              </ul>
            </AlertDescription>
          </Alert>

          <AadhaarVerificationForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Card>
      </div>
    </div>
  );
}