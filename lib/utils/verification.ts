import { VerificationMethod, SecurityLevel } from '@/lib/types/verification';
import { verificationMethods } from '@/lib/data/countries';

export function getSecurityLevelFromMethod(method: VerificationMethod): SecurityLevel {
  for (const [level, methods] of Object.entries(verificationMethods)) {
    if (methods.some(m => m.id === method)) {
      return level as SecurityLevel;
    }
  }
  return 'less-advanced'; // Default security level
}

export function getMethodDetails(method: VerificationMethod) {
  for (const [level, methods] of Object.entries(verificationMethods)) {
    const methodDetails = methods.find(m => m.id === method);
    if (methodDetails) {
      return {
        ...methodDetails,
        securityLevel: level as SecurityLevel
      };
    }
  }
  return null;
}

export function formatPrice(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2
  }).format(amount);
}

export function calculateVerificationPrice(method: VerificationMethod): { 
  basePrice: number;
  gst: number;
  total: number;
} {
  const securityLevel = getSecurityLevelFromMethod(method);
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