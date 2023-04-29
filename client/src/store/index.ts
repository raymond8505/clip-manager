import { create } from "zustand";

export interface Store {
  count: number;
  setCount: (n: number) => void;
}
export const useStore = create<Store>(
  (set, get): Store => ({
    count: 0,
    setCount: (n) =>
      set({
        count: n,
      }),
  })
);
