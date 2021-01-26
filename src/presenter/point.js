import PointView from "../view/point.js";

export default class Point {
  constructor() {

  }

  init(point) {
    this._point = point;

    this._pointComponent = new PointView(this._point);
  }
}
