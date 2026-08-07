"use client";

import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/api";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Plan = "free" | "premium" | "pro";
type PaymentStatus = "free" | "pending" | "paid" | "failed" | "refunded";

type Event = {
  id: string;
  slug: string;
  name: string;
  plan: Plan;
  paymentStatus: PaymentStatus;
  paidAt: string | null;
};

const planDetails = {
  premium: {
    name: "Premium",
    price: "$30",
    description: "For events that need more uploads, moderation, and customization.",
    features: [
      "Up to 1,000 media items",
      "Content moderation",
      "Password-protected gallery",
      "Custom cover and colors",
    ],
  },
  pro: {
    name: "Pro",
    price: "$50",
    description: "For larger events with POV and reveal features.",
    features: [
      "Up to 5,000 media items",
      "Everything in Premium",
      "POV disposable-camera mode",
      "Per-guest limits",
      "Scheduled gallery reveal",
    ],
  },
} as const;

export default function SettingsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [checkoutLoading, setCheckoutLoading] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const result = await apiFetch("/events");
        setEvents(result as Event[]);
      } catch (err) {
        console.error(err);
        setError("Failed to load billing settings.");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, []);

  const startCheckout = async (
    eventSlug: string,
    plan: "premium" | "pro"
  ) => {
    setCheckoutLoading(`${eventSlug}:${plan}`);
    setError(null);

    try {
      const result = await apiFetch(`/billing/events/${eventSlug}/checkout`, {
        method: "POST",
        body: JSON.stringify({ plan }),
      });

      const { checkoutUrl } = result as { checkoutUrl?: string };

      if (!checkoutUrl) {
        throw new Error("Stripe Checkout URL was not returned.");
      }

      window.location.href = checkoutUrl;
    } catch (err) {
      console.error(err);
      setError(
        err instanceof Error
          ? err.message
          : "Unable to start Stripe Checkout."
      );
      setCheckoutLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="text-sm text-muted-foreground">
        Loading billing settings…
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold">Settings</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage event plans and payments.
        </p>
      </div>

      {message && (
        <div className="rounded-md border border-green-300 bg-green-50 p-3 text-sm text-green-700">
          {message}
        </div>
      )}

      {error && (
        <div className="rounded-md border border-red-300 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2">
        {(["premium", "pro"] as const).map((plan) => {
          const details = planDetails[plan];

          return (
            <Card key={plan}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{details.name}</span>
                  <span>{details.price}</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <p className="text-sm text-muted-foreground">
                  {details.description}
                </p>

                <ul className="space-y-1 text-sm">
                  {details.features.map((feature) => (
                    <li key={feature}>✓ {feature}</li>
                  ))}
                </ul>

                {events.length === 0 ? (
                  <p className="text-xs text-muted-foreground">
                    Create an event before purchasing a plan.
                  </p>
                ) : (
                  <div className="space-y-2">
                    <p className="text-xs font-medium">
                      Choose an event to upgrade
                    </p>

                    {events.map((event) => {
                      const isPaid = event.paymentStatus === "paid";
                      const loadingKey = `${event.slug}:${plan}`;

                      return (
                        <div
                          key={event.id}
                          className="flex flex-col gap-2 rounded-md border p-3 sm:flex-row sm:items-center sm:justify-between"
                        >
                          <div className="min-w-0">
                            <div className="truncate text-sm font-medium">
                              {event.name}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              Current plan: {event.plan} ·{" "}
                              {event.paymentStatus}
                            </div>
                          </div>

                          <Button
                            size="sm"
                            disabled={isPaid || checkoutLoading !== null}
                            onClick={() => startCheckout(event.slug, plan)}
                          >
                            {isPaid
                              ? "Paid"
                              : checkoutLoading === loadingKey
                                ? "Opening…"
                                : `Buy ${details.name}`}
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}