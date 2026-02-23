import type { Market, ScoringWeights } from '@/types';

export const DEFAULT_WEIGHTS: ScoringWeights = {
  retail: 55,
  supplyChain: 30,
  strategic: 15,
  retailSub: { demo: 12, income: 12, lifestyle: 10, ddg: 10, comp: 6, traffic: 5 },
  scSub: { tcts: 10, speed: 6, returns: 5, dcProx: 5, invVel: 4 },
  stratSub: { re: 5, climate: 4, tourism: 3, preempt: 3 },
};

export const WEIGHT_PRESETS: Record<string, { label: string; weights: Pick<ScoringWeights, 'retail' | 'supplyChain' | 'strategic'> }> = {
  balanced: { label: 'Balanced', weights: { retail: 55, supplyChain: 30, strategic: 15 } },
  retailFirst: { label: 'Retail-First', weights: { retail: 70, supplyChain: 20, strategic: 10 } },
  scOptimized: { label: 'SC Optimized', weights: { retail: 40, supplyChain: 45, strategic: 15 } },
  competitive: { label: 'Competitive', weights: { retail: 45, supplyChain: 25, strategic: 30 } },
};

function weightedAvg(scores: Record<string, number>, weights: Record<string, number>): number {
  const totalWeight = Object.values(weights).reduce((a, b) => a + b, 0);
  if (totalWeight === 0) return 0;
  let sum = 0;
  for (const key in weights) {
    sum += (scores[key] ?? 0) * weights[key];
  }
  return sum / totalWeight;
}

export function calculateRetailScore(market: Market, weights: ScoringWeights): number {
  return weightedAvg(market.retail as unknown as Record<string, number>, weights.retailSub as unknown as Record<string, number>);
}

export function calculateSCScore(market: Market, weights: ScoringWeights): number {
  return weightedAvg(market.sc as unknown as Record<string, number>, weights.scSub as unknown as Record<string, number>);
}

export function calculateStrategicScore(market: Market, weights: ScoringWeights): number {
  return weightedAvg(market.strat as unknown as Record<string, number>, weights.stratSub as unknown as Record<string, number>);
}

export function calculateTrailheadScore(market: Market, weights: ScoringWeights): number {
  const retailScore = calculateRetailScore(market, weights);
  const scScore = calculateSCScore(market, weights);
  const stratScore = calculateStrategicScore(market, weights);
  const total = weights.retail + weights.supplyChain + weights.strategic;
  return Math.round(
    (retailScore * weights.retail + scScore * weights.supplyChain + stratScore * weights.strategic) / total
  );
}

export function rankMarkets(markets: Market[], weights: ScoringWeights): (Market & { calculatedScore: number })[] {
  return markets
    .map(m => ({ ...m, calculatedScore: calculateTrailheadScore(m, weights) }))
    .sort((a, b) => b.calculatedScore - a.calculatedScore)
    .map((m, i) => ({ ...m, rank: i + 1 }));
}
