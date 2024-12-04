import { NextRequest, NextResponse } from 'next/server';
import { APILogger } from '@/lib/utils/logger';

export async function withLogging(
  req: Request,
  handler: (req: Request) => Promise<Response>
) {
  const method = req.method;
  const url = req.url;
  
  try {
    // Clone the request before reading the body
    const reqForBody = req.clone();
    let body;
    
    if (method !== 'GET') {
      try {
        body = await reqForBody.json();
      } catch (error) {
        // Ignore body parsing errors
      }
    }
    
    APILogger.logRequest(method, url, body);
    
    const response = await handler(req);
    const responseClone = response.clone();
    let responseBody;
    
    try {
      responseBody = await responseClone.json();
    } catch (error) {
      // Ignore response parsing errors
    }
    
    APILogger.logResponse(method, url, response.status, responseBody);
    
    return response;
  } catch (error) {
    APILogger.logError(method, url, error);
    throw error;
  }
}