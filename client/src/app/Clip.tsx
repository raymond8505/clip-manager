import styled from "@emotion/styled";
import { IClip, useStore } from "../store";
import { UnstyledButton } from "./App.styles";
import {
  CheckCircleOutlined,
  CloseCircleOutlined,
  CloudUploadOutlined,
  DeleteOutlined,
  PlayCircleOutlined,
  YoutubeOutlined,
} from "@ant-design/icons";
import { useCallback, useState } from "react";
import { useServer } from "./useServer";
import { trimExtension } from "./helpers";

interface Props {
  clip: IClip;
}

const Image = styled.img`
  width: 120px;
  float: left;
  margin: 0 6px 0 0;
`;

const Wrapper = styled.li<{ current: boolean; moving: boolean }>`
  width: 100%;
  max-width: 300px;
  padding: 6px 4px 0px;
  transition: background 0.2s ease-in-out;
  font-size: 0.8em;
  background-color: ${(props) =>
    props.current ? "rgb(0 0 0 / 0.2)" : "transparent"};
  &::after {
    content: "";
    display: table;
    clear: both;
    height: 6px;
  }
  &:hover {
    background-color: rgb(0 0 0 / 0.2);
  }

  svg {
    color: white;
    width: 25px;
    height: 25px;
  }

  pointer-events: ${(props) => (props.moving ? "none" : "all")};
  opacity: ${(props) => (props.moving ? 0.1 : 1)};
`;

const ButtonWrapper = styled.div`
  padding: 6px 0;
`;

const ClipButton = styled(UnstyledButton)`
  margin-right: 6px;
`;
const PlayButton = styled(ClipButton)`
  svg {
    width: 40px;
    height: 40px;
  }
`;
const ReviewButton = styled(ClipButton)`
  svg {
    color: #790000;
  }
`;
const PostedButton = styled(ClipButton)`
  svg {
    color: #ff0000;
  }
`;
const SaveButton = styled(ClipButton)`
  svg {
    color: #007900;
  }
`;
const DeleteButton = styled(ClipButton)`
  opacity: 0.5;
`;
export function Clip({ clip }: Props) {
  const { setCurrentClip, currentClip } = useStore();
  const { moveClip, deleteClip } = useServer();
  const [moving, setMoving] = useState(false);

  const onPlayClick = useCallback(() => {
    if (moving) return;
    setCurrentClip(clip);
  }, [clip, setCurrentClip, setMoving, moving]);

  const onSaveClick = useCallback(() => {
    if (moving) return;
    setMoving(true);
    moveClip(clip, "saved");
  }, [clip, moveClip, setMoving, moving]);

  const onReviewClick = useCallback(() => {
    if (moving) return;
    setMoving(true);
    moveClip(clip, "review");
  }, [clip, moveClip, setMoving, moving]);

  const onPostedClick = useCallback(() => {
    if (moving) return;
    setMoving(true);
    moveClip(clip, "posted");
  }, [clip, moveClip, setMoving, moving]);

  const onDeleteClick = useCallback(() => {
    if (moving) return;

    if (clip.type !== "trash") {
      setMoving(true);
      moveClip(clip, "trash");
    } else if (confirm("For reals?")) {
      setMoving(true);
      deleteClip(clip);
    }
  }, [clip, moveClip, setMoving, moving]);

  return (
    <Wrapper current={clip.name === currentClip?.name} moving={moving}>
      <Image src={clip.paths.image} />
      <h3>{trimExtension(clip.name)}</h3>
      <ButtonWrapper>
        <PlayButton onClick={onPlayClick}>
          <PlayCircleOutlined />
        </PlayButton>

        {clip.type === "review" ? (
          <SaveButton title="Save clip for posting" onClick={onSaveClick}>
            <CheckCircleOutlined />
          </SaveButton>
        ) : (
          <>
            <ReviewButton title="Mark clip for review" onClick={onReviewClick}>
              <CloseCircleOutlined />
            </ReviewButton>
            <PostedButton title="Mark clip as posted" onClick={onPostedClick}>
              <YoutubeOutlined />
            </PostedButton>
          </>
        )}

        <DeleteButton
          title={
            clip.type === "trash" ? "Delete clip forever" : "Move clip to trash"
          }
          onClick={onDeleteClick}
        >
          <DeleteOutlined />
        </DeleteButton>
      </ButtonWrapper>
    </Wrapper>
  );
}
