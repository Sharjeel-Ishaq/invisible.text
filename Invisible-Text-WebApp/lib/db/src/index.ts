/// <reference types="node" />

import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

if (!process.env.DATABASE_URL) {
  console.warn(
    "DATABASE_URL is not set. Database features will be unavailable.",
  );
}

export const pool = process.env.DATABASE_URL
  ? mysql.createPool(process.env.DATABASE_URL)
  : null;

export const db = pool
  ? drizzle(pool, { schema, mode: "default" })
  : ({} as any);

export * from "./schema";
