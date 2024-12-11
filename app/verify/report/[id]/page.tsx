"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { VerificationReport } from "@/lib/types/report";
import { VerificationReportView } from "@/components/verification/report/verification-report";
import { useVerificationStore } from "@/lib/store/verification";
import { useVerificationGuard } from "@/lib/hooks/use-verification-guard";
import { Loader2 } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
}

export default function ReportPage({ params }: Props) {
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const verification = useVerificationStore(state => 
    state.getVerification(params.id)
  );

  // Guard against invalid verification states
  useVerificationGuard({
    verificationId: params.id,
    requiredStatus: 'verified',
    redirectTo: (id) => `/verify/advanced-aadhaar/${id}/additional-info`
  });

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const response = await fetch(`/api/verify/${params.id}/report`);
        if (!response.ok) throw new Error('Failed to fetch report');
        const data = await response.json();
        setReport(data);
      } catch (error) {
        console.error('Error fetching report:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (verification?.status === 'verified') {
      fetchReport();
    }
  }, [params.id, verification?.status]);

  if (isLoading || !report) {
    return (
      <div className="flex justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return <VerificationReportView report={report} />;
}