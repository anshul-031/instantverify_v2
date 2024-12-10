import { VerificationMethod } from '@/lib/types/verification';
import { getSecurityLevel } from './methods';

export function calculateVerificationPrice(method: VerificationMethod): { 
  basePrice: number;
  gst: number;
  total: number;
} {
  const securityLevel = getSecurityLevel(method);
  let basePrice = 20; // Default price

  // Adjust price based on security level
  switch (securityLevel) {
    case 'most-advanced':
      basePrice = 50;
      break;
    case 'medium-advanced':
      basePrice = 35;
      break;
    case 'less-advanced':
      basePrice = 20;
      break;
  }

  const gst = basePrice * 0.18; // 18% GST
  const total = basePrice + gst;

  return {
    basePrice,
    gst,
    total
  };
}