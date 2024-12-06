"use client";

import { Card } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { 
  CheckCircle, 
  XCircle, 
  AlertTriangle, 
  Download,
  Share2 
} from "lucide-react";
import { formatDate } from "@/lib/utils/format";

interface Props {
  result: {
    success: boolean;
    data?: {
      name: string;
      aadhaarNumber: string;
      dateOfBirth: string;
      gender: string;
      address: string;
      photo?: string;
      confidence?: number;
    };
    qrMatch?: boolean;
    faceMatch?: {
      success: boolean;
      confidence: number;
    };
    error?: string;
  };
  onDownload?: () => void;
  onShare?: () => void;
}

export function VerificationResult({ result, onDownload, onShare }: Props) {
  const getStatusColor = (value: number) => {
    if (value >= 90) return "text-green-500";
    if (value >= 75) return "text-yellow-500";
    return "text-red-500";
  };

  if (!result.success) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-4">
          <XCircle className="h-8 w-8 text-red-500" />
          <div>
            <h3 className="text-lg font-semibold">Verification Failed</h3>
            <p className="text-gray-600">{result.error}</p>
          </div>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <CheckCircle className="h-8 w-8 text-green-500" />
            <div>
              <h3 className="text-lg font-semibold">Verification Successful</h3>
              <p className="text-gray-600">
                Identity verified with high confidence
              </p>
            </div>
          </div>
          <div className="flex space-x-2">
            {onDownload && (
              <Button variant="outline" onClick={onDownload}>
                <Download className="h-4 w-4 mr-2" />
                Download
              </Button>
            )}
            {onShare && (
              <Button variant="outline" onClick={onShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share
              </Button>
            )}
          </div>
        </div>

        {result.data && (
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h4 className="font-medium">Personal Information</h4>
              <dl className="space-y-2">
                <div className="flex justify-between">
                  <dt className="text-gray-600">Name</dt>
                  <dd className="font-medium">{result.data.name}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Date of Birth</dt>
                  <dd className="font-medium">
                    {formatDate(result.data.dateOfBirth)}
                  </dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Gender</dt>
                  <dd className="font-medium">{result.data.gender}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-gray-600">Address</dt>
                  <dd className="font-medium text-right">{result.data.address}</dd>
                </div>
              </dl>
            </div>

            <div className="space-y-4">
              <h4 className="font-medium">Verification Details</h4>
              <dl className="space-y-2">
                {result.qrMatch !== undefined && (
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600">QR Code Match</dt>
                    <dd>
                      {result.qrMatch ? (
                        <CheckCircle className="h-5 w-5 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-yellow-500" />
                      )}
                    </dd>
                  </div>
                )}
                {result.faceMatch && (
                  <div className="flex justify-between items-center">
                    <dt className="text-gray-600">Face Match</dt>
                    <dd className={getStatusColor(result.faceMatch.confidence)}>
                      {result.faceMatch.confidence.toFixed(1)}% Match
                    </dd>
                  </div>
                )}
              </dl>
            </div>
          </div>
        )}
      </Card>

      {result.qrMatch === false && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            QR code data does not match the information extracted from the Aadhaar
            card. This might indicate document tampering.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
}