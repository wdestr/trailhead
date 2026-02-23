import { useState, useCallback, useRef } from 'react';
import { BarChart3, Building2, Truck, ChevronDown, ChevronUp, GripHorizontal } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { MarketsTable } from './MarketsTable';
import { PropertiesTable } from './PropertiesTable';
import { DCNetworkPanel } from './DCNetworkPanel';

const TABS = [
  { id: 'markets' as const, label: 'Top Markets', icon: BarChart3 },
  { id: 'properties' as const, label: 'Properties', icon: Building2 },
  { id: 'dcs' as const, label: 'DC Network', icon: Truck },
];

const MIN_HEIGHT = 36; // collapsed — just the tab bar
const DEFAULT_HEIGHT = 210;
const MAX_HEIGHT = 500;

export function BottomPanel() {
  const { bottomTab, setBottomTab } = useAppStore();
  const [height, setHeight] = useState(DEFAULT_HEIGHT);
  const [collapsed, setCollapsed] = useState(false);
  const dragging = useRef(false);
  const startY = useRef(0);
  const startH = useRef(DEFAULT_HEIGHT);

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    dragging.current = true;
    startY.current = e.clientY;
    startH.current = height;

    const onMouseMove = (ev: MouseEvent) => {
      if (!dragging.current) return;
      const delta = startY.current - ev.clientY; // dragging up = positive
      const newH = Math.min(MAX_HEIGHT, Math.max(MIN_HEIGHT + 10, startH.current + delta));
      setHeight(newH);
      setCollapsed(false);
    };
    const onMouseUp = () => {
      dragging.current = false;
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  }, [height]);

  const toggleCollapse = () => {
    if (collapsed) {
      setCollapsed(false);
      setHeight(DEFAULT_HEIGHT);
    } else {
      setCollapsed(true);
    }
  };

  return (
    <div
      className="bg-surface-card border-t border-border-light shrink-0 flex flex-col relative"
      style={{ height: collapsed ? MIN_HEIGHT : height }}
    >
      {/* Drag handle */}
      <div
        className="absolute -top-1 left-0 right-0 h-2 cursor-ns-resize flex items-center justify-center z-10 group"
        onMouseDown={onMouseDown}
      >
        <GripHorizontal size={12} className="text-text-dim opacity-0 group-hover:opacity-60 transition-opacity" />
      </div>

      {/* Tab bar */}
      <div className="px-3.5 py-2 flex items-center gap-1 border-b border-border-default shrink-0">
        {TABS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => { setBottomTab(id); if (collapsed) setCollapsed(false); setHeight(h => h < 100 ? DEFAULT_HEIGHT : h); }}
            className={`flex items-center gap-1.5 text-[10px] px-3 py-1 rounded border cursor-pointer font-semibold transition-all ${
              bottomTab === id
                ? 'border-brand-orange/40 bg-brand-orange/10 text-brand-orange-light'
                : 'border-border-default bg-transparent text-text-muted hover:text-text-primary'
            }`}
          >
            <Icon size={11} />
            {label}
          </button>
        ))}

        <button
          onClick={toggleCollapse}
          className="ml-auto p-1 text-text-dim hover:text-text-primary cursor-pointer bg-transparent border-0 transition-colors"
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* Content */}
      {!collapsed && (
        <div className="flex-1 overflow-auto">
          {bottomTab === 'markets' && <MarketsTable />}
          {bottomTab === 'properties' && <PropertiesTable />}
          {bottomTab === 'dcs' && <DCNetworkPanel />}
        </div>
      )}
    </div>
  );
}
