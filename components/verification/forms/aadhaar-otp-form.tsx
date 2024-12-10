"use client";

import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { DocumentUpload } from "@/components/verification/document-upload";
import { AadhaarInput } from "./aadhaar/aadhaar-input";
import { VerificationDocuments } from "@/lib/types/verification";

interface Props {
  onDocumentsChange: (docs: VerificationDocuments) => void;
  onAadhaarChange: (number: string) => void;
  aadhaarNumber: string;
  documents: VerificationDocuments;
  isSubmitting?: boolean;
}

export function AadhaarOtpForm({
  onDocumentsChange,
  onAadhaarChange,
  aadhaarNumber,
  documents,
  isSubmitting
}: Props) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Prerequisites for Aadhaar verification:
          <ul className="list-disc list-inside mt-2">
            <li>Valid Aadhaar card</li>
            <li>Access to Aadhaar-linked mobile number for OTP</li>
            <li>Clear photos of Aadhaar card (front and back)</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <div className="space-y-4">
          <AadhaarInput
            value={aadhaarNumber}
            onChange={onAadhaarChange}
            disabled={isSubmitting}
          />

          <DocumentUpload
            onUpload={onDocumentsChange}
            maxFiles={2}
            accept="image/*"
            isSubmitting={isSubmitting}
            existingDocuments={documents}
          />
        </div>
      </Card>
    </div>
  );
}