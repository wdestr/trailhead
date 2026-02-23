import { useMemo } from 'react';
import { StatCard } from '@/components/ui/StatCard';
import { COLUMBIA_STORES } from '@/data/columbia-stores';
import { MARKETS } from '@/data/markets';
import { PIPELINE_ITEMS } from '@/data/pipeline';

export function StatBar() {
  const stats = useMemo(() => {
    const pipelineCount = PIPELINE_ITEMS.length;
    const loiCount = PIPELINE_ITEMS.filter(p => p.stage === 'loi' || p.stage === 'negotiation').length;

    // Average Trailhead score of top 8 markets
    const top8 = MARKETS.slice(0, 8);
    const avgScore = Math.round(top8.reduce((a, m) => a + m.trailheadScore, 0) / top8.length);

    // Sum SC savings for top 8
    const totalSCSavings = top8.reduce((a, m) => {
      const num = Number(m.scSavings.replace(/[^0-9.]/g, ''));
      return a + num;
    }, 0);
    const savingsStr = totalSCSavings >= 1000
      ? `$${(totalSCSavings / 1000).toFixed(1)}M`
      : `$${totalSCSavings.toFixed(0)}K`;

    // Sum carbon impact for top 8
    const totalCarbon = top8.reduce((a, m) => {
      const num = Number(m.carbonImpact.replace(/[^0-9]/g, ''));
      return a + num;
    }, 0);

    return { pipelineCount, loiCount, avgScore, savingsStr, totalCarbon };
  }, []);

  return (
    <div className="px-5 py-2.5 flex gap-2.5 bg-surface-card/50 border-b border-border-default shrink-0">
      <StatCard label="Columbia Stores" value={String(COLUMBIA_STORES.length)} sub="+4 YoY" />
      <StatCard label="Pipeline" value={String(stats.pipelineCount)} sub={`${stats.loiCount} in LOI`} accent />
      <StatCard label="Pipeline Rev" value="$34M" sub="Est. Year 1" />
      <StatCard label="Avg Trailhead" value={String(stats.avgScore)} sub="Top 8 Mkts" />
      <StatCard label="TCTS Savings" value={stats.savingsStr} sub="If top 8 open" />
      <StatCard label="CO₂ Reduction" value={`-${stats.totalCarbon}t`} sub="Annual est." />
    </div>
  );
}
