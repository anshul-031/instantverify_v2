"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  aadhaarNumber: string;
  onVerify: (otp: string) => Promise<void>;
  isVerifying: boolean;
}

export function AadhaarOtpForm({ aadhaarNumber, onVerify, isVerifying }: Props) {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(0);
  const [canResend, setCanResend] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  const handleRequestOtp = async () => {
    try {
      const response = await fetch("/api/verify/aadhaar-otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarNumber }),
      });

      if (!response.ok) {
        throw new Error("Failed to send OTP");
      }

      setTimeLeft(600); // 10 minutes
      setCanResend(false);
      toast({
        title: "OTP Sent",
        description: "Please check your Aadhaar-linked mobile number",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!otp) return;
    await onVerify(otp);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          An OTP will be sent to your Aadhaar-linked mobile number
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <Label>Request OTP</Label>
            {timeLeft > 0 && (
              <span className="text-sm text-gray-500">
                Resend in {Math.floor(timeLeft / 60)}:
                {(timeLeft % 60).toString().padStart(2, "0")}
              </span>
            )}
          </div>

          <Button
            type="button"
            onClick={handleRequestOtp}
            disabled={!canResend || isVerifying}
            className="w-full"
          >
            {timeLeft > 0 ? "OTP Sent" : "Send OTP"}
          </Button>

          {timeLeft > 0 && (
            <div className="space-y-2">
              <Label htmlFor="otp">Enter OTP</Label>
              <Input
                id="otp"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                pattern="\d{6}"
                maxLength={6}
                placeholder="Enter 6-digit OTP"
                required
                disabled={isVerifying}
              />
            </div>
          )}
        </div>
      </Card>

      <Button
        type="submit"
        className="w-full"
        disabled={!otp || isVerifying}
      >
        {isVerifying ? (
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