import { toast } from "react-toastify";
import { UnparsedVideo, useStore } from "../store";
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
}

export const useServer = () => {
  const { setUnparsedVideos, updateParsingProgress } = useStore();

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
    }
  });

  const parseVideo = (video: UnparsedVideo) => {
    sendJson({
      action: ServerMessageAction.PARSE_VIDEO,
      data: video.name,
    });
  };

  return { parseVideo };
};
