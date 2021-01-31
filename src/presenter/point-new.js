import {PointEditView} from '../view/point-edit.js';
import {RenderPosition, remove, render} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

class PointNewPresenter {
  constructor(pointListElement, changeData) {
    this._pointListElement = pointListElement;
    this._changeData = changeData;

    this._formElement = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback, model) {
    this._destroyCallback = callback;
    this._cities = model.getCities();
    this._types = model.getTypes();
    if (this._formElement !== null) {
      return;
    }

    this._formElement = new PointEditView(null, this._types, this._cities, true);
    this._formElement.setFormSubmitHandler(this._handleFormSubmit);
    this._formElement.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListElement, this._formElement, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._formElement === null) {
      return;
    }

    remove(this._formElement);
    this._formElement = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._formElement.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    if (this._formElement) {
      const resetFormState = () => {
        this._formElement.updateData({
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        });
      };
      this._formElement.shake(resetFormState);
    }
  }

  _handleFormSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
    this.destroy();
  }

  _handleDeleteClick() {
    this.destroy();
  }

  _escKeyDownHandler(evt) {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      this.destroy();
    }
  }
}

export {PointNewPresenter};
