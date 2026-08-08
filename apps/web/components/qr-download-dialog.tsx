"use client";

import { CheckCircleIcon } from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  formatQrCardDate,
  QR_LAYOUT_CONFIG,
  QR_LAYOUT_ORDER,
  resolveQrGreeting,
  type QrDownloadOptions,
  type QrLayout,
} from "@/lib/qr-card-renderer";
import { cn } from "@/lib/utils";

export type { QrLayout, QrDownloadOptions };

type QrDownloadDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  eventName: string;
  eventDate: string | null;
  qrImageUrl: string;
  onDownload: (options: QrDownloadOptions) => Promise<void> | void;
};

const layoutPreviewStyles: Record<
  QrLayout,
  {
    card: string;
    label: string;
    divider: string;
    title: string;
    date: string;
    message: string;
    frame: string;
    titleFont: string;
    messageFont: string;
  }
> = {
  warm: {
    card: "bg-gradient-to-br from-rose-200 via-orange-100 to-amber-100 text-[#2a1b1a]",
    label: "text-[#8f5a63]",
    divider: "bg-rose-400",
    title: "text-[#2a1b1a]",
    date: "text-[#6f4d52]",
    message: "text-[#4a3135]",
    frame: "border-rose-300/40",
    titleFont: "var(--font-display)",
    messageFont: "var(--font-script)",
  },
  clean: {
    card: "bg-white text-[#1f2937] border border-neutral-200",
    label: "text-neutral-500",
    divider: "bg-neutral-900",
    title: "text-[#111827]",
    date: "text-[#4b5563]",
    message: "text-[#374151]",
    frame: "border-neutral-200",
    titleFont: "var(--font-display)",
    messageFont: "var(--font-body)",
  },
};

function LayoutPreview({
  layout,
  eventName,
  eventDate,
  qrImageUrl,
  greeting,
  selected,
}: {
  layout: QrLayout;
  eventName: string;
  eventDate: string | null;
  qrImageUrl: string;
  greeting: string;
  selected: boolean;
}) {
  const styles = layoutPreviewStyles[layout];
  const resolvedGreeting = resolveQrGreeting(layout, greeting);

  return (
    <div
      className={cn(
        "relative overflow-hidden rounded-[1.35rem] border-2 p-4 shadow-sm transition",
        styles.card,
        styles.frame,
        selected && "ring-2 ring-primary ring-offset-2 ring-offset-background"
      )}
    >
      {selected ? (
        <div className="absolute top-3 right-3 flex items-center gap-1 rounded-full bg-primary px-2 py-1 text-[10px] font-medium text-primary-foreground">
          <CheckCircleIcon className="size-3.5" weight="fill" />
          Selected
        </div>
      ) : null}

      {layout === "warm" ? (
        <>
          <div
            className={cn(
              "text-[9px] font-semibold uppercase tracking-[0.22em]",
              styles.label
            )}
            style={{ fontFamily: styles.messageFont }}
          >
            Event photo sharing
          </div>

          <div className="my-3 flex items-center justify-center gap-2">
            <span className={cn("h-px w-10 opacity-70", styles.divider)} />
            <span className={cn("size-1.5 rounded-full", styles.divider)} />
            <span className={cn("h-px w-10 opacity-70", styles.divider)} />
          </div>
        </>
      ) : null}

      <div
        className={cn(
          "text-center text-lg leading-tight font-semibold",
          styles.title,
          layout === "clean" && "mt-1"
        )}
        style={{ fontFamily: styles.titleFont }}
      >
        {eventName}
      </div>

      <div
        className={cn(
          "mt-2 text-center text-sm",
          styles.date,
          layout === "warm" && "italic"
        )}
        style={{ fontFamily: layout === "warm" ? styles.messageFont : styles.titleFont }}
      >
        {formatQrCardDate(eventDate)}
      </div>

      <div className="mt-4 flex items-center justify-center">
        <div className="rounded-2xl bg-white/95 p-2 shadow-md">
          <img
            src={qrImageUrl}
            alt={`${eventName} QR code preview`}
            className="size-20 rounded-xl object-contain"
          />
        </div>
      </div>

      <div
        className={cn(
          "mt-4 text-center text-xs leading-5",
          styles.message,
          layout === "warm" && "italic"
        )}
        style={{ fontFamily: styles.messageFont }}
      >
        {resolvedGreeting}
      </div>
    </div>
  );
}

export function QrDownloadDialog({
  open,
  onOpenChange,
  eventName,
  eventDate,
  qrImageUrl,
  onDownload,
}: QrDownloadDialogProps) {
  const [selectedLayout, setSelectedLayout] = useState<QrLayout>("warm");
  const [greeting, setGreeting] = useState("");
  const [downloading, setDownloading] = useState(false);

  useEffect(() => {
    if (open) {
      setSelectedLayout("warm");
      setGreeting(QR_LAYOUT_CONFIG.warm.defaultGreeting);
    }
  }, [open]);

  const handleLayoutChange = (layout: QrLayout) => {
    setSelectedLayout(layout);
    const currentDefault = QR_LAYOUT_CONFIG[selectedLayout].defaultGreeting;
    if (!greeting.trim() || greeting.trim() === currentDefault) {
      setGreeting(QR_LAYOUT_CONFIG[layout].defaultGreeting);
    }
  };

  const handleResetGreeting = () => {
    setGreeting(QR_LAYOUT_CONFIG[selectedLayout].defaultGreeting);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      await onDownload({
        layout: selectedLayout,
        greeting,
      });
    } finally {
      setDownloading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[calc(100vh-2rem)] max-w-[calc(100vw-1rem)] flex-col overflow-hidden rounded-3xl p-0 sm:max-w-3xl">
        <DialogHeader className="shrink-0 border-b px-4 py-4 sm:px-6">
          <DialogTitle>Download QR card</DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 space-y-5 overflow-y-auto px-4 py-5 sm:px-6">
          <p className="text-sm text-muted-foreground">
            Choose a layout, customize the greeting message, then download a
            printable QR card with your event details.
          </p>

          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <label htmlFor="qr-greeting" className="text-sm font-medium">
                Greeting message
              </label>
              <button
                type="button"
                onClick={handleResetGreeting}
                className="text-xs text-muted-foreground underline-offset-2 hover:text-foreground hover:underline"
              >
                Reset to default
              </button>
            </div>
            <Input
              id="qr-greeting"
              value={greeting}
              onChange={(event) => setGreeting(event.target.value)}
              placeholder={QR_LAYOUT_CONFIG[selectedLayout].defaultGreeting}
              className="h-10"
            />
            <p className="text-xs text-muted-foreground">
              Leave blank to use the default for the selected layout.
            </p>
          </div>

          <div
            role="radiogroup"
            aria-label="QR card layout"
            className="grid gap-4 md:grid-cols-2"
          >
            {QR_LAYOUT_ORDER.map((layoutKey) => {
              const config = QR_LAYOUT_CONFIG[layoutKey];
              const isActive = selectedLayout === layoutKey;

              return (
                <label
                  key={layoutKey}
                  className={cn(
                    "cursor-pointer rounded-3xl border p-3 transition duration-300 hover:-translate-y-0.5 hover:shadow-md",
                    isActive
                      ? "border-primary bg-primary/5 shadow-lg"
                      : "border-border bg-background"
                  )}
                >
                  <input
                    type="radio"
                    name="qr-layout"
                    value={layoutKey}
                    checked={isActive}
                    onChange={() => handleLayoutChange(layoutKey)}
                    className="sr-only"
                  />

                  <LayoutPreview
                    layout={layoutKey}
                    eventName={eventName}
                    eventDate={eventDate}
                    qrImageUrl={qrImageUrl}
                    greeting={greeting}
                    selected={isActive}
                  />

                  <div className="mt-3 px-1 pb-1">
                    <div className="text-sm font-medium">{config.title}</div>
                    <div className="text-xs text-muted-foreground">
                      {config.description}
                    </div>
                  </div>
                </label>
              );
            })}
          </div>
        </div>

        <DialogFooter className="shrink-0 border-t px-4 py-4 sm:px-6">
          <div className="flex w-full flex-col gap-2 sm:flex-row sm:justify-between">
            <Button
              type="button"
              variant="outline"
              className="rounded-full"
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>

            <Button
              type="button"
              className="rounded-full"
              onClick={handleDownload}
              disabled={downloading}
            >
              {downloading
                ? "Preparing download…"
                : `Download ${QR_LAYOUT_CONFIG[selectedLayout].title}`}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
