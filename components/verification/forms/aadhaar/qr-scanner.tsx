"use client";

import { useState, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle, QrCode, Upload, Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface Props {
  onScanComplete: (data: any) => void;
  onError: (error: string) => void;
  isProcessing?: boolean;
}

export function QRScanner({ onScanComplete, onError, isProcessing }: Props) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast({
          title: "Invalid File",
          description: "Please select an image file",
          variant: "destructive",
        });
        return;
      }
      setSelectedFile(file);
    }
  };

  const handleScan = async () => {
    if (!selectedFile) return;

    setIsScanning(true);
    try {
      const formData = new FormData();
      formData.append('qrImage', selectedFile);

      const response = await fetch('/api/verify/aadhaar/qr', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to scan QR code');
      }

      onScanComplete(result.data);
      toast({
        title: "Success",
        description: "QR code scanned successfully",
      });
    } catch (error) {
      const message = error instanceof Error ? error.message : 'QR scan failed';
      onError(message);
      toast({
        title: "Error",
        description: message,
        variant: "destructive",
      });
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center space-x-2">
        <QrCode className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Aadhaar QR Code Scanner</h2>
      </div>

      <Alert>
        <AlertTriangle className="h-4 w-4" />
        <AlertDescription>
          Please scan the QR code on your Aadhaar card for additional verification.
          The QR code contains encrypted information that helps verify the authenticity
          of your Aadhaar card.
        </AlertDescription>
      </Alert>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="qrImage">Upload QR Code Image</Label>
          <Input
            id="qrImage"
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            ref={fileInputRef}
            disabled={isProcessing || isScanning}
          />
        </div>

        {selectedFile && (
          <div className="space-y-4">
            <div className="relative aspect-square max-w-[200px] mx-auto">
              <img
                src={URL.createObjectURL(selectedFile)}
                alt="Selected QR code"
                className="w-full h-full object-contain"
              />
            </div>

            <Button
              onClick={handleScan}
              disabled={isProcessing || isScanning}
              className="w-full"
            >
              {isScanning ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Scanning...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Scan QR Code
                </>
              )}
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
}