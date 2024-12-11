"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function OtpInput({ value, onChange, disabled }: Props) {
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "").slice(0, 6);
    onChange(newValue);
  };

  return (
    <div className="space-y-4">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          An OTP has been sent to your Aadhaar-linked mobile number
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <Label htmlFor="otp">Enter OTP</Label>
        <Input
          id="otp"
          name="otp"
          value={value}
          onChange={handleChange}
          pattern="\d{6}"
          maxLength={6}
          placeholder="Enter 6-digit OTP"
          title="Please enter a valid 6-digit OTP"
          disabled={disabled}
          required
          className="text-center tracking-widest text-lg"
        />
      </div>
    </div>
  );
}