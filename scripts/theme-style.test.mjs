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

test('theme keeps the VitePress navbar divider visible without changing nav height', () => {
  assert.doesNotMatch(cssBlock('.VPNavBar'), /border-bottom\s*:/);
  assert.doesNotMatch(cssBlock('.VPNavBar .divider-line'), /display\s*:\s*none/);
  assert.match(
    STYLE,
    /\.VPNavBar:not\(\.home\.top\)\s+\.divider-line\s*\{[\s\S]*background-color\s*:\s*var\(--ld-stone-edge\)/
  );
  assert.match(cssBlock('.VPNavBarTitle.has-sidebar .title'), /border-bottom-color\s*:\s*var\(--ld-stone-edge\)/);
});

test('theme paints navbar background on the bar instead of content-body', () => {
  assert.match(
    STYLE,
    /\.VPNavBar:not\(\.home\.top\)\s*\{[\s\S]*background-color\s*:\s*var\(--vp-nav-bg-color\)/
  );
  assert.match(
    STYLE,
    /\.VPNavBar:not\(\.home\.top\)\s+\.content-body\s*\{[\s\S]*background-color\s*:\s*transparent/
  );
  assert.doesNotMatch(cssBlock('.VPNavBar:not(.home.top) .content-body'), /\b(width|left|right|padding-left)\s*:/);
});

test('theme keeps the home profile image compact and responsive', () => {
  assert.match(STYLE, /\.home-profile\s*\{[\s\S]*width:\s*min\([^)]*260px[\s\S]*\}/);
});

test('theme draws the sidebar edge without changing sidebar width', () => {
  assert.doesNotMatch(cssBlock('.VPSidebar'), /border-right\s*:/);
  assert.match(cssBlock('.VPSidebar'), /box-shadow\s*:\s*inset\s+-2px\s+0\s+0\s+var\(--vp-c-divider\)/);
});
