import { VerificationMethod, VerificationMethodInfo } from '@/lib/types/verification';

interface CountryVerificationMethods {
  name: string;
  advanced: VerificationMethodInfo[];
  basic: VerificationMethodInfo[];
}

export const verificationMethods: Record<string, CountryVerificationMethods> = {
  "IN": {
    name: "India",
    advanced: [
      {
        id: "advanced-aadhaar",
        name: "Advanced Aadhaar Verification",
        description: "Comprehensive verification using Aadhaar with OTP and EKYC",
        prerequisites: [
          "Valid Aadhaar card",
          "Access to Aadhaar-linked mobile number",
          "Clear photos of Aadhaar card (front and back)",
          "Live photo capture"
        ],
        requirements: [
          "Aadhaar number",
          "OTP verification",
          "Document photos",
          "Live photo"
        ],
        price: 99
      },
      {
        id: "advanced-driving-license",
        name: "Advanced Driving License Verification",
        description: "Comprehensive verification using Driving License with Aadhaar EKYC",
        prerequisites: [
          "Valid Driving License",
          "Valid Aadhaar card",
          "Access to Aadhaar-linked mobile number",
          "Clear photos of both documents",
          "Live photo capture"
        ],
        requirements: [
          "Driving License number",
          "Aadhaar number",
          "OTP verification",
          "Document photos",
          "Live photo"
        ],
        price: 149
      },
      {
        id: "advanced-voter-id",
        name: "Advanced Voter ID Verification",
        description: "Comprehensive verification using Voter ID with Aadhaar EKYC",
        prerequisites: [
          "Valid Voter ID card",
          "Valid Aadhaar card",
          "Access to Aadhaar-linked mobile number",
          "Clear photos of both documents",
          "Live photo capture"
        ],
        requirements: [
          "Voter ID number",
          "Aadhaar number",
          "OTP verification",
          "Document photos",
          "Live photo"
        ],
        price: 149
      },
      {
        id: "advanced-passport",
        name: "Advanced Passport Verification",
        description: "Comprehensive verification using Passport with Aadhaar EKYC",
        prerequisites: [
          "Valid Passport",
          "Valid Aadhaar card",
          "Access to Aadhaar-linked mobile number",
          "Clear photos of both documents",
          "Live photo capture"
        ],
        requirements: [
          "Passport number",
          "Aadhaar number",
          "OTP verification",
          "Document photos",
          "Live photo"
        ],
        price: 199
      }
    ],
    basic: [
      {
        id: "basic-driving-license",
        name: "Basic Driving License Verification",
        description: "Standard verification using only Driving License",
        prerequisites: [
          "Valid Driving License",
          "Clear photos of Driving License (front and back)",
          "Live photo capture"
        ],
        requirements: [
          "Driving License number",
          "Document photos",
          "Live photo"
        ],
        price: 49
      },
      {
        id: "basic-voter-id",
        name: "Basic Voter ID Verification",
        description: "Standard verification using only Voter ID",
        prerequisites: [
          "Valid Voter ID card",
          "Clear photos of Voter ID (front and back)",
          "Live photo capture"
        ],
        requirements: [
          "Voter ID number",
          "Document photos",
          "Live photo"
        ],
        price: 49
      },
      {
        id: "basic-passport",
        name: "Basic Passport Verification",
        description: "Standard verification using only Passport",
        prerequisites: [
          "Valid Passport",
          "Clear photos of Passport (front and back)",
          "Live photo capture"
        ],
        requirements: [
          "Passport number",
          "Document photos",
          "Live photo"
        ],
        price: 79
      }
    ]
  }
} as const;

export function getAllVerificationMethods(countryCode: string): VerificationMethodInfo[] {
  const country = verificationMethods[countryCode];
  if (!country) return [];
  return [...country.advanced, ...country.basic];
}

export function getVerificationMethod(countryCode: string, methodId: VerificationMethod): VerificationMethodInfo | undefined {
  return getAllVerificationMethods(countryCode).find(m => m.id === methodId);
}