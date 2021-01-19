import dayjs from "dayjs";
import {capitalizeFirstLetter} from "../utils.js";

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

export const createEventTemplate = (point) => {
  const {is_favorite: isFavorite} = point;

  const favoriteClassName = isFavorite
    ? `event__favorite-btn--active`
    : ``;

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dayjs(point.date_from).format(`YYYY-MM-DD`)}">${dayjs(point.date_from).format(`MMM D`)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${point.type}.png" alt="Event type icon">
        </div>
        <h3 class="event__title">${capitalizeFirstLetter(point.type)} ${point.destination.name}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="${dayjs(point.date_from).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(point.date_from).format(`H:mm`)}</time>
            &mdash;
            <time class="event__end-time" datetime="${dayjs(point.date_to).format(`YYYY-MM-DDTHH:mm`)}">${dayjs(point.date_to).format(`H:mm`)}</time>
          </p>
          <p class="event__duration">${dayjs(point.date_to).diff(point.date_from, `minutes`)}M</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${point.base_price}</span>
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
