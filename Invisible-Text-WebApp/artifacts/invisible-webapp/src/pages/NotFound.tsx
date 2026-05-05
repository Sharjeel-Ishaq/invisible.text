import { Layout } from "@/components/Layout";
import { SeoHead } from "@/components/SeoHead";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <Layout>
      <SeoHead
        title="Page Not Found"
        description="The page you're looking for doesn't exist or has been moved."
        ogTitle="404 - Page Not Found"
        ogDescription="Page not found on Invisible Text Generator."
      />
      <div className="max-w-xl mx-auto py-24 text-center space-y-6">
        <div className="text-8xl font-display font-bold text-primary/30">404</div>
        <h1 className="text-3xl font-bold">Page Not Found</h1>
        <p className="text-muted-foreground">The page you're looking for doesn't exist or has been moved.</p>
        <Link href="/">
          <Button className="bg-primary text-white">Go Home</Button>
        </Link>
      </div>
    </Layout>
  );
}
