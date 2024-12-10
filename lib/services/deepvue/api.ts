import { DEEPVUE_CONFIG } from './config';
import { DeepvueError } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

export async function makeRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  try {
    const response = await fetch(`${DEEPVUE_CONFIG.API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Authorization': `Bearer ${DEEPVUE_CONFIG.API_KEY}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw {
        message: error.message || 'API request failed',
        code: error.code || 'UNKNOWN_ERROR',
        status: response.status,
      } as DeepvueError;
    }

    return response.json();
  } catch (error) {
    logger.error('Deepvue API error:', error);
    throw error;
  }
}