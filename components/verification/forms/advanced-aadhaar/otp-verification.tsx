"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";

interface Props {
  aadhaarNumber: string;
  onSubmit: (otp: string) => void;
  onBack: () => void;
  isSubmitting?: boolean;
}

export function OtpVerification({
  aadhaarNumber,
  onSubmit,
  onBack,
  isSubmitting = false,
}: Props) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(30);
  const [isResending, setIsResending] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [timeLeft]);

  const handleResendOtp = async () => {
    try {
      setIsResending(true);
      // Simulate OTP resend
      await new Promise(resolve => setTimeout(resolve, 1000));
      setTimeLeft(30);
      toast({
        title: "OTP Resent",
        description: "A new OTP has been sent to your Aadhaar-linked mobile number.",
      });
    } catch (error) {
      toast({
        title: "Failed to resend OTP",
        description: "Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsResending(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (otp.length === 6) {
      onSubmit(otp);
    }
  };

  const maskedPhone = `******${aadhaarNumber.slice(-4)}`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          An OTP has been sent to your Aadhaar-linked mobile number ending with {maskedPhone}
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="flex flex-col items-center space-y-4">
          <InputOTP
            value={otp}
            onChange={setOtp}
            maxLength={6}
            disabled={isSubmitting}
            render={({ slots }) => (
              <InputOTPGroup className="gap-2">
                {slots.map((slot, index) => (
                  <InputOTPSlot key={index} {...slot} />
                ))}
              </InputOTPGroup>
            )}
          />
          <p className="text-sm text-muted-foreground">
            Enter the 6-digit OTP sent to your mobile
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-500">
            {timeLeft > 0 ? (
              `Resend OTP in ${timeLeft}s`
            ) : (
              <Button
                type="button"
                variant="link"
                onClick={handleResendOtp}
                disabled={isResending}
                className="p-0 h-auto"
              >
                {isResending ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Resending...
                  </>
                ) : (
                  "Resend OTP"
                )}
              </Button>
            )}
          </span>
          <Button
            type="button"
            variant="link"
            onClick={onBack}
            disabled={isSubmitting}
            className="p-0 h-auto"
          >
            Change Aadhaar Number
          </Button>
        </div>
      </div>

      <Button
        type="submit"
        disabled={otp.length !== 6 || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Verifying...
          </>
        ) : (
          "Verify OTP"
        )}
      </Button>
    </form>
  );
}