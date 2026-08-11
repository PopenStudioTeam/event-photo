import { cn } from "@/lib/utils";
import { ImageIcon, VideoIcon } from "lucide-react";

export function AssetPlaceholder({
  label,
  type = "image",
  className,
}: {
  label: string;
  type?: "image" | "video";
  className?: string;
}) {
  const Icon = type === "video" ? VideoIcon : ImageIcon;

  return (
    <div
      className={cn(
        "flex min-h-[220px] w-full flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-muted/40 p-6 text-center",
        className
      )}
    >
      <Icon className="h-6 w-6 text-muted-foreground" strokeWidth={1.5} />
      <span className="text-xs font-medium leading-5 text-muted-foreground">
        {label}
      </span>
    </div>
  );
}
