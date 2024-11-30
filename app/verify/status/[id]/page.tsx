"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { VerificationStatusDisplay } from "@/components/verification/status-display";
import { VerificationTimeline } from "@/components/verification/timeline";
import { VerificationReportView } from "@/components/verification/report/verification-report";
import { VerificationDetails } from "@/lib/types/verification";
import { VerificationReport } from "@/lib/types/report";
import { Loader2 } from "lucide-react";

export default function VerificationStatusPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<VerificationDetails | null>(null);
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);
  const router = useRouter();
  const { toast } = useToast();

  const fetchReport = async () => {
    try {
      setIsGeneratingReport(true);
      const response = await fetch(`/api/verify/${params.id}/report`);
      if (!response.ok) throw new Error("Failed to fetch report");
      const reportData = await response.json();
      setReport(reportData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to generate report",
        variant: "destructive",
      });
    } finally {
      setIsGeneratingReport(false);
    }
  };

  const fetchDetails = async () => {
    try {
      const response = await fetch(`/api/verify/${params.id}`);
      if (!response.ok) throw new Error("Failed to fetch verification details");
      const data = await response.json();
      setDetails(data);

      // If verification is complete and we don't have a report yet, fetch it
      if (data.status === 'verified' && !report) {
        await fetchReport();
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to load verification details",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const interval = setInterval(fetchDetails, 5000); // Poll every 5 seconds
    fetchDetails(); // Initial fetch

    return () => clearInterval(interval);
  }, [params.id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!details) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Verification not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-24 px-4">
      <div className="max-w-4xl mx-auto space-y-8">
        <Card className="p-8">
          <VerificationStatusDisplay status={details.status} />
          
          <div className="mt-8">
            <VerificationTimeline 
              status={details.status}
              createdAt={details.createdAt}
              updatedAt={details.updatedAt}
            />
          </div>

          <div className="mt-8 space-y-6">
            <h2 className="text-xl font-semibold">Verification Details</h2>
            <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <dt className="text-sm text-gray-600">Type</dt>
                <dd className="font-medium capitalize">{details.type}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Method</dt>
                <dd className="font-medium capitalize">{details.method}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Reference ID</dt>
                <dd className="font-medium">{details.id}</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">Security Level</dt>
                <dd className="font-medium capitalize">{details.securityLevel.replace('-', ' ')}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            {details.status === 'verified' && !report && !isGeneratingReport && (
              <Button onClick={fetchReport}>
                Generate Report
              </Button>
            )}
            {isGeneratingReport && (
              <Button disabled>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Generating Report...
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => router.push("/verify")}
            >
              New Verification
            </Button>
          </div>
        </Card>

        {report && (
          <div className="mt-8">
            <VerificationReportView report={report} />
          </div>
        )}
      </div>
    </div>
  );
}