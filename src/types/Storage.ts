export interface StorageConfig {
  bucket: string;
  folder?: string;
  signedUrlExpiry?: number;
  allowedFileTypes?: string[];
  maxFileSize?: number; // in bytes
}

export interface UploadResult {
  path: string;
  url: string;
  signedUrl: string;
  fileName: string;
  mimeType: string;
}