"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useVerificationStore } from "@/lib/store/verification";
import { VerificationStatus } from "@/lib/types/verification";

interface UseVerificationGuardProps {
  verificationId: string;
  requiredStatus: VerificationStatus;
  redirectTo: (id: string) => string;
}

export function useVerificationGuard({
  verificationId,
  requiredStatus,
  redirectTo
}: UseVerificationGuardProps) {
  const router = useRouter();
  const verification = useVerificationStore(state => 
    state.getVerification(verificationId)
  );

  useEffect(() => {
    const checkVerification = async () => {
      if (!verification) {
        try {
          const response = await fetch(`/api/verify/${verificationId}`);
          if (response.ok) {
            const data = await response.json();
            useVerificationStore.getState().setVerification(verificationId, data);
            
            if (data.status !== requiredStatus) {
              router.push(redirectTo(verificationId));
            }
          } else {
            router.push('/verify');
          }
        } catch (error) {
          console.error('Failed to fetch verification:', error);
          router.push('/verify');
        }
      } else if (verification.status !== requiredStatus) {
        router.push(redirectTo(verificationId));
      }
    };

    checkVerification();
  }, [verification, requiredStatus, redirectTo, verificationId, router]);

  return verification;
}