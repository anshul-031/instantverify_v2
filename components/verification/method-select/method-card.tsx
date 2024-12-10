"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { VerificationMethodInfo } from "@/lib/types/verification";

interface MethodCardProps {
  method: VerificationMethodInfo;
  isSelected: boolean;
  value: string;
}

export function MethodCard({ method, isSelected, value }: MethodCardProps) {
  return (
    <div className="relative">
      <Label
        htmlFor={method.id}
        className="cursor-pointer block"
      >
        <Card className={`p-4 hover:border-primary transition-colors ${
          isSelected ? "border-primary" : ""
        }`}>
          <div className="flex items-start space-x-4">
            <RadioGroupItem
              value={value}
              id={method.id}
              className="mt-1"
            />
            <div className="flex-1">
              <h4 className="font-medium">{method.name}</h4>
              <p className="text-sm text-gray-600 mt-1">{method.description}</p>
              <div className="mt-2 space-y-2">
                <div className="text-sm text-gray-600">
                  <strong>Requirements:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {method.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
                <div className="text-sm text-gray-600">
                  <strong>Prerequisites:</strong>
                  <ul className="list-disc list-inside mt-1">
                    {method.prerequisites.map((prereq, index) => (
                      <li key={index}>{prereq}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className="mt-2">
                <span className="text-lg font-bold">₹{method.price}</span>
                <span className="text-sm text-gray-600 ml-1">+ GST</span>
              </div>
            </div>
          </div>
        </Card>
      </Label>
    </div>
  );
}