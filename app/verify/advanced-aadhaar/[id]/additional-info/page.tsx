"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useVerificationStore } from "@/lib/store/verification";
import { Loader2 } from "lucide-react";
import { AdditionalInfoContent } from "@/components/verification/advanced-aadhaar/additional-info-content";
import { useVerificationGuard } from "@/lib/hooks/use-verification-guard";

interface Props {
  params: {
    id: string;
  };
}

export default function AdditionalInfoPage({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const verification = useVerificationStore(state => 
    state.getVerification(params.id)
  );

  // Guard against invalid verification states
  useVerificationGuard({
    verificationId: params.id,
    requiredStatus: 'payment-complete',
    redirectTo: (id) => `/verify/payment/${id}`
  });

  if (!verification) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <h1 className="text-2xl font-bold mb-6">Additional Information</h1>
        <AdditionalInfoContent
          verification={verification}
          isLoading={isLoading}
          setIsLoading={setIsLoading}
          onComplete={() => router.push(`/verify/report/${params.id}`)}
        />
      </Card>
    </div>
  );
}