"use client";

import { useEffect, useRef, useState } from "react";

function easeOutQuad(t: number) {
  return t * (2 - t);
}

export function CountUp({
  value,
  durationMs = 1600,
  className,
}: {
  value: number;
  durationMs?: number;
  className?: string;
}) {
  const [display, setDisplay] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || started.current) return;
        started.current = true;

        const startTime = performance.now();

        function tick(now: number) {
          const progress = Math.min(1, (now - startTime) / durationMs);
          setDisplay(Math.round(value * easeOutQuad(progress)));
          if (progress < 1) requestAnimationFrame(tick);
        }

        requestAnimationFrame(tick);
      },
      { threshold: 0.4 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [value, durationMs]);

  return (
    <span ref={ref} className={className}>
      {new Intl.NumberFormat("en-US").format(display)}
    </span>
  );
}
