import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Card, CardContent } from "@/components/ui/card";
import { Calendar, BookOpen } from "lucide-react";

type PublicPost = {
  id: number;
  title: string;
  slug: string;
  metaDescription: string;
  featuredImage: string;
  createdAt: string;
  focusKeyword: string;
};

function formatDate(d: string | Date) {
  return new Date(d).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
}

export default function Blog() {
  const { data: posts = [], isLoading } = useQuery<PublicPost[]>({
    queryKey: ["/api/blog"],
  });

  return (
    <Layout>
      <SeoHead
        title="Blog — Invisible Text | Tips, Guides & Updates"
        description="Explore guides on invisible text, Unicode characters, text tools, and platform-specific tips."
        canonical="https://textsinvisible.com/blogs"
        ogTitle="Blog — Invisible Text | Tips, Guides & Updates"
        ogDescription="Tips, Guides & Updates on invisible text, Unicode characters, and text tools."
        ogType="website"
      />
      <div className="max-w-5xl mx-auto space-y-12 py-12">
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border" style={{ backgroundColor: "#00a88415", color: "#00a884", borderColor: "#00a88440" }}>
            <BookOpen className="h-4 w-4" /> Our Blog
          </div>
          <h1 className="text-4xl md:text-5xl font-display font-bold tracking-tight">
            Tips, Guides & Updates
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore guides on invisible text, Unicode characters, text tools, and platform-specific tips.
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="animate-pulse">
                <div className="h-48 bg-muted rounded-t-xl" />
                <CardContent className="p-5 space-y-3">
                  <div className="h-4 bg-muted rounded w-3/4" />
                  <div className="h-3 bg-muted rounded w-full" />
                  <div className="h-3 bg-muted rounded w-2/3" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-24 text-muted-foreground">
            <BookOpen className="h-12 w-12 mx-auto mb-4 opacity-30" />
            <p className="text-lg">No posts published yet. Check back soon!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <Link key={post.id} href={`/blogs/${post.slug}`}>
                <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer overflow-hidden h-full">
                  {post.featuredImage ? (
                    <div className="h-48 overflow-hidden">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center" style={{ backgroundColor: "#00a88415" }}>
                      <BookOpen className="h-12 w-12" style={{ color: "#00a88440" }} />
                    </div>
                  )}
                  <CardContent className="p-5 space-y-3">
                    <h2 className="font-bold text-lg leading-snug group-hover:text-[#00a884] transition-colors line-clamp-2">
                      {post.title}
                    </h2>
                    {post.metaDescription && (
                      <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">
                        {post.metaDescription}
                      </p>
                    )}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground pt-1">
                      <Calendar className="h-3.5 w-3.5" />
                      {formatDate(post.createdAt)}
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
}
