import Link from "next/link";
import { ArrowRightLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AssetPlaceholder } from "@/components/marketing/asset-placeholder";

export function SwitchHero() {
  return (
    <section className="mx-auto grid max-w-7xl gap-14 px-4 pb-16 pt-16 sm:px-6 sm:pt-24 lg:grid-cols-[0.9fr_1.1fr] lg:items-center lg:px-8 lg:pb-24">
      <div>
        <h1 className="max-w-xl text-5xl leading-[0.98] sm:text-6xl">
          The easiest alternative to any other photo-sharing app.
        </h1>
        <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg">
          Switching from another guest photo-sharing tool? Event Photo gives
          you the same core idea — a QR code, guest uploads, and a live
          slideshow — with simpler, one-time pricing.
        </p>
        <div className="mt-8">
          <Link href="/dashboard">
            <Button
              size="lg"
              className="rounded-full bg-primary px-7 text-primary-foreground hover:bg-[var(--primary-hover)]"
            >
              Create your event
              <span className="ml-2">↗</span>
            </Button>
          </Link>
          <div className="mt-3 text-xs text-muted-foreground">
            It&apos;s free and takes about 2 minutes.
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <AssetPlaceholder
          label="Screenshot: your current app's upload or login screen"
          className="min-h-[280px] flex-1"
        />
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-transform duration-500 hover:rotate-180">
          <ArrowRightLeft className="h-5 w-5" />
        </div>
        <AssetPlaceholder
          label="Photo/video: Event Photo's guest upload screen with real event photos"
          className="min-h-[280px] flex-1"
        />
      </div>
    </section>
  );
}
