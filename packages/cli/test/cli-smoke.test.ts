import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import * as fs from 'node:fs';
import * as os from 'node:os';
import * as path from 'node:path';
import * as url from 'node:url';

// ---------------------------------------------------------------------------
// Locate the built CLI relative to this test file (test/ -> ../dist/index.js).
// ---------------------------------------------------------------------------
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.resolve(__dirname, '..', 'dist', 'index.js');

const SEMVER = /^\d+\.\d+\.\d+(?:[-+][0-9A-Za-z.-]+)?$/;

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/** Run the built CLI with the given arguments. */
function runCli(args: string[], env?: NodeJS.ProcessEnv): ReturnType<typeof spawnSync> {
  return spawnSync('node', [distPath, ...args], { encoding: 'utf-8', env });
}

/** Create a minimal fake `pac` executable that always fails and prepend its directory to PATH. */
function withFakePac<T>(fn: (env: NodeJS.ProcessEnv) => T): T {
  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-pac-mock-'));
  const isWin = process.platform === 'win32';

  if (isWin) {
    fs.writeFileSync(path.join(tmpDir, 'pac.bat'), '@echo off\r\nexit /b 1\r\n');
  } else {
    const pacPath = path.join(tmpDir, 'pac');
    fs.writeFileSync(pacPath, '#!/bin/sh\nexit 1\n');
    fs.chmodSync(pacPath, 0o755);
  }

  try {
    const pathKey =
      Object.keys(process.env).find((k) => k.toLowerCase() === 'path') ?? (isWin ? 'Path' : 'PATH');
    const currentPath = process.env[pathKey] ?? '';
    const env = { ...process.env, [pathKey]: tmpDir + path.delimiter + currentPath };
    return fn(env);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
}

function skipIfNotBuilt(t: { skip: (reason: string) => void }): boolean {
  if (!fs.existsSync(distPath)) {
    t.skip('CLI not built — run npm run build');
    return false;
  }
  return true;
}

// ---------------------------------------------------------------------------
// `--version` prints a semver and exits 0.
// ---------------------------------------------------------------------------
test('CLI: --version prints a semver and exits 0', (t) => {
  if (!skipIfNotBuilt(t)) return;

  const res = runCli(['--version']);

  assert.equal(res.status, 0, `expected exit 0, got ${res.status} (stderr: ${res.stderr})`);
  assert.match(res.stdout.trim(), SEMVER, `stdout is not a semver: ${JSON.stringify(res.stdout)}`);
});

// ---------------------------------------------------------------------------
// `checklist --type qa --output <tmpfile>` writes a non-empty file, exits 0.
// ---------------------------------------------------------------------------
test('CLI: checklist --type qa writes a non-empty file and exits 0', (t) => {
  if (!skipIfNotBuilt(t)) return;

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cli-smoke-'));
  const outFile = path.join(tmpDir, 'qa-checklist.md');

  try {
    const res = runCli(['checklist', '--type', 'qa', '--output', outFile]);

    assert.equal(res.status, 0, `expected exit 0, got ${res.status} (stderr: ${res.stderr})`);
    assert.ok(fs.existsSync(outFile), `expected checklist file to exist at ${outFile}`);

    const stats = fs.statSync(outFile);
    assert.ok(stats.size > 0, `expected checklist file to be non-empty, got ${stats.size} bytes`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});

// ---------------------------------------------------------------------------
// Power Platform CLI command help
// ---------------------------------------------------------------------------

test('CLI: solution --help lists subcommands', (t) => {
  if (!skipIfNotBuilt(t)) return;

  const res = runCli(['solution', '--help']);

  assert.equal(res.status, 0, `expected exit 0, got ${res.status} (stderr: ${res.stderr})`);
  const help = res.stdout;
  assert.ok(help.includes('list'), `expected help to mention 'list': ${help}`);
  assert.ok(help.includes('export'), `expected help to mention 'export': ${help}`);
  assert.ok(help.includes('import'), `expected help to mention 'import': ${help}`);
  assert.ok(help.includes('publish'), `expected help to mention 'publish': ${help}`);
});

test('CLI: env --help lists subcommands', (t) => {
  if (!skipIfNotBuilt(t)) return;

  const res = runCli(['env', '--help']);

  assert.equal(res.status, 0, `expected exit 0, got ${res.status} (stderr: ${res.stderr})`);
  const help = res.stdout;
  assert.ok(help.includes('list'), `expected help to mention 'list': ${help}`);
  assert.ok(help.includes('whoami'), `expected help to mention 'whoami': ${help}`);
});

// ---------------------------------------------------------------------------
// Power Platform CLI commands degrade gracefully when pac is unavailable
// ---------------------------------------------------------------------------

test('CLI: solution list exits 1 with a clear message when pac is not available', (t) => {
  if (!skipIfNotBuilt(t)) return;

  withFakePac((env) => {
    const res = runCli(['solution', 'list'], env);

    assert.equal(res.status, 1, `expected exit 1, got ${res.status} (stdout: ${res.stdout})`);
    const output = `${res.stdout}\n${res.stderr}`;
    assert.ok(
      output.toLowerCase().includes('not available'),
      `expected 'not available' in output: ${output}`,
    );
  });
});

test('CLI: env list exits 1 with a clear message when pac is not available', (t) => {
  if (!skipIfNotBuilt(t)) return;

  withFakePac((env) => {
    const res = runCli(['env', 'list'], env);

    assert.equal(res.status, 1, `expected exit 1, got ${res.status} (stdout: ${res.stdout})`);
    const output = `${res.stdout}\n${res.stderr}`;
    assert.ok(
      output.toLowerCase().includes('not available'),
      `expected 'not available' in output: ${output}`,
    );
  });
});

// ---------------------------------------------------------------------------
// validate --solution
// ---------------------------------------------------------------------------

test('CLI: validate --solution ./nonexistent exits 1', (t) => {
  if (!skipIfNotBuilt(t)) return;

  withFakePac((env) => {
    const res = runCli(['validate', '--solution', './nonexistent'], env);

    assert.equal(res.status, 1, `expected exit 1, got ${res.status} (stdout: ${res.stdout})`);
  });
});
