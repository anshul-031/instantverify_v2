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
import { useToast } from "@/components/ui/use-toast";

interface Props {
  onSubmit: (formData: FormData) => Promise<void>;
  isSubmitting: boolean;
}

export function DrivingLicenseVerificationForm({ onSubmit, isSubmitting }: Props) {
  const [licenseNumber, setLicenseNumber] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [documents, setDocuments] = useState<File[]>([]);
  const [personPhoto, setPersonPhoto] = useState<File | null>(null);
  const [personPhotoUrl, setPersonPhotoUrl] = useState<string | null>(null);
  const [showCamera, setShowCamera] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personPhoto) {
      toast({
        title: "Error",
        description: "Please capture your photo before submitting",
        variant: "destructive",
      });
      return;
    }

    const formData = new FormData();
    formData.append("licenseNumber", licenseNumber);
    formData.append("dateOfBirth", dateOfBirth);
    documents.forEach((file, index) => {
      formData.append(`documents[${index}]`, file);
    });
    formData.append("personPhoto", personPhoto);

    await onSubmit(formData);
  };

  const handlePersonPhotoCapture = (file: File) => {
    setPersonPhoto(file);
    setPersonPhotoUrl(URL.createObjectURL(file));
    setShowCamera(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <Card className="p-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="licenseNumber">Driving License Number</Label>
            <Input
              id="licenseNumber"
              value={licenseNumber}
              onChange={(e) => setLicenseNumber(e.target.value)}
              placeholder="Enter driving license number"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dateOfBirth">Date of Birth</Label>
            <Input
              id="dateOfBirth"
              type="date"
              value={dateOfBirth}
              onChange={(e) => setDateOfBirth(e.target.value)}
              required
              disabled={isSubmitting}
            />
          </div>

          <DocumentUpload
            method="driving-license"
            onUpload={(docs) => setDocuments(docs.governmentId as File[])}
            existingDocuments={{ governmentId: documents }}
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

      <Button 
        type="submit" 
        className="w-full"
        disabled={isSubmitting || !documents.length || !personPhoto}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Submitting...
          </>
        ) : (
          "Submit Verification"
        )}
      </Button>
    </form>
  );
}