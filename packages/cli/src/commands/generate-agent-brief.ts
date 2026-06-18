/**
 * Command: pp-agency agent-brief --agent <type> --project <name>
 *
 * Generates a task-specific brief for an AI agent.
 */

import * as path from 'node:path';
import { Command } from 'commander';
import { AgentType, ProjectType, type ProjectConfig } from '../lib/project-types.js';
import { ensureDir, writeFile, fileExists, readFile, logInfo, logError, logWarn } from '../lib/file-utils.js';
import { agentBriefTemplate } from '../lib/templates.js';

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
interface AgentBriefOptions {
  agent?: string;
  project?: string;
  output?: string;
  context?: string;
  verbose?: boolean;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveAgentType(type?: string): AgentType {
  if (!type) return AgentType.Developer;
  const normalized = type.toLowerCase().replace(/_/g, '-');

  const agentMap: Record<string, AgentType> = {
    'architect': AgentType.Architect,
    'data-modeler': AgentType.DataModeler,
    'developer': AgentType.Developer,
    'tester': AgentType.Tester,
    'alm-engineer': AgentType.AlmEngineer,
    'security-admin': AgentType.SecurityAdmin,
  };

  return agentMap[normalized] ?? AgentType.Developer;
}

/**
 * Try to load project context from a project directory.
 */
function loadProjectContext(projectName: string): { config: ProjectConfig; context: string } | null {
  const possiblePaths = [
    path.resolve(projectName),
    path.resolve(projectName.toLowerCase().replace(/\s+/g, '-')),
    path.resolve(process.cwd(), projectName),
  ];

  for (const projectDir of possiblePaths) {
    if (!fileExists(projectDir)) continue;

    const briefPath = path.join(projectDir, 'project-brief.md');
    const prdPath = path.join(projectDir, 'prd.md');

    const contextParts: string[] = [];

    if (fileExists(briefPath)) {
      const brief = readFile(briefPath) ?? '';
      contextParts.push('## Project Brief\n' + brief.slice(0, 2000));
    }

    if (fileExists(prdPath)) {
      const prd = readFile(prdPath) ?? '';
      contextParts.push('## PRD Excerpt\n' + prd.slice(0, 2000));
    }

    // Try to derive config from directory
    const config: ProjectConfig = {
      name: path.basename(projectDir),
      type: ProjectType.CanvasApp,
      client: 'Unknown Client',
      description: `Agent brief for ${projectName}`,
      createdAt: new Date().toISOString(),
      version: '1.0.0',
    };

    // Try to parse frontmatter from brief for better config
    const briefContent = fileExists(briefPath) ? (readFile(briefPath) ?? '') : '';
    const clientMatch = briefContent.match(/client:\s*(.+)/);
    if (clientMatch) {
      config.client = clientMatch[1].trim();
    }
    const typeMatch = briefContent.match(/type:\s*(.+)/);
    if (typeMatch) {
      const t = typeMatch[1].trim();
      if (Object.values(ProjectType).includes(t as ProjectType)) {
        config.type = t as ProjectType;
      }
    }

    return {
      config,
      context: contextParts.join('\n\n') || `Project: ${projectName}\nLocation: ${projectDir}`,
    };
  }

  return null;
}

// ---------------------------------------------------------------------------
// Command registration
// ---------------------------------------------------------------------------

export function registerGenerateAgentBriefCommand(program: Command): void {
  program
    .command('agent-brief')
    .description('Generate a task-specific brief for an AI agent')
    .requiredOption('-a, --agent <type>', 'Agent type (architect, data-modeler, developer, tester, alm-engineer, security-admin)')
    .option('-p, --project <name>', 'Project name')
    .option('-o, --output <file>', 'Output file path')
    .option('-c, --context <text>', 'Additional context to include in the brief')
    .action(async (options: AgentBriefOptions) => {
      try {
        console.log(_cyan('\nGenerating Agent Brief\n'));

        const agentType = resolveAgentType(options.agent);
        const projectName = options.project ?? 'Untitled Project';

        if (options.verbose) {
          logInfo(`Agent type: ${agentType}`);
          logInfo(`Project: ${projectName}`);
        }

        // Try to load project context
        let config: ProjectConfig;
        let context: string;

        const loaded = loadProjectContext(projectName);
        if (loaded) {
          config = loaded.config;
          context = loaded.context;
          logInfo(`Loaded project context from ${config.name}`);
        } else {
          // Create minimal config
          config = {
            name: projectName,
            type: ProjectType.CanvasApp,
            client: 'Unknown Client',
            description: `Agent brief for ${projectName}`,
            createdAt: new Date().toISOString(),
            version: '1.0.0',
          };
          context = options.context ?? `Project: ${projectName}. No existing project files found.`;
          logWarn('No existing project found — using minimal configuration');
        }

        // Append extra context if provided
        if (options.context) {
          context += '\n\n## Additional Context\n' + options.context;
        }

        // Generate brief
        const briefContent = agentBriefTemplate(config, agentType, context);

        // Determine output path
        const sanitizedName = config.name.toLowerCase().replace(/\s+/g, '-');
        const outputPath = options.output
          ? path.resolve(options.output)
          : path.resolve(`${sanitizedName}-${agentType}-brief.md`);

        ensureDir(path.dirname(outputPath));
        writeFile(outputPath, briefContent);

        console.log(_green('\nAgent brief generated successfully!'));
        console.log(`  Agent: ${agentType}`);
        console.log(`  Project: ${config.name}`);
        console.log(`  Client: ${config.client}`);
        console.log(`  Output: ${outputPath}\n`);

        console.log(_yellow('The brief includes:'));
        console.log('  - Role-specific responsibilities');
        console.log('  - Project context and constraints');
        console.log('  - Required deliverables');
        console.log('  - Dependency references\n');
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logError(`Error generating agent brief: ${message}`);
        process.exit(1);
      }
    });
}
