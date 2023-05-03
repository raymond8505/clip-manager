import styled from "@emotion/styled";
import { useStore } from "../store";
import { Panel } from "./App.styles";
import { VideoCameraOutlined } from "@ant-design/icons";

const Video = styled.video`
  width: 100%;
`;
const Wrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
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
const Empty = styled(VideoCameraOutlined)`
  opacity: 0.05;

  svg {
    width: 25vmin;
    height: 25vmin;
  }
`;
export const EditorPanel = () => {
  const { currentClip } = useStore();
  return (
    <Panel collapsible={true} order={2}>
      <Wrapper>
        {currentClip ? (
          <VideoWrapper>
            <Title>{currentClip.name}</Title>
            <Video
              controls
              autoPlay
              src={currentClip.paths.video}
              loop={true}
              // onCanPlay={(e) => {
              //   (e.target as HTMLVideoElement).play();
              // }}
            />
          </VideoWrapper>
        ) : (
          <Empty />
        )}
      </Wrapper>
    </Panel>
  );
};
