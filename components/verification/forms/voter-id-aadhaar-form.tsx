"use client";

import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";
import { DocumentUpload } from "@/components/verification/document-upload";
import { VerificationDocuments } from "@/lib/types/verification";

interface Props {
  onDocumentsChange: (docs: VerificationDocuments) => void;
  onAadhaarChange: (number: string) => void;
  onVoterIdChange: (number: string) => void;
  onDobChange: (dob: string) => void;
  aadhaarNumber: string;
  voterIdNumber: string;
  dateOfBirth: string;
  documents: VerificationDocuments;
  isSubmitting?: boolean;
}

export function VoterIdAadhaarForm({
  onDocumentsChange,
  onAadhaarChange,
  onVoterIdChange,
  onDobChange,
  aadhaarNumber,
  voterIdNumber,
  dateOfBirth,
  documents,
  isSubmitting
}: Props) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Prerequisites for Voter ID + Aadhaar verification:
          <ul className="list-disc list-inside mt-2">
            <li>Valid Voter ID card</li>
            <li>Valid Aadhaar card</li>
            <li>Access to Aadhaar-linked mobile number for OTP</li>
            <li>Clear photos of both documents (front and back)</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="aadhaar">Aadhaar Number</Label>
            <Input
              id="aadhaar"
              value={aadhaarNumber}
              onChange={(e) => onAadhaarChange(e.target.value)}
              pattern="\d{12}"
              maxLength={12}
              placeholder="Enter 12-digit Aadhaar number"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="voterId">Voter ID Number</Label>
            <Input
              id="voterId"
              value={voterIdNumber}
              onChange={(e) => onVoterIdChange(e.target.value)}
              placeholder="Enter Voter ID number"
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dob">Date of Birth</Label>
            <Input
              id="dob"
              type="date"
              value={dateOfBirth}
              onChange={(e) => onDobChange(e.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <DocumentUpload
            method="voter-id-aadhaar"
            onUpload={onDocumentsChange}
            existingDocuments={documents}
          />
        </div>
      </Card>
    </div>
  );
}