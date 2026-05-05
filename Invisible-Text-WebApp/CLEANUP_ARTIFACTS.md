## Cleanup artifacts/ and generated files

This document explains what the `scripts/cleanup-artifacts.sh` helper does and lists manual checks you should perform before running it.

What the script does

- Stages `.gitignore` changes (already updated to ignore `artifacts/`).
- Removes `artifacts/` from the git index with `git rm -r --cached artifacts`.
- Removes any committed `.env` files under `artifacts/` from git tracking.
- Commits the changes as `chore: remove build artifacts from repo and ignore artifacts/`.

Manual checks before running

1. Inspect `artifacts/` and ensure there is no unique content you need to keep.
   - Examples to verify: `artifacts/api-server/public/uploads` or other user uploads.
2. Confirm CI/deployment does not expect `artifacts/` to be present in the repository.
3. Verify secrets in any `.env` files are moved to your secrets manager / environment configuration.

If you want the cleanup to be applied to the repository history (to shrink repo size), use advanced tools:

- `git filter-repo` (recommended) or the BFG Repo-Cleaner. These are destructive and require backups.

Usage

1. Review the checks above.
2. Make a backup or create a branch: `git checkout -b cleanup/artifacts-backup`
3. Run:

```bash
bash scripts/cleanup-artifacts.sh
```

Afterwards

- Push the commit: `git push origin HEAD`.
- If you used history-rewrite tools, follow their push instructions (force push to protected branches only with care).
