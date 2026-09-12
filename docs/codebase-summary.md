# Codebase summary

| Path | Purpose |
|---|---|
| `ghost-theme-bateson/` | Uploadable Ghost 6 theme and public assets |
| `mockup/` | Static client-approval build published by GitHub Pages |
| `scripts/seed-content.mjs` | Idempotent Ghost Admin API demo-content loader |
| `compose.yaml` | Ghost, MySQL and optional Caddy runtime |
| `compose.mail.yaml` | Production SMTP override |
| `docker/Caddyfile` | HTTPS reverse proxy configuration |
| `tests/` | Theme and infrastructure contract tests |
| `.github/workflows/` | Static preview deployment and full-system validation |
| `preview/` | Approved static screenshots |

Ghost owns authentication, roles, content storage, Admin, Members, comments, search, analytics and newsletters. Theme code remains presentation-only and never receives privileged credentials.
