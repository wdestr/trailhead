import { create } from 'zustand';
import type { ViewMode } from '@/types';

interface AppState {
  selectedMarket: string;
  setSelectedMarket: (market: string) => void;
  rightTab: 'overview' | 'supply' | 'properties';
  setRightTab: (tab: 'overview' | 'supply' | 'properties') => void;
  bottomTab: 'markets' | 'properties' | 'dcs';
  setBottomTab: (tab: 'markets' | 'properties' | 'dcs') => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
  proFormaOpen: string | null;
  setProFormaOpen: (id: string | null) => void;
  showWeightSliders: boolean;
  setShowWeightSliders: (show: boolean) => void;
  queryBarOpen: boolean;
  setQueryBarOpen: (open: boolean) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedMarket: 'Denver-Aurora',
  setSelectedMarket: (market) => set({ selectedMarket: market }),
  rightTab: 'overview',
  setRightTab: (tab) => set({ rightTab: tab }),
  bottomTab: 'markets',
  setBottomTab: (tab) => set({ bottomTab: tab }),
  viewMode: 'map',
  setViewMode: (mode) => set({ viewMode: mode }),
  proFormaOpen: null,
  setProFormaOpen: (id) => set({ proFormaOpen: id }),
  showWeightSliders: false,
  setShowWeightSliders: (show) => set({ showWeightSliders: show }),
  queryBarOpen: false,
  setQueryBarOpen: (open) => set({ queryBarOpen: open }),
}));
