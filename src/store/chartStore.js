import { create } from "zustand";

export const useChartStore = create((set) => ({
  chartSlot: "month",
  setChartSlot: (slot) => set({ chartSlot: slot }),
}));
