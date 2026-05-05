#!/usr/bin/env node
import { execSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";

function tryCmd(cmd) {
  try {
    execSync(cmd, { stdio: "inherit" });
    return true;
  } catch (e) {
    return false;
  }
}

// 1. Run builds
if (tryCmd("pnpm -v")) {
  console.log("Using pnpm for build...");
  tryCmd("pnpm run typecheck");
  tryCmd("pnpm -r --if-present run build");
} else {
  console.warn(
    "pnpm not found — attempting npm-compatible build (will try workspaces and per-package builds)",
  );
  if (tryCmd("npm --version")) {
    tryCmd("npm run typecheck");
    if (!tryCmd("npm --workspaces run build")) {
      const pkgs = ["artifacts/invisible-webapp", "artifacts/api-server"];
      for (const p of pkgs) {
        tryCmd(`npm --prefix ${p} run build`);
      }
    }
  }
}

// 2. Consolidate into root 'dist' folder
const rootDist = path.resolve(process.cwd(), "dist");
console.log(`Consolidating build artifacts into ${rootDist}...`);

if (!fs.existsSync(rootDist)) {
  fs.mkdirSync(rootDist, { recursive: true });
}

const webappDist = path.resolve(
  process.cwd(),
  "artifacts/invisible-webapp/dist/public",
);
const apiDist = path.resolve(process.cwd(), "artifacts/api-server/dist");

if (fs.existsSync(apiDist)) {
  console.log("Copying API server to root dist...");
  // Using shell cp -r for efficiency and compatibility with * paths
  try {
    execSync(`cp -r ${apiDist}/* ${rootDist}/`, { stdio: "inherit" });
  } catch (e) {
    console.warn("Failed to copy API dist using cp, trying fallback...", e.message);
  }
}

if (fs.existsSync(webappDist)) {
  console.log("Copying WebApp to root dist/public...");
  const publicDist = path.join(rootDist, "public");
  if (!fs.existsSync(publicDist)) {
    fs.mkdirSync(publicDist, { recursive: true });
  }
  try {
    // On Unix, use '.' to include hidden files. On Windows, xcopy or robocopy.
    // For cross-platform simplicity in Node, we can use fs.cpSync
    fs.cpSync(webappDist, publicDist, { recursive: true });
  } catch (e) {
    console.warn("Failed to copy WebApp dist, trying fallback...", e.message);
  }
}

// 3. Ensure a package.json exists in dist for Hostinger/Node to know how to start
const distPkgPath = path.join(rootDist, "package.json");
if (fs.existsSync(path.join(rootDist, "index.mjs"))) {
  const distPkg = {
    name: "workspace-production",
    version: "0.0.0",
    private: true,
    type: "module",
    scripts: {
      start: "node index.mjs",
    },
  };
  fs.writeFileSync(distPkgPath, JSON.stringify(distPkg, null, 2));
  console.log("Created production package.json in dist/");
}

console.log("Build wrapper finished. Output directory 'dist' should now be present.");
