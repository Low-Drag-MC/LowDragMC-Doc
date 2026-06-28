import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const configSource = fs.readFileSync('docs/.vitepress/config.mts', 'utf8');

test('VitePress language switch only exposes real locales', () => {
  assert.doesNotMatch(configSource, /\n\s+root:\s*{\s*\n\s+label:\s*['"]LowDragMC['"]/);
  assert.match(configSource, /\n\s+en:\s*{\s*\n\s+label:\s*['"]English['"]/);
  assert.match(configSource, /\n\s+zh:\s*{\s*\n\s+label:\s*['"]简体中文['"]/);
});

test('edit links use VitePress relative paths without duplicating locale folders', () => {
  assert.match(configSource, /edit\/main\/docs\/:path/);
  assert.doesNotMatch(configSource, /edit\/main\/docs\/\$\{locale\}\/:path/);
});
