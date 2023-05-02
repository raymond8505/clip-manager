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
const clipsDir = `${videoDir}/clips`;

const httpRoot = "http://localhost:8080";
const httpVideoDir = `${httpRoot}/video`;
const httpUnParsedDir = `${httpVideoDir}/unparsed`;
const httpClipsDir = `${httpVideoDir}/clips`;

const { getVideoLength } = require("./helpers");
function getVideoFiles(dir) {
  return readdirSync(dir).filter((vid) => {
    return vid.search(/(mp4)$/) !== -1;
  });
}
function getUnparsedVideos() {
  return getVideoFiles(unParsedDir).map((vid) => {
    //const length = await getVideoDurationInSeconds(`${unParsedDir}/${vid}`);
    const length = getVideoLength(`${unParsedDir}/${vid}`);

    return {
      name: vid,
      path: path.join(httpUnParsedDir, vid),
      length,
    };
  });
}

function getClips() {
  return getVideoFiles(clipsDir).map((vid) => {
    const length = getVideoLength(`${clipsDir}/${vid}`);

    return { name: vid, path: path.join(httpClipsDir, vid), length };
  });
}
module.exports = {
  getUnparsedVideos,
  getVideoLength,
  getClips,
  path,
  audioDir,
  videoDir,
  unParsedDir,
  parsedDir,
  rawAudioDir,
  clipsVideoDir: clipsDir,
};
