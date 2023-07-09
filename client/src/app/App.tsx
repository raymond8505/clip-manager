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
  const { videos, clips } = useStore();

  useServer();

  return (
    <>
      <ToastContainer hideProgressBar={true} theme="dark" />
      <MainWrapper>
        <PanelGroup direction="horizontal">
          <SidePanel videos={videos} clips={clips} />
          <ResizeHandle direction="horizontal" />
          <EditorPanel />
        </PanelGroup>
      </MainWrapper>
    </>
  );
};
