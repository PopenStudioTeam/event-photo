import { apiFetch } from "@/lib/api";

type EventWithCover = {
  slug: string;
  coverImageUrl: string | null;
  coverImageKey: string | null;
  coverOverlay: "none" | "gradient";
};

export async function uploadEventCover(slug: string, file: File) {
  const contentType = file.type || "image/jpeg";
  const fileSize = file.size;

  const presign = await apiFetch<{ uploadUrl: string; key: string }>(
    `/events/${slug}/cover-url`,
    {
      method: "POST",
      body: JSON.stringify({ contentType, fileSize }),
    }
  );

  const putRes = await fetch(presign.uploadUrl, {
    method: "PUT",
    headers: { "Content-Type": contentType },
    body: file,
  });

  if (!putRes.ok) {
    throw new Error("Upload to storage failed");
  }

  await apiFetch(`/events/${slug}`, {
    method: "PATCH",
    body: JSON.stringify({ coverImageKey: presign.key }),
  });

  const events = (await apiFetch("/events")) as EventWithCover[];
  const updated = events.find((event) => event.slug === slug);

  if (!updated) {
    throw new Error("Event not found after cover upload");
  }

  return updated;
}
