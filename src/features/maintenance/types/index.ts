/**
 * Maintenance feature — scoped types.
 */

export interface ImagePreview {
  /** Unique local key (used before upload) */
  localId: string;
  /** Object URL for preview */
  previewUrl: string;
  file: File;
  /** Set after upload completes */
  uploadedUrl?: string;
  uploading: boolean;
  error?: string;
}

export interface TicketFormValues {
  propertyId: string;
  title: string;
  category: string;
  priority: string;
  description: string;
  imageUrls: string[];
}
