import type { Market } from '@/types';
import { PROPERTIES } from '@/data/properties';
import { useAppStore } from '@/stores/app-store';

interface Props { market: Market }

export function PropertiesTab({ market }: Props) {
  const { setProFormaOpen } = useAppStore();
  const mktProps = PROPERTIES.filter(p => p.market === market.name);
  const displayProps = mktProps.length > 0 ? mktProps : PROPERTIES.slice(0, 2);

  return (
    <div className="px-4 py-3.5">
      <div className="text-[9px] text-text-muted uppercase tracking-wider font-bold mb-2.5">
        Recommended Sites — {market.name}
      </div>
      {displayProps.map(p => (
        <div key={p.id} className="bg-white/[0.02] rounded-lg p-3 mb-2 border border-border-default">
          <div className="flex justify-between items-start mb-1.5">
            <div className="text-xs font-semibold">{p.name}</div>
            <span
              className="text-[11px] font-bold px-2 py-0.5 rounded"
              style={{
                color: p.siteScore >= 90 ? '#22C55E' : '#FFA040',
                background: p.siteScore >= 90 ? 'rgba(34,197,94,0.12)' : 'rgba(255,111,0,0.12)',
              }}
            >
              {p.siteScore}
            </span>
          </div>
          <div className="text-[10px] text-text-muted mb-1.5">{p.address}</div>
          <div className="grid grid-cols-3 gap-1 mb-1.5">
            <div>
              <div className="text-[8px] text-text-dim">SQ FT</div>
              <div className="text-[11px] font-semibold">{p.sqft.toLocaleString()}</div>
            </div>
            <div>
              <div className="text-[8px] text-text-dim">RENT/SF</div>
              <div className="text-[11px] font-semibold">${p.rent}</div>
            </div>
            <div>
              <div className="text-[8px] text-text-dim">AVAIL</div>
              <div className="text-[11px] font-semibold text-green-500">{p.available}</div>
            </div>
          </div>
          <div className="text-[9px] text-text-dim">Co-tenancy: {p.coTenancy}</div>
          <div className="mt-1.5 text-[10px] font-semibold" style={{ color: '#10B981' }}>SC Benefit: {p.tctsBenefit}</div>
          <button
            onClick={() => setProFormaOpen(p.id)}
            className="mt-2 w-full text-[10px] py-1.5 rounded border border-brand-orange/30 bg-brand-orange/10 text-brand-orange-light font-semibold cursor-pointer hover:bg-brand-orange/20 transition-colors"
          >
            View Pro Forma
          </button>
        </div>
      ))}
      <button className="w-full py-2.5 rounded-md border-0 bg-gradient-to-r from-brand-orange to-brand-orange-light text-white font-bold cursor-pointer text-[11px] mt-2 hover:opacity-90 transition-opacity">
        Generate Market Brief
      </button>
    </div>
  );
}
