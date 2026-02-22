import { create } from 'zustand';

interface BudgetState {
  selectedYear: string;
  selectedMinistryId: string | null;
  setSelectedYear: (year: string) => void;
  setSelectedMinistryId: (id: string | null) => void;
}

export const useBudgetStore = create<BudgetState>((set) => ({
  selectedYear: '2025-26',
  selectedMinistryId: null,
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedMinistryId: (id) => set({ selectedMinistryId: id }),
}));
