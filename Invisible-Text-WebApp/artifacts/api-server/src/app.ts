import express, { type Express, type Request, type Response, type NextFunction } from "express";
import cors from "cors";
import helmet from "helmet";
import pinoHttp from "pino-http";
import session from "express-session";
import pgSession from "connect-pg-simple";
import router from "./routes";
import { logger } from "./lib/logger";
import { env } from "./lib/env";
import { registerAdminRoutes, seedAdmin } from "./routes/admin";
import { registerBlogRoutes } from "./routes/blog";
import { pool } from "@workspace/db";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PostgresStore = pgSession(session);

const app: Express = express();

app.use(helmet());
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  }),
);

const allowedOrigins = process.env["ALLOWED_ORIGINS"]?.split(",") || [];
app.use(cors({
  origin: env.NODE_ENV === "production" ? allowedOrigins : true,
  credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const sessionStore = pool ? new PostgresStore({ pool } as any) : undefined;

app.use(
  session({
    store: sessionStore,
    secret: env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: env.NODE_ENV === "production",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      sameSite: "lax",
    },
  }),
);

const uploadsDir = path.join(process.cwd(), "public", "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
app.use("/uploads", express.static(uploadsDir));

const publicDir = path.join(process.cwd(), "public");
app.use(express.static(publicDir));

app.use("/api", router);

// SPA fallback
app.get("*", (_req, res, next) => {
  if (_req.path.startsWith("/api")) return next();
  const indexHtml = path.join(publicDir, "index.html");
  if (fs.existsSync(indexHtml)) {
    res.sendFile(indexHtml);
  } else {
    next();
  }
});

(async () => {
  try {
    await seedAdmin();
    registerAdminRoutes(app);
    registerBlogRoutes(app);
  } catch (error) {
    logger.error({ error }, "Failed to initialize database-dependent features. They will be unavailable.");
  }
})();

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
  const status = (err as any)?.status || (err as any)?.statusCode || 500;
  const message = env.NODE_ENV === "production" ? "Internal Server Error" : (err as any)?.message || "Internal Server Error";

  if (status === 500) {
    logger.error({ err }, "Unhandled server error");
  }

  res.status(status).json({ message });
});

export default app;
