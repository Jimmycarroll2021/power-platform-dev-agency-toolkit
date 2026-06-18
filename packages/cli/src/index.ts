#!/usr/bin/env node

/**
 * pp-agency — Power Platform Dev Agency CLI
 *
 * A command-line toolkit for scaffolding, documenting, and managing
 * Microsoft Power Platform projects.
 */

import { Command } from 'commander';
import * as url from 'node:url';
import * as fs from 'node:fs';
import * as path from 'node:path';

// ---------------------------------------------------------------------------
// Chalk safe-import — graceful fallback so the CLI still works pre-build
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
// Resolve version from package.json
// ---------------------------------------------------------------------------
const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function getVersion(): string {
  try {
    const pkgPath = path.resolve(__dirname, '..', 'package.json');
    const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8')) as { version?: string };
    return pkg.version ?? '1.0.0';
  } catch {
    return '1.0.0';
  }
}

// ---------------------------------------------------------------------------
// Import commands
// ---------------------------------------------------------------------------
import { registerNewProjectCommand } from './commands/new-project.js';
import { registerDiscoveryCommand } from './commands/run-discovery.js';
import { registerGeneratePrdCommand } from './commands/generate-prd.js';
import { registerGenerateSolutionDesignCommand } from './commands/generate-solution-design.js';
import { registerGenerateAgentBriefCommand } from './commands/generate-agent-brief.js';
import { registerChecklistCommand } from './commands/checklist.js';
import { registerValidateCommand } from './commands/validate-project.js';
import { registerEstimateLicensingCommand } from './commands/estimate-licensing.js';
import { registerSolutionCommand } from './commands/solution.js';
import { registerEnvCommand } from './commands/env.js';

// ---------------------------------------------------------------------------
// Build CLI
// ---------------------------------------------------------------------------
const program = new Command();

program
  .name('pp-agency')
  .description('Power Platform Dev Agency Toolkit CLI')
  .version(getVersion(), '-v, --version', 'Display the current version')
  .option('--verbose', 'Enable verbose debug logging')
  .configureOutput({
    outputError: (str, write) => write(_red(str)),
  });

// Register all commands
registerNewProjectCommand(program);
registerDiscoveryCommand(program);
registerGeneratePrdCommand(program);
registerGenerateSolutionDesignCommand(program);
registerGenerateAgentBriefCommand(program);
registerChecklistCommand(program);
registerValidateCommand(program);
registerEstimateLicensingCommand(program);
registerSolutionCommand(program);
registerEnvCommand(program);

// ---------------------------------------------------------------------------
// Global error handling
// ---------------------------------------------------------------------------

program.hook('preAction', (thisCommand) => {
  const opts = thisCommand.optsWithGlobals<{ verbose?: boolean }>();
  if (opts.verbose) {
    console.log(_cyan('[verbose] Running with verbose logging enabled'));
  }
});

// Parse arguments
program.parseAsync(process.argv).catch((err: Error) => {
  console.error(_red(`\nUnexpected error: ${err.message}`));
  if (process.env.DEBUG) {
    console.error(err.stack);
  }
  process.exit(1);
});
