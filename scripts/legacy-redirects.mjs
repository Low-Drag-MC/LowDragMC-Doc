import fs from 'node:fs/promises';
import path from 'node:path';

export const LEGACY_ROOT_MODS = new Set(['ldlib', 'ldlib2', 'multiblocked2', 'photon2']);

export function legacyAliasForEnglishDistPath(relativePath) {
  const normalized = toPosix(relativePath);
  const segments = normalized.split('/');
  if (segments[0] !== 'en' || !LEGACY_ROOT_MODS.has(segments[1])) {
    return null;
  }
  return segments.slice(1).join('/');
}

export function legacyRedirectTarget(aliasPath, base = '/') {
  const normalizedBase = base.endsWith('/') ? base : `${base}/`;
  const normalizedAlias = toPosix(aliasPath);
  if (normalizedAlias.endsWith('/index.html')) {
    return `${normalizedBase}en/${normalizedAlias.slice(0, -'index.html'.length)}`;
  }
  return `${normalizedBase}en/${normalizedAlias}`;
}

export async function writeLegacyRedirects(outDir, base = '/') {
  const htmlFiles = await listHtmlFiles(path.join(outDir, 'en'));
  const written = [];
  for (const file of htmlFiles) {
    const relative = toPosix(path.relative(outDir, file));
    const alias = legacyAliasForEnglishDistPath(relative);
    if (!alias) {
      continue;
    }
    const target = legacyRedirectTarget(alias, base);
    const outputFile = path.join(outDir, ...alias.split('/'));
    await fs.mkdir(path.dirname(outputFile), { recursive: true });
    await fs.writeFile(outputFile, redirectHtml(target), 'utf8');
    written.push(alias);
  }
  return written;
}

async function listHtmlFiles(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async (entry) => {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        return listHtmlFiles(absolute);
      }
      return entry.isFile() && entry.name.endsWith('.html') ? [absolute] : [];
    }));
    return nested.flat();
  } catch (error) {
    if (error?.code === 'ENOENT') {
      return [];
    }
    throw error;
  }
}

function redirectHtml(target) {
  const escaped = escapeHtml(target);
  const scriptTarget = JSON.stringify(target);
  return [
    '<!doctype html>',
    '<html lang="en-US">',
    '<head>',
    '<meta charset="utf-8">',
    '<meta name="robots" content="noindex">',
    `<link rel="canonical" href="${escaped}">`,
    `<meta http-equiv="refresh" content="0; url=${escaped}">`,
    `<script>location.replace(${scriptTarget});</script>`,
    '</head>',
    '<body>',
    `<p>Redirecting to <a href="${escaped}">${escaped}</a>.</p>`,
    '</body>',
    '</html>',
    ''
  ].join('\n');
}

function toPosix(value) {
  return value.replace(/\\/g, '/');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}
