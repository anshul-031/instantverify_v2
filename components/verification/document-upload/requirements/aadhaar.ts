import { DocumentRequirement } from '../types';

export const aadhaarRequirements: Record<string, DocumentRequirement> = {
  "aadhaar-otp": {
    title: "Aadhaar Card",
    description: "Upload clear photos of your Aadhaar card (front and back)",
    maxFiles: 2
  },
  "advanced-aadhaar": {
    title: "Aadhaar Card",
    description: "Upload clear photos of your Aadhaar card (front and back)",
    maxFiles: 2
  }
};