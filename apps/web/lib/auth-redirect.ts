import { apiFetch } from "@/lib/api";
import { saveOrganizer, type OrganizerUser } from "@/lib/auth";

type AuthSession = {
  token: string;
  organizer: OrganizerUser;
  needsOnboarding?: boolean;
};

type MeResponse = {
  organizer: OrganizerUser;
  eventCount: number;
  needsOnboarding: boolean;
};

export async function resolvePostAuthPath(
  session: AuthSession,
  events?: { slug: string }[]
): Promise<string> {
  saveOrganizer(session.organizer);

  if (session.needsOnboarding) {
    return "/onboarding";
  }

  let eventList = events;
  if (!eventList) {
    try {
      eventList = (await apiFetch("/events")) as { slug: string }[];
    } catch {
      eventList = [];
    }
  }

  if (eventList.length === 1) {
    return `/events/${eventList[0].slug}`;
  }

  return "/dashboard";
}

export async function fetchAuthMe(): Promise<MeResponse> {
  return apiFetch<MeResponse>("/auth/me");
}

export function markWelcomeSeen(slug: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`eventphoto_welcome_${slug}`, "1");
}

export function hasSeenWelcome(slug: string) {
  if (typeof window === "undefined") return true;
  return localStorage.getItem(`eventphoto_welcome_${slug}`) === "1";
}

export function markOnboardingDashboard(slug: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`eventphoto_onboarding_dashboard_${slug}`, "1");
}

export function shouldShowWelcomeFromOnboarding(slug: string) {
  if (typeof window === "undefined") return false;
  const key = `eventphoto_onboarding_dashboard_${slug}`;
  if (localStorage.getItem(key) === "1") {
    localStorage.removeItem(key);
    return true;
  }
  return false;
}
