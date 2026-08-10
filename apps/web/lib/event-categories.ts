export type EventCategory =
  | "wedding"
  | "party"
  | "conference"
  | "birthday"
  | "other";

export const EVENT_CATEGORIES: {
  value: EventCategory;
  label: string;
  emoji: string;
}[] = [
  { value: "wedding", label: "Wedding", emoji: "💍" },
  { value: "party", label: "Party", emoji: "🎉" },
  { value: "conference", label: "Conference", emoji: "🎤" },
  { value: "birthday", label: "Birthday", emoji: "🎂" },
  { value: "other", label: "Other", emoji: "❓" },
];

export function getCategoryLabel(category: EventCategory | string | null | undefined) {
  return EVENT_CATEGORIES.find((c) => c.value === category)?.label ?? "Other";
}

export function getCategoryIntro(category: EventCategory | string | null | undefined) {
  switch (category) {
    case "wedding":
      return "Here you'll find everything you need to manage your wedding.";
    case "party":
      return "Here you'll find everything you need to manage your party.";
    case "conference":
      return "Here you'll find everything you need to manage your conference.";
    case "birthday":
      return "Here you'll find everything you need to manage your birthday.";
    default:
      return "Here you'll find everything you need to manage your event.";
  }
}

export function organizerDisplayName(email: string | undefined) {
  if (!email) return "Organizer";
  const local = email.split("@")[0] ?? "";
  const parts = local.split(/[._-]+/).filter(Boolean);
  if (parts.length >= 2) {
    return parts.map((p) => p.charAt(0).toUpperCase() + p.slice(1)).join(" ").toUpperCase();
  }
  return local.replace(/[._-]/g, " ").toUpperCase() || "ORGANIZER";
}
