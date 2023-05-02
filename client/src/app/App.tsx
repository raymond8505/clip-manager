import { useServer } from "./useServer";
import { PanelGroup } from "react-resizable-panels";
import { MainWrapper } from "./App.styles";
import { ResizeHandle } from "./ResizeHandle";
import { useStore } from "../store";
import { SidePanel } from "./SidePanel";
import { EditorPanel } from "./EditorPanel";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export const App = () => {
  const { unparsedVideos } = useStore();

  useServer();

  return (
    <>
      <ToastContainer />
      <MainWrapper>
        <PanelGroup direction="horizontal">
          <SidePanel unparsedVideos={unparsedVideos} />
          <ResizeHandle direction="horizontal" />
          <EditorPanel />
        </PanelGroup>
      </MainWrapper>
    </>
  );
};
