import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const STYLE = fs.readFileSync(path.join(ROOT, 'docs/.vitepress/theme/style.css'), 'utf8');

function cssBlock(selector) {
  const escaped = selector.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/\\ /g, '\\s+');
  const match = STYLE.match(new RegExp(`${escaped}\\s*\\{([\\s\\S]*?)\\}`));
  return match?.[1] || '';
}

test('theme leaves VitePress header chrome to the default stylesheet', () => {
  assert.doesNotMatch(
    STYLE,
    /\.VP(?:NavBar|NavScreen|LocalNav)|\.content-body|\.divider-line|\.has-sidebar/
  );
});

test('theme keeps the home profile image compact and responsive', () => {
  assert.match(STYLE, /\.home-profile\s*\{[\s\S]*width:\s*min\([^)]*260px[\s\S]*\}/);
});

test('theme draws the sidebar edge without changing sidebar width', () => {
  assert.doesNotMatch(cssBlock('.VPSidebar'), /border-right\s*:/);
  assert.match(cssBlock('.VPSidebar'), /box-shadow\s*:\s*inset\s+-2px\s+0\s+0\s+var\(--vp-c-divider\)/);
});
