import type { Market } from '@/types';
import { ScoreBar } from '@/components/ui/ScoreBar';
import { useScoringStore } from '@/stores/scoring-store';

interface Props { market: Market }

const RETAIL_DIMS = [
  { l: 'Demographic Fit', k: 'demo' as const, w: '12%' },
  { l: 'Income Alignment', k: 'income' as const, w: '12%' },
  { l: 'Outdoor Lifestyle', k: 'lifestyle' as const, w: '10%' },
  { l: 'Digital Demand Gap', k: 'ddg' as const, w: '10%' },
  { l: 'Competitive Position', k: 'comp' as const, w: '6%' },
  { l: 'Foot Traffic', k: 'traffic' as const, w: '5%' },
];

const SC_DIMS = [
  { l: 'TCTS Reduction', k: 'tcts' as const, w: '10%' },
  { l: 'Fulfillment Speed', k: 'speed' as const, w: '6%' },
  { l: 'Returns Network', k: 'returns' as const, w: '5%' },
  { l: 'DC Proximity', k: 'dcProx' as const, w: '5%' },
  { l: 'Inventory Velocity', k: 'invVel' as const, w: '4%' },
];

const STRAT_DIMS = [
  { l: 'RE Feasibility', k: 're' as const, w: '5%' },
  { l: 'Climate Fit', k: 'climate' as const, w: '4%' },
  { l: 'Tourism/University', k: 'tourism' as const, w: '3%' },
  { l: 'Competitive Preempt', k: 'preempt' as const, w: '3%' },
];

function ScoreSection({ title, color, dims, scores }: {
  title: string; color: string;
  dims: { l: string; k: string; w: string }[];
  scores: Record<string, number>;
}) {
  return (
    <div className="px-4 py-3 border-b border-border-default">
      <div className="text-[9px] uppercase tracking-wider font-bold mb-2.5" style={{ color }}>{title}</div>
      {dims.map(d => {
        const val = scores[d.k] ?? 0;
        const barColor = val >= 90 ? '#22C55E' : val >= 80 ? '#FF6F00' : '#EAB308';
        return (
          <div key={d.k} className="mb-2">
            <div className="flex justify-between mb-0.5">
              <span className="text-[10px] text-text-muted">{d.l}</span>
              <span className="text-[10px] text-text-primary font-semibold">
                {val} <span className="text-text-dim">({d.w})</span>
              </span>
            </div>
            <ScoreBar value={val} color={barColor} height={3} />
          </div>
        );
      })}
    </div>
  );
}

export function OverviewTab({ market }: Props) {
  const { weights } = useScoringStore();

  const quickStats = [
    { l: 'Population', v: market.pop },
    { l: 'Med. HHI', v: market.hhi },
    { l: 'Pop Growth', v: market.growth },
    { l: 'OAI', v: String(market.oai) },
    { l: 'Properties', v: String(market.properties) },
    { l: 'Avg Rent', v: market.rent },
  ];

  return (
    <>
      <ScoreSection title={`Retail Opportunity (${weights.retail}%)`} color="#3B82F6" dims={RETAIL_DIMS} scores={market.retail as unknown as Record<string, number>} />
      <ScoreSection title={`Supply Chain Value (${weights.supplyChain}%)`} color="#10B981" dims={SC_DIMS} scores={market.sc as unknown as Record<string, number>} />
      <ScoreSection title={`Strategic Fit (${weights.strategic}%)`} color="#A855F7" dims={STRAT_DIMS} scores={market.strat as unknown as Record<string, number>} />

      <div className="px-4 py-3">
        <div className="grid grid-cols-2 gap-1.5">
          {quickStats.map(s => (
            <div key={s.l} className="bg-white/[0.02] rounded-[5px] px-2 py-1.5">
              <div className="text-[8px] text-text-dim uppercase tracking-wider">{s.l}</div>
              <div className="text-[13px] font-bold mt-0.5">{s.v}</div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
