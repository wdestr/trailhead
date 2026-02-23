import { DISTRIBUTION_CENTERS } from '@/data/distribution-centers';
import { ScoreBar } from '@/components/ui/ScoreBar';

export function DCNetworkPanel() {
  return (
    <div className="p-3.5 grid grid-cols-3 gap-3">
      {DISTRIBUTION_CENTERS.map(dc => (
        <div
          key={dc.id}
          className="rounded-lg p-4 border"
          style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.15)' }}
        >
          <div className="text-sm font-bold" style={{ color: '#6EE7B7' }}>{dc.name}</div>
          <div className="text-xs text-text-muted mb-2">{dc.city}, {dc.state}</div>

          <div className="grid grid-cols-2 gap-2 mb-3">
            <div>
              <div className="text-[8px] text-text-dim uppercase tracking-wider">Sq Ft</div>
              <div className="text-xs font-semibold text-text-primary">{(dc.capacity.totalSqft / 1000).toFixed(0)}K</div>
            </div>
            <div>
              <div className="text-[8px] text-text-dim uppercase tracking-wider">Daily Cap</div>
              <div className="text-xs font-semibold text-text-primary">{dc.capacity.dailyOrderCapacity.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[8px] text-text-dim uppercase tracking-wider">Outbound $/Order</div>
              <div className="text-xs font-semibold text-text-primary">${dc.costs.avgOutboundCostPerOrder.toFixed(2)}</div>
            </div>
            <div>
              <div className="text-[8px] text-text-dim uppercase tracking-wider">Peak Cap</div>
              <div className="text-xs font-semibold text-text-primary">{dc.capacity.peakCapacity.toLocaleString()}</div>
            </div>
          </div>

          <div className="text-[10px] text-text-muted mb-1">Utilization</div>
          <div className="flex items-center gap-2">
            <ScoreBar
              value={dc.capacity.utilizationPct}
              color={dc.capacity.utilizationPct > 85 ? '#EAB308' : '#10B981'}
              height={6}
            />
            <span
              className="text-xs font-bold"
              style={{ color: dc.capacity.utilizationPct > 85 ? '#EAB308' : '#10B981' }}
            >
              {dc.capacity.utilizationPct}%
            </span>
          </div>
          <div className="text-[10px] text-text-dim mt-2">{dc.coverage}</div>
        </div>
      ))}
    </div>
  );
}
