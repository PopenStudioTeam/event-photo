"use client";

import { useRef, useState, type ReactNode } from "react";
import { Pencil } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COVER_ACCEPT, validateCoverFile } from "@/lib/cover-file";
import {
  CoverUploadError,
  uploadEventCover,
  type EventWithCover,
} from "@/lib/upload-event-cover";
import { reportApiError, showErrorAlert, showSuccessToast } from "@/lib/api";
import { cn } from "@/lib/utils";

type CoverUploadFieldProps = {
  slug: string;
  disabled?: boolean;
  onUploaded: (updated: EventWithCover) => void;
  className?: string;
  children: ReactNode;
};

export function CoverUploadField({
  slug,
  disabled = false,
  onUploaded,
  className,
  children,
}: CoverUploadFieldProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const openPicker = () => {
    if (disabled || uploading) return;
    inputRef.current?.click();
  };

  const handleFile = async (file: File | undefined) => {
    if (!file || uploading || disabled) return;

    const validationError = validateCoverFile(file);
    if (validationError) {
      showErrorAlert(validationError);
      return;
    }

    setUploading(true);
    try {
      const updated = await uploadEventCover(slug, file);
      onUploaded(updated);
      showSuccessToast("Cover uploaded", "Your event cover photo was updated.");
    } catch (err) {
      if (err instanceof CoverUploadError) {
        showErrorAlert(err.message);
      } else {
        reportApiError(err, "Failed to upload cover image");
      }
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className={cn("relative overflow-hidden", className)}>
      {children}

      <input
        ref={inputRef}
        type="file"
        accept={COVER_ACCEPT}
        className="sr-only"
        disabled={disabled || uploading}
        onChange={(event) => handleFile(event.target.files?.[0])}
      />

      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-20 bg-gradient-to-t from-black/55 to-transparent" />

      <Button
        type="button"
        size="sm"
        className="absolute bottom-3 right-3 z-20 rounded-xl bg-primary text-primary-foreground shadow-lg hover:bg-[var(--primary-hover)]"
        disabled={disabled || uploading}
        onClick={openPicker}
      >
        <Pencil />
        {uploading ? "Uploading…" : "Upload Cover Photo"}
      </Button>
    </div>
  );
}
