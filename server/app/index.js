const {
  getUnparsedVideos,
  getClips,
  moveClip,
  deleteClip,
} = require("./clipper");
const parseVideo = require("./clipper/parseVideo");

let socket;
let server;

function sendMessage(action, data) {
  return socket.send(
    JSON.stringify({
      action,
      data,
    })
  );
}
function log(logMsg) {
  sendMessage("server-log", logMsg);
}
function sendUnparsedVideos() {
  const unparsedVids = getUnparsedVideos();
  sendMessage("unparsed-videos", unparsedVids);
}
/**
 * Handles all messages coming from the client. This is your entry point to your server's actual
 * functionality
 * @param rawMsg:Buffer the message data sent from the client
 * @param sender:WebSocket
 * @param server:WebSocketServer
 */
function onMessage(rawMsg) {
  console.log("message received", rawMsg.toString());

  const msg = JSON.parse(rawMsg.toString());
  const video = msg.data;
  switch (msg.action) {
    case "move-clip":
      const { clip, from, to } = msg.data;
      moveClip(clip, from, to);
      log(`${clip} move to ${to}`);
      sendUpdateVideos();
      break;
    case "delete-clip":
      deleteClip(msg.data);
      break;
    case "parse-video":
      parseVideo(video, {
        log,
        onAudioParsed: (results) => {
          log(`Finished Parsing Audio for ${video}`);
        },
        onClipsParsed: (clips) => {
          sendUpdateVideos();
        },
        onWordProgress: (progress) => {
          sendMessage("word-progress", {
            video,
            progress,
          });
        },
      });
      break;
  }
}

function sendUpdateVideos() {
  sendMessage("update-videos", {
    unparsedVideos: getUnparsedVideos(),
    clips: getClips(),
  });
}

/**
 * When the client makes a connection. Use this to initialize stuff for
 * the server app
 * @param socket:WebSocket
 * @param server:WebSocketServer
 */
function onConnection(socketIn, serverIn) {
  socket = socketIn;
  server = serverIn;

  sendUpdateVideos();
}

/**
 * Called before the socket server is initialized. Fires before the first connection
 * @param server:WebSocketServer
 * @returns a Promise that, when resolved, initializes the socket server
 */
function init(server) {
  return new Promise((resolve, reject) => {
    resolve(null);
  });
}

module.exports = {
  onMessage,
  onConnection,
  init,
  socket,
  server,
};
