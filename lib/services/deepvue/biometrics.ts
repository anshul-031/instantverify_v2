import { makeRequest } from './api';
import { FaceMatchResponse } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

export async function matchFaces(
  image1Url: string,
  image2Url: string
): Promise<number> {
  logger.debug('Matching faces', { image1Url, image2Url });

  // In development, return mock response
  if (process.env.NODE_ENV === 'development') {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Load and return mock response
    const mockResponse = require('@/responses/faceMatchAPIResponse.json');
    return mockResponse.data.confidence;
  }

  const response = await makeRequest<FaceMatchResponse>('/biometrics/face-match', {
    method: 'POST',
    body: JSON.stringify({ image1Url, image2Url }),
  });
  
  return response.matchScore;
}