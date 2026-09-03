"use client";

import { useRef, useState, type DragEvent } from "react";
import { ImageIcon } from "@phosphor-icons/react";
import { cn } from "@/lib/utils";

type FileDropzoneProps = {
  accept?: string;
  multiple?: boolean;
  capture?: "user" | "environment";
  disabled?: boolean;
  prompt?: string;
  browseLabel?: string;
  hint?: string;
  onFiles: (files: File[]) => void;
};

export function FileDropzone({
  accept = "image/*,video/*",
  multiple = true,
  capture,
  disabled = false,
  prompt = "Drop your image here, or",
  browseLabel = "browse",
  hint = "Supports: JPG, JPEG2000, PNG",
  onFiles,
}: FileDropzoneProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  const emitFiles = (list: FileList | File[] | null) => {
    const files = Array.from(list ?? []);
    if (!files.length) return;
    onFiles(files);
    if (inputRef.current) inputRef.current.value = "";
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (disabled) return;
    setDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragging(false);
    if (disabled) return;
    emitFiles(e.dataTransfer.files);
  };

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled}
      onClick={() => {
        if (!disabled) inputRef.current?.click();
      }}
      onKeyDown={(e) => {
        if (disabled) return;
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          inputRef.current?.click();
        }
      }}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-4 py-8 text-center transition-colors",
        dragging
          ? "border-primary bg-primary/5"
          : "border-border bg-background hover:border-primary/50 hover:bg-muted/30",
        disabled && "pointer-events-none cursor-not-allowed opacity-50"
      )}
    >
      <ImageIcon
        className="mb-3 size-10 text-primary"
        weight="duotone"
        aria-hidden
      />
      <p className="text-sm font-medium text-foreground">
        {prompt}{" "}
        <span className="text-primary underline-offset-2 hover:underline">
          {browseLabel}
        </span>
      </p>
      <p className="mt-1 text-xs text-muted-foreground">{hint}</p>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        capture={capture}
        disabled={disabled}
        className="sr-only"
        onClick={(e) => e.stopPropagation()}
        onChange={(e) => emitFiles(e.target.files)}
      />
    </div>
  );
}
