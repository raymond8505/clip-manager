const { unlinkSync, basename } = require("fs");
const {
  getUnparsedVideos,
  getParsedVideos,
  getClips,
  moveClip,
  deleteClip,
  getVideoFiles,
} = require("./clipper");

const { parseVideo, setPermissions } = require("./clipper/parseVideo");
const { trashClipsDir, parsedDir, unParsedDir } = require("./clipper/paths");
const chokidar = require("chokidar");
const useJsonServer = require("./useJsonServer");

let socket;
let server;

const { createItem } = useJsonServer("clips");

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
        //todo delete the wav too
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
      const { video, twitchUrl } = msg.data;
      parseVideo(video, {
        log,
        onAudioParsed: (results) => {
          log(`Finished Parsing Audio for ${video}`);
        },
        onClipsParsed: (clips) => {
          sendUpdateVideos();
          console.log({ twitchUrl, clips });

          clips.forEach((clip, i) => {
            createItem({
              twitchUrl,
              start: clip.start,
              name: `${video}_${i}`,
            });
          });
        },
        onWordProgress: (progress) => {
          sendMessage("word-progress", {
            video,
            progress,
          });
          //console.log(progress);
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

const unparsedWatcher = chokidar.watch(unParsedDir, {
  persistent: true,
});

function onAdd(path) {
  sendUpdateVideos();
  setPermissions(path);
}

function onUnlink() {
  sendUpdateVideos();
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

  unparsedWatcher.off("add", onAdd);
  unparsedWatcher.off("unlink", onUnlink);
  unparsedWatcher.on("add", onAdd).on("unlink", onUnlink);
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
