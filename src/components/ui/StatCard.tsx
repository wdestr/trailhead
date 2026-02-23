interface StatCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
}

export function StatCard({ label, value, sub, accent }: StatCardProps) {
  return (
    <div
      className={`rounded-[10px] px-4 py-3 border flex-1 min-w-[130px] ${
        accent
          ? 'bg-gradient-to-br from-navy to-navy-light border-brand-orange-glow'
          : 'bg-surface-card border-border-default'
      }`}
    >
      <div className="text-[10px] text-text-muted uppercase tracking-wider font-bold mb-1">{label}</div>
      <div className={`text-2xl font-extrabold leading-tight ${accent ? 'text-brand-orange-light' : 'text-text-primary'}`}>
        {value}
      </div>
      {sub && <div className="text-[11px] text-green-500 mt-0.5 font-semibold">{sub}</div>}
    </div>
  );
}
