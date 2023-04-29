import { useEffect, useState } from "react";
import { useServer } from "../useServer";

export const App = () => {
  const { sendJson } = useServer((msg) => {
    setServerResponse(msg.data);
  });

  const [serverResponse, setServerResponse] = useState();

  useEffect(() => {
    sendJson({
      action: "greeting",
      data: "hello",
    });
  }, []);
  return <h1>{serverResponse}</h1>;
};
