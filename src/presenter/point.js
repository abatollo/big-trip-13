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
  }

  init(point, overallOffersList) {
    this._point = point;

    const prevPointComponent = this._pointComponent;
    const prevPointEditComponent = this._pointEditComponent;

    this._pointComponent = new PointView(this._point);
    this._pointEditComponent = new PointEditView(this._point, overallOffersList);

    this._pointComponent.setEditClickHandler(this._handleOpenClick);
    this._pointComponent.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditComponent.setFormSubmitHandler(this._handleFormSubmit);

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

  _handleFormSubmit(evt) {
    evt.preventDefault();
    this._replaceFormToPoint();
  }

  _replacePointToForm() {
    replace(this._pointEditComponent, this._pointComponent);
    this._changeMode(this);
    this._mode = Mode.EDITING;
  }

  _replaceFormToPoint() {
    replace(this._pointComponent, this._pointEditComponent);
    this._mode = Mode.DEFAULT;
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
}
