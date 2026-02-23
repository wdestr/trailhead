import { useAppStore } from '@/stores/app-store';
import { Header } from '@/components/layout/Header';
import { StatBar } from '@/components/layout/StatBar';
import { LeftSidebar } from '@/components/sidebar/LeftSidebar';
import { MapContainer } from '@/components/map/MapContainer';
import { BottomPanel } from '@/components/panels/BottomPanel';
import { RightSidebar } from '@/components/detail/RightSidebar';
import { WeightSliders } from '@/components/scoring/WeightSliders';
import { ProFormaModal } from '@/components/properties/ProFormaModal';
import { Dashboard } from '@/components/dashboard/Dashboard';
import { PipelineBoard } from '@/components/pipeline/PipelineBoard';
import { ScenarioEngine } from '@/components/scenarios/ScenarioEngine';
import { QueryBar } from '@/components/query/QueryBar';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';

export default function App() {
  const { viewMode } = useAppStore();
  useKeyboardShortcuts();

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      <Header />
      <StatBar />

      <div className="flex-1 flex overflow-hidden relative">
        {viewMode === 'map' && (
          <>
            <ErrorBoundary fallbackLabel="Sidebar failed to load">
              <LeftSidebar />
            </ErrorBoundary>
            <div className="flex-1 flex flex-col overflow-hidden">
              <div className="flex-1 p-2.5 min-h-0">
                <ErrorBoundary fallbackLabel="Map failed to load">
                  <MapContainer />
                </ErrorBoundary>
              </div>
              <ErrorBoundary fallbackLabel="Data panel failed to load">
                <BottomPanel />
              </ErrorBoundary>
            </div>
            <ErrorBoundary fallbackLabel="Detail panel failed to load">
              <RightSidebar />
            </ErrorBoundary>
          </>
        )}

        {viewMode === 'dashboard' && (
          <ErrorBoundary fallbackLabel="Dashboard failed to load">
            <Dashboard />
          </ErrorBoundary>
        )}
        {viewMode === 'pipeline' && (
          <ErrorBoundary fallbackLabel="Pipeline failed to load">
            <PipelineBoard />
          </ErrorBoundary>
        )}
        {viewMode === 'scenarios' && (
          <ErrorBoundary fallbackLabel="Scenarios failed to load">
            <ScenarioEngine />
          </ErrorBoundary>
        )}

        <WeightSliders />
      </div>

      <ProFormaModal />
      <QueryBar />
    </div>
  );
}
