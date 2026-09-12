# Code standards

## Theme

- Keep required Ghost helpers in place: `asset`, `body_class`, `post_class`, `ghost_head`, `ghost_foot`.
- Prefer reusable partials over repeated Handlebars blocks.
- Query public content with `get`; never call the Admin API from theme JavaScript.
- Preserve feature-image fallbacks and accessible labels.
- Run GScan against both the source directory and packaged ZIP before release.

## CSS and JavaScript

- Use tokens from `assets/css/tokens.css`; avoid one-off colours and spacing.
- Scope editor content styles under `.gh-content` to avoid Admin-generated class collisions.
- Keep responsive checks at 900px and 560px unless a component requires an additional breakpoint.
- Honour reduced-motion preferences and keyboard interaction.
- JavaScript must safely no-op when its target component is absent.

## Infrastructure

- Pin container patch versions and review upgrades intentionally.
- Do not expose MySQL or commit `.env`.
- Keep seed operations idempotent; require `--force` before replacing existing content.
- Update tests and operating documentation with behavioural changes.
