"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface Props {
  onSubmit: (data: { number: string; dob: string }) => void;
  initialValues?: {
    number: string;
    dob: string;
  };
  isSubmitting?: boolean;
}

export function DrivingLicenseInput({
  onSubmit,
  initialValues = { number: "", dob: "" },
  isSubmitting = false,
}: Props) {
  const [licenseNumber, setLicenseNumber] = useState(initialValues.number);
  const [dateOfBirth, setDateOfBirth] = useState(initialValues.dob);
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!licenseNumber || !dateOfBirth) {
      setError("Please fill in all fields");
      return;
    }

    onSubmit({
      number: licenseNumber,
      dob: dateOfBirth,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="licenseNumber">Driving License Number</Label>
          <Input
            id="licenseNumber"
            value={licenseNumber}
            onChange={(e) => {
              setLicenseNumber(e.target.value);
              setError("");
            }}
            placeholder="Enter your driving license number"
            disabled={isSubmitting}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date of Birth</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={dateOfBirth}
            onChange={(e) => {
              setDateOfBirth(e.target.value);
              setError("");
            }}
            disabled={isSubmitting}
            required
          />
        </div>

        {error && (
          <p className="text-sm text-red-500">{error}</p>
        )}
      </div>

      <Button
        type="submit"
        disabled={!licenseNumber || !dateOfBirth || isSubmitting}
        className="w-full"
      >
        {isSubmitting ? "Processing..." : "Continue"}
      </Button>
    </form>
  );
}