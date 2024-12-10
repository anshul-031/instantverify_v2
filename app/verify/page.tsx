"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { verificationMethods, getVerificationMethod } from "@/lib/data/verification-methods";
import { VerificationType, VerificationMethod } from "@/lib/types/verification";

export default function VerifyPage() {
  const [type, setType] = useState<VerificationType>();
  const [otherPurpose, setOtherPurpose] = useState("");
  const [method, setMethod] = useState<VerificationMethod>();
  const router = useRouter();

  const handleContinue = () => {
    if (!type || !method) return;
    
    const params = new URLSearchParams({
      type,
      ...(type === "other" && { purpose: otherPurpose }),
    });

    router.push(`/verify/${method}?${params.toString()}`);
  };

  const verificationTypes = [
    { id: "tenant", label: "Tenant Verification" },
    { id: "maid", label: "Maid Verification" },
    { id: "driver", label: "Driver Verification" },
    { id: "matrimonial", label: "Matrimonial Verification" },
    { id: "other", label: "Other Verification" },
  ];

  const selectedMethod = method ? getVerificationMethod("IN", method) : undefined;

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-2xl font-bold mb-4">Select Verification Type</h1>
              <RadioGroup
                value={type}
                onValueChange={(value) => setType(value as VerificationType)}
                className="space-y-4"
              >
                {verificationTypes.map((vType) => (
                  <div key={vType.id} className="flex items-center space-x-2">
                    <RadioGroupItem value={vType.id} id={vType.id} />
                    <Label htmlFor={vType.id}>{vType.label}</Label>
                  </div>
                ))}
              </RadioGroup>

              {type === "other" && (
                <div className="mt-4">
                  <Label htmlFor="purpose">Verification Purpose</Label>
                  <Input
                    id="purpose"
                    value={otherPurpose}
                    onChange={(e) => setOtherPurpose(e.target.value)}
                    placeholder="Please specify the purpose of verification"
                    className="mt-1"
                    required
                  />
                </div>
              )}
            </div>

            {type && (
              <div>
                <h2 className="text-xl font-bold mb-4">Select Verification Method</h2>
                <div className="grid gap-6">
                  <div>
                    <h3 className="font-semibold mb-3">Advanced Verification</h3>
                    <div className="space-y-4">
                      {verificationMethods.IN.advanced.map((vMethod) => (
                        <Card
                          key={vMethod.id}
                          className={`p-4 cursor-pointer transition ${
                            method === vMethod.id ? "border-primary" : ""
                          }`}
                          onClick={() => setMethod(vMethod.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{vMethod.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {vMethod.description}
                              </p>
                              <div className="mt-2">
                                <span className="text-lg font-bold">₹{vMethod.price}</span>
                                <span className="text-sm text-gray-600 ml-1">+ GST</span>
                              </div>
                            </div>
                            <RadioGroupItem
                              value={vMethod.id}
                              checked={method === vMethod.id}
                              className="mt-1"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-3">Basic Verification</h3>
                    <div className="space-y-4">
                      {verificationMethods.IN.basic.map((vMethod) => (
                        <Card
                          key={vMethod.id}
                          className={`p-4 cursor-pointer transition ${
                            method === vMethod.id ? "border-primary" : ""
                          }`}
                          onClick={() => setMethod(vMethod.id)}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-medium">{vMethod.name}</h4>
                              <p className="text-sm text-gray-600 mt-1">
                                {vMethod.description}
                              </p>
                              <div className="mt-2">
                                <span className="text-lg font-bold">₹{vMethod.price}</span>
                                <span className="text-sm text-gray-600 ml-1">+ GST</span>
                              </div>
                            </div>
                            <RadioGroupItem
                              value={vMethod.id}
                              checked={method === vMethod.id}
                              className="mt-1"
                            />
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {selectedMethod && (
              <div>
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>
                    <h4 className="font-medium mb-2">Prerequisites:</h4>
                    <ul className="list-disc list-inside space-y-1">
                      {selectedMethod.prerequisites.map((prereq, index) => (
                        <li key={index}>{prereq}</li>
                      ))}
                    </ul>
                  </AlertDescription>
                </Alert>
              </div>
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