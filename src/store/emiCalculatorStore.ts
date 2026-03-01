import { create } from 'zustand';
import type { LoanType } from '../lib/emiEngine.ts';

interface EMICalculatorState {
  loanType: LoanType;
  loanAmount: number;
  tenureYears: number;
  customRate: number | null; // null = use repo + spread
  setLoanType: (type: LoanType) => void;
  setLoanAmount: (amount: number) => void;
  setTenureYears: (years: number) => void;
  setCustomRate: (rate: number | null) => void;
}

const LOAN_DEFAULTS: Record<LoanType, { amount: number; tenure: number }> = {
  home: { amount: 5000000, tenure: 20 },
  car: { amount: 800000, tenure: 5 },
  personal: { amount: 300000, tenure: 3 },
};

export const LOAN_RANGES: Record<LoanType, { minAmount: number; maxAmount: number; minTenure: number; maxTenure: number }> = {
  home: { minAmount: 100000, maxAmount: 100000000, minTenure: 1, maxTenure: 30 },
  car: { minAmount: 100000, maxAmount: 5000000, minTenure: 1, maxTenure: 7 },
  personal: { minAmount: 50000, maxAmount: 2500000, minTenure: 1, maxTenure: 5 },
};

export const useEMICalculatorStore = create<EMICalculatorState>((set) => ({
  loanType: 'home',
  loanAmount: LOAN_DEFAULTS.home.amount,
  tenureYears: LOAN_DEFAULTS.home.tenure,
  customRate: null,
  setLoanType: (type) =>
    set({
      loanType: type,
      loanAmount: LOAN_DEFAULTS[type].amount,
      tenureYears: LOAN_DEFAULTS[type].tenure,
      customRate: null,
    }),
  setLoanAmount: (amount) => set({ loanAmount: amount }),
  setTenureYears: (years) => set({ tenureYears: years }),
  setCustomRate: (rate) => set({ customRate: rate }),
}));
