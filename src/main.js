import {createTripInfoTemplate} from "./view/trip-info.js";
import {createTripTabsTemplate} from "./view/trip-tabs.js";
import {createTripFiltersTemplate} from "./view/trip-filters.js";

import {createTripSortTemplate} from "./view/trip-sort.js";

import {createEventsListTemplate} from "./view/events-list.js";
import {createEventsItemTemplate} from "./view/events-item.js";

import {createEventEditTemplate} from "./view/event-edit.js";

import {createEventTemplate} from "./view/event.js"

const render = (container, template, place) => {
  container.insertAdjacentHTML(place, template);
};

// Число необходимых к отрисовке точек маршрута 
const TRIP_EVENTS_AMOUNT = 3;

// Флаг, сообщающий о том, должна ли быть открыта форма создания
const isAddingNewEvent = false;

// -=-=-=-=-
// ШАПКА
// -=-=-=-=-

// Находим элементы шапки

// Находим в шапке общий контейнер, в который помещяются  
// а) контейнер с информацией о путешествии (пунктами назначения, датами и стоимостью);
// б) контейнер с контролами (вкладками и фильтрами), который уже есть в разметке;
// в) кнопка New event, которая уже есть в разметке.
const siteTripMainElement = document.querySelector(`.trip-main`);

// Находим в шапке контейнер с контролами (вкладками и фильтрами).
const siteTripControlsElement = siteTripMainElement.querySelector(`.trip-controls`);

// Находим первый невидимый заголовок, с текстом "Switch trip view", сразу за которым отрисуем вкладки (Table и Stats)
const siteTripControlsFirstHeadingElement = siteTripControlsElement.querySelector(`h2:first-of-type`);

// Находим второй невидимый заголовок, стекстом "Filter events", сразу за которым отрисуем фильтры: форму с радиокнопками (Everything, Future и Past)
const siteTripControlsLastHeadingElement = siteTripControlsElement.querySelector(`h2:last-of-type`);

// Отрисовываем элементы шапки

// Отрисовываем контейнер с информацией о путешествии (пунктами назначения, датами и стоимостью) в общий контейнер в шапке
render(siteTripMainElement, createTripInfoTemplate(), `afterbegin`);

// Отрисовываем вкладки (Table и Stats) в контейнер с контролами, расположенный в общем контейнере в шапке
render(siteTripControlsFirstHeadingElement, createTripTabsTemplate(), `afterend`);

// Отрисовываем фильтры: форму с радио-кнопками (Everything, Future и Past) — в контейнер с контролами, расположенный в общем контейнере в шапке
render(siteTripControlsLastHeadingElement, createTripFiltersTemplate(), `afterend`);

// -=-=-=-=-
// ОСНОВНОЕ СОДЕРЖИМОЕ
// -=-=-=-=-

// Находим элемент основного содержимого

// Находим в основном содержимом общий контейнер, в который помещаются 
// а) сортировка: форма с радиокнопками (Day, Event, Time, Price, Offers);
// б) список с пунктами.
const siteTripEventsElement = document.querySelector(`.trip-events`);

// Отрисовываем элементы основного содержимого

// Отрисовываем сортировку: форму с радиокнопками (Day, Event, Time, Price, Offers) — в конце основного содержимого
render(siteTripEventsElement, createTripSortTemplate(), `beforeend`);

// Отрисовываем список в конец основного содержимого
render(siteTripEventsElement, createEventsListTemplate(), `beforeend`);

// Находим список после того, как он отрисовался
const eventsList = siteTripEventsElement.querySelector(`.trip-events__list`);

// Если открывается форма создания — мы отрисовываем новый пункт в начале списка, находим его и отрисовываем в него форму создания
if (isAddingNewEvent) {
  // Отрисовываем пункт — в начале списка в основном содержимом
  render(eventsList, createEventsItemTemplate(), `afterbegin`);

  // Находим первый пункт после того, как он отрисовался
  const eventsItem = eventsList.querySelector(`.trip-events__item:first-of-type`);

  // Отрисовываем форму — в начале пункта списка
  render(eventsItem, createEventEditTemplate(), `afterbegin`);
}

for (let i = 0; i < TRIP_EVENTS_AMOUNT; i++) {
  // Отрисовываем пункт(ы) — в конце списка в основном содержимом 
  render(eventsList, createEventsItemTemplate(), `beforeend`);

  // После того, как он отрисовался, находим нужный пункт по числу необходимых к отрисовке точек маршрута 
  // (по числу + 1, потому что nth-of-type(0) ничего не найдёт), 
  // а если открытая форма создания — добавляем с этому номеру ещё единицу
  const eventsItem = eventsList.querySelector(`.trip-events__item:nth-of-type(${isAddingNewEvent ? i + 2 : i + 1})`);

  // Отрисовываем точку маршрута — в начале пункта списка
  render(eventsItem, createEventTemplate(), `afterbegin`);
}
