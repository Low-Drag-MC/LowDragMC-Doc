import fs from 'node:fs/promises';
import path from 'node:path';

export const LEGACY_ROOT_MODS = new Set(['ldlib', 'ldlib2', 'multiblocked2', 'photon2']);

// Photon2's pre-2.2 wiki used title-cased and space-containing directories. Keep these output
// routes as tiny static redirects so bookmarks and links in old READMEs continue to work after the
// learning-order refactor. A route is emitted only when its new target page exists in the build.
export const PHOTON2_ROUTE_REDIRECTS = new Map([
  ['photon2/Materials/index.html', 'photon2/shaders-and-gpu/'],
  ['photon2/Materials/CustomShaderMaterial/index.html',
    'photon2/shaders-and-gpu/custom-shaders-uniforms-and-samplers.html'],
  ['photon2/Materials/CustomShaderMaterial/ExtendedShader.html',
    'photon2/shaders-and-gpu/extended-shader.html'],
  ['photon2/Materials/CustomShaderMaterial/VertexFormat.html',
    'photon2/shaders-and-gpu/vertex-formats-and-instancing.html'],
  ['photon2/Materials/CustomShaderMaterial/AdditionalGPUData.html',
    'photon2/shaders-and-gpu/additional-gpu-data.html'],
  ['photon2/Java Integration/index.html', 'photon2/java-api/'],
  ['photon2/resourcepack.html', 'photon2/distribution.html']
]);

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
  for (const locale of ['en', 'zh']) {
    for (const [oldRoute, newRoute] of PHOTON2_ROUTE_REDIRECTS) {
      const targetRelative = newRoute.endsWith('/') ? `${newRoute}index.html` : newRoute;
      if (!await fileExists(path.join(outDir, locale, ...targetRelative.split('/')))) {
        continue;
      }
      const outputRelative = `${locale}/${oldRoute}`;
      const outputFile = path.join(outDir, ...outputRelative.split('/'));
      const target = `${base.endsWith('/') ? base : `${base}/`}${locale}/${newRoute}`;
      await fs.mkdir(path.dirname(outputFile), { recursive: true });
      await fs.writeFile(outputFile, redirectHtml(target), 'utf8');
      written.push(outputRelative);
    }
  }
  return written;
}

async function fileExists(file) {
  try {
    await fs.access(file);
    return true;
  } catch (error) {
    if (error?.code === 'ENOENT') return false;
    throw error;
  }
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
