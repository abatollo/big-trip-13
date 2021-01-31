import {PointView} from "../view/point.js";
import {PointEditView} from "../view/point-edit.js";
import {RenderPosition, render, replace, remove} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

const Mode = {
  DEFAULT: `DEFAULT`,
  EDITING: `EDITING`
};

export const State = {
  SAVING: `SAVING`,
  DELETING: `DELETING`,
  ABORTING: `ABORTING`
};

class PointPresenter {
  constructor(pointsListContainer, changeData, changeMode) {
    this._pointsListContainer = pointsListContainer;
    this._changeData = changeData;
    this._changeMode = changeMode;

    this._pointElement = null;
    this._pointEditElement = null;
    this._mode = Mode.DEFAULT;

    this._handleOpenClick = this._handleOpenClick.bind(this);
    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleCloseClick = this._handleCloseClick.bind(this);
    this._handleFavoriteClick = this._handleFavoriteClick.bind(this);
    this._handleFormClose = this._handleFormClose.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, model) {
    this._point = point;
    this._cities = model.getCities();
    this._types = model.getTypes();

    const prevPointElement = this._pointElement;
    const prevPointEditElement = this._pointEditElement;

    this._pointElement = new PointView(this._point);
    this._pointEditElement = new PointEditView(this._point, this._types, this._cities, true);

    this._pointElement.setEditClickHandler(this._handleOpenClick);
    this._pointElement.setFavoriteClickHandler(this._handleFavoriteClick);
    this._pointEditElement.setFormSubmitHandler(this._handleFormSubmit);
    this._pointEditElement.setCloseFormClickHandler(this._handleFormClose);
    this._pointEditElement.setDeleteClickHandler(this._handleDeleteClick);

    if (prevPointElement === null && prevPointEditElement === null) {
      render(this._pointsListContainer, this._pointElement, RenderPosition.BEFOREEND);

      return;
    }

    if (this._mode === Mode.DEFAULT) {
      replace(this._pointElement, prevPointElement);
    }

    if (this._mode === Mode.EDITING) {
      replace(this._pointEditElement, prevPointEditElement);
    }

    remove(prevPointElement);
    remove(prevPointEditElement);
  }

  destroy() {
    remove(this._pointElement);
    remove(this._pointEditElement);
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

  setViewState(state) {
    const resetFormState = () => {
      this._pointEditElement.updateData({
        isDisabled: false,
        isSaving: false,
        isDeleting: false
      });
    };
    if (this._pointEditElement) {
      switch (state) {
        case State.SAVING:
          this._pointEditElement.updateData({
            isDisabled: true,
            isSaving: true
          });
          break;
        case State.DELETING:
          this._pointEditElement.updateData({
            isDisabled: true,
            isDeleting: true
          });
          break;
        case State.ABORTING:
          this._pointElement.shake(resetFormState);
          this._pointEditElement.shake(resetFormState);
          break;
      }
    }
  }

  _replacePointToForm() {
    replace(this._pointEditElement, this._pointElement);
    this._changeMode(this);
    this._mode = Mode.EDITING;
    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  _replaceFormToPoint() {
    replace(this._pointElement, this._pointEditElement);
    this._mode = Mode.DEFAULT;
    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  _handleFavoriteClick() {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.MINOR,
        Object
        .assign(
            {},
            this._point,
            {isFavorite: !this._point.isFavorite}
        ));
  }

  _handleFormClose() {
    this._pointEditElement.reset(this._point);
    this._replaceFormToPoint();
    this._pointEditElement.removeElement();
  }

  _handleDeleteClick(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        point
    );
    this._replaceFormToPoint();
  }

  _escKeyDownHandler(evt) {
    if (evt.code === `Escape` || evt.code === `Esc`) {
      evt.preventDefault();
      this._pointEditElement.reset(this._point);
      this._replaceFormToPoint();
      this._pointEditElement.removeElement();
    }
  }
}

export {PointPresenter};
