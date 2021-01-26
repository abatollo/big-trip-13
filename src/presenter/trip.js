import TripSortView from "../view/trip-sort.js";
import PointsListView from "../view/points-list.js";
import PointPresenter from "../presenter/point.js";
import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {sortData} from "../utils/sort.js";

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointPresenter = {};

    this._sortComponent = new TripSortView(sortData);
    this._pointsListComponent = new PointsListView();

    this._handleTaskChanged = this._handleTaskChanged.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
  }

  init(points, overallOffersList) {
    this._points = points;
    this._overallOffersList = overallOffersList;

    this._renderSort();
    this._renderPointsList();
    this._renderPoints(this._points);
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListComponent, this._handleTaskChanged, this._handleModeChange);
    pointPresenter.init(point, this._overallOffersList);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _renderPoints(points) {
    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderNoPoints() {
  }

  _renderPointsList() {
    render(this._tripEventsContainer, this._pointsListComponent, RenderPosition.BEFOREEND);
  }

  _clearPointsList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => {
        presenter.destroy();
      });
  }

  _handleTaskChanged(updatedPoint) {
    this._points = updateItem(this._points, updatedPoint);
    this._pointPresenter[updatedPoint.id].init(updatedPoint, this._overallOffersList);
  }

  _handleModeChange(currentPrinter) {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => {
        if (presenter !== currentPrinter) {
          presenter.resetView();
        }
      });
  }
}
