"use client";

import { Card } from "@/components/ui/card";
import { CheckCircle, XCircle } from "lucide-react";
import { ExtractedInfo } from "@/lib/types/deepvue";

interface Props {
  ocrData: ExtractedInfo;
  ekycData: ExtractedInfo;
}

interface ComparisonField {
  label: string;
  ocrKey: keyof ExtractedInfo;
  ekycKey: keyof ExtractedInfo;
}

const comparisonFields: ComparisonField[] = [
  { label: "Name", ocrKey: "name", ekycKey: "name" },
  { label: "Address", ocrKey: "address", ekycKey: "address" },
  { label: "Date of Birth", ocrKey: "dateOfBirth", ekycKey: "dateOfBirth" },
  { label: "Gender", ocrKey: "gender", ekycKey: "gender" },
  { label: "Father's Name", ocrKey: "fatherName", ekycKey: "fatherName" }
];

export function IdVerificationComparison({ ocrData, ekycData }: Props) {
  const isFieldMatching = (ocrValue: string, ekycValue: string) => {
    return ocrValue.toLowerCase().trim() === ekycValue.toLowerCase().trim();
  };

  return (
    <Card className="p-6">
      <h2 className="text-xl font-semibold mb-6">ID Verification Result</h2>
      
      <div className="grid grid-cols-1 gap-6">
        {comparisonFields.map(({ label, ocrKey, ekycKey }) => {
          const ocrValue = ocrData[ocrKey] || "";
          const ekycValue = ekycData[ekycKey] || "";
          const isMatching = isFieldMatching(ocrValue, ekycValue);

          return (
            <div key={label} className="border-b pb-4 last:border-0">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-gray-700">{label}</span>
                {isMatching ? (
                  <CheckCircle className="h-5 w-5 text-green-500" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-500" />
                )}
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">OCR Result</p>
                  <p className={`text-sm ${isMatching ? 'text-gray-700' : 'text-red-600'}`}>
                    {ocrValue || "Not available"}
                  </p>
                </div>
                
                <div>
                  <p className="text-sm text-gray-500 mb-1">eKYC Result</p>
                  <p className={`text-sm ${isMatching ? 'text-gray-700' : 'text-red-600'}`}>
                    {ekycValue || "Not available"}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}