export const MODULE_ID = "pf2e-usage-updater";
export const MINUTE = 60;
export const HOUR = 60 * MINUTE;
export const DAY = 24 * HOUR;
export const WEEK = 7 * HOUR;
export const MONTH = 30 * DAY;
export const YEAR = 366 * DAY;
export const UNITS = [
  { name: "day", seconds: DAY },
  { name: "hour", seconds: HOUR },
  { name: "minute", seconds: MINUTE },
  { name: "turn", seconds: 6 },
];
export const ICONS = {
  day: {
    full: "fas fa-calendar-day",
    half: "fad fa-calendar-day",
  },
  hour: {
    full: "fas fa-clock",
    half: "far fa-clock",
  },
  minute: {
    full: "fas fa-hourglass-half",
    half: "fad fa-hourglass-end",
  },
  turn: {
    full: "fas fa-stopwatch",
    half: "far fa-stopwatch",
  },
  second: {
    full: "fad fa-stopwatch",
    half: "",
  },
};

export const SPECIAL_CASE_SLUGS = ["aeon-stone-pearly-white-spindle"];
