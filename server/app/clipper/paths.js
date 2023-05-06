const path = require("path");
const audioDir = path.join(__dirname, `../../../media/audio`);
const videoDir = path.join(__dirname, `../../../media/video`);
const unParsedDir = `${videoDir}/unparsed`;
const parsedDir = `${videoDir}/parsed`;
const rawAudioDir = `${audioDir}/raw`;

const clipsDir = `${videoDir}/clips`;
const clipThumbsDir = `${clipsDir}/thumbs`;
const savedClipsDir = `${clipsDir}/saved`;
const reviewClipsDir = `${clipsDir}/review`;
const trashClipsDir = `${clipsDir}/trash`;
const postedClipsDir = `${clipsDir}/posted`;

const httpRoot = "http://localhost:8080";
const httpVideoDir = `${httpRoot}/video`;
const httpUnParsedDir = `${httpVideoDir}/unparsed`;
const httpParsedDir = `${httpVideoDir}/parsed`;
const httpClipsDir = `${httpVideoDir}/clips`;
const httpClipThumbsDir = `${httpClipsDir}/thumbs`;

module.exports = {
  audioDir,
  videoDir,
  unParsedDir,
  parsedDir,
  rawAudioDir,
  clipsDir,
  clipThumbsDir,
  httpRoot,
  httpVideoDir,
  httpUnParsedDir,
  httpParsedDir,
  httpClipsDir,
  httpClipThumbsDir,
  savedClipsDir,
  reviewClipsDir,
  trashClipsDir,
  postedClipsDir,
};
