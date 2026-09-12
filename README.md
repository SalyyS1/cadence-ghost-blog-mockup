# Bateson Ghost publication

Bateson is a complete Ghost publishing setup for a sports editorial site focused on running, cycling and swimming. The repository contains the client-approved static mockup, a dynamic Ghost 6 theme, local/production Docker configuration, sample content tooling and operating documentation.

## What is included

- Ghost Admin at `/ghost` for posts, pages, authors, tags, members and newsletters.
- Dynamic Bateson theme with home, article, page, tag, author and error templates.
- Ghost Members signup through Portal and native member forms.
- Ghost 6 + MySQL 8 Docker Compose environment with persistent volumes.
- Idempotent sample-content seed script using the Ghost Admin API.
- GScan validation and ZIP packaging for direct theme upload.
- The static approval build remains in `mockup/` and is deployed to GitHub Pages.

## Requirements

- Docker Desktop or Docker Engine with Compose for the full CMS.
- Node.js 22 or newer for Ghost 6-compatible validation, packaging and sample content.

## Start the full system

1. Copy `.env.example` to `.env` and replace every `change-me` value.
2. Run `docker compose up -d`.
3. Open `http://localhost:2368/ghost` and create the owner account.
4. In Ghost Admin, open **Settings → Design & branding → Change theme** and activate **Bateson**.
5. Create a Custom Integration, copy its Admin API key into `.env`, then run `npm run seed`.

The public site is available at `http://localhost:2368` and the administration area at `http://localhost:2368/ghost`.

## Theme development

```text
npm install
npm run audit:runtime
npm run theme:check
npm run theme:zip
npm run seed:dry
```

The upload-ready archive is generated at `dist/bateson.zip`.

## Content contract

Use these primary tag slugs so homepage sections populate automatically:

- `running`
- `cycling`
- `swimming`

Mark up to three posts as **Featured** for the homepage hero. Feature images are optional; the theme intentionally uses a soft grey media placeholder when no image is supplied.

## Documentation

- `docs/project-overview-pdr.md`
- `docs/codebase-summary.md`
- `docs/code-standards.md`
- `docs/design-guidelines.md`
- `docs/system-architecture.md`
- `docs/content-admin-guide.md`
- `docs/deployment-guide.md`
- `docs/backup-restore.md`
- `docs/security.md`
- `docs/project-roadmap.md`

Never commit `.env`, database exports or Ghost Admin API keys.
