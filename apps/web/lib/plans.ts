export type EventPlan = "free" | "premium" | "pro";
export type PaymentStatus = "free" | "pending" | "paid" | "failed" | "refunded";
export type PaidEventPlan = "premium" | "pro";

export const EVENT_PLANS = {
  free: {
    id: "free" as const,
    name: "Free",
    price: "$0",
    description: "Guest uploads, a shared gallery, and a QR code.",
    features: [
      "Up to 100 media items",
      "Guest photo and video uploads",
      "QR code and private link",
    ],
  },
  premium: {
    id: "premium" as const,
    name: "Premium",
    price: "$30",
    description: "More uploads, moderation, and a password-protected gallery.",
    features: [
      "Up to 1,000 media items",
      "Content moderation",
      "Password-protected gallery",
      "Custom cover and colors",
    ],
  },
  pro: {
    id: "pro" as const,
    name: "Pro",
    price: "$50",
    description: "POV mode, per-guest limits, and a scheduled gallery reveal.",
    features: [
      "Up to 5,000 media items",
      "Everything in Premium",
      "POV disposable-camera mode",
      "Per-guest limits",
      "Scheduled gallery reveal",
    ],
  },
} as const;

export function alreadyHasPlan(
  current: EventPlan,
  paymentStatus: PaymentStatus,
  target: EventPlan
) {
  if (target === "free") return current === "free" || paymentStatus !== "paid";
  return paymentStatus === "paid";
}

export function isCurrentPaidPlan(
  current: EventPlan,
  paymentStatus: PaymentStatus,
  target: EventPlan
) {
  if (target === "free") {
    return current === "free" || paymentStatus !== "paid";
  }
  return paymentStatus === "paid" && current === target;
}

export function eventPlanSettingsPath(slug: string) {
  return `/events/${slug}/settings?tab=plan`;
}
