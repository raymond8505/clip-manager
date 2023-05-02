import { PanelGroup } from "react-resizable-panels";
import { Panel } from "./App.styles";
import { ResizeHandle } from "./ResizeHandle";
import { UnparsedVideo } from "../store";
import { ListItemButton } from "./App.styles";
import { VideoListItemButton } from "./VideoListItemButton";
export interface SidePanelProps {
  unparsedVideos: UnparsedVideo[];
}
export const SidePanel = ({ unparsedVideos }: SidePanelProps) => {
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
        </Panel>
      </PanelGroup>
    </Panel>
  );
};
