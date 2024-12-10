"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { validateAadhaar } from "@/lib/utils/validation";

interface Props {
  onSubmit: (aadhaarNumber: string) => void;
  initialValue?: string;
  isSubmitting?: boolean;
}

export function AadhaarInput({ onSubmit, initialValue = "", isSubmitting = false }: Props) {
  const [aadhaarNumber, setAadhaarNumber] = useState(initialValue);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationError = validateAadhaar(aadhaarNumber);
    if (validationError) {
      setError(validationError);
      return;
    }

    onSubmit(aadhaarNumber);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 12);
    setAadhaarNumber(value);
    setError("");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="aadhaar">Aadhaar Number</Label>
        <Input
          id="aadhaar"
          type="text"
          inputMode="numeric"
          pattern="\d*"
          maxLength={12}
          placeholder="Enter 12-digit Aadhaar number"
          value={aadhaarNumber}
          onChange={handleChange}
          disabled={isSubmitting}
          className={error ? "border-red-500" : ""}
        />
        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={aadhaarNumber.length !== 12 || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
}