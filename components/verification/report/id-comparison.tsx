import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { ExtractedInfo } from "@/lib/types/deepvue";
import Image from "next/image";

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
    { label: "Address", key: "address" },
    { label: "Date of Birth", key: "dateOfBirth" },
    { label: "Gender", key: "gender" },
    { label: "Father's Name", key: "fatherName" },
    { label: "District", key: "district" },
    { label: "State", key: "state" },
    { label: "City", key: "city" },
    { label: "Pincode", key: "pincode" },
    { label: "Country", key: "country" },
  ];

  const getMatchStatus = (field: keyof ExtractedInfo) => {
    if (!ocrData[field] || !ekycData[field]) return false;
    return ocrData[field].toLowerCase() === ekycData[field].toLowerCase();
  };

  console.log("personPhotoUrl in id-comparision.tsx",personPhotoUrl);

  return (
    <Card className="p-6 space-y-6">
      <h2 className="text-xl font-semibold">ID Verification Result</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* User Provided Details Column */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-500">User Provided Details</h3>
          {fields.map(field => (
            <div key={`ocr-${field.key}`} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{field.label}</p>
              <p className="font-medium">{ocrData[field.key] || "N/A"}</p>
            </div>
          ))}
        </div>

        {/* Government Data Column */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-500">Data from Government Source</h3>
          {fields.map(field => (
            <div key={`ekyc-${field.key}`} className="p-3 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600">{field.label}</p>
              <p className="font-medium">{ekycData[field.key] || "N/A"}</p>
            </div>
          ))}
        </div>

        {/* Verification Results Column */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-500">Verification Result</h3>
          {fields.map(field => (
            <div key={`match-${field.key}`} className="p-3 bg-gray-50 rounded-lg flex items-center justify-between">
              <p className="text-sm text-gray-600">{field.label}</p>
              {getMatchStatus(field.key) ? (
                <div className="flex items-center text-green-500">
                  <CheckCircle className="h-5 w-5" />
                </div>
              ) : (
                <div className="flex items-center text-red-500">
                  <XCircle className="h-5 w-5" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Photo Comparison Section */}
      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Photo Verification</h3>
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Captured Photo</p>
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {personPhotoUrl ? (
                <Image
                  src={personPhotoUrl}
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
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
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