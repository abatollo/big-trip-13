import dayjs from 'dayjs';

const getTime = (startDate, endDate) => dayjs(endDate).diff(startDate);

export const sortByDate = (a, b) => {
  if (dayjs(a.dateFrom).isBefore(b.dateTo)) {
    return -1;
  }

  if (dayjs(a.dateFrom).isAfter(b.dateTo)) {
    return 1;
  }

  return 0;
};

export const sortByPrice = (a, b) => {
  if (a.basePrice < b.basePrice) {
    return 1;
  }

  if (a.basePrice > b.basePrice) {
    return -1;
  }

  return 0;
};

export const sortByTime = (a, b) => {
  const timeFirst = getTime(a.dateFrom, a.dateTo);

  const timeLast = getTime(b.dateFrom, b.dateTo);

  if (timeFirst < timeLast) {
    return 1;
  }

  if (timeFirst > timeLast) {
    return -1;
  }

  return 0;
};

