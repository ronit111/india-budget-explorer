import { create } from 'zustand';
import type { OldRegimeDeductions } from '../lib/data/schema.ts';

const DEFAULT_DEDUCTIONS: OldRegimeDeductions = {
  section80C: 0,
  section80D_self: 0,
  section80D_parents: 0,
  section80CCD1B: 0,
  section24b: 0,
  hra: 0,
  section80TTA: 0,
};

const PRESETS: Record<'basic' | 'home_loan' | 'max', Partial<OldRegimeDeductions>> = {
  basic: { section80C: 150000, section80D_self: 25000 },
  home_loan: { section80C: 150000, section80D_self: 25000, section24b: 200000 },
  max: {
    section80C: 150000,
    section80D_self: 25000,
    section80D_parents: 25000,
    section80CCD1B: 50000,
    section24b: 200000,
    section80TTA: 10000,
  },
};

interface CalculatorState {
  income: number;
  regime: 'new' | 'old';
  deductions: OldRegimeDeductions;
  setIncome: (income: number) => void;
  setRegime: (regime: 'new' | 'old') => void;
  setDeduction: <K extends keyof OldRegimeDeductions>(key: K, value: number) => void;
  applyPreset: (preset: 'basic' | 'home_loan' | 'max') => void;
  resetDeductions: () => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  income: 1000000,
  regime: 'new',
  deductions: { ...DEFAULT_DEDUCTIONS },
  setIncome: (income) => set({ income }),
  setRegime: (regime) => set({ regime }),
  setDeduction: (key, value) =>
    set((state) => ({
      deductions: { ...state.deductions, [key]: value },
    })),
  applyPreset: (preset) =>
    set(() => ({
      deductions: { ...DEFAULT_DEDUCTIONS, ...PRESETS[preset] },
    })),
  resetDeductions: () => set({ deductions: { ...DEFAULT_DEDUCTIONS } }),
}));
