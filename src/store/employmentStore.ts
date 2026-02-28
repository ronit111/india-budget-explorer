import { create } from 'zustand';

interface EmploymentState {
  selectedYear: string;
  selectedIndicatorId: string | null;
  selectedCategory: string;
  setSelectedYear: (year: string) => void;
  setSelectedIndicatorId: (id: string | null) => void;
  setSelectedCategory: (category: string) => void;
}

export const useEmploymentStore = create<EmploymentState>((set) => ({
  selectedYear: '2025-26',
  selectedIndicatorId: null,
  selectedCategory: 'all',
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedIndicatorId: (id) => set({ selectedIndicatorId: id }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
