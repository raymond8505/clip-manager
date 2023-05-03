const { execSync } = require("child_process");
const { basename } = require("path");
const { clipThumbsDir, httpClipThumbsDir } = require("./paths");
const { existsSync } = require("fs");

function secondsToHMS(value) {
  const sec = parseInt(value, 10); // convert value to number if it's string
  const hours = Math.floor(sec / 3600); // get hours
  const minutes = Math.floor((sec - hours * 3600) / 60); // get minutes
  const seconds = sec - hours * 3600 - minutes * 60; //  get seconds

  let hoursStr;

  if (hours === 0) {
    hoursStr = "";
  } else {
    hoursStr = (hours < 10 ? "0" + hours : hours) + ":";
  }

  const minutesStr = minutes < 10 ? "0" + minutes : minutes;
  const secondsStr = seconds < 10 ? "0" + seconds : seconds;

  return `${hoursStr}${minutesStr}:${secondsStr}`; // Return is HH : MM : SS
}
const HMSToSeconds = (hms) => {
  const hmsSplit = hms.split(":");

  return (
    parseInt(hmsSplit[0].replace(/^0/, "")) * 60 +
    parseInt(hmsSplit[1].replace(/^0/, ""))
  );
};

const hasClip = (word) => {
  return (
    word.trim() === "clip" ||
    ["quip", "equip", "claire", "a twit", "cliff", "slip"].includes(word.trim())
  );
};

const hasDelete = (word) => {
  return (
    word.trim() === "delete" ||
    ["deleted", "d lead", "di lead", "dee lead"].includes(word.trim())
  );
};

const alternativeHasClip = (alt) => {
  if (alt.result === undefined) return false;

  let ret = false;

  alt.result.forEach((res) => {
    if (hasClip(res.word)) {
      ret = true;
      return;
    }
  });

  return ret;
};

const alternativeHasDelete = (alt) => {
  if (alt.result === undefined) return false;

  let ret = false;

  alt.result.forEach((res) => {
    if (hasDelete(res.word)) {
      ret = true;
      return;
    }
  });

  return ret;
};

const getClipsFromWords = (words) => {
  const alts = [];
  const results = [];

  words.forEach((word) => {
    word.alternatives.forEach((alt) => {
      if (alternativeHasClip(alt)) {
        alts.push(alt);
      }
    });
  });

  //only return the first result in the alt matching the clip
  alts.forEach((alt) => {
    results.push(alt.result.find((result) => hasClip(result.word)));
  });

  return results;
};

const getDeletesFromWords = (words) => {
  const results = [];
  const alts = [];

  words.forEach((word) => {
    word.alternatives.forEach((alt) => {
      if (alternativeHasDelete(alt)) {
        alts.push(alt);
      }
    });
  });

  alts.forEach((alt) => {
    results.push(alt.result.find((result) => hasDelete(result.word)));
  });

  return results;
};
const getVideoLength = (path) => {
  const length = execSync(
    `ffprobe -v error -select_streams v:0 -show_entries stream=duration -of default=noprint_wrappers=1:nokey=1 "${path}"`
  );

  return Number(length.toString().trim());
};

function fsThumbPath(clipPath) {
  const videoName = basename(clipPath);
  return `${clipThumbsDir}/${videoName}.jpg`;
}

function httpThumbPath(clipPath) {
  const videoName = basename(clipPath);
  return `${httpClipThumbsDir}/${videoName}.jpg`;
}

function makeClipThumbnail(clipPath) {
  const thumbPath = fsThumbPath(clipPath);
  execSync(
    `ffmpeg -i "${clipPath}" -loglevel error -ss 00:00:01.000 -vframes 1 ${thumbPath}`
  );

  return thumbPath;
}

function getClipThumbnail(clipPath, returnBase = clipThumbsDir) {
  const clipName = basename(clipPath);
  const toRet = `${returnBase}/${clipName}.jpg`;

  if (!existsSync(fsThumbPath(clipPath))) {
    makeClipThumbnail(clipPath);
  }

  return toRet;
}
module.exports = {
  getDeletesFromWords,
  getClipsFromWords,
  hasClip,
  hasDelete,
  alternativeHasClip,
  alternativeHasDelete,
  HMSToSeconds,
  secondsToHMS,
  hasClip,
  hasDelete,
  getVideoLength,
  makeClipThumbnail,
  fsThumbPath,
  httpThumbPath,
  getClipThumbnail,
};
