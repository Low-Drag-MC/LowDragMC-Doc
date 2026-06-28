import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import test from 'node:test';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_ROOT = path.join(ROOT, 'docs');

test('markdown headings use CommonMark ATX spacing outside code fences', () => {
  const failures = [];
  for (const file of listMarkdownFiles(DOCS_ROOT)) {
    const relative = path.relative(ROOT, file);
    const lines = fs.readFileSync(file, 'utf8').split(/\r?\n/);
    let inFence = false;
    for (let index = 0; index < lines.length; index += 1) {
      const line = lines[index];
      if (/^\s*(```|~~~)/.test(line)) {
        inFence = !inFence;
        continue;
      }
      if (!inFence && /^#{1,6}(?!#)\S/.test(line)) {
        failures.push(`${relative}:${index + 1}: ${line}`);
      }
    }
  }

  assert.deepEqual(failures, []);
});

function listMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) {
    return [];
  }
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const absolute = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      return listMarkdownFiles(absolute);
    }
    return entry.isFile() && entry.name.endsWith('.md') ? [absolute] : [];
  });
}
