import { create } from 'zustand';

interface CalculatorState {
  income: number;
  regime: 'new' | 'old';
  oldRegimeDeductions: number;
  setIncome: (income: number) => void;
  setRegime: (regime: 'new' | 'old') => void;
  setOldRegimeDeductions: (value: number) => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  income: 1000000,
  regime: 'new',
  oldRegimeDeductions: 0,
  setIncome: (income) => set({ income }),
  setRegime: (regime) => set({ regime }),
  setOldRegimeDeductions: (value) => set({ oldRegimeDeductions: value }),
}));
