import dayjs from "dayjs";
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import SmartView from "./smart-view.js";

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

const createPointTypeTemplate = (allOffers) => {
  return allOffers
    .map((offer) => {
      const title = offer.type[0].toUpperCase() + offer.type.slice(1);
      return `<div class="event__type-item">
        <input id="event-type-${offer.type}-1" class="event__type-input  visually-hidden" type="radio" name="event-type" value="${offer.type}">
       <label class="event__type-label  event__type-label--${offer.type}" for="event-type-${offer.type}-1">${title}</label>
      </div>`;
    }).join(``);
};

const checkIsOfferChecked = (userOffers, availableOffer) => Boolean(userOffers.find((userOffer) => userOffer.title === availableOffer.title));

const findAvailableOffers = (type, allOffers) => allOffers.find((el) => el.type === type);

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

const createPointRollupBtnTemplate = () => `
  <button class="event__rollup-btn" type="button">
    <span class="visually-hidden">Open event</span>
  </button>
`;

const createPointDestinationOptionsTemplate = (allDestinations) => `${allDestinations.map((destination) => createPointDestinationOptionTemplate(destination)).join(``)}`;

const createPointDestinationOptionTemplate = (destination) => `<option value="${destination.name}"></option>`;

const createPointEditTemplate = (data, allOffers, allDestinations) => {
  const {
    type,
    destination,
    dateFrom,
    dateTo,
    basePrice,
    offers,
    isEditing,
    isDisabled,
    isSaving,
    isDeleting
  } = data;

  const resetButtonText = isEditing ? `Delete` : `Cancel`;
  const pointTypeTemplate = createPointTypeTemplate(allOffers);
  const pointDestinationOptionsTemplate = createPointDestinationOptionsTemplate(allDestinations);
  const pointRollupBtnTemplate = createPointRollupBtnTemplate();
  const pointAvailableOffersTemplate = createPointAvailableOffersTemplate(offers, findAvailableOffers(type, allOffers));
  const pointPhotosTemplate = createPointPhotosTemplate(destination.pictures);

  return (
    `<li class="trip-events__item">
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
                ${pointTypeTemplate}
              </fieldset>
            </div>
          </div>

          <div class="event__field-group  event__field-group--destination">
            <label class="event__label  event__type-output" for="event-destination-1">
              ${type}
            </label>
            <input class="event__input  event__input--destination" id="event-destination-1" type="text" name="event-destination" value="${destination.name}" list="destination-list-1" required>
            <datalist id="destination-list-1">
              ${pointDestinationOptionsTemplate}
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
            <input class="event__input  event__input--price" id="event-price-1" type="text" name="event-price" value="${basePrice}" required>
          </div>

          <button class="event__save-btn  btn  btn--blue" type="submit">${isSaving ? `Saving...` : `Save`}</button>
          <button class="event__reset-btn" type="reset" ${isDisabled ? `disabled` : ``}>${isDeleting ? `Deleting...` : resetButtonText}</button>
          ${isEditing ? pointRollupBtnTemplate : ``}
        </header>
        <section class="event__details">
          ${pointAvailableOffersTemplate}

          <section class="event__section  event__section--destination">
            <h3 class="event__section-title  event__section-title--destination">Destination</h3>
            <p class="event__destination-description">${destination.description}</p>

            ${pointPhotosTemplate}
          </section>
        </section>
      </form>
    </li>
  `);
};

export default class PointEditView extends SmartView {
  constructor(point, allOffers, allDestinations, isEditing) {
    super();
    if (point === null) {
      point = BLANK_POINT;
    }
    this._isEditing = isEditing !== undefined ? isEditing : true;
    this._data = PointEditView.parsePointToData(point, this._isEditing);
    this._allOffers = allOffers;
    this._allDestinations = allDestinations;
    this._datepickers = {};

    this._dateFromChangeHandler = this._dateFromChangeHandler.bind(this);
    this._dateToChangeHandler = this._dateToChangeHandler.bind(this);

    this._formSubmitHandler = this._formSubmitHandler.bind(this);
    this._closeClickHandler = this._closeClickHandler.bind(this);
    this._deleteClickHandler = this._deleteClickHandler.bind(this);
    this._priceChangeHandler = this._priceChangeHandler.bind(this);
    this._offersChangeHandler = this._offersChangeHandler.bind(this);

    this._typeChangeHandler = this._typeChangeHandler.bind(this);
    this._destinationChangeHandler = this._destinationChangeHandler.bind(this);

    this._setInnerHandlers();
    this._setDateFromDatepicker();
    this._setDateToDatepicker();
  }

  getTemplate() {
    return createPointEditTemplate(this._data, this._allOffers, this._allDestinations, this._isEditing);
  }

  reset(point) {
    this.updateData(
        PointEditView.parsePointToData(point)
    );
  }

  setFormSubmitHandler(callback) {
    this._callbacks.formSubmit = callback;
    this.getElement().addEventListener(`submit`, this._formSubmitHandler);
  }

  setCloseClickHandler(callback) {
    this._callbacks.closeClick = callback;
    if (this.getElement().querySelector(`.event__rollup-btn`)) {
      this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._closeClickHandler);
    }
  }

  setDeleteClickHandler(callback) {
    this._callbacks.deleteClick = callback;
    this.getElement().querySelector(`.event__reset-btn`).addEventListener(`click`, this._deleteClickHandler);
  }

  restoreHandlers() {
    this.setFormSubmitHandler(this._callbacks.formSubmit);
    this.setCloseClickHandler(this._callbacks.closeClick);
    this.setDeleteClickHandler(this._callbacks.deleteClick);
    this._setInnerHandlers();
    this._setDateFromDatepicker();
    this._setDateToDatepicker();
  }

  _formSubmitHandler(evt) {
    evt.preventDefault();
    this._callbacks.formSubmit(PointEditView.parseDataToPoint(this._data));
  }

  _closeClickHandler() {
    this._callbacks.closeClick();
    this.removeElement();
  }

  _deleteClickHandler() {
    this._callbacks.deleteClick(PointEditView.parseDataToPoint(this._data));
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
    const newOffers = this._allOffers.find((el) => el.type.toLowerCase() === evt.target.value).offers;
    this.updateData({
      type: evt.target.value,
      offers: newOffers,
    });
  }

  _destinationChangeHandler(evt) {
    const pointNames = this._allDestinations.reduce((accumulator, currentValue) => {
      accumulator[currentValue.name] = currentValue;
      return accumulator;
    }, {});

    const newDestination = this._allDestinations.find((destination) => destination.name === evt.target.value);

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
    if (Number.isFinite(Number(target.value))) {
      this.updateData({
        basePrice: Number(target.value)
      });
    } else {
      target.setCustomValidity(`Only numeric value allowed`);
      return;
    }
  }

  _offersChangeHandler(evt) {
    const availableOffers = findAvailableOffers(this._data.type, this._allOffers);
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
          onChange: this._dateFromChangeHandler
        }
    );
  }

  _setDateToDatepicker() {
    this._setupDatepicker(
        `dateTo`,
        `[name="event-end-time"]`,
        {
          defaultDate: this._data.dateTo,
          minDate: this._data.dateFrom,
          onChange: this._dateToChangeHandler
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
    const data = {dateFrom: userDateFrom.toISOString()};

    if (dayjs(this._data.dateTo).diff(userDateFrom) < 0) {
      data.dateTo = userDateFrom.toISOString();
    }

    this.updateData(data);
  }

  _dateToChangeHandler([userDateTo]) {
    this.updateData({
      dateTo: userDateTo.toISOString()
    }, true);
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
}
