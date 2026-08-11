"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { apiFetch, reportApiError } from "@/lib/api";

type GuideComment = {
  id: string;
  authorName: string;
  body: string;
  createdAt: string;
};

type GuideCommentsProps = {
  guideSlug: string;
};

function formatCommentDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date(value));
}

export function GuideComments({ guideSlug }: GuideCommentsProps) {
  const [comments, setComments] = useState<GuideComment[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [authorName, setAuthorName] = useState("");
  const [authorEmail, setAuthorEmail] = useState("");
  const [body, setBody] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function loadComments() {
      try {
        const res = await apiFetch<{ comments: GuideComment[] }>(
          `/public/guides/${guideSlug}/comments`
        );
        if (!cancelled) {
          setComments(res.comments);
        }
      } catch (err) {
        reportApiError(err);
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadComments();
    return () => {
      cancelled = true;
    };
  }, [guideSlug]);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const trimmedName = authorName.trim();
    const trimmedEmail = authorEmail.trim();
    const trimmedBody = body.trim();

    if (!trimmedName || !trimmedEmail || !trimmedBody) {
      setError("Name, email, and comment are required.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await apiFetch<{ comment: GuideComment }>(
        `/public/guides/${guideSlug}/comments`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            authorName: trimmedName,
            authorEmail: trimmedEmail,
            body: trimmedBody,
          }),
        }
      );

      setComments((current) => [res.comment, ...current]);
      setBody("");
      setError(null);
    } catch (err) {
      reportApiError(err);
      setError("Could not post your comment. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section
      id="guide-comments"
      className="scroll-mt-28 border-t border-border pt-12"
    >
      <h2 className="text-2xl font-semibold tracking-tight">
        Has anything to say?
      </h2>
      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        Share your thoughts and questions. Leave your name and email so we can
        reply if needed.
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-3 text-sm">
        <span className="font-semibold">
          {loading ? "…" : `${comments.length} Comment${comments.length === 1 ? "" : "s"}`}
        </span>
      </div>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        <textarea
          value={body}
          onChange={(event) => setBody(event.target.value)}
          placeholder="Write your comment"
          rows={5}
          className="w-full resize-y rounded-2xl border border-primary/40 bg-background px-4 py-3 text-sm leading-6 outline-none transition focus-visible:border-primary focus-visible:ring-2 focus-visible:ring-primary/20"
          required
        />

        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            value={authorName}
            onChange={(event) => setAuthorName(event.target.value)}
            placeholder="Your name"
            className="h-11 rounded-xl px-4 text-sm"
            required
          />
          <Input
            type="email"
            value={authorEmail}
            onChange={(event) => setAuthorEmail(event.target.value)}
            placeholder="Your email"
            className="h-11 rounded-xl px-4 text-sm"
            required
          />
        </div>

        {error ? (
          <p className="text-sm text-destructive">{error}</p>
        ) : null}

        <div className="flex justify-end">
          <Button
            type="submit"
            disabled={submitting}
            className="rounded-full px-6"
          >
            {submitting ? "Posting…" : "Comment"}
          </Button>
        </div>
      </form>

      <div className="mt-10 space-y-6">
        {!loading && comments.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">
            Be the first to comment…
          </p>
        ) : null}

        {comments.map((comment) => (
          <article
            key={comment.id}
            className="rounded-2xl border border-border bg-card/60 p-5"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-sm">
              <span className="font-semibold">{comment.authorName}</span>
              <span className="text-muted-foreground">
                {formatCommentDate(comment.createdAt)}
              </span>
            </div>
            <p className="mt-3 text-sm leading-7 text-foreground/85">
              {comment.body}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
