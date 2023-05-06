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
  httpParsedDir,
  httpClipsDir,
  httpClipThumbsDir,
  reviewClipsDir,
  savedClipsDir,
  trashClipsDir,
  postedClipsDir,
} = require("./paths");

const { getVideoLength, getClipThumbnail, fsThumbPath } = require("./helpers");
function getVideoFiles(dir) {
  return readdirSync(dir).filter((vid) => {
    return vid.search(/(mp4)$/) !== -1;
  });
}

function getVideos(fsDir, httpDir) {
  return getVideoFiles(fsDir).map((vid) => {
    //const length = await getVideoDurationInSeconds(`${unParsedDir}/${vid}`);
    const length = getVideoLength(`${fsDir}/${vid}`);

    return {
      name: vid,
      path: path.join(httpDir, vid),
      length,
    };
  });
}

function getUnparsedVideos() {
  return getVideos(unParsedDir, httpUnParsedDir);
}

function getParsedVideos() {
  return getVideos(parsedDir, httpParsedDir);
}

function fileToClip(file, dir) {
  const vidClip = `${dir}/${file}`;
  const length = getVideoLength(vidClip);

  const type = path.basename(dir);
  const video = `${httpClipsDir}/${type}/${file}`.replace(/\\/g, "/");
  const image = getClipThumbnail(vidClip, httpClipThumbsDir);

  return {
    name: file,
    length,
    type,
    paths: {
      video,
      image,
    },
  };
}
const filesToClips = (dir) =>
  getVideoFiles(dir).map((file) => fileToClip(file, dir));

function getClips() {
  return {
    review: filesToClips(reviewClipsDir),
    saved: filesToClips(savedClipsDir),
    trash: filesToClips(trashClipsDir),
    posted: filesToClips(postedClipsDir),
  };
}

const moveClip = (clipName, fromDir, toDir) =>
  renameSync(
    `${clipsDir}/${fromDir}/${clipName}`,
    `${clipsDir}/${toDir}/${clipName}`
  );

function deleteClip(clipName) {
  unlinkSync(`${trashClipsDir}/${clipName}`);
  unlinkSync(getClipThumbnail(clipName), fsThumbPath);
}
module.exports = {
  getUnparsedVideos,
  getParsedVideos,
  getVideoLength,
  getClips,
  moveClip,
  deleteClip,
  getVideoFiles,
  audioDir,
  videoDir,
  unParsedDir,
  parsedDir,
  rawAudioDir,
  clipsDir,
  clipThumbsDir,
  httpClipThumbsDir,
};
