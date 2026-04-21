# Agent Instructions

MkDocs documentation site for LowDragMC modding projects.

## Quick Start

```bash
pip install -r requirements.txt
mkdocs serve          # dev server at http://127.0.0.1:8000
```

## Deploy

Push to `master` or `main` triggers CI auto-deploy to GitHub Pages:

```bash
mkdocs gh-deploy --force
```

## Project Structure

- `docs/en/` and `docs/zh/` — Bilingual content (MkDocs i18n plugin, folder structure)
- `main.py` — Custom macros (e.g., `version_badge`)
- `docs/css/` — Custom styles
- `docs/assets/` — Icons and images

## Content Conventions

- Use `version_badge(version, label, icon, href, tooltip)` macro for version badges
- Code blocks: supports Mermaid diagrams via superfences
- Available extensions: admonitions, tabs, emoji (Twemoji), inline highlight, snippets

## Adding Documentation

1. Add/edit `.md` files in `docs/en/` and mirror to `docs/zh/` if maintaining both languages
2. Organize with `awesome-pages` plugin (auto nav from folder structure)
3. Assets referenced relative to `docs/` root

## Gotchas

- i18n uses folder structure (`docs_structure: folder`); every locale has its own subdirectory
- Cache directory `.cache/` is used for build optimization in CI
