# Ore UI Theme Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Trial a stronger Minecraft Ore UI visual theme for the VitePress wiki without disrupting migrated content or navigation.

**Architecture:** Keep the current VitePress theme and component structure. Apply the visual treatment through global CSS tokens and scoped overrides for navbar, sidebar, document content, custom blocks, tabs, badges, and code blocks.

**Tech Stack:** VitePress, Vue 3 theme components, CSS custom properties, Node test runner.

---

### Task 1: Theme Regression Coverage

**Files:**
- Modify: `scripts/theme-style.test.mjs`

**Step 1: Write failing assertions**

Add tests that require the theme to expose Minecraft/Ore UI tokens and concrete selectors:

```js
test('theme exposes ore ui texture and palette tokens', () => {
  assert.match(STYLE, /--ld-ore-glow:/);
  assert.match(STYLE, /--ld-pixel-shadow:/);
  assert.match(STYLE, /--ld-panel-bg:/);
});

test('theme applies ore ui panel treatment to major chrome', () => {
  assert.match(cssBlock('.VPNavBar'), /background:/);
  assert.match(cssBlock('.VPSidebar'), /background:/);
  assert.match(cssBlock('.vp-doc div[class*="language-"]'), /box-shadow:/);
});
```

**Step 2: Run test to verify it fails**

Run: `npm test -- scripts/theme-style.test.mjs`

Expected: FAIL because the new tokens and selector rules do not exist yet.

### Task 2: Implement Ore UI CSS

**Files:**
- Modify: `docs/.vitepress/theme/style.css`

**Step 1: Add CSS tokens**

Add variables for stone panels, ore glow, pixel shadows, inset borders, and readable text surfaces.

**Step 2: Style app chrome**

Apply a darker stone/ore treatment to navbar, sidebar, local nav, search, and mod tabs. Preserve VitePress layout sizing: no navbar `border-bottom`, no sidebar `border-right`.

**Step 3: Style document primitives**

Update headings, custom blocks, tables, code blocks, images, tabs, and version badges with restrained Minecraft-style inset borders and highlights.

**Step 4: Keep mobile readable**

Retain compact mobile layout, avoid text overlap, and keep long content surfaces high contrast.

### Task 3: Verify and Commit Trial

**Files:**
- Verify: all modified theme/test files

**Step 1: Run checks**

Run:

```bash
npm test
npm run docs:check
npm run build
```

Expected: all commands exit 0. Build may keep existing `gradle` highlight fallback and chunk size warnings.

**Step 2: Commit style trial**

Run:

```bash
git add docs/plans/2026-06-28-ore-ui-theme.md docs/.vitepress/theme/style.css scripts/theme-style.test.mjs
git commit -m "style: trial ore ui theme"
```
