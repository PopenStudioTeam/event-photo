import { WhopClient } from "@whop/sdk";

const apiKey = process.env.WHOP_API_KEY;

if (!apiKey) {
  throw new Error("WHOP_API_KEY is not configured");
}

export const whop = new WhopClient({
  token: apiKey,
});

export const WHOP_PLANS = {
  premium: process.env.WHOP_PREMIUM_PLAN_ID ?? "",
  pro: process.env.WHOP_PRO_PLAN_ID ?? "",
} as const;

export function getWhopPlanId(plan: "premium" | "pro") {
  const planId = WHOP_PLANS[plan];

  if (!planId) {
    throw new Error(`Whop plan is not configured for plan: ${plan}`);
  }

  return planId;
}

export function resolveWhopCheckoutUrl(purchaseUrl: string | null | undefined) {
  if (!purchaseUrl) {
    return null;
  }

  if (
    purchaseUrl.startsWith("http://") ||
    purchaseUrl.startsWith("https://")
  ) {
    return purchaseUrl;
  }

  const path = purchaseUrl.startsWith("/") ? purchaseUrl : `/${purchaseUrl}`;
  return `https://whop.com${path}`;
}
