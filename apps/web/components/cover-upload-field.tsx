"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileDropzone } from "@/components/file-dropzone";
import { COVER_ACCEPT, COVER_ACCEPT_LABEL, validateCoverFile } from "@/lib/cover-file";
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
};

export function CoverUploadField({
  slug,
  disabled = false,
  onUploaded,
  className,
}: CoverUploadFieldProps) {
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!pendingFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(pendingFile);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [pendingFile]);

  const handleFiles = (files: File[]) => {
    const file = files[0];
    if (!file) return;

    const validationError = validateCoverFile(file);
    if (validationError) {
      showErrorAlert(validationError);
      return;
    }

    setPendingFile(file);
  };

  const handleUpload = async () => {
    if (!pendingFile || uploading || disabled) return;

    setUploading(true);
    try {
      const updated = await uploadEventCover(slug, pendingFile);
      onUploaded(updated);
      setPendingFile(null);
      showSuccessToast("Cover uploaded", "Your event cover photo was updated.");
    } catch (err) {
      if (err instanceof CoverUploadError) {
        showErrorAlert(err.message);
      } else {
        reportApiError(err, "Failed to upload cover image");
      }
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn("space-y-3", className)}>
      <FileDropzone
        accept={COVER_ACCEPT}
        multiple={false}
        disabled={disabled || uploading}
        prompt="Drop your cover image here, or"
        browseLabel="browse"
        hint={`Supports: ${COVER_ACCEPT_LABEL} (max 5 MB)`}
        onFiles={handleFiles}
      />

      {pendingFile && previewUrl ? (
        <div className="flex items-center gap-3 rounded-xl border bg-muted/40 p-3">
          <img
            src={previewUrl}
            alt="Cover preview"
            className="h-16 w-24 shrink-0 rounded-lg object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium">{pendingFile.name}</p>
            <p className="text-xs text-muted-foreground">Ready to upload</p>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={uploading}
            onClick={() => setPendingFile(null)}
          >
            Clear
          </Button>
        </div>
      ) : null}

      <div className="flex justify-end">
        <Button
          type="button"
          size="sm"
          variant="secondary"
          className="rounded-xl"
          disabled={!pendingFile || uploading || disabled}
          onClick={handleUpload}
        >
          {uploading ? "Uploading…" : "Upload cover"}
        </Button>
      </div>
    </div>
  );
}
