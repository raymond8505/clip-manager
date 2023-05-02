import { create } from "zustand";

export interface Progress {
  video: string;
  progress: {
    pos: number;
    perc: number;
    length: number;
    word: Word[];
  };
}
export interface UnparsedVideo {
  name: string;
  path: string;
  length: number;
  parsingProgress?: Progress["progress"];
}

export type Clip = UnparsedVideo;

export interface Word {
  end: number;
  start: number;
  word: string;
}

export interface Store {
  unparsedVideos: UnparsedVideo[];
  setUnparsedVideos: (videos: UnparsedVideo[]) => void;
  clips: Clip[];
  setClips: (clips: Clip[]) => void;
  updateParsingProgress: (progress: Progress) => void;
  getUnparsedVideoIndexByName: (name: string) => number | undefined;
}
export const useStore = create<Store>(
  (set, get): Store => ({
    unparsedVideos: [],
    setUnparsedVideos: (unparsedVideos) =>
      set({
        unparsedVideos,
      }),
    clips: [],
    setClips: (clips) => set({ clips }),
    getUnparsedVideoIndexByName: (name) =>
      get().unparsedVideos.findIndex((vid) => vid.name === name),
    updateParsingProgress: (progress) => {
      const index = get().getUnparsedVideoIndexByName(progress.video);

      if (index !== undefined) {
        const video: UnparsedVideo = {
          ...get().unparsedVideos[index],
          parsingProgress: progress.progress,
        };

        const unparsedVideos = [...get().unparsedVideos];
        unparsedVideos[index] = video;

        set({
          unparsedVideos,
        });
      }
    },
  })
);
