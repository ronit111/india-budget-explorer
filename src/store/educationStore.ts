import { create } from 'zustand';

interface EducationState {
  selectedYear: string;
  selectedIndicatorId: string | null;
  selectedCategory: string;
  setSelectedYear: (year: string) => void;
  setSelectedIndicatorId: (id: string | null) => void;
  setSelectedCategory: (category: string) => void;
}

export const useEducationStore = create<EducationState>((set) => ({
  selectedYear: '2025-26',
  selectedIndicatorId: null,
  selectedCategory: 'all',
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedIndicatorId: (id) => set({ selectedIndicatorId: id }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
}));
