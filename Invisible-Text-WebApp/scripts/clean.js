#!/usr/bin/env node
import { rm } from "node:fs/promises";
import path from "node:path";

const workspaceRoot = path.resolve(
  new URL(import.meta.url).pathname,
  "..",
  "..",
);
const targets = [
  path.resolve(workspaceRoot, "Invisible-Text-WebApp", ".local"),
  path.resolve(
    workspaceRoot,
    "Invisible-Text-WebApp",
    "artifacts",
    "invisible-webapp",
    "dist",
  ),
  path.resolve(
    workspaceRoot,
    "Invisible-Text-WebApp",
    "artifacts",
    "mockup-sandbox",
    "dist",
  ),
  path.resolve(
    workspaceRoot,
    "Invisible-Text-WebApp",
    "artifacts",
    "api-server",
    "dist",
  ),
];

async function clean() {
  for (const t of targets) {
    try {
      console.log("Removing", t);
      await rm(t, { recursive: true, force: true });
    } catch (err) {
      console.warn("Failed to remove", t, err.message || err);
    }
  }
  console.log("Clean completed.");
}

clean().catch((e) => {
  console.error(e);
  process.exit(1);
});
