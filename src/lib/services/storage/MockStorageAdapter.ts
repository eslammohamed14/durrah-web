import {
  type IFileStorageService,
  type UploadResult,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "./IFileStorageService";

function validateFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error(`Invalid file type "${file.type}". Allowed types: JPEG, PNG, WebP.`);
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error("File size exceeds the 5MB limit.");
  }
}

export class MockStorageAdapter implements IFileStorageService {
  private files = new Map<string, UploadResult>();

  async uploadFile(file: File, path: string): Promise<UploadResult> {
    validateFile(file);

    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "_");
    const id = `${path}/${Date.now()}-${Math.random().toString(36).slice(2, 8)}-${safeName}`;
    const url = URL.createObjectURL(file);

    const result: UploadResult = {
      id,
      url,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    };
    this.files.set(id, result);
    return result;
  }

  async deleteFile(id: string): Promise<void> {
    const existing = this.files.get(id);
    if (existing) {
      URL.revokeObjectURL(existing.url);
      this.files.delete(id);
    }
  }

  async getFileUrl(id: string): Promise<string> {
    const existing = this.files.get(id);
    if (!existing) {
      throw new Error("File not found");
    }
    return existing.url;
  }
}
