import styled from "@emotion/styled";
import { IClip, useStore } from "../store";
import { UnstyledButton } from "./App.styles";
import { PlayCircleOutlined } from "@ant-design/icons";
import { useCallback } from "react";

interface Props {
  clip: IClip;
}

const Image = styled.img`
  width: 120px;
  float: left;
  margin: 0 6px 0 0;
`;

const Wrapper = styled.li<{ current: boolean }>`
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
`;

const ButtonWrapper = styled.div`
  padding: 6px 0;
`;

const PlayButton = styled(UnstyledButton)`
  color: white;

  svg {
    width: 40px;
    height: 40px;
  }
`;
export function Clip({ clip }: Props) {
  const { setCurrentClip, currentClip } = useStore();

  const onClick = useCallback(() => {
    setCurrentClip(clip);
  }, [clip]);
  return (
    <Wrapper current={clip.name === currentClip?.name}>
      <Image src={clip.paths.image} />
      <h3>{clip.name}</h3>
      <ButtonWrapper>
        <PlayButton onClick={onClick}>
          <PlayCircleOutlined />
        </PlayButton>
      </ButtonWrapper>
    </Wrapper>
  );
}
