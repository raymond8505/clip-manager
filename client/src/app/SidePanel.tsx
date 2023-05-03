import { PanelGroup } from "react-resizable-panels";
import { Panel } from "./App.styles";
import { ResizeHandle } from "./ResizeHandle";
import { IClip as ClipType, IClips, UnparsedVideo } from "../store";
import { VideoListItemButton } from "./VideoListItemButton";
import { Clip } from "./Clip";
import styled from "@emotion/styled";
import { Tabs } from "antd";
export interface SidePanelProps {
  unparsedVideos: UnparsedVideo[];
  clips: IClips;
}
const Clips = styled.ul`
  display: flex;
  flex-wrap: wrap;
  /* container-type: inline-size;
  @container (min-width: 25vw) {
    li {
      width: 50%;
    }
  } */
`;
export const SidePanel = ({ unparsedVideos, clips }: SidePanelProps) => {
  return (
    <Panel collapsible={true} order={1} defaultSize={20}>
      <PanelGroup direction="vertical">
        <Panel collapsible={true} defaultSize={25} order={1}>
          <h2>Unparsed Videos</h2>
          <ul>
            {unparsedVideos.map((video, i) => {
              return (
                <li key={i}>
                  <VideoListItemButton video={video} />
                </li>
              );
            })}
          </ul>
        </Panel>
        <ResizeHandle direction="vertical" />
        <Panel collapsible={true} order={2}>
          <h2>Parsed Clips</h2>

          <Tabs
            items={[
              {
                label: "To Review",
                key: "review",
                children: (
                  <Clips>
                    {clips?.review?.map((clip, i) => {
                      return <Clip clip={clip} key={i} />;
                    })}
                  </Clips>
                ),
              },
              {
                label: "Saved",
                key: "saved",
                children: (
                  <Clips>
                    {clips?.saved?.map((clip, i) => {
                      return <Clip clip={clip} key={i} />;
                    })}
                  </Clips>
                ),
              },
            ]}
          />
        </Panel>
      </PanelGroup>
    </Panel>
  );
};
