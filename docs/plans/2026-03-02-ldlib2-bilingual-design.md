# LDLib2 Bilingual Site Design

**Date:** 2026-03-02

## Scope
- Build a standard bilingual MkDocs site with language-prefixed URLs: `/en/...` and `/zh/...`.
- Add Chinese content only for `ldlib2`.
- Keep non-`ldlib2` docs out of Chinese navigation.
- Reuse existing static assets (images/videos/gifs) without duplication.

## Chosen Approach
Use `mkdocs-static-i18n` with language-specific doc roots.

### Why
- Native language URL prefixing and alternates.
- Clear long-term maintainability for future languages.
- Compatible with Material theme language switch UX.

## Information Architecture
- `docs/en/...` contains current English docs (migrated from current `docs/...`).
- `docs/zh/ldlib2/...` contains Chinese translation for LDLib2 only.
- Assets remain shared from existing locations and referenced by relative paths.

## MkDocs Configuration Strategy
- Add `i18n` plugin and configure languages `en` (default) and `zh`.
- Keep existing theme and plugin behavior unless incompatible.
- Configure language alternates for Material switcher.
- Define per-language navigation:
- `en`: existing full navigation
- `zh`: only `ldlib2`

## Translation Rules
- Translate titles, paragraphs, notes, and explanatory text.
- Preserve code blocks, command examples, class/package/API names.
- Update internal markdown links in Chinese pages to point to `zh` counterparts.
- Do not duplicate media files.

## Risks and Mitigation
- Risk: path breakage during docs migration.
- Mitigation: run link checks via `mkdocs build` and scan warnings.
- Risk: plugin order conflicts with `i18n`.
- Mitigation: place `i18n` in a compatible order and verify build output.
- Risk: partial translation drift.
- Mitigation: translate all `docs/en/ldlib2/**/*.md` to matching `docs/zh/ldlib2/**/*.md`.

## Verification Plan
- `mkdocs build` succeeds without critical errors.
- Language switch shows English and Chinese entries.
- Chinese site nav only contains LDLib2.
- Representative Chinese pages render and media loads.

## Out of Scope
- Translating modules other than `ldlib2`.
- Editing binary assets.
