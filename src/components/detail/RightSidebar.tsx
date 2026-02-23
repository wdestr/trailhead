import { useMemo } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useScoringStore } from '@/stores/scoring-store';
import { MARKETS } from '@/data/markets';
import { calculateTrailheadScore } from '@/lib/scoring';
import { ScoreRing } from '@/components/ui/ScoreRing';
import { OverviewTab } from './OverviewTab';
import { SupplyChainTab } from './SupplyChainTab';
import { PropertiesTab } from './PropertiesTab';

export function RightSidebar() {
  const { selectedMarket, rightTab, setRightTab } = useAppStore();
  const { weights } = useScoringStore();

  const market = MARKETS.find(m => m.name === selectedMarket) || MARKETS[0];
  const score = useMemo(() => calculateTrailheadScore(market, weights), [market, weights]);

  const tabs = [
    { key: 'overview' as const, label: 'Overview' },
    { key: 'supply' as const, label: 'Supply Chain' },
    { key: 'properties' as const, label: 'Sites' },
  ];

  return (
    <div className="w-[290px] shrink-0 bg-surface-card border-l border-border-default overflow-y-auto">
      {/* Market Header */}
      <div className="px-4 pt-4 pb-3 text-center border-b border-border-default">
        <div className="text-[9px] text-text-dim uppercase tracking-wider">Selected Market</div>
        <div className="text-[15px] font-bold mt-0.5">{market.name}, {market.state}</div>
        <div className="text-[11px] text-text-muted mb-3">Rank #{market.rank}</div>
        <div className="flex justify-center">
          <ScoreRing score={score} />
        </div>
      </div>

      {/* Tab Switcher */}
      <div className="flex border-b border-border-default">
        {tabs.map(t => (
          <button
            key={t.key}
            onClick={() => setRightTab(t.key)}
            className={`flex-1 py-2 text-[10px] font-semibold cursor-pointer transition-all bg-transparent border-0 ${
              rightTab === t.key
                ? 'text-brand-orange-light border-b-2 border-b-brand-orange'
                : 'text-text-muted border-b-2 border-b-transparent hover:text-text-primary'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {rightTab === 'overview' && <OverviewTab market={market} />}
      {rightTab === 'supply' && <SupplyChainTab market={market} />}
      {rightTab === 'properties' && <PropertiesTab market={market} />}
    </div>
  );
}
