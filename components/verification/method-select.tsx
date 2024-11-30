"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Shield } from "lucide-react";
import { verificationMethods } from "@/lib/data/countries";
import { VerificationMethod } from "@/lib/types/verification";

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
        {Object.entries(verificationMethods).map(([level, methods]) => (
          <div key={level} className="space-y-4">
            <h3 className="font-medium capitalize">
              {level.replace("-", " ")} Verification
            </h3>
            
            <RadioGroup
              value={value}
              onValueChange={(value) => onChange(value as VerificationMethod)}
              className="grid grid-cols-1 gap-4"
            >
              {methods.map((method) => (
                <Label
                  key={method.id}
                  className="cursor-pointer"
                  htmlFor={method.id}
                >
                  <Card className={`p-4 hover:border-primary transition-colors ${
                    value === method.id ? "border-primary" : ""
                  }`}>
                    <div className="flex items-start space-x-4">
                      <RadioGroupItem 
                        value={method.id} 
                        id={method.id} 
                        className="mt-1"
                      />
                      <div className="flex-1">
                        <h4 className="font-medium">{method.name}</h4>
                        <ul className="mt-2 space-y-1">
                          {method.requirements.map((req, index) => (
                            <li key={index} className="text-sm text-gray-600">
                              • {req}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </Label>
              ))}
            </RadioGroup>
          </div>
        ))}
      </div>
    </div>
  );
}