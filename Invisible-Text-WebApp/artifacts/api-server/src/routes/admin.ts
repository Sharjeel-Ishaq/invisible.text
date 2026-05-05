import { type Express, type Request, type Response, type NextFunction } from "express";
import bcrypt from "bcrypt";
import { db } from "@workspace/db";
import { adminUsers } from "@workspace/db";
import { eq, or } from "drizzle-orm";
import { z } from "zod";
import { env } from "../lib/env";

const SALT_ROUNDS = 12;

export async function seedAdmin() {
  if (!env.ADMIN_USERNAME || !env.ADMIN_PASSWORD || !env.ADMIN_EMAIL) {
    return;
  }

  const existing = await db.select().from(adminUsers).limit(1);
  if (existing.length === 0) {
    const passwordHash = await bcrypt.hash(env.ADMIN_PASSWORD, SALT_ROUNDS);
    await db.insert(adminUsers).values({
      username: env.ADMIN_USERNAME,
      email: env.ADMIN_EMAIL,
      passwordHash,
    });
  }
}

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if ((req.session as any).adminId) {
    return next();
  }
  res.status(401).json({ message: "Unauthorized" });
}

const loginSchema = z.object({
  identifier: z.string().min(1),
  password: z.string().min(1),
});

const updateSchema = z.object({
  currentPassword: z.string().min(1),
  newUsername: z.string().min(3).optional(),
  newEmail: z.string().email().optional(),
  newPassword: z.string().min(8).optional(),
});

export function registerAdminRoutes(app: Express) {
  app.post("/api/admin/login", async (req: Request, res: Response) => {
    const parsed = loginSchema.safeParse(req.body);
    if (!parsed.success) {
      return void res.status(400).json({ message: parsed.error.errors[0].message });
    }
    const { identifier, password } = parsed.data;

    const [admin] = await db
      .select()
      .from(adminUsers)
      .where(or(eq(adminUsers.username, identifier), eq(adminUsers.email, identifier)))
      .limit(1);

    if (!admin) {
      return void res.status(401).json({ message: "Invalid credentials" });
    }

    const valid = await bcrypt.compare(password, admin.passwordHash);
    if (!valid) {
      return void res.status(401).json({ message: "Invalid credentials" });
    }

    (req.session as any).adminId = admin.id;
    res.json({ message: "Login successful" });
  });

  app.post("/api/admin/logout", requireAdmin, (req: Request, res: Response) => {
    req.session.destroy(() => {
      res.json({ message: "Logged out" });
    });
  });

  app.get("/api/admin/me", requireAdmin, async (req: Request, res: Response) => {
    const adminId = (req.session as any).adminId;
    const [admin] = await db
      .select({ id: adminUsers.id, username: adminUsers.username, email: adminUsers.email })
      .from(adminUsers)
      .where(eq(adminUsers.id, adminId))
      .limit(1);
    if (!admin) return void res.status(404).json({ message: "Not found" });
    res.json(admin);
  });

  app.patch("/api/admin/update", requireAdmin, async (req: Request, res: Response) => {
    const parsed = updateSchema.safeParse(req.body);
    if (!parsed.success) {
      return void res.status(400).json({ message: parsed.error.errors[0].message });
    }
    const { currentPassword, newUsername, newEmail, newPassword } = parsed.data;
    const adminId = (req.session as any).adminId;

    const [admin] = await db.select().from(adminUsers).where(eq(adminUsers.id, adminId)).limit(1);
    if (!admin) return void res.status(404).json({ message: "Not found" });

    const valid = await bcrypt.compare(currentPassword, admin.passwordHash);
    if (!valid) return void res.status(401).json({ message: "Current password is incorrect" });

    const updates: Partial<{ username: string; email: string; passwordHash: string }> = {};
    if (newUsername) updates.username = newUsername;
    if (newEmail) updates.email = newEmail;
    if (newPassword) updates.passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);

    if (Object.keys(updates).length === 0) {
      return void res.status(400).json({ message: "Nothing to update" });
    }

    try {
      await db
        .update(adminUsers)
        .set(updates)
        .where(eq(adminUsers.id, adminId));

      const [updated] = await db
        .select({ id: adminUsers.id, username: adminUsers.username, email: adminUsers.email })
        .from(adminUsers)
        .where(eq(adminUsers.id, adminId))
        .limit(1);

      res.json(updated);
    } catch (e: any) {
      if (e.code === "ER_DUP_ENTRY" || e.code === "23505") {
        return void res.status(409).json({ message: "Username or email already taken" });
      }
      throw e;
    }
  });
}
