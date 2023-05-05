import { PanelGroup } from "react-resizable-panels";
import { Panel } from "./App.styles";
import { ResizeHandle } from "./ResizeHandle";
import { IClips, UnparsedVideo } from "../store";
import { VideoListItemButton } from "./VideoListItemButton";
import { Clip } from "./Clip";
import styled from "@emotion/styled";
import { Button, Tabs } from "antd";
import { useCallback } from "react";
export interface SidePanelProps {
  unparsedVideos: UnparsedVideo[];
  clips: IClips;
}
const EmptyTrash = styled(Button)`
  float: right;
`;
const Clips = styled.ul`
  display: flex;
  flex-wrap: wrap;
  clear: both;
  /* container-type: inline-size;
  @container (min-width: 25vw) {
    li {
      width: 50%;
    }
  } */
`;
export const SidePanel = ({ unparsedVideos, clips }: SidePanelProps) => {
  const onEmptyTrashClick = useCallback(() => {
    confirm("For Reals?");
  }, []);
  return (
    <Panel collapsible={true} order={1} defaultSize={20}>
      <PanelGroup direction="vertical">
        <Panel collapsible={true} defaultSize={25} order={1}>
          <h2>Unparsed Videos</h2>
          <ul>
            {unparsedVideos.map((video, i) => {
              return (
                <li key={`${i}-${video.name}`}>
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
                    {clips?.review?.map((clip) => {
                      return (
                        <Clip
                          clip={clip}
                          key={window.btoa(JSON.stringify([clip, "review"]))}
                        />
                      );
                    })}
                  </Clips>
                ),
              },
              {
                label: "Saved",
                key: "saved",
                children: (
                  <Clips>
                    {clips?.saved?.map((clip) => {
                      return (
                        <Clip
                          clip={clip}
                          key={window.btoa(JSON.stringify([clip, "saved"]))}
                        />
                      );
                    })}
                  </Clips>
                ),
              },
              {
                label: "Posted",
                key: "posted",
                children: (
                  <Clips>
                    {clips?.posted?.map((clip) => {
                      return (
                        <Clip
                          clip={clip}
                          key={window.btoa(JSON.stringify([clip, "posted"]))}
                        />
                      );
                    })}
                  </Clips>
                ),
              },
              {
                label: "Trash",
                key: "trash",
                children: (
                  <>
                    {clips?.trash?.length > 0 && (
                      <EmptyTrash
                        title="Empty Trash (FOREVER)"
                        onClick={onEmptyTrashClick}
                      >
                        Empty Trash
                      </EmptyTrash>
                    )}
                    <Clips>
                      {clips?.trash?.map((clip, i) => {
                        return (
                          <Clip
                            clip={clip}
                            key={window.btoa(JSON.stringify([clip, "trash"]))}
                          />
                        );
                      })}
                    </Clips>
                  </>
                ),
              },
            ]}
          />
        </Panel>
      </PanelGroup>
    </Panel>
  );
};
