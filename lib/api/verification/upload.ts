import { UploadResponse, FileUploadOptions } from './types';

export async function uploadFile({ file, onProgress }: FileUploadOptions): Promise<string> {
  const formData = new FormData();
  formData.append('files', file);

  const response = await fetch("/api/verify/upload", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Upload failed');
  }

  const data = await response.json();
  return data.urls[0];
}

export async function uploadDocuments(files: File[]): Promise<UploadResponse> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append('files', file);
    });

    const response = await fetch("/api/verify/upload", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Upload failed');
    }

    const data = await response.json();
    return { urls: data.urls };
  } catch (error) {
    console.error('Document upload error:', error);
    throw error;
  }
}