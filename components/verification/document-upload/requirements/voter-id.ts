import { DocumentRequirement } from '../types';

export const voterIdRequirements: Record<string, DocumentRequirement> = {
  "advanced-voter-id": {
    title: "Voter ID & Aadhaar Card",
    description: "Upload clear photos of both your Voter ID and Aadhaar card",
    maxFiles: 4
  },
  "voter-id-aadhaar": {
    title: "Voter ID & Aadhaar Card",
    description: "Upload clear photos of both your Voter ID and Aadhaar card",
    maxFiles: 4
  },
  "basic-voter-id": {
    title: "Voter ID",
    description: "Upload clear photos of your Voter ID (front and back)",
    maxFiles: 2
  },
  "voter-id": {
    title: "Voter ID",
    description: "Upload clear photos of your Voter ID (front and back)",
    maxFiles: 2
  }
};