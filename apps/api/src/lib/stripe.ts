import Stripe from "stripe";

const secretKey = process.env.STRIPE_SECRET_KEY;

if (!secretKey) {
  throw new Error("STRIPE_SECRET_KEY is not configured");
}

export const stripe = new Stripe(secretKey);

export const STRIPE_PRICES = {
  premium: process.env.STRIPE_PREMIUM_PRICE_ID ?? "",
  pro: process.env.STRIPE_PRO_PRICE_ID ?? "",
} as const;

export function getStripePriceId(plan: "premium" | "pro") {
  const priceId = STRIPE_PRICES[plan];

  if (!priceId) {
    throw new Error(`Stripe price is not configured for plan: ${plan}`);
  }

  return priceId;
}
