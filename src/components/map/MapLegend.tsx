import { useMapStore } from '@/stores/map-store';

export function MapLegend() {
  const { activeLayers } = useMapStore();

  const items: { color: string; label: string; shape: 'circle' | 'diamond' }[] = [
    { color: '#3B82F6', label: 'Columbia', shape: 'circle' },
    { color: '#EC4899', label: 'SOREL', shape: 'circle' },
    { color: '#F59E0B', label: 'Mtn Hardwear', shape: 'circle' },
    { color: '#8B5CF6', label: 'prAna', shape: 'circle' },
    { color: '#FF6F00', label: 'Expansion Markets', shape: 'circle' },
    ...(activeLayers.supply ? [{ color: '#10B981', label: 'Distribution Centers', shape: 'diamond' as const }] : []),
    ...(activeLayers.retailers ? [{ color: '#2E7D32', label: 'Retail Partners', shape: 'circle' as const }] : []),
  ];

  return (
    <div className="absolute bottom-3 left-3 flex gap-3.5 bg-surface/90 px-3 py-1.5 rounded-md backdrop-blur-sm border border-border-default">
      {items.map((item) => (
        <div key={item.label} className="flex items-center gap-1.5">
          <div
            className={item.shape === 'diamond' ? 'rotate-45' : ''}
            style={{
              width: 7,
              height: 7,
              borderRadius: item.shape === 'diamond' ? 1 : '50%',
              background: item.color,
              border: `1px solid ${item.color}`,
            }}
          />
          <span className="text-[9px] text-text-muted">{item.label}</span>
        </div>
      ))}
    </div>
  );
}
