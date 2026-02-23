import { Users, DollarSign, Mountain, Package, Swords, Footprints, Building2, Truck, CircleDollarSign, CloudSun, ShoppingBag } from 'lucide-react';
import { Toggle } from '@/components/ui/Toggle';
import { useMapStore } from '@/stores/map-store';
import { DATA_LAYERS } from '@/data/layers';
import type { LucideIcon } from 'lucide-react';

const ICON_MAP: Record<string, LucideIcon> = {
  Users, DollarSign, Mountain, Package, Swords, Footprints, Building2, Truck, CircleDollarSign, CloudSun, ShoppingBag,
};

export function DataOverlays() {
  const { activeLayers, toggleLayer } = useMapStore();

  return (
    <div className="p-3.5 pb-2.5">
      <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-2.5">Data Overlays</div>
      {DATA_LAYERS.map((layer) => {
        const Icon = ICON_MAP[layer.icon];
        const active = activeLayers[layer.id];
        return (
          <div
            key={layer.id}
            onClick={() => toggleLayer(layer.id)}
            className="flex items-center gap-2 px-2.5 py-1.5 rounded-md mb-1 cursor-pointer transition-all border"
            style={{
              background: active ? `${layer.color}12` : 'transparent',
              borderColor: active ? `${layer.color}30` : 'rgba(255,255,255,0.06)',
            }}
          >
            <Toggle on={active} color={layer.color} onToggle={() => toggleLayer(layer.id)} />
            {Icon && <Icon size={12} style={{ color: active ? layer.color : undefined }} className={active ? '' : 'text-text-dim'} />}
            <span className={`text-xs font-medium ${active ? 'text-text-primary' : 'text-text-muted'}`}>
              {layer.label}
            </span>
          </div>
        );
      })}
    </div>
  );
}
