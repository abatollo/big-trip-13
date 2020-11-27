import {createSiteMenuTemplate} from "./view/site-menu.js";

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

const siteTripMainElement = document.querySelector(`.trip-main`);
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);
const siteTripControlsSwitchElement = siteTripControlsElement.querySelector(`h2:first-of-type`);

render(siteTripControlsSwitchElement, createSiteMenuTemplate(), `afterend`);