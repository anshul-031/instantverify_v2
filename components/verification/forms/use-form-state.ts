"use client";

import { useState } from "react";
import { FormState } from '@/lib/types/form';
import { VerificationType, VerificationMethod } from '@/lib/types/verification';

interface UseFormStateProps {
  type: VerificationType;
  country: string;
  method: VerificationMethod;
  initialData?: Partial<FormState>;
}

const initialFormState: FormState = {
  type: "tenant",
  country: "IN",
  method: "aadhaar-otp",
  aadhaarNumber: "",
  licenseNumber: "",
  voterIdNumber: "",
  dateOfBirth: "",
  otp: "",
  documents: {}
};

export function useFormState({ type, country, method, initialData }: UseFormStateProps) {
  const [formData, setFormData] = useState<FormState>({
    ...initialFormState,
    type,
    country,
    method,
    ...initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  return {
    formData,
    setFormData,
    isSubmitting,
    setIsSubmitting
  };
}