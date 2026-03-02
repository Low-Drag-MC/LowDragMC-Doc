# LDLib2 Bilingual Support Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Add bilingual documentation support with English and Chinese locales, translating all `ldlib2` pages to Chinese while reusing existing media assets.

**Architecture:** Use `mkdocs-static-i18n` in suffix mode so existing English files remain default and Chinese translations are added as `*.zh.md` peers. Configure language switch and locale build behavior so Chinese navigation only includes translated `ldlib2` pages. Keep all assets in place and preserve relative media references.

**Tech Stack:** MkDocs, Material for MkDocs, mkdocs-static-i18n, Python utility script for batch markdown translation.

---

### Task 1: Enable i18n plugin and language switcher

**Files:**
- Modify: `mkdocs.yml`
- Modify: `requirements.txt`

**Step 1: Write the failing test**

```text
Expectation: `mkdocs build` fails before i18n plugin is configured/installed for multi-language setup.
```

**Step 2: Run test to verify it fails**

Run: `mkdocs build`
Expected: FAIL or no bilingual output (`/zh/` pages absent).

**Step 3: Write minimal implementation**

```yaml
plugins:
  - i18n:
      docs_structure: suffix
      fallback_to_default: false
      reconfigure_material: true
      languages:
        - locale: en
          default: true
          name: English
          build: true
        - locale: zh
          name: 中文
          build: true
```

Add `mkdocs-static-i18n` to `requirements.txt`.

**Step 4: Run test to verify it passes**

Run: `mkdocs build`
Expected: PASS with generated localized routes.

**Step 5: Commit**

```bash
git add mkdocs.yml requirements.txt
git commit -m "feat(docs): enable mkdocs i18n bilingual config"
```

### Task 2: Generate Chinese LDLib2 markdown translations

**Files:**
- Create: `scripts/translate_ldlib2_to_zh.py`
- Create: `docs/ldlib2/**/*.zh.md`

**Step 1: Write the failing test**

```text
Expectation: Missing `*.zh.md` files for LDLib2 pages.
```

**Step 2: Run test to verify it fails**

Run: `rg --files docs/ldlib2 | rg "\\.zh\\.md$"`
Expected: FAIL/no output.

**Step 3: Write minimal implementation**

```python
# Batch-translate markdown prose while preserving fenced code, inline code,
# links, and media references. Create sibling .zh.md files.
```

**Step 4: Run test to verify it passes**

Run: `python scripts/translate_ldlib2_to_zh.py`
Expected: PASS and all LDLib2 English `.md` have corresponding `.zh.md`.

**Step 5: Commit**

```bash
git add scripts/translate_ldlib2_to_zh.py docs/ldlib2/**/*.zh.md
git commit -m "feat(docs): add zh translations for ldlib2"
```

### Task 3: Verify output and fix localization edge cases

**Files:**
- Modify: `docs/ldlib2/**/*.zh.md` (as needed)
- Modify: `mkdocs.yml` (only if build/nav requires)

**Step 1: Write the failing test**

```text
Expectation: Chinese site should not include untranslated non-LDLib2 sections.
```

**Step 2: Run test to verify it fails**

Run: `mkdocs build`
Expected: If non-LDLib2 appears in zh nav, treat as FAIL.

**Step 3: Write minimal implementation**

```text
Adjust i18n fallback/nav settings and patch problematic links/paths in zh pages.
```

**Step 4: Run test to verify it passes**

Run: `mkdocs build`
Expected: PASS, zh tree contains only translated LDLib2 pages, media renders.

**Step 5: Commit**

```bash
git add mkdocs.yml docs/ldlib2/**/*.zh.md
git commit -m "fix(docs): align zh navigation and link behavior"
```
