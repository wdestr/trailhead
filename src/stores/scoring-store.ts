import { create } from 'zustand';
import type { ScoringWeights } from '@/types';
import { DEFAULT_WEIGHTS } from '@/lib/scoring';

interface ScoringState {
  weights: ScoringWeights;
  setWeights: (weights: Partial<ScoringWeights>) => void;
  setMainWeights: (retail: number, supplyChain: number, strategic: number) => void;
  resetToDefault: () => void;
  applyPreset: (preset: Pick<ScoringWeights, 'retail' | 'supplyChain' | 'strategic'>) => void;
}

export const useScoringStore = create<ScoringState>((set) => ({
  weights: { ...DEFAULT_WEIGHTS },
  setWeights: (partial) =>
    set((state) => ({ weights: { ...state.weights, ...partial } })),
  setMainWeights: (retail, supplyChain, strategic) =>
    set((state) => ({ weights: { ...state.weights, retail, supplyChain, strategic } })),
  resetToDefault: () => set({ weights: { ...DEFAULT_WEIGHTS } }),
  applyPreset: (preset) =>
    set((state) => ({ weights: { ...state.weights, ...preset } })),
}));
