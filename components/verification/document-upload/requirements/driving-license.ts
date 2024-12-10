import { DocumentRequirement } from '../types';

export const drivingLicenseRequirements: Record<string, DocumentRequirement> = {
  "advanced-driving-license": {
    title: "Driving License & Aadhaar Card",
    description: "Upload clear photos of both your Driving License and Aadhaar card",
    maxFiles: 4
  },
  "driving-license-aadhaar": {
    title: "Driving License & Aadhaar Card",
    description: "Upload clear photos of both your Driving License and Aadhaar card",
    maxFiles: 4
  },
  "basic-driving-license": {
    title: "Driving License",
    description: "Upload clear photos of your Driving License (front and back)",
    maxFiles: 2
  },
  "driving-license": {
    title: "Driving License",
    description: "Upload clear photos of your Driving License (front and back)",
    maxFiles: 2
  }
};