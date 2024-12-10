import { NextResponse } from 'next/server';
import { validateFiles } from '@/lib/api/upload/validation';
import { saveFiles } from '@/lib/api/upload/storage';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

// Route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  return withLogging(request, async (req) => {
    try {
      const formData = await request.formData();
      const files = formData.getAll('files') as File[];

      // Validate files
      const validationError = validateFiles(files);
      if (validationError) {
        logger.warn('File validation failed:', validationError);
        return NextResponse.json(
          { error: validationError },
          { status: 400 }
        );
      }

      // Save files and get URLs
      const urls = await saveFiles(files);
      logger.info('Files uploaded successfully', { count: urls.length });

      return NextResponse.json({ urls });
    } catch (error) {
      logger.error('Upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload files' },
        { status: 500 }
      );
    }
  });
}