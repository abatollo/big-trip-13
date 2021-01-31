import {AbstractView} from "./abstract-view.js";

const createPointsListTemplate = () => `<ul class="trip-events__list"></ul>`;

class PointsListView extends AbstractView {
  getTemplate() {
    return createPointsListTemplate();
  }
}

export {PointsListView};
