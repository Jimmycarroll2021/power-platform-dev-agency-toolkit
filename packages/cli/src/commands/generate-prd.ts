/**
 * Command: pp-agency generate-prd
 *
 * Generates a Product Requirements Document (PRD) from template.
 */

import * as path from 'node:path';
import { Command } from 'commander';
import { ProjectType, type ProjectConfig } from '../lib/project-types.js';
import { ensureDir, writeFile, fileExists, logInfo, logError } from '../lib/file-utils.js';
import { prdTemplate } from '../lib/templates.js';

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
interface GeneratePrdOptions {
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

export function registerGeneratePrdCommand(program: Command): void {
  program
    .command('generate-prd')
    .description('Generate a Product Requirements Document (PRD)')
    .option('-p, --project <name>', 'Project name')
    .option('-o, --output <file>', 'Output file path')
    .option('-c, --client <name>', 'Client name')
    .option('-t, --type <type>', 'Project type (canvas-app, model-driven, etc.)')
    .action(async (options: GeneratePrdOptions) => {
      try {
        console.log(_cyan('\nGenerating Product Requirements Document\n'));

        // Resolve project name
        const projectName = options.project ?? 'Untitled Project';
        const client = options.client ?? 'Unknown Client';
        const projectType = resolveProjectType(options.type);

        if (options.verbose) {
          logInfo(`Project: ${projectName}`);
          logInfo(`Client: ${client}`);
          logInfo(`Type: ${projectType}`);
        }

        // Try to load existing project config if project flag points to a directory
        const config: ProjectConfig = {
          name: projectName,
          type: projectType,
          client,
          description: `${projectName} — PRD`,
          createdAt: new Date().toISOString(),
          version: '1.0.0',
        };

        const possibleProjectDir = path.resolve(projectName);
        if (fileExists(possibleProjectDir)) {
          const briefPath = path.join(possibleProjectDir, 'project-brief.md');
          if (fileExists(briefPath)) {
            logInfo(`Found existing project at ${possibleProjectDir}`);
            // In a real implementation, we'd parse the brief for config
            // For now, update the name from directory
            config.name = path.basename(possibleProjectDir);
          }
        }

        // Generate PRD
        const prdContent = prdTemplate(config);

        // Determine output path
        const outputPath = options.output
          ? path.resolve(options.output)
          : path.resolve(`${config.name.toLowerCase().replace(/\s+/g, '-')}-prd.md`);

        ensureDir(path.dirname(outputPath));
        writeFile(outputPath, prdContent);

        console.log(_green('\nPRD generated successfully!'));
        console.log(`  Project: ${config.name}`);
        console.log(`  Client: ${config.client}`);
        console.log(`  Output: ${outputPath}\n`);

        console.log(_yellow('Next steps:'));
        console.log('  1. Review and customize the generated PRD');
        console.log('  2. Share with stakeholders for feedback');
        console.log(`  3. Run: pp-agency generate-solution-design --project "${config.name}"\n`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logError(`Error generating PRD: ${message}`);
        process.exit(1);
      }
    });
}
