import { VerificationMethod, SecurityLevel } from '@/lib/types/verification';

export function getSecurityLevel(method: VerificationMethod): SecurityLevel {
  if (method.startsWith('advanced-') || method.includes('-aadhaar')) {
    return 'most-advanced';
  } else if (method.startsWith('basic-')) {
    return 'less-advanced';
  }
  return 'medium-advanced';
}

export function getMethodDetails(method: VerificationMethod) {
  const securityLevel = getSecurityLevel(method);
  const methodName = method.split('-').map(word => 
    word.charAt(0).toUpperCase() + word.slice(1)
  ).join(' ');

  return {
    id: method,
    name: methodName,
    securityLevel
  };
}