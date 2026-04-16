"use client";

/**
 * MaintenanceTicketForm — create a new maintenance ticket with image uploads.
 *
 * - Category dropdown: HVAC, Plumbing, Electrical, Appliances, Structural, Other
 * - Priority selector: Low, Medium, High, Emergency
 * - Title + Description fields
 * - Image upload with preview (max 5 images, 5MB each, JPEG/PNG/WebP)
 * - Full field validation before submit
 *
 * Requirements: 12.1, 12.2, 12.3, 12.4, 32.1, 32.2, 32.3, 32.4
 */

import React, { useState, useRef, useCallback } from "react";
import type { TicketCategory, TicketPriority } from "@/lib/types";
import type { ImagePreview } from "../types";
import { useLocale } from "@/lib/contexts/LocaleContext";
import { Button } from "@/components/ui/Button";
import {
  ALLOWED_MIME_TYPES,
  MAX_FILE_SIZE_BYTES,
} from "@/lib/services/storage/IFileStorageService";

// ── Constants ─────────────────────────────────────────────────────────────────

const MAX_IMAGES = 5;

const CATEGORIES: TicketCategory[] = [
  "hvac",
  "plumbing",
  "electrical",
  "appliances",
  "structural",
  "other",
];

const PRIORITIES: TicketPriority[] = ["low", "medium", "high", "emergency"];

const PRIORITY_COLORS: Record<TicketPriority, string> = {
  low: "bg-green-50 border-green-300 text-green-800 data-[selected=true]:bg-green-100 data-[selected=true]:border-green-500 data-[selected=true]:ring-2 data-[selected=true]:ring-green-400",
  medium:
    "bg-yellow-50 border-yellow-300 text-yellow-800 data-[selected=true]:bg-yellow-100 data-[selected=true]:border-yellow-500 data-[selected=true]:ring-2 data-[selected=true]:ring-yellow-400",
  high: "bg-orange-50 border-orange-300 text-orange-800 data-[selected=true]:bg-orange-100 data-[selected=true]:border-orange-500 data-[selected=true]:ring-2 data-[selected=true]:ring-orange-400",
  emergency:
    "bg-red-50 border-red-300 text-red-800 data-[selected=true]:bg-red-100 data-[selected=true]:border-red-500 data-[selected=true]:ring-2 data-[selected=true]:ring-red-400",
};

// ── Types ─────────────────────────────────────────────────────────────────────

export interface MaintenanceTicketFormData {
  propertyId: string;
  title: string;
  category: TicketCategory;
  priority: TicketPriority;
  description: string;
  imageUrls: string[];
}

export interface MaintenanceTicketFormProps {
  propertyId: string;
  onSubmit: (data: MaintenanceTicketFormData) => Promise<void>;
  /** Optional: inject storage service for image uploads (uses mock if omitted) */
  onUploadImage?: (file: File) => Promise<string>;
  className?: string;
}

// ── Field Error ───────────────────────────────────────────────────────────────

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p role="alert" className="mt-1 text-xs text-red-600">
      {message}
    </p>
  );
}

// ── ImageUploadArea ───────────────────────────────────────────────────────────

interface ImageUploadAreaProps {
  images: ImagePreview[];
  onAddFiles: (files: FileList) => void;
  onRemove: (localId: string) => void;
  disabled?: boolean;
  error?: string;
}

function ImageUploadArea({
  images,
  onAddFiles,
  onRemove,
  disabled,
  error,
}: ImageUploadAreaProps) {
  const { t } = useLocale();
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragOver, setDragOver] = useState(false);

  const canAdd = images.length < MAX_IMAGES;

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragOver(false);
      if (!canAdd || disabled) return;
      if (e.dataTransfer.files.length > 0) {
        onAddFiles(e.dataTransfer.files);
      }
    },
    [canAdd, disabled, onAddFiles],
  );

  return (
    <div>
      <label className="mb-1.5 block text-sm font-medium text-gray-700">
        {t("maintenance.attachPhotos")}
        <span className="ms-1 text-xs font-normal text-gray-400">
          ({t("validation.maxFiles", { max: MAX_IMAGES })},{" "}
          {t("validation.fileTooLarge")})
        </span>
      </label>

      {/* Drop zone */}
      {canAdd && !disabled && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          onDragOver={(e) => {
            e.preventDefault();
            setDragOver(true);
          }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          aria-label={t("maintenance.attachPhotos")}
          className={[
            "flex w-full cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed py-8 transition-colors",
            dragOver
              ? "border-blue-400 bg-blue-50"
              : "border-gray-300 bg-gray-50 hover:border-blue-300 hover:bg-blue-50",
          ].join(" ")}
        >
          <svg
            className="mb-2 h-8 w-8 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5"
            />
          </svg>
          <span className="text-sm text-gray-500">
            {t("maintenance.attachPhotos")}
          </span>
          <span className="mt-0.5 text-xs text-gray-400">
            JPEG · PNG · WebP
          </span>
        </button>
      )}

      <input
        ref={inputRef}
        type="file"
        accept={ALLOWED_MIME_TYPES.join(",")}
        multiple
        className="sr-only"
        onChange={(e) => {
          if (e.target.files) onAddFiles(e.target.files);
          e.target.value = "";
        }}
        aria-hidden="true"
      />

      {/* Previews */}
      {images.length > 0 && (
        <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-5">
          {images.map((img) => (
            <div key={img.localId} className="relative aspect-square">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={img.previewUrl}
                alt=""
                className="h-full w-full rounded-lg object-cover"
              />

              {/* Uploading overlay */}
              {img.uploading && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-black/40">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8v8H4z"
                    />
                  </svg>
                </div>
              )}

              {/* Error overlay */}
              {img.error && (
                <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-red-500/70">
                  <svg
                    className="h-5 w-5 text-white"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}

              {/* Remove button */}
              {!img.uploading && (
                <button
                  type="button"
                  onClick={() => onRemove(img.localId)}
                  aria-label={`Remove image`}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-white shadow-sm hover:bg-red-700"
                >
                  <svg
                    className="h-3 w-3"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2.5}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              )}
            </div>
          ))}
        </div>
      )}

      <FieldError message={error} />
    </div>
  );
}

// ── Validation ────────────────────────────────────────────────────────────────

interface FormErrors {
  title?: string;
  category?: string;
  priority?: string;
  description?: string;
  images?: string;
}

function validate(
  title: string,
  category: string,
  priority: string,
  description: string,
  t: (key: string, params?: Record<string, string | number>) => string,
): FormErrors {
  const errs: FormErrors = {};
  if (!title.trim()) errs.title = t("validation.required");
  if (title.trim().length > 100)
    errs.title = t("validation.maxLength", { max: 100 });
  if (!category) errs.category = t("validation.required");
  if (!priority) errs.priority = t("validation.required");
  if (!description.trim()) errs.description = t("validation.required");
  if (description.trim().length < 10)
    errs.description = t("validation.minLength", { min: 10 });
  return errs;
}

// ── Mock upload (used when no uploadImage prop provided) ──────────────────────

async function mockUpload(file: File): Promise<string> {
  await new Promise((r) => setTimeout(r, 400 + Math.random() * 400));
  return URL.createObjectURL(file);
}

function validateFile(
  file: File,
  t: (key: string) => string,
): string | undefined {
  if (
    !ALLOWED_MIME_TYPES.includes(
      file.type as (typeof ALLOWED_MIME_TYPES)[number],
    )
  ) {
    return t("validation.invalidFileType");
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return t("validation.fileTooLarge");
  }
  return undefined;
}

// ── Main Component ─────────────────────────────────────────────────────────────

export function MaintenanceTicketForm({
  propertyId,
  onSubmit,
  onUploadImage,
  className = "",
}: MaintenanceTicketFormProps) {
  const { t } = useLocale();

  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<TicketCategory | "">("");
  const [priority, setPriority] = useState<TicketPriority | "">("");
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<ImagePreview[]>([]);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const uploadFn = onUploadImage ?? mockUpload;

  // ── Image handlers ──────────────────────────────────────────────────────────

  const handleAddFiles = useCallback(
    (files: FileList) => {
      const remaining = MAX_IMAGES - images.length;
      const toAdd = Array.from(files).slice(0, remaining);

      const newPreviews: ImagePreview[] = [];

      for (const file of toAdd) {
        const fileError = validateFile(file, t);
        const localId = `img-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const preview: ImagePreview = {
          localId,
          previewUrl: URL.createObjectURL(file),
          file,
          uploading: !fileError,
          error: fileError,
        };
        newPreviews.push(preview);
      }

      setImages((prev) => [...prev, ...newPreviews]);

      // Start uploads for valid files
      for (const preview of newPreviews) {
        if (!preview.error) {
          uploadFn(preview.file)
            .then((url) => {
              setImages((prev) =>
                prev.map((img) =>
                  img.localId === preview.localId
                    ? { ...img, uploadedUrl: url, uploading: false }
                    : img,
                ),
              );
            })
            .catch(() => {
              setImages((prev) =>
                prev.map((img) =>
                  img.localId === preview.localId
                    ? {
                        ...img,
                        uploading: false,
                        error: t("errors.uploadFailed"),
                      }
                    : img,
                ),
              );
            });
        }
      }
    },
    [images.length, uploadFn, t],
  );

  const handleRemoveImage = useCallback((localId: string) => {
    setImages((prev) => {
      const removed = prev.find((img) => img.localId === localId);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return prev.filter((img) => img.localId !== localId);
    });
  }, []);

  // ── Submit ──────────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errs = validate(title, category, priority, description, t);

    const pendingUploads = images.filter((img) => img.uploading);
    if (pendingUploads.length > 0) {
      errs.images = t("common.loading");
    }

    const failedUploads = images.filter((img) => img.error);
    if (failedUploads.length > 0) {
      errs.images = t("errors.uploadFailed");
    }

    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setErrors({});
    setSubmitError(null);
    setSubmitting(true);

    try {
      const imageUrls = images
        .filter((img) => img.uploadedUrl)
        .map((img) => img.uploadedUrl as string);

      await onSubmit({
        propertyId,
        title: title.trim(),
        category: category as TicketCategory,
        priority: priority as TicketPriority,
        description: description.trim(),
        imageUrls,
      });
    } catch (err) {
      setSubmitError(err instanceof Error ? err.message : t("errors.generic"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className={`space-y-5 ${className}`}
    >
      {/* Title */}
      <div>
        <label
          htmlFor="ticket-title"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("maintenance.ticketDetails")}
          <span className="ms-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <input
          id="ticket-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder={t("maintenance.ticketDetails")}
          maxLength={100}
          aria-invalid={!!errors.title}
          aria-describedby={errors.title ? "title-error" : undefined}
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            errors.title
              ? "border-red-400 bg-red-50 focus:ring-red-400 focus:border-red-400"
              : "border-gray-300 bg-white",
          ].join(" ")}
        />
        <FieldError message={errors.title} />
      </div>

      {/* Category */}
      <div>
        <label
          htmlFor="ticket-category"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("maintenance.category")}
          <span className="ms-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <select
          id="ticket-category"
          value={category}
          onChange={(e) => setCategory(e.target.value as TicketCategory)}
          aria-invalid={!!errors.category}
          className={[
            "w-full rounded-lg border px-3 py-2 text-sm transition-colors outline-none",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            errors.category
              ? "border-red-400 bg-red-50"
              : "border-gray-300 bg-white",
          ].join(" ")}
        >
          <option value="">{t("maintenance.category")}</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {t(`maintenance.category_${cat}`)}
            </option>
          ))}
        </select>
        <FieldError message={errors.category} />
      </div>

      {/* Priority */}
      <fieldset>
        <legend className="mb-2 block text-sm font-medium text-gray-700">
          {t("maintenance.priority")}
          <span className="ms-1 text-red-500" aria-hidden="true">
            *
          </span>
        </legend>
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-4" role="group">
          {PRIORITIES.map((p) => (
            <button
              key={p}
              type="button"
              data-selected={priority === p}
              onClick={() => setPriority(p)}
              aria-pressed={priority === p}
              className={[
                "rounded-lg border px-3 py-2 text-xs font-medium transition-all",
                PRIORITY_COLORS[p],
              ].join(" ")}
            >
              {t(`maintenance.priority_${p}`)}
            </button>
          ))}
        </div>
        <FieldError message={errors.priority} />
      </fieldset>

      {/* Description */}
      <div>
        <label
          htmlFor="ticket-description"
          className="mb-1.5 block text-sm font-medium text-gray-700"
        >
          {t("maintenance.description")}
          <span className="ms-1 text-red-500" aria-hidden="true">
            *
          </span>
        </label>
        <textarea
          id="ticket-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          maxLength={1000}
          aria-invalid={!!errors.description}
          className={[
            "w-full resize-none rounded-lg border px-3 py-2 text-sm transition-colors outline-none",
            "focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
            errors.description
              ? "border-red-400 bg-red-50"
              : "border-gray-300 bg-white",
          ].join(" ")}
        />
        <div className="mt-0.5 flex items-start justify-between">
          <FieldError message={errors.description} />
          <span className="ms-auto text-xs text-gray-400">
            {description.length}/1000
          </span>
        </div>
      </div>

      {/* Image upload */}
      <ImageUploadArea
        images={images}
        onAddFiles={handleAddFiles}
        onRemove={handleRemoveImage}
        disabled={submitting}
        error={errors.images}
      />

      {/* Submit error */}
      {submitError && (
        <div
          role="alert"
          className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
        >
          {submitError}
        </div>
      )}

      {/* Submit */}
      <Button
        type="submit"
        variant="primary"
        size="lg"
        className="w-full"
        loading={submitting}
        disabled={submitting || images.some((img) => img.uploading)}
      >
        {t("maintenance.submitTicket")}
      </Button>
    </form>
  );
}
