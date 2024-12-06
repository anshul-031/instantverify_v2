"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, ArrowLeft } from "lucide-react";
import { DrivingLicenseVerificationForm } from "@/components/verification/forms/driving-license/verification-form";
import { useToast } from "@/components/ui/use-toast";

export default function DrivingLicenseVerificationPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    try {
      const response = await fetch("/api/verify/driving-license", {
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
            <h1 className="text-3xl font-bold">Driving License Verification</h1>
            <p className="text-gray-600 mt-2">
              Complete your verification using your driving license
            </p>
          </div>

          <Alert className="mb-8">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Prerequisites for driving license verification:
              <ul className="list-disc list-inside mt-2">
                <li>Valid driving license</li>
                <li>Clear photos of driving license (front and back)</li>
                <li>Your recent photo</li>
              </ul>
            </AlertDescription>
          </Alert>

          <DrivingLicenseVerificationForm
            onSubmit={handleSubmit}
            isSubmitting={isSubmitting}
          />
        </Card>
      </div>
    </div>
  );
}