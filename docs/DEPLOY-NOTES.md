# Deploy notes — homepage v2

- Production branch: `main` (auto-publish on).
- Branch deploys: `feat/homepage-v2` enabled → permanent preview at
  https://feat-homepage-v2--idyllic-haupia-c797a4.netlify.app
- Deploy Previews: enabled for PRs against `main` (promotion PR: #21).
- Pinned Hugo: 0.139.0 extended (netlify.toml). Local 0.163+ fails on blog template.
- Build artifacts (`public/`, `resources/`) are gitignored — never commit them.

Trigger log:
- 2026-07-14 13:37 — first trigger commit (before branch-deploy setting was saved; no build).
- 2026-07-14 13:5x — second trigger commit (after settings saved) — this one should build.
