import {FilterType, UpdateType} from "../const.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";
import FiltersView from "../view/trip-filters-view.js";

export default class FiltersPresenter {
  constructor(filtersContainer, filtersModel) {
    this._filtersContainer = filtersContainer;
    this._filtersModel = filtersModel;
    this._currentFilter = null;

    this._filterElement = null;

    this._handleModelEvent = this._handleModelEvent.bind(this);
    this._handleFilterTypeChange = this._handleFilterTypeChange.bind(this);

    this._filtersModel.addObserver(this._handleModelEvent);
  }

  init() {
    this._currentFilter = this._filtersModel.getFilter();

    const filters = this._getFilters();
    const prevFilterElement = this._filterElement;

    this._filterElement = new FiltersView(filters, this._currentFilter);
    this._filterElement.setFilterTypeChangeHandler(this._handleFilterTypeChange);

    if (prevFilterElement === null) {
      render(this._filtersContainer, this._filterElement, RenderPosition.AFTEREND);
      return;
    }

    replace(this._filterElement, prevFilterElement);
    remove(prevFilterElement);
  }

  _handleModelEvent() {
    this.init();
  }

  _handleFilterTypeChange(filterType) {
    if (this._currentFilter === filterType) {
      return;
    }

    this._filtersModel.setFilter(UpdateType.MAJOR, filterType);
  }

  _getFilters() {
    return [
      {
        type: FilterType.EVERYTHING,
      },
      {
        type: FilterType.FUTURE,
      },
      {
        type: FilterType.PAST,
      }
    ];
  }
}
