import dayjs from "dayjs";
import TripInfoView from "./view/trip-info.js";
import TabsView from "./view/trip-tabs.js";
import TripFiltersView from "./view/trip-filters.js";
import {generatePoint, OFFERS} from "./mock/trip.js";
import {render, RenderPosition} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint).sort((firstEl, secondEl) => dayjs(secondEl.dateFrom).valueOf() - dayjs(firstEl.dateFrom).valueOf());

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);
const siteTripControlsFirstHeadingElement = siteTripControlsElement.querySelector(`h2:first-of-type`);
const siteTripControlsLastHeadingElement = siteTripControlsElement.querySelector(`h2:last-of-type`);

render(siteTripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);
render(siteTripControlsFirstHeadingElement, new TabsView(), RenderPosition.AFTEREND);
render(siteTripControlsLastHeadingElement, new TripFiltersView(), RenderPosition.AFTEREND);

const siteTripEventsElement = document.querySelector(`.trip-events`);

const tripPresenter = new TripPresenter(siteTripEventsElement);
tripPresenter.init(points, OFFERS);
