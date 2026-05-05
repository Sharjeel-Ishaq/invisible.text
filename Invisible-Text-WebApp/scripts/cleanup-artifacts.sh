#!/usr/bin/env bash
# Safe cleanup script to remove `artifacts/` from git tracking and commit the change.
# Run this from the repository root after reviewing the files mentioned in CLEANUP_ARTIFACTS.md.

set -euo pipefail

echo "This script will remove 'artifacts/' from git tracking and update .gitignore."
read -p "Are you sure you want to continue? (yes/NO) " confirm
if [[ "$confirm" != "yes" ]]; then
  echo "Aborting. No changes made."
  exit 1
fi

# Ensure .gitignore changes are staged
git add .gitignore

if git ls-files --error-unmatch artifacts >/dev/null 2>&1; then
  echo "Removing tracked artifacts/ from git index..."
  git rm -r --cached artifacts || true
else
  echo "No tracked 'artifacts/' path found in the index."
fi

# Remove any committed env files under artifacts
git ls-files "artifacts/**/.env" >/dev/null 2>&1 && git rm --cached artifacts/**/.env || true

echo "Staging changes..."
git add -A

echo "Committing cleanup changes..."
git commit -m "chore: remove build artifacts from repo and ignore artifacts/"

echo "Cleanup commit created. If you want to permanently delete the artifacts folder from history, consider using git filter-repo or BFG (advanced).")

echo "Done."
