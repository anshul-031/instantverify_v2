import { VerificationMethod } from '@/lib/types/verification';

export interface DocumentRequirement {
  title: string;
  description: string;
  maxFiles: number;
}

export const documentRequirements: Record<VerificationMethod, DocumentRequirement> = {
  "aadhaar-otp": {
    title: "Aadhaar Card",
    description: "Upload clear photos of your Aadhaar card (front and back)",
    maxFiles: 2
  },
  "advanced-aadhaar": {
    title: "Aadhaar Card",
    description: "Upload clear photos of your Aadhaar card (front and back)",
    maxFiles: 2
  },
  "advanced-driving-license": {
    title: "Driving License & Aadhaar Card",
    description: "Upload clear photos of both your Driving License and Aadhaar card",
    maxFiles: 4
  },
  "advanced-voter-id": {
    title: "Voter ID & Aadhaar Card",
    description: "Upload clear photos of both your Voter ID and Aadhaar card",
    maxFiles: 4
  },
  "advanced-passport": {
    title: "Passport & Aadhaar Card",
    description: "Upload clear photos of both your Passport and Aadhaar card",
    maxFiles: 4
  },
  "driving-license-aadhaar": {
    title: "Driving License & Aadhaar Card",
    description: "Upload clear photos of both your Driving License and Aadhaar card",
    maxFiles: 4
  },
  "voter-id-aadhaar": {
    title: "Voter ID & Aadhaar Card",
    description: "Upload clear photos of both your Voter ID and Aadhaar card",
    maxFiles: 4
  },
  "basic-driving-license": {
    title: "Driving License",
    description: "Upload clear photos of your Driving License (front and back)",
    maxFiles: 2
  },
  "basic-voter-id": {
    title: "Voter ID",
    description: "Upload clear photos of your Voter ID (front and back)",
    maxFiles: 2
  },
  "basic-passport": {
    title: "Passport",
    description: "Upload clear photos of your Passport (front and back)",
    maxFiles: 2
  },
  "driving-license": {
    title: "Driving License",
    description: "Upload clear photos of your Driving License (front and back)",
    maxFiles: 2
  },
  "voter-id": {
    title: "Voter ID",
    description: "Upload clear photos of your Voter ID (front and back)",
    maxFiles: 2
  }
};