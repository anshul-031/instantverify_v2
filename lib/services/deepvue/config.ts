interface DeepvueConfig {
  API_BASE: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  TIMEOUT: number;
  RETRIES: number;
  RETRY_DELAY: number;
}

interface SandboxConfig {
  API_BASE: string;
  CLIENT_ID: string;
  CLIENT_SECRET: string;
  TIMEOUT: number;
  RETRIES: number;
  RETRY_DELAY: number;
}

export const DEEPVUE_CONFIG: DeepvueConfig = {
  API_BASE: process.env.NEXT_PUBLIC_DEEPVUE_API_BASE || 'https://production.deepvue.tech/v1',
  CLIENT_ID: process.env.NEXT_PUBLIC_DEEPVUE_CLIENT_ID || '',
  CLIENT_SECRET: process.env.NEXT_PUBLIC_DEEPVUE_CLIENT_SECRET || '',
  TIMEOUT: 30000, // 30 seconds
  RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

export const SANDBOX_CONFIG: SandboxConfig = {
  API_BASE: process.env.NEXT_PUBLIC_SANDBOX_API_BASE || 'https://production.deepvue.tech/v1',
  CLIENT_ID: process.env.NEXT_PUBLIC_SANDBOX_CLIENT_ID || '',
  CLIENT_SECRET: process.env.NEXT_PUBLIC_SANDBOX_CLIENT_SECRET || '',
  TIMEOUT: 30000, // 30 seconds
  RETRIES: 3,
  RETRY_DELAY: 1000, // 1 second
};

export function validateConfig(): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];

  if (!DEEPVUE_CONFIG.CLIENT_ID) {
    errors.push('DEEPVUE_CLIENT_ID is required');
  }

  if (!DEEPVUE_CONFIG.CLIENT_SECRET) {
    errors.push('DEEPVUE_CLIENT_SECRET is required');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
