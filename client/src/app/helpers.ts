export function secondsToHMS(value) {
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

export const trimExtension = (path: string) => path.replace(/\.[^.]+$/, "");
