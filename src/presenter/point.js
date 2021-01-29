import PointView from "../view/point.js";
import PointEditView from "../view/point-edit.js";
import {render, RenderPosition, replace, remove} from "../utils/render.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export default class Point {
  constructor(pointsListContainer, changeData, changeMode) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointComponent = null;
    this._pointEditComponent = null;
    this._mode = Mode.DEFAULT;

    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, overallOffersList, overallDestinationsList) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(this._point);
    this._pointEditComponent = new PointEditView(this._point, overallOffersList, overallDestinationsList, true);

    this._pointComponent.setEditClickHandler(this._handleOpenClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditComponent.setCloseFormClickHandler(this._handleFormClose);
    this._pointEditComponent.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointComponent === null && prevPointEditComponent === null) {
      render(this._pointsListContainer, this._pointComponent, RenderPosition.BEFOREEND);

      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointComponent, prevPointComponent);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditComponent, prevPointEditComponent);
    }

    remove(prevPointComponent);
    remove(prevPointEditComponent);
  }

  destroy() {
    remove(this._pointComponent);
    remove(this._pointEditComponent);
  }

  resetView() {
    if (this._mode !== Mode.DEFAULT) {
      this._replaceFormToPoint();
    }
  }

  _handleOpenClick() {
    this._replacePointToForm();
  }

  _handleCloseClick() {
    this._replaceFormToPoint();
  }

  _handleFormSubmit(task) {
    this._changeData(task);
    this._replaceFormToPoint();
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    this._changeMode(this);
    this._mode = Mode.EDITING;
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
        Object
        .assign(
            {},
            this._point,
            {isFavorite: !this._point.isFavorite}
        ));
  }

  _handleFormClose() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
    this._pointEditComponent.removeElement();
  }

  _handleDeleteClick() {
    this._pointEditComponent.reset(this._point);
    this._replaceFormToPoint();
    this._pointEditComponent.removeElement();
  }

  _escKeyDownHandler(evt) {
    if (evt.code === `Escape` || evt.code === `Esc`) {
      evt.preventDefault();
      this._pointEditComponent.reset(this._point);
      this._replaceFormToPoint();
      this._pointEditComponent.removeElement();
    }
  }
}
