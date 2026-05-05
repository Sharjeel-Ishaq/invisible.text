import { Router, type IRouter, type Request, type Response } from "express";
import healthRouter from "./health";
import { db } from "@workspace/db";
import { contactSubmissions } from "@workspace/db";
import { z } from "zod";
import { generateInvisibleText } from "../lib/generator";

const router: IRouter = Router();

router.use(healthRouter);

router.post("/generate", (req: Request, res: Response) => {
  const requestedLength = parseInt(String(req.body?.length)) || 100;
  const text = generateInvisibleText(requestedLength);
  const length = text.length;
  res.json({ text, length, message: `${length} invisible character${length === 1 ? "" : "s"} generated successfully.` });
});

const contactSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  message: z.string().min(1),
});

router.post("/contact", async (req: Request, res: Response) => {
  const parsed = contactSchema.safeParse(req.body);
  if (!parsed.success) {
    return void res.status(400).json({ message: parsed.error.errors[0].message });
  }
  const { name, email, message } = parsed.data;
  try {
    await db.insert(contactSubmissions).values({ name, email, message });
  } catch {}
  res.json({ message: "Contact form submitted successfully" });
});

export default router;
