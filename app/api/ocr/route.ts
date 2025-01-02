import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db';
import { ExtractedInfo } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

// Add route segment config
export const dynamic = 'force-dynamic';
export const runtime = 'nodejs';

// Define allowed methods
export async function POST(request: Request) {
  try {
    const { extractedInfo } = await request.json();
    
    const ocrData = await prisma.ocrData.create({
      data: {
        data: extractedInfo,
        createdAt: new Date()
      }
    });

    logger.info('OCR data stored successfully', { id: ocrData.id });
    return NextResponse.json({ success: true, id: ocrData.id });
  } catch (error) {
    logger.error('Failed to store OCR data:', error);
    return NextResponse.json(
      { error: 'Failed to store OCR data' },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const ocrData = await prisma.ocrData.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });

    if (!ocrData) {
      return NextResponse.json(
        { error: 'No OCR data found' },
        { status: 404 }
      );
    }

    return NextResponse.json(ocrData.data);
  } catch (error) {
    logger.error('Failed to fetch OCR data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch OCR data' },
      { status: 500 }
    );
  }
}