# Deployment guide

## Local or staging

1. Install Docker Desktop/Engine and Node.js 22.
2. Copy `.env.example` to `.env`.
3. Replace both MySQL passwords with different random values.
4. Run `docker compose up -d`.
5. Check `docker compose ps` and `docker compose logs -f ghost`.
6. Open `http://localhost:2368/ghost` and complete setup.

## Production on a Docker host

1. Point the domain's A/AAAA record to the server.
2. Set `SITE_URL=https://your-domain.example` and `DOMAIN=your-domain.example`.
3. Configure the SMTP fields in `.env`.
4. Allow inbound TCP 80/443 and UDP 443; do not expose MySQL.
5. Start the full stack:

```text
docker compose -f compose.yaml -f compose.mail.yaml --profile production up -d
```

Caddy obtains and renews TLS certificates automatically. Verify the homepage, `/ghost`, member signup, passwordless member login, image upload and a test newsletter.

## Theme-only deployment

Run `npm run theme:check` and `npm run theme:zip`. Upload `dist/bateson.zip` in **Ghost Admin → Settings → Design & branding → Change theme → Upload theme**.

## Required production values

- `SITE_URL`, `DOMAIN`
- `MYSQL_PASSWORD`, `MYSQL_ROOT_PASSWORD`
- `MAIL_FROM`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_SECURE`, `MAIL_USER`, `MAIL_PASSWORD`

For bulk newsletters, configure a supported Mailgun integration from Ghost Admin. Publish SPF, DKIM and DMARC DNS records before a real send.

## Updating

1. Take a database and content backup.
2. Pull reviewed repository changes.
3. Run validation and package checks.
4. Run `docker compose pull` and then the production `up -d` command.
5. Verify health before removing the previous backup.

Container images are patch-pinned in `compose.yaml`. Review release notes and test backups before changing those pins.
