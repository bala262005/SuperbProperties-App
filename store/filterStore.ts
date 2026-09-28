
import { create } from "zustand";

interface FilterStore {
  search: string;
  city: string;
  type: string;
  minPrice: number;
  maxPrice: number;
  bedrooms: number;

  setSearch: (search: string) => void;
  setCity: (city: string) => void;
  setType: (type: string) => void;
  setMinPrice: (price: number) => void;
  setMaxPrice: (price: number) => void;
  setBedrooms: (bedrooms: number) => void;

  resetFilters: () => void;
}

export const useFilterStore = create<FilterStore>((set) => ({
  search: "",
  city: "",
  type: "",
  minPrice: 0,
  maxPrice: 0,
  bedrooms: 0,

  setSearch: (search) => set({ search }),

  setCity: (city) => set({ city }),

  setType: (type) => set({ type }),

  setMinPrice: (price) => set({ minPrice: price }),

  setMaxPrice: (price) => set({ maxPrice: price }),

  setBedrooms: (bedrooms) => set({ bedrooms }),

  resetFilters: () =>
    set({
      search: "",
      city: "",
      type: "",
      minPrice: 0,
      maxPrice: 0,
      bedrooms: 0,
    }),
}));

