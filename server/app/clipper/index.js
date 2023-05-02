const {
  existsSync,
  readdirSync,
  unlinkSync,
  renameSync,
  execS,
} = require("fs");
const { getVideoDurationInSeconds } = require("get-video-duration");
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

function getUnparsedVideos() {
  const unparsedVids = readdirSync(unParsedDir);
  return unparsedVids
    .filter((vid) => {
      return vid.search(/(mp4)$/) !== -1;
    })
    .map((vid) => {
      //const length = await getVideoDurationInSeconds(`${unParsedDir}/${vid}`);
      let length = execSync(
        `ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 "${unParsedDir}/${vid}"`
      );

      length = Number(length.toString().trim());
      return {
        name: vid,
        path: path.join(httpUnParsedDir, vid),
        length,
      };
    });
}
module.exports = {
  getUnparsedVideos,
};
