"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { VerificationMethod, VerificationDetails } from "@/lib/types/verification";

interface Props {
  method: VerificationMethod;
  onSubmit: (data: NonNullable<VerificationDetails['additionalInfo']>) => Promise<void>;
  isSubmitting: boolean;
}

const initialFormState: NonNullable<VerificationDetails['additionalInfo']> = {
  aadhaarNumber: "",
  otp: "",
};

export function AdditionalInfoForm({ method, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState(initialFormState);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSendOtp = async () => {
    setSendingOtp(true);
    try {
      // Simulate OTP sending
      await new Promise(resolve => setTimeout(resolve, 1000));
      setShowOtpInput(true);
    } finally {
      setSendingOtp(false);
    }
  };

  // Only show Aadhaar form for all Aadhaar-based methods
  const showAadhaarForm = method.includes('aadhaar');

  if (!showAadhaarForm) {
    return null;
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-semibold">Additional Information Required</h2>
      
      <div className="space-y-2">
        <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
        <Input
          id="aadhaarNumber"
          name="aadhaarNumber"
          value={formData.aadhaarNumber}
          onChange={handleChange}
          pattern="\d{12}"
          maxLength={12}
          placeholder="Enter 12-digit Aadhaar number"
          title="Please enter a valid 12-digit Aadhaar number"
          required
        />
      </div>

      {!showOtpInput && (
        <Button
          type="button"
          onClick={handleSendOtp}
          disabled={formData.aadhaarNumber.length !== 12 || sendingOtp}
          className="w-full"
        >
          {sendingOtp ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Sending OTP...
            </>
          ) : (
            'Send OTP'
          )}
        </Button>
      )}

      {showOtpInput && (
        <>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              An OTP has been sent to your Aadhaar-linked mobile number
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="otp">Aadhaar OTP</Label>
            <Input
              id="otp"
              name="otp"
              value={formData.otp}
              onChange={handleChange}
              pattern="\d{6}"
              maxLength={6}
              placeholder="Enter 6-digit OTP"
              title="Please enter a valid 6-digit OTP"
              required
            />
          </div>
        </>
      )}

      <Button 
        type="submit" 
        className="w-full" 
        disabled={isSubmitting || !showOtpInput}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Confirm & Submit"
        )}
      </Button>
    </form>
  );
}