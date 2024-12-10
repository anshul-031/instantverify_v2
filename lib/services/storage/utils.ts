import { v4 as uuidv4 } from 'uuid';
import path from 'path';

export function generateUniqueFilename(originalFilename: string): string {
  const ext = path.extname(originalFilename);
  const timestamp = Date.now();
  const uuid = uuidv4();
  return `${timestamp}-${uuid}${ext}`;
}

export function getFileExtension(filename: string): string {
  return path.extname(filename).toLowerCase();
}

export function sanitizeFilename(filename: string): string {
  return filename
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');
}

export function generateStoragePath(type: string, userId: string): string {
  return `${type}/${userId}/${new Date().getFullYear()}/${(new Date().getMonth() + 1).toString().padStart(2, '0')}`;
}