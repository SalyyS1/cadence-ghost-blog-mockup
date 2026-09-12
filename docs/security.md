# Security notes

## Secrets

Keep MySQL, SMTP and Ghost Admin API credentials only in `.env` or the production secret manager. The theme is public browser-facing code and must never contain an Admin API key.

## Dependency boundary

The published theme has no npm runtime dependency. `bestzip` is a development tool only and does not enter the Ghost container or theme archive. GScan is version-pinned and fetched on demand for validation. Run `npm run audit:runtime` in CI to enforce a clean production dependency set.

The currently pinned official GScan release brings a transitive `extract-zip` advisory that applies when extracting a malicious, untrusted ZIP. It is not retained as a project dependency, and the scripted check scans the source directory rather than an archive. Do not use this toolchain to inspect third-party theme archives until the upstream dependency is patched.

## Operations

- Use HTTPS and an exact public `SITE_URL` in production.
- Keep MySQL on the private Docker network.
- Grant Ghost staff the least-privileged role and enable account protections.
- Patch container pins intentionally after backup and staging verification.
- Restrict `/ghost` at the network layer when the editorial team has fixed office/VPN access.
- Test restore procedures and member email delivery before each major upgrade.
