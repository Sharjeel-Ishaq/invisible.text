import { useParams, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { PostContent } from "@/components/PostContent";
import { Calendar, ArrowLeft, Tag } from "lucide-react";

type BlogPost = {
  id: number;
  title: string;
  slug: string;
  content: string;
  metaTitle: string;
  metaDescription: string;
  focusKeyword: string;
  featuredImage: string;
  status: string;
  scheduledDate: string | null;
  createdAt: string;
};

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function BlogPostPage() {
  const params = useParams<{ slug: string }>();
  const slug = params.slug;

  const { data: post, isLoading, isError } = useQuery<BlogPost>({
    queryKey: ["/api/blog", slug],
    queryFn: async () => {
      const res = await fetch(`/api/blog/${slug}`, { credentials: "include" });
      if (!res.ok) throw new Error("Not found");
      return res.json();
    },
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-16 space-y-6 animate-pulse">
          <div className="h-8 bg-muted rounded w-3/4" />
          <div className="h-64 bg-muted rounded-2xl" />
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => <div key={i} className="h-4 bg-muted rounded" />)}
          </div>
        </div>
      </Layout>
    );
  }

  if (isError || !post) {
    return (
      <Layout>
        <div className="max-w-3xl mx-auto py-24 text-center space-y-4">
          <h1 className="text-3xl font-bold">Post not found</h1>
          <p className="text-muted-foreground">This post may have been removed or does not exist.</p>
          <Link href="/blogs">
            <span className="inline-flex items-center gap-2 text-sm font-medium cursor-pointer" style={{ color: "#00a884" }}>
              <ArrowLeft className="h-4 w-4" /> Back to Blog
            </span>
          </Link>
        </div>
      </Layout>
    );
  }

  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.metaDescription,
    image: post.featuredImage ? [post.featuredImage] : undefined,
    datePublished: post.createdAt,
    dateModified: (post as any).updatedAt || post.createdAt,
    author: {
      "@type": "Organization",
      name: "Invisible Text",
    },
    keywords: post.focusKeyword,
  };

  const canonicalUrl = `https://textsinvisible.com/blogs/${post.slug}`;

  return (
    <Layout>
      <SeoHead
        title={post.metaTitle || `${post.title}`}
        description={post.metaDescription}
        canonical={canonicalUrl}
        ogTitle={post.title}
        ogDescription={post.metaDescription}
        ogImage={post.featuredImage}
        ogType="article"
        schema={articleSchema}
      />
      <article className="max-w-3xl mx-auto py-12 space-y-8">
        <Link href="/blogs">
          <span className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
            <ArrowLeft className="h-4 w-4" /> Back to Blog
          </span>
        </Link>

        <header className="space-y-4">
          {post.focusKeyword && (
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium border" style={{ backgroundColor: "#00a88415", color: "#00a884", borderColor: "#00a88440" }}>
              <Tag className="h-3 w-3" /> {post.focusKeyword}
            </div>
          )}
          <h1 className="text-3xl md:text-4xl font-display font-bold leading-tight">{post.title}</h1>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <time dateTime={String(post.createdAt)}>{formatDate(post.createdAt)}</time>
            {/* show last updated if available (falls back to createdAt) */}
            {(post as any).updatedAt && (post as any).updatedAt !== post.createdAt ? (
              <span className="mx-2">•</span>
            ) : null}
            {(post as any).updatedAt && (post as any).updatedAt !== post.createdAt ? (
              <time dateTime={String((post as any).updatedAt)}>{formatDate((post as any).updatedAt)}</time>
            ) : null}
          </div>
        </header>

        {post.featuredImage && (
          <div className="rounded-2xl overflow-hidden shadow-lg">
            <img
              src={post.featuredImage}
              alt={post.title}
              className="w-full object-cover max-h-[420px]"
            />
          </div>
        )}

        <PostContent
          html={post.content}
          className="prose prose-lg max-w-none prose-headings:font-display prose-a:text-[#00a884] prose-a:no-underline hover:prose-a:underline"
        />
      </article>
    </Layout>
  );
}
