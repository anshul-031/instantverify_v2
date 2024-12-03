"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, CheckCircle } from "lucide-react";
import { formatMethodName } from "@/lib/utils/format";
import { calculateVerificationPrice, formatPrice } from "@/lib/utils/verification";
import { useVerificationStore } from "@/lib/store/verification";
import { PaymentStatus } from "@/components/verification/payment-status";
import Script from "next/script";

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage({ params }: { params: { id: string } }) {
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [paymentData, setPaymentData] = useState<any>(null);
  const router = useRouter();
  const { toast } = useToast();
  const { getVerification, setVerification } = useVerificationStore();
  const verification = getVerification(params.id);

  useEffect(() => {
    if (!verification) {
      toast({
        title: "Error",
        description: "Verification details not found",
        variant: "destructive",
      });
      router.push('/verify');
    } else {
      // Check if payment is already complete or verified
      const completedStatuses = ['payment-complete', 'verified'];
      if (completedStatuses.includes(verification.status)) {
        router.push(`/verify/confirm/${params.id}`);
        return;
      }
      setLoading(false);
    }
  }, [verification, router, toast, params.id]);

  const handlePayment = async () => {
    if (!verification) return;

    setProcessing(true);
    try {
      const response = await fetch(`/api/verify/${params.id}/payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(verification),
      });

      if (!response.ok) {
        throw new Error("Payment initiation failed");
      }

      const data = await response.json();
      setPaymentData(data);

      // Initialize Razorpay
      const options = {
        key: data.keyId,
        amount: data.payment.amount * 100,
        currency: data.payment.currency,
        name: "InstantVerify.in",
        description: `Verification - ${formatMethodName(verification.method)}`,
        order_id: data.payment.orderId,
        handler: async function (response: any) {
          try {
            // Verify payment
            const verifyResponse = await fetch(`/api/verify/${params.id}/payment`, {
              method: "PUT",
              headers: {
                "Content-Type": "application/json"
              },
              body: JSON.stringify({
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
              }),
            });

            if (!verifyResponse.ok) {
              throw new Error("Payment verification failed");
            }

            const verificationUpdate = await verifyResponse.json();

            // Update verification status
            setVerification(params.id, {
              ...verification,
              ...verificationUpdate,
              status: 'payment-complete',
              updatedAt: new Date().toISOString()
            });

            toast({
              title: "Payment Successful",
              description: "Proceeding to confirmation...",
            });

            router.push(`/verify/confirm/${params.id}`);
          } catch (error) {
            console.error('Payment verification error:', error);
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support",
              variant: "destructive",
            });
          }
        },
        prefill: {
          name: verification.additionalInfo?.name || "",
          email: verification.additionalInfo?.email || "",
          contact: verification.additionalInfo?.phone || "",
        },
        theme: {
          color: "#000000",
        },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setProcessing(false);
    }
  };

  if (loading || !verification) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  const pricing = calculateVerificationPrice(verification.method);

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        strategy="lazyOnload"
      />
      
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
                    <dd className="font-medium capitalize">{verification.type}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Method</dt>
                    <dd className="font-medium">{formatMethodName(verification.method)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Security Level</dt>
                    <dd className="font-medium capitalize">
                      {verification.securityLevel.replace('-', ' ')}
                    </dd>
                  </div>
                </dl>
              </div>

              <div className="border-b pb-4">
                <h2 className="font-semibold mb-4">Payment Summary</h2>
                <dl className="space-y-2">
                  <div className="flex justify-between">
                    <dt className="text-gray-600">Verification Fee</dt>
                    <dd className="font-medium">{formatPrice(pricing.basePrice)}</dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-gray-600">GST (18%)</dt>
                    <dd className="font-medium">{formatPrice(pricing.gst)}</dd>
                  </div>
                  <div className="flex justify-between text-lg font-semibold mt-4">
                    <dt>Total</dt>
                    <dd>{formatPrice(pricing.total)}</dd>
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
                    Pay {formatPrice(pricing.total)}
                  </>
                )}
              </Button>

              {paymentData && (
                <PaymentStatus
                  orderId={paymentData.payment.orderId}
                  amount={paymentData.payment.amount}
                  currency={paymentData.payment.currency}
                />
              )}
            </div>
          </Card>
        </div>
      </div>
    </>
  );
}