import { StorageService } from "@/services/StorageService";
import { StorageConfig, UploadResult } from "@/types/Storage";


export class DocumentStorageService {
  private static readonly CONFIG: StorageConfig = {
    bucket: "deal_documents",
    allowedFileTypes: ["application/pdf", "application/doc", "application/docx", "text/plain", "image/jpeg", "image/png", "image/gif"],
    maxFileSize: 1024 * 1024 * 1024, // 1GB
    folder: "", // Will be set dynamically based on deal_id
    signedUrlExpiry: 3600 // 1 hour
  };

  /**
   * Uploads multiple documents for a specific deal
   * @param dealId - The deal ID
   * @param files - Array of document files to upload
   * @returns Array of upload results with path and URLs
   */
  static async uploadDocument(dealId: string, files: File[]): Promise<UploadResult[]> {
    const config = {
      ...this.CONFIG,
      folder: `${dealId}`
    };
    const uploadPromises = files.map(file => StorageService.uploadFile(dealId, file, config));
    return Promise.all(uploadPromises);
  }

  /**
   * Gets a signed URL for a document
   * @param filePath - The file path
   * @returns The signed URL
   */
  static async getDocumentSignedUrl(filePath: string): Promise<string> {
    return StorageService.getSignedUrl(filePath, this.CONFIG.bucket, this.CONFIG.signedUrlExpiry);
  }

  /**
   * Gets a public URL for a document
   * @param filePath - The file path
   * @returns The public URL
   */
  static getDocumentPublicUrl(filePath: string): string {
    return StorageService.getPublicUrl(filePath, this.CONFIG.bucket);
  }

  /**
   * Deletes a document
   * @param filePath - The file path
   */
  static async deleteDocument(filePath: string): Promise<void> {
    return StorageService.deleteFile(filePath, this.CONFIG.bucket);
  }

  /**
   * Updates a document (deletes old, uploads new)
   * @param dealId - The deal ID
   * @param newFile - The new document file
   * @param oldFilePath - The old file path
   * @returns Upload result
   */
  static async updateDocument(
    dealId: string, 
    newFile: File, 
    oldFilePath?: string
  ): Promise<UploadResult> {
    const config = {
      ...this.CONFIG,
      folder: `${dealId}`
    };
    return StorageService.updateFile(dealId, newFile, config, oldFilePath);
  }

  /**
   * Lists all documents for a specific deal
   * @param dealId - The deal ID
   * @returns List of file names
   */
  static async listDealDocuments(dealId: string): Promise<string[]> {
    const folder = `${dealId}`;
    return StorageService.listFiles(this.CONFIG.bucket, folder);
  }
} 