import {PointEditView} from '../view/point-edit-view.js';
import {RenderPosition, remove, render} from "../utils/render.js";
import {UserAction, UpdateType} from "../const.js";

class PointNewPresenter {
  constructor(pointListElement, changeData) {
    this._pointListElement = pointListElement;
    this._changeData = changeData;

    this._pointNewElement = null;

    this._handleSubmit = this._handleSubmit.bind(this);
    this._handleDelete = this._handleDelete.bind(this);
    this._escKeyDownHandler = this._escKeyDownHandler.bind(this);
  }

  init(callback, model) {
    this._destroyCallback = callback;
    this._cities = model.getCities();
    this._types = model.getTypes();
    if (this._pointNewElement !== null) {
      return;
    }

    this._pointNewElement = new PointEditView(null, this._types, this._cities, true);
    this._pointNewElement.setSubmitHandler(this._handleSubmit);
    this._pointNewElement.setDeleteHandler(this._handleDelete);

    render(this._pointListElement, this._pointNewElement, RenderPosition.AFTERBEGIN);

    document.addEventListener(`keydown`, this._escKeyDownHandler);
  }

  destroy() {
    if (this._pointNewElement === null) {
      return;
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

  _handleSubmit(point) {
    this._changeData(
        UserAction.ADD_POINT,
        UpdateType.MINOR,
        point
    );
    this.destroy();
  }

  _handleDelete() {
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
