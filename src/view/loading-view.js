import {AbstractView} from "./abstract-view.js";

const createLoadingTemplate = () => `<p class="board__no-tasks">Loading...</p>`;

class LoadingView extends AbstractView {
  getTemplate() {
    return createLoadingTemplate();
  }
}

export {LoadingView};
