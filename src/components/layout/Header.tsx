import { Map, LayoutDashboard, Kanban, FlaskConical, Search, SlidersHorizontal, Keyboard } from 'lucide-react';
import { useState } from 'react';
import { useAppStore } from '@/stores/app-store';
import type { ViewMode } from '@/types';

const NAV_ITEMS: { mode: ViewMode; label: string; icon: typeof Map; shortcut: string }[] = [
  { mode: 'map', label: 'Map Intelligence', icon: Map, shortcut: 'M' },
  { mode: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, shortcut: 'D' },
  { mode: 'pipeline', label: 'Pipeline', icon: Kanban, shortcut: 'P' },
  { mode: 'scenarios', label: 'Scenarios', icon: FlaskConical, shortcut: 'S' },
];

export function Header() {
  const { viewMode, setViewMode, setQueryBarOpen, showWeightSliders, setShowWeightSliders } = useAppStore();
  const [showShortcuts, setShowShortcuts] = useState(false);

  return (
    <header className="bg-gradient-to-r from-navy-dark to-navy border-b border-border-default px-5 h-12 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-[5px] bg-gradient-to-br from-brand-orange to-brand-orange-light flex items-center justify-center text-xs font-extrabold text-white shadow-lg shadow-brand-orange/20">
          T
        </div>
        <span className="text-[15px] font-bold tracking-wide">TRAILHEAD</span>
        <span className="text-[10px] text-text-muted border-l border-border-light pl-3 tracking-wider uppercase hidden lg:inline">
          Columbia Sportswear &bull; Unified Site Intelligence &amp; Supply Chain Platform
        </span>
      </div>

      <div className="flex items-center gap-1">
        {NAV_ITEMS.map(({ mode, label, icon: Icon, shortcut }) => (
          <button
            key={mode}
            onClick={() => setViewMode(mode)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[11px] font-semibold transition-all cursor-pointer ${
              viewMode === mode
                ? 'bg-brand-orange/15 text-brand-orange-light border border-brand-orange/30'
                : 'text-text-muted hover:text-text-primary hover:bg-white/5 border border-transparent'
            }`}
            title={`${label} (${shortcut})`}
          >
            <Icon size={13} />
            <span className="hidden xl:inline">{label}</span>
          </button>
        ))}

        <div className="w-px h-5 bg-border-light mx-2" />

        <button
          onClick={() => setShowWeightSliders(!showWeightSliders)}
          className={`p-1.5 rounded-md cursor-pointer border-0 transition-colors ${
            showWeightSliders ? 'bg-brand-orange/15 text-brand-orange-light' : 'text-text-muted hover:text-text-primary hover:bg-white/5'
          }`}
          title="Scoring Weights (W)"
        >
          <SlidersHorizontal size={15} />
        </button>

        <button
          onClick={() => setQueryBarOpen(true)}
          className="p-1.5 rounded-md text-text-muted hover:text-text-primary hover:bg-white/5 cursor-pointer border-0 transition-colors"
          title="Search (Cmd+K)"
        >
          <Search size={15} />
        </button>

        <div className="relative">
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="p-1.5 rounded-md text-text-dim hover:text-text-primary hover:bg-white/5 cursor-pointer border-0 transition-colors"
            title="Keyboard Shortcuts"
          >
            <Keyboard size={14} />
          </button>
          {showShortcuts && (
            <>
              <div className="fixed inset-0 z-40" onClick={() => setShowShortcuts(false)} />
              <div className="absolute right-0 top-full mt-2 z-50 w-56 bg-surface-card border border-border-light rounded-lg shadow-2xl py-2.5 px-3">
                <div className="text-[9px] text-text-dim uppercase tracking-wider font-bold mb-2">Keyboard Shortcuts</div>
                {[
                  ['1–9, 0', 'Toggle data layers'],
                  ['M', 'Map view'],
                  ['D', 'Dashboard'],
                  ['P', 'Pipeline'],
                  ['S', 'Scenarios'],
                  ['W', 'Weight sliders'],
                  ['⌘K', 'Search / Query'],
                  ['Esc', 'Close dialogs'],
                ].map(([key, desc]) => (
                  <div key={key} className="flex items-center justify-between py-1">
                    <span className="text-[10px] text-text-muted">{desc}</span>
                    <kbd className="text-[9px] text-text-dim bg-white/5 px-1.5 py-0.5 rounded border border-border-default font-mono">{key}</kbd>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>

        <div className="w-px h-5 bg-border-light mx-2" />

        <span className="text-[9px] text-text-dim mr-2 hidden lg:inline">v2.0</span>
        <div className="w-7 h-7 rounded-full bg-surface-card border border-border-default flex items-center justify-center text-[11px] font-semibold text-text-muted">
          WS
        </div>
      </div>
    </header>
  );
}
