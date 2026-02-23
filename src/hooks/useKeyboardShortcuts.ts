import { useEffect } from 'react';
import { useAppStore } from '@/stores/app-store';
import { useMapStore } from '@/stores/map-store';
import { DATA_LAYERS } from '@/data/layers';

/**
 * Keyboard shortcuts:
 * 1-9, 0   — Toggle data overlay layers (in order)
 * M        — Switch to Map view
 * D        — Switch to Dashboard view
 * P        — Switch to Pipeline view
 * S        — Switch to Scenarios view
 * W        — Toggle weight sliders
 * Cmd/Ctrl+K — Toggle query bar (handled in QueryBar.tsx)
 * Escape   — Close query bar (handled in QueryBar.tsx)
 * ← →      — Navigate between markets (prev/next rank)
 */
export function useKeyboardShortcuts() {
  const { setViewMode, setShowWeightSliders, queryBarOpen } = useAppStore();
  const { toggleLayer } = useMapStore();

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // Don't trigger shortcuts when typing in inputs
      const target = e.target as HTMLElement;
      if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.tagName === 'SELECT') return;
      // Don't trigger if query bar is open (it has its own key handler)
      if (queryBarOpen) return;
      // Don't trigger with modifier keys (except Cmd+K which is handled elsewhere)
      if (e.ctrlKey || e.metaKey || e.altKey) return;

      // Number keys 1-9, 0 → toggle data layers
      const layerKeys = DATA_LAYERS.map(l => l.id);
      if (e.key >= '1' && e.key <= '9') {
        const idx = Number(e.key) - 1;
        if (idx < layerKeys.length) {
          e.preventDefault();
          toggleLayer(layerKeys[idx]);
        }
      }
      if (e.key === '0' && layerKeys.length >= 10) {
        e.preventDefault();
        toggleLayer(layerKeys[9]);
      }

      // View mode shortcuts
      switch (e.key.toLowerCase()) {
        case 'm':
          e.preventDefault();
          setViewMode('map');
          break;
        case 'd':
          e.preventDefault();
          setViewMode('dashboard');
          break;
        case 'p':
          e.preventDefault();
          setViewMode('pipeline');
          break;
        case 's':
          e.preventDefault();
          setViewMode('scenarios');
          break;
        case 'w':
          e.preventDefault();
          setShowWeightSliders(true);
          break;
      }
    };

    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [queryBarOpen, setViewMode, setShowWeightSliders, toggleLayer]);
}
