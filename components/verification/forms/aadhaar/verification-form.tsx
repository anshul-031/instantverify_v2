"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { DocumentUpload } from "@/components/verification/document-upload";
import { CameraCapture } from "@/components/verification/camera/camera-capture";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Camera, Loader2 } from "lucide-react";
import { AadhaarOtpForm } from "./otp-form";
import { validateAadhaarNumber, formatAadhaarNumber } from "@/lib/utils/aadhaar";
import { useToast } from "@/components/ui/use-toast";
import { VerificationDocuments } from "@/lib/types/verification";

interface Props {
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export function AadhaarVerificationForm({ onSubmit, isSubmitting }: Props) {
  const [step, setStep] = useState(1);
  const [aadhaarNumber, setAadhaarNumber] = useState("");
  const [documents, setDocuments] = useState<VerificationDocuments>({});
  const [personPhoto, setPersonPhoto] = useState<File | null>(null);
  const [personPhotoUrl, setPersonPhotoUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const [isVerifyingOtp, setIsVerifyingOtp] = useState(false);
  const { toast } = useToast();

  const handleAadhaarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, "");
    setAadhaarNumber(value);
  };

  const handlePersonPhotoCapture = (file: File) => {
    setPersonPhoto(file);
    setPersonPhotoUrl(URL.createObjectURL(file));
    setShowCamera(false);
  };

  const handleDocumentsChange = (docs: VerificationDocuments) => {
    setDocuments(docs);
  };

  const handleVerifyOtp = async (otp: string) => {
    setIsVerifyingOtp(true);
    try {
      const response = await fetch("/api/verify/aadhaar-otp/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ aadhaarNumber, otp }),
      });

      if (!response.ok) {
        throw new Error("OTP verification failed");
      }

      toast({
        title: "Success",
        description: "OTP verified successfully",
      });

      // Submit the complete form
      const formData = new FormData();
      formData.append("aadhaarNumber", aadhaarNumber);
      if (documents.governmentId) {
        documents.governmentId.forEach((file, index) => {
          if (file instanceof File) {
            formData.append(`aadhaarFiles[${index}]`, file);
          }
        });
      }
      if (personPhoto) {
        formData.append("personPhoto", personPhoto);
      }

      await onSubmit(formData);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify OTP. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifyingOtp(false);
    }
  };

  const handleNext = () => {
    if (step === 1) {
      if (!validateAadhaarNumber(aadhaarNumber)) {
        toast({
          title: "Invalid Aadhaar",
          description: "Please enter a valid 12-digit Aadhaar number",
          variant: "destructive",
        });
        return;
      }
    }
    setStep(step + 1);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return (
          <Card className="p-6">
            <div className="space-y-4">
              <Label htmlFor="aadhaarNumber">Aadhaar Number</Label>
              <Input
                id="aadhaarNumber"
                value={formatAadhaarNumber(aadhaarNumber)}
                onChange={handleAadhaarChange}
                maxLength={14}
                placeholder="Enter 12-digit Aadhaar number"
                required
                disabled={isSubmitting}
              />
              <Button
                onClick={handleNext}
                className="w-full"
                disabled={aadhaarNumber.length !== 12}
              >
                Next
              </Button>
            </div>
          </Card>
        );

      case 2:
        return (
          <>
            <Card className="p-6">
              <div className="space-y-4">
                <Label>Aadhaar Card Photos</Label>
                <DocumentUpload
                  method="aadhaar-otp"
                  onUpload={handleDocumentsChange}
                  existingDocuments={documents}
                  disabled={isSubmitting}
                />
              </div>
            </Card>

            <Card className="p-6">
              <div className="space-y-4">
                <Label>Your Photo</Label>
                <Dialog open={showCamera} onOpenChange={setShowCamera}>
                  <DialogTrigger asChild>
                    <Button 
                      type="button" 
                      variant="outline"
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      {personPhotoUrl ? "Retake Photo" : "Take Photo"}
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-3xl">
                    <CameraCapture
                      onCapture={handlePersonPhotoCapture}
                      mode="person"
                    />
                  </DialogContent>
                </Dialog>

                {personPhotoUrl && (
                  <div className="relative aspect-[4/3] max-w-md mx-auto rounded-lg overflow-hidden border-2 border-primary">
                    <img
                      src={personPhotoUrl}
                      alt="Person"
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
              </div>
            </Card>

            <div className="flex justify-between">
              <Button
                variant="outline"
                onClick={() => setStep(1)}
                disabled={isSubmitting}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                disabled={!documents.governmentId?.length || !personPhoto || isSubmitting}
              >
                Next
              </Button>
            </div>
          </>
        );

      case 3:
        return (
          <AadhaarOtpForm
            aadhaarNumber={aadhaarNumber}
            onVerify={handleVerifyOtp}
            isVerifying={isVerifyingOtp}
          />
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-8">
      {renderStep()}
    </div>
  );
}