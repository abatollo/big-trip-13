import dayjs from "dayjs";
import {getRandomInteger} from "../utils.js";

const RANDOM_TEXT_LENGTH = 5;
const MAX_DESTINATION_PICTURES_COUNT = 7;
const MAX_PRICE = 200;
const HOUR_DIFFERENCE = 300;
const MINUTE_DIFFERENCE = 250;
const PLACEHOLDER_TEXT = `Lorem ipsum dolor sit amet, consectetur adipiscing elit. Cras aliquet varius magna, non porta ligula feugiat eget. Fusce tristique felis at fermentum pharetra. Aliquam id orci ut lectus varius viverra. Nullam nunc ex, convallis sed finibus eget, sollicitudin eget ante. Phasellus eros mauris, condimentum sed nibh vitae, sodales efficitur ipsum. Sed blandit, eros vel aliquam faucibus, purus ex euismod diam, eu luctus nunc ante ut dui. Sed sed nisi sed augue convallis suscipit in sed felis. Aliquam erat volutpat. Nunc fermentum tortor ac porta dapibus. In rutrum ac purus sit amet tempus.`;
const CITIES = [
  `Amsterdam`,
  `Chamonix`,
  `Geneva`,
  `Saint Petersburg`
];
const OFFER = [
  {
    type: `taxi`,
    offers: [
      {
        title: `Upgrade to a business class`,
        price: 120
      }, {
        title: `Choose the radio station`,
        price: 60
      }
    ]
  },
  {
    type: `bus`,
    offers: [
      {
        title: `Add luggage`,
        price: 10
      }, {
        title: `Add meal`,
        price: 10
      }, {
        title: `Choose seats`,
        price: 5
      }
    ]
  },
  {
    type: `train`,
    offers: [
      {
        title: `Add luggage`,
        price: 15
      }, {
        title: `Add meal`,
        price: 5
      }, {
        title: `Choose seats`,
        price: 5
      }
    ]
  },
  {
    type: `ship`,
    offers: [
      {
        title: `Add luggage`,
        price: 20
      }, {
        title: `Add meal`,
        price: 20
      }, {
        title: `Choose seats`,
        price: 5
      }
    ]
  },
  {
    type: `transport`,
    offers: [
      {
        title: `Add luggage`,
        price: 5
      }
    ]
  },
  {
    type: `drive`,
    offers: [
      {
        title: `Tollway fee`,
        price: 20
      }
    ]
  },
  {
    type: `flight`,
    offers: [
      {
        title: `Add luggage`,
        price: 30
      }, {
        title: `Switch to comfort class`,
        price: 100
      }, {
        title: `Add meal`,
        price: 15
      }, {
        title: `Choose seats`,
        price: 5
      }, {
        title: `Travel by train`,
        price: 40
      }
    ]
  },
  {
    type: `check-in`,
    offers: [
      {
        title: `Meal`,
        price: 20
      }
    ]
  },
  {
    type: `sightseeing`,
    offers: [
      {
        title: `Tour guide`,
        price: 100
      }
    ]
  },
  {
    type: `restaurant`,
    offers: [
      {
        title: `Beverage`,
        price: 50
      }
    ]
  }
];

const generateRandomText = () => {
  const placeholderText = PLACEHOLDER_TEXT.split(`.`);
  const trimedPlaceholderText = placeholderText.map((el) => el.trim());
  const filteredTrimedPlaceholderText = trimedPlaceholderText.filter(Boolean);

  const randomLength = getRandomInteger(1, RANDOM_TEXT_LENGTH);

  const randomText = [];

  for (let i = 0; i < randomLength; i++) {
    const randomIndex = getRandomInteger(0, filteredTrimedPlaceholderText.length - 1);
    if (!randomText.includes(filteredTrimedPlaceholderText[randomIndex])) {
      randomText.push(filteredTrimedPlaceholderText[randomIndex]);
    }
  }

  return randomText.join(`. `) + `.`;
};

const generateDestinationName = () => {
  const randomIndex = getRandomInteger(0, CITIES.length - 1);

  return CITIES[randomIndex];
};

const generateDestinationPicturesSrc = () => {
  const src = `http://picsum.photos/248/152?r=${Math.random()}`;

  return src;
};

const generateDestinationPictures = () => {
  return {
    src: generateDestinationPicturesSrc(),
    description: generateRandomText()
  };
};

const generateDestination = () => {
  return {
    description: generateRandomText(),
    name: generateDestinationName(),
    pictures: new Array(MAX_DESTINATION_PICTURES_COUNT).fill().map(generateDestinationPictures)
  };
};

const generateOffer = () => OFFER[getRandomInteger(1, OFFER.length - 1)];

const generateDateFrom = () => (getRandomInteger(0, 1)) ? dayjs().subtract(getRandomInteger(1, HOUR_DIFFERENCE), `hours`).toISOString() : dayjs().add(getRandomInteger(1, HOUR_DIFFERENCE), `hours`).toISOString();

const generateDateTo = (dateFrom) => dayjs(dateFrom).add(getRandomInteger(1, MINUTE_DIFFERENCE), `minutes`).toISOString();

export const generatePoint = (item, index) => {
  const offer = generateOffer();
  const dateFromValue = generateDateFrom();

  return {
    basePrice: getRandomInteger(1, MAX_PRICE),
    dateFrom: dateFromValue,
    dateTo: generateDateTo(dateFromValue),
    destination: generateDestination(),
    id: index,
    isFavorite: Boolean(getRandomInteger(0, 1)),
    offers: (getRandomInteger(0, 1)) ? offer.offers : ``,
    type: offer.type
  };
};
