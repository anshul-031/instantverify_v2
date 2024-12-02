import { VerificationFormData } from '@/lib/types/verification';
import { VerificationResponse } from './types';

export async function submitVerification(formData: VerificationFormData): Promise<VerificationResponse> {
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
    return {
      success: true,
      verificationId: data.verificationId
    };
  } catch (error) {
    console.error('Verification submission error:', error);
    throw new Error('Failed to submit verification');
  }
}