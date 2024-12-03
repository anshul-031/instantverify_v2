"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { VerificationMethod, VerificationDocuments, VerificationType } from '@/lib/types/verification';
import { AadhaarOtpForm } from "./aadhaar-otp-form";
import { DrivingLicenseAadhaarForm } from "./driving-license-aadhaar-form";
import { VoterIdAadhaarForm } from "./voter-id-aadhaar-form";
import { DrivingLicenseForm } from "./driving-license-form";
import { VoterIdForm } from "./voter-id-form";
import { DocumentSection } from "../document-section";
import { ArrowLeft } from "lucide-react";

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
  personPhoto?: File;
}

interface Props {
  method: VerificationMethod;
  type: VerificationType;
  country: string;
  onSubmit: (data: FormState) => Promise<void>;
  onBack: () => void;
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

export function VerificationForm({ method, type, country, onSubmit, onBack, initialData }: Props) {
  const [formData, setFormData] = useState<FormState>({
    ...initialFormState,
    type,
    country,
    method,
    ...initialData
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [personPhotoUrl, setPersonPhotoUrl] = useState<string | null>(null);

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
    if (!formData.personPhoto) {
      alert("Please capture your photo before submitting");
      return;
    }
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

  const handlePersonPhotoCapture = (file: File) => {
    setFormData(prev => ({
      ...prev,
      personPhoto: file
    }));
    setPersonPhotoUrl(URL.createObjectURL(file));
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
    const hasPersonPhoto = !!formData.personPhoto;
    
    if (!hasPersonPhoto) return false;

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
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="space-y-6">
          <DocumentSection
            method={method}
            onDocumentsChange={handleDocumentsChange}
            onPersonPhotoChange={handlePersonPhotoCapture}
            documents={formData.documents}
            personPhotoUrl={personPhotoUrl}
            isSubmitting={isSubmitting}
          />
          {renderFormContent()}
        </div>
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