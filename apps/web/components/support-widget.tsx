"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

const quickAnswers = [
  {
    question: "Is it a one-time payment or a subscription?",
    answer:
      "One-time, per event. Free has no card required; Premium and Pro are single payments.",
  },
  {
    question: "Do my guests need to download an app?",
    answer:
      "No. Guests scan a QR code or open a link and upload straight from their phone browser.",
  },
  {
    question: "How long can guests keep uploading?",
    answer:
      "As long as you leave uploads open — there's no fixed deadline unless you set one.",
  },
  {
    question: "Can I download everything my guests upload?",
    answer:
      "Premium and Pro can download everything as a ZIP. On Free you can still download items one at a time.",
  },
];

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = quickAnswers.filter((item) =>
    item.question.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed bottom-[calc(5.75rem+env(safe-area-inset-bottom))] right-3 z-50 md:bottom-5 md:right-5">
      <div
        className={cn(
          "absolute right-0 bottom-16 w-[calc(100vw-2.5rem)] max-w-sm origin-bottom-right overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-2xl transition-[opacity,transform] duration-300 ease-out",
          open
            ? "pointer-events-auto translate-y-0 scale-100 opacity-100"
            : "pointer-events-none translate-y-3 scale-95 opacity-0"
        )}
        aria-hidden={!open}
      >
        <div className="bg-brand-deep-navy px-5 py-6 text-brand-off-white">
          <div className="text-lg font-bold">Hi there 👋</div>
          <div className="text-sm text-brand-off-white/60">How can we help?</div>
        </div>

        <div className="max-h-96 overflow-y-auto p-4">
          <input
            type="text"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Search for help"
            tabIndex={open ? 0 : -1}
            className="w-full rounded-full border border-border bg-background px-4 py-2 text-sm text-foreground outline-none focus:border-primary"
          />

          <div className="mt-4 flex flex-col gap-1">
            {results.map((item) => (
              <details
                key={item.question}
                className="rounded-xl px-3 py-2 hover:bg-accent"
              >
                <summary className="cursor-pointer list-none text-sm font-medium text-foreground">
                  {item.question}
                </summary>
                <p className="mt-2 text-xs leading-5 text-muted-foreground">
                  {item.answer}
                </p>
              </details>
            ))}

            {results.length === 0 && (
              <p className="px-3 py-2 text-sm text-muted-foreground">
                No matches — email us instead.
              </p>
            )}
          </div>

          <a
            href="mailto:support@eventphoto.app"
            tabIndex={open ? 0 : -1}
            className="mt-4 flex items-center justify-center rounded-full bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground hover:bg-[var(--primary-hover)]"
          >
            Email support
          </a>
        </div>
      </div>

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close support" : "Open support"}
        className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-xl text-primary-foreground shadow-xl transition hover:bg-[var(--primary-hover)] md:h-14 md:w-14 md:text-2xl"
      >
        <span
          className={cn(
            "absolute transition duration-200 ease-out",
            open ? "rotate-90 scale-75 opacity-0" : "rotate-0 scale-100 opacity-100"
          )}
        >
          💬
        </span>
        <span
          className={cn(
            "absolute text-3xl leading-none transition duration-200 ease-out",
            open ? "rotate-0 scale-100 opacity-100" : "-rotate-90 scale-75 opacity-0"
          )}
        >
          ×
        </span>
      </button>
    </div>
  );
}