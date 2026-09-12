import assert from 'node:assert/strict';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import test from 'node:test';

const repositoryRoot = path.resolve(import.meta.dirname, '..');
const themeRoot = path.join(repositoryRoot, 'ghost-theme-bateson');
const readThemeFile = (file) => readFileSync(path.join(themeRoot, file), 'utf8');

test('theme includes every required Ghost template', () => {
  const requiredFiles = [
    'package.json',
    'default.hbs',
    'index.hbs',
    'post.hbs',
    'page.hbs',
    'tag.hbs',
    'author.hbs',
    'error.hbs',
    'assets/css/screen.css',
    'assets/js/site.js'
  ];

  for (const file of requiredFiles) {
    assert.ok(existsSync(path.join(themeRoot, file)), `Missing required theme file: ${file}`);
  }
});

test('theme package targets Ghost 6 and stays inside the custom-setting limit', () => {
  const themePackage = JSON.parse(readThemeFile('package.json'));
  const settings = themePackage.config?.custom ?? {};

  assert.match(themePackage.engines.ghost, /6/);
  assert.ok(Object.keys(settings).length <= 20, 'Ghost permits at most 20 custom settings');
  assert.equal(themePackage.config.card_assets, true);
});

test('base layout exposes Ghost metadata, assets and shared chrome', () => {
  const layout = readThemeFile('default.hbs');

  for (const token of ['{{ghost_head}}', '{{ghost_foot}}', '{{body_class}}', '{{{body}}}']) {
    assert.ok(layout.includes(token), `default.hbs must include ${token}`);
  }
  assert.match(layout, /asset\s+["']css\/screen\.css["']/);
  assert.match(layout, /asset\s+["']js\/site\.js["']/);
});

test('homepage queries all three sport channels and featured stories', () => {
  const homepage = readThemeFile('index.hbs');

  assert.match(homepage, /featured:true/);
  for (const slug of ['running', 'cycling', 'swimming']) {
    assert.ok(homepage.includes(`tag:${slug}`), `Homepage must query the ${slug} tag`);
  }
  assert.match(homepage, /@custom\.first_promo_title/);
  assert.match(homepage, /@custom\.second_promo_title/);
});

test('post template renders managed content and publication metadata', () => {
  const post = readThemeFile('post.hbs');

  for (const token of ['{{{content}}}', '{{title}}', '{{date', '{{reading_time', '{{#primary_author}}']) {
    assert.ok(post.includes(token), `post.hbs must include ${token}`);
  }
});

test('newsletter partial submits through Ghost Members', () => {
  const newsletter = readThemeFile('partials/newsletter.hbs');

  assert.match(newsletter, /data-members-form=["']subscribe["']/);
  assert.match(newsletter, /data-members-email/);
  assert.match(newsletter, /data-members-error/);
});

test('all referenced local partials exist', () => {
  const templateFiles = [
    'default.hbs',
    'index.hbs',
    'post.hbs',
    'page.hbs',
    'tag.hbs',
    'author.hbs',
    'error.hbs'
  ];

  for (const template of templateFiles) {
    const source = readThemeFile(template);
    for (const match of source.matchAll(/{{>\s*["']?([\w/-]+)["']?/g)) {
      const partialPath = path.join(themeRoot, 'partials', `${match[1]}.hbs`);
      assert.ok(existsSync(partialPath), `${template} references missing partial ${match[1]}`);
    }
  }
});
