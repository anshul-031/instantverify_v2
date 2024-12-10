"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { VerificationType, VerificationMethod } from '@/lib/types/verification';
import { VerificationTypeSelect } from "@/components/verification/type-select";
import { VerificationMethodSelect } from "@/components/verification/method-select";
import { Button } from "@/components/ui/button";

export default function VerifyPage() {
  const [type, setType] = useState<VerificationType>();
  const [method, setMethod] = useState<VerificationMethod>();
  const [otherPurpose, setOtherPurpose] = useState("");
  const router = useRouter();

  const handleContinue = () => {
    if (!type || !method) return;
    if (type === "other" && !otherPurpose) return;
    
    const params = new URLSearchParams({
      type,
      ...(type === "other" && { purpose: otherPurpose }),
    });

    router.push(`/verify/${method}?${params.toString()}`);
  };

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-8">
          <div className="space-y-8">
            <VerificationTypeSelect
              value={type}
              onChange={setType}
              otherPurpose={otherPurpose}
              onOtherPurposeChange={setOtherPurpose}
            />

            {type && (
              <VerificationMethodSelect
                value={method}
                country="IN"
                onChange={setMethod}
              />
            )}

            <div className="flex justify-end">
              <Button
                onClick={handleContinue}
                disabled={!type || !method || (type === "other" && !otherPurpose)}
              >
                Continue
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}