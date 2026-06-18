/**
 * Command: pp-agency generate-solution-design
 *
 * Generates a Solution Design Document (SDD) from template.
 */

import * as path from 'node:path';
import { Command } from 'commander';
import { ProjectType, type ProjectConfig } from '../lib/project-types.js';
import { ensureDir, writeFile, fileExists, logInfo, logError } from '../lib/file-utils.js';
import { solutionDesignTemplate } from '../lib/templates.js';

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
const _yellow = (s: string): string => (chalk ? chalk.yellow(s) : s);

// ---------------------------------------------------------------------------
// Options interface
// ---------------------------------------------------------------------------
interface GenerateSolutionDesignOptions {
  project?: string;
  output?: string;
  client?: string;
  type?: string;
  verbose?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveProjectType(type?: string): ProjectType {
  if (!type) return ProjectType.CanvasApp;
  const normalized = type.toLowerCase().replace(/_/g, '-');
  const typeMap: Record<string, ProjectType> = {
    'canvas-app': ProjectType.CanvasApp,
    'model-driven': ProjectType.ModelDriven,
    'power-pages': ProjectType.PowerPages,
    'integration': ProjectType.Integration,
    'copilot': ProjectType.Copilot,
    'full-solution': ProjectType.FullSolution,
  };
  return typeMap[normalized] ?? ProjectType.CanvasApp;
}

// ---------------------------------------------------------------------------
// Command registration
// ---------------------------------------------------------------------------

export function registerGenerateSolutionDesignCommand(program: Command): void {
  program
    .command('generate-solution-design')
    .description('Generate a Solution Design Document (SDD)')
    .option('-p, --project <name>', 'Project name')
    .option('-o, --output <file>', 'Output file path')
    .option('-c, --client <name>', 'Client name')
    .option('-t, --type <type>', 'Project type (canvas-app, model-driven, etc.)')
    .action(async (options: GenerateSolutionDesignOptions) => {
      try {
        console.log(_cyan('\nGenerating Solution Design Document\n'));

        const projectName = options.project ?? 'Untitled Project';
        const client = options.client ?? 'Unknown Client';
        const projectType = resolveProjectType(options.type);

        if (options.verbose) {
          logInfo(`Project: ${projectName}`);
          logInfo(`Client: ${client}`);
          logInfo(`Type: ${projectType}`);
        }

        // Build config
        const config: ProjectConfig = {
          name: projectName,
          type: projectType,
          client,
          description: `${projectName} — Solution Design Document`,
          createdAt: new Date().toISOString(),
          version: '1.0.0',
        };

        // Check for existing project directory
        const possibleProjectDir = path.resolve(projectName);
        if (fileExists(possibleProjectDir)) {
          logInfo(`Found existing project at ${possibleProjectDir}`);
          config.name = path.basename(possibleProjectDir);
        }

        // Generate SDD
        const sddContent = solutionDesignTemplate(config);

        // Determine output path
        const outputPath = options.output
          ? path.resolve(options.output)
          : path.resolve(`${config.name.toLowerCase().replace(/\s+/g, '-')}-solution-design.md`);

        ensureDir(path.dirname(outputPath));
        writeFile(outputPath, sddContent);

        console.log(_green('\nSolution Design Document generated successfully!'));
        console.log(`  Project: ${config.name}`);
        console.log(`  Client: ${config.client}`);
        console.log(`  Output: ${outputPath}\n`);

        console.log(_yellow('Document includes:'));
        console.log('  - Architecture overview');
        console.log('  - Data model design');
        console.log('  - Security model');
        console.log('  - Automation & workflows');
        console.log('  - Integration design');
        console.log('  - ALM strategy\n');
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logError(`Error generating solution design: ${message}`);
        process.exit(1);
      }
    });
}
