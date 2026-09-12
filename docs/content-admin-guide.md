# Content and Admin guide

## First login

1. Open `/ghost` on the site URL.
2. Create the owner account using a real operational email.
3. Open **Settings → Design & branding → Change theme** and activate **Bateson**.
4. Set publication title, description, logo and accent colour.

## Homepage management

- Add one primary tag to each post: `running`, `cycling` or `swimming`.
- Mark up to three posts as **Featured** to place them in the hero carousel.
- Each channel displays its five newest tagged posts.
- Edit channel introductions, adverts, promotions and newsletter copy under **Design & branding → Theme**.
- Configure primary and secondary navigation under **Settings → Navigation**.

## Publishing

Ghost Admin supports drafts, previews, scheduled publishing, multiple authors, internal tags, excerpts, SEO metadata and social cards. Add meaningful alt text and captions to every editorial image. Use post access settings for public, member-only or paid content.

## Members and newsletters

1. Open **Settings → Membership** and enable member signup.
2. Configure Portal branding and account options.
3. Create or rename newsletters and set sender/reply-to addresses.
4. Test transactional signup/login email before sending a publication.
5. Connect Stripe only if paid tiers are required.

The Bateson subscribe forms create Ghost members directly. Success requires working transactional email so readers can confirm or sign in.

## Comments and analytics

Enable member comments under **Settings → Membership → Access**. The post theme renders Ghost's native discussion UI, while owners and administrators can moderate threads from Ghost Admin. Ghost's native Analytics area tracks web traffic, newsletter performance and audience growth without a separate theme integration.

## Staff

Invite staff from **Settings → Staff** and grant the least-privileged suitable role. Keep the Owner role limited to the publication owner; use Editor or Author for routine publishing.

## Demo content

Create a Custom Integration in **Settings → Integrations**, copy its Admin API key into local `.env`, then run:

```text
npm run seed
```

Existing seeded slugs are skipped. Use `npm run seed -- --force` only when you intentionally want the seed copy to replace those posts.
