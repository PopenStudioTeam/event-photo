"use client";

import { useParams, useRouter } from "next/navigation";
import { EventSlideshowOverlay } from "@/components/event-slideshow-overlay";

export default function EventSlideshowPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const handleClose = () => {
    if (typeof window !== "undefined" && window.history.length > 1) {
      router.back();
    } else if (slug) {
      router.push(`/events/${slug}`);
    } else {
      router.push("/events");
    }
  };

  return (
    <EventSlideshowOverlay
      open
      onClose={handleClose}
      mediaPath={slug ? `/events/${slug}/media` : ""}
      eventName="Event"
    />
  );
}
