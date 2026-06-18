/**
 * Command: pp-agency checklist --type <type>
 *
 * Generates a markdown checklist for various project phases.
 */

import * as path from 'node:path';
import { Command } from 'commander';
import { ensureDir, writeFile, logInfo, logError } from '../lib/file-utils.js';
import { checklistTemplate } from '../lib/templates.js';

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
interface ChecklistOptions {
  type?: string;
  output?: string;
  verbose?: boolean;
}

// ---------------------------------------------------------------------------
// Checklist definitions
// ---------------------------------------------------------------------------

type ChecklistSection = { category: string; tasks: string[] };

const CHECKLISTS: Record<string, ChecklistSection[]> = {
  'project-intake': [
    {
      category: 'Initial Request',
      tasks: [
        'Business need documented',
        'Executive sponsor identified',
        'Budget range confirmed',
        'Target timeline established',
      ],
    },
    {
      category: 'Stakeholder Assessment',
      tasks: [
        'Key stakeholders mapped',
        'User personas identified',
        'Change impact assessed',
        'Communication plan drafted',
      ],
    },
    {
      category: 'Technical Assessment',
      tasks: [
        'Existing systems inventoried',
        'Integration points identified',
        'Data sources cataloged',
        'Security requirements gathered',
      ],
    },
    {
      category: 'Decision Gate',
      tasks: [
        'Feasibility confirmed',
        'Approach agreed (build vs buy)',
        'Resource plan approved',
        'Project charter signed off',
      ],
    },
  ],
  'scope-validation': [
    {
      category: 'Requirements',
      tasks: [
        'All functional requirements documented',
        'Non-functional requirements defined',
        'Acceptance criteria written',
        'Requirements prioritized (MoSCoW)',
      ],
    },
    {
      category: 'Scope Boundaries',
      tasks: [
        'In-scope items listed',
        'Out-of-scope items documented',
        'Phase breakdown defined',
        'Future roadmap identified',
      ],
    },
    {
      category: 'Validation',
      tasks: [
        'Requirements reviewed with stakeholders',
        'Technical feasibility confirmed',
        'Estimates validated',
        'Scope signed off by all parties',
      ],
    },
  ],
  'deployment': [
    {
      category: 'Pre-Deployment',
      tasks: [
        'Solution imported to TEST successfully',
        'UAT completed with sign-off',
        'Data migration plan tested',
        'Rollback plan documented',
        'Deployment schedule agreed',
      ],
    },
    {
      category: 'Environment Preparation',
      tasks: [
        'Production environment provisioned',
        'Security roles configured',
        'License assignments verified',
        'Integration endpoints updated',
      ],
    },
    {
      category: 'Deployment Execution',
      tasks: [
        'Solution imported to PROD',
        'Post-deployment checks passed',
        'Smoke tests executed',
        'Users can access the application',
      ],
    },
    {
      category: 'Post-Deployment',
      tasks: [
        'Monitoring configured',
        'Incident response plan active',
        'User support channels live',
        'Lessons learned documented',
      ],
    },
  ],
  'qa': [
    {
      category: 'Test Planning',
      tasks: [
        'Test strategy documented',
        'Test cases written and reviewed',
        'Test data prepared',
        'Test environments ready',
      ],
    },
    {
      category: 'Functional Testing',
      tasks: [
        'Unit tests completed',
        'Integration tests passed',
        'End-to-end scenarios validated',
        'Business rules verified',
      ],
    },
    {
      category: 'Non-Functional Testing',
      tasks: [
        'Performance tests passed',
        'Security review completed',
        'Accessibility checks done',
        'Mobile responsiveness verified',
      ],
    },
    {
      category: 'UAT',
      tasks: [
        'UAT plan approved',
        'UAT scenarios executed',
        'Defects triaged and resolved',
        'Business sign-off obtained',
      ],
    },
  ],
  'governance': [
    {
      category: 'Environment Strategy',
      tasks: [
        'Environment request process defined',
        'Naming conventions established',
        'DLP policies configured',
        'Environment access controlled',
      ],
    },
    {
      category: 'ALM Process',
      tasks: [
        'Solution packaging standards set',
        'Version control strategy defined',
        'Deployment pipeline configured',
        'Change management process active',
      ],
    },
    {
      category: 'Security & Compliance',
      tasks: [
        'Security roles documented',
        'Audit logging enabled',
        'Data loss prevention configured',
        'Compliance requirements met',
      ],
    },
    {
      category: 'Monitoring',
      tasks: [
        'Usage analytics reviewed',
        'Performance baselines established',
        'Incident response plan defined',
        'Regular health checks scheduled',
      ],
    },
  ],
  'support-handover': [
    {
      category: 'Documentation',
      tasks: [
        'Solution documentation complete',
        'Architecture diagrams updated',
        'Admin guide written',
        'User guide published',
        'Known issues documented',
      ],
    },
    {
      category: 'Training',
      tasks: [
        'Admin training completed',
        'End-user training delivered',
        'Training materials handed over',
        'Knowledge transfer sessions held',
      ],
    },
    {
      category: 'Operations',
      tasks: [
        'Support contacts defined',
        'Escalation paths documented',
        'Monitoring dashboards shared',
        'Backup/recovery procedures confirmed',
      ],
    },
    {
      category: 'Sign-off',
      tasks: [
        'Handover checklist completed',
        'Stakeholder acceptance received',
        'Warranty period agreed',
        'Project formally closed',
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function resolveChecklistType(type?: string): string {
  if (!type) return 'project-intake';
  const normalized = type.toLowerCase().replace(/_/g, '-');
  return CHECKLISTS[normalized] ? normalized : 'project-intake';
}

function getChecklistTitle(type: string): string {
  const titles: Record<string, string> = {
    'project-intake': 'Project Intake',
    'scope-validation': 'Scope Validation',
    'deployment': 'Deployment',
    'qa': 'Quality Assurance',
    'governance': 'Governance',
    'support-handover': 'Support Handover',
  };
  return titles[type] ?? 'Project Checklist';
}

// ---------------------------------------------------------------------------
// Command registration
// ---------------------------------------------------------------------------

export function registerChecklistCommand(program: Command): void {
  program
    .command('checklist')
    .description('Generate a checklist for a project phase')
    .option(
      '-t, --type <type>',
      'Checklist type: project-intake, scope-validation, deployment, qa, governance, support-handover'
    )
    .option('-o, --output <file>', 'Output file path')
    .action(async (options: ChecklistOptions) => {
      try {
        console.log(_cyan('\nGenerating Checklist\n'));

        const checklistType = resolveChecklistType(options.type);
        const title = getChecklistTitle(checklistType);

        if (options.verbose) {
          logInfo(`Checklist type: ${checklistType}`);
        }

        const sections = CHECKLISTS[checklistType];
        if (!sections) {
          logError(`Unknown checklist type: ${checklistType}`);
          console.log(_yellow('\nAvailable types:'));
          Object.keys(CHECKLISTS).forEach((t) => console.log(`  - ${t}`));
          process.exit(1);
        }

        // Generate checklist
        const content = checklistTemplate(title, sections);

        // Determine output path
        const outputPath = options.output
          ? path.resolve(options.output)
          : path.resolve(`${checklistType}-checklist.md`);

        ensureDir(path.dirname(outputPath));
        writeFile(outputPath, content);

        console.log(_green('\nChecklist generated successfully!'));
        console.log(`  Type: ${title}`);
        console.log(`  Sections: ${sections.length}`);
        console.log(`  Total tasks: ${sections.reduce((sum, s) => sum + s.tasks.length, 0)}`);
        console.log(`  Output: ${outputPath}\n`);
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        logError(`Error generating checklist: ${message}`);
        process.exit(1);
      }
    });
}
