"use client";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { 
  Home, 
  UserCheck, 
  Car, 
  Heart, 
  FileQuestion 
} from "lucide-react";
import { VerificationType } from "@/lib/types/verification";

interface Props {
  value?: VerificationType;
  onChange: (type: VerificationType) => void;
  otherPurpose: string;
  onOtherPurposeChange: (purpose: string) => void;
}

const verificationTypes = [
  {
    id: "tenant" as const,
    name: "Tenant Verification",
    description: "Verify potential tenants before renting your property",
    icon: Home
  },
  {
    id: "maid" as const,
    name: "Maid Verification",
    description: "Verify domestic help and household staff",
    icon: UserCheck
  },
  {
    id: "driver" as const,
    name: "Driver Verification",
    description: "Verify drivers before hiring",
    icon: Car
  },
  {
    id: "matrimonial" as const,
    name: "Matrimonial Verification",
    description: "Verify potential matrimonial matches",
    icon: Heart
  },
  {
    id: "other" as const,
    name: "Other Verification",
    description: "Custom verification for other purposes",
    icon: FileQuestion
  }
];

export function VerificationTypeSelect({ 
  value, 
  onChange, 
  otherPurpose, 
  onOtherPurposeChange 
}: Props) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Select Verification Type</h2>
      <p className="text-gray-600">
        Choose the type of verification you need to proceed
      </p>

      <RadioGroup
        value={value}
        onValueChange={(value) => onChange(value as VerificationType)}
        className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4"
      >
        {verificationTypes.map((type) => (
          <Label
            key={type.id}
            className="cursor-pointer"
            htmlFor={type.id}
          >
            <Card className={`p-4 hover:border-primary transition-colors ${
              value === type.id ? "border-primary" : ""
            }`}>
              <div className="flex items-start space-x-4">
                <RadioGroupItem value={type.id} id={type.id} className="mt-1" />
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <type.icon className="h-5 w-5 text-primary" />
                    <h3 className="font-medium">{type.name}</h3>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">
                    {type.description}
                  </p>
                </div>
              </div>
            </Card>
          </Label>
        ))}
      </RadioGroup>

      {value === "other" && (
        <div className="mt-4">
          <Label htmlFor="purpose">Verification Purpose</Label>
          <Input
            id="purpose"
            value={otherPurpose}
            onChange={(e) => onOtherPurposeChange(e.target.value)}
            placeholder="Please specify the purpose of verification"
            className="mt-1"
            required
          />
        </div>
      )}
    </div>
  );
}