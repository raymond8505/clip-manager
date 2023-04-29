import { useState } from "react";
import { useWebSocket } from "react-use-websocket/dist/lib/use-websocket";
export { ReadyState } from "react-use-websocket";
export const useServer = (
  onMessage?: (event: WebSocketEventMap["message"]) => void
) => {
  const { sendMessage, readyState } = useWebSocket(`ws://localhost:1596`, {
    onMessage,
  });

  return {
    send: sendMessage,
    readyState,
  };
};
