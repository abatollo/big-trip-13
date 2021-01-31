import {UserAction, UpdateType} from "../const.js";
import {RenderPosition, remove, render} from "../utils/render.js";
import PointEditView from '../view/point-edit-view.js';

export default class PointNewPresenter {
  constructor(pointListElement, changeData) {
    this._pointListElement = pointListElement;
    this._changeData = changeData;

    this._pointNewElement = null;

    this._handleFormSubmit = this._handleFormSubmit.bind(this);
    this._handleDeleteClick = this._handleDeleteClick.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback, model) {
    this._destroyCallback = callback;
    this._cities = model.getCities();
    this._types = model.getTypes();
    if (this._pointNewElement !== null) {
      return;
    }

    this._pointNewElement = new PointEditView(null, this._types, this._cities, false);
    this._pointNewElement.setFormSubmitHandler(this._handleFormSubmit);
    this._pointNewElement.setDeleteClickHandler(this._handleDeleteClick);

    render(this._pointListElement, this._pointNewElement, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointNewElement === null) {
      return;
    }

    if (this._destroyCallback !== null) {
      this._destroyCallback();
    }

    remove(this._pointNewElement);
    this._pointNewElement = null;

    document.removeEventListener(`keydown`, this._escKeyDownHandler);
  }

  setSaving() {
    this._pointNewElement.updateData({
      isDisabled: true,
      isSaving: true
    });
  }

  setAborting() {
    if (this._pointNewElement) {
      const resetFormState = () => {
        this._pointNewElement.updateData({
          isDisabled: false,
          isSaving: false,
          isDeleting: false
        });
      };
      this._pointNewElement.shake(resetFormState);
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
