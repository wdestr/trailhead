import { DISTRIBUTION_CENTERS } from '@/data/distribution-centers';
import { ScoreBar } from '@/components/ui/ScoreBar';

export function DCNetwork() {
  return (
    <div className="px-3.5 py-2.5 border-t border-border-default">
      <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2">DC Network</div>
      {DISTRIBUTION_CENTERS.map((dc) => (
        <div
          key={dc.id}
          className="rounded-md p-2.5 mb-1.5 border"
          style={{ background: 'rgba(16,185,129,0.06)', borderColor: 'rgba(16,185,129,0.15)' }}
        >
          <div className="text-[11px] font-semibold" style={{ color: '#6EE7B7' }}>{dc.name}</div>
          <div className="text-[10px] text-text-muted">{dc.city}, {dc.state}</div>
          <div className="flex items-center gap-1.5 mt-1">
            <ScoreBar
              value={dc.capacity.utilizationPct}
              color={dc.capacity.utilizationPct > 85 ? '#EAB308' : '#10B981'}
              height={3}
            />
            <span className="text-[9px] text-text-muted">{dc.capacity.utilizationPct}%</span>
          </div>
          <div className="text-[9px] text-text-dim mt-1">{dc.coverage}</div>
        </div>
      ))}
    </div>
  );
}
