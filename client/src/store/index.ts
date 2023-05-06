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
export interface IVideo {
  name: string;
  path: string;
  type: "parsed" | "unparsed";
  length: number;
  parsingProgress?: Progress["progress"];
}

export interface IVideos {
  parsed: IVideo[];
  unparsed: IVideo[];
}

export interface IClip extends Omit<IVideo, "parsingProgress" | "path"> {
  type: "review" | "saved" | "trash" | "posted";
  paths: {
    video: string;
    image: string;
  };
}

export interface IClips {
  review: IClip[];
  saved: IClip[];
  trash: IClip[];
  posted: IClip[];
}

export interface Word {
  end: number;
  start: number;
  word: string;
}

export interface Store {
  //unparsedVideos: UnparsedVideo[];
  //setUnparsedVideos: (videos: UnparsedVideo[]) => void;
  videos: IVideos;
  setVideos: (videos: IVideos) => void;
  clips: IClips;
  setClips: (clips: IClips) => void;
  updateParsingProgress: (progress: Progress) => void;
  getUnparsedVideoIndexByName: (name: string) => number | undefined;
  currentClip: IClip | null;
  setCurrentClip: (clip: IClip) => void;
  getNextClip: (clip: IClip) => IClip | undefined;
}
export const useStore = create<Store>(
  (set, get): Store => ({
    currentClip: null,
    setCurrentClip: (clip) =>
      set({
        currentClip: clip,
      }),
    videos: {
      parsed: [],
      unparsed: [],
    },
    setVideos: (videos) => set({ videos }),
    clips: {
      review: [],
      saved: [],
      trash: [],
      posted: [],
    },
    setClips: (clips) => set({ clips }),
    getUnparsedVideoIndexByName: (name) =>
      get().videos.unparsed.findIndex((vid) => vid.name === name),
    updateParsingProgress: (progress) => {
      const index = get().getUnparsedVideoIndexByName(progress.video);

      if (index !== undefined) {
        const video: IVideo = {
          ...get().videos.unparsed[index],
          parsingProgress: progress.progress,
        };

        const unparsed = [...get().videos.unparsed];
        unparsed[index] = video;

        set({
          videos: {
            unparsed,
            parsed: [...get().videos.parsed],
          },
        });
      }
    },
    getNextClip: (clip) => {
      if (get().currentClip?.name !== clip.name) return undefined;

      const siblings = get().clips[clip.type];

      if (siblings.length - 1 > 0) {
        const clipIndex = siblings.findIndex(
          (sibling) => sibling.name === clip.name
        );

        if (clipIndex < siblings.length - 1) {
          return siblings[clipIndex + 1];
        }

        return undefined;
      }
    },
  })
);
