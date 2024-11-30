"use client";

import { Card } from "@/components/ui/card";
import { IDVerificationResult } from "@/lib/types/report";
import { CheckCircle, XCircle } from "lucide-react";
import Image from "next/image";

interface Props {
  result: IDVerificationResult;
}

export function IDVerificationSection({ result }: Props) {
  const { extractedInfo, matchedInfo, confidence } = result;

  return (
    <Card className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">ID Verification Result</h2>
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-600">Confidence:</span>
          <span className="font-semibold">{confidence}%</span>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <h3 className="font-medium">Extracted Information</h3>
          <dl className="space-y-2">
            {Object.entries(extractedInfo).map(([key, value]) => {
              if (key === 'photo') return null;
              return (
                <div key={key} className="flex justify-between">
                  <dt className="text-gray-600 capitalize">{key.replace(/([A-Z])/g, ' $1')}</dt>
                  <dd className="font-medium">{value}</dd>
                </div>
              );
            })}
          </dl>
        </div>

        <div className="space-y-4">
          <h3 className="font-medium">Information Match Status</h3>
          <ul className="space-y-2">
            {Object.entries(matchedInfo).map(([key, matched]) => {
              if (key === 'photo') return null;
              return (
                <li key={key} className="flex items-center justify-between">
                  <span className="text-gray-600 capitalize">
                    {key.replace(/([A-Z])/g, ' $1')}
                  </span>
                  {matched ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-500" />
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="font-medium mb-4">Photo Verification</h3>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-sm text-gray-600">ID Photo</p>
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              <Image
                src={extractedInfo.photo}
                alt="ID Photo"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-sm text-gray-600">Captured Photo</p>
            <div className="relative aspect-[3/4] bg-gray-100 rounded-lg overflow-hidden">
              {/* This would be the photo captured during verification */}
              <Image
                src={extractedInfo.photo} // Replace with captured photo
                alt="Captured Photo"
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-center">
          {matchedInfo.photo ? (
            <div className="flex items-center text-green-500">
              <CheckCircle className="h-5 w-5 mr-2" />
              <span>Photos match</span>
            </div>
          ) : (
            <div className="flex items-center text-red-500">
              <XCircle className="h-5 w-5 mr-2" />
              <span>Photos do not match</span>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}