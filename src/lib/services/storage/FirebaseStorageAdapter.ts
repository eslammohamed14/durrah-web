'use client';

/**
 * Firebase Storage adapter implementing IFileStorageService.
 * Handles file uploads, deletions, and URL retrieval via Firebase Storage.
 *
 * Enforces:
 * - Allowed types: JPEG, PNG, WebP
 * - Max file size: 5MB
 */

import {
  getStorage,
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  type FirebaseStorage,
} from 'firebase/storage';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import {
  type IFileStorageService,
  type UploadResult,
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from './IFileStorageService';

interface FirebaseConfig {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId?: string;
  appId?: string;
}

function validateFile(file: File): void {
  if (!ALLOWED_MIME_TYPES.includes(file.type as (typeof ALLOWED_MIME_TYPES)[number])) {
    throw new Error(
      `Invalid file type "${file.type}". Allowed types: JPEG, PNG, WebP.`
    );
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeMB = (file.size / (1024 * 1024)).toFixed(2);
    throw new Error(
      `File size ${sizeMB}MB exceeds the 5MB limit.`
    );
  }
}

function generateFileId(path: string, fileName: string): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).slice(2, 8);
  const sanitized = fileName.replace(/[^a-zA-Z0-9._-]/g, '_');
  return `${path}/${timestamp}-${random}-${sanitized}`;
}

export class FirebaseStorageAdapter implements IFileStorageService {
  private storage: FirebaseStorage;

  constructor(config: FirebaseConfig) {
    const app: FirebaseApp = getApps().length ? getApp() : initializeApp(config);
    this.storage = getStorage(app);
  }

  async uploadFile(file: File, path: string): Promise<UploadResult> {
    validateFile(file);

    const fileId = generateFileId(path, file.name);
    const storageRef = ref(this.storage, fileId);

    await new Promise<void>((resolve, reject) => {
      const task = uploadBytesResumable(storageRef, file, {
        contentType: file.type,
      });
      task.on('state_changed', null, reject, resolve);
    });

    const url = await getDownloadURL(storageRef);

    return {
      id: fileId,
      url,
      fileName: file.name,
      size: file.size,
      mimeType: file.type,
    };
  }

  async deleteFile(id: string): Promise<void> {
    const storageRef = ref(this.storage, id);
    await deleteObject(storageRef);
  }

  async getFileUrl(id: string): Promise<string> {
    const storageRef = ref(this.storage, id);
    return getDownloadURL(storageRef);
  }
}
