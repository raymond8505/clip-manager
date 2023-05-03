const {
  existsSync,
  readdirSync,
  unlinkSync,
  renameSync,
  execS,
} = require("fs");
const path = require("path");
// const audioDir = path.join(__dirname, `../../../media/audio`);
// const videoDir = path.join(__dirname, `../../../media/video`);
// const unParsedDir = `${videoDir}/unparsed`;
// const parsedDir = `${videoDir}/parsed`;
// const rawAudioDir = `${audioDir}/raw`;
// const clipsDir = `${videoDir}/clips`;
// const clipThumbsDir = `${clipsDir}/thumbs`;

// const httpRoot = "http://localhost:8080";
// const httpVideoDir = `${httpRoot}/video`;
// const httpUnParsedDir = `${httpVideoDir}/unparsed`;
// const httpClipsDir = `${httpVideoDir}/clips`;
// const httpClipThumbsDir = `${httpClipsDir}/thumbs`;
const {
  audioDir,
  videoDir,
  unParsedDir,
  parsedDir,
  rawAudioDir,
  clipsDir,
  clipThumbsDir,
  httpUnParsedDir,
  httpClipsDir,
  httpClipThumbsDir,
  reviewClipsDir,
} = require("./paths");

const { getVideoLength, getClipThumbnail } = require("./helpers");
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
  return {
    review: getVideoFiles(reviewClipsDir).map((vid) => {
      const vidClip = `${reviewClipsDir}/${vid}`;
      const length = getVideoLength(vidClip);

      const video = `${httpClipsDir}/${vid}`.replace(/\\/g, "/");
      const image = getClipThumbnail(vidClip, httpClipThumbsDir);

      return {
        name: vid,
        length,
        paths: {
          video,
          image,
        },
      };
    }),
    saved: {},
  };
}
module.exports = {
  getUnparsedVideos,
  getVideoLength,
  getClips,
  audioDir,
  videoDir,
  unParsedDir,
  parsedDir,
  rawAudioDir,
  clipsDir,
  clipThumbsDir,
  httpClipThumbsDir,
};
