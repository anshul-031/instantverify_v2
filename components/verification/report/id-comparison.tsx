import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { ExtractedInfo } from "@/lib/types/deepvue";
import Image from "next/image";

interface Props {
  ocrData: ExtractedInfo;
  ekycData: ExtractedInfo;
}

interface ComparisonField {
  label: string;
  key: keyof ExtractedInfo;
}

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

export function IDVerificationComparison({ ocrData, ekycData }: Props) {
  const getMatchStatus = (field: keyof ExtractedInfo) => {
    if (!ocrData[field] || !ekycData[field]) return false;
    return ocrData[field].toLowerCase() === ekycData[field].toLowerCase();
  };

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
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">ID Photo</p>
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {ekycData.photo && (
                <Image
                  src={`data:image/jpeg;base64,${ekycData.photo}`}
                  alt="ID Photo"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Captured Photo</p>
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {ocrData.photo && (
                <Image
                  src={ocrData.photo}
                  alt="Captured Photo"
                  fill
                  className="object-cover"
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}