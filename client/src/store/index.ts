import { create } from "zustand";

export interface UnParsedVideo {
  name: string;
  path: string;
}
export interface Store {
  unparsedVideos: UnParsedVideo[];
  setUnparsedVideos: (videos: UnParsedVideo[]) => void;
}
export const useStore = create<Store>(
  (set, get): Store => ({
    unparsedVideos: [],
    setUnparsedVideos: (videos) =>
      set({
        unparsedVideos: [...get().unparsedVideos, ...videos],
      }),
  })
);
