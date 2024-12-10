"use client";

import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle2 } from "lucide-react";

interface Props {
  title: string;
  description: string;
  steps: string[];
  currentStep: number;
}

export function VerificationStatus({
  title,
  description,
  steps,
  currentStep,
}: Props) {
  const progress = (currentStep / steps.length) * 100;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        <p className="text-gray-600 mt-1">{description}</p>
      </div>

      <div className="space-y-4">
        <Progress value={progress} className="h-2" />
        
        <div className="grid gap-4">
          {steps.map((step, index) => {
            const isCompleted = index < currentStep;
            const isCurrent = index === currentStep - 1;

            return (
              <div
                key={index}
                className={`flex items-center space-x-3 ${
                  isCompleted ? "text-primary" : 
                  isCurrent ? "text-gray-900" : "text-gray-400"
                }`}
              >
                <div className={`
                  flex items-center justify-center w-6 h-6 rounded-full
                  ${isCompleted ? "bg-primary text-white" :
                    isCurrent ? "border-2 border-primary" : "border-2 border-gray-200"}
                `}>
                  {isCompleted ? (
                    <CheckCircle2 className="h-4 w-4" />
                  ) : (
                    <span className="text-sm">{index + 1}</span>
                  )}
                </div>
                <span className="font-medium">{step}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}