import { useEffect, useRef } from "react";
import { buildEmbedSrcdoc } from "@/lib/tiptap-code-embed";

interface PostContentProps {
  html: string;
  className?: string;
}

export function PostContent({ html, className }: PostContentProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const embeds = root.querySelectorAll<HTMLDivElement>("div[data-code-embed]");
    embeds.forEach((el) => {
      if (el.dataset.codeEmbedRendered === "true") return;
      el.dataset.codeEmbedRendered = "true";

      let attrs = { html: "", css: "", js: "" };
      try {
        const raw = el.getAttribute("data-code-embed") || "";
        attrs = { ...attrs, ...JSON.parse(decodeURIComponent(raw)) };
      } catch {
        // ignore parse errors
      }

      el.innerHTML = "";
      el.style.margin = "1.5rem 0";

      const iframe = document.createElement("iframe");
      iframe.setAttribute("sandbox", "allow-scripts");
      iframe.setAttribute("title", "Code Embed");
      iframe.style.cssText =
        "width:100%;border:1px solid #e5e7eb;border-radius:12px;background:#fff;min-height:160px;display:block";
      iframe.srcdoc = buildEmbedSrcdoc(attrs);

      iframe.addEventListener("load", () => {
        try {
          const doc = iframe.contentDocument;
          if (!doc) return;
          const resize = () => {
            const h = Math.max(
              doc.body.scrollHeight,
              doc.documentElement.scrollHeight,
            );
            iframe.style.height = h + 24 + "px";
          };
          resize();
          if (typeof ResizeObserver !== "undefined") {
            const ro = new ResizeObserver(resize);
            ro.observe(doc.body);
          }
          setTimeout(resize, 200);
          setTimeout(resize, 600);
        } catch {
          // sandbox may block access
        }
      });

      el.appendChild(iframe);
    });
  }, [html]);

  return (
    <div
      ref={containerRef}
      className={className}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
