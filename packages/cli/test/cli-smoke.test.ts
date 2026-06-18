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
// `--version` prints a semver and exits 0.
// ---------------------------------------------------------------------------
test('CLI: --version prints a semver and exits 0', (t) => {
  if (!fs.existsSync(distPath)) {
    t.skip('CLI not built — run npm run build');
    return;
  }

  const res = spawnSync('node', [distPath, '--version'], { encoding: 'utf-8' });

  assert.equal(res.status, 0, `expected exit 0, got ${res.status} (stderr: ${res.stderr})`);
  assert.match(res.stdout.trim(), SEMVER, `stdout is not a semver: ${JSON.stringify(res.stdout)}`);
});

// ---------------------------------------------------------------------------
// `checklist --type qa --output <tmpfile>` writes a non-empty file, exits 0.
// ---------------------------------------------------------------------------
test('CLI: checklist --type qa writes a non-empty file and exits 0', (t) => {
  if (!fs.existsSync(distPath)) {
    t.skip('CLI not built — run npm run build');
    return;
  }

  const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pp-cli-smoke-'));
  const outFile = path.join(tmpDir, 'qa-checklist.md');

  try {
    const res = spawnSync('node', [distPath, 'checklist', '--type', 'qa', '--output', outFile], {
      encoding: 'utf-8',
    });

    assert.equal(res.status, 0, `expected exit 0, got ${res.status} (stderr: ${res.stderr})`);
    assert.ok(fs.existsSync(outFile), `expected checklist file to exist at ${outFile}`);

    const stats = fs.statSync(outFile);
    assert.ok(stats.size > 0, `expected checklist file to be non-empty, got ${stats.size} bytes`);
  } finally {
    fs.rmSync(tmpDir, { recursive: true, force: true });
  }
});
