const {
  existsSync,
  readdirSync,
  unlinkSync,
  renameSync,
  execS,
} = require("fs");
const { execSync } = require("child_process");
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

const { getVideoLength } = require("./helpers");
function getUnparsedVideos() {
  const unparsedVids = readdirSync(unParsedDir);
  return unparsedVids
    .filter((vid) => {
      return vid.search(/(mp4)$/) !== -1;
    })
    .map((vid) => {
      //const length = await getVideoDurationInSeconds(`${unParsedDir}/${vid}`);
      const length = getVideoLength(`${unParsedDir}/${vid}`);

      return {
        name: vid,
        path: path.join(httpUnParsedDir, vid),
        length,
      };
    });
}

module.exports = {
  getUnparsedVideos,
  getVideoLength,
  path,
  audioDir,
  videoDir,
  unParsedDir,
  parsedDir,
  rawAudioDir,
  clipsVideoDir,
};
