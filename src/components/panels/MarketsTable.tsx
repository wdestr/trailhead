import { useMemo } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useScoringStore } from '@/stores/scoring-store';
import { MARKETS } from '@/data/markets';
import { rankMarkets } from '@/lib/scoring';
import { ScoreBar } from '@/components/ui/ScoreBar';

export function MarketsTable() {
  const { selectedMarket, setSelectedMarket } = useAppStore();
  const { weights } = useScoringStore();

  const ranked = useMemo(() => rankMarkets(MARKETS, weights), [weights]);

  return (
    <table className="w-full border-collapse text-[11px]">
      <thead>
        <tr className="bg-white/[0.02]">
          {['#', 'Market', 'Trailhead', 'Pop', 'HHI', 'Growth', 'OAI', 'DDG', 'TCTS Δ', 'SC Savings', 'CO₂', 'Properties'].map(h => (
            <th key={h} className="px-2.5 py-1.5 text-left text-text-dim font-semibold text-[9px] uppercase tracking-wider border-b border-border-default">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {ranked.map(m => {
          const isSelected = selectedMarket === m.name;
          const score = m.calculatedScore;
          const scoreColor = score >= 90 ? '#22C55E' : score >= 85 ? '#FFA040' : '#EAB308';
          return (
            <tr
              key={m.rank}
              onClick={() => setSelectedMarket(m.name)}
              className={`cursor-pointer transition-colors ${isSelected ? 'bg-brand-orange/[0.06]' : 'hover:bg-white/[0.02]'}`}
              style={{ borderLeft: isSelected ? '3px solid #FF6F00' : '3px solid transparent' }}
            >
              <td className="px-2.5 py-1.5 font-bold text-text-dim">#{m.rank}</td>
              <td className="px-2.5 py-1.5 font-semibold">{m.name}, {m.state}</td>
              <td className="px-2.5 py-1.5">
                <div className="flex items-center gap-1.5">
                  <span className="font-bold min-w-5" style={{ color: scoreColor }}>{score}</span>
                  <ScoreBar value={score} color={scoreColor} height={4} />
                </div>
              </td>
              <td className="px-2.5 py-1.5 text-text-muted">{m.pop}</td>
              <td className="px-2.5 py-1.5 text-text-muted">{m.hhi}</td>
              <td className="px-2.5 py-1.5 text-green-500 font-semibold">{m.growth}</td>
              <td className={`px-2.5 py-1.5 font-semibold ${m.oai >= 90 ? 'text-green-500' : 'text-text-muted'}`}>{m.oai}</td>
              <td className="px-2.5 py-1.5">
                <span className="bg-cyan-500/20 text-cyan-400 px-1.5 py-0.5 rounded text-[10px] font-semibold">
                  {m.retail.ddg}
                </span>
              </td>
              <td className="px-2.5 py-1.5 text-green-500 font-semibold">{m.tctsDelta}</td>
              <td className="px-2.5 py-1.5 font-semibold" style={{ color: '#10B981' }}>{m.scSavings}</td>
              <td className="px-2.5 py-1.5 text-[10px]" style={{ color: '#6EE7B7' }}>{m.carbonImpact}</td>
              <td className="px-2.5 py-1.5 text-text-muted">{m.properties}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}
