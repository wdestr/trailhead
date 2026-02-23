import { useState } from 'react';
import { MapPin, User, Calendar } from 'lucide-react';
import { PIPELINE_ITEMS, PIPELINE_STAGES } from '@/data/pipeline';
import type { PipelineItem, PipelineStage } from '@/types';

export function PipelineBoard() {
  const [items, setItems] = useState(PIPELINE_ITEMS);
  const [dragging, setDragging] = useState<string | null>(null);

  const handleDragStart = (id: string) => setDragging(id);

  const handleDrop = (stage: PipelineStage) => {
    if (!dragging) return;
    setItems(prev => prev.map(item =>
      item.id === dragging ? { ...item, stage } : item
    ));
    setDragging(null);
  };

  return (
    <div className="flex-1 overflow-hidden flex flex-col p-5">
      <div className="text-lg font-bold mb-1">Expansion Pipeline</div>
      <div className="text-xs text-text-muted mb-4">Track markets from identification through store opening</div>

      <div className="flex-1 flex gap-3 overflow-x-auto pb-4">
        {PIPELINE_STAGES.map(stage => {
          const stageItems = items.filter(i => i.stage === stage.id);
          return (
            <div
              key={stage.id}
              className="min-w-[200px] w-[200px] shrink-0 flex flex-col"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(stage.id as PipelineStage)}
            >
              {/* Stage Header */}
              <div className="flex items-center gap-2 mb-2 px-2">
                <div className="w-2 h-2 rounded-full" style={{ background: stage.color }} />
                <span className="text-[10px] font-bold uppercase tracking-wider text-text-muted">{stage.label}</span>
                <span className="text-[9px] bg-white/5 text-text-dim px-1.5 py-0.5 rounded-full font-semibold ml-auto">
                  {stageItems.length}
                </span>
              </div>

              {/* Cards */}
              <div className="flex-1 space-y-2 overflow-y-auto">
                {stageItems.map(item => (
                  <PipelineCard key={item.id} item={item} stageColor={stage.color} onDragStart={handleDragStart} />
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PipelineCard({ item, stageColor, onDragStart }: { item: PipelineItem; stageColor: string; onDragStart: (id: string) => void }) {
  const scoreColor = item.trailheadScore >= 90 ? '#22C55E' : item.trailheadScore >= 85 ? '#FFA040' : '#EAB308';

  return (
    <div
      draggable
      onDragStart={() => onDragStart(item.id)}
      className="bg-surface-card rounded-lg p-3 border border-border-default hover:border-border-light cursor-grab active:cursor-grabbing transition-all hover:shadow-lg"
      style={{ borderLeftWidth: 3, borderLeftColor: stageColor }}
    >
      <div className="flex justify-between items-start mb-1.5">
        <div className="text-xs font-semibold">{item.market}</div>
        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded" style={{ color: scoreColor, background: `${scoreColor}15` }}>
          {item.trailheadScore}
        </span>
      </div>
      <div className="text-[10px] text-text-muted flex items-center gap-1 mb-1">
        <MapPin size={9} /> {item.state}
      </div>
      {item.property && (
        <div className="text-[9px] text-cyan-400 bg-cyan-500/10 px-1.5 py-0.5 rounded mb-1.5 inline-block">
          {item.property}
        </div>
      )}
      <div className="text-[9px] text-text-dim mb-2 line-clamp-2">{item.notes}</div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1 text-[9px] text-text-dim">
          <User size={8} /> {item.assignee}
        </div>
        <div className="flex items-center gap-1 text-[9px] text-text-dim">
          <Calendar size={8} /> {item.targetDate.slice(5)}
        </div>
      </div>
    </div>
  );
}
