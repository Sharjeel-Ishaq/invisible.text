import { type Express, type Request, type Response } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { db } from "@workspace/db";
import { blogPosts } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { requireAdmin } from "./admin";
import { z } from "zod";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const uploadDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname);
    cb(null, `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`);
  },
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

async function autoPublishScheduled() {
  // When running locally without a DATABASE_URL, `db` is a noop object.
  if (!db || typeof (db as any).select !== "function") return;

  const now = new Date();
  const scheduled = await db
    .select()
    .from(blogPosts)
    .where(eq(blogPosts.status, "scheduled"));

  for (const post of scheduled) {
    if (post.scheduledDate && new Date(post.scheduledDate) <= now) {
      await db
        .update(blogPosts)
        .set({ status: "published" })
        .where(eq(blogPosts.id, post.id));
    }
  }
}

function hasDb(): boolean {
  return !!db && typeof (db as any).select === "function";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

const postSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  content: z.string().default(""),
  metaTitle: z.string().default(""),
  metaDescription: z.string().default(""),
  focusKeyword: z.string().default(""),
  featuredImage: z.string().default(""),
  status: z.enum(["draft", "published", "scheduled"]).default("draft"),
  scheduledDate: z.string().nullable().optional(),
  publishedAt: z.string().nullable().optional(),
});

export function registerBlogRoutes(app: Express) {
  app.post(
    "/api/admin/blog/upload",
    requireAdmin,
    upload.single("image"),
    (req: Request, res: Response) => {
      if (!req.file) return void res.status(400).json({ message: "No file uploaded" });
      const url = `/uploads/${req.file.filename}`;
      res.json({ url });
    },
  );

  app.get("/api/admin/blog", requireAdmin, async (_req: Request, res: Response) => {
    if (!hasDb()) return void res.status(503).json({ message: "Database not configured" });
    const posts = await db.select().from(blogPosts).orderBy(desc(blogPosts.createdAt));
    res.json(posts);
  });

  app.post("/api/admin/blog", requireAdmin, async (req: Request, res: Response) => {
    if (!hasDb()) return void res.status(503).json({ message: "Database not configured" });
    const parsed = postSchema.safeParse(req.body);
    if (!parsed.success) {
      return void res.status(400).json({ message: parsed.error.errors[0].message });
    }
    const data = parsed.data;
    const scheduledDate = data.scheduledDate ? new Date(data.scheduledDate) : null;
    const publishedAt = data.publishedAt
      ? new Date(data.publishedAt)
      : data.status === "published"
        ? new Date()
        : null;

    try {
      const [post] = await db
        .insert(blogPosts)
        .values({
          title: data.title,
          slug: data.slug,
          content: data.content,
          metaTitle: data.metaTitle,
          metaDescription: data.metaDescription,
          focusKeyword: data.focusKeyword,
          featuredImage: data.featuredImage,
          status: data.status,
          scheduledDate,
          publishedAt,
        })
        .returning();

      res.status(201).json(post);
    } catch (e: any) {
      if (e.code === "23505") {
        return void res.status(409).json({ message: "Slug already exists. Choose a different slug." });
      }
      throw e;
    }
  });

  app.get("/api/admin/blog/:id", requireAdmin, async (req: Request, res: Response) => {
    if (!hasDb()) return void res.status(503).json({ message: "Database not configured" });
    const id = parseInt(req.params.id as string);
    if (Number.isNaN(id)) return void res.status(400).json({ message: "Invalid id" });
    const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
    if (!post) return void res.status(404).json({ message: "Post not found" });
    res.json(post);
  });

  app.patch("/api/admin/blog/:id", requireAdmin, async (req: Request, res: Response) => {
    if (!hasDb()) return void res.status(503).json({ message: "Database not configured" });
    const id = parseInt(req.params.id as string);
    if (Number.isNaN(id)) return void res.status(400).json({ message: "Invalid id" });
    const parsed = postSchema.partial().safeParse(req.body);
    if (!parsed.success) {
      return void res.status(400).json({ message: parsed.error.errors[0].message });
    }
    const data = parsed.data;
    const updates: Record<string, any> = { ...data };

    if ("scheduledDate" in data) {
      updates["scheduledDate"] = data.scheduledDate ? new Date(data.scheduledDate as string) : null;
    }

    if ("publishedAt" in data) {
      updates["publishedAt"] = data.publishedAt ? new Date(data.publishedAt as string) : null;
    } else if (data.status === "published") {
      const [existing] = await db.select({ publishedAt: blogPosts.publishedAt }).from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      if (!existing?.publishedAt) {
        updates["publishedAt"] = new Date();
      }
    }

    try {
      await db
        .update(blogPosts)
        .set(updates)
        .where(eq(blogPosts.id, id));

      const [post] = await db.select().from(blogPosts).where(eq(blogPosts.id, id)).limit(1);
      if (!post) return void res.status(404).json({ message: "Post not found" });
      res.json(post);
    } catch (e: any) {
      if (e.code === "23505") {
        return void res.status(409).json({ message: "Slug already exists. Choose a different slug." });
      }
      throw e;
    }
  });

  app.delete("/api/admin/blog/:id", requireAdmin, async (req: Request, res: Response) => {
    if (!hasDb()) return void res.status(503).json({ message: "Database not configured" });
    const id = parseInt(req.params.id as string);
    if (Number.isNaN(id)) return void res.status(400).json({ message: "Invalid id" });
    await db.delete(blogPosts).where(eq(blogPosts.id, id));
    res.json({ message: "Post deleted" });
  });

  app.get("/api/blog", async (_req: Request, res: Response) => {
    try {
      await autoPublishScheduled();
      const posts = await db
        .select({
          id: blogPosts.id,
          title: blogPosts.title,
          slug: blogPosts.slug,
          metaDescription: blogPosts.metaDescription,
          featuredImage: blogPosts.featuredImage,
          createdAt: blogPosts.createdAt,
          focusKeyword: blogPosts.focusKeyword,
        })
        .from(blogPosts)
        .where(eq(blogPosts.status, "published"))
        .orderBy(desc(blogPosts.createdAt));
      return res.json(posts);
    } catch (err) {
      console.error('DB error in /api/blog, returning fallback posts', err);
      return res.json([
        {
          id: 1,
          title: 'Welcome to the Blog',
          slug: 'welcome',
          metaDescription: 'Sample post used for local development.',
          featuredImage: '/favicon.png',
          createdAt: new Date().toISOString(),
          focusKeyword: 'sample',
        },
      ]);
    }
  });

  app.get("/api/blog/:slug", async (req: Request, res: Response) => {
    try {
      await autoPublishScheduled();
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      const [post] = await db
        .select()
        .from(blogPosts)
        .where(eq(blogPosts.slug, slug))
        .limit(1);
      if (!post || post.status !== "published") {
        return void res.status(404).json({ message: "Post not found" });
      }
      return res.json(post);
    } catch (err) {
      console.error('DB error in /api/blog/:slug, returning fallback when matching', err);
      const slug = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
      if (slug === 'welcome' || slug === 'sample') {
        return res.json({
          id: 1,
          title: 'Welcome to the Blog',
          slug: 'welcome',
          content: '<p>This is a sample post for local development.</p>',
          metaTitle: 'Welcome to the Blog',
          metaDescription: 'Sample post used for local development.',
          focusKeyword: 'sample',
          featuredImage: '/favicon.png',
          status: 'published',
          createdAt: new Date().toISOString(),
        });
      }
      return void res.status(500).json({ message: 'Internal server error' });
    }
  });

  app.get("/api/admin/slugify", requireAdmin, (req: Request, res: Response) => {
    const title = String(req.query["title"] || "");
    res.json({ slug: slugify(title) });
  });

  // Return last-modified time for frontend static pages (used to drive "Last Updated" info)
  app.get("/api/meta/page-last-modified", (req: Request, res: Response) => {
    const page = String(req.query.page || "").toLowerCase();
    const allowed: Record<string, string> = {
      "privacy-policy": path.join("src", "pages", "Privacy.tsx"),
      terms: path.join("src", "pages", "Terms.tsx"),
      "terms-and-conditions": path.join("src", "pages", "Terms.tsx"),
      disclaimer: path.join("src", "pages", "Disclaimer.tsx"),
    };

    if (!allowed[page]) return void res.status(400).json({ message: "Invalid page" });

    // webapp lives next to api-server in the workspace (artifacts/invisible-webapp)
    const webappPath = path.resolve(process.cwd(), "..", "invisible-webapp", allowed[page]);
    fs.stat(webappPath, (err, stats) => {
      if (err) {
        console.error("Failed to stat page file", webappPath, err);
        return void res.status(500).json({ message: "Could not determine last-modified" });
      }
      return res.json({ lastModified: stats.mtime.toISOString() });
    });
  });
}
