import { NextResponse } from 'next/server';
import { join } from 'path';
import { saveUploadedFile } from '@/lib/utils/file';
import { withLogging } from '@/lib/middleware/logging';
import logger from '@/lib/utils/logger';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  return withLogging(request, async () => {
    try {
      const formData = await request.formData();
      const uploadDir = join(process.cwd(), 'public', 'uploads');
      const urls: string[] = [];

      const files = formData.getAll('files');
      
      logger.debug('File upload attempt', { 
        fileCount: files.length 
      });

      for (const file of files) {
        if (file instanceof Blob) {
          const url = await saveUploadedFile(file, uploadDir);
          urls.push(url);
          logger.debug('File uploaded successfully', { 
            fileName: file.name,
            size: file.size,
            type: file.type,
            url 
          });
        }
      }

      logger.info('All files uploaded successfully', { 
        count: urls.length,
        urls 
      });

      return NextResponse.json({ 
        success: true, 
        urls 
      });
    } catch (error) {
      logger.error('Upload error:', error);
      return NextResponse.json(
        { error: 'Failed to upload files' },
        { status: 500 }
      );
    }
  });
}