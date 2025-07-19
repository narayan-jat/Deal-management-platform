import { StorageService } from "@/services/StorageService";
import { StorageConfig, UploadResult } from "@/types/Storage";


export class ProfileStorageService {
  private static readonly CONFIG: StorageConfig = {
    bucket: "profile-images",
    allowedFileTypes: ["image/jpeg", "image/png", "image/webp", "image/svg", "image/jpg"],
    maxFileSize: 5 * 1024 * 1024, // 5MB
    signedUrlExpiry: 3600 // 1 hour
  };

  /**
   * Uploads a profile image
   * @param userId - The user ID
   * @param file - The image file to upload
   * @returns Upload result with path and URLs
   */
  static async uploadProfileImage(userId: string, file: File): Promise<UploadResult> {
    return StorageService.uploadFile(userId, file, this.CONFIG);
  }

  /**
   * Gets a signed URL for a profile image
   * @param filePath - The file path
   * @returns The signed URL
   */
  static async getProfileImageSignedUrl(filePath: string): Promise<string> {
    return StorageService.getSignedUrl(filePath, this.CONFIG.bucket, this.CONFIG.signedUrlExpiry);
  }

  /**
   * Gets a public URL for a profile image
   * @param filePath - The file path
   * @returns The public URL
   */
  static getProfileImagePublicUrl(filePath: string): string {
    return StorageService.getPublicUrl(filePath, this.CONFIG.bucket);
  }

  /**
   * Deletes a profile image
   * @param filePath - The file path
   */
  static async deleteProfileImage(filePath: string): Promise<void> {
    return StorageService.deleteFile(filePath, this.CONFIG.bucket);
  }

  /**
   * Updates a profile image (deletes old, uploads new)
   * @param userId - The user ID
   * @param newFile - The new image file
   * @param oldFilePath - The old file path
   * @returns Upload result
   */
  static async updateProfileImage(
    userId: string, 
    newFile: File, 
    oldFilePath?: string
  ): Promise<UploadResult> {
    return StorageService.updateFile(userId, newFile, this.CONFIG, oldFilePath);
  }

  /**
   * Lists all profile images for a user
   * @param userId - The user ID
   * @returns List of file names
   */
  static async listUserProfileImages(userId: string): Promise<string[]> {
    const folder = `${userId}`;
    return StorageService.listFiles(this.CONFIG.bucket, folder);
  }
} 