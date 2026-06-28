import fs from 'node:fs';
import path from 'node:path';

export const DEFAULT_MODS = [
  ['ldlib', 'LDLib'],
  ['ldlib2', 'LDLib2'],
  ['multiblocked2', 'Multiblocked2'],
  ['photon2', 'Photon2']
];

export function parsePagesFile(content) {
  const title = content.match(/^title:\s*(.+?)\s*$/m)?.[1]?.trim();
  const nav = [];
  const lines = content.split(/\r?\n/);
  let inNav = false;
  for (const line of lines) {
    if (/^nav:\s*$/.test(line)) {
      inNav = true;
      continue;
    }
    if (inNav) {
      const match = line.match(/^\s*-\s+(.+?)\s*$/);
      if (match) {
        nav.push(match[1]);
      } else if (line.trim() && !line.startsWith(' ')) {
        inNav = false;
      }
    }
  }
  return { title, nav };
}

export function routeForFile(locale, relativeFile) {
  const normalized = relativeFile.replace(/\\/g, '/').replace(/\.md$/i, '');
  const segments = normalized.split('/').filter(Boolean);
  const isIndex = segments.at(-1) === 'index';
  if (isIndex) {
    segments.pop();
  }
  const encoded = segments.map((segment) => encodeURIComponent(segment)).join('/');
  return `/${locale}/${encoded}${isIndex && encoded ? '/' : ''}`;
}

export function buildLocaleNav(docsRoot, locale, mods = DEFAULT_MODS) {
  return mods
    .filter(([mod]) => fs.existsSync(path.join(docsRoot, locale, mod)))
    .map(([mod, text]) => ({ text, link: `/${locale}/${encodeURIComponent(mod)}/` }));
}

export function buildSidebars(docsRoot, locale, mods = DEFAULT_MODS) {
  return Object.fromEntries(
    mods
      .filter(([mod]) => fs.existsSync(path.join(docsRoot, locale, mod)))
      .map(([mod]) => [`/${locale}/${encodeURIComponent(mod)}/`, buildSidebar(docsRoot, locale, mod)])
  );
}

export function buildSidebar(docsRoot, locale, mod) {
  const localeRoot = path.join(docsRoot, locale);
  return buildDirectory(localeRoot, mod, locale);
}

function buildDirectory(localeRoot, relativeDir, locale, options = {}) {
  const absoluteDir = path.join(localeRoot, relativeDir);
  const pages = readPages(path.join(absoluteDir, '.pages'));
  const children = listDocChildren(absoluteDir).filter((entry) => !(options.excludeIndex && entry.name === 'index.md'));
  const ordered = orderChildren(children, pages.nav);

  return ordered
    .map((entry) => buildEntry(localeRoot, path.join(relativeDir, entry.name), locale, entry))
    .filter(Boolean);
}

function buildEntry(localeRoot, relativePath, locale, entry) {
  const absolutePath = path.join(localeRoot, relativePath);
  if (entry.kind === 'file') {
    return {
      text: titleForFile(absolutePath),
      link: routeForFile(locale, relativePath)
    };
  }

  const indexFile = path.join(absolutePath, 'index.md');
  const pages = readPages(path.join(absolutePath, '.pages'));
  const items = buildDirectory(localeRoot, relativePath, locale, { excludeIndex: true });
  const group = { text: pages.title || titleFromName(entry.name) };
  if (fs.existsSync(indexFile)) {
    group.link = routeForFile(locale, path.join(relativePath, 'index.md'));
  }
  if (items.length) {
    group.collapsed = true;
    group.items = items;
  }
  return group;
}

function readPages(file) {
  if (!fs.existsSync(file)) {
    return { title: undefined, nav: ['...'] };
  }
  return parsePagesFile(fs.readFileSync(file, 'utf8'));
}

function listDocChildren(dir) {
  return fs
    .readdirSync(dir, { withFileTypes: true })
    .filter((entry) => {
      if (entry.name.startsWith('.') || entry.name === 'assets') {
        return false;
      }
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return directoryHasMarkdown(absolute);
      }
      return entry.isFile() && entry.name.toLowerCase().endsWith('.md');
    })
    .map((entry) => ({ name: entry.name, kind: entry.isDirectory() ? 'dir' : 'file' }))
    .sort(compareEntries);
}

function orderChildren(children, nav) {
  const byName = new Map(children.map((child) => [child.name, child]));
  const used = new Set();
  const out = [];
  const requested = nav.length ? nav : ['...'];

  for (const item of requested) {
    if (item === '...') {
      for (const child of children) {
        if (!used.has(child.name)) {
          out.push(child);
          used.add(child.name);
        }
      }
      continue;
    }
    const child = byName.get(item);
    if (child && !used.has(child.name)) {
      out.push(child);
      used.add(child.name);
    }
  }
  return out;
}

function directoryHasMarkdown(dir) {
  return fs.readdirSync(dir, { withFileTypes: true }).some((entry) => {
    if (entry.name.startsWith('.') || entry.name === 'assets') {
      return false;
    }
    const absolute = path.join(dir, entry.name);
    return entry.isFile() && entry.name.toLowerCase().endsWith('.md')
      ? true
      : entry.isDirectory() && directoryHasMarkdown(absolute);
  });
}

function compareEntries(a, b) {
  if (a.kind !== b.kind) {
    return a.kind === 'file' ? -1 : 1;
  }
  if (a.name === 'index.md') {
    return -1;
  }
  if (b.name === 'index.md') {
    return 1;
  }
  return a.name.localeCompare(b.name, undefined, { sensitivity: 'base', numeric: true });
}

function titleForFile(file) {
  const content = fs.readFileSync(file, 'utf8');
  const heading = content.match(/^#\s+(.+?)\s*$/m)?.[1];
  return heading ? stripMarkdown(heading) : titleFromName(path.basename(file, '.md'));
}

function titleFromName(name) {
  return name
    .replace(/\.md$/i, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());
}

function stripMarkdown(text) {
  return text
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
    .replace(/[`*_#]/g, '')
    .trim();
}
