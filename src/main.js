import dayjs from "dayjs";
import TripInfoView from "./view/trip-info.js";
import TabsView from "./view/trip-tabs.js";
import {generatePoint, OFFERS, generateDestinations} from "./mock/trip.js";
import {render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";
import FilterPresenter from "./presenter/filter.js";
import DataModel from "./model/data.js";
import FilterModel from "./model/filter.js"

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint).sort((firstEl, secondEl) => dayjs(secondEl.dateFrom).valueOf() - dayjs(firstEl.dateFrom).valueOf());
const destinations = generateDestinations();

const dataModel = new DataModel();
dataModel.setPoints(null, points);
dataModel.setCities(null, destinations);
dataModel.setTypes(null, OFFERS);

const filterModel = new FilterModel();

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);
const siteTripControlsFirstHeadingElement = siteTripControlsElement.querySelector(`h2:first-of-type`);
const siteTripControlsLastHeadingElement = siteTripControlsElement.querySelector(`h2:last-of-type`);

render(siteTripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
render(siteTripControlsFirstHeadingElement, new TabsView(), RenderPosition.AFTEREND);

const filterPresenter = new FilterPresenter(siteTripControlsLastHeadingElement, filterModel, dataModel);
filterPresenter.init();

const siteTripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteTripEventsElement, dataModel, filterModel);
tripPresenter.init();

document.querySelector(`.trip-main__event-add-btn`).addEventListener(`click`, (evt) => {
  evt.preventDefault();
  tripPresenter.createPoint();
});
