"use client";

import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroupItem } from "@/components/ui/radio-group";
import { VerificationMethodInfo } from "@/lib/types/verification";

interface MethodCardProps {
  method: VerificationMethodInfo;
  isSelected: boolean;
  onSelect: () => void;
}

export function MethodCard({ method, isSelected, onSelect }: MethodCardProps) {
  return (
    <div className="relative">
      <RadioGroupItem
        value={method.id}
        id={method.id}
        className="sr-only"
      />
      <Label
        htmlFor={method.id}
        className="cursor-pointer block"
        onClick={onSelect}
      >
        <Card className={`p-4 hover:border-primary transition-colors ${
          isSelected ? "border-primary" : ""
        }`}>
          <div className="flex items-start space-x-4">
            <div className={`w-4 h-4 mt-1 rounded-full border-2 flex-shrink-0 ${
              isSelected 
                ? "border-primary bg-primary" 
                : "border-gray-300"
            }`} />
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