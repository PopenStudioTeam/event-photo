"use client";

import { useEffect, useState } from "react";
import { apiFetch, reportApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

type GuestMediaItem = {
  id: string;
  type: "photo" | "video";
  mimeType: string;
  caption: string | null;
  url: string;
  status: "pending" | "approved" | "rejected";
};

type GuestMyUploadsDialogProps = {
  slug: string;
  guestId: string;
  refreshKey?: number;
};

const statusLabel = {
  pending: "Pending review",
  approved: "In gallery",
  rejected: "Rejected",
} as const;

const statusClass = {
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-200",
  approved: "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200",
  rejected: "bg-red-100 text-red-800 dark:bg-red-950 dark:text-red-200",
} as const;

export function GuestMyUploadsDialog({
  slug,
  guestId,
  refreshKey = 0,
}: GuestMyUploadsDialogProps) {
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState<GuestMediaItem[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;

    const load = async () => {
      setLoading(true);
      try {
        const res = await apiFetch(
          `/e/${slug}/my-media?guestId=${encodeURIComponent(guestId)}`
        );
        setItems((res as { items: GuestMediaItem[] }).items);
      } catch (err) {
        console.error(err);
        reportApiError(err, "Failed to load your uploads.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [slug, guestId, refreshKey, open]);

  return (
    <>
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="border-neutral-600 bg-neutral-900 text-white hover:bg-neutral-800"
        onClick={() => setOpen(true)}
      >
        My uploads
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex max-h-[90vh] w-[min(96vw,720px)] max-w-[min(96vw,720px)] flex-col overflow-hidden sm:max-w-[min(96vw,720px)]">
          <DialogHeader>
            <DialogTitle className="text-base">My uploads</DialogTitle>
          </DialogHeader>

          <div className="min-h-0 flex-1 overflow-y-auto pr-1">
            {loading ? (
              <div className="text-sm text-muted-foreground">Loading your uploads…</div>
            ) : items.length === 0 ? (
              <div className="text-sm text-muted-foreground">
                You have not uploaded anything yet.
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {items.map((item) => {
                  const isPhoto =
                    item.type === "photo" || item.mimeType.startsWith("image/");

                  return (
                    <div
                      key={item.id}
                      className="overflow-hidden rounded-lg border bg-muted"
                    >
                      {isPhoto ? (
                        <img
                          src={item.url}
                          alt={item.caption ?? "Your upload"}
                          className="h-32 w-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="h-32 w-full object-cover"
                          muted
                          playsInline
                        />
                      )}
                      <div className="space-y-1 p-2">
                        <span
                          className={`inline-flex rounded-full px-2 py-0.5 text-[10px] font-medium ${statusClass[item.status]}`}
                        >
                          {statusLabel[item.status]}
                        </span>
                        {item.caption && (
                          <p className="truncate text-[10px] text-muted-foreground sm:text-xs">
                            {item.caption}
                          </p>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <DialogFooter className="border-t pt-3">
            <Button type="button" variant="outline" size="sm" onClick={() => setOpen(false)}>
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
