"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { validateAadhaar } from "@/lib/utils/validation";
import { useState } from "react";

interface Props {
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function AadhaarInput({ value, onChange, disabled }: Props) {
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.replace(/\D/g, "").slice(0, 12);
    onChange(newValue);
    
    const validationError = validateAadhaar(newValue);
    setError(validationError);
  };

  return (
    <div className="space-y-2">
      <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
      <Input
        id="aadhaarNumber"
        name="aadhaarNumber"
        value={value}
        onChange={handleChange}
        pattern="\d{12}"
        maxLength={12}
        placeholder="Enter 12-digit Aadhaar number"
        title="Please enter a valid 12-digit Aadhaar number"
        disabled={disabled}
        required
        className={error ? "border-red-500" : ""}
      />
      {error && (
        <p className="text-sm text-red-500">{error}</p>
      )}
    </div>
  );
}