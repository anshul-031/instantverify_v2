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

interface ComparisonField {
  label: string;
  key: keyof ExtractedInfo;
}

export function IDVerificationComparison({ 
  ocrData, 
  ekycData, 
  faceMatchScore = 0,
  personPhotoUrl
}: Props) {

  const fields: ComparisonField[] = [
    { label: "Name", key: "name" },
    { label: "Date of Birth", key: "dateOfBirth" },
    { label: "Gender", key: "gender" },
    { label: "Father's Name", key: "fatherName" },
    { label: "Address", key: "address" },
    { label: "District", key: "district" },
    { label: "State", key: "state" },
    { label: "Pincode", key: "pincode" },
  ];

  const [signedPersonPhotoUrl, setSignedPersonPhotoUrl] = useState<string>("");

  const getMatchStatus = (field: keyof ExtractedInfo) => {
    if (!ocrData[field] || !ekycData[field]) return false;
    return ocrData[field].toLowerCase() === ekycData[field].toLowerCase();
  };

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

   // Calculate overall match percentage
   const matchedFields = fields.filter(field => getMatchStatus(field.key)).length;
   const totalFields = fields.length;
   const matchPercentage = Math.round((matchedFields / totalFields) * 100);

  // Overall verification status
  const isVerified = matchPercentage >= 80 && (faceMatchScore >= 80);
  // ... rest of the component code remains the same ...

  return (
    <Card className="p-6 space-y-6">
      {/* ... other JSX remains the same ... */}

      {/* Header Section */}
      <div className="flex items-center justify-between border-b pb-4">
        <h2 className="text-xl font-semibold">ID Verification Result</h2>
        <div className="flex items-center gap-4">
          <div className={`flex items-center px-4 py-2 rounded-full ${
            isVerified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
          }`}>
            {isVerified ? (
              <CheckCircle className="h-5 w-5 mr-2" />
            ) : (
              <XCircle className="h-5 w-5 mr-2" />
            )}
            <span className="font-semibold">
              {isVerified ? 'Verified' : 'Not Verified'}
            </span>
          </div>
          <div className="text-sm">
            <span className="font-medium">Match Score:</span>
            <span className={`ml-2 font-bold ${
              matchPercentage >= 80 ? 'text-green-600' : 'text-red-600'
            }`}>
              {matchPercentage}%
            </span>
          </div>
        </div>
      </div>

      {/* Comparison Table */}
      <div className="overflow-hidden rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Particulars</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">User Provided Details</th>
              <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Data from Government Source (Aadhaar Card)</th>
              <th className="px-4 py-3 text-center text-sm font-medium text-gray-500">Verification Result</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {fields.map((field, index) => {
              const isMatched = getMatchStatus(field.key);
              return (
                <tr key={field.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">
                    {field.label}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ocrData[field.key] || "N/A"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {ekycData[field.key] || "N/A"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-center">
                      {isMatched ? (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircle className="h-3 w-3 mr-1" />
                          Matched
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                          <XCircle className="h-3 w-3 mr-1" />
                          Not Matched
                        </span>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      
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