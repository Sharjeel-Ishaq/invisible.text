import { useEffect, useState } from "react";

type Props = {
  /** ISO date string to display (optional). If provided, no network fetch is performed. */
  date?: string | null;
  /** For static pages: 'privacy-policy' | 'terms' | 'terms-and-conditions' | 'disclaimer' */
    page?: "privacy-policy" | "terms" | "terms-and-conditions" | "disclaimer";
  /** Optional className for styling */
  className?: string;
};

function formatDate(d?: string | null) {
  if (!d) return "";
  try {
    return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch (e) {
    return String(d);
  }
}

export default function LastUpdated({ date, page, className }: Props) {
  const [last, setLast] = useState<string | null>(date ?? null);

  useEffect(() => {
    if (date) return; // explicit date provided
    if (!page) return;

    let mounted = true;
    (async () => {
      try {
        const res = await fetch(`/api/meta/page-last-modified?page=${encodeURIComponent(page)}`, { cache: "no-cache" });
        if (!res.ok) return;
        const json = await res.json();
        if (mounted && json && json.lastModified) {
          setLast(json.lastModified);
        }
      } catch (e) {
        // ignore
      }
    })();

    return () => { mounted = false; };
  }, [date, page]);

  if (!last) return null;

  return (
    <span className={className || "text-muted-foreground text-sm"}>
      Last Updated: {formatDate(last)}
    </span>
  );
}

export { formatDate };
