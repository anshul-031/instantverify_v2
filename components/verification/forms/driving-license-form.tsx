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
  onLicenseChange: (number: string) => void;
  onDobChange: (dob: string) => void;
  licenseNumber: string;
  dateOfBirth: string;
  documents: VerificationDocuments;
  isSubmitting?: boolean;
}

export function DrivingLicenseForm({
  onDocumentsChange,
  onLicenseChange,
  onDobChange,
  licenseNumber,
  dateOfBirth,
  documents,
  isSubmitting
}: Props) {
  return (
    <div className="space-y-6">
      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Prerequisites for Driving License verification:
          <ul className="list-disc list-inside mt-2">
            <li>Valid Driving License</li>
            <li>Clear photos of Driving License (front and back)</li>
          </ul>
        </AlertDescription>
      </Alert>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="license">Driving License Number</Label>
            <Input
              id="license"
              value={licenseNumber}
              onChange={(e) => onLicenseChange(e.target.value)}
              placeholder="Enter Driving License number"
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
            method="driving-license"
            onUpload={onDocumentsChange}
            existingDocuments={documents}
          />
        </div>
      </Card>
    </div>
  );
}