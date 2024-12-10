import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import { UPLOAD_CONFIG } from './config';
import logger from '@/lib/utils/logger';

export async function ensureUploadDirectory(): Promise<void> {
  try {
    await mkdir(UPLOAD_CONFIG.uploadDir, { recursive: true });
    logger.debug('Upload directory ensured');
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      logger.error('Failed to create upload directory:', error);
      throw error;
    }
  }
}

export async function saveFile(file: File): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${uuidv4()}-${file.name}`;
  const filePath = join(UPLOAD_CONFIG.uploadDir, fileName);

  await writeFile(filePath, buffer);
  logger.debug('File saved:', { fileName });

  return `/uploads/${fileName}`;
}

export async function saveFiles(files: File[]): Promise<string[]> {
  await ensureUploadDirectory();
  const urls = await Promise.all(files.map(saveFile));
  return urls;
}