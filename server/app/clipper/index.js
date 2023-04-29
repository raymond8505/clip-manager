const { existsSync, readdirSync, unlinkSync, renameSync } = require("fs");
const path = require("path");
const audioDir = path.join(__dirname, `../../../media/audio`);
const videoDir = path.join(__dirname, `../../../media/video`);
const unParsedDir = `${videoDir}/unparsed`;
const parsedDir = `${videoDir}/parsed`;
const rawAudioDir = `${audioDir}/raw`;
const clipsVideoDir = `${videoDir}/clips`;

const httpRoot = "http://localhost:8080";
const httpVideoDir = `${httpRoot}/video`;
const httpUnParsedDir = `${httpVideoDir}/unparsed`;

function getUnparsedVideos() {
  const unparsedVids = readdirSync(unParsedDir);

  return unparsedVids.map((vid) => ({
    name: vid,
    path: path.join(httpUnParsedDir, vid),
  }));
}
module.exports = {
  getUnparsedVideos,
};
