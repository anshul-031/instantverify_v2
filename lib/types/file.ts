export interface UploadedFile {
  url: string;
  name: string;
  size: number;
  type: string;
}

export interface UploadResponse {
  success: boolean;
  urls: string[];
  error?: string;
}