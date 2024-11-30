import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function ensureDirectory(dir: string): Promise<void> {
  try {
    await mkdir(dir, { recursive: true });
  } catch (error) {
    if ((error as NodeJS.ErrnoException).code !== 'EEXIST') {
      throw error;
    }
  }
}

export async function saveUploadedFile(file: Blob, uploadDir: string): Promise<string> {
  const buffer = Buffer.from(await file.arrayBuffer());
  const fileName = `${uuidv4()}-${Date.now()}`;
  const filePath = join(uploadDir, fileName);
  
  await ensureDirectory(uploadDir);
  await writeFile(filePath, buffer);
  
  return `/uploads/${fileName}`;
}