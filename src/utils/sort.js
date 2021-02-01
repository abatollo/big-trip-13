import dayjs from 'dayjs';

const getTime = (startDate, endDate) => dayjs(endDate).diff(startDate);

const sortByDate = (a, b) => dayjs(b.dateFrom).valueOf() - dayjs(a.dateFrom).valueOf();

const sortByPrice = (a, b) => b.basePrice - a.basePrice;

const sortByTime = (a, b) => getTime(b.dateFrom, b.dateTo) - getTime(a.dateFrom, a.dateTo);

export {sortByDate, sortByPrice, sortByTime};
