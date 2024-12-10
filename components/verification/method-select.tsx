"use client";

import { Card } from "@/components/ui/card";
import { RadioGroup } from "@/components/ui/radio-group";
import { Shield } from "lucide-react";
import { verificationMethods } from "@/lib/data/verification-methods";
import { VerificationMethod } from "@/lib/types/verification";
import { MethodCard } from "./method-card";

interface Props {
  value?: VerificationMethod;
  country?: string;
  onChange: (method: VerificationMethod) => void;
}

export function VerificationMethodSelect({ value, country, onChange }: Props) {
  if (country !== "IN") {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">
          Please select India to view available verification methods.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Shield className="h-5 w-5 text-primary" />
        <h2 className="text-xl font-semibold">Select Verification Method</h2>
      </div>

      <div className="space-y-8">
        <div className="space-y-4">
          <h3 className="font-medium">Advanced Verification</h3>
          <RadioGroup value={value} onValueChange={(value) => onChange(value as VerificationMethod)}>
            {verificationMethods.IN.advanced.map((method) => (
              <MethodCard
                key={method.id}
                method={method}
                isSelected={value === method.id}
                onSelect={() => onChange(method.id)}
              />
            ))}
          </RadioGroup>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Basic Verification</h3>
          <RadioGroup value={value} onValueChange={(value) => onChange(value as VerificationMethod)}>
            {verificationMethods.IN.basic.map((method) => (
              <MethodCard
                key={method.id}
                method={method}
                isSelected={value === method.id}
                onSelect={() => onChange(method.id)}
              />
            ))}
          </RadioGroup>
        </div>
      </div>
    </div>
  );
}