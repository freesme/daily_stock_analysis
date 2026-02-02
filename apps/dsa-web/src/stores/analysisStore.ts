import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AnalysisHistory, AnalysisResult } from '@/types';

interface AnalysisState {
  // Current analysis result
  currentResult: AnalysisResult | null;
  
  // Recent history cache
  recentHistory: AnalysisHistory[];
  
  // UI state
  isAnalyzing: boolean;
  analysisError: string | null;
  
  // Actions
  setCurrentResult: (result: AnalysisResult | null) => void;
  setRecentHistory: (history: AnalysisHistory[]) => void;
  addToHistory: (item: AnalysisHistory) => void;
  setAnalyzing: (isAnalyzing: boolean) => void;
  setError: (error: string | null) => void;
  clearCurrentResult: () => void;
}

export const useAnalysisStore = create<AnalysisState>()(
  persist(
    (set) => ({
      currentResult: null,
      recentHistory: [],
      isAnalyzing: false,
      analysisError: null,

      setCurrentResult: (result) =>
        set({ currentResult: result, analysisError: null }),

      setRecentHistory: (history) =>
        set({ recentHistory: history }),

      addToHistory: (item) =>
        set((state) => ({
          recentHistory: [item, ...state.recentHistory].slice(0, 20), // Keep last 20
        })),

      setAnalyzing: (isAnalyzing) =>
        set({ isAnalyzing, analysisError: isAnalyzing ? null : undefined }),

      setError: (error) =>
        set({ analysisError: error, isAnalyzing: false }),

      clearCurrentResult: () =>
        set({ currentResult: null, analysisError: null }),
    }),
    {
      name: 'dsa-analysis',
      partialize: (state) => ({
        recentHistory: state.recentHistory,
      }),
    }
  )
);
