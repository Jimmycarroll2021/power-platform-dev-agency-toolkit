/**
 * Command: pp-agency discovery
 *
 * Runs an interactive discovery session and generates a discovery report.
 */

import * as path from 'node:path';
import { Command } from 'commander';
import { ProjectType, type DiscoveryScore } from '../lib/project-types.js';
import { ensureDir, writeFile, logInfo } from '../lib/file-utils.js';
import { discoveryReportTemplate } from '../lib/templates.js';

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
// Inquirer safe-import — provide a mock fallback for non-interactive environments
// ---------------------------------------------------------------------------
interface Question {
  type: string;
  name: string;
  message: string;
  choices?: string[];
  default?: unknown;
}

let inquirerModule: { prompt: (questions: Question[]) => Promise<Record<string, unknown>> } | undefined;

try {
  const mod = await import('inquirer');
  inquirerModule = mod.default ?? mod;
} catch {
  // Fallback for when inquirer is not available (non-TTY environments)
  inquirerModule = undefined;
}

// ---------------------------------------------------------------------------
// Mock prompt for non-interactive environments (CI, tests, etc.)
// ---------------------------------------------------------------------------

async function mockPrompt(questions: Question[]): Promise<Record<string, unknown>> {
  const answers: Record<string, unknown> = {};
  for (const q of questions) {
    if (q.default !== undefined) {
      answers[q.name] = q.default;
    } else if (q.choices && q.choices.length > 0) {
      answers[q.name] = q.choices[0];
    } else {
      answers[q.name] = '';
    }
  }
  return answers;
}

async function safePrompt(questions: Question[]): Promise<Record<string, unknown>> {
  if (inquirerModule) {
    return inquirerModule.prompt(questions);
  }
  console.log(_yellow('  (running in non-interactive mode — using defaults)\n'));
  return mockPrompt(questions);
}

// ---------------------------------------------------------------------------
// Options interface
// ---------------------------------------------------------------------------
interface DiscoveryOptions {
  output?: string;
  verbose?: boolean;
}

// ---------------------------------------------------------------------------
// Command registration
// ---------------------------------------------------------------------------

export function registerDiscoveryCommand(program: Command): void {
  program
    .command('discovery')
    .description('Run an interactive discovery session and generate a report')
    .option('-o, --output <file>', 'Output file path')
    .action(async (options: DiscoveryOptions) => {
      try {
        console.log(_cyan('\n=== Power Platform Discovery Session ===\n'));
        console.log('Answer the following questions to generate a discovery report.\n');

        // --- Basic info ---
        const basicAnswers = await safePrompt([
          {
            type: 'input',
            name: 'clientName',
            message: 'Client / organization name:',
            default: 'My Organization',
          },
          {
            type: 'list',
            name: 'projectType',
            message: 'What type of project is this?',
            choices: [
              'canvas-app',
              'model-driven',
              'power-pages',
              'integration',
              'copilot',
              'full-solution',
            ],
            default: 'canvas-app',
          },
          {
            type: 'input',
            name: 'projectDescription',
            message: 'Brief project description:',
            default: 'A new Power Platform solution',
          },
        ]);

        // --- Scoring matrix ---
        console.log(_cyan('\n--- Readiness Assessment (score 1-10) ---\n'));

        const scoreAnswers = await safePrompt([
          {
            type: 'number',
            name: 'businessReadiness',
            message: 'Business readiness (clear goals, sponsor support):',
            default: 7,
          },
          {
            type: 'number',
            name: 'technicalReadiness',
            message: 'Technical readiness (IT support, infrastructure):',
            default: 6,
          },
          {
            type: 'number',
            name: 'dataReadiness',
            message: 'Data readiness (data quality, access, governance):',
            default: 5,
          },
          {
            type: 'number',
            name: 'userReadiness',
            message: 'User readiness (adoption potential, training needs):',
            default: 6,
          },
          {
            type: 'number',
            name: 'integrationComplexity',
            message: 'Integration complexity (1 = simple, 10 = very complex):',
            default: 5,
          },
        ]);

        // --- Tools & timeline ---
        const planningAnswers = await safePrompt([
          {
            type: 'checkbox',
            name: 'toolsNeeded',
            message: 'Which tools/components are needed?',
            choices: [
              'Power Apps (Canvas)',
              'Power Apps (Model-Driven)',
              'Power Pages',
              'Power Automate',
              'Power BI',
              'Dataverse',
              'AI Builder',
              'Copilot Studio',
              'Azure Integration',
              'Custom Connectors',
            ],
            default: ['Power Apps (Canvas)', 'Dataverse', 'Power Automate'],
          },
          {
            type: 'list',
            name: 'timeline',
            message: 'Expected timeline:',
            choices: [
              '< 1 month',
              '1-3 months',
              '3-6 months',
              '6-12 months',
              '> 12 months',
            ],
            default: '3-6 months',
          },
          {
            type: 'list',
            name: 'budgetRange',
            message: 'Approximate budget range:',
            choices: [
              '< $10K',
              '$10K - $50K',
              '$50K - $100K',
              '$100K - $250K',
              '$250K - $500K',
              '> $500K',
            ],
            default: '$50K - $100K',
          },
        ]);

        // --- Build scores ---
        const scores: DiscoveryScore[] = [
          {
            category: 'Business Readiness',
            score: Number(scoreAnswers.businessReadiness) || 5,
            notes: 'Based on discovery session assessment',
          },
          {
            category: 'Technical Readiness',
            score: Number(scoreAnswers.technicalReadiness) || 5,
            notes: 'IT support and infrastructure evaluation',
          },
          {
            category: 'Data Readiness',
            score: Number(scoreAnswers.dataReadiness) || 5,
            notes: 'Data quality, access, and governance',
          },
          {
            category: 'User Readiness',
            score: Number(scoreAnswers.userReadiness) || 5,
            notes: 'Adoption potential and training considerations',
          },
          {
            category: 'Integration Complexity',
            score: 10 - (Number(scoreAnswers.integrationComplexity) || 5),
            notes: 'Inverted: higher score = lower complexity',
          },
        ];

        const client = String(basicAnswers.clientName ?? 'Unknown');
        const projectType = String(basicAnswers.projectType ?? 'canvas-app') as ProjectType;
        const tools = Array.isArray(planningAnswers.toolsNeeded)
          ? planningAnswers.toolsNeeded.map(String)
          : [];
        const timeline = String(planningAnswers.timeline ?? '3-6 months');
        const budget = String(planningAnswers.budgetRange ?? 'Unknown');

        if (options.verbose) {
          logInfo(`Client: ${client}`);
          logInfo(`Project type: ${projectType}`);
          logInfo(`Tools: ${tools.join(', ')}`);
        }

        // --- Generate report ---
        const reportContent = discoveryReportTemplate(
          client,
          projectType,
          tools,
          timeline,
          budget,
          scores
        );

        // Determine output path
        const outputDir = process.cwd();
        const defaultFileName = `${client.toLowerCase().replace(/\s+/g, '-')}-discovery-report.md`;
        const outputPath = options.output
          ? path.resolve(options.output)
          : path.join(outputDir, defaultFileName);

        ensureDir(path.dirname(outputPath));
        writeFile(outputPath, reportContent);

        // Summary
        const avgScore = scores.reduce((s, sc) => s + sc.score, 0) / scores.length;

        console.log(_green('\nDiscovery session complete!'));
        console.log(`  Client: ${client}`);
        console.log(`  Project Type: ${projectType}`);
        console.log(`  Overall Readiness: ${avgScore.toFixed(1)}/10`);
        console.log(`  Timeline: ${timeline}`);
        console.log(`  Budget: ${budget}`);
        console.log(`\n  Report saved to: ${outputPath}\n`);

        if (avgScore < 5) {
          console.log(_yellow('Recommendation: Address readiness gaps before proceeding to build phase.\n'));
        } else if (avgScore >= 8) {
          console.log(_green('Recommendation: Client is well-positioned for a successful delivery.\n'));
        }
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`Error during discovery: ${message}`);
        process.exit(1);
      }
    });
}
