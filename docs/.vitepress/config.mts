import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vitepress';

import { LEGACY_ROOT_MODS, writeLegacyRedirects } from '../../scripts/legacy-redirects.mjs';
import { DEFAULT_MODS, buildLocaleNav, buildSidebars } from '../../scripts/vitepress-nav.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const docsRoot = path.resolve(__dirname, '..');

function legacyRootRedirectPlugin(base: string) {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  return {
    name: 'lowdragmc-legacy-root-redirect',
    configureServer(server) {
      server.middlewares.use((req, res, next) => {
        if (!req.url) {
          next();
          return;
        }
        const url = new URL(req.url, 'http://localhost');
        if (!url.pathname.startsWith(normalizedBase)) {
          next();
          return;
        }
        const relative = decodeURIComponent(url.pathname.slice(normalizedBase.length));
        const firstSegment = relative.split('/')[0];
        if (!LEGACY_ROOT_MODS.has(firstSegment)) {
          next();
          return;
        }
        res.statusCode = 302;
        res.setHeader('Location', `${normalizedBase}en/${relative}${url.search}`);
        res.end();
      });
    }
  };
}

function localeTheme(locale: 'en' | 'zh') {
  const isZh = locale === 'zh';
  return {
    nav: buildLocaleNav(docsRoot, locale, DEFAULT_MODS),
    sidebar: buildSidebars(docsRoot, locale, DEFAULT_MODS),
    editLink: {
      pattern: 'https://github.com/Low-Drag-MC/LowDragMC-Doc/edit/v2/docs/:path',
      text: isZh ? '在 GitHub 上编辑此页' : 'Edit this page on GitHub'
    },
    outline: {
      label: isZh ? '本页目录' : 'On this page'
    },
    docFooter: {
      prev: isZh ? '上一页' : 'Previous page',
      next: isZh ? '下一页' : 'Next page'
    },
    lastUpdated: {
      text: isZh ? '最后更新' : 'Last updated',
      formatOptions: {
        dateStyle: 'medium' as const,
        timeStyle: 'short' as const
      }
    }
  };
}

export default defineConfig({
  title: 'LowDragMC',
  description: 'Documentation for LowDragMC modding projects',
  base: '/LowDragMC-Doc/',
  lang: 'en-US',
  lastUpdated: true,
  cleanUrls: false,
  head: [
    ['link', { rel: 'icon', href: '/LowDragMC-Doc/assets/icon.png' }],
    ['meta', { name: 'theme-color', content: '#1f7a4d' }]
  ],
  locales: {
    en: {
      label: 'English',
      lang: 'en-US',
      link: '/en/',
      themeConfig: localeTheme('en')
    },
    zh: {
      label: '简体中文',
      lang: 'zh-CN',
      link: '/zh/',
      themeConfig: localeTheme('zh')
    }
  },
  markdown: {
    config(md) {
      const defaultFence = md.renderer.rules.fence!;
      md.renderer.rules.fence = (tokens, idx, options, env, self) => {
        const token = tokens[idx];
        const language = token.info.trim().split(/\s+/)[0];
        if (language === 'mermaid') {
          return `<MermaidDiagram code="${encodeURIComponent(token.content)}" encoded />`;
        }
        return defaultFence(tokens, idx, options, env, self);
      };
    }
  },
  vite: {
    plugins: [legacyRootRedirectPlugin('/LowDragMC-Doc/')]
  },
  async buildEnd(siteConfig) {
    await writeLegacyRedirects(siteConfig.outDir, siteConfig.site.base);
  },
  themeConfig: {
    logo: '/assets/icon.png',
    siteTitle: 'LowDragMC',
    nav: [
      { text: 'English', link: '/en/' },
      { text: '中文', link: '/zh/' },
      { text: 'GitHub', link: 'https://github.com/Low-Drag-MC' }
    ],
    search: {
      provider: 'local',
      options: {
        locales: {
          zh: {
            translations: {
              button: {
                buttonText: '搜索',
                buttonAriaLabel: '搜索'
              },
              modal: {
                displayDetails: '显示详细列表',
                resetButtonTitle: '清除搜索',
                backButtonTitle: '关闭搜索',
                noResultsText: '没有结果',
                footer: {
                  selectText: '选择',
                  selectKeyAriaLabel: 'Enter',
                  navigateText: '切换',
                  navigateUpKeyAriaLabel: '上箭头',
                  navigateDownKeyAriaLabel: '下箭头',
                  closeText: '关闭',
                  closeKeyAriaLabel: 'Esc'
                }
              }
            }
          }
        }
      }
    },
    socialLinks: [
      { icon: 'github', link: 'https://github.com/Low-Drag-MC' }
    ],
    footer: {
      message: 'Released under the MIT License.',
      copyright: 'Copyright © 2019-2026 KilaBash'
    }
  }
});
