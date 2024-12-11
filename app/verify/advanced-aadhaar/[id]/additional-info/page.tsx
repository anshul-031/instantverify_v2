"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { useVerificationStore } from "@/lib/store/verification";
import { Loader2 } from "lucide-react";
import { AdditionalInfoContent } from "@/components/verification/advanced-aadhaar/additional-info-content";
import { useVerificationGuard } from "@/lib/hooks/use-verification-guard";
import { VerificationStatusDisplay } from "@/components/verification/status-display";

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

  // Fetch verification status if not in store
  useEffect(() => {
    const fetchVerification = async () => {
      if (!verification) {
        try {
          const response = await fetch(`/api/verify/${params.id}`);
          if (response.ok) {
            const data = await response.json();
            useVerificationStore.getState().setVerification(params.id, data);
          }
        } catch (error) {
          console.error('Failed to fetch verification:', error);
        }
      }
    };

    fetchVerification();
  }, [params.id, verification]);

  if (!verification) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <VerificationStatusDisplay 
        status={verification.status}
      />

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