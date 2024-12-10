import { FileData } from '@/lib/types/verification';

export function convertFileToFileData(file: File, url: string): FileData {
  return {
    url,
    name: file.name,
    size: file.size,
    type: file.type
  };
}

export function validateFileSize(file: File, maxSize: number = 5 * 1024 * 1024): boolean {
  return file.size <= maxSize;
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.includes(file.type);
}