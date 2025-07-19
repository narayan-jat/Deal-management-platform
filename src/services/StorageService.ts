import supabase from "@/lib/supabase";
import { ErrorService } from "./ErrorService";
import { StorageConfig, UploadResult } from "@/types/Storage";

export class StorageService {
  private static readonly DEFAULT_SIGNED_URL_EXPIRY = 3600; // 1 hour
  private static readonly DEFAULT_MAX_FILE_SIZE = 1024 * 1024 * 1024; // 1GB

  /**
   * Cleans a filename to make it safe for storage in the bucket
   * @param fileName - The filename to clean
   * @returns The cleaned filename
   */
  private static cleanFileName(fileName: string): string {
    return fileName
      .replace(/[^\w.\-]/g, "_")
      .toLowerCase();
  }

  /**
   * Generates a unique upload path for a file in the bucket
   * @param userId - The user ID
   * @param fileName - The filename to upload
   * @param folder - Optional folder path
   * @returns The upload path
   */
  private static generateUploadPath(userId: string, fileName: string, folder?: string): string {
    const cleanName = this.cleanFileName(fileName);
    const timestamp = Date.now();
    const basePath = folder ? `${folder}/${userId}` : userId;
    return `${basePath}/${timestamp}-${cleanName}`;
  }

  /**
   * Validates file before upload
   * @param file - The file to validate
   * @param config - Storage configuration
   */
  private static validateFile(file: File, config: StorageConfig): void {
    // Check file size
    if (config.maxFileSize && file.size > config.maxFileSize) {
      throw new Error(`File size exceeds maximum allowed size of ${config.maxFileSize / (1024 * 1024)}MB`);
    }

    // Check file type
    if (config.allowedFileTypes && config.allowedFileTypes.length > 0) {
      const fileExtension = file.name.split('.').pop()?.toLowerCase();
      const mimeType = file.type;
      
      const isValidType = config.allowedFileTypes.some(type => 
        type.startsWith('.') 
          ? fileExtension === type.substring(1)
          : mimeType.startsWith(type)
      );

      if (!isValidType) {
        throw new Error(`File type not allowed. Allowed types: ${config.allowedFileTypes.join(', ')}`);
      }
    }
  }

  /**
   * Uploads a file to the specified bucket
   * @param userId - The user ID
   * @param file - The file to upload
   * @param config - Storage configuration
   * @returns Upload result with path and URLs
   */
  static async uploadFile(
    userId: string, 
    file: File, 
    config: StorageConfig
  ): Promise<UploadResult> {
    try {
      // Validate file
      this.validateFile(file, config);

      const uploadPath = this.generateUploadPath(userId, file.name, config.folder);

      const { data, error } = await supabase.storage
        .from(config.bucket)
        .upload(uploadPath, file);

      if (error) {
        throw error;
      }

      // Get Signed URL
      const signedUrl = await this.getSignedUrl(uploadPath, config.bucket, config.signedUrlExpiry || this.DEFAULT_SIGNED_URL_EXPIRY);

      return {
        path: uploadPath,
        url: uploadPath, // For backward compatibility
        signedUrl: signedUrl
      };
    } catch (error) {
      ErrorService.logError(error, `StorageService.uploadFile(${config.bucket})`);
      throw error;
    }
  }

  /**
   * Gets a signed URL for a file
   * @param filePath - The file path
   * @param bucket - The bucket name
   * @param expiry - Optional expiry time in seconds
   * @returns The signed URL
   */
  static async getSignedUrl(
    filePath: string, 
    bucket: string, 
    expiry?: number
  ): Promise<string> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(filePath, expiry || this.DEFAULT_SIGNED_URL_EXPIRY);

      if (error) {
        throw error;
      }

      return data.signedUrl;
    } catch (error) {
      ErrorService.logError(error, `StorageService.getSignedUrl(${bucket})`);
      throw error;
    }
  }

  /**
   * Gets a public URL for a file
   * @param filePath - The file path
   * @param bucket - The bucket name
   * @returns The public URL
   */
  static getPublicUrl(filePath: string, bucket: string): string {
    const { data } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    return data.publicUrl;
  }

  /**
   * Deletes a file from the bucket
   * @param filePath - The file path
   * @param bucket - The bucket name
   */
  static async deleteFile(filePath: string, bucket: string): Promise<void> {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([filePath]);

      if (error) {
        throw error;
      }
    } catch (error) {
      ErrorService.logError(error, `StorageService.deleteFile(${bucket})`);
      throw error;
    }
  }

  /**
   * Updates a file (deletes old, uploads new)
   * @param userId - The user ID
   * @param newFile - The new file to upload
   * @param config - Storage configuration
   * @param oldFilePath - The old file path
   * @returns Upload result
   */
  static async updateFile(
    userId: string,
    newFile: File,
    config: StorageConfig,
    oldFilePath?: string
  ): Promise<UploadResult> {
    try {
      // Delete old file if it exists
      if (oldFilePath) {
        await this.deleteFile(oldFilePath, config.bucket);
      }

      // Upload new file
      return await this.uploadFile(userId, newFile, config);
    } catch (error) {
      ErrorService.logError(error, `StorageService.updateFile(${config.bucket})`);
      throw error;
    }
  }

  /**
   * Lists files in a bucket folder
   * @param bucket - The bucket name
   * @param folder - The folder path
   * @returns List of files
   */
  static async listFiles(bucket: string, folder?: string): Promise<string[]> {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .list(folder || '');

      if (error) {
        throw error;
      }

      return data.map(file => file.name);
    } catch (error) {
      ErrorService.logError(error, `StorageService.listFiles(${bucket})`);
      throw error;
    }
  }
} 