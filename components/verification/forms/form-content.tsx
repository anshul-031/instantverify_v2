"use client";

import { VerificationMethod, VerificationDocuments } from '@/lib/types/verification';
import { FormState, FormProps } from '@/lib/types/form';
import { AadhaarOtpForm } from "./aadhaar-otp-form";
import { DrivingLicenseAadhaarForm } from "./driving-license-aadhaar-form";
import { VoterIdAadhaarForm } from "./voter-id-aadhaar-form";
import { DrivingLicenseForm } from "./driving-license-form";
import { VoterIdForm } from "./voter-id-form";

interface Props {
  method: VerificationMethod;
  formData: FormState;
  setFormData: (value: FormState | ((prev: FormState) => FormState)) => void;
  isSubmitting: boolean;
}

export function FormContent({ method, formData, setFormData, isSubmitting }: Props) {
  const commonProps = {
    onDocumentsChange: (docs: VerificationDocuments) => setFormData((prev: FormState) => ({
      ...prev,
      documents: {
        ...prev.documents,
        ...docs
      }
    })),
    documents: formData.documents,
    isSubmitting
  };

  const handleFieldChange = (field: keyof FormState) => (value: string) => {
    setFormData((prev: FormState) => ({
      ...prev,
      [field]: value
    }));
  };

  switch (method) {
    case "aadhaar-otp":
      return (
        <AadhaarOtpForm
          {...commonProps}
          aadhaarNumber={formData.aadhaarNumber}
          onAadhaarChange={handleFieldChange('aadhaarNumber')}
        />
      );

    case "driving-license-aadhaar":
      return (
        <DrivingLicenseAadhaarForm
          {...commonProps}
          aadhaarNumber={formData.aadhaarNumber}
          licenseNumber={formData.licenseNumber}
          dateOfBirth={formData.dateOfBirth}
          onAadhaarChange={handleFieldChange('aadhaarNumber')}
          onLicenseChange={handleFieldChange('licenseNumber')}
          onDobChange={handleFieldChange('dateOfBirth')}
        />
      );

    case "voter-id-aadhaar":
      return (
        <VoterIdAadhaarForm
          {...commonProps}
          aadhaarNumber={formData.aadhaarNumber}
          voterIdNumber={formData.voterIdNumber}
          dateOfBirth={formData.dateOfBirth}
          onAadhaarChange={handleFieldChange('aadhaarNumber')}
          onVoterIdChange={handleFieldChange('voterIdNumber')}
          onDobChange={handleFieldChange('dateOfBirth')}
        />
      );

    case "driving-license":
    case "basic-driving-license":
      return (
        <DrivingLicenseForm
          {...commonProps}
          licenseNumber={formData.licenseNumber}
          dateOfBirth={formData.dateOfBirth}
          onLicenseChange={handleFieldChange('licenseNumber')}
          onDobChange={handleFieldChange('dateOfBirth')}
        />
      );

    case "voter-id":
    case "basic-voter-id":
      return (
        <VoterIdForm
          {...commonProps}
          voterIdNumber={formData.voterIdNumber}
          dateOfBirth={formData.dateOfBirth}
          onVoterIdChange={handleFieldChange('voterIdNumber')}
          onDobChange={handleFieldChange('dateOfBirth')}
        />
      );

    default:
      return null;
  }
}