"use client";

import { useEffect, useRef, useState } from "react";
import type { Guide } from "@/lib/guides-data";
import { cn } from "@/lib/utils";

type GuideArticleLayoutProps = {
  guide: Guide;
  children: React.ReactNode;
};

const COMMENTS_SECTION_ID = "guide-comments";

export function GuideArticleLayout({ guide, children }: GuideArticleLayoutProps) {
  const [activeId, setActiveId] = useState(guide.sections[0]?.id ?? "");
  const articleEndRef = useRef<HTMLDivElement>(null);
  const hasAutoScrolledRef = useRef(false);

  const tocItems = [
    ...guide.sections.map((section) => ({
      id: section.id,
      title: section.title,
    })),
    { id: COMMENTS_SECTION_ID, title: "Comments" },
  ];

  useEffect(() => {
    const sectionIds = guide.sections.map((section) => section.id);
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visible[0]?.target.id) {
          setActiveId(visible[0].target.id);
        }
      },
      { rootMargin: "-20% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] }
    );

    for (const element of elements) {
      observer.observe(element);
    }

    return () => observer.disconnect();
  }, [guide.sections]);

  useEffect(() => {
    const sentinel = articleEndRef.current;
    if (!sentinel) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting || hasAutoScrolledRef.current) {
          return;
        }

        hasAutoScrolledRef.current = true;
        setActiveId(COMMENTS_SECTION_ID);

        const commentsSection = document.getElementById(COMMENTS_SECTION_ID);
        if (commentsSection) {
          commentsSection.scrollIntoView({ behavior: "smooth", block: "start" });
        }
      },
      { threshold: 0.6 }
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, []);

  function scrollToSection(id: string) {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
      setActiveId(id);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 pb-10 pt-10 sm:px-6 sm:pt-16 lg:px-8">
      <div className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
        {guide.category} · {guide.readTime}
      </div>

      <h1 className="mt-4 max-w-3xl text-4xl leading-tight sm:text-5xl">
        {guide.title}
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base">
        {guide.excerpt}
      </p>

      <div className="mt-12 grid gap-10 lg:grid-cols-[220px_minmax(0,1fr)] lg:gap-14">
        <aside className="hidden lg:block">
          <nav
            aria-label="Table of contents"
            className="sticky top-24 space-y-4"
          >
            <p className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-sm bg-primary" />
              Table of contents
            </p>

            <ul className="space-y-2 border-l border-border pl-4">
              {tocItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => scrollToSection(item.id)}
                    className={cn(
                      "block w-full text-left text-sm leading-snug transition-colors",
                      activeId === item.id
                        ? "font-semibold text-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {item.title}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        </aside>

        <div>
          <div className="space-y-10">
            {guide.sections.map((section) => (
              <section
                key={section.id}
                id={section.id}
                className="scroll-mt-28"
              >
                <h2 className="text-xl font-semibold tracking-tight sm:text-2xl">
                  {section.title}
                </h2>
                <div className="mt-4 space-y-4 text-sm leading-7 text-foreground/85 sm:text-base">
                  {section.paragraphs.map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div ref={articleEndRef} className="h-px w-full" aria-hidden="true" />

          {children}
        </div>
      </div>
    </section>
  );
}
