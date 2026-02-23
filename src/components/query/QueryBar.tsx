import { useState, useRef, useEffect } from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { useAppStore } from '@/stores/app-store';
import { MARKETS } from '@/data/markets';
import { PROPERTIES } from '@/data/properties';

const EXAMPLE_QUERIES = [
  'Markets with HHI > $85K and OAI > 90',
  'Highest digital demand gap markets',
  'Compare Denver vs. Salt Lake City',
  'Properties with Site Score above 90',
  'Total cost-to-serve delta for top 5 markets',
  'Which markets have the best supply chain value?',
];

export function QueryBar() {
  const { queryBarOpen, setQueryBarOpen, setSelectedMarket, setViewMode } = useAppStore();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<{ type: string; label: string; action: () => void }[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (queryBarOpen) inputRef.current?.focus();
  }, [queryBarOpen]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setQueryBarOpen(!queryBarOpen);
      }
      if (e.key === 'Escape' && queryBarOpen) setQueryBarOpen(false);
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [queryBarOpen, setQueryBarOpen]);

  useEffect(() => {
    if (!query.trim()) { setResults([]); return; }
    const q = query.toLowerCase();
    const res: { type: string; label: string; action: () => void }[] = [];

    // Search markets
    MARKETS.filter(m => m.name.toLowerCase().includes(q) || m.state.toLowerCase().includes(q)).forEach(m => {
      res.push({ type: 'Market', label: `${m.name}, ${m.state} — Score: ${m.trailheadScore}`, action: () => { setSelectedMarket(m.name); setViewMode('map'); setQueryBarOpen(false); } });
    });

    // Search properties
    PROPERTIES.filter(p => p.name.toLowerCase().includes(q) || p.market.toLowerCase().includes(q)).forEach(p => {
      res.push({ type: 'Property', label: `${p.name} — ${p.market} — Score: ${p.siteScore}`, action: () => { setSelectedMarket(p.market); setViewMode('map'); setQueryBarOpen(false); } });
    });

    // Keyword matches
    if (q.includes('dashboard') || q.includes('overview')) res.push({ type: 'View', label: 'Open Executive Dashboard', action: () => { setViewMode('dashboard'); setQueryBarOpen(false); } });
    if (q.includes('pipeline') || q.includes('kanban')) res.push({ type: 'View', label: 'Open Pipeline Board', action: () => { setViewMode('pipeline'); setQueryBarOpen(false); } });
    if (q.includes('scenario') || q.includes('what if')) res.push({ type: 'View', label: 'Open Scenario Planning', action: () => { setViewMode('scenarios'); setQueryBarOpen(false); } });
    if (q.includes('ddg') || q.includes('digital demand')) {
      const sorted = [...MARKETS].sort((a, b) => b.retail.ddg - a.retail.ddg);
      sorted.slice(0, 3).forEach(m => {
        res.push({ type: 'Result', label: `${m.name} — DDG: ${m.retail.ddg}`, action: () => { setSelectedMarket(m.name); setViewMode('map'); setQueryBarOpen(false); } });
      });
    }
    if (q.includes('supply chain') || q.includes('tcts')) {
      const sorted = [...MARKETS].sort((a, b) => parseFloat(a.tctsDelta.replace(/[^-\d.]/g, '')) - parseFloat(b.tctsDelta.replace(/[^-\d.]/g, '')));
      sorted.slice(0, 3).forEach(m => {
        res.push({ type: 'Result', label: `${m.name} — TCTS Δ: ${m.tctsDelta}`, action: () => { setSelectedMarket(m.name); setViewMode('map'); setQueryBarOpen(false); } });
      });
    }

    setResults(res.slice(0, 8));
  }, [query, setSelectedMarket, setViewMode, setQueryBarOpen]);

  if (!queryBarOpen) return null;

  return (
    <div className="fixed inset-0 z-[200] flex items-start justify-center pt-[15vh] bg-black/50 backdrop-blur-sm" onClick={() => setQueryBarOpen(false)}>
      <div className="w-[560px] bg-surface-card border border-border-light rounded-xl shadow-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
        <div className="flex items-center gap-3 px-4 py-3 border-b border-border-default">
          <Search size={16} className="text-text-dim shrink-0" />
          <input
            ref={inputRef}
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search markets, properties, or ask a question..."
            className="flex-1 bg-transparent border-0 outline-none text-sm text-text-primary placeholder:text-text-dim"
          />
          <kbd className="text-[9px] text-text-dim bg-white/5 px-1.5 py-0.5 rounded border border-border-default">ESC</kbd>
          <button onClick={() => setQueryBarOpen(false)} className="text-text-dim hover:text-text-primary cursor-pointer bg-transparent border-0">
            <X size={14} />
          </button>
        </div>

        {results.length > 0 ? (
          <div className="max-h-[300px] overflow-y-auto">
            {results.map((r, i) => (
              <button
                key={i}
                onClick={r.action}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-left hover:bg-white/[0.04] cursor-pointer border-0 bg-transparent transition-colors"
              >
                <span className="text-[9px] text-text-dim uppercase tracking-wider font-bold w-16 shrink-0">{r.type}</span>
                <span className="text-[11px] text-text-primary">{r.label}</span>
              </button>
            ))}
          </div>
        ) : !query.trim() ? (
          <div className="p-4">
            <div className="flex items-center gap-1.5 text-[10px] text-text-dim uppercase tracking-wider font-bold mb-2.5">
              <Sparkles size={10} /> Example Queries
            </div>
            {EXAMPLE_QUERIES.map((eq, i) => (
              <button
                key={i}
                onClick={() => setQuery(eq)}
                className="w-full text-left text-[11px] text-text-muted hover:text-text-primary py-1.5 px-2 rounded hover:bg-white/[0.04] cursor-pointer border-0 bg-transparent transition-colors"
              >
                {eq}
              </button>
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
}
