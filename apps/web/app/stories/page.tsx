import type { Metadata } from "next";
import { PublicHeader } from "@/components/public-header";
import { SiteFooter } from "@/components/site-footer";
import { WallOfLove } from "@/components/wall-of-love";

export const metadata: Metadata = {
  title: "Wall of Love — Event Photo",
  description:
    "Real reviews from hosts who used Event Photo to collect guest photos and videos at their events.",
};

export default function StoriesPage() {
  return (
    <div className="min-h-screen overflow-hidden bg-background text-foreground">
      <PublicHeader />
      <main>
        <WallOfLove />
      </main>
      <SiteFooter />
    </div>
  );
}
