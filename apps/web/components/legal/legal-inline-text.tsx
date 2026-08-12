import Link from "next/link";

const LINK_PATTERN = /\[([^\]]+)\](?:\(([^)]+)\))?/g;

/**
 * Renders `[label](href)` as a real link (internal routes use next/link) and a
 * bare `[label]` as a muted, dotted-underline placeholder for a link the
 * reader still needs to fill in — used so legal templates can reference
 * "see our X" without us inventing a URL we can't verify.
 */
export function renderLegalText(text: string) {
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;

  while ((match = LINK_PATTERN.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const [, label, href] = match;

    if (href) {
      nodes.push(
        href.startsWith("/") ? (
          <Link
            key={key++}
            href={href}
            className="text-primary underline underline-offset-2 hover:no-underline"
          >
            {label}
          </Link>
        ) : (
          <a
            key={key++}
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary underline underline-offset-2 hover:no-underline"
          >
            {label}
          </a>
        )
      );
    } else {
      nodes.push(
        <span
          key={key++}
          className="underline decoration-dotted decoration-muted-foreground underline-offset-2 text-muted-foreground"
        >
          {label}
        </span>
      );
    }

    lastIndex = LINK_PATTERN.lastIndex;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}
