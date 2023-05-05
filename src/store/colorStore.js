// create a zustand store that contains color and method to set value of color
import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { mountStoreDevtool } from "simple-zustand-devtools";
import { usePersistedUserStore } from "./userStore";
import { usePersistedCategoryStore } from "./categoryStore";

const empytyState = (set, get) => ({
  colorMode: "dark",
  toggleColorMode: () =>
    set((state) => ({
      colorMode: state.colorMode === "dark" ? "light" : "dark",
    })),
});

const usePersistedColorStore = create(
  persist(empytyState, {
    name: "color-mode",
  })
);

export const useColorStore = (selector, compare) => {
  const store = usePersistedColorStore(selector, compare);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? store : selector(empytyState);
};

if (process.env.NODE_ENV === "development") {
  mountStoreDevtool("color-mode", usePersistedColorStore);
  mountStoreDevtool("moneygaze-user", usePersistedUserStore);
  mountStoreDevtool("spending-category", usePersistedCategoryStore);
}
