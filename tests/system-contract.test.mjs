import assert from 'node:assert/strict';
import {spawnSync} from 'node:child_process';
import {readFileSync} from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const root = path.resolve(import.meta.dirname, '..');
const read = (file) => readFileSync(path.join(root, file), 'utf8');

test('Docker stack pins Ghost, MySQL and Caddy and keeps MySQL private', () => {
  const compose = read('compose.yaml');

  assert.match(compose, /ghost:6\.54\.1-alpine/);
  assert.match(compose, /mysql:8\.4\.11/);
  assert.match(compose, /caddy:2\.11\.4-alpine/);
  assert.match(compose, /GHOST_BIND_ADDRESS:-127\.0\.0\.1/);
  assert.match(compose, /backend:\s*\n\s*internal: true/);
  assert.match(compose, /\.\/ghost-theme-bateson:\/var\/lib\/ghost\/content\/themes\/bateson:ro/);

  const databaseBlock = compose.slice(compose.indexOf('  database:'), compose.indexOf('\n  ghost:'));
  assert.doesNotMatch(databaseBlock, /\n\s+ports:/, 'MySQL must not publish a host port');
});

test('environment template contains placeholders instead of usable credentials', () => {
  const environment = read('.env.example');

  assert.match(environment, /MYSQL_PASSWORD=change-me/);
  assert.match(environment, /GHOST_ADMIN_API_KEY=replace-with/);
  assert.doesNotMatch(environment, /AKIA[0-9A-Z]{16}/);
  assert.doesNotMatch(environment, /-----BEGIN (?:RSA |EC )?PRIVATE KEY-----/);
});

test('seed dry-run is deterministic and does not require credentials', () => {
  const result = spawnSync(process.execPath, ['scripts/seed-content.mjs', '--dry-run'], {
    cwd: root,
    encoding: 'utf8',
    env: {}
  });

  assert.equal(result.status, 0, result.stderr);
  const summary = JSON.parse(result.stdout);
  assert.deepEqual(summary.tags, ['running', 'cycling', 'swimming']);
  assert.equal(summary.posts, 15);
  assert.equal(summary.pages, 1);
  assert.equal(summary.featuredPosts, 3);
});

test('theme source contains no privileged Admin API credential', () => {
  const templates = [
    'ghost-theme-bateson/default.hbs',
    'ghost-theme-bateson/index.hbs',
    'ghost-theme-bateson/post.hbs',
    'ghost-theme-bateson/assets/js/site.js'
  ].map(read).join('\n');

  assert.doesNotMatch(templates, /GHOST_ADMIN_API_KEY|Ghost\s+[a-z\d]+\.[a-z\d]+\.[a-z\d]+/i);
});
