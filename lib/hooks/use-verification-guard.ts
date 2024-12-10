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
    if (!verification) {
      router.push('/verify');
      return;
    }

    if (verification.status !== requiredStatus) {
      router.push(redirectTo(verificationId));
    }
  }, [verification, requiredStatus, redirectTo, verificationId, router]);

  return verification;
}