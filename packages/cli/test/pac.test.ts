/**
 * Unit tests for the Power Platform CLI (`pac`) wrapper.
 *
 * `node:child_process.spawnSync` is mocked via Node's experimental ESM module
 * mocking so these tests never invoke the real `pac` executable.
 */

import { test, before, after, mock } from 'node:test';
import assert from 'node:assert/strict';
import type * as cp from 'node:child_process';
import * as os from 'node:os';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Console noise suppression
// ---------------------------------------------------------------------------
const originalLog = console.log;
const originalError = console.error;

before(() => {
  console.log = (): void => {};
  console.error = (): void => {};
});

after(() => {
  console.log = originalLog;
  console.error = originalError;
});

// ---------------------------------------------------------------------------
// Configurable mock implementation for spawnSync
// ---------------------------------------------------------------------------
let spawnSyncImpl: (
  cmd: string,
  args: readonly string[],
  opts: object,
) => cp.SpawnSyncReturns<string> = () => ({
  status: 0,
  stdout: '',
  stderr: '',
  output: [null, '', ''],
  pid: 0,
  signal: null,
});

const spawnSyncMock = mock.fn((...args: unknown[]) =>
  spawnSyncImpl(args[0] as string, args[1] as readonly string[], args[2] as object),
);

// ---------------------------------------------------------------------------
// Mock node:child_process before importing the pac wrapper
// ---------------------------------------------------------------------------
const pacModuleContext = mock.module('node:child_process', {
  namedExports: { spawnSync: spawnSyncMock },
});

let pac: typeof import('../src/lib/pac.js');

before(async () => {
  pac = await import('../src/lib/pac.js');
});

after(() => {
  pacModuleContext.restore();
});

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function lastCallArgs(): unknown[] {
  const calls = spawnSyncMock.mock.calls;
  assert.ok(calls.length > 0, 'expected at least one spawnSync call');
  return calls[calls.length - 1].arguments;
}

function fakeSuccess(stdout = '', stderr = ''): cp.SpawnSyncReturns<string> {
  return {
    status: 0,
    stdout,
    stderr,
    output: [null, stdout, stderr],
    pid: 1,
    signal: null,
  };
}

function fakeFailure(code: number, stderr = ''): cp.SpawnSyncReturns<string> {
  return {
    status: code,
    stdout: '',
    stderr,
    output: [null, '', stderr],
    pid: 1,
    signal: null,
  };
}

// ---------------------------------------------------------------------------
// runPac
// ---------------------------------------------------------------------------

test('runPac returns ok=true on exit 0', () => {
  spawnSyncImpl = () => fakeSuccess('ok-output');

  const result = pac.runPac(['solution', 'list']);

  assert.equal(result.ok, true);
  assert.equal(result.code, 0);
  assert.equal(result.stdout, 'ok-output');
  assert.equal(result.stderr, '');

  const args = lastCallArgs();
  assert.equal(args[0], 'pac');
  assert.deepEqual(args[1], ['solution', 'list']);
});

test('runPac returns ok=false on non-zero exit', () => {
  spawnSyncImpl = () => fakeFailure(7, 'pac error');

  const result = pac.runPac(['solution', 'export', '--name', 'x']);

  assert.equal(result.ok, false);
  assert.equal(result.code, 7);
  assert.equal(result.stdout, '');
  assert.equal(result.stderr, 'pac error');
});

test('runPac handles spawn errors (pac not found)', () => {
  // Use a plain error-shaped object rather than an Error instance to avoid
  // expensive serialization inside the mock call history on failure.
  spawnSyncImpl = () =>
    ({
      error: { message: 'spawn pac ENOENT' },
      status: null,
      stdout: '',
      stderr: '',
      output: [null, '', ''],
      pid: 0,
      signal: null,
    } as unknown as cp.SpawnSyncReturns<string>);

  const result = pac.runPac(['--version']);

  assert.equal(result.ok, false);
  assert.equal(result.code, -1);
  assert.ok(result.stderr.includes('ENOENT'));
});

// ---------------------------------------------------------------------------
// isPacAvailable
// ---------------------------------------------------------------------------

test('isPacAvailable returns true when pac --version exits 0', () => {
  spawnSyncImpl = () => fakeSuccess('1.0.0');

  assert.equal(pac.isPacAvailable(), true);

  const args = lastCallArgs();
  assert.deepEqual(args[1], ['--version']);
});

test('isPacAvailable returns false when pac --version fails', () => {
  spawnSyncImpl = () => fakeFailure(1, 'error');

  assert.equal(pac.isPacAvailable(), false);
});

// ---------------------------------------------------------------------------
// Solution lifecycle helpers
// ---------------------------------------------------------------------------

test('exportSolution builds correct args for unmanaged export', () => {
  spawnSyncImpl = () => fakeSuccess();

  pac.exportSolution({ name: 'MySolution', outFile: './out.zip' });

  const args = lastCallArgs();
  assert.equal(args[0], 'pac');
  assert.deepEqual(args[1], ['solution', 'export', '--name', 'MySolution', '--path', './out.zip']);
});

test('exportSolution includes --managed true when requested', () => {
  spawnSyncImpl = () => fakeSuccess();

  pac.exportSolution({ name: 'MySolution', outFile: './out.zip', managed: true });

  const args = lastCallArgs();
  assert.deepEqual(args[1], [
    'solution',
    'export',
    '--name',
    'MySolution',
    '--path',
    './out.zip',
    '--managed',
    'true',
  ]);
});

test('importSolution builds correct args', () => {
  spawnSyncImpl = () => fakeSuccess();

  pac.importSolution({ path: './solution.zip' });

  const args = lastCallArgs();
  assert.deepEqual(args[1], [
    'solution',
    'import',
    '--path',
    './solution.zip',
    '--publish-changes',
    'true',
  ]);
});

test('publishCustomizations builds correct args', () => {
  spawnSyncImpl = () => fakeSuccess();

  pac.publishCustomizations();

  const args = lastCallArgs();
  assert.deepEqual(args[1], ['solution', 'import', '--publish-changes', 'true']);
});

// ---------------------------------------------------------------------------
// cwd plumbing
// ---------------------------------------------------------------------------

test('runPac passes cwd through to spawnSync', () => {
  spawnSyncImpl = () => fakeSuccess();
  const cwd = path.join(os.tmpdir(), 'pp-pac-cwd-test');

  pac.runPac(['solution', 'list'], { cwd });

  const args = lastCallArgs();
  const opts = args[2] as { cwd?: string };
  assert.equal(opts.cwd, cwd);
});
