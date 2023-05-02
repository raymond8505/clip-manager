import styled from "@emotion/styled";
import { useStore } from "../store";
import { Panel } from "./App.styles";

const Video = styled.video`
  width: 100%;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
  width: 100%;
  padding: 1vw;
`;
const VideoWrapper = styled.div``;
const Title = styled.h1`
  font-size: 2em;
  text-align: center;
  margin-bottom: 6px;
`;
export const EditorPanel = () => {
  const { currentClip } = useStore();
  return (
    <Panel collapsible={true} order={2}>
      <Wrapper>
        <VideoWrapper>
          <Title>{currentClip?.name}</Title>
          {currentClip && <Video controls src={currentClip.paths.video} />}
        </VideoWrapper>
      </Wrapper>
    </Panel>
  );
};
