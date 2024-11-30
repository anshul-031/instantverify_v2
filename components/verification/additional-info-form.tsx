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
  onSubmit: (data: VerificationDetails['additionalInfo']) => Promise<void>;
  isSubmitting: boolean;
}

export function AdditionalInfoForm({ method, onSubmit, isSubmitting }: Props) {
  const [formData, setFormData] = useState<VerificationDetails['additionalInfo']>({
    aadhaarNumber: "",
    drivingLicenseNumber: "",
    voterIdNumber: "",
    dateOfBirth: "",
    otp: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const requiresOtp = method.includes("aadhaar");

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-semibold">Additional Information Required</h2>

      {method.includes("aadhaar") && (
        <div className="space-y-2">
          <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
          <Input
            id="aadhaarNumber"
            name="aadhaarNumber"
            value={formData.aadhaarNumber}
            onChange={handleChange}
            pattern="\d{12}"
            title="Please enter a valid 12-digit Aadhaar number"
            required
          />
        </div>
      )}

      {method.includes("driving-license") && (
        <div className="space-y-2">
          <Label htmlFor="drivingLicenseNumber">Driving License Number</Label>
          <Input
            id="drivingLicenseNumber"
            name="drivingLicenseNumber"
            value={formData.drivingLicenseNumber}
            onChange={handleChange}
            required
          />
        </div>
      )}

      {method.includes("voter-id") && (
        <div className="space-y-2">
          <Label htmlFor="voterIdNumber">Voter ID Number</Label>
          <Input
            id="voterIdNumber"
            name="voterIdNumber"
            value={formData.voterIdNumber}
            onChange={handleChange}
            required
          />
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          name="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={handleChange}
          required
        />
      </div>

      {requiresOtp && (
        <>
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              An OTP will be sent to your Aadhaar-linked mobile number
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
              title="Please enter a valid 6-digit OTP"
              required
            />
          </div>
        </>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
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