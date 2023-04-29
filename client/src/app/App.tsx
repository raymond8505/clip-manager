import { useServer } from "../useServer";
import { PanelGroup, Panel } from "react-resizable-panels";
import { MainWrapper } from "./App.styles";
import { ResizeHandle } from "./ResizeHandle";
import { useStore } from "../store";

interface ServerMessage {
  action: string;
  data: any;
}
export const App = () => {
  const { unparsedVideos, setUnparsedVideos } = useStore();

  const { sendJson } = useServer((rawMsg) => {
    const msg: ServerMessage = JSON.parse(rawMsg.data);

    switch (msg.action) {
      case "unparsed-videos":
        setUnparsedVideos(msg.data);
    }
  });

  return (
    <MainWrapper>
      <PanelGroup direction="horizontal">
        <Panel collapsible={true} order={1} defaultSize={20}>
          <PanelGroup direction="vertical">
            <Panel collapsible={true} defaultSize={25} order={1}>
              <h2>Unparsed Videos</h2>
              {unparsedVideos.map((video) => {
                return video.name;
              })}
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel collapsible={true} order={2}>
              <h2>Parsed Clips</h2>
            </Panel>
          </PanelGroup>
        </Panel>
        <ResizeHandle direction="horizontal" />
        <Panel collapsible={true} order={2}>
          Editor
        </Panel>
      </PanelGroup>
    </MainWrapper>
  );
};
