import { COMPETITORS } from '@/data/competitors';
import { useMapStore } from '@/stores/map-store';

export function CompetitorList() {
  const { activeLayers, toggleLayer, selectedCompetitors, toggleCompetitor } = useMapStore();
  const totalStores = COMPETITORS.reduce((a, c) => a + c.stores, 0);
  const isCompLayerOn = activeLayers.competitors;

  return (
    <div className="px-3.5 py-2.5 border-t border-border-default">
      <div
        className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2 flex items-center justify-between cursor-pointer"
        onClick={() => toggleLayer('competitors')}
      >
        <span>Competitors ({totalStores.toLocaleString()})</span>
        <span className={`text-[8px] px-1.5 py-0.5 rounded ${isCompLayerOn ? 'bg-red-500/20 text-red-400' : 'bg-white/5 text-text-dim'}`}>
          {isCompLayerOn ? 'ON' : 'OFF'}
        </span>
      </div>
      {COMPETITORS.map((c) => {
        const selected = selectedCompetitors[c.name] !== false; // default true
        return (
          <div
            key={c.name}
            className={`flex items-center gap-1.5 py-1 px-1.5 rounded cursor-pointer transition-all ${
              isCompLayerOn && selected ? 'bg-white/[0.03]' : ''
            }`}
            onClick={() => toggleCompetitor(c.name)}
          >
            <div
              className="w-2 h-2 rounded-full shrink-0 transition-opacity"
              style={{
                background: c.color,
                opacity: isCompLayerOn && selected ? 1 : 0.3,
              }}
            />
            <span className={`text-[11px] flex-1 truncate ${isCompLayerOn && selected ? 'text-text-primary' : 'text-text-dim'}`}>
              {c.name}
            </span>
            <span className="text-[10px] text-text-dim font-semibold">{c.stores}</span>
          </div>
        );
      })}
    </div>
  );
}
