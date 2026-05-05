import { Helmet } from "react-helmet-async";

interface SeoHeadProps {
  title: string;
  description: string;
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogType?: string;
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  schema?: Record<string, any>;
  children?: React.ReactNode;
}

export function SeoHead({
  title,
  description,
  canonical,
  ogTitle,
  ogDescription,
  ogImage,
  ogType = "website",
  twitterTitle,
  twitterDescription,
  twitterImage,
  schema,
  children,
}: SeoHeadProps) {
  const fullTitle = title.includes("—") ? title : `${title} — Invisible Text`;

  // Resolve a base site URL. Prefer Vite env var, then runtime origin, then fallback.
  const SITE_URL = (typeof (import.meta as any) !== "undefined" && (import.meta as any).env && (import.meta as any).env.VITE_SITE_URL)
    || (typeof window !== "undefined" && window.location?.origin)
    || "https://textsinvisible.com";

  const toAbsolute = (u?: string) => {
    if (!u) return undefined;
    try {
      // If already absolute, return as-is
      const parsed = new URL(u, SITE_URL);
      return parsed.href;
    } catch (e) {
      return u;
    }
  };

  const absCanonical = canonical ? toAbsolute(canonical) : undefined;
  const absOgImage = toAbsolute(ogImage);
  const absTwitterImage = toAbsolute(twitterImage);
  // Ensure schema images are absolute if present
  const absSchema = schema ? JSON.parse(JSON.stringify(schema)) : undefined;
  if (absSchema) {
    if (absSchema.image && typeof absSchema.image === "string") absSchema.image = toAbsolute(absSchema.image);
    if (Array.isArray(absSchema.image)) absSchema.image = absSchema.image.map((i: string) => toAbsolute(i));
    if (absSchema.image && absSchema.image.url) absSchema.image.url = toAbsolute(absSchema.image.url);
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      {absCanonical && <link rel="canonical" href={absCanonical} />}

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      {absCanonical && <meta property="og:url" content={absCanonical} />}
      <meta property="og:title" content={ogTitle || fullTitle} />
      <meta property="og:description" content={ogDescription || description} />
      {absOgImage && <meta property="og:image" content={absOgImage} />}

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      {absCanonical && <meta property="twitter:url" content={absCanonical} />}
      <meta property="twitter:title" content={twitterTitle || ogTitle || fullTitle} />
      <meta property="twitter:description" content={twitterDescription || ogDescription || description} />
      {absTwitterImage && <meta property="twitter:image" content={absTwitterImage} />}

      {/* JSON-LD Schema */}
      {absSchema && (
        <script type="application/ld+json">{JSON.stringify(absSchema)}</script>
      )}

      {children}
    </Helmet>
  );
}
