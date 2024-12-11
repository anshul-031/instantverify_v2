"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useVerificationStore } from "@/lib/store/verification";
import { paymentService } from "@/lib/services/payment";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import Script from "next/script";

interface Props {
  params: {
    id: string;
  };
}

declare global {
  interface Window {
    Razorpay: any;
  }
}

export default function PaymentPage({ params }: Props) {
  const [isLoading, setIsLoading] = useState(false);
  const [isScriptLoaded, setIsScriptLoaded] = useState(false);
  const [userDetails, setUserDetails] = useState<{ email: string; phone: string } | null>(null);
  const router = useRouter();
  const { toast } = useToast();
  const verification = useVerificationStore(state => 
    state.getVerification(params.id)
  );
  const setVerification = useVerificationStore(state => state.setVerification);

  useEffect(() => {
    if (!verification) {
      router.push('/verify');
      return;
    }

    // If payment is already complete, redirect to additional info page
    if (verification.status === 'payment-complete') {
      router.push(`/verify/advanced-aadhaar/${params.id}/additional-info`);
      return;
    }

    // Fetch user details
    const fetchUserDetails = async () => {
      try {
        const response = await fetch('/api/auth/user');
        if (response.ok) {
          const user = await response.json();
          setUserDetails({
            email: user.email,
            phone: user.phone || ''
          });
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, [verification, router, params.id]);

  const handlePayment = async () => {
    if (!verification || !isScriptLoaded || !userDetails) return;

    setIsLoading(true);
    try {
      // Create order through our API endpoint
      const response = await fetch('/api/payment/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: 99,
          currency: 'INR',
          receipt: verification.id,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to create payment order');
      }

      const order = await response.json();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: order.amount,
        currency: order.currency,
        name: 'InstantVerify',
        description: 'Advanced Aadhaar Verification',
        order_id: order.id,
        prefill: {
          email: userDetails.email,
          contact: userDetails.phone,
        },
        theme: {
          color: '#3B82F6',
        },
        handler: async (response: any) => {
          try {
            const verified = await paymentService.verifyPayment({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
            });

            if (verified) {
              // Update verification status in store
              setVerification(params.id, {
                ...verification,
                status: 'payment-complete',
                paymentId: response.razorpay_payment_id,
                updatedAt: new Date().toISOString()
              });

              toast({
                title: "Payment Successful",
                description: "Your payment has been processed successfully.",
              });

              // Redirect to additional info page
              router.push(`/verify/advanced-aadhaar/${params.id}/additional-info`);
            }
          } catch (error) {
            toast({
              title: "Payment Verification Failed",
              description: "Please contact support if amount was deducted.",
              variant: "destructive",
            });
          }
        },
        modal: {
          ondismiss: function() {
            setIsLoading(false);
          }
        }
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast({
        title: "Payment Failed",
        description: "Failed to initiate payment. Please try again.",
        variant: "destructive",
      });
      setIsLoading(false);
    }
  };

  if (!verification) {
    return null;
  }

  return (
    <>
      <Script
        src="https://checkout.razorpay.com/v1/checkout.js"
        onLoad={() => setIsScriptLoaded(true)}
      />
      
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
              disabled={isLoading || !isScriptLoaded || !userDetails}
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
    </>
  );
}