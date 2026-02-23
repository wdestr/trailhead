interface ScoreBarProps {
  value: number;
  color?: string;
  height?: number;
}

export function ScoreBar({ value, color = '#FF6F00', height = 5 }: ScoreBarProps) {
  return (
    <div className="flex-1 rounded-full overflow-hidden" style={{ height, background: 'rgba(255,255,255,0.06)' }}>
      <div
        className="h-full rounded-full transition-all duration-500 ease-out"
        style={{ width: `${value}%`, background: `linear-gradient(90deg, ${color}88, ${color})` }}
      />
    </div>
  );
}
