import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';
import logger from './logger';

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf'];

export async function validateFile(file: File): Promise<void> {
  if (file.size > MAX_FILE_SIZE) {
    throw new Error(`File ${file.name} exceeds 5MB limit`);
  }
  
  if (!ALLOWED_TYPES.includes(file.type)) {
    throw new Error(`File ${file.name} has invalid type. Allowed types: ${ALLOWED_TYPES.join(', ')}`);
  }
}

export async function ensureDirectory(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
    logger.debug('Directory ensured:', dir);
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      logger.error('Failed to create directory:', error);
      throw error;
    }
  }
}

export async function saveUploadedFile(file: Blob, uploadDir: string): Promise<string> {
  try {
    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = `${uuidv4()}-${Date.now()}`;
    const filePath = join(uploadDir, fileName);
    
    await ensureDirectory(uploadDir);
    await writeFile(filePath, buffer);
    
    logger.debug('File saved successfully:', filePath);
    return `/uploads/${fileName}`;
  } catch (error) {
    logger.error('Failed to save file:', error);
    throw new Error('Failed to save uploaded file');
  }
}

export function getFileExtension(filename: string): string {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
}

export function generateUniqueFilename(originalFilename: string): string {
  const extension = getFileExtension(originalFilename);
  return `${uuidv4()}.${extension}`;
}