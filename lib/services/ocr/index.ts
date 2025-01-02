import { prisma } from '@/lib/db';
import { ExtractedInfo } from '@/lib/types/deepvue';
import logger from '@/lib/utils/logger';

export async function createOcrData(extractedInfo: ExtractedInfo) {
  try {
    const ocrData = await prisma.ocrData.create({
      data: {
        data: extractedInfo,
        createdAt: new Date(),
      }
    });

    logger.info('OCR data stored successfully', { id: ocrData.id });
    return ocrData;
  } catch (error) {
    logger.error('Failed to create OCR data:', error);
    throw error;
  }
}

export async function getLatestOcrData() {
  try {
    return await prisma.ocrData.findFirst({
      orderBy: {
        createdAt: 'desc'
      }
    });
  } catch (error) {
    logger.error('Failed to get latest OCR data:', error);
    throw error;
  }
}