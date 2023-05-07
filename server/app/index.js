const { unlinkSync } = require("fs");
const {
  getUnparsedVideos,
  getParsedVideos,
  getClips,
  moveClip,
  deleteClip,
  getVideoFiles,
} = require("./clipper");

const parseVideo = require("./clipper/parseVideo");
const { trashClipsDir, parsedDir, unParsedDir } = require("./clipper/paths");
const chokidar = require("chokidar");

const unparsedWatcher = chokidar.watch(unParsedDir, {
  persistent: true,
});

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
      sendUpdateVideos();
      break;
    case "empty-trash":
      if (!["trash", "parsed"].includes(msg.data)) {
        log(`${msg.data} must be one of "trash" or "parsed"`);
        return;
      }

      if (msg.data === "parsed") {
        getVideoFiles(parsedDir).forEach((vid) => {
          unlinkSync(`${parsedDir}/${vid}`);
        });
      } else {
        getClips().trash.forEach((clip) => {
          deleteClip(clip.name);
        });
      }

      log(`${msg.data} emptied`);
      sendUpdateVideos();

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
          console.log(progress);
        },
      });
      break;
  }
}

function sendUpdateVideos() {
  sendMessage("update-videos", {
    videos: {
      unparsed: getUnparsedVideos(),
      parsed: getParsedVideos(),
    },
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

  unparsedWatcher
    .on("add", () => {
      sendUpdateVideos();
    })
    .on("unlink", () => {
      sendUpdateVideos();
    });
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
