"use client";

import { Shield } from "lucide-react";
import { verificationMethods } from "@/lib/data/verification-methods";
import { VerificationMethod } from "@/lib/types/verification";
import { MethodGroup } from "./method-group";

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
        <MethodGroup
          title="Advanced Verification"
          methods={verificationMethods.IN.advanced}
          selectedMethod={value}
          onMethodChange={onChange}
        />

        <MethodGroup
          title="Basic Verification"
          methods={verificationMethods.IN.basic}
          selectedMethod={value}
          onMethodChange={onChange}
        />
      </div>
    </div>
  );
}