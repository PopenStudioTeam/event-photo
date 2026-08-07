import type { events } from "@app/shared/schema";

type EventRow = typeof events.$inferSelect;

export const EVENT_LIMITS = {
  free: {
    maxMediaCount: 100,
    moderation: false,
    passwordProtection: false,
    customization: false,
    pov: false,
    revealDate: false,
  },
  premium: {
    maxMediaCount: 1000,
    moderation: true,
    passwordProtection: true,
    customization: true,
    pov: false,
    revealDate: false,
  },
  pro: {
    maxMediaCount: 5000,
    moderation: true,
    passwordProtection: true,
    customization: true,
    pov: true,
    revealDate: true,
  },
} as const;

export type EventPlan = keyof typeof EVENT_LIMITS;

export function getEventPlan(event: EventRow) {
  return EVENT_LIMITS[event.plan as EventPlan];
}

export function hasPaidPlan(event: EventRow) {
  return (
    event.paymentStatus === "paid" &&
    (event.plan === "premium" || event.plan === "pro")
  );
}

export function canUseFeature(
  event: EventRow,
  feature:
    | "moderation"
    | "passwordProtection"
    | "customization"
    | "pov"
    | "revealDate"
) {
  if (event.plan === "free") return false;
  if (!hasPaidPlan(event)) return false;

  return getEventPlan(event)[feature];
}

export function getMaxMediaCount(event: EventRow) {
  if (!hasPaidPlan(event)) {
    return EVENT_LIMITS.free.maxMediaCount;
  }

  return getEventPlan(event).maxMediaCount;
}