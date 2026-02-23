import { DataOverlays } from './DataOverlays';
import { CompetitorList } from './CompetitorList';
import { DCNetwork } from './DCNetwork';

export function LeftSidebar() {
  return (
    <div className="w-60 shrink-0 bg-surface-card border-r border-border-default overflow-y-auto flex flex-col">
      <DataOverlays />
      <CompetitorList />
      <DCNetwork />
    </div>
  );
}
