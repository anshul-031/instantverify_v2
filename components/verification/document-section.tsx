"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Camera, AlertTriangle, FileUp } from "lucide-react";
import { CameraCapture } from "./camera/camera-capture";
import { VerificationMethod, VerificationDocuments } from '@/lib/types/verification';

interface Props {
  method: VerificationMethod;
  onDocumentsChange: (docs: VerificationDocuments) => void;
  onPersonPhotoChange: (file: File) => void;
  documents: VerificationDocuments;
  personPhotoUrl: string | null;
  isSubmitting?: boolean;
}

export function DocumentSection({
  method,
  onDocumentsChange,
  onPersonPhotoChange,
  documents,
  personPhotoUrl,
  isSubmitting
}: Props) {
  const [isPersonPhotoDialogOpen, setIsPersonPhotoDialogOpen] = useState(false);

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <Camera className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-semibold">Person Photo</h2>
        </div>

        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Please capture a clear photo of yourself. The photo will include:
            <ul className="list-disc list-inside mt-2">
              <li>Current date and time</li>
              <li>Location information</li>
              <li>Device details</li>
            </ul>
          </AlertDescription>
        </Alert>

        <div className="space-y-4">
          <Dialog open={isPersonPhotoDialogOpen} onOpenChange={setIsPersonPhotoDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full" disabled={isSubmitting}>
                <Camera className="w-4 h-4 mr-2" />
                {personPhotoUrl ? "Retake Photo" : "Capture Photo"}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-3xl">
              <CameraCapture
                onCapture={onPersonPhotoChange}
                mode="person"
                onClose={() => setIsPersonPhotoDialogOpen(false)}
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
              <div className="absolute bottom-0 left-0 right-0 bg-black/50 text-white p-2 text-sm">
                <div className="flex items-center">
                  <FileUp className="h-4 w-4 mr-2" />
                  <span>Photo captured with metadata</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}