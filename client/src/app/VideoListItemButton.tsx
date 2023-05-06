import styled from "@emotion/styled";
import { IVideo } from "../store";
import { ListItemButton } from "./App.styles";
import { secondsToHMS } from "./helpers";
import { useCallback } from "react";
import { useServer } from "./useServer";
import { toast } from "react-toastify";
import { useState } from "react";

const InnerButton = styled(ListItemButton)`
  display: flex;
  justify-content: space-between;
  position: relative;
`;

const Progress = styled.div<{ width: number }>`
  display: block;
  background-color: #b3e6b3;
  width: ${(props) => props.width}%;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  opacity: 0.2;
`;

const Length = styled.span`
  opacity: 0.5;
`;
interface Props {
  video: IVideo;
}
export const VideoListItemButton = ({ video }: Props) => {
  const { parseVideo } = useServer();
  const [parsing, setParsing] = useState(false);
  const onClick = useCallback(() => {
    toast(`Parsing started for "${video.name}"`);
    parseVideo(video);
    setParsing(true);
  }, [video]);
  return (
    <InnerButton
      onClick={onClick}
      disabled={video.parsingProgress !== undefined || parsing}
    >
      <span>{video.name}</span>
      {video.parsingProgress !== undefined && (
        <span>
          {Math.round(video.parsingProgress.perc * 100)}% "
          {video.parsingProgress.word[0].word}"
        </span>
      )}
      <Length>{secondsToHMS(video.length)}</Length>
      {video.parsingProgress && (
        <Progress
          width={video.parsingProgress ? video.parsingProgress.perc * 100 : 0}
        />
      )}
    </InnerButton>
  );
};
