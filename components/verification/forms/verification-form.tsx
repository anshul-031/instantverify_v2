"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { VerificationMethod, VerificationDocuments, VerificationType } from '@/lib/types/verification';
import { FormState } from '@/lib/types/form';
import { DocumentSection } from "../document-section";
import { ArrowLeft } from "lucide-react";
import { useFormState } from "./use-form-state";
import { FormContent } from "./form-content";

interface Props {
  method: VerificationMethod;
  type: VerificationType;
  country: string;
  onSubmit: (data: any) => Promise<void>;
  onBack: () => void;
  initialData?: Partial<FormState>;
}

export function VerificationForm({ 
  method, 
  type, 
  country, 
  onSubmit, 
  onBack, 
  initialData 
}: Props) {
  const { formData, setFormData, isSubmitting, setIsSubmitting } = useFormState({
    type,
    country,
    method,
    initialData
  });
  const [personPhotoUrl, setPersonPhotoUrl] = useState<string | null>(null);

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
    if (personPhotoUrl) {
      URL.revokeObjectURL(personPhotoUrl);
    }
    setPersonPhotoUrl(URL.createObjectURL(file));
  };

  return (
    <div className="space-y-6">
      <Button
        variant="ghost"
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900"
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
          <FormContent
            method={method}
            formData={formData}
            setFormData={setFormData}
            isSubmitting={isSubmitting}
          />
        </div>
        <Button 
          type="submit" 
          className="w-full mt-6"
          disabled={isSubmitting || !formData.personPhoto}
        >
          {isSubmitting ? "Submitting..." : "Submit Verification"}
        </Button>
      </form>
    </div>
  );
}