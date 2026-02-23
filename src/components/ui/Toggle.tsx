interface ToggleProps {
  on: boolean;
  color: string;
  onToggle: () => void;
}

export function Toggle({ on, color, onToggle }: ToggleProps) {
  return (
    <button
      onClick={(e) => { e.stopPropagation(); onToggle(); }}
      className="w-[30px] h-4 rounded-full p-0.5 flex items-center shrink-0 transition-colors duration-200 cursor-pointer border-0"
      style={{ background: on ? color : 'rgba(255,255,255,0.1)', justifyContent: on ? 'flex-end' : 'flex-start' }}
    >
      <div className="w-3 h-3 rounded-full bg-white shadow-md" />
    </button>
  );
}
