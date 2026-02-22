import { create } from 'zustand';

interface CalculatorState {
  income: number;
  regime: 'new' | 'old';
  setIncome: (income: number) => void;
  setRegime: (regime: 'new' | 'old') => void;
}

export const useCalculatorStore = create<CalculatorState>((set) => ({
  income: 1000000,
  regime: 'new',
  setIncome: (income) => set({ income }),
  setRegime: (regime) => set({ regime }),
}));
