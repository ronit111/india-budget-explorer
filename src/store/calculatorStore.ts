import { create } from 'zustand';
import type { OldRegimeDeductions } from '../lib/data/schema.ts';

const EMPTY_DEDUCTIONS: OldRegimeDeductions = {
  section80C: 0,
  section80D_self: 0,
  section80D_parents: 0,
  section80CCD1B: 0,
  section24b: 0,
  hra: 0,
  section80TTA: 0,
};

const PRESETS: Record<'basic' | 'home_loan' | 'max', OldRegimeDeductions> = {
  basic: {
    section80C: 150000,
    section80D_self: 25000,
    section80D_parents: 0,
    section80CCD1B: 0,
    section24b: 0,
    hra: 0,
    section80TTA: 10000,
  },
  home_loan: {
    section80C: 150000,
    section80D_self: 25000,
    section80D_parents: 0,
    section80CCD1B: 50000,
    section24b: 200000,
    hra: 0,
    section80TTA: 10000,
  },
  max: {
    section80C: 150000,
    section80D_self: 25000,
    section80D_parents: 25000,
    section80CCD1B: 50000,
    section24b: 200000,
    hra: 0,
    section80TTA: 10000,
  },
};

interface CalculatorState {
  income: number;
  regime: 'new' | 'old';
  deductions: OldRegimeDeductions;
  // Backward-compat: computed total for components still using old API
  oldRegimeDeductions: number;
  setIncome: (income: number) => void;
  setRegime: (regime: 'new' | 'old') => void;
  setDeduction: (key: keyof OldRegimeDeductions, value: number) => void;
  setOldRegimeDeductions: (value: number) => void;
  applyPreset: (preset: 'basic' | 'home_loan' | 'max') => void;
  resetDeductions: () => void;
  totalDeductions: () => number;
}

export const useCalculatorStore = create<CalculatorState>((set, get) => ({
  income: 1000000,
  regime: 'new',
  deductions: { ...EMPTY_DEDUCTIONS },
  oldRegimeDeductions: 0,
  setIncome: (income) => set({ income }),
  setRegime: (regime) => set({ regime }),
  setDeduction: (key, value) =>
    set((state) => {
      const newDeductions = { ...state.deductions, [key]: value };
      return { deductions: newDeductions };
    }),
  setOldRegimeDeductions: (value) =>
    set({ oldRegimeDeductions: value }),
  applyPreset: (preset) => set({ deductions: { ...PRESETS[preset] } }),
  resetDeductions: () => set({ deductions: { ...EMPTY_DEDUCTIONS }, oldRegimeDeductions: 0 }),
  totalDeductions: () => {
    const d = get().deductions;
    return (
      Math.min(d.section80C, 150000) +
      Math.min(d.section80D_self, 25000) +
      Math.min(d.section80D_parents, 25000) +
      Math.min(d.section80CCD1B, 50000) +
      Math.min(d.section24b, 200000) +
      d.hra +
      Math.min(d.section80TTA, 10000)
    );
  },
}));
