/**
 * Abstract file storage service interface.
 * Implement this interface to swap storage providers (Firebase Storage → S3, etc.)
 * without changing application code.
 *
 * Supported file types: JPEG, PNG, WebP
 * Maximum file size: 5MB per file
 */

export interface UploadResult {
  /** Unique identifier for the uploaded file */
  id: string;
  /** Public URL to access the file */
  url: string;
  /** Original file name */
  fileName: string;
  /** File size in bytes */
  size: number;
  /** MIME type of the uploaded file */
  mimeType: string;
}

export type AllowedMimeType = 'image/jpeg' | 'image/png' | 'image/webp';

export const ALLOWED_MIME_TYPES: AllowedMimeType[] = [
  'image/jpeg',
  'image/png',
  'image/webp',
];

export const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5MB

export interface IFileStorageService {
  /**
   * Upload a file to storage.
   * Validates file type (JPEG, PNG, WebP) and size (max 5MB) before uploading.
   * @param file - The File object to upload
   * @param path - Storage path/prefix (e.g. 'maintenance/ticket-123')
   * @throws Error if file type or size is invalid
   */
  uploadFile(file: File, path: string): Promise<UploadResult>;

  /**
   * Delete a file from storage by its ID.
   * @param id - The file ID returned from uploadFile
   */
  deleteFile(id: string): Promise<void>;

  /**
   * Get the public URL for a file by its ID.
   * @param id - The file ID returned from uploadFile
   */
  getFileUrl(id: string): Promise<string>;
}
