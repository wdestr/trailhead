import { useMemo } from 'react';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';
import { MARKETS } from '@/data/markets';
import { COLUMBIA_STORES } from '@/data/columbia-stores';
import { PIPELINE_ITEMS, PIPELINE_STAGES } from '@/data/pipeline';
import { useScoringStore } from '@/stores/scoring-store';
import { rankMarkets } from '@/lib/scoring';
import { StatCard } from '@/components/ui/StatCard';

export function Dashboard() {
  const { weights } = useScoringStore();
  const ranked = useMemo(() => rankMarkets(MARKETS, weights), [weights]);

  const topMarketsData = ranked.slice(0, 10).map(m => ({
    name: m.name.length > 12 ? m.name.slice(0, 12) + '...' : m.name,
    score: m.calculatedScore,
  }));

  const pipelineByStage = PIPELINE_STAGES.map(stage => ({
    name: stage.label.length > 10 ? stage.label.slice(0, 10) + '..' : stage.label,
    count: PIPELINE_ITEMS.filter(p => p.stage === stage.id).length,
    color: stage.color,
  }));

  const revenueByFormat = useMemo(() => [
    { name: 'Flagship', value: COLUMBIA_STORES.filter(s => s.format === 'Flagship').reduce((a, s) => a + s.performance.annualRevenue, 0) / 1e6 },
    { name: 'Factory', value: COLUMBIA_STORES.filter(s => s.format === 'Factory/Outlet').reduce((a, s) => a + s.performance.annualRevenue, 0) / 1e6 },
    { name: 'Inline', value: COLUMBIA_STORES.filter(s => s.format === 'Inline').reduce((a, s) => a + s.performance.annualRevenue, 0) / 1e6 },
    { name: 'Street', value: COLUMBIA_STORES.filter(s => s.format === 'Street Retail').reduce((a, s) => a + s.performance.annualRevenue, 0) / 1e6 },
  ], []);
  const PIE_COLORS = ['#3B82F6', '#FF6F00', '#10B981', '#A855F7'];

  // Deterministic monthly trend data (no Math.random() — stable across renders)
  const monthlyTrend = useMemo(() => {
    const jitter = [0.21, 0.42, 0.13, 0.34, 0.07, 0.48, 0.29, 0.15, 0.38, 0.05, 0.31, 0.44];
    return Array.from({ length: 12 }, (_, i) => ({
      month: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][i],
      revenue: +(8 + Math.sin((i + 3) * 0.5) * 3 + jitter[i]).toFixed(1),
      traffic: +(420 + Math.sin((i + 2) * 0.6) * 80 + jitter[i] * 40).toFixed(0),
    }));
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-5">
      <div className="text-lg font-bold mb-1">Executive Dashboard</div>
      <div className="text-xs text-text-muted mb-4">Portfolio performance, pipeline status, and market intelligence overview</div>

      {/* Top Stats */}
      <div className="grid grid-cols-6 gap-2.5 mb-5">
        <StatCard label="Total Stores" value={String(COLUMBIA_STORES.length)} sub="+4 YoY" />
        <StatCard label="Total Revenue" value="$312M" sub="+6.8% YoY" />
        <StatCard label="Avg Rev/SF" value="$742" sub="+$28 YoY" />
        <StatCard label="Pipeline" value="12" sub="3 LOI" accent />
        <StatCard label="SC Savings Potential" value="$3.2M" sub="Top 8 markets" />
        <StatCard label="Network Coverage" value="78%" sub="2-day ground" />
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-2 gap-4 mb-4">
        {/* Top 10 Markets */}
        <div className="bg-surface-card rounded-lg p-4 border border-border-default">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Top 10 Expansion Markets</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={topMarketsData} layout="vertical" margin={{ left: 10 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" horizontal={false} />
              <XAxis type="number" domain={[70, 100]} tick={{ fill: '#7B8FA6', fontSize: 9 }} axisLine={false} />
              <YAxis type="category" dataKey="name" tick={{ fill: '#7B8FA6', fontSize: 9 }} axisLine={false} width={80} />
              <Tooltip contentStyle={{ background: '#111E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="score" fill="#FF6F00" radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue Trend */}
        <div className="bg-surface-card rounded-lg p-4 border border-border-default">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Monthly Revenue Trend ($M)</div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="month" tick={{ fill: '#7B8FA6', fontSize: 9 }} axisLine={false} />
              <YAxis tick={{ fill: '#7B8FA6', fontSize: 9 }} axisLine={false} domain={[4, 14]} />
              <Tooltip contentStyle={{ background: '#111E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }} />
              <Line type="monotone" dataKey="revenue" stroke="#3B82F6" strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pipeline Funnel */}
        <div className="bg-surface-card rounded-lg p-4 border border-border-default">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Pipeline by Stage</div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={pipelineByStage}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
              <XAxis dataKey="name" tick={{ fill: '#7B8FA6', fontSize: 8 }} axisLine={false} interval={0} angle={-20} />
              <YAxis tick={{ fill: '#7B8FA6', fontSize: 9 }} axisLine={false} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#111E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]}>
                {pipelineByStage.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Revenue by Format */}
        <div className="bg-surface-card rounded-lg p-4 border border-border-default">
          <div className="text-xs font-bold uppercase tracking-wider text-text-muted mb-3">Revenue by Store Format</div>
          <div className="flex items-center">
            <ResponsiveContainer width="50%" height={200}>
              <PieChart>
                <Pie data={revenueByFormat} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={3}>
                  {revenueByFormat.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: '#111E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }} formatter={(v: number | undefined) => [`$${(v ?? 0).toFixed(1)}M`, '']} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-2">
              {revenueByFormat.map((item, i) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-2.5 h-2.5 rounded-sm" style={{ background: PIE_COLORS[i] }} />
                  <span className="text-[11px] text-text-muted flex-1">{item.name}</span>
                  <span className="text-[11px] font-semibold">${item.value.toFixed(1)}M</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
