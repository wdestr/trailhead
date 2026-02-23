import { create } from 'zustand';

interface MapState {
  activeLayers: Record<string, boolean>;
  toggleLayer: (id: string) => void;
  setLayer: (id: string, active: boolean) => void;
  selectedCompetitors: Record<string, boolean>;
  toggleCompetitor: (name: string) => void;
}

export const useMapStore = create<MapState>((set) => ({
  activeLayers: {
    demo: true,
    income: false,
    lifestyle: false,
    ddg: true,
    competitors: false,
    traffic: false,
    realestate: false,
    supply: true,
    tcts: false,
    climate: false,
    retailers: false,
  },
  toggleLayer: (id) =>
    set((state) => ({
      activeLayers: { ...state.activeLayers, [id]: !state.activeLayers[id] },
    })),
  setLayer: (id, active) =>
    set((state) => ({
      activeLayers: { ...state.activeLayers, [id]: active },
    })),
  selectedCompetitors: {},
  toggleCompetitor: (name) =>
    set((state) => ({
      selectedCompetitors: {
        ...state.selectedCompetitors,
        [name]: state.selectedCompetitors[name] === undefined ? false : !state.selectedCompetitors[name],
      },
    })),
}));
