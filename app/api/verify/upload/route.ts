import { NextResponse } from 'next/server';
import { join } from 'path';
import { saveUploadedFile } from '@/lib/utils/file';

export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const uploadDir = join(process.cwd(), 'public', 'uploads');
    const urls: string[] = [];

    const files = formData.getAll('files');
    
    for (const file of files) {
      if (file instanceof Blob) {
        const url = await saveUploadedFile(file, uploadDir);
        urls.push(url);
      }
    }

    return NextResponse.json({ 
      success: true, 
      urls 
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload files' },
      { status: 500 }
    );
  }
}