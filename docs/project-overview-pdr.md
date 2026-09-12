# Bateson publication: product requirements

## Goal

Turn the approved Bateson editorial mockup into an operable sports publication without maintaining a custom CMS. Ghost supplies content management, staff access, members, newsletters and optional paid subscriptions; the Bateson theme supplies the public experience.

## Users

- Readers browse running, cycling and swimming stories on any screen.
- Members subscribe, sign in and access member-only posts.
- Editors create, schedule and feature stories in Ghost Admin.
- Administrators manage staff, navigation, branding, integrations and delivery settings.

## Included scope

- Dynamic home, article, page, tag, author and error views.
- Three editorial channels driven by exact tag slugs.
- Three featured stories in the home carousel.
- Advertising placeholders and two configurable product promotions.
- Native Ghost Members forms, Portal account UI and content access rules.
- Ghost 6, MySQL 8, HTTPS reverse proxy, persistent storage and backup guidance.
- Idempotent demo-content seeding and CI validation.

## Content rules

- Primary channel tags: `running`, `cycling`, `swimming`.
- Up to three featured posts populate the hero.
- A feature image is optional; missing media becomes a deliberate grey placeholder.
- Product promotion text, links and images are edited under Theme settings.

## Out of scope until credentials are supplied

- Production domain and DNS changes.
- SMTP/Mailgun and Stripe account connection.
- Migration of an existing subscriber list or production content.
