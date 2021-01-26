import dayjs from "dayjs";
import TripInfoView from "./view/trip-info.js";
import TabsView from "./view/trip-tabs.js";
import TripFiltersView from "./view/trip-filters.js";
import TripSortView from "./view/trip-sort.js";
import PointsListView from "./view/points-list.js";
import PointEditView from "./view/point-edit.js";
import PointView from "./view/point.js";
import NoPointView from "./view/no-point.js";
import {generatePoint, OFFERS} from "./mock/trip.js";
import {render, RenderPosition, replace, remove} from "./utils/render.js";
import TripPresenter from "./presenter/trip.js";

const POINT_COUNT = 20;
const points = new Array(POINT_COUNT).fill().map(generatePoint).sort((firstEl, secondEl) => dayjs(secondEl.dateFrom).valueOf() - dayjs(firstEl.dateFrom).valueOf());

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
render(siteTripMainElement, new TripInfoView(), RenderPosition.AFTERBEGIN);

// Отрисовываем вкладки (Table и Stats) в контейнер с контролами, расположенный в общем контейнере в шапке
render(siteTripControlsFirstHeadingElement, new TabsView(), RenderPosition.AFTEREND);

// Отрисовываем фильтры: форму с радио-кнопками (Everything, Future и Past) — в контейнер с контролами, расположенный в общем контейнере в шапке
render(siteTripControlsLastHeadingElement, new TripFiltersView(), RenderPosition.AFTEREND);

// -=-=-=-=-
// ОСНОВНОЕ СОДЕРЖИМОЕ
// -=-=-=-=-

// Находим элемент основного содержимого

// Находим в основном содержимом общий контейнер, в который помещаются 
// а) сортировка: форма с радиокнопками (Day, Event, Time, Price, Offers);
// б) список с пунктами.
const siteTripEventsElement = document.querySelector(`.trip-events`);

// Отрисовываем элементы основного содержимого

const TripTask = (eventsListElement, point, overallOffersList) => {
  const eventComponent = new PointView(point);
  const eventEditComponent = new PointEditView(point, overallOffersList);

  const replaceEventToForm = () => {
    replace(eventEditComponent, eventComponent);
  };

  const replaceFormToEvent = () => {
    replace(eventComponent, eventEditComponent);
  };

  const onEscKeyDown = (evt) => {
    if (evt.key === `Escape` || evt.key === `Esc`) {
      evt.preventDefault();
      replaceFormToEvent();
      document.removeEventListener(`keydown`, onEscKeyDown);
    }
  };

  eventComponent.setEditClickHandler(() => {
    replaceEventToForm();
    document.addEventListener(`keydown`, onEscKeyDown);
  });

  eventEditComponent.setFormSubmitHandler(() => {
    replaceFormToEvent();
    document.removeEventListener(`keydown`, onEscKeyDown);
  });

  render(eventsListElement, eventComponent, RenderPosition.BEFOREEND);
};

if (points.length === 0) {
  render(siteTripEventsElement, new NoPointView(), RenderPosition.BEFOREEND);
} else {
  // Отрисовываем сортировку: форму с радиокнопками (Day, Event, Time, Price, Offers) — в конце основного содержимого
  render(siteTripEventsElement, new TripSortView(), RenderPosition.BEFOREEND);

  // Отрисовываем список в конец основного содержимого
  render(siteTripEventsElement, new PointsListView(), RenderPosition.BEFOREEND);

  // Находим список после того, как он отрисовался
  const eventsListComponent = siteTripEventsElement.querySelector(`.trip-events__list`);

  for (let i = 0; i < points.length; i++) {
    // Отрисовываем пункт(ы) — в конце списка в основном содержимом 
    TripTask(eventsListComponent, points[i], OFFERS);
  }
}

const tripPresenter = new TripPresenter(points);
tripPresenter.init(points);
