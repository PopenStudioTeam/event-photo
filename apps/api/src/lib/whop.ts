import { toHttpsUrl } from "./https-url.js";

function useWhopSandbox() {
  const value = process.env.WHOP_SANDBOX?.trim().toLowerCase();
  return value === "1" || value === "true" || value === "sandbox";
}

function getWhopApiBase() {
  return useWhopSandbox()
    ? "https://sandbox-api.whop.com/api/v1"
    : "https://api.whop.com/api/v1";
}

function getWhopCheckoutHost() {
  return useWhopSandbox() ? "https://sandbox.whop.com" : "https://whop.com";
}

function getWhopApiKey() {
  const apiKey = process.env.WHOP_API_KEY?.trim();

  if (!apiKey) {
    throw new Error("WHOP_API_KEY is not configured");
  }

  return apiKey;
}

export const WHOP_PLANS = {
  premium: process.env.WHOP_PREMIUM_PLAN_ID?.trim() ?? "",
  pro: process.env.WHOP_PRO_PLAN_ID?.trim() ?? "",
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
  return `${getWhopCheckoutHost()}${path}`;
}

export class WhopApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "WhopApiError";
    this.status = status;
  }
}

type CreateCheckoutInput = {
  planId: string;
  accountId?: string;
  redirectUrl: string;
  metadata: Record<string, string>;
};

type CheckoutConfiguration = {
  id: string;
  purchase_url?: string | null;
};

export async function createWhopCheckout(input: CreateCheckoutInput) {
  const apiKey = getWhopApiKey();
  const body: Record<string, unknown> = {
    plan_id: input.planId,
    mode: "payment",
    redirect_url: toHttpsUrl(input.redirectUrl),
    metadata: input.metadata,
  };

  if (input.accountId) {
    body.account_id = input.accountId;
  }

  const response = await fetch(`${getWhopApiBase()}/checkout_configurations`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
      Accept: "application/json",
      "Api-Version-Date": "2026-09-02-2",
    },
    body: JSON.stringify(body),
  });

  const payload = (await response.json().catch(() => null)) as
    | CheckoutConfiguration
    | { error?: { message?: string } | string }
    | null;

  if (!response.ok) {
    const message =
      payload &&
      typeof payload === "object" &&
      "error" in payload &&
      payload.error
        ? typeof payload.error === "string"
          ? payload.error
          : payload.error.message ?? "Whop request failed"
        : "Whop request failed";

    throw new WhopApiError(response.status, message);
  }

  return payload as CheckoutConfiguration;
}
