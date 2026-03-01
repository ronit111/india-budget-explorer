import { create } from 'zustand';
import type { ExpenseCategory } from '../lib/costOfLivingEngine.ts';
import { DEFAULT_EXPENSES, EXPENSE_PRESETS } from '../lib/costOfLivingEngine.ts';

interface CostOfLivingState {
  expenses: ExpenseCategory[];
  comparisonYear: string;
  activePreset: string | null; // 'single' | 'family' | null (custom)
  setExpenseAmount: (id: string, amount: number) => void;
  setComparisonYear: (year: string) => void;
  applyPreset: (presetKey: string) => void;
  resetToDefaults: () => void;
}

export const useCostOfLivingStore = create<CostOfLivingState>((set) => ({
  expenses: DEFAULT_EXPENSES,
  comparisonYear: '2019-20',
  activePreset: null,
  setExpenseAmount: (id, amount) =>
    set((s) => ({
      expenses: s.expenses.map((e) => (e.id === id ? { ...e, amount } : e)),
      activePreset: null,
    })),
  setComparisonYear: (year) => set({ comparisonYear: year }),
  applyPreset: (presetKey) => {
    const preset = EXPENSE_PRESETS[presetKey];
    if (!preset) return;
    set((s) => ({
      expenses: s.expenses.map((e) => ({
        ...e,
        amount: Math.round((preset.multipliers[e.id] ?? 0) * preset.total),
      })),
      activePreset: presetKey,
    }));
  },
  resetToDefaults: () => set({ expenses: DEFAULT_EXPENSES, activePreset: null }),
}));
