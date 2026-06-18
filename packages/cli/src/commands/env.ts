/**
 * Command: pp-agency env <subcommand>
 *
 * Wraps the Microsoft Power Platform CLI (`pac`) environment operations.
 * Degrades gracefully when `pac` is not installed or not authenticated.
 */

import { Command } from 'commander';
import { isPacAvailable, listEnvironments, whoami, PacNotAvailableError } from '../lib/pac.js';
import { logError } from '../lib/file-utils.js';

// ---------------------------------------------------------------------------
// Chalk safe-import
// ---------------------------------------------------------------------------
let chalk: typeof import('chalk').default | undefined;
try {
  const chalkMod = await import('chalk');
  chalk = chalkMod.default;
} catch {
  chalk = undefined;
}

const _cyan = (s: string): string => (chalk ? chalk.cyan(s) : s);
const _red = (s: string): string => (chalk ? chalk.red(s) : s);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensurePac(): void {
  if (!isPacAvailable()) {
    console.error(
      _red(
        '\nThe Microsoft Power Platform CLI (pac) is not available on this system.\n' +
          'Install it from https://learn.microsoft.com/power-platform/developer/cli/intro' +
          ' and authenticate with `pac auth create` before using environment commands.\n'
      )
    );
    throw new PacNotAvailableError();
  }
}

function printResult(result: { ok: boolean; code: number; stdout: string; stderr: string }): void {
  if (result.stdout) {
    console.log(result.stdout);
  }
  if (result.stderr && !result.ok) {
    console.error(_red(result.stderr));
  }
}

// ---------------------------------------------------------------------------
// Subcommand registration
// ---------------------------------------------------------------------------

export function registerEnvCommand(program: Command): void {
  const env = program
    .command('env')
    .description('Power Platform environment commands (requires pac CLI)')
    .option('--verbose', 'Enable verbose logging');

  env
    .command('list')
    .description('List environments visible to the authenticated profile')
    .action(async () => {
      try {
        ensurePac();
        console.log(_cyan('\nListing Power Platform environments...\n'));
        const result = listEnvironments();
        printResult(result);
        process.exit(result.ok ? 0 : 1);
      } catch (err) {
        if (err instanceof PacNotAvailableError) {
          process.exit(1);
        }
        logError(`Error listing environments: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });

  env
    .command('whoami')
    .description('Show the currently-authenticated user and connected environment')
    .action(async () => {
      try {
        ensurePac();
        console.log(_cyan('\nCurrent Power Platform identity:\n'));
        const result = whoami();
        printResult(result);
        process.exit(result.ok ? 0 : 1);
      } catch (err) {
        if (err instanceof PacNotAvailableError) {
          process.exit(1);
        }
        logError(`Error reading identity: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });
}
