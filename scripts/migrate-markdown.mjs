import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DOCS_ROOT = path.join(ROOT, 'docs');
const FENCED_BLOCK_RE = /(```[\s\S]*?```|~~~[\s\S]*?~~~)/g;
const ALLOWED_RAW_TAGS = new Set([
  'a',
  'br',
  'button',
  'del',
  'details',
  'div',
  'figcaption',
  'figure',
  'h1',
  'h2',
  'h3',
  'iframe',
  'img',
  'p',
  'source',
  'span',
  'summary',
  'table',
  'tbody',
  'td',
  'th',
  'thead',
  'tr',
  'video'
]);
const ALLOWED_COMPONENT_TAGS = new Set(['DocIcon', 'DocTab', 'DocTabs', 'MermaidDiagram', 'VersionBadge']);

export function convertMarkdown(markdown) {
  let output = markdown.replace(/\r\n/g, '\n');
  output = convertInlineProfileBlocks(output);
  output = convertVersionBadges(output);
  output = convertContainers(output);
  output = normalizeInlineContainerOptions(output);
  output = convertTabs(output);
  output = normalizeDocTabSpacing(output);
  output = convertMarkdownFigures(output);
  output = normalizeMultilineMarkdownUrls(output);
  output = convertImages(output);
  output = convertIcons(output);
  output = output.replace(/\{\s*data-preview\s*\}/g, '');
  output = output.replace(/firstdar\.kdev/g, 'firstdark.dev');
  output = escapeVueSensitiveAngles(output);
  return output;
}

function convertInlineProfileBlocks(markdown) {
  let output = markdown.replace(
    /^!!!\s+info\s+inline\s+(?:end|start)\s+["']?Profile["']?\s*\n((?:[ \t]{4}.*(?:\n|$)|[ \t]*\n)*)/gm,
    (match, body) => profileBlockFromBody(body, match)
  );
  output = output.replace(
    /^(:::+)\s+info\s+inline\s+(?:end|start)\s+["']?Profile["']?\s*\n([\s\S]*?)^\1\s*$/gm,
    (match, _marker, body) => profileBlockFromBody(body, match)
  );
  return output;
}

function profileBlockFromBody(body, fallback) {
  const lines = dedentLines(body.replace(/^\n|\n$/g, '').split('\n'));
  const content = lines.join('\n').trim();
  const markdownImage = content.match(/!\[([^\]]*)\]\(([^)\n]+)\)(?:\{[^}]*\})?/);
  if (markdownImage) {
    return renderHomeProfile(markdownImage[2], markdownImage[1] || 'Profile');
  }

  const htmlImage = content.match(/<img\b([^>]*)>/i);
  if (htmlImage) {
    const attrs = parseLooseAttributes(htmlImage[1]);
    if (attrs.src) {
      return renderHomeProfile(attrs.src, attrs.alt || 'Profile');
    }
  }

  return fallback;
}

function renderHomeProfile(src, alt) {
  return [
    '<div class="home-profile">',
    `<img src="${escapeAttribute(src)}" alt="${escapeAttribute(alt)}">`,
    '</div>'
  ].join('\n');
}

function normalizeDocTabSpacing(markdown) {
  const lines = markdown.split('\n');
  const out = [];
  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (/^<\/DocTab>\s*$/.test(line) && out.at(-1) !== '') {
      out.push('');
    }
    out.push(line);
    if (/^<DocTab\b[^>]*>\s*$/.test(line) && lines[i + 1] !== '') {
      out.push('');
    }
    if (/^<\/DocTabs>\s*$/.test(line) && lines[i + 1] !== undefined && lines[i + 1] !== '') {
      out.push('');
    }
  }
  return out.join('\n');
}

function convertVersionBadges(markdown) {
  return markdown.replace(/\{\{\s*version_badge\((.*?)\)\s*\}\}/gs, (_match, rawArgs) => {
    const args = splitArgs(rawArgs);
    const attrs = {
      version: unquote(args[0] || ''),
      label: 'Added',
      icon: 'tag-outline'
    };
    for (const arg of args.slice(1)) {
      const match = arg.match(/^(\w+)\s*=\s*(.+)$/s);
      if (match) {
        attrs[match[1]] = unquote(match[2].trim());
      }
    }
    const rendered = ['version', 'label', 'icon', 'href', 'tooltip']
      .filter((key) => attrs[key])
      .map((key) => `${key}="${escapeAttribute(attrs[key])}"`)
      .join(' ');
    return `<VersionBadge ${rendered} />`;
  });
}

function convertContainers(markdown) {
  const { lines } = convertContainerLines(markdown.split('\n'), 0, 0);
  return lines.join('\n');
}

function convertContainerLines(lines, start, baseIndent) {
  const out = [];
  let i = start;
  while (i < lines.length) {
    const raw = lines[i];
    if (baseIndent > 0 && raw.trim() && leadingSpaces(raw) < baseIndent) {
      break;
    }

    const line = raw.startsWith(' '.repeat(baseIndent)) ? raw.slice(baseIndent) : raw;
    const match = line.match(/^(!!!|\?\?\?)\s+(.+?)\s*$/);
    if (match) {
      const marker = match[1];
      const parsed = parseContainerRest(marker, match[2]);
      if (!parsed) {
        out.push(line);
        i += 1;
        continue;
      }
      const title = normalizeTitle(parsed.title);
      const type = marker === '???' ? 'details' : mapContainerType(parsed.type);
      const body = convertContainerLines(lines, i + 1, baseIndent + 4);
      const trailingBlankLines = [];
      while (body.lines.at(-1) === '') {
        trailingBlankLines.push(body.lines.pop());
      }
      out.push(title ? `::: ${type} ${title}` : `::: ${type}`);
      out.push(...body.lines);
      out.push(':::');
      out.push(...trailingBlankLines);
      i = body.next;
      continue;
    }

    out.push(line);
    i += 1;
  }
  return { lines: out, next: i };
}

function parseContainerRest(marker, rest) {
  if (marker === '???' && /^['"]/.test(rest.trim())) {
    return { type: 'details', title: rest.trim() };
  }
  const match = rest.match(/^([A-Za-z0-9_-]+)(?:\s+(.*))?$/);
  return match ? { type: match[1], title: stripMkDocsInlineOptions(match[2] || '') } : null;
}

function normalizeInlineContainerOptions(markdown) {
  return markdown.replace(
    /^(:::+)[ \t]+([A-Za-z0-9_-]+)[ \t]+inline(?:[ \t]+(?:end|start))?(?:[ \t]+(.*))?$/gm,
    (_match, marker, type, rawTitle = '') => {
      const title = normalizeTitle(stripMkDocsInlineOptions(rawTitle));
      return title ? `${marker} ${type} ${title}` : `${marker} ${type}`;
    }
  );
}

function stripMkDocsInlineOptions(raw) {
  return raw.trim().replace(/^inline(?:\s+(?:end|start))?\b\s*/, '');
}

function convertTabs(markdown) {
  const lines = markdown.split('\n');
  const out = [];
  let i = 0;
  while (i < lines.length) {
    const first = matchTabLine(lines[i]);
    if (!first) {
      out.push(lines[i]);
      i += 1;
      continue;
    }

    const tabs = [];
    const tabIndent = first.indent;
    let cursor = i;
    while (cursor < lines.length) {
      const tab = matchTabLine(lines[cursor]);
      if (!tab || tab.indent !== tabIndent) {
        break;
      }
      cursor += 1;
      const content = [];
      while (cursor < lines.length) {
        const nextTab = matchTabLine(lines[cursor]);
        if (nextTab && nextTab.indent === tabIndent) {
          break;
        }
        if (lines[cursor].trim() && leadingSpaces(lines[cursor]) <= tabIndent) {
          break;
        }
        content.push(stripIndent(lines[cursor], tabIndent + 4));
        cursor += 1;
      }
      tabs.push({ title: tab.title, content: convertTabs(content.join('\n')) });
    }

    out.push('<DocTabs>');
    for (const tab of tabs) {
      out.push(`<DocTab title="${escapeAttribute(tab.title)}">`);
      out.push(tab.content.endsWith('\n') ? tab.content : `${tab.content}\n`);
      out.push('</DocTab>');
    }
    out.push('</DocTabs>');
    i = cursor;
  }
  return out.join('\n');
}

function convertImages(markdown) {
  return markdown.replace(/!\[([^\]]*)\]\(([^)]+)\)\{([^}]+)\}/g, (_match, alt, src, rawAttrs) => {
    return markdownImageToHtml(alt, src, rawAttrs);
  });
}

function convertMarkdownFigures(markdown) {
  return markdown.replace(
    /<figure\b([^>]*)\smarkdown=(["'])span\2([^>]*)>([\s\S]*?)<\/figure>/g,
    (_match, beforeAttrs, _quote, afterAttrs, body) => {
      const attrs = normalizeHtmlAttrs(`${beforeAttrs}${afterAttrs}`);
      return `<figure${attrs}>\n${convertFigureBody(body)}\n</figure>`;
    }
  );
}

function convertFigureBody(body) {
  const lines = dedentLines(body.replace(/^\n|\n$/g, '').split('\n'));
  return lines
    .map((line) => {
      const convertedImages = line.replace(
        /!\[([^\]]*)\]\(([^)\n]+)\)(?:\{([^}]+)\})?/g,
        (_match, alt, src, rawAttrs = '') => markdownImageToHtml(alt, src, rawAttrs)
      );
      return convertInlineMarkdownForHtml(convertedImages);
    })
    .join('\n')
    .trim();
}

function normalizeMultilineMarkdownUrls(markdown) {
  return markdown.replace(/(!?\[[^\]\n]*\]\()([^\)\n]*(?:\n\s*[?&][^\)\n]*)+)(\))/g, (_match, prefix, rawUrl, suffix) => {
    const url = rawUrl
      .replace(/\s*\n\s*/g, '')
      .replace(/\s+([?&])/g, '$1')
      .replace(/([?&])\s+/g, '$1');
    return `${prefix}${url}${suffix}`;
  });
}

function markdownImageToHtml(alt, src, rawAttrs = '') {
  const attrs = parseLooseAttributes(rawAttrs);
  const htmlAttrs = [`src="${escapeAttribute(src)}"`, `alt="${escapeAttribute(alt)}"`];
  if (attrs.width) {
    htmlAttrs.push(`width="${escapeAttribute(attrs.width)}"`);
  }
  const classes = [];
  if (attrs.align === 'right' || /float:\s*right/.test(attrs.style || '')) {
    classes.push('md-img-right');
  } else if (/margin:\s*0 auto|display:\s*block/.test(attrs.style || '')) {
    classes.push('md-img-center');
  }
  if (classes.length) {
    htmlAttrs.push(`class="${classes.join(' ')}"`);
  }
  return `<img ${htmlAttrs.join(' ')}>`;
}

function normalizeHtmlAttrs(raw) {
  const attrs = raw.trim().replace(/\s+/g, ' ');
  return attrs ? ` ${attrs}` : '';
}

function dedentLines(lines) {
  const nonBlank = lines.filter((line) => line.trim());
  const indent = Math.min(...nonBlank.map((line) => leadingSpaces(line)));
  if (!Number.isFinite(indent) || indent <= 0) {
    return lines;
  }
  return lines.map((line) => (line.trim() ? line.slice(indent) : ''));
}

function convertInlineMarkdownForHtml(line) {
  return line
    .replace(/\[([^\]\n]+)\]\(([^)\s]+)\)/g, (_match, text, href) => {
      return `<a href="${escapeAttribute(href)}">${escapeHtml(text)}</a>`;
    })
    .replace(/`([^`\n]+)`/g, (_match, code) => `<code>${escapeHtml(code)}</code>`);
}

function convertIcons(markdown) {
  return markdown.replace(/:((?:material|simple|fontawesome|octicons)-[A-Za-z0-9_-]+):/g, (_match, name) => {
    return `<DocIcon name="${escapeAttribute(name)}" />`;
  });
}

function escapeVueSensitiveAngles(markdown) {
  return markdown
    .split(FENCED_BLOCK_RE)
    .map((segment, index) => {
      if (index % 2 === 1) {
        return segment;
      }
      return segment.split('\n').map(escapeAngleLine).join('\n');
    })
    .join('');
}

function escapeAngleLine(line) {
  line = restoreAllowedEscapedTags(line);
  line = line.replace(/<\?([^>]*)>/g, '&lt;?$1&gt;');
  return line.replace(/<\/?([A-Za-z][A-Za-z0-9-]*)([^<>]*)\/?>/g, (full, tag, _rest, offset, source) => {
    if (isAllowedRawTag(full, tag, offset, source)) {
      return full;
    }
    return full.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  });
}

function restoreAllowedEscapedTags(line) {
  return line.replace(/&lt;(\/?)([A-Za-z][A-Za-z0-9-]*)([^&]*)&gt;/g, (full, slash, tag, rest) => {
    return isAllowedTagName(tag) ? `<${slash}${tag}${rest}>` : full;
  });
}

function isAllowedRawTag(full, tag, offset, source) {
  const previous = source[offset - 1] || '';
  if (!full.startsWith('</') && /[A-Za-z0-9_.)\]]/.test(previous)) {
    return false;
  }
  return isAllowedTagName(tag);
}

function isAllowedTagName(tag) {
  return ALLOWED_COMPONENT_TAGS.has(tag) || ALLOWED_RAW_TAGS.has(tag.toLowerCase());
}

function splitArgs(raw) {
  const out = [];
  let current = '';
  let quote = null;
  for (let i = 0; i < raw.length; i += 1) {
    const char = raw[i];
    if ((char === '"' || char === "'") && raw[i - 1] !== '\\') {
      quote = quote === char ? null : quote || char;
    }
    if (char === ',' && !quote) {
      out.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  if (current.trim()) {
    out.push(current.trim());
  }
  return out;
}

function unquote(value) {
  return value.replace(/^['"]|['"]$/g, '');
}

function normalizeTitle(raw) {
  if (!raw) {
    return '';
  }
  const title = unquote(raw.trim());
  return title === '""' ? '' : title;
}

function mapContainerType(type) {
  if (type === 'tip') {
    return 'tip';
  }
  if (type === 'warning' || type === 'caution') {
    return 'warning';
  }
  if (type === 'danger' || type === 'error') {
    return 'danger';
  }
  return 'info';
}

function matchTabLine(line) {
  const match = line.match(/^(\s*)===\s+"([^"]+)"\s*$/);
  return match ? { indent: match[1].length, title: match[2] } : null;
}

function stripIndent(line, indent) {
  if (!line.trim()) {
    return '';
  }
  const prefix = ' '.repeat(indent);
  return line.startsWith(prefix) ? line.slice(indent) : line;
}

function leadingSpaces(line) {
  return line.match(/^ */)[0].length;
}

function parseLooseAttributes(raw) {
  const attrs = {};
  const attrRe = /([A-Za-z_:][-A-Za-z0-9_:]*)\s*=\s*(?:"([^"]*)"|'([^']*)'|([^\s]+))/g;
  let match;
  while ((match = attrRe.exec(raw))) {
    attrs[match[1]] = match[2] ?? match[3] ?? match[4] ?? '';
  }
  return attrs;
}

function escapeAttribute(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

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

export function migrateDocs(docsRoot = DOCS_ROOT) {
  const files = ['en', 'zh'].flatMap((locale) => listMarkdownFiles(path.join(docsRoot, locale)));
  for (const file of files) {
    const current = fs.readFileSync(file, 'utf8');
    const converted = convertMarkdown(current);
    if (converted !== current) {
      fs.writeFileSync(file, converted.replace(/\n/g, '\r\n'));
    }
  }
  return files.length;
}

if (fileURLToPath(import.meta.url) === path.resolve(process.argv[1] || '')) {
  const count = migrateDocs();
  console.log(`Migrated ${count} markdown files.`);
}
