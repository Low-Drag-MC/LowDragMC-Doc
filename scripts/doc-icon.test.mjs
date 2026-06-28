import assert from 'node:assert/strict';
import fs from 'node:fs';
import test from 'node:test';

const iconSource = fs.readFileSync('docs/.vitepress/theme/components/DocIcon.vue', 'utf8');

test('DocIcon includes branded glyphs used by link icons', () => {
  assert.match(iconSource, /simple-github/);
  assert.match(iconSource, /simple-discord/);
  assert.match(iconSource, /material-tag/);
  assert.match(iconSource, /material-hexagon-multiple/);
});
