import {MenuItem, FilterType, UpdateType} from "./const.js";
import {RenderPosition, render, remove} from "./utils/render.js";
import {Api} from "./api.js";
import {DataModel} from "./model/data.js";
import {FilterModel} from "./model/filter.js"
import {TripPresenter} from "./presenter/trip.js";
import {FilterPresenter} from "./presenter/filter.js";
import {TripInfoView} from "./view/trip-info.js";
import {TripTabsView} from "./view/trip-tabs.js";
import {StatisticsView} from "./view/statistics.js";

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);
const dataModel = new DataModel();
const filterModel = new FilterModel();

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);
const siteTripControlsFirstHeadingElement = siteTripControlsElement.querySelector(`h2:first-of-type`);
const siteTripControlsLastHeadingElement = siteTripControlsElement.querySelector(`h2:last-of-type`);
const tripTabsElement = new TripTabsView();

api.getPoints()
  .then((points) => {
    dataModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    dataModel.setPoints(UpdateType.INIT, []);
  })
  .finally(() => {
    tripTabsElement.setMenuClickHandler(handleSiteMenuClick);
    render(siteTripControlsFirstHeadingElement, tripTabsElement.getElement(), RenderPosition.AFTEREND);
  });

api.getValues(`/destinations`)
  .then((cities) => {
    dataModel.setCities(UpdateType.INIT, cities);
  })
  .catch(() => {
    dataModel.setCities(UpdateType.INIT, []);
  });

api.getValues(`/offers`)
  .then((types) => {
    dataModel.setTypes(UpdateType.INIT, types);
  })
  .catch(() => {
    dataModel.setTypes(UpdateType.INIT, []);
  });

render(siteTripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);

const filterPresenter = new FilterPresenter(siteTripControlsLastHeadingElement, filterModel, dataModel);
filterPresenter.init();

const siteTripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteTripEventsElement, dataModel, filterModel, api);
console.log(tripPresenter);
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripPresenter.createPoint();
});

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
      render(siteTripEventsElement.firstChild, statisticsElement, RenderPosition.AFTEREND);
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
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
  tripTabsElement.getElement().querySelector(`[data-menu-type="${MenuItem.STATS}"]`).classList.remove(`trip-tabs__btn--active`);
  tripTabsElement.setMenuItem(MenuItem.TABLE);
  addEventElement.disabled = true;
});

tripTabsElement.setMenuClickHandler(handleSiteMenuClick);
