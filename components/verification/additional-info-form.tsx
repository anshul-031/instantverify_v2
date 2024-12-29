"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, AlertTriangle } from "lucide-react";
import { VerificationMethod } from "@/lib/types/verification";
import { ExtractedInfo, SessionData } from "@/lib/types/deepvue";
import { AadhaarInput } from "./forms/aadhaar/aadhaar-input";
import { OtpInput } from "./forms/aadhaar/otp-input";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { getCaptcha, generateAadhaarOTP } from "@/lib/services/deepvue/api";

interface Props {
  method: VerificationMethod;
  onSubmit: (data: { aadhaarNumber: string; otp: string }) => Promise<void>;
  isSubmitting: boolean;
  extractedInfo?: ExtractedInfo;
  personPhotoUrl?: string;
  initialAadhaarNumber?: string;
}

interface FormData {
  aadhaarNumber: string;
  otp: string;
  captcha: string;
}

export function AdditionalInfoForm({ 
  method, 
  onSubmit, 
  isSubmitting, 
  extractedInfo, 
  personPhotoUrl,
  initialAadhaarNumber = ''
}: Props) {
  const [formData, setFormData] = useState<FormData>({
    aadhaarNumber: initialAadhaarNumber,
    otp: "",
    captcha: "",
  });
  const [showOtpInput, setShowOtpInput] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [sessionData, setSessionData] = useState<SessionData | null>(null);
  const [isCaptchaShowing, setCaptchaShowing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData(prev => ({
      ...prev,
      aadhaarNumber: initialAadhaarNumber
    }));
  }, [initialAadhaarNumber]);

  useEffect(() => {
    const initializeCaptcha = async () => {
      try {
        const data = await getCaptcha();
        setSessionData(data);
        setCaptchaShowing(true);
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load captcha. Please try again.",
          variant: "destructive",
        });
      }
    };

    if (!isCaptchaShowing) {
      initializeCaptcha();
    }
  }, [isCaptchaShowing, toast]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleAadhaarChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      aadhaarNumber: value
    }));
    if (!isCaptchaShowing) {
      setCaptchaShowing(true);
    }
  };

  const handleOtpChange = (value: string) => {
    setFormData(prev => ({
      ...prev,
      otp: value
    }));
  };

  const handleCaptchaChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      captcha: e.target.value
    }));
  };

  const handleSendOtp = async () => {
    if (!sessionData) {
      toast({
        title: "Error",
        description: "Please wait for captcha to load",
        variant: "destructive",
      });
      return;
    }

    setSendingOtp(true);
    try {
      const response = await generateAadhaarOTP(
        formData.aadhaarNumber,
        formData.captcha,
        sessionData.sessionId
      );
      
      if (response.code === 200) {
        toast({
          title: "OTP Sent",
          description: "An OTP has been sent to your Aadhaar-linked mobile number",
        });
        setShowOtpInput(true);
      } else {
        throw new Error(response.error || 'Failed to send OTP');
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send OTP. Please verify captcha and try again.",
        variant: "destructive",
      });
    } finally {
      setSendingOtp(false);
    }
  };

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

      {extractedInfo && (
        <div className="space-y-2">
          <p className="text-sm text-gray-600">Extracted Information:</p>
          <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
            {Object.entries(extractedInfo).map(([key, value]) => (
              <div key={key} className="text-sm">
                <span className="font-medium capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}: </span>
                <span className="text-gray-600">{value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <AadhaarInput
        value={formData.aadhaarNumber}
        onChange={handleAadhaarChange}
        disabled={isSubmitting}
      />

      {sessionData && (
        <div className="space-y-4">
          <div className="max-w-[200px] mx-auto">
            <img 
              src={`data:image/jpeg;base64,${sessionData.captcha}`}
              alt="Captcha"
              className="w-full rounded-md border"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="captcha">Enter Captcha</Label>
            <Input
              id="captcha"
              value={formData.captcha}
              onChange={handleCaptchaChange}
              placeholder="Enter the captcha shown above"
              disabled={isSubmitting}
              required
            />
          </div>
        </div>
      )}

      {!showOtpInput && (
        <Button
          type="button"
          onClick={handleSendOtp}
          disabled={formData.aadhaarNumber.length !== 12 || !formData.captcha || sendingOtp}
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