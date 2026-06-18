/**
 * Command: pp-agency solution <subcommand>
 *
 * Wraps the Microsoft Power Platform CLI (`pac`) solution operations:
 * list, export, import, and publish. Every subcommand degrades gracefully
 * when `pac` is not installed or not authenticated.
 */

import * as path from 'node:path';
import { Command } from 'commander';
import {
  isPacAvailable,
  exportSolution,
  importSolution,
  publishCustomizations,
  runPac,
  PacNotAvailableError,
} from '../lib/pac.js';
import { logInfo, logError } from '../lib/file-utils.js';

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
const _green = (s: string): string => (chalk ? chalk.green(s) : s);
const _red = (s: string): string => (chalk ? chalk.red(s) : s);
const _yellow = (s: string): string => (chalk ? chalk.yellow(s) : s);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function ensurePac(): void {
  if (!isPacAvailable()) {
    console.error(
      _red(
        '\nThe Microsoft Power Platform CLI (pac) is not available on this system.\n' +
          'Install it from https://learn.microsoft.com/power-platform/developer/cli/intro' +
          ' and authenticate with `pac auth create` before using solution commands.\n'
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

export function registerSolutionCommand(program: Command): void {
  const solution = program
    .command('solution')
    .description('Power Platform solution lifecycle commands (requires pac CLI)')
    .option('--verbose', 'Enable verbose logging');

  solution
    .command('list')
    .description('List solutions in the connected environment')
    .action(async () => {
      try {
        ensurePac();
        console.log(_cyan('\nListing solutions...\n'));
        const result = runPac(['solution', 'list']);
        printResult(result);
        process.exit(result.ok ? 0 : 1);
      } catch (err) {
        if (err instanceof PacNotAvailableError) {
          process.exit(1);
        }
        logError(`Error listing solutions: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });

  solution
    .command('export')
    .description('Export a solution from the connected environment')
    .requiredOption('-n, --name <name>', 'Unique name of the solution to export')
    .requiredOption('-o, --out-file <path>', 'Destination path for the exported .zip')
    .option('--managed', 'Export as a managed solution', false)
    .action(async (options: { name: string; outFile: string; managed?: boolean; verbose?: boolean }) => {
      try {
        ensurePac();
        const outPath = path.resolve(options.outFile);
        if (options.verbose) {
          logInfo(`Exporting solution ${options.name} to ${outPath}`);
        }
        console.log(_cyan(`\nExporting solution "${options.name}"...\n`));
        const result = exportSolution({
          name: options.name,
          outFile: outPath,
          managed: options.managed,
        });
        printResult(result);
        if (result.ok) {
          console.log(_green(`\nSolution exported to: ${outPath}`));
        }
        process.exit(result.ok ? 0 : 1);
      } catch (err) {
        if (err instanceof PacNotAvailableError) {
          process.exit(1);
        }
        logError(`Error exporting solution: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });

  solution
    .command('import')
    .description('Import a solution .zip into the connected environment')
    .requiredOption('-p, --path <path>', 'Path to the solution .zip to import')
    .option('--publish', 'Publish customizations after import', true)
    .action(async (options: { path: string; publish?: boolean; verbose?: boolean }) => {
      try {
        ensurePac();
        const importPath = path.resolve(options.path);
        if (options.verbose) {
          logInfo(`Importing solution from ${importPath}`);
        }
        console.log(_cyan(`\nImporting solution from "${importPath}"...\n`));
        const result = importSolution({ path: importPath });
        printResult(result);

        if (result.ok && options.publish) {
          console.log(_yellow('\nPublishing customizations...'));
          const publishResult = publishCustomizations();
          printResult(publishResult);
          if (!publishResult.ok) {
            console.error(_red('\nImport succeeded but publish failed.'));
            process.exit(1);
          }
        }

        if (result.ok) {
          console.log(_green('\nSolution imported successfully.'));
        }
        process.exit(result.ok ? 0 : 1);
      } catch (err) {
        if (err instanceof PacNotAvailableError) {
          process.exit(1);
        }
        logError(`Error importing solution: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });

  solution
    .command('publish')
    .description('Publish all pending customizations in the connected environment')
    .action(async () => {
      try {
        ensurePac();
        console.log(_cyan('\nPublishing customizations...\n'));
        const result = publishCustomizations();
        printResult(result);
        if (result.ok) {
          console.log(_green('\nCustomizations published successfully.'));
        }
        process.exit(result.ok ? 0 : 1);
      } catch (err) {
        if (err instanceof PacNotAvailableError) {
          process.exit(1);
        }
        logError(`Error publishing customizations: ${err instanceof Error ? err.message : String(err)}`);
        process.exit(1);
      }
    });
}
