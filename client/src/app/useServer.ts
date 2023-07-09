import { toast } from "react-toastify";
import { IClip, IVideo, useStore } from "../store";
import { useServer as useServerInner } from "../useServer";

export interface ServerMessage {
  action: string;
  data: any;
}

export enum ServerMessageAction {
  UNPARSED_VIDEOS = "unparsed-videos",
  PARSE_PROGRESS = "parse-progress",
  PARSE_VIDEO = "parse-video",
  SERVER_LOG = "server-log",
  WORD_PROGRESS = "word-progress",
  UPDATE_VIDEOS = "update-videos",
  MOVE_CLIP = "move-clip",
  DELETE_CLIP = "delete-clip",
  EMPTY_TRASH = "empty-trash",
}

export const useServer = () => {
  const {
    setVideos,
    updateParsingProgress,
    setClips,
    getNextClip,
    setCurrentClip,
  } = useStore();

  const { sendJson } = useServerInner((rawMsg) => {
    const msg: ServerMessage = JSON.parse(rawMsg.data);

    switch (msg.action) {
      case ServerMessageAction.SERVER_LOG:
        toast(msg.data);
        break;
      case ServerMessageAction.WORD_PROGRESS:
        updateParsingProgress(msg.data);
        break;
      case ServerMessageAction.UPDATE_VIDEOS:
        setVideos(msg.data.videos);
        setClips(msg.data.clips);
        break;
    }
  });

  const sendActionMessage = (action: ServerMessageAction, data: any) =>
    sendJson({
      action,
      data,
    });

  function parseVideo(video: IVideo, twitchUrl: string) {
    sendActionMessage(ServerMessageAction.PARSE_VIDEO, {
      video: video.name,
      twitchUrl,
    });
  }

  function moveClip(clip: IClip, to: IClip["type"]) {
    sendActionMessage(ServerMessageAction.MOVE_CLIP, {
      clip: clip.name,
      from: clip.type,
      to,
    });

    const nextClip = getNextClip(clip);

    if (nextClip) {
      setCurrentClip(nextClip);
    }
  }

  function deleteClip(clip: IClip) {
    sendActionMessage(ServerMessageAction.DELETE_CLIP, clip.name);
  }

  function emptyTrash(dir: "parsed" | "trash") {
    sendActionMessage(ServerMessageAction.EMPTY_TRASH, dir);
  }

  return { parseVideo, moveClip, deleteClip, emptyTrash };
};
