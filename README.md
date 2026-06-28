# LowDragMC-Doc

VitePress documentation site for LowDragMC modding projects.

## Development

```shell
npm install
npm run dev
```

The dev server runs at <http://127.0.0.1:4173/LowDragMC-Doc/> and hot-reloads
Markdown, theme, and config changes. `npm run preview` serves the last static
build output and is only for production-build checks.

## Checks

```shell
npm test
npm run docs:check
npm run build
npm run preview
```

## Project Structure

- `docs/en/` and `docs/zh/` contain bilingual documentation.
- `docs/.vitepress/` contains VitePress config, theme components, and styles.
- `docs/assets/` contains shared icons and images.
- `.pages` files preserve section titles and ordering for generated sidebars.
