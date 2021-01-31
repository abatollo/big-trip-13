import {FilterType} from "../const.js";

export const filter = {
  [FilterType.EVERYTHING]: (points) => points.slice(),
  [FilterType.FUTURE]: (points) => points.slice().filter((point) => new Date(point.dateTo) > new Date()),
  [FilterType.PAST]: (points) => points.slice().filter((point) => new Date(point.dateTo) < new Date())
};
