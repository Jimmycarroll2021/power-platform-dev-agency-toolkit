#!/usr/bin/env tsx
/**
 * estimate-credits.ts
 *
 * Estimates AI Builder / Copilot credit consumption.
 *
 * Usage:
 *   tsx scripts/estimate-credits.ts <model-type> [--volume 1000] [--currency USD]
 *
 * Supported model types:
 *   document-processing, form-processing, text-classification,
 *   prediction, object-detection, gpt-prompt, copilot-conversation,
 *   invoice-processing, receipt-processing, sentiment-analysis
 */

// ── Credit Rates (per 1,000 predictions / calls) ─────────────────────────────

interface ModelRate {
  type: string;
  description: string;
  creditsPer1K: number; // AI Builder credits per 1,000 calls
  copilotMessagesPer1K?: number; // Copilot Studio messages per 1,000 calls
  minConfidence: number;
  typicalResponseTimeMs: number;
}

const MODEL_RATES: Record<string, ModelRate> = {
  "document-processing": {
    type: "document-processing",
    description: "Extract text, tables, and selection marks from documents",
    creditsPer1K: 60,
    minConfidence: 0.85,
    typicalResponseTimeMs: 3000,
  },
  "form-processing": {
    type: "form-processing",
    description: "Extract structured data from forms",
    creditsPer1K: 60,
    minConfidence: 0.80,
    typicalResponseTimeMs: 2500,
  },
  "invoice-processing": {
    type: "invoice-processing",
    description: "Prebuilt invoice extraction model",
    creditsPer1K: 30,
    minConfidence: 0.85,
    typicalResponseTimeMs: 2000,
  },
  "receipt-processing": {
    type: "receipt-processing",
    description: "Prebuilt receipt extraction model",
    creditsPer1K: 30,
    minConfidence: 0.80,
    typicalResponseTimeMs: 1500,
  },
  "text-classification": {
    type: "text-classification",
    description: "Classify text into custom categories",
    creditsPer1K: 30,
    minConfidence: 0.75,
    typicalResponseTimeMs: 500,
  },
  "sentiment-analysis": {
    type: "sentiment-analysis",
    description: "Analyze sentiment of text",
    creditsPer1K: 15,
    minConfidence: 0.70,
    typicalResponseTimeMs: 300,
  },
  prediction: {
    type: "prediction",
    description: "Predict outcomes based on historical data",
    creditsPer1K: 45,
    minConfidence: 0.75,
    typicalResponseTimeMs: 800,
  },
  "object-detection": {
    type: "object-detection",
    description: "Detect objects in images",
    creditsPer1K: 90,
    minConfidence: 0.70,
    typicalResponseTimeMs: 4000,
  },
  "gpt-prompt": {
    type: "gpt-prompt",
    description: "Create a prompt using GPT (Create text with GPT)",
    creditsPer1K: 15,
    minConfidence: 0.0, // N/A for generative
    typicalResponseTimeMs: 2000,
  },
  "copilot-conversation": {
    type: "copilot-conversation",
    description: "Copilot Studio conversation sessions",
    creditsPer1K: 0, // Uses message packs instead
    copilotMessagesPer1K: 1000,
    minConfidence: 0.0,
    typicalResponseTimeMs: 1500,
  },
};

// ── Pricing (USD, per credit / message) ──────────────────────────────────────

interface PricingTier {
  name: string;
  creditsIncluded: number;
  pricePerMonth: number;
  overagePricePer1K: number;
}

const PRICING_TIERS: PricingTier[] = [
  { name: "AI Builder Trial", creditsIncluded: 0, pricePerMonth: 0, overagePricePer1K: 0 },
  { name: "AI Builder Add-on", creditsIncluded: 1_000_000, pricePerMonth: 500, overagePricePer1K: 0.50 },
  { name: " seeded (per 5K users)", creditsIncluded: 5_000_000, pricePerMonth: 0, overagePricePer1K: 0.50 },
];

const COPILOT_MESSAGE_PACK = {
  messagesPerPack: 25_000,
  pricePerPackPerMonth: 200,
};

// ── Calculator ───────────────────────────────────────────────────────────────

interface EstimationResult {
  modelType: string;
  monthlyVolume: number;
  monthlyCredits: number;
  monthlyCopilotMessages?: number;
  estimatedCost: {
    tier: string;
    baseCost: number;
    overageCredits: number;
    overageCost: number;
    totalCost: number;
  }[];
  recommendations: string[];
}

function estimateCredits(
  modelType: string,
  monthlyVolume: number,
  _currency: string = "USD"
): EstimationResult {
  const rate = MODEL_RATES[modelType];
  if (!rate) {
    throw new Error(
      `Unknown model type: ${modelType}. Available: ${Object.keys(MODEL_RATES).join(", ")}`
    );
  }

  const monthlyCredits = (monthlyVolume / 1000) * rate.creditsPer1K;
  const monthlyCopilotMessages = rate.copilotMessagesPer1K
    ? (monthlyVolume / 1000) * rate.copilotMessagesPer1K
    : undefined;

  const costEstimates = PRICING_TIERS.map((tier) => {
    const overage = Math.max(0, monthlyCredits - tier.creditsIncluded);
    const overageCost = (overage / 1000) * tier.overagePricePer1K;
    return {
      tier: tier.name,
      baseCost: tier.pricePerMonth,
      overageCredits: overage,
      overageCost: overageCost,
      totalCost: tier.pricePerMonth + overageCost,
    };
  });

  const recommendations: string[] = [];

  if (monthlyVolume > 100_000) {
    recommendations.push(
      "Consider batch processing to optimize credit usage"
    );
  }
  if (rate.creditsPer1K > 60) {
    recommendations.push(
      "High credit model - consider caching results where possible"
    );
  }
  if (monthlyCopilotMessages && monthlyCopilotMessages > 25_000) {
    const packsNeeded = Math.ceil(
      monthlyCopilotMessages / COPILOT_MESSAGE_PACK.messagesPerPack
    );
    recommendations.push(
      `Copilot Studio: ~${packsNeeded} message pack(s) needed (${COPILOT_MESSAGE_PACK.pricePerPackPerMonth} USD each)`
    );
  }
  if (monthlyCredits < 1_000_000) {
    recommendations.push("AI Builder Add-on tier should cover this usage");
  } else {
    recommendations.push(
      "High volume - contact Microsoft for volume pricing"
    );
  }

  return {
    modelType,
    monthlyVolume,
    monthlyCredits,
    monthlyCopilotMessages,
    estimatedCost: costEstimates,
    recommendations,
  };
}

// ── Report ───────────────────────────────────────────────────────────────────

function printReport(result: EstimationResult, currency: string): void {
  const rate = MODEL_RATES[result.modelType];

  console.log("╔══════════════════════════════════════════════════════════════════╗");
  console.log("║           AI BUILDER / COPILOT CREDIT ESTIMATE                   ║");
  console.log("╚══════════════════════════════════════════════════════════════════╝");
  console.log();

  console.log("📊 Model Information:");
  console.log(`   Type:        ${result.modelType}`);
  console.log(`   Description: ${rate.description}`);
  console.log(`   Min confidence: ${rate.minConfidence > 0 ? (rate.minConfidence * 100).toFixed(0) + "%" : "N/A"}`);
  console.log(`   Avg latency: ${rate.typicalResponseTimeMs}ms`);
  console.log();

  console.log("📈 Usage Estimate:");
  console.log(`   Monthly volume:    ${result.monthlyVolume.toLocaleString()} calls`);
  console.log(`   Monthly credits:   ${result.monthlyCredits.toLocaleString()} credits`);
  if (result.monthlyCopilotMessages) {
    console.log(
      `   Monthly messages:  ${result.monthlyCopilotMessages.toLocaleString()} messages`
    );
  }
  console.log();

  console.log(`💰 Cost Estimates (${currency}):`);
  console.log("───────────────────────────────────────────────────────────────────");
  console.log(
    `  ${"Tier".padEnd(25)} ${"Base".padStart(10)} ${"Overage".padStart(12)} ${"Total".padStart(10)}`
  );
  console.log("───────────────────────────────────────────────────────────────────");
  for (const cost of result.estimatedCost) {
    const tierName = cost.tier.padEnd(25);
    const base = cost.baseCost.toLocaleString(undefined, { style: "currency", currency }).padStart(10);
    const overage = cost.overageCost.toLocaleString(undefined, { style: "currency", currency }).padStart(12);
    const total = cost.totalCost.toLocaleString(undefined, { style: "currency", currency }).padStart(10);
    console.log(`  ${tierName}${base}${overage}${total}`);
  }
  console.log();

  if (result.monthlyCopilotMessages) {
    const packsNeeded = Math.ceil(
      result.monthlyCopilotMessages / COPILOT_MESSAGE_PACK.messagesPerPack
    );
    const copilotCost = packsNeeded * COPILOT_MESSAGE_PACK.pricePerPackPerMonth;
    console.log("🤖 Copilot Studio Cost:");
    console.log(`   Message packs needed: ${packsNeeded}`);
    console.log(
      `   Cost: ${copilotCost.toLocaleString(undefined, { style: "currency", currency })} / month`
    );
    console.log();
  }

  console.log("💡 Recommendations:");
  for (const rec of result.recommendations) {
    console.log(`   - ${rec}`);
  }
  console.log();

  console.log("⚠️  Disclaimer: These are estimates only. Actual usage may vary.");
  console.log("   Review Microsoft licensing documentation for current pricing.");
}

// ── CLI ──────────────────────────────────────────────────────────────────────

function parseArgs(): { modelType: string; volume: number; currency: string } {
  const args = process.argv.slice(2);

  if (args.length === 0) {
    console.error("Usage: tsx scripts/estimate-credits.ts <model-type> [--volume 1000] [--currency USD]");
    console.error("\nSupported model types:");
    for (const [key, rate] of Object.entries(MODEL_RATES)) {
      console.error(`  - ${key}: ${rate.description}`);
    }
    process.exit(1);
  }

  const modelType = args[0];
  let volume = 1000;
  let currency = "USD";

  const volumeIndex = args.indexOf("--volume");
  if (volumeIndex !== -1 && args[volumeIndex + 1]) {
    volume = parseInt(args[volumeIndex + 1], 10);
    if (isNaN(volume) || volume <= 0) {
      console.error("Invalid volume. Must be a positive integer.");
      process.exit(1);
    }
  }

  const currencyIndex = args.indexOf("--currency");
  if (currencyIndex !== -1 && args[currencyIndex + 1]) {
    currency = args[currencyIndex + 1].toUpperCase();
  }

  return { modelType, volume, currency };
}

// ── Entry Point ──────────────────────────────────────────────────────────────

function main(): void {
  const { modelType, volume, currency } = parseArgs();
  const result = estimateCredits(modelType, volume, currency);
  printReport(result, currency);
}

if (require.main === module) {
  main();
}

export { estimateCredits, MODEL_RATES, PRICING_TIERS };
