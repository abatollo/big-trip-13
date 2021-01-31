import dayjs from "dayjs";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import {capitalizeFirstLetter} from "../utils/common.js";
import {SmartView} from "./smart-view.js";

const BLANK_POINT = {
  "type": `flight`,
  "destination": {
    "name": ``,
    "description": ``,
    "pictures": []
  },
  "dateFrom": new Date(),
  "dateTo": new Date(),
  "basePrice": ``,
  "offers": []
};

const checkIsOfferChecked = (userOffers, availableOffer) => Boolean(userOffers.find((userOffer) => userOffer.title === availableOffer.title));

const findAvailableOffers = (type, overallOffersList) => overallOffersList.find((el) => el.type === type);

const formatAttributeValue = (offerTitle) => offerTitle.replace(/\s+/g, `-`).toLowerCase();

const createPointAvailableOfferTemplate = (userOffers, availableOffer) => `
  <div class="event__offer-selector">
    <input class="event__offer-checkbox  visually-hidden" id="event-offer-${formatAttributeValue(availableOffer.title)}-1" type="checkbox" name="event-offer-${formatAttributeValue(availableOffer.title)}" data-offer="${availableOffer.title}" ${checkIsOfferChecked(userOffers, availableOffer) ? `checked` : ``}>
    <label class="event__offer-label" for="event-offer-${formatAttributeValue(availableOffer.title)}-1">
      <span class="event__offer-title">${availableOffer.title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${availableOffer.price}</span>
    </label>
  </div>
`;

const createPointAvailableOffersTemplate = (userOffers, availableOffers) => `
  ${availableOffers.offers.length ? `
    <section class="event__section  event__section--offers">
    <h3 class="event__section-title  event__section-title--offers">Offers</h3>

    <div class="event__available-offers">
      <div class="event__available-offers">
        ${availableOffers.offers.map((availableOffer) => createPointAvailableOfferTemplate(userOffers, availableOffer)).join(``)}
      </div>
    </section>
    ` : ``}
`;

const createPointPhotoTemplate = (photo) => `<img class="event__photo" src="${photo.src}" alt="${photo.description}">`;

const createPointPhotosTemplate = (photos) => `
  ${photos.length ? `
    <div class="event__photos-container">
      <div class="event__photos-tape">
        ${photos.map((photo) => createPointPhotoTemplate(photo)).join(``)}
      </div>
    </div>
  ` : ``}
`;

const createPointRollupBtn = () => `
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
`;

const createPointDestinationOptions = (overallDestinationsList) => `${overallDestinationsList.map((destination) => createPointDestinationOption(destination)).join(``)}`;

const createPointDestinationOption = (destination) => `<option value="${destination.name}"></option>`;

const createPointEditTemplate = (data, overallOffersList, overallDestinationsList) => {
  const {type, destination, dateFrom, dateTo, basePrice, offers, isEditing} = data;

  return `
    <li class="trip-events__item">
      <form class="event event--edit" action="#" method="post">
        <header class="event__header">
          <div class="event__type-wrapper">
            <label class="event__type  event__type-btn" for="event-type-toggle-1">
              <span class="visually-hidden">Choose event type</span>
              <img class="event__type-icon" width="17" height="17" src="img/icons/${type}.png" alt="Event type icon">
            </label>
            <input class="event__type-toggle  visually-hidden" id="event-type-toggle-1" type="checkbox">

            <div class="event__type-list">
              <fieldset class="event__type-group">
                <legend class="visually-hidden">Event type</legend>

                <div class="event__type-item">
                  <input id="event-type-taxi-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="taxi">
                  <label class="event__type-label  event__type-label--taxi" for="event-type-taxi-1">Taxi</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-bus-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="bus">
                  <label class="event__type-label  event__type-label--bus" for="event-type-bus-1">Bus</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-train-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="train">
                  <label class="event__type-label  event__type-label--train" for="event-type-train-1">Train</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-ship-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="ship">
                  <label class="event__type-label  event__type-label--ship" for="event-type-ship-1">Ship</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-transport-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="transport">
                  <label class="event__type-label  event__type-label--transport" for="event-type-transport-1">Transport</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-drive-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="drive">
                  <label class="event__type-label  event__type-label--drive" for="event-type-drive-1">Drive</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-flight-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="flight" checked>
                  <label class="event__type-label  event__type-label--flight" for="event-type-flight-1">Flight</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-check-in-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="check-in">
                  <label class="event__type-label  event__type-label--check-in" for="event-type-check-in-1">Check-in</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-sightseeing-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="sightseeing">
                  <label class="event__type-label  event__type-label--sightseeing" for="event-type-sightseeing-1">Sightseeing</label>
                </div>

                <div class="event__type-item">
                  <input id="event-type-restaurant-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="restaurant">
                  <label class="event__type-label  event__type-label--restaurant" for="event-type-restaurant-1">Restaurant</label>
                </div>
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${capitalizeFirstLetter(type)}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1">
            <datalist id="destination-list-1">
              ${createPointDestinationOptions(overallDestinationsList)}
            </datalist>
          </div>

          <div class="event__field-group  event__field-group--time">
            <label class="visually-hidden" for="event-start-time-1">From</label>
            <input class="event__input  event__input--time" id="event-start-time-1" type="text" name="event-start-time" value="${dayjs(dateFrom).format(`DD/MM/YY H:mm`)}">
            &mdash;
            <label class="visually-hidden" for="event-end-time-1">To</label>
            <input class="event__input  event__input--time" id="event-end-time-1" type="text" name="event-end-time" value="${dayjs(dateTo).format(`DD/MM/YY H:mm`)}">
          </div>

          <div class="event__field-group  event__field-group--price">
            <label class="event__label" for="event-price-1">
              <span class="visually-hidden">Price</span>
              &euro;
            </label>
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}">
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">Save</button>
          <button class="event__reset-btn" type="reset">Cancel</button>
          ${isEditing ? createPointRollupBtn() : ``}
        </header>
        <section class="event__details">
          ${createPointAvailableOffersTemplate(offers, findAvailableOffers(type, overallOffersList))}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>

            ${createPointPhotosTemplate(destination.pictures)}
          </section>
        </section>
      </form>
    </li>
  `;
};

class PointEditView extends SmartView {
  constructor(point, overallOffersList, overallDestinationsList, isEditing) {
    super();
    if (point === null) {
      point = BLANK_POINT;
    }
    this._data = PointEditView.parsePointToData(point, isEditing);
    this._overallOffersList = overallOffersList;
    this._overallDestinationsList = overallDestinationsList;
    this._datepickers = {};

    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._formSubmitHandler = this._submitHandler.bind(this);
    this._formCloseClickHandler = this._closeHandler.bind(this);
    this._formDeleteClickHandler = this._deleteHandler.bind(this);
    this._inputPriceHandler = this._priceChangeHandler.bind(this);
    this._selectOffersHandler = this._offersChangeHandler.bind(this);

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDateFromDatepicker();
    this._setDateToDatepicker();
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._overallOffersList, this._overallDestinationsList);
  }

  reset(data) {
    this.updateData(
        PointEditView.parseDataToPoint(data)
    );
  }

  setSubmitHandler(callback) {
    this._callbacks.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._submitHandler);
  }

  setCloseHandler(callback) {
    this._callbacks.formClick = callback;
    if (this.getElement().querySelector(`.event__rollup-btn`)) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeHandler);
    }
  }

  setDeleteHandler(callback) {
    this._callbacks.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteHandler);
  }

  restoreHandlers() {
    this.setDeleteHandler(this._callbacks.deleteClick);
    this.setSubmitHandler(this._callbacks.formSubmit);
    this.setCloseHandler(this._callbacks.formClick);
    this._setInnerHandlers();
    this._setDateFromDatepicker();
    this._setDateToDatepicker();
  }

  static parsePointToData(point, isEditing) {
    return Object.assign(
        {},
        point,
        {
          isEditing,
          isSaving: false,
          isDeleting: false,
          isDisabled: false
        }
    );
  }

  static parseDataToPoint(data) {
    delete data.isEditing;
    delete data.isSaving;
    delete data.isDeleting;
    delete data.isDisabled;
    return Object.assign(
        {},
        data
    );
  }

  _submitHandler(evt) {
    evt.preventDefault();

    this._callbacks.formSubmit(PointEditView.parsePointToData(this._data, this._data.isEditing));
  }

  _closeHandler() {
    this._callbacks.formClick();
    this.removeElement();
  }

  _deleteHandler() {
    this._callbacks.deleteClick(PointEditView.parseDataToPoint(this._data));
    this.removeElement();
  }

  _setInnerHandlers() {
    this.getElement()
      .querySelector(`.event__type-group`)
      .addEventListener(`change`, this._typeChangeHandler);

    this.getElement()
      .querySelector(`#event-destination-1`)
      .addEventListener(`change`, this._destinationChangeHandler);

    this.getElement()
      .querySelector(`.event__input--price`)
      .addEventListener(`change`, this._priceChangeHandler);

    if (this.getElement().querySelector(`.event__details`)) {
      this.getElement()
        .querySelector(`.event__details`)
        .addEventListener(`change`, this._offersChangeHandler);
    }
  }

  _typeChangeHandler(evt) {
    const newOffers = this._overallOffersList.find((elem) => elem.type.toLowerCase() === evt.target.value).offers;
    this.updateData({
      type: evt.target.value,
      offers: newOffers,
    });
  }

  _destinationChangeHandler(evt) {
    const pointNames = this._overallDestinationsList.reduce((accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue;
      return accumulator;
    }, {});

    const newDestination = this._overallDestinationsList.find((destination) => destination.name === evt.target.value);

    if (newDestination) {
      this.updateData({
        destination: newDestination
      });
    } else {
      evt.target.setCustomValidity(`Enter the value from the list, ${Object.keys(pointNames)}`);
      return;
    }
  }

  _priceChangeHandler({target}) {
    if (Number.isFinite(+target.value)) {
      this.updateData({
        basePrice: +target.value
      });
    } else {
      target.setCustomValidity(`Only numeric value allowed`);
      return;
    }
  }

  _offersChangeHandler(evt) {
    const availableOffers = findAvailableOffers(this._data.type, this._overallOffersList);
    const newOffer = availableOffers.offers.find((el) => el.title === evt.target.dataset.offer);
    if (evt.target.checked) {
      this._data.offers.push(newOffer);
    } else {
      const index = this._data.offers.indexOf(newOffer);
      this._data.offers.splice(index, 1);
    }
  }

  _setDateFromDatepicker() {
    this._setupDatepicker(
        `dateFrom`,
        `[name="event-start-time"]`,
        {
          defaultDate: this._data.dateFrom,
          minDate: this._data.dateFrom,
          onChange: this._dateToChangeHandler
        }
    );
  }

  _setDateToDatepicker() {
    this._setupDatepicker(
        `dateTo`,
        `[name="event-end-time"]`,
        {
          defaultDate: this._data.dateTo,
          onChange: this._dateFromChangeHandler
        }
    );
  }

  _setupDatepicker(name, selector, additionalConfig) {
    if (this._datepickers[name]) {
      this._datepickers[name].destroy();
    }

    const defaults = {
      enableTime: true,
      dateFormat: `d/m/Y H:i`
    };

    const flatpickrConfig = Object.assign({},
        defaults,
        additionalConfig
    );

    this._datepickers[name] = flatpickr(this.getElement().querySelector(selector), flatpickrConfig);
  }

  _dateFromChangeHandler([userDateFrom]) {
    this.updateData({
      dateFrom: userDateFrom
    }, true);
  }

  _dateToChangeHandler([userDateTo]) {
    this.updateData({
      dateTo: userDateTo
    }, true);
  }
}

export {PointEditView};
