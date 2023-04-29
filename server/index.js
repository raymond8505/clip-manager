// @ts-ignore
const WebSocket = require("ws");
const server = startServer();
/**
 * Starts the server at the given port
 * @param {Int} port the port to listen on
 * @returns WebSocketServer
 */
function startServer(port = 1596) {
  // @ts-ignore
  const server = new WebSocket.Server({
    port,
  });

  console.log(`Starting Web Socket server at port ${port}`);

  server.on("connection", (sender) => {
    console.log("client connected");

    sender.on("message", (msg) => {
      console.log(msg.toString());
    });

    sender.send("hello");
  });

  return server;
}
