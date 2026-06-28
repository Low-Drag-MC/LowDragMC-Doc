# Agent Instructions

VitePress documentation site for LowDragMC modding projects.

## Quick Start

```bash
npm install
npm run dev          # hot-reload dev server at http://127.0.0.1:4173/LowDragMC-Doc/
```

## Deploy

Push to `master` or `main` triggers CI deployment to GitHub Pages.

```bash
npm run build
npm run preview      # static build preview; restart after rebuilding
```

## Project Structure

- `docs/en/` and `docs/zh/` — bilingual content.
- `docs/.vitepress/config.mts` — VitePress config, locales, generated nav/sidebar.
- `docs/.vitepress/theme/` — custom components and styles.
- `docs/assets/` — shared icons and images.
- `.pages` files — section titles and sidebar order.

## Content Conventions

- Use `<VersionBadge version="..." label="..." icon="..." href="..." />` for version badges.
- Use VitePress custom containers such as `::: info`, `::: tip`, and `::: warning`.
- Use `<DocTabs>` and `<DocTab title="...">` for tabbed content.
- Mermaid diagrams use normal fenced code blocks with `mermaid`.

## Adding Documentation

1. Add/edit `.md` files in `docs/en/` and mirror to `docs/zh/` if maintaining both languages.
2. Update nearby `.pages` files when a section needs explicit sidebar ordering.
3. Reference assets relative to the current Markdown file or from `/assets/...`.
4. Run `npm run docs:check` and `npm run build` before publishing.
