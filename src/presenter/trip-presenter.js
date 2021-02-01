import {SortType, UserAction, UpdateType, FilterType} from "../const.js";
import {render, RenderPosition, remove} from "../utils/render.js";
import {sortByPrice, sortByTime, sortByDate} from "../utils/sort.js";
import {filter} from "../utils/filter.js";
import PointPresenter, {State as PointPresenterViewState} from "./point-presenter.js";
import PointNewPresenter from "./point-new-presenter.js";
import TripSortView from "../view/trip-sort-view.js";
import PointsListView from "../view/points-list-view.js";
import NoPointsView from "../view/no-points-view.js";
import LoadingView from "../view/loading-view.js";

export default class TripPresenter {
  constructor(tripEventsContainer, dataModel, filterModel, api) {
    this._tripEventsContainer = tripEventsContainer;
    this._dataModel = dataModel;
    this._filterModel = filterModel;
    this._api = api;
    this._pointPresenter = {};
    this._currentSortType = SortType.DAY;
    this._isLoading = true;

    this._loadingElement = new LoadingView();
    this._noPointsElement = new NoPointsView();
    this._sortElement = new TripSortView();
    this._pointsListElement = new PointsListView();

    this._handleViewAction = this._handleViewAction.bind(this);
    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleModeChange = this._handleModeChange.bind(this);
    this._handleSortTypeChange = this._handleSortTypeChange.bind(this);

    this._pointNewPresenter = new PointNewPresenter(this._pointsListElement, this._handleViewAction);
  }

  init() {
    this._renderPointsList();

    this._dataModel.addObserver(this._handleModelEvent);
    this._filterModel.addObserver(this._handleModelEvent);

    this._renderTrip();
  }

  destroy() {
    this._clearTrip({resetSortType: true});

    remove(this._pointsListElement);

    this._dataModel.removeObserver(this._handleModelEvent);
    this._filterModel.removeObserver(this._handleModelEvent);
  }

  createPoint(callback) {
    this._currentSortType = SortType.DAY;
    this._filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
    this._pointNewPresenter.init(callback, this._dataModel);
  }

  _renderPointsList() {
    render(this._tripEventsContainer, this._pointsListElement, RenderPosition.BEFOREEND);
  }

  _renderTrip() {
    if (this._isLoading) {
      this._renderLoading();
      return;
    }

    const points = this._getPoints();

    if (points.length === 0) {
      this._renderNoPoints();
      return;
    }

    this._renderSort();
    this._renderPoints(points);
  }

  _renderLoading() {
    render(this._tripEventsContainer, this._loadingElement, RenderPosition.BEFOREEND);
  }

  _getPoints() {
    const filterType = this._filterModel.getFilter();
    const points = this._dataModel.getPoints().slice();
    const filtredPoints = filter[filterType](points);

    switch (this._currentSortType) {
      case SortType.TIME:
        return filtredPoints.sort(sortByTime);
      case SortType.PRICE:
        return filtredPoints.sort(sortByPrice);
    }
    return filtredPoints.sort(sortByDate);
  }

  _renderNoPoints() {
    render(this._tripEventsContainer, this._noPointsElement);
  }

  _renderSort() {
    if (this._sortElement !== null) {
      this._sortElement = null;
    }

    this._sortElement = new TripSortView(this._currentSortType);
    this._sortElement.setSortTypeChangeHandler(this._handleSortTypeChange);

    render(this._pointsListElement, this._sortElement, RenderPosition.AFTERBEGIN);
  }

  _renderPoints(points) {
    points.forEach((point) => {
      this._renderPoint(point);
    });
  }

  _renderPoint(point) {
    const pointPresenter = new PointPresenter(this._pointsListElement, this._handleViewAction, this._handleModeChange);
    pointPresenter.init(point, this._dataModel);
    this._pointPresenter[point.id] = pointPresenter;
  }

  _clearPointsList() {
    Object
      .values(this._pointPresenter)
      .forEach((presenter) => {
        presenter.destroy();
      });
  }

  _clearTrip({resetSortType = false} = {}) {
    this._pointNewPresenter.destroy();

    Object
      .values(this._pointPresenter)
      .forEach((point) => point.destroy());
    this._pointPresenter = {};

    remove(this._sortElement);
    remove(this._noPointsElement);

    if (resetSortType) {
      this._currentSortType = SortType.DAY;
    }
  }

  _handleSortTypeChange(sortType) {
    if (this._currentSortType === sortType) {
      return;
    }

    this._currentSortType = sortType;
    this._clearTrip();
    this._renderTrip();
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

  _handleViewAction(actionType, updateType, update) {
    switch (actionType) {
      case UserAction.UPDATE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.SAVING);
        this._api.updatePoint(update)
          .then((response) => {
            this._dataModel.updatePoint(updateType, response);
          })
        .catch(() => {
          this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
        });
        break;
      case UserAction.ADD_POINT:
        this._pointNewPresenter.setSaving();
        this._api.addPoint(update)
          .then((response) => {
            this._dataModel.addPoint(updateType, response);
          })
          .catch(() => {
            this._pointNewPresenter.setAborting();
          });
        break;
      case UserAction.DELETE_POINT:
        this._pointPresenter[update.id].setViewState(PointPresenterViewState.DELETING);
        this._api.deletePoint(update)
          .then(() => {
            this._dataModel.deletePoint(updateType, update);
          })
          .catch(() => {
            this._pointPresenter[update.id].setViewState(PointPresenterViewState.ABORTING);
          });
        break;
    }
  }

  _handleModelEvent(updateType, data) {
    switch (updateType) {
      case UpdateType.PATCH:
        this._pointPresenter[data.id].init(data, this._dataModel);
        break;
      case UpdateType.MINOR:
        this._clearTrip();
        this._renderTrip();
        break;
      case UpdateType.MAJOR:
        this._clearTrip({resetSortType: true});
        this._renderTrip();
        break;
      case UpdateType.INIT:
        this._isLoading = false;
        remove(this._loadingElement);
        this._clearTrip();
        this._renderTrip();
        break;
    }
  }
}
