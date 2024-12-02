"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VerificationMethod, VerificationDocuments, VerificationType } from '@/lib/types/verification';
import { AadhaarOtpForm } from "./aadhaar-otp-form";
import { DrivingLicenseAadhaarForm } from "./driving-license-aadhaar-form";
import { VoterIdAadhaarForm } from "./voter-id-aadhaar-form";
import { DrivingLicenseForm } from "./driving-license-form";
import { VoterIdForm } from "./voter-id-form";

interface FormState {
  type: VerificationType;
  country: string;
  method: VerificationMethod;
  aadhaarNumber: string;
  licenseNumber: string;
  voterIdNumber: string;
  dateOfBirth: string;
  otp: string;
  documents: VerificationDocuments;
}

interface Props {
  method: VerificationMethod;
  type: VerificationType;
  country: string;
  onSubmit: (data: FormState) => Promise<void>;
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

export function VerificationForm({ method, type, country, onSubmit, initialData }: Props) {
  const [formData, setFormData] = useState<FormState>({
    ...initialFormState,
    type,
    country,
    method,
    ...initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialData?.documents) {
      setFormData(prev => ({
        ...prev,
        documents: {
          ...prev.documents,
          ...initialData.documents
        }
      }));
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDocumentsChange = (docs: VerificationDocuments) => {
    setFormData(prev => ({
      ...prev,
      documents: {
        ...prev.documents,
        ...docs
      }
    }));
  };

  const renderFormContent = () => {
    const commonProps = {
      onDocumentsChange: handleDocumentsChange,
      documents: formData.documents,
      isSubmitting
    };

    switch (method) {
      case "aadhaar-otp":
        return (
          <AadhaarOtpForm
            {...commonProps}
            aadhaarNumber={formData.aadhaarNumber}
            onAadhaarChange={(number) => setFormData(prev => ({ ...prev, aadhaarNumber: number }))}
          />
        );

      case "driving-license-aadhaar":
        return (
          <DrivingLicenseAadhaarForm
            {...commonProps}
            aadhaarNumber={formData.aadhaarNumber}
            licenseNumber={formData.licenseNumber}
            dateOfBirth={formData.dateOfBirth}
            onAadhaarChange={(number) => setFormData(prev => ({ ...prev, aadhaarNumber: number }))}
            onLicenseChange={(number) => setFormData(prev => ({ ...prev, licenseNumber: number }))}
            onDobChange={(dob) => setFormData(prev => ({ ...prev, dateOfBirth: dob }))}
          />
        );

      case "voter-id-aadhaar":
        return (
          <VoterIdAadhaarForm
            {...commonProps}
            aadhaarNumber={formData.aadhaarNumber}
            voterIdNumber={formData.voterIdNumber}
            dateOfBirth={formData.dateOfBirth}
            onAadhaarChange={(number) => setFormData(prev => ({ ...prev, aadhaarNumber: number }))}
            onVoterIdChange={(number) => setFormData(prev => ({ ...prev, voterIdNumber: number }))}
            onDobChange={(dob) => setFormData(prev => ({ ...prev, dateOfBirth: dob }))}
          />
        );

      case "driving-license":
        return (
          <DrivingLicenseForm
            {...commonProps}
            licenseNumber={formData.licenseNumber}
            dateOfBirth={formData.dateOfBirth}
            onLicenseChange={(number) => setFormData(prev => ({ ...prev, licenseNumber: number }))}
            onDobChange={(dob) => setFormData(prev => ({ ...prev, dateOfBirth: dob }))}
          />
        );

      case "voter-id":
        return (
          <VoterIdForm
            {...commonProps}
            voterIdNumber={formData.voterIdNumber}
            dateOfBirth={formData.dateOfBirth}
            onVoterIdChange={(number) => setFormData(prev => ({ ...prev, voterIdNumber: number }))}
            onDobChange={(dob) => setFormData(prev => ({ ...prev, dateOfBirth: dob }))}
          />
        );

      default:
        return null;
    }
  };

  const isFormValid = () => {
    const hasRequiredDocuments = formData.documents?.governmentId?.length ?? 0 > 0;
    
    switch (method) {
      case "aadhaar-otp":
        return formData.aadhaarNumber && hasRequiredDocuments;
      case "driving-license-aadhaar":
        return formData.aadhaarNumber && formData.licenseNumber && formData.dateOfBirth && hasRequiredDocuments;
      case "voter-id-aadhaar":
        return formData.aadhaarNumber && formData.voterIdNumber && formData.dateOfBirth && hasRequiredDocuments;
      case "driving-license":
        return formData.licenseNumber && formData.dateOfBirth && hasRequiredDocuments;
      case "voter-id":
        return formData.voterIdNumber && formData.dateOfBirth && hasRequiredDocuments;
      default:
        return false;
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleSubmit}>
        {renderFormContent()}
        <Button 
          type="submit" 
          className="w-full mt-6"
          disabled={isSubmitting || !isFormValid()}
        >
          {isSubmitting ? "Submitting..." : "Submit Verification"}
        </Button>
      </form>
    </div>
  );
}