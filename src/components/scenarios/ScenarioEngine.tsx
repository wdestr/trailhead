import { useState, useMemo } from 'react';
import { Swords, TrendingDown, Warehouse, ArrowLeftRight, Settings2, ArrowRight } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from 'recharts';
import { SCENARIOS } from '@/data/pipeline';
import { MARKETS } from '@/data/markets';
import { useScoringStore } from '@/stores/scoring-store';
import { rankMarkets } from '@/lib/scoring';
import type { Scenario } from '@/types';

const ICON_MAP: Record<string, typeof Swords> = { Swords, TrendingDown, Warehouse, ArrowLeftRight, Settings2 };

export function ScenarioEngine() {
  const [activeScenario, setActiveScenario] = useState<Scenario>(SCENARIOS[0]);
  const [params, setParams] = useState<Record<string, number>>(() =>
    Object.fromEntries(activeScenario.params.map(p => [p.id, p.value]))
  );
  const { weights } = useScoringStore();

  const baseRanked = useMemo(() => rankMarkets(MARKETS, weights), [weights]);

  // Simple scenario simulation: adjust scores based on params
  const scenarioRanked = useMemo(() => {
    const modified = MARKETS.map(m => {
      const adjusted = { ...m, retail: { ...m.retail }, sc: { ...m.sc }, strat: { ...m.strat } };
      if (activeScenario.id === 'economic-downturn') {
        const decline = (params.incomeDecline ?? 15) / 100;
        adjusted.retail.income = Math.max(0, Math.round(m.retail.income * (1 - decline)));
        adjusted.retail.traffic = Math.max(0, Math.round(m.retail.traffic * (1 - (params.trafficDecline ?? 10) / 100)));
      } else if (activeScenario.id === 'competitor-entry') {
        adjusted.strat.preempt = Math.min(100, m.strat.preempt + 15);
        adjusted.retail.comp = Math.max(0, m.retail.comp - (params.storeCount ?? 10));
      } else if (activeScenario.id === 'dc-expansion') {
        adjusted.sc.dcProx = Math.min(100, m.sc.dcProx + 12);
        adjusted.sc.tcts = Math.min(100, m.sc.tcts + 8);
        adjusted.sc.speed = Math.min(100, m.sc.speed + 10);
      } else if (activeScenario.id === 'channel-shift') {
        const ecomBoost = (params.ecomGrowth ?? 20) / 100;
        adjusted.retail.ddg = Math.min(100, Math.round(m.retail.ddg * (1 + ecomBoost * 0.3)));
        adjusted.sc.tcts = Math.min(100, Math.round(m.sc.tcts * (1 + ecomBoost * 0.2)));
      }
      return adjusted;
    });
    return rankMarkets(modified, weights);
  }, [activeScenario, params, weights]);

  const comparisonData = baseRanked.slice(0, 8).map(base => {
    const scenario = scenarioRanked.find(s => s.name === base.name);
    return {
      name: base.name.length > 12 ? base.name.slice(0, 12) + '..' : base.name,
      baseline: base.calculatedScore,
      scenario: scenario?.calculatedScore ?? base.calculatedScore,
      delta: (scenario?.calculatedScore ?? base.calculatedScore) - base.calculatedScore,
    };
  });

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="text-lg font-bold mb-1">Scenario Planning</div>
      <div className="text-xs text-text-muted mb-4">Model how market rankings shift under different conditions</div>

      {/* Scenario Cards */}
      <div className="grid grid-cols-5 gap-2.5 mb-5">
        {SCENARIOS.map(s => {
          const Icon = ICON_MAP[s.icon] ?? Settings2;
          const isActive = activeScenario.id === s.id;
          return (
            <button
              key={s.id}
              onClick={() => { setActiveScenario(s); setParams(Object.fromEntries(s.params.map(p => [p.id, p.value]))); }}
              className={`p-3 rounded-lg border cursor-pointer transition-all text-left ${
                isActive
                  ? 'bg-brand-orange/10 border-brand-orange/30'
                  : 'bg-surface-card border-border-default hover:border-border-light'
              }`}
            >
              <Icon size={16} className={isActive ? 'text-brand-orange-light' : 'text-text-dim'} />
              <div className={`text-xs font-semibold mt-1.5 ${isActive ? 'text-brand-orange-light' : 'text-text-primary'}`}>{s.name}</div>
              <div className="text-[9px] text-text-dim mt-0.5 line-clamp-2">{s.description}</div>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-3 gap-4">
        {/* Parameters */}
        <div className="bg-surface-card rounded-lg p-4 border border-border-default">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Parameters</div>
          {activeScenario.params.map(p => (
            <div key={p.id} className="mb-4">
              <div className="flex justify-between mb-1">
                <span className="text-[10px] text-text-muted font-semibold">{p.label}</span>
                <span className="text-[10px] font-bold text-brand-orange-light">
                  {p.options ? p.options.find(o => o.value === params[p.id])?.label : params[p.id]}{p.unit ?? ''}
                </span>
              </div>
              {p.type === 'slider' ? (
                <input
                  type="range" min={p.min} max={p.max} step={p.step}
                  value={params[p.id] ?? p.value}
                  onChange={e => setParams(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                  className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #FF6F00 ${((params[p.id]! - p.min!) / (p.max! - p.min!)) * 100}%, rgba(255,255,255,0.1) 0%)`, accentColor: '#FF6F00' }}
                />
              ) : (
                <select
                  value={params[p.id]}
                  onChange={e => setParams(prev => ({ ...prev, [p.id]: Number(e.target.value) }))}
                  className="w-full bg-surface text-text-primary border border-border-default rounded px-2 py-1 text-[11px]"
                >
                  {p.options?.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              )}
            </div>
          ))}
        </div>

        {/* Comparison Chart */}
        <div className="col-span-2 bg-surface-card rounded-lg p-4 border border-border-default">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">
            Baseline vs. Scenario — Top 8 Markets
          </div>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={comparisonData} barGap={2}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#7B8FA6', fontSize: 9 }} axisLine={false} />
              <YAxis domain={[60, 100]} tick={{ fill: '#7B8FA6', fontSize: 9 }} axisLine={false} />
              <Tooltip contentStyle={{ background: '#111E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="baseline" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Baseline" />
              <Bar dataKey="scenario" radius={[3, 3, 0, 0]} name="Scenario">
                {comparisonData.map((entry, i) => (
                  <Cell key={i} fill={entry.delta >= 0 ? '#22C55E' : '#EF4444'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>

          {/* Rank Changes */}
          <div className="mt-3 grid grid-cols-4 gap-2">
            {comparisonData.slice(0, 4).map(d => (
              <div key={d.name} className="bg-white/[0.03] rounded-md p-2 text-center">
                <div className="text-[10px] text-text-muted truncate">{d.name}</div>
                <div className="flex items-center justify-center gap-1.5 mt-1">
                  <span className="text-xs font-semibold text-text-dim">{d.baseline}</span>
                  <ArrowRight size={10} className="text-text-dim" />
                  <span className={`text-xs font-bold ${d.delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>{d.scenario}</span>
                </div>
                <div className={`text-[9px] font-semibold ${d.delta >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {d.delta >= 0 ? '+' : ''}{d.delta}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
