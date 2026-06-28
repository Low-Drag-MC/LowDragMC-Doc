import assert from 'node:assert/strict';
import { mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';

import {
  legacyAliasForEnglishDistPath,
  legacyRedirectTarget,
  writeLegacyRedirects
} from './legacy-redirects.mjs';

test('legacyAliasForEnglishDistPath aliases root-level English mod routes', () => {
  assert.equal(
    legacyAliasForEnglishDistPath('en/multiblocked2/index.html'),
    'multiblocked2/index.html'
  );
  assert.equal(
    legacyAliasForEnglishDistPath('en/ldlib2/java_integration.html'),
    'ldlib2/java_integration.html'
  );
  assert.equal(legacyAliasForEnglishDistPath('en/index.html'), null);
  assert.equal(legacyAliasForEnglishDistPath('zh/ldlib2/index.html'), null);
});

test('legacyRedirectTarget points root-level aliases to English routes', () => {
  assert.equal(
    legacyRedirectTarget('multiblocked2/index.html', '/LowDragMC-Doc/'),
    '/LowDragMC-Doc/en/multiblocked2/'
  );
  assert.equal(
    legacyRedirectTarget('ldlib2/java_integration.html', '/LowDragMC-Doc/'),
    '/LowDragMC-Doc/en/ldlib2/java_integration.html'
  );
});

test('writeLegacyRedirects writes redirect HTML aliases for English pages', async () => {
  const outDir = await mkdtemp(path.join(tmpdir(), 'lowdrag-redirects-'));
  await mkdir(path.join(outDir, 'en', 'multiblocked2'), { recursive: true });
  await mkdir(path.join(outDir, 'en', 'ldlib2'), { recursive: true });
  await mkdir(path.join(outDir, 'zh', 'ldlib2'), { recursive: true });
  await writeFile(path.join(outDir, 'en', 'multiblocked2', 'index.html'), '<html>real</html>');
  await writeFile(path.join(outDir, 'en', 'ldlib2', 'java_integration.html'), '<html>real</html>');
  await writeFile(path.join(outDir, 'zh', 'ldlib2', 'index.html'), '<html>zh</html>');

  const written = await writeLegacyRedirects(outDir, '/LowDragMC-Doc/');

  assert.deepEqual(written.sort(), [
    'ldlib2/java_integration.html',
    'multiblocked2/index.html'
  ]);
  assert.match(
    await readFile(path.join(outDir, 'multiblocked2', 'index.html'), 'utf8'),
    /\/LowDragMC-Doc\/en\/multiblocked2\//
  );
  assert.match(
    await readFile(path.join(outDir, 'ldlib2', 'java_integration.html'), 'utf8'),
    /\/LowDragMC-Doc\/en\/ldlib2\/java_integration\.html/
  );
});
