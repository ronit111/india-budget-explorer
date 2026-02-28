import { create } from 'zustand';

interface StatesState {
  selectedYear: string;
  selectedIndicatorId: string | null;
  selectedCategory: string;
  selectedState: string | null;
  setSelectedYear: (year: string) => void;
  setSelectedIndicatorId: (id: string | null) => void;
  setSelectedCategory: (category: string) => void;
  setSelectedState: (state: string | null) => void;
}

export const useStatesStore = create<StatesState>((set) => ({
  selectedYear: '2025-26',
  selectedIndicatorId: null,
  selectedCategory: 'all',
  selectedState: null,
  setSelectedYear: (year) => set({ selectedYear: year }),
  setSelectedIndicatorId: (id) => set({ selectedIndicatorId: id }),
  setSelectedCategory: (category) => set({ selectedCategory: category }),
  setSelectedState: (state) => set({ selectedState: state }),
}));
