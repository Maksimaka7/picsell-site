# Deploy notes — homepage v2

- Production branch: `main` (auto-publish on).
- Branch deploys: `feat/homepage-v2` enabled → permanent preview at
  https://feat-homepage-v2--idyllic-haupia-c797a4.netlify.app
- Deploy Previews: enabled for PRs against `main` (promotion PR: #21).
- Pinned Hugo: 0.139.0 extended (netlify.toml). Local 0.163+ fails on blog template.
- Build artifacts (`public/`, `resources/`) are gitignored — never commit them.

_This file exists to document preview URLs; its first commit also triggered the initial branch deploy._
