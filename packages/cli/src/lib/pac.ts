/**
 * Typed, dependency-free wrapper around the Microsoft Power Platform CLI ("pac").
 *
 * Every function shells out to the locally-installed `pac` executable via
 * `node:child_process` `spawnSync`. We pass `{ shell: true }` so that the
 * platform shell resolves `pac` -> `pac.cmd` on Windows and `pac` on Linux/macOS
 * without us having to know the exact binary name.
 *
 * Nothing here throws on a non-zero exit code: callers inspect {@link PacResult}.
 * The only thrown error is {@link PacNotAvailableError}, which higher-level code
 * may raise when `pac` is genuinely missing from the PATH.
 *
 * Command references point at the official Microsoft Learn pac CLI docs:
 * https://learn.microsoft.com/power-platform/developer/cli/reference/
 *
 * This module introduces no new npm dependencies — only `node:child_process`.
 */

import { spawnSync, type SpawnSyncOptionsWithStringEncoding } from 'node:child_process';
import { logInfo, logError, logWarn } from './file-utils.js';

// ---------------------------------------------------------------------------
// Chalk safe-import — graceful fallback if chalk is not installed yet
// ---------------------------------------------------------------------------
let chalk: typeof import('chalk').default | undefined;
try {
  const chalkMod = await import('chalk');
  chalk = chalkMod.default;
} catch {
  chalk = undefined;
}

const _cyan = (s: string): string => (chalk ? chalk.cyan(s) : s);

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

/**
 * Result of a single `pac` invocation.
 *
 * - `ok`     — true when the process exited with status 0.
 * - `code`   — the numeric exit code (-1 if the process never produced one,
 *              e.g. it could not be spawned).
 * - `stdout` — captured standard output (utf8, never null).
 * - `stderr` — captured standard error (utf8, never null).
 */
export interface PacResult {
  ok: boolean;
  code: number;
  stdout: string;
  stderr: string;
}

/**
 * Shape of the spawn function used internally. Exposed so tests can inject a
 * deterministic runner without experimental module mocking.
 */
export type PacRunner = (
  command: string,
  args: string[],
  options: SpawnSyncOptionsWithStringEncoding
) => {
  status: number | null;
  stdout?: string | null;
  stderr?: string | null;
  error?: Error | null;
};

/**
 * Thrown when the Power Platform CLI (`pac`) is not installed or not resolvable
 * on the current PATH. Most functions here return a {@link PacResult} instead of
 * throwing; this error exists for callers that prefer fail-fast semantics.
 */
export class PacNotAvailableError extends Error {
  constructor(message = 'The Power Platform CLI ("pac") is not available on this system.') {
    super(message);
    this.name = 'PacNotAvailableError';
  }
}

// ---------------------------------------------------------------------------
// Internal runner (can be swapped in tests)
// ---------------------------------------------------------------------------

let _spawnSync: PacRunner = spawnSync;

/**
 * Replace the internal spawn function used by `runPac`. Intended for tests only.
 *
 * @param runner - A function matching {@link PacRunner}.
 */
export function setPacRunner(runner: PacRunner): void {
  _spawnSync = runner;
}

/**
 * Restore the real `node:child_process.spawnSync` runner. Intended for tests.
 */
export function resetPacRunner(): void {
  _spawnSync = spawnSync;
}

// ---------------------------------------------------------------------------
// Core runner
// ---------------------------------------------------------------------------

/**
 * Run an arbitrary `pac` command and capture its result.
 *
 * Never throws on a non-zero exit — inspect {@link PacResult.ok} instead. Uses
 * `spawnSync` with `{ shell: true }` so the OS shell resolves `pac`/`pac.cmd`
 * cross-platform.
 *
 * @param args - Arguments to pass to `pac` (e.g. `['solution', 'list']`).
 * @param opts - Optional settings; `cwd` sets the working directory.
 * @returns A {@link PacResult} describing the outcome.
 * @see https://learn.microsoft.com/power-platform/developer/cli/reference/
 */
export function runPac(args: string[], opts?: { cwd?: string }): PacResult {
  logInfo(_cyan(`pac ${args.join(' ')}`));
  const result = _spawnSync('pac', args, {
    cwd: opts?.cwd,
    encoding: 'utf8',
    shell: true,
  });

  // When the process cannot be spawned at all, spawnSync sets `error` and leaves
  // status null. Surface that as code -1 with the system error message.
  if (result.error) {
    const stderr = result.stderr || result.error.message || '';
    logError(`pac invocation failed: ${result.error.message}`);
    return { ok: false, code: -1, stdout: result.stdout ?? '', stderr };
  }

  const code = result.status ?? -1;
  const ok = code === 0;
  if (!ok) {
    logWarn(`pac exited with code ${code}`);
  }

  return {
    ok,
    code,
    stdout: result.stdout ?? '',
    stderr: result.stderr ?? '',
  };
}

// ---------------------------------------------------------------------------
// Availability / version
// ---------------------------------------------------------------------------

/**
 * Report whether the `pac` CLI is available by running `pac --version`.
 *
 * Wraps {@link runPac} in a try/catch and returns a boolean — it never throws.
 *
 * @returns `true` if `pac --version` runs and exits 0, otherwise `false`.
 * @see https://learn.microsoft.com/power-platform/developer/cli/reference/help
 */
export function isPacAvailable(): boolean {
  try {
    return runPac(['--version']).ok;
  } catch {
    return false;
  }
}

/**
 * Return the installed `pac` version string, or `null` if `pac` is unavailable.
 *
 * Runs `pac --version` and returns the trimmed stdout (falling back to stderr
 * when the version banner is emitted there).
 *
 * @returns The version string, or `null` when `pac` cannot be run.
 * @see https://learn.microsoft.com/power-platform/developer/cli/reference/help
 */
export function pacVersion(): string | null {
  const result = runPac(['--version']);
  if (!result.ok) {
    return null;
  }
  const out = (result.stdout || result.stderr).trim();
  return out.length > 0 ? out : null;
}

// ---------------------------------------------------------------------------
// Identity / environments
// ---------------------------------------------------------------------------

/**
 * Show the currently-authenticated user and connected environment.
 *
 * Wraps `pac org who`, which prints the active connection's user, environment,
 * and org URL.
 *
 * @param opts - Optional settings; `cwd` sets the working directory.
 * @returns A {@link PacResult} with the identity details on stdout.
 * @see https://learn.microsoft.com/power-platform/developer/cli/reference/org#pac-org-who
 */
export function whoami(opts?: { cwd?: string }): PacResult {
  return runPac(['org', 'who'], opts);
}

/**
 * List the Power Platform environments visible to the authenticated profile.
 *
 * Wraps `pac admin list`, the documented command for enumerating environments
 * across a tenant.
 *
 * @returns A {@link PacResult} with the environment list on stdout.
 * @see https://learn.microsoft.com/power-platform/developer/cli/reference/admin#pac-admin-list
 */
export function listEnvironments(): PacResult {
  return runPac(['admin', 'list']);
}

// ---------------------------------------------------------------------------
// Solution lifecycle
// ---------------------------------------------------------------------------

/**
 * Export a solution from the connected environment to a zip file.
 *
 * Wraps `pac solution export --name <name> --path <outFile> [--managed true]`.
 *
 * @param p - Export parameters.
 * @param p.name - The unique name of the solution to export.
 * @param p.outFile - Destination path for the exported `.zip`.
 * @param p.managed - Export as a managed solution when `true` (default: unmanaged).
 * @param p.cwd - Optional working directory for the invocation.
 * @returns A {@link PacResult} describing the export outcome.
 * @see https://learn.microsoft.com/power-platform/developer/cli/reference/solution#pac-solution-export
 */
export function exportSolution(p: {
  name: string;
  outFile: string;
  managed?: boolean;
  cwd?: string;
}): PacResult {
  const args = ['solution', 'export', '--name', p.name, '--path', p.outFile];
  if (p.managed) {
    args.push('--managed', 'true');
  }
  return runPac(args, { cwd: p.cwd });
}

/**
 * Import a solution zip into the connected environment, publishing changes.
 *
 * Wraps `pac solution import --path <path> --publish-changes true` so that
 * customizations are published as part of the import.
 *
 * @param p - Import parameters.
 * @param p.path - Path to the solution `.zip` to import.
 * @param p.cwd - Optional working directory for the invocation.
 * @returns A {@link PacResult} describing the import outcome.
 * @see https://learn.microsoft.com/power-platform/developer/cli/reference/solution#pac-solution-import
 */
export function importSolution(p: { path: string; cwd?: string }): PacResult {
  return runPac(['solution', 'import', '--path', p.path, '--publish-changes', 'true'], {
    cwd: p.cwd,
  });
}

/**
 * Publish all pending customizations in the connected environment.
 *
 * The pac CLI publishes customizations as part of `pac solution import
 * --publish-changes`, so this issues a no-op import-style publish via the
 * documented `--publish-changes` flag against the current solution context.
 *
 * @param opts - Optional settings; `cwd` sets the working directory.
 * @returns A {@link PacResult} describing the publish outcome.
 * @see https://learn.microsoft.com/power-platform/developer/cli/reference/solution#pac-solution-import
 */
export function publishCustomizations(opts?: { cwd?: string }): PacResult {
  return runPac(['solution', 'import', '--publish-changes', 'true'], opts);
}
