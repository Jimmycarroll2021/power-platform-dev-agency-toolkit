import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';

import {
  generateFilename,
  ensureDir,
  writeFile,
  readFile,
  fileExists,
} from '../src/lib/file-utils.js';

// ---------------------------------------------------------------------------
// Test sandbox: a unique directory under the OS tmpdir, removed after the run.
// The lib functions console.log on success; silence stdout for deterministic,
// quiet test output and restore it afterwards.
// ---------------------------------------------------------------------------

let sandbox: string;
const originalLog = console.log;

before(() => {
  sandbox = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-file-utils-'));
  console.log = (): void => {};
});

after(() => {
  console.log = originalLog;
  fs.rmSync(sandbox, { recursive: true, force: true });
});

// ---------------------------------------------------------------------------
// generateFilename — slug/sanitize to kebab-case
// ---------------------------------------------------------------------------

test('generateFilename: lowercases and kebab-cases a name into a .md filename', () => {
  assert.equal(generateFilename('Contoso CRM'), 'contoso-crm.md');
});

test('generateFilename: appends an optional suffix before the extension', () => {
  assert.equal(generateFilename('Contoso CRM', 'brief'), 'contoso-crm-brief.md');
});

test('generateFilename: collapses runs of non-alphanumerics to a single dash', () => {
  assert.equal(generateFilename('ACME  Corp__2026!!'), 'acme-corp-2026.md');
});

test('generateFilename: trims leading and trailing dashes from the slug', () => {
  assert.equal(generateFilename('  !Hello World!  '), 'hello-world.md');
});

// ---------------------------------------------------------------------------
// ensureDir + writeFile / readFile / fileExists round-trip
// ---------------------------------------------------------------------------

test('ensureDir: creates a nested directory tree (idempotent)', () => {
  const nested = path.join(sandbox, 'a', 'b', 'c');
  assert.equal(fileExists(nested), false);
  ensureDir(nested);
  assert.equal(fs.existsSync(nested), true);
  // Calling again must not throw and must leave the dir in place.
  ensureDir(nested);
  assert.equal(fs.existsSync(nested), true);
});

test('writeFile -> readFile -> fileExists round-trip preserves content', () => {
  const target = path.join(sandbox, 'docs', 'note.md');
  const content = '# Note\n\nRound-trip body.\n';

  assert.equal(fileExists(target), false);
  // writeFile creates parent dirs as needed.
  writeFile(target, content);

  assert.equal(fileExists(target), true);
  assert.equal(fs.existsSync(path.dirname(target)), true);
  assert.equal(readFile(target), content);
});

test('readFile: returns null for a missing file', () => {
  const missing = path.join(sandbox, 'does-not-exist.md');
  assert.equal(fileExists(missing), false);
  assert.equal(readFile(missing), null);
});

test('fileExists: reports true for a directory and false for a non-existent path', () => {
  assert.equal(fileExists(sandbox), true);
  assert.equal(fileExists(path.join(sandbox, 'nope', 'still-nope')), false);
});
