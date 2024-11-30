import { CheckCircle, Clock, CreditCard } from "lucide-react";
import { VerificationStatus } from "@/lib/types/verification";
import { formatDistanceToNow } from "date-fns";

interface Props {
  status: VerificationStatus;
  createdAt: string;
  updatedAt: string;
}

const timelineSteps = [
  {
    id: "submitted",
    title: "Verification Submitted",
    icon: Clock,
  },
  {
    id: "payment",
    title: "Payment Processed",
    icon: CreditCard,
  },
  {
    id: "verification",
    title: "Verification Complete",
    icon: CheckCircle,
  },
];

export function VerificationTimeline({ status, createdAt, updatedAt }: Props) {
  const getStepStatus = (stepId: string) => {
    switch (status) {
      case "pending":
        return stepId === "submitted" ? "current" : "upcoming";
      case "payment-pending":
        return stepId === "submitted" ? "complete" : 
               stepId === "payment" ? "current" : "upcoming";
      case "payment-complete":
      case "verified":
        return "complete";
      case "rejected":
        return stepId === "submitted" ? "complete" : "error";
      default:
        return "upcoming";
    }
  };

  return (
    <div className="space-y-8">
      <h2 className="text-xl font-semibold">Verification Timeline</h2>
      <div className="relative">
        {/* Progress Line */}
        <div className="absolute left-6 top-0 h-full w-px bg-gray-200" />

        {/* Steps */}
        <div className="space-y-8">
          {timelineSteps.map((step) => {
            const stepStatus = getStepStatus(step.id);
            const Icon = step.icon;

            return (
              <div key={step.id} className="relative flex items-center">
                <div className={`
                  relative z-10 flex h-12 w-12 items-center justify-center rounded-full
                  ${stepStatus === 'complete' ? 'bg-green-500' :
                    stepStatus === 'current' ? 'bg-blue-500' :
                    stepStatus === 'error' ? 'bg-red-500' : 'bg-gray-200'}
                `}>
                  <Icon className={`h-6 w-6 ${
                    stepStatus === 'upcoming' ? 'text-gray-500' : 'text-white'
                  }`} />
                </div>
                <div className="ml-4">
                  <p className="font-medium">{step.title}</p>
                  {step.id === "submitted" && (
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(createdAt), { addSuffix: true })}
                    </p>
                  )}
                  {stepStatus === "complete" && step.id !== "submitted" && (
                    <p className="text-sm text-gray-500">
                      {formatDistanceToNow(new Date(updatedAt), { addSuffix: true })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}