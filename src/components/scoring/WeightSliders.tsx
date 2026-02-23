import { X } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { useScoringStore } from '@/stores/scoring-store';
import { WEIGHT_PRESETS } from '@/lib/scoring';

export function WeightSliders() {
  const { showWeightSliders, setShowWeightSliders } = useAppStore();
  const { weights, setMainWeights, applyPreset, resetToDefault } = useScoringStore();

  if (!showWeightSliders) return null;

  const handleMainChange = (key: 'retail' | 'supplyChain' | 'strategic', value: number) => {
    const keys: ('retail' | 'supplyChain' | 'strategic')[] = ['retail', 'supplyChain', 'strategic'];
    const remaining = 100 - value;
    const others = keys.filter(k => k !== key);
    const currentOthersTotal = weights[others[0]] + weights[others[1]];
    const newWeights = { ...weights };
    newWeights[key] = value;
    if (currentOthersTotal === 0) {
      newWeights[others[0]] = Math.round(remaining / 2);
      newWeights[others[1]] = remaining - Math.round(remaining / 2);
    } else {
      newWeights[others[0]] = Math.round(remaining * (weights[others[0]] / currentOthersTotal));
      newWeights[others[1]] = remaining - newWeights[others[0]];
    }
    setMainWeights(newWeights.retail, newWeights.supplyChain, newWeights.strategic);
  };

  return (
    <div className="absolute top-12 left-60 z-50 w-80 bg-surface-card border border-border-light rounded-lg shadow-2xl overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2.5 border-b border-border-default bg-navy-dark/50">
        <div className="text-xs font-bold uppercase tracking-wider">Scoring Weights</div>
        <button onClick={() => setShowWeightSliders(false)} className="text-text-muted hover:text-text-primary cursor-pointer bg-transparent border-0">
          <X size={14} />
        </button>
      </div>

      {/* Presets */}
      <div className="px-4 py-2.5 border-b border-border-default">
        <div className="text-[9px] text-text-dim uppercase tracking-wider font-bold mb-2">Presets</div>
        <div className="flex gap-1.5 flex-wrap">
          {Object.entries(WEIGHT_PRESETS).map(([key, { label, weights: preset }]) => (
            <button
              key={key}
              onClick={() => applyPreset(preset)}
              className="text-[9px] px-2.5 py-1 rounded-full border border-border-default bg-white/[0.03] text-text-muted hover:bg-brand-orange/10 hover:text-brand-orange-light hover:border-brand-orange/30 cursor-pointer transition-all font-semibold"
            >
              {label}
            </button>
          ))}
          <button
            onClick={resetToDefault}
            className="text-[9px] px-2.5 py-1 rounded-full border border-border-default bg-white/[0.03] text-text-dim hover:text-text-primary cursor-pointer transition-colors font-semibold"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Main Weight Sliders */}
      <div className="px-4 py-3">
        {([
          { key: 'retail' as const, label: 'Retail Opportunity', color: '#3B82F6' },
          { key: 'supplyChain' as const, label: 'Supply Chain Value', color: '#10B981' },
          { key: 'strategic' as const, label: 'Strategic Fit', color: '#A855F7' },
        ]).map(({ key, label, color }) => (
          <div key={key} className="mb-3">
            <div className="flex justify-between mb-1">
              <span className="text-[10px] font-semibold" style={{ color }}>{label}</span>
              <span className="text-[10px] font-bold text-text-primary">{weights[key]}%</span>
            </div>
            <input
              type="range" min={0} max={80} step={5}
              value={weights[key]}
              onChange={(e) => handleMainChange(key, Number(e.target.value))}
              className="w-full h-1.5 rounded-full appearance-none cursor-pointer"
              style={{
                background: `linear-gradient(to right, ${color} ${weights[key]}%, rgba(255,255,255,0.1) ${weights[key]}%)`,
                accentColor: color,
              }}
            />
          </div>
        ))}
        <div className="text-[9px] text-text-dim text-center mt-1">
          Total: {weights.retail + weights.supplyChain + weights.strategic}%
        </div>
      </div>
    </div>
  );
}
