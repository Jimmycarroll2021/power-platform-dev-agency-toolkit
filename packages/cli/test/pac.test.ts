/**
 * Tests for the typed `pac` CLI wrapper.
 *
 * These tests inject a deterministic {@link PacRunner} so the real Microsoft
 * Power Platform CLI is never invoked. The runner is reset after each test to
 * avoid leakage.
 */

import { describe, it, beforeEach, afterEach } from 'node:test';
import assert from 'node:assert';
import type { SpawnSyncOptionsWithStringEncoding } from 'node:child_process';
import {
  runPac,
  isPacAvailable,
  pacVersion,
  exportSolution,
  importSolution,
  publishCustomizations,
  setPacRunner,
  resetPacRunner,
  type PacResult,
  type PacRunner,
} from '../src/lib/pac.js';

// ---------------------------------------------------------------------------
// Test helpers
// ---------------------------------------------------------------------------

function makeRunner(
  responses: Record<
    string,
    { status?: number | null; stdout?: string; stderr?: string; error?: Error | null }
  >
): PacRunner {
  return (
    command: string,
    args: string[],
    _options: SpawnSyncOptionsWithStringEncoding
  ): {
    status: number | null;
    stdout?: string | null;
    stderr?: string | null;
    error?: Error | null;
  } => {
    const key = `${command} ${args.join(' ')}`;
    const response = responses[key] ?? { status: 1, stdout: '', stderr: 'unknown command' };
    return {
      status: response.status ?? null,
      stdout: response.stdout ?? null,
      stderr: response.stderr ?? null,
      error: response.error ?? null,
    };
  };
}

// ---------------------------------------------------------------------------
// Tests
// ---------------------------------------------------------------------------

describe('pac wrapper', () => {
  beforeEach(() => {
    resetPacRunner();
  });

  afterEach(() => {
    resetPacRunner();
  });

  it('runPac returns ok=true on exit 0', () => {
    setPacRunner(
      makeRunner({
        'pac solution list': { status: 0, stdout: 'solution1\nsolution2', stderr: '' },
      })
    );

    const result: PacResult = runPac(['solution', 'list']);
    assert.strictEqual(result.ok, true);
    assert.strictEqual(result.code, 0);
    assert.strictEqual(result.stdout, 'solution1\nsolution2');
  });

  it('runPac returns ok=false on non-zero exit', () => {
    setPacRunner(
      makeRunner({
        'pac solution list': { status: 1, stdout: '', stderr: 'not authenticated' },
      })
    );

    const result: PacResult = runPac(['solution', 'list']);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.code, 1);
    assert.strictEqual(result.stderr, 'not authenticated');
  });

  it('runPac handles spawn errors (pac not found)', () => {
    setPacRunner(
      makeRunner({
        'pac solution list': {
          status: null,
          stdout: '',
          stderr: '',
          error: new Error('spawn pac ENOENT'),
        },
      })
    );

    const result: PacResult = runPac(['solution', 'list']);
    assert.strictEqual(result.ok, false);
    assert.strictEqual(result.code, -1);
    assert.strictEqual(result.stderr, 'spawn pac ENOENT');
  });

  it('isPacAvailable returns true when pac --version exits 0', () => {
    setPacRunner(
      makeRunner({
        'pac --version': { status: 0, stdout: '1.2.3', stderr: '' },
      })
    );

    assert.strictEqual(isPacAvailable(), true);
  });

  it('isPacAvailable returns false when pac --version fails', () => {
    setPacRunner(
      makeRunner({
        'pac --version': { status: 1, stdout: '', stderr: 'not found' },
      })
    );

    assert.strictEqual(isPacAvailable(), false);
  });

  it('pacVersion returns the trimmed version string', () => {
    setPacRunner(
      makeRunner({
        'pac --version': { status: 0, stdout: '  1.2.3  \n', stderr: '' },
      })
    );

    assert.strictEqual(pacVersion(), '1.2.3');
  });

  it('exportSolution builds correct args for unmanaged export', () => {
    let capturedArgs: string[] = [];
    setPacRunner((command, args) => {
      capturedArgs = [command, ...args];
      return { status: 0, stdout: '', stderr: '' };
    });

    exportSolution({ name: 'MySolution', outFile: '/tmp/out.zip' });
    assert.deepStrictEqual(capturedArgs, [
      'pac',
      'solution',
      'export',
      '--name',
      'MySolution',
      '--path',
      '/tmp/out.zip',
    ]);
  });

  it('exportSolution includes --managed true when requested', () => {
    let capturedArgs: string[] = [];
    setPacRunner((command, args) => {
      capturedArgs = [command, ...args];
      return { status: 0, stdout: '', stderr: '' };
    });

    exportSolution({ name: 'MySolution', outFile: '/tmp/out.zip', managed: true });
    assert.deepStrictEqual(capturedArgs, [
      'pac',
      'solution',
      'export',
      '--name',
      'MySolution',
      '--path',
      '/tmp/out.zip',
      '--managed',
      'true',
    ]);
  });

  it('importSolution builds correct args', () => {
    let capturedArgs: string[] = [];
    setPacRunner((command, args) => {
      capturedArgs = [command, ...args];
      return { status: 0, stdout: '', stderr: '' };
    });

    importSolution({ path: '/tmp/in.zip' });
    assert.deepStrictEqual(capturedArgs, [
      'pac',
      'solution',
      'import',
      '--path',
      '/tmp/in.zip',
      '--publish-changes',
      'true',
    ]);
  });

  it('publishCustomizations builds correct args', () => {
    let capturedArgs: string[] = [];
    setPacRunner((command, args) => {
      capturedArgs = [command, ...args];
      return { status: 0, stdout: '', stderr: '' };
    });

    publishCustomizations();
    assert.deepStrictEqual(capturedArgs, [
      'pac',
      'solution',
      'import',
      '--publish-changes',
      'true',
    ]);
  });

  it('runPac passes cwd through to the runner', () => {
    let capturedOptions: SpawnSyncOptionsWithStringEncoding | undefined;
    setPacRunner((command, args, options) => {
      capturedOptions = options;
      return { status: 0, stdout: '', stderr: '' };
    });

    runPac(['solution', 'list'], { cwd: '/tmp/workspace' });
    assert.strictEqual(capturedOptions?.cwd, '/tmp/workspace');
  });
});
