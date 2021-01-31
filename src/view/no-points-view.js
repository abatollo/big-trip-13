import AbstractView from "./abstract-view.js";

const createNoPointTemplate = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`;

export default class NoPointsView extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}
