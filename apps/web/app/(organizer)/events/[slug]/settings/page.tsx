"use client";

import { useEffect, useState, FormEvent, type ChangeEvent } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  apiFetch,
  reportApiError,
  showErrorAlert,
  showSuccessToast,
} from "@/lib/api";
import { EVENT_CATEGORIES, type EventCategory } from "@/lib/event-categories";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { uploadEventCover } from "@/lib/upload-event-cover";
import {
  ImageIcon,
  Monitor,
  Shield,
  SlidersHorizontal,
  Users,
} from "lucide-react";

type EventRecord = {
  id: string;
  name: string;
  slug: string;
  category: EventCategory;
  eventDate: string | null;
  protected: boolean;
  hasPassword: boolean;
  primaryColor: string;
  backgroundVariant: "dark" | "light";
  povEnabled: boolean;
  povMaxPerGuest: number;
  povRevealAt: string | null;
  coverLayout: "banner" | "card";
  coverOverlay: "none" | "gradient";
  coverImageUrl: string | null;
  uploadsEnabled: boolean;
  plan: string;
};

const TABS = [
  { id: "general", label: "General", icon: SlidersHorizontal },
  { id: "appearance", label: "Appearance", icon: ImageIcon },
  { id: "photo-wall", label: "Photo Wall", icon: Monitor },
  { id: "moderation", label: "Moderation", icon: Shield },
  { id: "collaborators", label: "Collaborators", icon: Users },
] as const;

type TabId = (typeof TABS)[number]["id"];

export default function EventSettingsPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const slug = params?.slug as string;

  const initialTab = (searchParams.get("tab") as TabId) || "general";
  const [tab, setTab] = useState<TabId>(initialTab);
  const [event, setEvent] = useState<EventRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [formName, setFormName] = useState("");
  const [formDate, setFormDate] = useState("");
  const [formCategory, setFormCategory] = useState<EventCategory>("other");
  const [formProtected, setFormProtected] = useState(false);
  const [formPassword, setFormPassword] = useState("");
  const [formPrimaryColor, setFormPrimaryColor] = useState("#ffffff");
  const [formBackgroundVariant, setFormBackgroundVariant] =
    useState<"dark" | "light">("dark");
  const [formPOVEnabled, setFormPOVEnabled] = useState(false);
  const [formPovMaxPerGuest, setFormPovMaxPerGuest] = useState(0);
  const [formPovRevealAt, setFormPovRevealAt] = useState("");
  const [formCoverLayout, setFormCoverLayout] =
    useState<"banner" | "card">("banner");
  const [formCoverOverlay, setFormCoverOverlay] =
    useState<"none" | "gradient">("none");
  const [formUploadsEnabled, setFormUploadsEnabled] = useState(true);
  const [togglingUploads, setTogglingUploads] = useState(false);
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverUploading, setCoverUploading] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const events = (await apiFetch("/events")) as EventRecord[];
        const found = events.find((e) => e.slug === slug) ?? null;
        if (!found) {
          router.replace("/events");
          return;
        }
        setEvent(found);
        setFormName(found.name);
        setFormDate(found.eventDate ? found.eventDate.slice(0, 10) : "");
        setFormCategory(found.category ?? "other");
        setFormProtected(found.protected);
        setFormPrimaryColor(found.primaryColor ?? "#ffffff");
        setFormBackgroundVariant(found.backgroundVariant ?? "dark");
        setFormPOVEnabled(found.povEnabled ?? false);
        setFormPovMaxPerGuest(found.povMaxPerGuest ?? 0);
        setFormPovRevealAt(found.povRevealAt ? found.povRevealAt.slice(0, 10) : "");
        setFormCoverLayout(found.coverLayout ?? "banner");
        setFormCoverOverlay(found.coverOverlay ?? "none");
        setFormUploadsEnabled(found.uploadsEnabled ?? true);
      } catch (err) {
        reportApiError(err, "Failed to load event settings");
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [slug, router]);

  const handleSaveGeneral = async (e: FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (formProtected && !event.hasPassword && formPassword.length < 4) {
      showErrorAlert("Gallery password must be at least 4 characters");
      return;
    }

    const body: Record<string, unknown> = {
      name: formName.trim(),
      category: formCategory,
    };
    if (formDate) body.eventDate = new Date(formDate).toISOString();
    if (formProtected !== event.protected) body.protected = formProtected;
    if (formPassword) body.password = formPassword;

    setSaving(true);
    try {
      const updated = await apiFetch<EventRecord>(`/events/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setEvent((prev) => (prev ? { ...prev, ...updated } : updated));
      setFormPassword("");
      showSuccessToast("Settings saved", "Your general event settings were updated.");
    } catch (err) {
      reportApiError(err, "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleSaveAppearance = async (e: FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setSaving(true);
    try {
      const updated = await apiFetch<EventRecord>(`/events/${slug}`, {
        method: "PATCH",
        body: JSON.stringify({
          primaryColor: formPrimaryColor,
          backgroundVariant: formBackgroundVariant,
          coverLayout: formCoverLayout,
          coverOverlay: formCoverOverlay,
        }),
      });
      setEvent((prev) => (prev ? { ...prev, ...updated } : updated));
      showSuccessToast("Appearance saved", "Your gallery look and feel was updated.");
    } catch (err) {
      reportApiError(err, "Failed to save appearance");
    } finally {
      setSaving(false);
    }
  };

  const handleSavePhotoWall = async (e: FormEvent) => {
    e.preventDefault();
    if (!event) return;

    setSaving(true);
    try {
      const body: Record<string, unknown> = {
        povEnabled: formPOVEnabled,
        povMaxPerGuest: formPovMaxPerGuest,
      };
      if (formPovRevealAt) {
        body.povRevealAt = new Date(formPovRevealAt).toISOString();
      }
      const updated = await apiFetch<EventRecord>(`/events/${slug}`, {
        method: "PATCH",
        body: JSON.stringify(body),
      });
      setEvent((prev) => (prev ? { ...prev, ...updated } : updated));
      showSuccessToast("Photo wall saved", "Your photo wall settings were updated.");
    } catch (err) {
      reportApiError(err, "Failed to save photo wall settings");
    } finally {
      setSaving(false);
    }
  };

  const handleToggleUploads = async () => {
    if (!event || togglingUploads) return;
    setTogglingUploads(true);
    try {
      const updated = await apiFetch<EventRecord>(`/events/${slug}`, {
        method: "PATCH",
        body: JSON.stringify({ uploadsEnabled: !formUploadsEnabled }),
      });
      setEvent((prev) => (prev ? { ...prev, ...updated } : updated));
      setFormUploadsEnabled(updated.uploadsEnabled);
      showSuccessToast(
        updated.uploadsEnabled ? "Uploads enabled" : "Uploads disabled",
        updated.uploadsEnabled
          ? "Guests can upload photos and videos again."
          : "Guest uploads are now turned off."
      );
    } catch (err) {
      reportApiError(err, "Failed to update uploads setting");
    } finally {
      setTogglingUploads(false);
    }
  };

  const handleCoverFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCoverFile(e.target.files?.[0] ?? null);
  };

  const handleCoverUpload = async () => {
    if (!event || !coverFile || coverUploading) return;

    setCoverUploading(true);
    try {
      const updated = await uploadEventCover(event.slug, coverFile);
      setEvent((prev) => (prev ? { ...prev, ...updated } : prev));
      setCoverFile(null);
      showSuccessToast("Cover uploaded", "Your event cover photo was updated.");
    } catch (err) {
      reportApiError(err, "Failed to upload cover image");
    } finally {
      setCoverUploading(false);
    }
  };

  if (loading) {
    return <div className="text-sm text-muted-foreground">Loading settings…</div>;
  }

  if (!event) return null;

  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="font-heading text-2xl font-semibold tracking-tight">
          Event Settings
        </h2>
        <p className="text-sm text-muted-foreground">
          Manage settings for <span className="font-medium text-foreground">{event.name}</span>
        </p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-border/60 pb-1">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-t-lg px-3 py-2 text-sm font-medium transition-colors",
              tab === id
                ? "border-b-2 border-primary text-primary"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "general" && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">General</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSaveGeneral}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Event Name</label>
                <input
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  value={formName}
                  onChange={(e) => setFormName(e.target.value)}
                />
                <p className="text-xs text-muted-foreground">
                  It&apos;ll be used through the app and will be shown to your guests.
                </p>
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Event Date</label>
                <input
                  type="date"
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  value={formDate}
                  onChange={(e) => setFormDate(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Event Type</label>
                <div className="flex flex-wrap gap-2">
                  {EVENT_CATEGORIES.map((cat) => (
                    <button
                      key={cat.value}
                      type="button"
                      onClick={() => setFormCategory(cat.value)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-sm transition-colors",
                        formCategory === cat.value
                          ? "border-primary bg-primary/5 text-primary"
                          : "hover:border-primary/40"
                      )}
                    >
                      {cat.emoji} {cat.label}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-muted-foreground">
                  We&apos;ll adjust the experience according to your event type.
                </p>
              </div>

              <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <div className="text-sm font-medium">Guest uploads</div>
                    <p className="text-xs text-muted-foreground">
                      Allow guests to upload photos and videos to this event.
                    </p>
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 rounded-xl"
                    onClick={handleToggleUploads}
                    disabled={togglingUploads}
                  >
                    {togglingUploads
                      ? "Updating…"
                      : formUploadsEnabled
                        ? "Disable uploads"
                        : "Enable uploads"}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Currently: {formUploadsEnabled ? "Enabled" : "Disabled"}
                </p>
              </div>

              <div className="space-y-3 rounded-xl border bg-muted/30 p-4">
                <label className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={formProtected}
                    onChange={(e) => setFormProtected(e.target.checked)}
                  />
                  <span>
                    <span className="block text-sm font-medium">
                      Protect gallery with password
                    </span>
                    <span className="block text-xs text-muted-foreground">
                      Requires Premium or Pro plan for new protection.
                    </span>
                  </span>
                </label>
                {formProtected && (
                  <input
                    type="password"
                    placeholder="Gallery password"
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    value={formPassword}
                    onChange={(e) => setFormPassword(e.target.value)}
                  />
                )}
              </div>

              <div className="space-y-1.5">
                <label className="text-sm font-medium">Event Custom Link</label>
                <div className="flex gap-2">
                  <span className="flex items-center rounded-l-xl border border-r-0 bg-muted px-3 text-xs text-muted-foreground">
                    /e/
                  </span>
                  <input
                    readOnly
                    value={event.slug}
                    className="min-w-0 flex-1 rounded-r-xl border px-3 py-2 text-sm"
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  Custom slugs are available on Pro.{" "}
                  <Link href="/settings" className="text-primary hover:underline">
                    Upgrade
                  </Link>
                </p>
              </div>

              <Button type="submit" disabled={saving} className="rounded-xl">
                {saving ? "Saving…" : "Save changes"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === "appearance" && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Appearance</CardTitle>
          </CardHeader>
          <CardContent className="space-y-5">
            <div className="space-y-3 rounded-2xl border border-border/70 p-4">
              <div className="space-y-1">
                <div className="text-sm font-medium">Cover photo</div>
                <p className="text-xs text-muted-foreground">
                  Shown on the guest welcome screen and album header.
                </p>
              </div>
              {event.coverImageUrl ? (
                <img
                  src={event.coverImageUrl}
                  alt={event.name}
                  className="aspect-[21/9] max-h-48 w-full rounded-xl object-cover"
                />
              ) : (
                <div className="flex aspect-[21/9] max-h-48 items-center justify-center rounded-xl bg-muted text-sm text-muted-foreground">
                  No cover photo yet
                </div>
              )}
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleCoverFileChange}
                  className="w-full text-xs file:mr-3 file:rounded-lg file:border-0 file:bg-background file:px-3 file:py-1.5 file:text-xs sm:max-w-[220px]"
                />
                <Button
                  type="button"
                  size="sm"
                  variant="secondary"
                  className="shrink-0 rounded-xl"
                  onClick={handleCoverUpload}
                  disabled={!coverFile || coverUploading}
                >
                  {coverUploading ? "Uploading…" : "Upload cover"}
                </Button>
              </div>
            </div>

            <form className="space-y-5" onSubmit={handleSaveAppearance}>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Primary color</label>
                <input
                  type="color"
                  value={formPrimaryColor}
                  onChange={(e) => setFormPrimaryColor(e.target.value)}
                  className="h-10 w-full rounded-xl border"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Background</label>
                <select
                  className="w-full rounded-xl border px-3 py-2 text-sm"
                  value={formBackgroundVariant}
                  onChange={(e) =>
                    setFormBackgroundVariant(e.target.value as "dark" | "light")
                  }
                >
                  <option value="dark">Dark</option>
                  <option value="light">Light</option>
                </select>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Cover layout</label>
                  <select
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    value={formCoverLayout}
                    onChange={(e) =>
                      setFormCoverLayout(e.target.value as "banner" | "card")
                    }
                  >
                    <option value="banner">Banner</option>
                    <option value="card">Card</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Cover overlay</label>
                  <select
                    className="w-full rounded-xl border px-3 py-2 text-sm"
                    value={formCoverOverlay}
                    onChange={(e) =>
                      setFormCoverOverlay(e.target.value as "none" | "gradient")
                    }
                  >
                    <option value="none">None</option>
                    <option value="gradient">Gradient</option>
                  </select>
                </div>
              </div>
              <Button type="submit" disabled={saving} className="rounded-xl">
                {saving ? "Saving…" : "Save appearance"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === "photo-wall" && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Photo Wall</CardTitle>
          </CardHeader>
          <CardContent>
            <form className="space-y-5" onSubmit={handleSavePhotoWall}>
              <label className="flex items-start gap-2">
                <input
                  type="checkbox"
                  className="mt-1"
                  checked={formPOVEnabled}
                  onChange={(e) => setFormPOVEnabled(e.target.checked)}
                />
                <span>
                  <span className="block text-sm font-medium">POV mode</span>
                  <span className="block text-xs text-muted-foreground">
                    Limit guest uploads like a disposable camera (Pro plan).
                  </span>
                </span>
              </label>
              {formPOVEnabled && (
                <>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Max shots per guest</label>
                    <input
                      type="number"
                      min={0}
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      value={formPovMaxPerGuest}
                      onChange={(e) =>
                        setFormPovMaxPerGuest(Number(e.target.value))
                      }
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Gallery reveal date</label>
                    <input
                      type="date"
                      className="w-full rounded-xl border px-3 py-2 text-sm"
                      value={formPovRevealAt}
                      onChange={(e) => setFormPovRevealAt(e.target.value)}
                    />
                  </div>
                </>
              )}
              <Button type="submit" disabled={saving} className="rounded-xl">
                {saving ? "Saving…" : "Save photo wall settings"}
              </Button>
            </form>
          </CardContent>
        </Card>
      )}

      {tab === "moderation" && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Moderation</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <p>
              Review pending uploads before they appear in the gallery. Manage
              moderation from the Photos & Videos page.
            </p>
            <Link
              href={`/events/${slug}/media`}
              className="inline-flex h-9 items-center justify-center rounded-xl border px-4 text-sm font-medium hover:bg-muted"
            >
              Go to Photos & Videos
            </Link>
          </CardContent>
        </Card>
      )}

      {tab === "collaborators" && (
        <Card className="rounded-2xl">
          <CardHeader>
            <CardTitle className="text-base">Collaborators</CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-muted-foreground">
            Invite co-organizers to help manage this event. Coming soon on Pro
            plans.
          </CardContent>
        </Card>
      )}
    </div>
  );
}
