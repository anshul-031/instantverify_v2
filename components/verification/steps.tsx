"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { Card } from "@/components/ui/card";
import { 
  ClipboardList, 
  FileText, 
  CreditCard, 
  CheckCircle,
  CircleDot
} from "lucide-react";

const steps = [
  {
    id: "details",
    title: "Provide Details",
    icon: ClipboardList,
  },
  {
    id: "documents",
    title: "Upload Documents",
    icon: FileText,
  },
  {
    id: "payment",
    title: "Payment",
    icon: CreditCard,
  },
  {
    id: "verification",
    title: "Verification",
    icon: CheckCircle,
  },
];

export function Steps() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  // Determine current step based on URL
  const currentStep = pathname.includes("/payment")
    ? "payment"
    : pathname.includes("/verify/")
    ? "details"
    : pathname.includes("/documents")
    ? "documents"
    : "verification";

  return (
    <Card className="p-6">
      <div className="flex justify-between">
        {steps.map((step, index) => {
          const Icon = step.icon;
          const isActive = step.id === currentStep;
          const isCompleted = steps.findIndex(s => s.id === currentStep) > index;

          return (
            <div
              key={step.id}
              className={`flex flex-col items-center ${
                index < steps.length - 1 ? "w-1/4" : ""
              }`}
            >
              <div
                className={`rounded-full p-2 ${
                  isActive
                    ? "bg-primary text-white"
                    : isCompleted
                    ? "bg-green-500 text-white"
                    : "bg-gray-100"
                }`}
              >
                <Icon className="h-6 w-6" />
              </div>
              <div className="text-sm mt-2 text-center">{step.title}</div>
              {index < steps.length - 1 && (
                <div
                  className={`h-0.5 w-full mt-4 ${
                    isCompleted ? "bg-green-500" : "bg-gray-200"
                  }`}
                />
              )}
            </div>
          );
        })}
      </div>
    </Card>
  );
}