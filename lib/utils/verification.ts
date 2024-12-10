import { VerificationMethod, SecurityLevel } from '@/lib/types/verification';

export function getSecurityLevelFromMethod(method: VerificationMethod): SecurityLevel {
  if (method.startsWith('advanced-') || method.includes('-aadhaar')) {
    return 'most-advanced';
  } else if (method.startsWith('basic-')) {
    return 'less-advanced';
  }
  return 'medium-advanced';
}

export function getMethodDetails(method: VerificationMethod) {
  const securityLevel = getSecurityLevelFromMethod(method);
  const methodName = method.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    id: method,
    name: methodName,
    securityLevel
  };
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