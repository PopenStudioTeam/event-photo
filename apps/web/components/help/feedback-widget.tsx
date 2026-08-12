"use client";

import { useState } from "react";

const options = [
  { emoji: "😔", label: "Not helpful" },
  { emoji: "😐", label: "Somewhat helpful" },
  { emoji: "😍", label: "Very helpful" },
];

export function HelpFeedbackWidget() {
  const [selected, setSelected] = useState<number | null>(null);

  return (
    <div className="rounded-xl bg-muted/60 p-6 text-center">
      {selected === null ? (
        <>
          <div className="text-sm font-medium text-foreground">
            Did this answer your question?
          </div>
          <div className="mt-4 flex justify-center gap-4">
            {options.map((option, index) => (
              <button
                key={option.label}
                type="button"
                aria-label={option.label}
                onClick={() => setSelected(index)}
                className="text-2xl transition-transform duration-200 hover:scale-125"
              >
                {option.emoji}
              </button>
            ))}
          </div>
        </>
      ) : (
        <div className="animate-in fade-in text-sm text-muted-foreground duration-300">
          Thanks for the feedback!
        </div>
      )}
    </div>
  );
}
