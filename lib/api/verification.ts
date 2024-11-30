"use client";

import { VerificationFormData } from "@/lib/types/verification";

export async function submitVerification(formData: VerificationFormData) {
  try {
    const response = await fetch("/api/verify", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return { success: true, data };
  } catch (error) {
    console.error('Verification submission error:', error);
    throw new Error('Failed to submit verification');
  }
}

export async function uploadDocuments(files: File[]) {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch("/api/verify/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    return { success: true, urls: data.urls };
  } catch (error) {
    console.error('Document upload error:', error);
    throw error;
  }
}