import { PROPERTIES } from '@/data/properties';
import { useAppStore } from '@/stores/app-store';

export function PropertiesTable() {
  const { setProFormaOpen } = useAppStore();

  return (
    <table className="w-full border-collapse text-[11px]">
      <thead>
        <tr className="bg-white/[0.02]">
          {['Property', 'Market', 'Address', 'Sq Ft', 'Rent/SF', 'Site Score', 'Co-Tenancy', 'TCTS Benefit', 'Available', ''].map(h => (
            <th key={h} className="px-2.5 py-1.5 text-left text-text-dim font-semibold text-[9px] uppercase tracking-wider border-b border-border-default">
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {PROPERTIES.map(p => (
          <tr key={p.id} className="border-b border-border-default hover:bg-white/[0.02]">
            <td className="px-2.5 py-2 font-semibold">{p.name}</td>
            <td className="px-2.5 py-2 text-text-muted">{p.market}</td>
            <td className="px-2.5 py-2 text-text-muted text-[10px] max-w-[160px] truncate">{p.address}</td>
            <td className="px-2.5 py-2 text-text-muted">{p.sqft.toLocaleString()}</td>
            <td className="px-2.5 py-2 text-text-muted">${p.rent}</td>
            <td className="px-2.5 py-2">
              <span
                className="font-bold px-2 py-0.5 rounded text-[10px]"
                style={{
                  color: p.siteScore >= 90 ? '#22C55E' : '#FFA040',
                  background: p.siteScore >= 90 ? 'rgba(34,197,94,0.12)' : 'rgba(255,111,0,0.12)',
                }}
              >
                {p.siteScore}
              </span>
            </td>
            <td className="px-2.5 py-2 text-text-muted text-[10px] max-w-[160px] truncate">{p.coTenancy}</td>
            <td className="px-2.5 py-2 font-semibold" style={{ color: '#10B981' }}>{p.tctsBenefit}</td>
            <td className="px-2.5 py-2 text-green-500">{p.available}</td>
            <td className="px-2.5 py-2">
              <button
                onClick={() => setProFormaOpen(p.id)}
                className="text-[9px] px-2 py-0.5 rounded bg-brand-orange/10 text-brand-orange-light border border-brand-orange/20 cursor-pointer hover:bg-brand-orange/20 transition-colors font-semibold"
              >
                Pro Forma
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
