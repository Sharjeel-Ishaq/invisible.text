#!/usr/bin/env node
const { execSync } = require('child_process');
const { cpSync, rmSync } = require('node:fs');
const path = require('node:path');

function run(cmd) {
  console.log('>', cmd);
  execSync(cmd, { stdio: 'inherit' });
}

const root = path.resolve(__dirname, '..');
const webDist = path.resolve(root, 'Invisible-Text-WebApp', 'artifacts', 'invisible-webapp', 'dist', 'public');
const target = path.resolve(root, 'public_html');

try {
  // clean (workspace scripts)
  run('node ./Invisible-Text-WebApp/scripts/clean.js');
  // build (workspace scripts)
  run('node ./Invisible-Text-WebApp/scripts/build.js');
  // remove old public_html
  try { rmSync(target, { recursive: true, force: true }); } catch (e) {}
  // copy built files
  cpSync(webDist, target, { recursive: true });
  console.log('Deployed built web assets to', target);
} catch (err) {
  console.error(err);
  process.exit(1);
}
