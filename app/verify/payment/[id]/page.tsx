"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVerificationStore } from "@/lib/store/verification";
import { paymentService } from "@/lib/services/payment";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

interface Props {
  params: {
    id: string;
  };
}

export default function PaymentPage({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const verification = useVerificationStore(state => 
    state.getVerification(params.id)
  );

  useEffect(() => {
    if (!verification) {
      router.push('/verify');
    }
  }, [verification, router]);

  const handlePayment = async () => {
    if (!verification) return;

    setIsLoading(true);
    try {
      const order = await paymentService.createOrder({
        amount: 99, // Price for advanced-aadhaar
        currency: 'INR',
        receipt: verification.id,
      });

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'InstantVerify',
        description: 'Advanced Aadhaar Verification',
        order_id: order.id,
        handler: async (response: any) => {
          const verification = await paymentService.verifyPayment({
            orderId: response.razorpay_order_id,
            paymentId: response.razorpay_payment_id,
            signature: response.razorpay_signature,
          });

          if (verification) {
            router.push(`/verify/advanced-aadhaar/${params.id}/additional-info`);
          }
        },
      };

      const razorpay = new (window as any).Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!verification) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto py-12">
      <Card className="p-8">
        <h1 className="text-2xl font-bold mb-6">Complete Payment</h1>
        <div className="space-y-6">
          <div className="flex justify-between py-4 border-b">
            <span>Advanced Aadhaar Verification</span>
            <span className="font-semibold">₹99</span>
          </div>
          <div className="flex justify-between py-4 border-b">
            <span>GST (18%)</span>
            <span className="font-semibold">₹17.82</span>
          </div>
          <div className="flex justify-between py-4 text-lg font-bold">
            <span>Total</span>
            <span>₹116.82</span>
          </div>
          <Button 
            onClick={handlePayment} 
            className="w-full"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Pay Now'
            )}
          </Button>
        </div>
      </Card>
    </div>
  );
}