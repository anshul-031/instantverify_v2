import { DocumentRequirement } from '../types';

export const passportRequirements: Record<string, DocumentRequirement> = {
  "advanced-passport": {
    title: "Passport & Aadhaar Card",
    description: "Upload clear photos of both your Passport and Aadhaar card",
    maxFiles: 4
  },
  "basic-passport": {
    title: "Passport",
    description: "Upload clear photos of your Passport (front and back)",
    maxFiles: 2
  }
};