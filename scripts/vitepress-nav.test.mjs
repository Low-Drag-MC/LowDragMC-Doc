import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import { buildLocaleNav, buildSidebar, parsePagesFile, routeForFile } from './vitepress-nav.mjs';

test('parsePagesFile reads title and nav entries', () => {
  const parsed = parsePagesFile('title: LDLib2\nnav:\n  - index.md\n  - ui\n  - ...\n');

  assert.deepEqual(parsed, {
    title: 'LDLib2',
    nav: ['index.md', 'ui', '...']
  });
});

test('routeForFile creates encoded VitePress routes', () => {
  assert.equal(
    routeForFile('en', path.join('photon2', 'Java Integration', 'index.md')),
    '/en/photon2/Java%20Integration/'
  );
  assert.equal(
    routeForFile('zh', path.join('ldlib2', 'ui', 'getting_start.md')),
    '/zh/ldlib2/ui/getting_start'
  );
});

test('buildSidebar preserves .pages order and limits output to the selected mod', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'lowdrag-nav-'));
  const docs = path.join(root, 'docs');
  const mod = path.join(docs, 'en', 'ldlib2');
  await mkdir(path.join(mod, 'ui'), { recursive: true });
  await mkdir(path.join(mod, 'sync'), { recursive: true });
  await mkdir(path.join(docs, 'en', 'photon2'), { recursive: true });

  await writeFile(path.join(mod, '.pages'), 'title: LDLib2\nnav:\n  - index.md\n  - ui\n  - ...\n');
  await writeFile(path.join(mod, 'index.md'), '# Intro\n');
  await writeFile(path.join(mod, 'java_integration.md'), '# Java Integration\n');
  await writeFile(path.join(mod, 'ui', '.pages'), 'title: UI\nnav:\n  - index.md\n  - getting_start.md\n');
  await writeFile(path.join(mod, 'ui', 'index.md'), '# UI Overview\n');
  await writeFile(path.join(mod, 'ui', 'getting_start.md'), '# Getting Started\n');
  await writeFile(path.join(mod, 'sync', 'index.md'), '# Sync\n');
  await writeFile(path.join(docs, 'en', 'photon2', 'index.md'), '# Photon\n');

  const sidebar = await buildSidebar(docs, 'en', 'ldlib2');

  assert.equal(sidebar[0].text, 'Intro');
  assert.equal(sidebar[0].link, '/en/ldlib2/');
  assert.equal(sidebar[1].text, 'UI');
  assert.equal(sidebar[1].link, '/en/ldlib2/ui/');
  assert.equal(sidebar[1].collapsed, true);
  assert.equal(sidebar[1].items[0].text, 'UI Overview');
  assert.equal(sidebar[2].text, 'Java Integration');
  assert.equal(sidebar[3].text, 'Sync');
  assert.equal(sidebar[3].collapsed, true);
  assert.ok(JSON.stringify(sidebar).includes('/en/ldlib2/'));
  assert.ok(!JSON.stringify(sidebar).includes('photon2'));
});

test('buildLocaleNav creates one header tab per configured mod', async () => {
  const root = await mkdtemp(path.join(tmpdir(), 'lowdrag-nav-'));
  const docs = path.join(root, 'docs');
  await mkdir(path.join(docs, 'zh', 'ldlib2'), { recursive: true });
  await mkdir(path.join(docs, 'zh', 'photon2'), { recursive: true });
  await writeFile(path.join(docs, 'zh', 'ldlib2', '.pages'), 'title: LDLib2\nnav:\n  - index.md\n');
  await writeFile(path.join(docs, 'zh', 'photon2', 'index.md'), '# Photon2\n');

  const nav = await buildLocaleNav(docs, 'zh', [
    ['ldlib2', 'LDLib2'],
    ['photon2', 'Photon2']
  ]);

  assert.deepEqual(nav, [
    { text: 'LDLib2', link: '/zh/ldlib2/' },
    { text: 'Photon2', link: '/zh/photon2/' }
  ]);
});
