import { MODULE_ID, UNITS } from "./helper/const.js";
import {
  outputAllFull,
  outputAllShort,
  outputLargestFull,
  outputLargestShort,
  outputSymbols,
} from "./helper/stylingOutput.js";

export function showCooldownsOnSheet(actionsList, a) {
  const items = a?.items?.contents.filter((i) => {
    const cd = i.getFlag(MODULE_ID, "cooldown");
    return !!cd && !["round", "turn"].includes(cd?.per);
  });
  const currentTime = game.time.worldTime;
  if (items) {
    const format = game.settings.get(MODULE_ID, "inventory.icon.style");
    for (const item of items) {
      const id = `[data-item-id="${item.id}"]`;
      const cooldown = item.getFlag(MODULE_ID, "cooldown")?.cooldown;
      const timeRemainingInSeconds =
        typeof cooldown === "string" ? cooldown : cooldown - currentTime;
      const timeFormat = formatTime(timeRemainingInSeconds, format);
      const actionItem = $(actionsList).find($("li")).filter($(id));

      $(actionItem)
        .find("h4.name")
        .append(
          $(
            `<i class="fas fa-hourglass-start" data-tooltip-direction="UP" data-tooltip="${timeFormat}"></i>`
          )
        );
    }
  }
}
function formatTime(seconds, format = "symbols") {
  let result = [];
  let largestUnit = { name: "day", count: 0, remainder: 0 }; //Default Value
  if (typeof seconds === "string") {
    switch (seconds) {
      case "day":
        largestUnit = { name: "day", count: 1, remainder: 0 };
        break;
      case "turn":
      case "round":
        largestUnit = { name: "turn", count: 1, remainder: 0 };
        break;
    }
    result.push(largestUnit);
  } else {
    for (let unit of UNITS) {
      const count = Math.floor(seconds / unit.seconds);
      if (count > 0) {
        result.push({
          name: unit.name,
          count: count,
          remainder: seconds % unit.seconds,
        });
        if (!largestUnit.count)
          largestUnit = {
            name: unit.name,
            count: count,
            remainder: seconds % unit.seconds,
          };
        seconds %= unit.seconds;
      }
    }
  }

  switch (format) {
    case "disabled":
      return "";
    case "all-short":
      return outputAllShort(result);
    case "largest-short":
      return outputLargestShort(largestUnit);
    case "all-full":
      return outputAllFull(result);
    case "largest-full":
      return outputLargestFull(largestUnit);
    case "symbols":
      return outputSymbols(largestUnit);
    default:
      return "Invalid format";
  }
}
