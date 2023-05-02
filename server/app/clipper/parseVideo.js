const { getClipThumbnail } = require("./helpers");
const { existsSync, unlinkSync, renameSync } = require("fs");
const { execSync } = require("child_process");
const { unParsedDir, parsedDir, rawAudioDir, clipsDir } = require("./paths");
const reader = require("./vosk-reader.js");
const { getClipsFromWords, getVideoLength } = require("./helpers");

const readAudio = async (audioToParse, duration, onWordProgress) => {
  const results = [];

  return new Promise((resolve) => {
    reader(
      audioToParse,
      (words) => {
        const result =
          words?.alternatives[words.alternatives.length - 1]?.result;
        if (result) {
          const pos = result[result.length - 1].end;
          const progress = `(${pos} / ${duration}) ${Math.round(
            (pos / duration) * 100
          )}%`;

          results.push(words);
          onWordProgress({
            pos,
            length: duration,
            perc: pos / duration,
            word: result,
          });
          //log(`${progress} "${result[result.length - 1].word}"`);
        }
      },
      () => {
        console.log();
        resolve(results);
      }
    );
  });
};

async function parseVideo(videoToParse, options) {
  const { onWordProgress, log, onAudioParsed, onClipsParsed } = options;
  const audioToParse = `${rawAudioDir}/${videoToParse}.wav`;
  const videoToParsePath = `${unParsedDir}/${videoToParse}`;

  //console.log("=== Converting Video", videoToParse, " ===");

  if (existsSync(audioToParse)) {
    unlinkSync(audioToParse);
  }

  const test = execSync(
    `ffmpeg -i "${unParsedDir}/${videoToParse}" -loglevel error -ac 1 -ar 16000 -acodec pcm_s16le "${audioToParse}"`
  );

  log(`Created ${audioToParse}`);

  const duration = getVideoLength(videoToParsePath);
  const results = await readAudio(audioToParse, duration, onWordProgress);

  onAudioParsed(results);
  //get unique clips
  const clips = getClipsFromWords(results).filter((clip, index, array) => {
    return array.findIndex((clip2) => clip2.end === clip.end) === index;
  });

  log(`found ${clips.length} clips`);

  clips.forEach((clip, i) => {
    const start = Math.max(clip.end - 20, 0);
    const end = Math.min(clip.end + 10, duration);

    const clipPath = `${clipsDir}/${videoToParse}_${i}.mp4`;

    if (existsSync(clipPath)) {
      unlinkSync(clipPath);
    }

    log(`clipping ${i + 1} / ${clips.length}`);

    execSync(
      `ffmpeg -i ${videoToParsePath}  -loglevel error -ss ${start} -to ${end} ${clipPath}`
    );

    getClipThumbnail(clipPath);
  });

  log(`moving ${videoToParse} to parsed`);
  renameSync(videoToParsePath, `${parsedDir}/${videoToParse}`);
  log("DONE!");
  onClipsParsed(clips);
}
module.exports = parseVideo;
