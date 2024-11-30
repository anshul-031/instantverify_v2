"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { VerificationDetails } from "@/lib/types/verification";
import { formatMethodName, formatSecurityLevel } from "@/lib/utils/format";

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
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

    fetchDetails();
  }, [params.id, toast]);

  const handlePayment = async () => {
    setProcessing(true);
    try {
      // Simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update verification status
      await fetch(`/api/verify/${params.id}/payment`, {
        method: "POST",
      });

      toast({
        title: "Payment Successful",
        description: "Proceeding to confirmation...",
      });

      router.push(`/verify/confirm/${params.id}`);
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive",
      });
      setProcessing(false);
    }
  };

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
      <div className="max-w-2xl mx-auto">
        <Card className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold mb-2">Complete Payment</h1>
            <p className="text-gray-600">
              Complete the payment to proceed with your verification
            </p>
          </div>

          <div className="space-y-6">
            <div className="border-t border-b py-4">
              <h2 className="font-semibold mb-4">Verification Details</h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Type</dt>
                  <dd className="font-medium capitalize">{details.type}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Method</dt>
                  <dd className="font-medium">{formatMethodName(details.method)}</dd>
                </div>
                {details.securityLevel && (
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Security Level</dt>
                    <dd className="font-medium capitalize">
                      {formatSecurityLevel(details.securityLevel)}
                    </dd>
                  </div>
                )}
              </dl>
            </div>

            <div className="border-b pb-4">
              <h2 className="font-semibold mb-4">Payment Summary</h2>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Verification Fee</dt>
                  <dd className="font-medium">₹20.00</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">GST (18%)</dt>
                  <dd className="font-medium">₹3.60</dd>
                </div>
                <div className="flex justify-between text-lg font-semibold mt-4">
                  <dt>Total</dt>
                  <dd>₹23.60</dd>
                </div>
              </dl>
            </div>

            <Button
              onClick={handlePayment}
              className="w-full"
              disabled={processing}
            >
              {processing ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Pay ₹23.60
                </>
              )}
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
}