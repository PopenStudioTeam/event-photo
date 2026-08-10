"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Images, Link2, MonitorPlay, SlidersHorizontal } from "lucide-react";

type EventWelcomeDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

const FEATURES = [
  {
    icon: MonitorPlay,
    text: "Access your Digital Album and Live Photo Wall (slideshow).",
  },
  {
    icon: Link2,
    text: "Share your album with guests via link or printed QR code.",
  },
  {
    icon: Images,
    text: "Manage uploads — upload, delete, download, or review content.",
  },
  {
    icon: SlidersHorizontal,
    text: "Customize event settings, branding, moderation, and more.",
  },
];

export function EventWelcomeDialog({ open, onOpenChange }: EventWelcomeDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl">
        <DialogHeader>
          <DialogTitle className="font-heading text-xl">
            Your event is all set!
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 pt-1 text-sm">
          <p className="text-muted-foreground">
            Waiting just behind this message is your dashboard, where you can:
          </p>

          <ul className="space-y-3">
            {FEATURES.map(({ icon: Icon, text }) => (
              <li key={text} className="flex gap-3">
                <span className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                  <Icon className="h-4 w-4" />
                </span>
                <span className="leading-relaxed">{text}</span>
              </li>
            ))}
          </ul>

          <p className="text-xs text-muted-foreground">
            Need help? We&apos;re always available through the chat bubble (bottom
            right).
          </p>
        </div>

        <div className="flex justify-end pt-2">
          <Button className="rounded-xl" onClick={() => onOpenChange(false)}>
            Got It
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
