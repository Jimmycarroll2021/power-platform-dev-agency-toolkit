import { test } from 'node:test';
import assert from 'node:assert/strict';

import {
  frontmatter,
  heading,
  table,
  codeBlock,
  link,
  checklist,
  numberedChecklist,
  badge,
  horizontalRule,
  blockquote,
  bold,
  hasFrontmatter,
  extractFrontmatter,
} from '../src/lib/markdown-utils.js';

// ---------------------------------------------------------------------------
// heading
// ---------------------------------------------------------------------------

test('heading: defaults to level 1 with a trailing newline', () => {
  assert.equal(heading('Title'), '# Title\n');
});

test('heading: applies the requested level as a "#" prefix', () => {
  assert.equal(heading('Sub', 2), '## Sub\n');
  assert.equal(heading('Deep', 6), '###### Deep\n');
});

test('heading: clamps level into the 1-6 range', () => {
  // Below 1 clamps to a single hash.
  assert.equal(heading('Low', 0), '# Low\n');
  assert.equal(heading('Neg', -3), '# Neg\n');
  // Above 6 clamps to six hashes.
  assert.equal(heading('High', 9), '###### High\n');
});

// ---------------------------------------------------------------------------
// table
// ---------------------------------------------------------------------------

test('table: builds header, separator, and row lines with pipe delimiters', () => {
  const out = table(['Name', 'Role'], [['Ada', 'Dev'], ['Grace', 'Lead']]);
  assert.equal(
    out,
    '| Name | Role |\n| --- | --- |\n| Ada | Dev |\n| Grace | Lead |\n',
  );
});

test('table: separator has one "---" cell per header column', () => {
  const out = table(['A', 'B', 'C'], []);
  const lines = out.split('\n');
  assert.equal(lines[0], '| A | B | C |');
  assert.equal(lines[1], '| --- | --- | --- |');
  // Header + separator only, then the trailing newline produces an empty tail.
  assert.equal(lines[2], '');
});

test('table: returns an empty string when there are no headers', () => {
  assert.equal(table([], [['x']]), '');
});

// ---------------------------------------------------------------------------
// codeBlock
// ---------------------------------------------------------------------------

test('codeBlock: fences code with triple backticks and a trailing newline', () => {
  assert.equal(codeBlock('const x = 1;'), '```\nconst x = 1;\n```\n');
});

test('codeBlock: includes the language hint on the opening fence', () => {
  assert.equal(
    codeBlock('print("hi")', 'python'),
    '```python\nprint("hi")\n```\n',
  );
});

// ---------------------------------------------------------------------------
// frontmatter
// ---------------------------------------------------------------------------

test('frontmatter: wraps key/value pairs in "---" delimiters', () => {
  assert.equal(
    frontmatter({ title: 'Doc', author: 'agent' }),
    '---\ntitle: Doc\nauthor: agent\n---\n',
  );
});

test('frontmatter: quotes and escapes string values with special characters', () => {
  // A colon triggers quoting.
  assert.equal(frontmatter({ when: 'a: b' }), '---\nwhen: "a: b"\n---\n');
  // Embedded double quotes are backslash-escaped.
  assert.equal(
    frontmatter({ note: 'say "hi"' }),
    '---\nnote: "say \\"hi\\""\n---\n',
  );
  // A hash triggers quoting.
  assert.equal(frontmatter({ tag: 'a#b' }), '---\ntag: "a#b"\n---\n');
});

test('frontmatter: renders non-string values without quoting', () => {
  assert.equal(
    frontmatter({ count: 3, ok: true }),
    '---\ncount: 3\nok: true\n---\n',
  );
});

// ---------------------------------------------------------------------------
// link / badge / bold / blockquote
// ---------------------------------------------------------------------------

test('link: renders inline markdown link syntax', () => {
  assert.equal(link('Docs', 'https://example.com'), '[Docs](https://example.com)');
});

test('badge: builds a shields.io URL with URL-encoded label and message', () => {
  assert.equal(
    badge('build', 'passing'),
    'https://img.shields.io/badge/build-passing-blue',
  );
});

test('badge: URL-encodes spaces/special chars and honours custom color', () => {
  assert.equal(
    badge('code coverage', '92%', 'green'),
    'https://img.shields.io/badge/code%20coverage-92%25-green',
  );
});

test('bold: wraps text in double asterisks', () => {
  assert.equal(bold('important'), '**important**');
});

test('blockquote: prefixes a line with "> " and adds a trailing newline', () => {
  assert.equal(blockquote('quoted'), '> quoted\n');
});

// ---------------------------------------------------------------------------
// checklist / numberedChecklist
// ---------------------------------------------------------------------------

test('checklist: renders unchecked task list items with a trailing newline', () => {
  assert.equal(checklist(['one', 'two']), '- [ ] one\n- [ ] two\n');
});

test('numberedChecklist: renders numbered unchecked items starting at 1', () => {
  assert.equal(
    numberedChecklist(['first', 'second', 'third']),
    '1. [ ] first\n2. [ ] second\n3. [ ] third\n',
  );
});

// ---------------------------------------------------------------------------
// horizontalRule
// ---------------------------------------------------------------------------

test('horizontalRule: emits a padded "---" divider', () => {
  assert.equal(horizontalRule(), '\n---\n\n');
});

// ---------------------------------------------------------------------------
// hasFrontmatter / extractFrontmatter (round-trip with frontmatter)
// ---------------------------------------------------------------------------

test('hasFrontmatter: detects a leading frontmatter block', () => {
  assert.equal(hasFrontmatter('---\ntitle: X\n---\n# Body'), true);
  // Leading whitespace is tolerated.
  assert.equal(hasFrontmatter('\n\n---\ntitle: X\n---\n'), true);
});

test('hasFrontmatter: returns false without a leading block', () => {
  assert.equal(hasFrontmatter('# Just a heading\n'), false);
  assert.equal(hasFrontmatter('not --- inline'), false);
});

test('extractFrontmatter: returns the delimited block including the fences', () => {
  const doc = frontmatter({ title: 'Doc' }) + heading('Body');
  assert.equal(extractFrontmatter(doc), '---\ntitle: Doc\n---');
});

test('extractFrontmatter: returns null when no frontmatter is present', () => {
  assert.equal(extractFrontmatter('# No frontmatter here\n'), null);
  // Opening fence with no closing fence yields null.
  assert.equal(extractFrontmatter('---\ntitle: X\nno end'), null);
});
