import dayjs from 'dayjs';

const getTime = (startDate, endDate) => dayjs(endDate).diff(startDate);

export const sortByDate = (a, b) => dayjs(b.dateFrom).valueOf() - dayjs(a.dateFrom).valueOf();

export const sortByPrice = (a, b) => b.basePrice - a.basePrice;

export const sortByTime = (a, b) => getTime(b.dateFrom, b.dateTo) - getTime(a.dateFrom, a.dateTo);

