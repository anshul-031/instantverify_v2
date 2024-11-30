"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { VerificationStatusDisplay } from "@/components/verification/status-display";
import { VerificationTimeline } from "@/components/verification/timeline";
import { VerificationDetails } from "@/lib/types/verification";
import { Loader2 } from "lucide-react";
import { formatMethodName, formatSecurityLevel } from "@/lib/utils/format";

export default function VerificationStatusPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [details, setDetails] = useState<VerificationDetails | null>(null);
  const router = useRouter();
  const { toast } = useToast();

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const response = await fetch(`/api/verify/${params.id}`);
        if (!response.ok) throw new Error("Failed to fetch verification details");
        const data = await response.json();
        setDetails(data);
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

    const interval = setInterval(fetchDetails, 10000); // Poll every 10 seconds
    fetchDetails(); // Initial fetch

    return () => clearInterval(interval);
  }, [params.id, toast]);

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
      <div className="max-w-3xl mx-auto space-y-8">
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
                <dd className="font-medium capitalize">{formatMethodName(details.method)}</dd>
              </div>
              {details.securityLevel && (
                <div>
                  <dt className="text-sm text-gray-600">Security Level</dt>
                  <dd className="font-medium capitalize">
                    {formatSecurityLevel(details.securityLevel)}
                  </dd>
                </div>
              )}
              <div>
                <dt className="text-sm text-gray-600">Reference ID</dt>
                <dd className="font-medium">{details.id}</dd>
              </div>
            </dl>
          </div>

          <div className="mt-8 flex justify-end space-x-4">
            <Button
              variant="outline"
              onClick={() => router.push("/verify")}
            >
              New Verification
            </Button>
            <Button
              variant="outline"
              onClick={() => window.print()}
            >
              Print Details
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}