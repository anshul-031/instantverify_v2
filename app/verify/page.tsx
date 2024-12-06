"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { VerificationTypeSelect } from "@/components/verification/type-select";
import { CountrySelect } from "@/components/verification/country-select";
import { VerificationMethodSelect } from "@/components/verification/method-select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { VerificationType, VerificationMethod } from "@/lib/types/verification";

export default function VerificationPage() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState<VerificationType>();
  const [country, setCountry] = useState<string>();
  const [method, setMethod] = useState<VerificationMethod>();
  const router = useRouter();

  const handleNext = () => {
    if (step === 3 && method) {
      // Route to specific verification page based on method
      router.push(`/verify/${method}`);
      return;
    }
    setStep(step + 1);
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const canProceed = () => {
    switch (step) {
      case 1:
        return !!type;
      case 2:
        return !!country;
      case 3:
        return !!method;
      default:
        return false;
    }
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Select Verification Type</h2>
            <VerificationTypeSelect
              value={type}
              onChange={setType}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Select Country</h2>
            <CountrySelect
              value={country}
              onChange={setCountry}
            />
          </div>
        );
      case 3:
        if (!country) return null;
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold">Select Verification Method</h2>
            {country !== "IN" ? (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Currently, only Indian IDs are supported. Support for other countries will be added soon.
                </AlertDescription>
              </Alert>
            ) : (
              <VerificationMethodSelect
                value={method}
                country={country}
                onChange={setMethod}
              />
            )}
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto">
        <Card className="p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold">Start Verification</h1>
            <p className="text-gray-600 mt-2">Step {step} of 3</p>
          </div>

          {renderStep()}

          <div className="flex justify-between mt-8">
            {step > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
              >
                Back
              </Button>
            )}
            <Button
              onClick={handleNext}
              disabled={!canProceed()}
              className={step === 1 ? "w-full" : ""}
            >
              {step === 3 ? "Start Verification" : "Next"}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}