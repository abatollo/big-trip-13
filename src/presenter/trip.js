import TripSortView from "../view/trip-sort.js";
import PointsListView from "../view/points-list.js";
import PointPresenter from "./point.js";
import {render, RenderPosition} from "../utils/render.js";
import {updateItem} from "../utils/common.js";
import {SortType} from "../const.js";
import {sortByPrice, sortByTime, sortByDate} from "../utils/sort.js";

export default class Trip {
  constructor(tripEventsContainer) {
    this._tripEventsContainer = tripEventsContainer;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;

    this._sortComponent = new TripSortView();
    this._pointsListComponent = new PointsListView();

    this._handleTaskChanged = this._handleTaskChanged.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);
  }

  init(points, overallOffersList) {
    this._points = points.slice();
    this._sourcedPoints = points.slice();
    this._overallOffersList = overallOffersList;

    this._renderSort();
    this._renderPointsList();
    this._renderPoints(this._points);
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._sortPoints(sortType);
    this._clearPointsList();
    this._renderPoints(this._points);
  }

  _sortPoints(sortType) {
    switch (sortType) {
      case SortType.TIME:
        this._points.sort(sortByTime);
        break;
      case SortType.PRICE:
        this._points.sort(sortByPrice);
        break;
      default:
        this._points = this._sourcedPoints;
    }

    this._currentSortType = sortType;
  }

  _renderSort() {
    render(this._tripEventsContainer, this._sortComponent, RenderPosition.BEFOREEND);
    this._sortComponent.setSortTypeChangeHandler(this._handleSortTypeChange);
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
