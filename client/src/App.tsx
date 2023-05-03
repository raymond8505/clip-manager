import { GlobalStyles } from "./components/common/styles/GlobalStyles";
import { ConfigProvider, theme } from "antd";
import { useServer, ReadyState } from "./useServer";
import { App as InnerApp } from "./app/App";

function App() {
  const { readyState } = useServer();

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
      }}
    >
      <GlobalStyles />
      {readyState === ReadyState.OPEN && <InnerApp />}
    </ConfigProvider>
  );
}

export default App;
