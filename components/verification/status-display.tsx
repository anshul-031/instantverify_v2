import { CheckCircle, Clock, AlertTriangle, XCircle, CreditCard } from "lucide-react";
import { Alert } from "@/components/ui/alert";
import { VerificationStatus } from "@/lib/types/verification";

interface Props {
  status: VerificationStatus;
}

const statusConfig = {
  "pending": {
    icon: Clock,
    title: "Verification in Progress",
    description: "We're processing your verification request",
    color: "text-blue-500",
    bgColor: "bg-blue-50",
  },
  "payment-pending": {
    icon: CreditCard,
    title: "Payment Required",
    description: "Please complete the payment to proceed",
    color: "text-yellow-500",
    bgColor: "bg-yellow-50",
  },
  "payment-complete": {
    icon: CheckCircle,
    title: "Payment Successful",
    description: "Your payment has been processed successfully",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  "verified": {
    icon: CheckCircle,
    title: "Verification Complete",
    description: "Your verification has been successfully completed",
    color: "text-green-500",
    bgColor: "bg-green-50",
  },
  "rejected": {
    icon: XCircle,
    title: "Verification Failed",
    description: "Your verification request could not be completed",
    color: "text-red-500",
    bgColor: "bg-red-50",
  },
};

export function VerificationStatusDisplay({ status }: Props) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <Alert className={`${config.bgColor} border-none`}>
      <div className="flex items-center space-x-4">
        <Icon className={`h-8 w-8 ${config.color}`} />
        <div>
          <h2 className="text-lg font-semibold">{config.title}</h2>
          <p className="text-gray-600">{config.description}</p>
        </div>
      </div>
    </Alert>
  );
}