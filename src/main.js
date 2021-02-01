import {MenuItem, FilterType, UpdateType} from "./const.js";
import {RenderPosition, render, remove} from "./utils/render.js";
import Api from "./api.js";
import DataModel from "./model/data-model.js";
import FilterModel from "./model/filter-model.js"
import TripPresenter from "./presenter/trip-presenter.js";
import FiltersPresenter from "./presenter/filters-presenter.js";
import TripTabsView from "./view/trip-tabs-view.js";
import StatisticsView from "./view/statistics-view.js";

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const tripControlsElement = document.querySelector(`.trip-controls`);
const tripControlsFirstChildElement = tripControlsElement.firstChild;
const tripControlsLastChildElement = tripControlsElement.lastChild;
const tripEventsElement = document.querySelector(`.trip-events`);

const api = new Api(END_POINT, AUTHORIZATION);

const dataModel = new DataModel();
const filterModel = new FilterModel();

const tripTabsElement = new TripTabsView();
const filtersPresenter = new FiltersPresenter(tripControlsLastChildElement, filterModel);
const tripPresenter = new TripPresenter(tripEventsElement, dataModel, filterModel, api);

const handlePointNewFormClose = () => {
  addEventElement.disabled = false;
};

let statisticsElement = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      tripPresenter.init();
      if (statisticsElement) {
        remove(statisticsElement);
      }
      tripTabsElement.getElement().querySelector(`[data-menu-type="${MenuItem.STATS}"]`).classList.remove(`trip-tabs__btn--active`);
      tripTabsElement.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsElement = new StatisticsView(dataModel.getPoints());
      render(tripEventsElement.firstChild, statisticsElement, RenderPosition.AFTEREND);
      tripTabsElement.getElement().querySelector(`[data-menu-type="${MenuItem.TABLE}"]`).classList.remove(`trip-tabs__btn--active`);
      tripTabsElement.setMenuItem(MenuItem.STATS);
      break;
  }
};

const addEventElement = document.querySelector(`.trip-main__event-add-btn`);

addEventElement.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  if (statisticsElement) {
    remove(statisticsElement);
  }
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.createPoint(handlePointNewFormClose);
  tripTabsElement.getElement().querySelector(`[data-menu-type="${MenuItem.STATS}"]`).classList.remove(`trip-tabs__btn--active`);
  tripTabsElement.setMenuItem(MenuItem.TABLE);
  addEventElement.disabled = true;
});

// tripTabsElement.setMenuClickHandler(handleSiteMenuClick);

filtersPresenter.init();
tripPresenter.init();


Promise.all([api.getValues(`/offers`), api.getPoints(), api.getValues(`/destinations`)])
  .then(([types, points, cities]) => {
    dataModel.setTypes(UpdateType.INIT, types);
    dataModel.setPoints(UpdateType.INIT, points);
    dataModel.setCities(UpdateType.INIT, cities);
  })
  .catch(() => {
    dataModel.setPoints(UpdateType.INIT, []);
    dataModel.setCities(UpdateType.INIT, []);
    dataModel.setTypes(UpdateType.INIT, []);
  })
  .finally(() => {
    tripTabsElement.setMenuClickHandler(handleSiteMenuClick);
    render(tripControlsFirstChildElement, tripTabsElement.getElement(), RenderPosition.AFTEREND);
  });
