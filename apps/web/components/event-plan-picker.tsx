"use client";

import { useState } from "react";
import { apiFetch, reportApiError } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import {
  alreadyHasPlan,
  EVENT_PLANS,
  isCurrentPaidPlan,
  type EventPlan,
  type PaidEventPlan,
  type PaymentStatus,
} from "@/lib/plans";

export type PlanEvent = {
  slug: string;
  name: string;
  plan: EventPlan;
  paymentStatus: PaymentStatus;
};

type EventPlanPickerProps = {
  event: PlanEvent;
};

export function EventPlanPicker({ event }: EventPlanPickerProps) {
  const [checkoutLoading, setCheckoutLoading] = useState<PaidEventPlan | null>(
    null
  );

  const startCheckout = async (plan: PaidEventPlan) => {
    setCheckoutLoading(plan);

    try {
      const result = await apiFetch(`/billing/events/${event.slug}/checkout`, {
        method: "POST",
        body: JSON.stringify({ plan }),
      });

      const payload = result as { checkoutUrl?: string };

      if (!payload.checkoutUrl) {
        throw new Error("Whop Checkout URL was not returned.");
      }

      window.location.href = payload.checkoutUrl;
    } catch (err) {
      reportApiError(err, "Unable to start Whop Checkout.");
      setCheckoutLoading(null);
    }
  };

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {(Object.values(EVENT_PLANS) as (typeof EVENT_PLANS)[EventPlan][]).map(
        (details) => {
          const plan = details.id;
          const alreadyHas = alreadyHasPlan(
            event.plan,
            event.paymentStatus,
            plan
          );
          const isCurrent = isCurrentPaidPlan(
            event.plan,
            event.paymentStatus,
            plan
          );

          return (
            <Card
              key={plan}
              className={cn(
                "rounded-2xl",
                isCurrent && "border-primary/50 ring-1 ring-primary/20"
              )}
            >
              <CardHeader>
                <CardTitle className="flex items-center justify-between text-base">
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
                {plan === "free" ? (
                  <Button size="sm" disabled className="w-full">
                    {isCurrent ? "Current plan" : "Included"}
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    className="w-full"
                    disabled={alreadyHas || checkoutLoading !== null}
                    onClick={() => startCheckout(plan)}
                  >
                    {alreadyHas
                      ? isCurrent
                        ? "Current plan"
                        : "Unavailable"
                      : checkoutLoading === plan
                        ? "Opening…"
                        : `Choose ${details.name}`}
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        }
      )}
    </div>
  );
}
