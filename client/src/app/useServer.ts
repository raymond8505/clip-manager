import { toast } from "react-toastify";
import { IClip, UnparsedVideo, useStore } from "../store";
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
}

export const useServer = () => {
  const { setUnparsedVideos, updateParsingProgress, setClips } = useStore();

  const { sendJson } = useServerInner((rawMsg) => {
    const msg: ServerMessage = JSON.parse(rawMsg.data);

    switch (msg.action) {
      case ServerMessageAction.UNPARSED_VIDEOS:
        console.log(msg.data);
        setUnparsedVideos(msg.data);
        break;
      case ServerMessageAction.SERVER_LOG:
        toast(msg.data);
        break;
      case ServerMessageAction.WORD_PROGRESS:
        updateParsingProgress(msg.data);
        break;
      case ServerMessageAction.UPDATE_VIDEOS:
        setUnparsedVideos(msg.data.unparsedVideos);
        setClips(msg.data.clips);
        break;
    }
  });

  const sendActionMessage = (action: ServerMessageAction, data: any) =>
    sendJson({
      action,
      data,
    });

  function parseVideo(video: UnparsedVideo) {
    sendActionMessage(ServerMessageAction.PARSE_VIDEO, video.name);
  }

  function moveClip(clip: IClip, to: IClip["type"]) {
    sendActionMessage(ServerMessageAction.MOVE_CLIP, {
      clip: clip.name,
      from: clip.type,
      to,
    });
  }

  function deleteClip(clip: IClip) {
    sendActionMessage(ServerMessageAction.DELETE_CLIP, clip.name);
  }

  return { parseVideo, moveClip, deleteClip };
};
