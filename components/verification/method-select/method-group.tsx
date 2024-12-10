"use client";

import { RadioGroup } from "@/components/ui/radio-group";
import { VerificationMethodInfo, VerificationMethod } from '@/lib/types/verification';
import { MethodCard } from "./method-card";

interface MethodGroupProps {
  title: string;
  methods: VerificationMethodInfo[];
  selectedMethod?: VerificationMethod;
  onMethodChange: (method: VerificationMethod) => void;
}

export function MethodGroup({ 
  title, 
  methods, 
  selectedMethod, 
  onMethodChange 
}: MethodGroupProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-medium">{title}</h3>
      <RadioGroup 
        value={selectedMethod} 
        onValueChange={(value) => onMethodChange(value as VerificationMethod)}
      >
        <div className="space-y-4">
          {methods.map((method) => (
            <MethodCard
              key={method.id}
              method={method}
              isSelected={selectedMethod === method.id}
              value={method.id}
            />
          ))}
        </div>
      </RadioGroup>
    </div>
  );
}