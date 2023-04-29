import { useServer } from "../useServer";
import { PanelGroup, Panel } from "react-resizable-panels";
import { MainWrapper } from "./App.styles";
import { ResizeHandle } from "./ResizeHandle";

export const App = () => {
  const { sendJson } = useServer((msg) => {
    console.log(msg.data);
  });

  return (
    <MainWrapper>
      <PanelGroup direction="horizontal">
        <Panel collapsible={true} order={1} defaultSize={20}>
          <PanelGroup direction="vertical">
            <Panel collapsible={true} defaultSize={25} order={1}>
              unparsed
            </Panel>
            <ResizeHandle direction="vertical" />
            <Panel collapsible={true} order={2}>
              clips
            </Panel>
          </PanelGroup>
        </Panel>
        <ResizeHandle direction="horizontal" />
        <Panel collapsible={true} order={2}>
          main
        </Panel>
      </PanelGroup>
    </MainWrapper>
  );
};
