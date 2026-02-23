import { X } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useAppStore } from '@/stores/app-store';
import { PROPERTIES } from '@/data/properties';

export function ProFormaModal() {
  const { proFormaOpen, setProFormaOpen } = useAppStore();
  if (!proFormaOpen) return null;

  const property = PROPERTIES.find(p => p.id === proFormaOpen);
  if (!property) return null;

  const pf = property.proForma;
  const revenueData = pf.revenueProjection.map((rev, i) => ({
    year: `Y${i + 1}`,
    revenue: rev / 1e6,
    withSC: (rev + pf.supplyChainSavings.total) / 1e6,
  }));

  const totalOccupancy = pf.annualRent + pf.annualCAM;
  const totalOpex = totalOccupancy + pf.annualLaborCost + pf.annualOtherOpex;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setProFormaOpen(null)}>
      <div className="bg-surface-card border border-border-light rounded-xl w-[720px] max-h-[85vh] overflow-y-auto shadow-2xl" onClick={e => e.stopPropagation()}>
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border-default">
          <div>
            <div className="text-lg font-bold">{property.name}</div>
            <div className="text-xs text-text-muted">{property.address} &bull; {property.sqft.toLocaleString()} SF &bull; ${property.rent}/SF</div>
          </div>
          <button onClick={() => setProFormaOpen(null)} className="text-text-muted hover:text-text-primary cursor-pointer bg-transparent border-0">
            <X size={18} />
          </button>
        </div>

        <div className="px-6 py-4">
          {/* Key Metrics */}
          <div className="grid grid-cols-4 gap-3 mb-5">
            {[
              { l: '4-Wall Contribution', v: `${pf.fourWallContribution}%`, sub: `${pf.fourWallWithSC}% with SC` },
              { l: 'Payback Period', v: `${pf.paybackPeriod} yrs`, sub: `${pf.paybackWithSC} yrs with SC` },
              { l: '5-Year NPV', v: `$${(pf.fiveYearNPV / 1e6).toFixed(1)}M` },
              { l: '5-Year IRR', v: `${pf.fiveYearIRR}%` },
            ].map((m, i) => (
              <div key={i} className="bg-white/[0.03] rounded-lg p-3 border border-border-default">
                <div className="text-[9px] text-text-dim uppercase tracking-wider font-bold">{m.l}</div>
                <div className="text-xl font-extrabold text-brand-orange-light mt-1">{m.v}</div>
                {m.sub && <div className="text-[10px] text-green-500 mt-0.5">{m.sub}</div>}
              </div>
            ))}
          </div>

          {/* Revenue Chart */}
          <div className="mb-5">
            <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">5-Year Revenue Projection</div>
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={revenueData} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                <XAxis dataKey="year" tick={{ fill: '#7B8FA6', fontSize: 10 }} axisLine={false} />
                <YAxis tick={{ fill: '#7B8FA6', fontSize: 10 }} axisLine={false} tickFormatter={v => `$${v}M`} />
                <Tooltip
                  contentStyle={{ background: '#111E2E', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 6, fontSize: 11 }}
                  formatter={(v: number | undefined) => [`$${(v ?? 0).toFixed(2)}M`, '']}
                />
                <Bar dataKey="revenue" fill="#3B82F6" radius={[3, 3, 0, 0]} name="Store Revenue" />
                <Bar dataKey="withSC" fill="#10B981" radius={[3, 3, 0, 0]} name="Revenue + SC Savings" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Cost Breakdown */}
          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">Investment & Costs</div>
              <div className="space-y-1.5">
                {[
                  { l: 'Buildout', v: `$${(pf.totalBuildout / 1000).toFixed(0)}K`, d: `$${pf.buildoutCostPerSF}/SF` },
                  { l: 'Annual Rent', v: `$${(pf.annualRent / 1000).toFixed(0)}K` },
                  { l: 'Annual CAM', v: `$${(pf.annualCAM / 1000).toFixed(0)}K` },
                  { l: `Labor (${pf.fteCount} FTE)`, v: `$${(pf.annualLaborCost / 1000).toFixed(0)}K` },
                  { l: 'Other OpEx', v: `$${(pf.annualOtherOpex / 1000).toFixed(0)}K` },
                  { l: 'Total Annual OpEx', v: `$${(totalOpex / 1000).toFixed(0)}K`, bold: true },
                ].map((r, i) => (
                  <div key={i} className={`flex justify-between text-[11px] ${r.bold ? 'font-bold text-text-primary border-t border-border-default pt-1.5' : 'text-text-muted'}`}>
                    <span>{r.l}</span>
                    <span className={r.bold ? 'text-text-primary' : ''}>{r.v}{r.d ? ` (${r.d})` : ''}</span>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider font-bold mb-2" style={{ color: '#10B981' }}>Supply Chain Savings</div>
              <div className="space-y-1.5">
                {[
                  { l: 'Ship-from-Store', v: `$${(pf.supplyChainSavings.shipFromStore / 1000).toFixed(0)}K` },
                  { l: 'BOPIS', v: `$${(pf.supplyChainSavings.bopis / 1000).toFixed(0)}K` },
                  { l: 'Returns Processing', v: `$${(pf.supplyChainSavings.returnsProcessing / 1000).toFixed(0)}K` },
                  { l: 'Total SC Savings', v: `$${(pf.supplyChainSavings.total / 1000).toFixed(0)}K`, bold: true },
                ].map((r, i) => (
                  <div key={i} className={`flex justify-between text-[11px] ${r.bold ? 'font-bold border-t border-border-default pt-1.5' : 'text-text-muted'}`}>
                    <span>{r.l}</span>
                    <span style={{ color: '#10B981' }}>{r.v}</span>
                  </div>
                ))}
              </div>
              <div className="mt-3 rounded-md p-2.5 border text-center" style={{ background: 'rgba(16,185,129,0.08)', borderColor: 'rgba(16,185,129,0.15)' }}>
                <div className="text-[8px] uppercase tracking-wider" style={{ color: '#10B981' }}>SC savings as % of rent</div>
                <div className="text-xl font-extrabold" style={{ color: '#6EE7B7' }}>
                  {((pf.supplyChainSavings.total / pf.annualRent) * 100).toFixed(0)}%
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
