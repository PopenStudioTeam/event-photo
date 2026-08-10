"use client";

import { useState } from "react";

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
      "Yes, you can download the full collection in original quality at any time.",
  },
];

export function SupportWidget() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const results = quickAnswers.filter((item) =>
    item.question.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed bottom-5 right-5 z-50">
      {open && (
        <div className="mb-3 w-[calc(100vw-2.5rem)] max-w-sm overflow-hidden rounded-[1.5rem] border border-black/10 bg-white shadow-2xl">
          <div className="bg-[#262125] px-5 py-6 text-white">
            <div className="text-lg font-bold">Hi there 👋</div>
            <div className="text-sm text-white/60">How can we help?</div>
          </div>

          <div className="max-h-96 overflow-y-auto p-4">
            <input
              type="text"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search for help"
              className="w-full rounded-full border border-black/10 px-4 py-2 text-sm outline-none focus:border-black/30"
            />

            <div className="mt-4 flex flex-col gap-1">
              {results.map((item) => (
                <details
                  key={item.question}
                  className="rounded-xl px-3 py-2 hover:bg-neutral-50"
                >
                  <summary className="cursor-pointer list-none text-sm font-medium text-neutral-800">
                    {item.question}
                  </summary>
                  <p className="mt-2 text-xs leading-5 text-neutral-500">
                    {item.answer}
                  </p>
                </details>
              ))}

              {results.length === 0 && (
                <p className="px-3 py-2 text-sm text-neutral-500">
                  No matches — email us instead.
                </p>
              )}
            </div>

            <a
              href="mailto:support@eventphoto.app"
              className="mt-4 flex items-center justify-center rounded-full bg-[#262125] px-4 py-2.5 text-sm font-medium text-white hover:bg-black"
            >
              Email support
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-label={open ? "Close support" : "Open support"}
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#262125] text-2xl text-white shadow-xl transition hover:bg-black"
      >
        {open ? "×" : "💬"}
      </button>
    </div>
  );
}