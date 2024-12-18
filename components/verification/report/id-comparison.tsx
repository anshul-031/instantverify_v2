import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { ExtractedInfo } from "@/lib/types/deepvue";
import Image from "next/image";
import { storageService } from '@/lib/services/storage';
import { useEffect, useState } from "react";

interface Props {
  ocrData: ExtractedInfo;
  ekycData: ExtractedInfo;
  faceMatchScore?: number;
  personPhotoUrl?: string;
}

export function IDVerificationComparison({ 
  ocrData, 
  ekycData, 
  faceMatchScore = 0,
  personPhotoUrl
}: Props) {
  const [signedPersonPhotoUrl, setSignedPersonPhotoUrl] = useState<string>("");

  useEffect(() => {
    const getSignedUrl = async () => {
      if (personPhotoUrl) {
        try {
          const url = await storageService.getSignedUrl(personPhotoUrl);
          setSignedPersonPhotoUrl(url);
        } catch (error) {
          console.error('Failed to get signed URL:', error);
        }
      }
    };

    getSignedUrl();
  }, [personPhotoUrl]);

  // ... rest of the component code remains the same ...

  return (
    <Card className="p-6 space-y-6">
      {/* ... other JSX remains the same ... */}
      
      {/* Photo Comparison Section */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Photo Verification</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Captured Photo</p>
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
              {signedPersonPhotoUrl ? (
                <Image
                  src={signedPersonPhotoUrl}
                  alt="Captured Photo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No photo available
                </div>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">eKYC Photo</p>
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden border">
              {ekycData.photo ? (
                <Image
                  src={`data:image/jpeg;base64,${ekycData.photo}`}
                  alt="eKYC Photo"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  No photo available
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-col items-center justify-center space-y-2">
          <div className="flex items-center">
            {faceMatchScore >= 80 ? (
              <>
                <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                <span className="text-green-500 font-medium">Photos match</span>
              </>
            ) : (
              <>
                <XCircle className="h-5 w-5 text-red-500 mr-2" />
                <span className="text-red-500 font-medium">Photos do not match</span>
              </>
            )}
          </div>
          <div className="text-sm text-gray-600">
            Face Match Score: {faceMatchScore}%
          </div>
        </div>
      </div>
    </Card>
  );
}