"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { VerificationMethod } from "@/lib/types/verification";
import { AadhaarInput } from "./forms/aadhaar/aadhaar-input";
import { OtpInput } from "./forms/aadhaar/otp-input";

interface FormData {
  aadhaarNumber: string;
  otp: string;
}

interface Props {
  method: VerificationMethod;
  onSubmit: (data: FormData) => Promise<void>;
  isSubmitting: boolean;
}

const initialFormState: FormData = {
  aadhaarNumber: "",
  otp: "",
};

export function AdditionalInfoForm({ method, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState<FormData>(initialFormState);
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAadhaarChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      aadhaarNumber: value
    }));
  };

  const handleOtpChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      otp: value
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
      
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Prerequisites for Aadhaar verification:
          <ul className="list-disc list-inside mt-2">
            <li>Valid Aadhaar card</li>
            <li>Access to Aadhaar-linked mobile number for OTP</li>
            <li>Clear photos of Aadhaar card (front and back)</li>
          </ul>
        </AlertDescription>
      </Alert>

      <AadhaarInput
        value={formData.aadhaarNumber}
        onChange={handleAadhaarChange}
        disabled={isSubmitting}
      />

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
        <OtpInput
          value={formData.otp}
          onChange={handleOtpChange}
          disabled={isSubmitting}
        />
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