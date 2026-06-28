import assert from 'node:assert/strict';
import test from 'node:test';

import { convertMarkdown } from './migrate-markdown.mjs';

test('convertMarkdown converts version_badge macro calls', () => {
  const output = convertMarkdown('{{ version_badge("2.2.1", label="Since", icon="tag", href="/changelog/#2.2.1") }}');

  assert.equal(
    output.trim(),
    '<VersionBadge version="2.2.1" label="Since" icon="tag" href="/changelog/#2.2.1" />'
  );
});

test('convertMarkdown converts admonitions and collapsible details', () => {
  const input = [
    '!!! warning "Careful"',
    '    Mind this.',
    '',
    '??? info "More"',
    '    Hidden detail.',
    '',
    '??? "Bare details"',
    '    Also hidden.'
  ].join('\n');

  assert.equal(
    convertMarkdown(input).trim(),
    [
      '::: warning Careful',
      'Mind this.',
      ':::',
      '',
      '::: details More',
      'Hidden detail.',
      ':::',
      '',
      '::: details Bare details',
      'Also hidden.',
      ':::'
    ].join('\n')
  );
});

test('convertMarkdown converts MkDocs inline profile card to compact home profile markup', () => {
  const input = [
    '!!! info inline end "Profile"',
    '    ![Profile](../assets/profile.png){ width="105%" }'
  ].join('\n');

  assert.equal(
    convertMarkdown(input).trim(),
    [
      '<div class="home-profile">',
      '<img src="../assets/profile.png" alt="Profile">',
      '</div>'
    ].join('\n')
  );
});

test('convertMarkdown strips MkDocs inline container options from custom blocks', () => {
  const input = [
    '!!! info inline end Textures',
    '    See [`GUI Textures`](../textures/index.md).',
    '',
    '::: warning inline end',
    'Single player only.',
    ':::',
    '',
    '::: info inline end "What is Mark?',
    'Mark is a snapshot.',
    ':::'
  ].join('\n');

  assert.equal(
    convertMarkdown(input).trim(),
    [
      '::: info Textures',
      'See [`GUI Textures`](../textures/index.md).',
      ':::',
      '',
      '::: warning',
      'Single player only.',
      ':::',
      '',
      '::: info What is Mark?',
      'Mark is a snapshot.',
      ':::'
    ].join('\n')
  );
});

test('convertMarkdown converts PyMdown tabs to DocTabs components', () => {
  const input = [
    '=== "Java"',
    '',
    '    ```java',
    '    run();',
    '    ```',
    '',
    '=== "KubeJS"',
    '',
    '    ```js',
    '    run()',
    '    ```'
  ].join('\n');

  assert.equal(
    convertMarkdown(input).trim(),
    [
      '<DocTabs>',
      '<DocTab title="Java">',
      '',
      '```java',
      'run();',
      '```',
      '',
      '</DocTab>',
      '<DocTab title="KubeJS">',
      '',
      '```js',
      'run()',
      '```',
      '',
      '</DocTab>',
      '</DocTabs>'
    ].join('\n')
  );
});

test('convertMarkdown normalizes existing DocTab spacing for markdown slots', () => {
  const input = [
    '<DocTabs>',
    '<DocTab title="Java">',
    '```java',
    'List<T> value;',
    '```',
    '</DocTab>',
    '</DocTabs>'
  ].join('\n');

  assert.equal(
    convertMarkdown(input).trim(),
    [
      '<DocTabs>',
      '<DocTab title="Java">',
      '',
      '```java',
      'List<T> value;',
      '```',
      '',
      '</DocTab>',
      '</DocTabs>'
    ].join('\n')
  );
});

test('convertMarkdown normalizes MkDocs image attributes and icon tokens', () => {
  const input = [
    ':simple-github: [Repo](https://github.com/Low-Drag-MC)',
    '![Plugin](./assets/plugin.png){ width="60%" align=right }',
    '[Preview](./index.md){ data-preview }'
  ].join('\n');

  assert.equal(
    convertMarkdown(input).trim(),
    [
      '<DocIcon name="simple-github" /> [Repo](https://github.com/Low-Drag-MC)',
      '<img src="./assets/plugin.png" alt="Plugin" width="60%" class="md-img-right">',
      '[Preview](./index.md)'
    ].join('\n')
  );
});

test('convertMarkdown converts MkDocs markdown figures to renderable HTML', () => {
  const input = [
    '<figure markdown="span" style="width: 60%">',
    '    ![UI Editor](./assets/ui_editor.png)',
    '    <figcaption>',
    '    Built with the Editor framework: UI Editor',
    '    </figcaption>',
    '</figure>'
  ].join('\n');

  assert.equal(
    convertMarkdown(input).trim(),
    [
      '<figure style="width: 60%">',
      '<img src="./assets/ui_editor.png" alt="UI Editor">',
      '<figcaption>',
      'Built with the Editor framework: UI Editor',
      '</figcaption>',
      '</figure>'
    ].join('\n')
  );
});

test('convertMarkdown normalizes multiline markdown badge image urls', () => {
  const input = [
    '[![ldlib2 maven](https://img.shields.io/badge/dynamic/xml',
    '?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fldlib2%2Fldlib2-neoforge-1.21.1%2Fmaven-metadata.xml',
    '&query=%2F%2Fmetadata%2Fversioning%2Flatest',
    '&label=ldlib2-neoforge-1.21.1',
    '&cacheSeconds=300)](https://maven.firstdar.kdev/#/snapshots/com/lowdragmc/ldlib2/ldlib2-neoforge-1.21.1)'
  ].join('\n');

  assert.equal(
    convertMarkdown(input).trim(),
    '[![ldlib2 maven](https://img.shields.io/badge/dynamic/xml?url=https%3A%2F%2Fmaven.firstdark.dev%2Fsnapshots%2Fcom%2Flowdragmc%2Fldlib2%2Fldlib2-neoforge-1.21.1%2Fmaven-metadata.xml&query=%2F%2Fmetadata%2Fversioning%2Flatest&label=ldlib2-neoforge-1.21.1&cacheSeconds=300)](https://maven.firstdark.dev/#/snapshots/com/lowdragmc/ldlib2/ldlib2-neoforge-1.21.1)'
  );
});

test('convertMarkdown escapes Vue-sensitive angle bracket text outside code fences', () => {
  const input = [
    'Use Set<T>, Resource<T>, Enum<?>, and <fxFile> placeholders.',
    '',
    'Keep <del>old text</del> and <VersionBadge version="1.0.0" />.',
    '',
    '```java',
    'List<T> raw;',
    '```'
  ].join('\n');

  assert.equal(
    convertMarkdown(input).trim(),
    [
      'Use Set&lt;T&gt;, Resource&lt;T&gt;, Enum&lt;?&gt;, and &lt;fxFile&gt; placeholders.',
      '',
      'Keep <del>old text</del> and <VersionBadge version="1.0.0" />.',
      '',
      '```java',
      'List<T> raw;',
      '```'
    ].join('\n')
  );
});
