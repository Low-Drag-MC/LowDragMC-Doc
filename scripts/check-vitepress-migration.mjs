import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_ROOT = path.join(ROOT, 'docs');

const CHECKS = [
  ['version_badge macro', /\{\{\s*version_badge\(/],
  ['MkDocs admonition', /^!!!\s+/m],
  ['MkDocs details', /^\?\?\?\s+/m],
  ['PyMdown tab', /^===\s+"/m],
  ['Material/Simple icon token', /:(?:material|simple|fontawesome|octicons)-[A-Za-z0-9_-]+:/],
  ['data-preview attribute', /\{\s*data-preview\s*\}/],
  ['MkDocs markdown figure', /<figure\b[^>]*\bmarkdown=/],
  ['multiline shields badge URL', /!\[[^\]]+\]\(https:\/\/img\.shields\.io\/badge\/dynamic\/xml\s*\n/],
  ['broken Maven host typo', /firstdar\.kdev/],
  ['MkDocs inline container option', /^(?:!!!|\?\?\?|:::+)[ \t]+[A-Za-z0-9_-]+[ \t]+.*\binline[ \t]+(?:end|start)\b/m],
  ['unconverted Markdown image attributes', /!\[[^\]\n]*\]\([^\)\n]+\)\{[^}\n]+\}/]
];

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

const failures = [];
for (const file of ['en', 'zh'].flatMap((locale) => listMarkdownFiles(path.join(DOCS_ROOT, locale)))) {
  const content = fs.readFileSync(file, 'utf8');
  for (const [label, pattern] of CHECKS) {
    if (pattern.test(content)) {
      failures.push(`${path.relative(ROOT, file)}: ${label}`);
    }
  }
}

if (failures.length) {
  console.error(`Found ${failures.length} unsupported MkDocs patterns:`);
  for (const failure of failures.slice(0, 100)) {
    console.error(`- ${failure}`);
  }
  if (failures.length > 100) {
    console.error(`... and ${failures.length - 100} more`);
  }
  process.exit(1);
}

console.log('No unsupported MkDocs patterns found.');
