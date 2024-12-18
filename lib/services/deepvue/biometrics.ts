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
    
    let mockResponse;
    if(process.env.NEXT_PUBLIC_FACE_MATCH_API_RESPONSE){
      mockResponse = JSON.parse(process.env.NEXT_PUBLIC_FACE_MATCH_API_RESPONSE);
    }else{
      // TODO: Call Deepvue match Face API to fetch EKYC Data 
    }

    return mockResponse.data.confidence;
  }

  const response = await makeRequest<FaceMatchResponse>('/biometrics/face-match', {
    method: 'POST',
    body: JSON.stringify({ image1Url, image2Url }),
  });
  
  return response.matchScore;
}