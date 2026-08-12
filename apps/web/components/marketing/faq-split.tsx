"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export type Faq = { question: string; answer: string };

export function FaqSplit({
  heading,
  note,
  faqs,
}: {
  heading: string;
  note?: string;
  faqs: Faq[];
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mx-auto max-w-6xl px-4 py-24 sm:px-6 lg:px-8 lg:py-32">
      <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
        <div>
          <h2 className="text-3xl leading-tight sm:text-4xl">{heading}</h2>
          {note && (
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              {note}
            </p>
          )}
          <Link href="/dashboard" className="mt-6 inline-block">
            <Button className="rounded-full bg-primary px-6 text-primary-foreground hover:bg-[var(--primary-hover)]">
              I&apos;m ready to start
            </Button>
          </Link>
        </div>

        <div className="divide-y divide-border border-y border-border">
          {faqs.map((faq, index) => {
            const open = openIndex === index;

            return (
              <div key={faq.question}>
                <button
                  type="button"
                  onClick={() => setOpenIndex(open ? null : index)}
                  aria-expanded={open}
                  className="flex w-full items-center justify-between gap-5 py-5 text-left"
                >
                  <span className="text-sm font-bold text-foreground sm:text-base">
                    {faq.question}
                  </span>
                  <Plus
                    className={cn(
                      "h-4 w-4 shrink-0 text-muted-foreground transition-transform duration-300 ease-in-out",
                      open && "rotate-45"
                    )}
                  />
                </button>

                <div
                  className={cn(
                    "grid transition-[grid-template-rows] duration-300 ease-in-out",
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  )}
                >
                  <div className="overflow-hidden">
                    <div className="pb-5 pr-8 text-sm leading-6 text-muted-foreground">
                      {faq.answer}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
