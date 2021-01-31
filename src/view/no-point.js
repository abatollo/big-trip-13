import {AbstractView} from "./abstract.js";

const createNoPointTemplate = () => `<p class="trip-events__msg">Click New Event to create your first point</p>`;

class NoPointView extends AbstractView {
  getTemplate() {
    return createNoPointTemplate();
  }
}

export {NoPointView};
