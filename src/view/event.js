import AbstractView from "./abstract.js";
import dayjs from "dayjs";
import {capitalizeFirstLetter} from "../utils/common.js";
const MINUTES_IN_HOUR = 60;

const createEventOfferTemplate = (offer) => `
  <li class="event__offer">
    <span class="event__offer-title">${offer.title}</span>
    &plus;&euro;&nbsp;
    <span class="event__offer-price">${offer.price}</span>
  </li>
`;

const createEventOffersTemplate = (offers) => `
  ${offers.length ? `
    <h4 class="visually-hidden">Offers:</h4>
    <ul class="event__selected-offers">
      ${offers.map((offer) => createEventOfferTemplate(offer)).join(``)}
    </ul>
    ` : ``}
`;

const getDuration = (to, from) => {
  let difference = dayjs(to).diff(from, `minutes`);

  if (difference > MINUTES_IN_HOUR) {
    difference = `${Math.floor(difference / MINUTES_IN_HOUR)}H ${difference % MINUTES_IN_HOUR}M`;
  } else if (difference % MINUTES_IN_HOUR === 0) {
    difference = `${Math.floor(difference / MINUTES_IN_HOUR)}H`;
  } else {
    difference += `M`;
  }

  return difference;
};

const createEventTemplate = (point) => {
  const {isFavorite} = point;

  const favoriteClassName = isFavorite
    ? `event__favorite-btn--active`
    : ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(point.dateFrom).format(`YYYY-MM-DD`)}">${dayjs(point.dateFrom).format(`MMM D`)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(point.type)} ${point.destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dayjs(point.dateFrom).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(point.dateFrom).format(`H:mm`)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dayjs(point.dateTo).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(point.dateTo).format(`H:mm`)}</time>
          </p>
          <p class="event__duration">${getDuration(point.dateTo, point.dateFrom)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.basePrice}</span>
        </p>
        ${createEventOffersTemplate(point.offers)}
        <button class="event__favorite-btn ${favoriteClassName}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
};

export default class Event extends AbstractView {
  constructor(point) {
    super();
    this._point = point;

    // 4. Теперь обработчик - метод класса, а не стрелочная функция.
    // Поэтому при передаче в addEventListener он теряет контекст (this),
    // а с контекстом - доступ к свойствам и методам.
    // Чтобы такого не происходило, нужно насильно
    // привязать обработчик к контексту с помощью bind
    this._editClickHandler = this._editClickHandler.bind(this);
  }

  getTemplate() {
    return createEventTemplate(this._point);
  }

  _editClickHandler(evt) {
    evt.preventDefault();
    // 3. А внутри абстрактного обработчика вызовем колбэк
    this._callbacks.editClick();
  }

  setEditClickHandler(callback) {
    // Мы могли бы сразу передать callback в addEventListener,
    // но тогда бы для удаления обработчика в будущем,
    // нам нужно было бы производить это снаружи, где-то там,
    // где мы вызывали setClickHandler, что не всегда удобно

    // 1. Поэтому колбэк мы запишем во внутреннее свойство
    this._callbacks.editClick = callback;
    // 2. В addEventListener передадим абстрактный обработчик
    this.getElement().querySelector(`.event__rollup-btn`).addEventListener(`click`, this._editClickHandler);
  }
}
