import styled from "@emotion/styled";
import { IVideo } from "../store";
import { ListItemButton } from "./App.styles";
import { secondsToHMS, trimExtension } from "./helpers";
import { useCallback } from "react";
import { useServer } from "./useServer";
import { toast } from "react-toastify";
import { useState } from "react";
import { css } from "@emotion/react";

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
    if (video.type === "parsed") return;

    const twitchUrl = prompt("Enter Twitch URL");

    if (twitchUrl && twitchUrl !== "") {
      toast(`Parsing started for "${video.name}"`);
      parseVideo(video, twitchUrl);
      setParsing(true);
    }
  }, [video, parseVideo]);
  return (
    <InnerButton
      onClick={onClick}
      disabled={video.parsingProgress !== undefined || parsing}
      css={css`
        ${video.type === "parsed" && "cursor: auto;"}
      `}
    >
      <span>{trimExtension(video.name)}</span>
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
