import { useEffect, useState } from "react";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

const empytyState = (set, get) => ({
  category: "Auto & Transport",
  setCategory: (category) => set({ category }),
});

export const usePersistedCategoryStore = create(
  persist(empytyState, {
    name: "spending-category",
    storage: createJSONStorage(() => sessionStorage),
  })
);

export const useCategoryStore = (selector, compare) => {
  const store = usePersistedCategoryStore(selector, compare);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? store : selector(empytyState);
};
