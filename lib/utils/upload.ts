import { UploadResponse, UploadedFile } from '@/lib/types/upload';
import { VerificationDocuments } from '@/lib/types/verification';

export async function uploadFiles(files: File[]): Promise<UploadResponse> {
  const formData = new FormData();
  files.forEach(file => formData.append('files', file));

  const response = await fetch('/api/verify/upload', {
    method: 'POST',
    body: formData
  });

  if (!response.ok) {
    const data = await response.json();
    throw new Error(data.error || 'Upload failed');
  }

  return response.json();
}

export function createFileData(url: string, file: File): UploadedFile {
  return {
    url,
    type: "document",
    name: "Government ID",
    size: file.size
  };
}

export function convertToVerificationDocuments(urls: string[], files: File[]): VerificationDocuments {
  return {
    governmentId: urls.map((url, index) => createFileData(url, files[index]))
  };
}