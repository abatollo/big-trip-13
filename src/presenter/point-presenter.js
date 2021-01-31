import {PointView} from "../view/point-view.js";
import {PointEditView} from "../view/point-edit-view.js";
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

    this._handleOpen = this._handleOpen.bind(this);
    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._handleFavorite = this._handleFavorite.bind(this);
    this._handleClose = this._handleClose.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(point, dataModel) {
    this._point = point;
    this._cities = dataModel.getCities();
    this._types = dataModel.getTypes();

    const prevPointElement = this._pointElement;
    const prevPointEditElement = this._pointEditElement;

    this._pointElement = new PointView(this._point);
    this._pointEditElement = new PointEditView(this._point, this._types, this._cities, true);

    this._pointElement.setFavoriteClickHandler(this._handleFavorite);
    this._pointElement.setEditClickHandler(this._handleOpen);

    this._pointEditElement.setSubmitHandler(this._handleSubmit);
    this._pointEditElement.setDeleteHandler(this._handleDelete);
    this._pointEditElement.setCloseHandler(this._handleClose);

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

  _handleFavorite() {
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

  _handleOpen() {
    this._replacePointToForm();
  }

  _handleSubmit(point) {
    this._changeData(
        UserAction.UPDATE_POINT,
        UpdateType.PATCH,
        point
    );
    this._replaceFormToPoint();
  }

  _handleDelete(point) {
    this._changeData(
        UserAction.DELETE_POINT,
        UpdateType.MINOR,
        point
    );
  }

  _handleClose() {
    this._pointEditElement.reset(this._point);
    this._replaceFormToPoint();
    this._pointEditElement.removeElement();
  }

  _escKeyDownHandler(evt) {
    if (evt.code === `Escape` || evt.code === `Esc`) {
      evt.preventDefault();
      this._pointEditElement.reset(this._point);
      this._replaceFormToPoint();
      this._pointEditElement.removeElement();
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
}

export {PointPresenter};
