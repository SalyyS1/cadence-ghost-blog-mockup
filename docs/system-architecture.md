# System architecture

## Runtime

```text
Browser
  │ HTTPS
  ▼
Caddy reverse proxy
  │ HTTP on private Docker network
  ▼
Ghost 6 ─────────────► SMTP/Mailgun (transactional + newsletter mail)
  │
  ├── Bateson Handlebars theme
  ├── Ghost Admin /ghost
  ├── Members + Portal
  └── MySQL 8 (private Docker network)
```

## Components

- `ghost-theme-bateson/`: server-rendered theme. It has no privileged API key.
- `ghost`: official Ghost 6 container. Handles Admin authentication, roles, content APIs, sessions, members and newsletters.
- `database`: MySQL 8 with a private network and persistent named volume.
- `caddy`: optional `production` profile that terminates TLS and forwards standard proxy headers.
- `scripts/seed-content.mjs`: one-time operator tool authenticated with a short-lived Admin API JWT.

## Security boundaries

- MySQL has no host port and is reachable only on the internal backend network.
- Ghost's direct port binds to loopback by default; public traffic enters through Caddy.
- Secrets live in `.env`, which Git ignores. `.env.example` contains placeholders only.
- Admin API credentials are never exposed to browser code or the theme.
- Caddy provides HTTPS in production; Ghost must receive an `https://` `SITE_URL`.
- Staff accounts, roles and optional two-factor authentication are managed by Ghost Admin.

## Persistence

- `ghost_content`: uploads, themes, images, logs and site-level content files.
- `mysql_data`: publication database.
- `caddy_data` and `caddy_config`: TLS certificates and proxy state.

Both Ghost content and MySQL data are required for a complete restore.
