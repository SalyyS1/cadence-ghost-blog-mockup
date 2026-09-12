import {createHmac} from 'node:crypto';

const dryRun = process.argv.includes('--dry-run');
const forceUpdate = process.argv.includes('--force');
const apiUrl = (process.env.GHOST_ADMIN_API_URL ?? '').replace(/\/$/, '');
const adminKey = process.env.GHOST_ADMIN_API_KEY ?? '';

const tags = [
  {name: 'Running', slug: 'running', description: 'Race reports, training and the miles between.'},
  {name: 'Cycling', slug: 'cycling', description: 'Road, gravel and routes worth riding.'},
  {name: 'Swimming', slug: 'swimming', description: 'Pool sessions, open water and better technique.'}
];

const stories = [
  ['London Marathon 2026', 'london-marathon-2026', 'running', 'The course, the pacing plan and the small decisions that shape race day.', true],
  ['Madrid Marathon 2026', 'madrid-marathon-2026', 'running', 'A steady build, a warm course and a patient second half.', false],
  ['Barcelona Marathon 2026', 'barcelona-marathon-2026', 'running', 'Where the route turns hard and the plan has to flex.', false],
  ['Seville Marathon 2026', 'seville-marathon-2026', 'running', 'Fast roads, quiet focus and a finish built from small gains.', false],
  ['Valencia Marathon 2026', 'valencia-marathon-2026', 'running', 'The long run that taught me to leave something in reserve.', false],
  ['Mallorca Classic 2026', 'mallorca-classic-2026', 'cycling', 'A first climb, a patient group and the right gear for a long day.', true],
  ['Barcelona Gran Fondo 2026', 'barcelona-gran-fondo-2026', 'cycling', 'Wind direction, three café stops and one climb worth saving for.', false],
  ['Seville Circuit 2026', 'seville-circuit-2026', 'cycling', 'A compact frame bag, a long road and a better way to carry less.', false],
  ['Valencia Time Trial 2026', 'valencia-time-trial-2026', 'cycling', 'The simple indoor session that made the outside miles feel easier.', false],
  ['San Sebastian Classic 2026', 'san-sebastian-classic-2026', 'cycling', 'Ten minutes of maintenance that kept a good ride from ending early.', false],
  ['Madrid Swim Meet 2026', 'madrid-swim-meet-2026', 'swimming', 'Breathing drills that made the final hundred metres manageable.', true],
  ['Barcelona Open 2026', 'barcelona-open-2026', 'swimming', 'A 3,000 metre set, a pace clock and one useful change in rhythm.', false],
  ['Seville Open Water 2026', 'seville-open-water-2026', 'swimming', 'Cold water, sighting practice and a steadier line through the swell.', false],
  ['Valencia Tri Swim 2026', 'valencia-tri-swim-2026', 'swimming', 'Leaving the water with legs that still work and a calm transition.', false],
  ['San Sebastian Swim 2026', 'san-sebastian-swim-2026', 'swimming', 'How an easy session can build a stronger base when the effort stays honest.', false]
].map(([title, slug, tag, excerpt, featured], index) => ({
  title,
  slug,
  tag,
  excerpt,
  featured,
  publishedAt: new Date(Date.UTC(2026, 0, Math.max(1, 31 - index))).toISOString(),
  html: `<p>${excerpt}</p><p>The useful part of any session is not the headline number. It is the decision that can be repeated when the week becomes busy and the conditions change.</p><h2>The plan</h2><p>Start calmly, keep the effort measurable and leave enough room to finish with good form. That simple structure makes the next session easier to understand.</p><ul><li>Prepare the equipment the night before.</li><li>Use effort before pace.</li><li>Write down one lesson after finishing.</li></ul><p>Consistency does not need a perfect week. It needs a plan that survives an ordinary one.</p>`
}));

const pages = [
  {
    title: 'About Bateson',
    slug: 'about',
    custom_excerpt: 'Clear stories for people who move.',
    html: '<p>Bateson is an independent publication about running, cycling and swimming.</p><h2>Our approach</h2><p>We publish practical race reports, honest training notes and equipment stories that respect the reader\'s time.</p>'
  }
];

const encode = (value) => Buffer.from(JSON.stringify(value)).toString('base64url');

function createToken() {
  const separator = adminKey.indexOf(':');
  if (separator < 1) throw new Error('GHOST_ADMIN_API_KEY must use the id:hex-secret format.');
  const id = adminKey.slice(0, separator);
  const secret = adminKey.slice(separator + 1);
  if (!/^[a-f\d]+$/i.test(secret)) throw new Error('Ghost Admin API secret must be hexadecimal.');

  const now = Math.floor(Date.now() / 1000);
  const header = encode({alg: 'HS256', typ: 'JWT', kid: id});
  const payload = encode({iat: now, exp: now + 300, aud: '/admin/'});
  const unsigned = `${header}.${payload}`;
  const signature = createHmac('sha256', Buffer.from(secret, 'hex')).update(unsigned).digest('base64url');
  return `${unsigned}.${signature}`;
}

async function request(path, {method = 'GET', body, allowNotFound = false} = {}) {
  const response = await fetch(`${apiUrl}/ghost/api/admin${path}`, {
    method,
    headers: {
      Accept: 'application/json',
      'Accept-Version': 'v6.0',
      Authorization: `Ghost ${createToken()}`,
      ...(body ? {'Content-Type': 'application/json'} : {})
    },
    body: body ? JSON.stringify(body) : undefined
  });

  if (allowNotFound && response.status === 404) return null;
  if (!response.ok) {
    const detail = await response.text();
    throw new Error(`${method} ${path} failed (${response.status}): ${detail.slice(0, 500)}`);
  }
  return response.status === 204 ? null : response.json();
}

async function upsertTag(tag) {
  const existing = await request(`/tags/slug/${encodeURIComponent(tag.slug)}/`, {allowNotFound: true});
  if (!existing) {
    await request('/tags/', {method: 'POST', body: {tags: [tag]}});
    return 'created';
  }
  if (!forceUpdate) return 'exists';
  const current = existing.tags[0];
  await request(`/tags/${current.id}/`, {method: 'PUT', body: {tags: [{...tag, updated_at: current.updated_at}]}});
  return 'updated';
}

async function upsertResource(type, item) {
  const existing = await request(`/${type}/slug/${encodeURIComponent(item.slug)}/?formats=html`, {allowNotFound: true});
  if (existing && !forceUpdate) return 'exists';

  const payload = type === 'posts'
    ? {title: item.title, slug: item.slug, custom_excerpt: item.excerpt, html: item.html, status: 'published', featured: item.featured, published_at: item.publishedAt, tags: [{slug: item.tag}]}
    : {...item, status: 'published'};

  if (!existing) {
    await request(`/${type}/?source=html`, {method: 'POST', body: {[type]: [payload]}});
    return 'created';
  }

  const current = existing[type][0];
  await request(`/${type}/${current.id}/?source=html`, {method: 'PUT', body: {[type]: [{...payload, updated_at: current.updated_at}]}});
  return 'updated';
}

if (dryRun) {
  console.log(JSON.stringify({dryRun: true, tags: tags.map(({slug}) => slug), posts: stories.length, pages: pages.length, featuredPosts: stories.filter(({featured}) => featured).length}, null, 2));
  process.exit(0);
}

if (!apiUrl || !/^https?:\/\//.test(apiUrl)) throw new Error('Set GHOST_ADMIN_API_URL to the Ghost site origin.');
if (!adminKey) throw new Error('Set GHOST_ADMIN_API_KEY from a Ghost Custom Integration.');

const summary = {created: 0, updated: 0, exists: 0};
const record = (status, label) => {
  summary[status] += 1;
  console.log(`${status.padEnd(7)} ${label}`);
};

for (const tag of tags) record(await upsertTag(tag), `tag:${tag.slug}`);
for (const story of stories) record(await upsertResource('posts', story), `post:${story.slug}`);
for (const page of pages) record(await upsertResource('pages', page), `page:${page.slug}`);

console.log(`Seed complete: ${summary.created} created, ${summary.updated} updated, ${summary.exists} already present.`);
