import {MenuItem, UpdateType, FilterType} from "./const.js";
import {render, RenderPosition, remove} from "./utils/render.js";
import Api from "./api.js";
import DataModel from "./model/data.js";
import FilterModel from "./model/filter.js"
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import TripInfoView from "./view/trip-info.js";
import TripTabsView from "./view/trip-tabs.js";
import StatisticsComponent from "./view/statistics.js";

const AUTHORIZATION = `Basic eo0w590ik29889a`;
const END_POINT = `https://13.ecmascript.pages.academy/big-trip`;

const api = new Api(END_POINT, AUTHORIZATION);
const dataModel = new DataModel();
const filterModel = new FilterModel();

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);
const siteTripControlsFirstHeadingElement = siteTripControlsElement.querySelector(`h2:first-of-type`);
const siteTripControlsLastHeadingElement = siteTripControlsElement.querySelector(`h2:last-of-type`);
const siteMenuComponent = new TripTabsView();

api.getPoints()
  .then((points) => {
    dataModel.setPoints(UpdateType.INIT, points);
  })
  .catch(() => {
    dataModel.setPoints(UpdateType.INIT, []);
  })
  .finally(() => {
    // routeComponent = new Route(dataModel);
    // render(tripMainElem, routeComponent, RenderPosition.AFTERBEGIN);
    siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
    render(siteTripControlsFirstHeadingElement, siteMenuComponent.getElement(), RenderPosition.AFTEREND);
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
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, () => {
  tripPresenter.createPoint();
});

const handlePointNewFormClose = () => {
  newPointAdd.disabled = false;
};

let statisticsComponent = null;

const handleSiteMenuClick = (menuItem) => {
  switch (menuItem) {
    case MenuItem.TABLE:
      tripPresenter.destroy();
      tripPresenter.init();
      remove(statisticsComponent);
      siteMenuComponent.getElement().querySelector(`[data-menu-type="${MenuItem.STATS}"]`).classList.remove(`trip-tabs__btn--active`);
      siteMenuComponent.setMenuItem(MenuItem.TABLE);
      break;
    case MenuItem.STATS:
      tripPresenter.destroy();
      statisticsComponent = new StatisticsComponent(dataModel.getPoints());
      console.log(statisticsComponent);
      render(siteTripEventsElement.firstChild, statisticsComponent, RenderPosition.AFTEREND);
      siteMenuComponent.getElement().querySelector(`[data-menu-type="${MenuItem.TABLE}"]`).classList.remove(`trip-tabs__btn--active`);
      siteMenuComponent.setMenuItem(MenuItem.STATS);
      break;
  }
};

const newPointAdd = document.querySelector(`.trip-main__event-add-btn`);

newPointAdd.addEventListener(`click`, (evt) => {
  evt.preventDefault();
  remove(statisticsComponent);
  tripPresenter.destroy();
  filterModel.setFilter(UpdateType.MAJOR, FilterType.EVERYTHING);
  tripPresenter.init();
  tripPresenter.createPoint(handlePointNewFormClose);
  siteMenuComponent.getElement().querySelector(`[data-menu-type="${MenuItem.STATS}"]`).classList.remove(`trip-tabs__btn--active`);
  siteMenuComponent.setMenuItem(MenuItem.TABLE);
  newPointAdd.disabled = true;
});

siteMenuComponent.setMenuClickHandler(handleSiteMenuClick);
