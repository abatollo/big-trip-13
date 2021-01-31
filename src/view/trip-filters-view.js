import {AbstractView} from "./abstract-view.js";

const createFilterTemplate = (filter, currentFilterType) => `
  <div class="trip-filters__filter">
    <input id="filter-${filter}" class="trip-filters__filter-input visually-hidden" type="radio" name="trip-filter" value="${filter}" ${filter === currentFilterType ? `checked` : ``}>
    <label class="trip-filters__filter-label" for="filter-${filter}">${filter}</label>
  </div>
`;

const createFiltersTemplate = (filters, currentFilter) => (
  `<form class="trip-filters" action="#" method="get">
    ${filters.map((filter) => createFilterTemplate(filter.type, currentFilter)).join(`\n`)}
    <button class="visually-hidden" type="submit">Accept filter</button>
  </form>
`);

class FiltersView extends AbstractView {
  constructor(filters, currentFilter) {
    super();
    this._filters = filters;
    this._currentFilter = currentFilter;

    this._filterChangeHandler = this._filterChangeHandler.bind(this);
  }

  getTemplate() {
    return createFiltersTemplate(this._filters, this._currentFilter);
  }

  setFilterTypeChangeHandler(callback) {
    this._callbacks.filterChange = callback;
    this.getElement().addEventListener(`change`, this._filterChangeHandler);
  }

  _filterChangeHandler(evt) {
    evt.preventDefault();
    this._callbacks.filterChange(evt.target.value);
  }
}

export {FiltersView};
