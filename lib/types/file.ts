export interface FileData {
  url: string;
  type: string;
  name: string;
  size: number;
}

export interface UploadedFile extends FileData {
  file?: File;
}

export interface UploadResult {
  success: boolean;
  urls: string[];
  error?: string;
}