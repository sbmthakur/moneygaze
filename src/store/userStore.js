import { useEffect, useState } from "react";
import { create } from "zustand";
import { persist } from "zustand/middleware";

const empytyState = (set, get) => ({
  user: null,
  setUser: (user) => set({ user: user }),
});

export const usePersistedUserStore = create(
  persist(empytyState, {
    name: "moneygaze-user",
  })
);

export const useUserStore = (selector, compare) => {
  const store = usePersistedUserStore(selector, compare);
  const [isHydrated, setIsHydrated] = useState(false);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  return isHydrated ? store : selector(empytyState);
};
