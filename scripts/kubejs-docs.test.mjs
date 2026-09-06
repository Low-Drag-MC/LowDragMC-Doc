import assert from 'node:assert/strict';
import { readFile, readdir } from 'node:fs/promises';
import path from 'node:path';
import test from 'node:test';
import vm from 'node:vm';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const CURRENT_BLOCK = /```(?:js|javascript)\s*\n([\s\S]*?)^```/gm;
const LEGACY_MARKER = /Legacy|Old Widget API|1\.20\.1 legacy|旧 Widget API|1\.20\.1 旧版/;

async function markdownFiles(locale) {
  const root = path.join(ROOT, 'docs', locale, 'multiblocked2');
  const files = [];
  const visit = async (dir) => {
    for (const entry of await readdir(dir, { withFileTypes: true })) {
      const absolute = path.join(dir, entry.name);
      if (entry.isDirectory()) await visit(absolute);
      if (entry.isFile() && entry.name.endsWith('.md')) files.push(absolute);
    }
  };
  await visit(root);
  return files.sort();
}

function scriptBlocks(markdown) {
  return [...markdown.matchAll(CURRENT_BLOCK)].map((match) => match[1]);
}

function normalizeScript(source) {
  return source.replaceAll(/\/\/.*$/gm, '').replaceAll(/\s+/g, '');
}

test('current MBD2 KubeJS examples are standalone JavaScript syntax', async () => {
  for (const locale of ['en', 'zh']) {
    for (const file of await markdownFiles(locale)) {
      const blocks = scriptBlocks(await readFile(file, 'utf8'));
      for (const [index, source] of blocks.entries()) {
        if (LEGACY_MARKER.test(source)) continue;
        assert.doesNotThrow(
          () => new vm.Script(source, { filename: `${file}#${index + 1}` }),
          `${file} code block ${index + 1} is not standalone JavaScript`,
        );
        assert.doesNotMatch(source, /^\s*\./, `${file} code block ${index + 1} is only a chain fragment`);
      }
    }
  }
});

test('current MBD2 scripts avoid confirmed 1.21.1 traps', async () => {
  for (const locale of ['en', 'zh']) {
    for (const file of await markdownFiles(locale)) {
      for (const [index, source] of scriptBlocks(await readFile(file, 'utf8')).entries()) {
        if (LEGACY_MARKER.test(source)) continue;
        assert.doesNotMatch(source, /minecraft:charged_creeper_spawn_egg/, `${file} block ${index + 1}: invalid item ID`);
        assert.doesNotMatch(source, /minecraft:copper_nugget/, `${file} block ${index + 1}: invalid vanilla item ID`);
        assert.doesNotMatch(source, /machine\.machineState(?!Name)/, `${file} block ${index + 1}: use machineStateName`);
        assert.doesNotMatch(source, /machine\.definition\.id(?!\s*\()/, `${file} block ${index + 1}: fluent id accessor must be called`);
        assert.doesNotMatch(source, /MBDMachineEvents\.onFuelBurningFinish\s*\(/, `${file} block ${index + 1}: event is not posted to KubeJS in 21.1.1`);
        assert.doesNotMatch(source, /\.set\((?:true|false|-?\d)/, `${file} block ${index + 1}: RuntimeValue.set is generic; scripts must call setValue`);
        assert.doesNotMatch(source, /trait\.name/, `${file} block ${index + 1}: a trait's name is trait.definition.name`);
        assert.doesNotMatch(source, /buildRawRecipe\s*\(/, `${file} block ${index + 1}: the KubeJS builder builds with buildMBDRecipe`);
      }
    }
  }
});

test('English and Chinese MBD2 JavaScript examples stay API-identical', async () => {
  const enRoot = path.join(ROOT, 'docs', 'en', 'multiblocked2');
  const zhRoot = path.join(ROOT, 'docs', 'zh', 'multiblocked2');
  for (const enFile of await markdownFiles('en')) {
    const relative = path.relative(enRoot, enFile);
    const zhFile = path.join(zhRoot, relative);
    const enBlocks = scriptBlocks(await readFile(enFile, 'utf8')).map(normalizeScript);
    const zhBlocks = scriptBlocks(await readFile(zhFile, 'utf8')).map(normalizeScript);
    assert.deepEqual(zhBlocks, enBlocks, `${relative}: localized scripts differ`);
  }
});
