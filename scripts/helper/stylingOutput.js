import { ICONS } from "./const.js";

export function outputSymbols(largestUnit) {
  let iconOutput = "";
  if (largestUnit.count > 0) {
    iconOutput += `<i class='${ICONS[largestUnit.name].full}'></i> `.repeat(
      largestUnit?.count ?? 0
    );
    if (largestUnit.remainder > 0) {
      iconOutput += `<i class='${ICONS[largestUnit.name].half}'></i>`;
    }
  }
  return iconOutput;
}
export function outputLargestFull(largestUnit) {
  return `${largestUnit.remainder > 0 ? "< " : ""}${
    largestUnit.remainder > 0 ? largestUnit.count + 1 : largestUnit.count
  } ${largestUnit.name}${largestUnit.count !== 1 ? "s" : ""}`;
}
export function outputAllFull(result) {
  return result
    .map((r) => `${r.count} ${r.name}${r.count !== 1 ? "s" : ""}`)
    .join(" ");
}
export function outputLargestShort(largestUnit) {
  return `${largestUnit?.remainder > 0 ? "< " : ""}${
    largestUnit?.remainder > 0 ? largestUnit?.count + 1 : largestUnit?.count
  } ${largestUnit?.name.charAt(0)}`;
}
export function outputAllShort(result) {
  return result.map((r) => `${r.count}${r.name.charAt(0)}`).join(" ");
}
