/**
 * Command: pp-agency estimate-licensing
 *
 * Estimates monthly licensing costs for Power Platform.
 */

import * as path from 'node:path';
import { Command } from 'commander';
import { type LicenseComponent } from '../lib/project-types.js';
import { ensureDir, writeFile, logInfo } from '../lib/file-utils.js';
import { licensingEstimateTemplate } from '../lib/templates.js';

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
// Inquirer safe-import with fallback
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
  inquirerModule = undefined;
}

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
interface EstimateOptions {
  output?: string;
  currency?: string;
  verbose?: boolean;
}

// ---------------------------------------------------------------------------
// Pricing data (USD estimates — approximated)
// ---------------------------------------------------------------------------

const PRICING_USD: Record<string, number> = {
  'power-apps-per-user': 20.0,
  'power-apps-per-app': 10.0,
  'power-automate-per-user': 15.0,
  'power-automate-unattended': 150.0,
  'power-automate-hosted-rpa': 215.0,
  'power-pages-authenticated': 200.0,
  'power-pages-anonymous': 75.0,
  'power-bi-pro': 14.0,
  'power-bi-premium-per-user': 20.0,
  'power-virtual-agents': 200.0,
  'ai-builder-credits': 500.0,
  'copilot-studio-message': 200.0,
  'microsoft-copilot-studio': 200.0,
};

// Conversion rates (approximate)
const CURRENCY_RATES: Record<string, number> = {
  usd: 1.0,
  gbp: 0.79,
  eur: 0.92,
};

// ---------------------------------------------------------------------------
// Command registration
// ---------------------------------------------------------------------------

export function registerEstimateLicensingCommand(program: Command): void {
  program
    .command('estimate-licensing')
    .description('Estimate Power Platform licensing costs')
    .option('-o, --output <file>', 'Output file path')
    .option('-c, --currency <code>', 'Currency: usd, gbp, eur', 'usd')
    .action(async (options: EstimateOptions) => {
      try {
        console.log(_cyan('\n=== Power Platform Licensing Estimator ===\n'));
        console.log('Answer the following questions to estimate your monthly licensing costs.\n');

        const currency = (options.currency ?? 'usd').toLowerCase();
        const rate = CURRENCY_RATES[currency] ?? 1.0;
        const symbol = currency === 'gbp' ? '£' : currency === 'eur' ? '€' : '$';

        if (options.verbose) {
          logInfo(`Currency: ${currency.toUpperCase()} (rate multiplier: ${rate})`);
        }

        // --- User counts ---
        const userAnswers = await safePrompt([
          {
            type: 'number',
            name: 'powerAppsUsers',
            message: 'Number of Power Apps per-user licenses needed:',
            default: 10,
          },
          {
            type: 'number',
            name: 'powerAppsPerAppUsers',
            message: 'Number of Power Apps per-app licenses needed:',
            default: 5,
          },
          {
            type: 'number',
            name: 'powerAutomateUsers',
            message: 'Number of Power Automate per-user licenses:',
            default: 5,
          },
          {
            type: 'number',
            name: 'powerAutomateUnattended',
            message: 'Number of unattended RPA licenses:',
            default: 0,
          },
          {
            type: 'number',
            name: 'powerBiProUsers',
            message: 'Number of Power BI Pro users:',
            default: 10,
          },
          {
            type: 'number',
            name: 'powerBiPremiumUsers',
            message: 'Number of Power BI Premium Per User:',
            default: 2,
          },
        ]);

        // --- Power Pages ---
        const pagesAnswers = await safePrompt([
          {
            type: 'number',
            name: 'powerPagesAuthenticated',
            message: 'Power Pages authenticated users (per 100/month):',
            default: 0,
          },
          {
            type: 'number',
            name: 'powerPagesAnonymous',
            message: 'Power Pages anonymous users (per 500/month):',
            default: 0,
          },
        ]);

        // --- AI & Copilot ---
        const aiAnswers = await safePrompt([
          {
            type: 'number',
            name: 'aiBuilderCredits',
            message: 'AI Builder credit units (1 unit = 1M credits):',
            default: 1,
          },
          {
            type: 'number',
            name: 'copilotStudioSessions',
            message: 'Copilot Studio sessions (per 100/month):',
            default: 0,
          },
          {
            type: 'number',
            name: 'virtualAgents',
            message: 'Power Virtual Agents sessions (per 100/month):',
            default: 0,
          },
        ]);

        // --- Calculate ---
        const components: LicenseComponent[] = [];

        const powerAppsUsers = Number(userAnswers.powerAppsUsers) || 0;
        if (powerAppsUsers > 0) {
          const unitPrice = PRICING_USD['power-apps-per-user'] * rate;
          components.push({
            name: 'Power Apps Per User',
            quantity: powerAppsUsers,
            unitPrice,
            total: powerAppsUsers * unitPrice,
          });
        }

        const perAppUsers = Number(userAnswers.powerAppsPerAppUsers) || 0;
        if (perAppUsers > 0) {
          const unitPrice = PRICING_USD['power-apps-per-app'] * rate;
          components.push({
            name: 'Power Apps Per App',
            quantity: perAppUsers,
            unitPrice,
            total: perAppUsers * unitPrice,
          });
        }

        const automateUsers = Number(userAnswers.powerAutomateUsers) || 0;
        if (automateUsers > 0) {
          const unitPrice = PRICING_USD['power-automate-per-user'] * rate;
          components.push({
            name: 'Power Automate Per User',
            quantity: automateUsers,
            unitPrice,
            total: automateUsers * unitPrice,
          });
        }

        const unattended = Number(userAnswers.powerAutomateUnattended) || 0;
        if (unattended > 0) {
          const unitPrice = PRICING_USD['power-automate-unattended'] * rate;
          components.push({
            name: 'Power Automate Unattended RPA',
            quantity: unattended,
            unitPrice,
            total: unattended * unitPrice,
          });
        }

        const biPro = Number(userAnswers.powerBiProUsers) || 0;
        if (biPro > 0) {
          const unitPrice = PRICING_USD['power-bi-pro'] * rate;
          components.push({
            name: 'Power BI Pro',
            quantity: biPro,
            unitPrice,
            total: biPro * unitPrice,
          });
        }

        const biPremium = Number(userAnswers.powerBiPremiumUsers) || 0;
        if (biPremium > 0) {
          const unitPrice = PRICING_USD['power-bi-premium-per-user'] * rate;
          components.push({
            name: 'Power BI Premium Per User',
            quantity: biPremium,
            unitPrice,
            total: biPremium * unitPrice,
          });
        }

        const pagesAuth = Number(pagesAnswers.powerPagesAuthenticated) || 0;
        if (pagesAuth > 0) {
          const unitPrice = PRICING_USD['power-pages-authenticated'] * rate;
          components.push({
            name: 'Power Pages Authenticated (per 100)',
            quantity: pagesAuth,
            unitPrice,
            total: pagesAuth * unitPrice,
          });
        }

        const pagesAnon = Number(pagesAnswers.powerPagesAnonymous) || 0;
        if (pagesAnon > 0) {
          const unitPrice = PRICING_USD['power-pages-anonymous'] * rate;
          components.push({
            name: 'Power Pages Anonymous (per 500)',
            quantity: pagesAnon,
            unitPrice,
            total: pagesAnon * unitPrice,
          });
        }

        const aiBuilder = Number(aiAnswers.aiBuilderCredits) || 0;
        if (aiBuilder > 0) {
          const unitPrice = PRICING_USD['ai-builder-credits'] * rate;
          components.push({
            name: 'AI Builder Credits (per 1M)',
            quantity: aiBuilder,
            unitPrice,
            total: aiBuilder * unitPrice,
          });
        }

        const copilotSessions = Number(aiAnswers.copilotStudioSessions) || 0;
        if (copilotSessions > 0) {
          const unitPrice = PRICING_USD['microsoft-copilot-studio'] * rate;
          components.push({
            name: 'Copilot Studio Sessions (per 100)',
            quantity: copilotSessions,
            unitPrice,
            total: copilotSessions * unitPrice,
          });
        }

        const vAgents = Number(aiAnswers.virtualAgents) || 0;
        if (vAgents > 0) {
          const unitPrice = PRICING_USD['power-virtual-agents'] * rate;
          components.push({
            name: 'Power Virtual Agents Sessions (per 100)',
            quantity: vAgents,
            unitPrice,
            total: vAgents * unitPrice,
          });
        }

        const monthlyTotal = components.reduce((sum, c) => sum + c.total, 0);
        const annualTotal = monthlyTotal * 12;

        // Generate report
        const reportContent = licensingEstimateTemplate(
          currency,
          components,
          monthlyTotal,
          annualTotal
        );

        const outputPath = options.output
          ? path.resolve(options.output)
          : path.resolve('licensing-estimate.md');

        ensureDir(path.dirname(outputPath));
        writeFile(outputPath, reportContent);

        // Summary output
        console.log(_green('\n=== Licensing Estimate Summary ===\n'));
        console.log(`Currency: ${symbol}${currency.toUpperCase()}`);
        console.log(`Components: ${components.length}\n`);

        for (const comp of components) {
          console.log(`  ${comp.name.padEnd(40)} ${String(comp.quantity).padStart(4)} x ${symbol}${comp.unitPrice.toFixed(2)} = ${symbol}${comp.total.toFixed(2)}`);
        }

        console.log('');
        console.log(`  ${'MONTHLY TOTAL:'.padEnd(45)} ${symbol}${monthlyTotal.toFixed(2)}`);
        console.log(`  ${'ANNUAL TOTAL:'.padEnd(45)} ${symbol}${annualTotal.toFixed(2)}`);

        console.log(_yellow('\nNote: These are estimated costs based on list pricing.'));
        console.log('Contact a Microsoft partner for formal pricing and volume discounts.\n');
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        console.error(`Error estimating licensing: ${message}`);
        process.exit(1);
      }
    });
}
