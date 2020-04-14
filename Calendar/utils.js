import {Dimensions} from 'react-native';
import moment from 'moment';

const MINUTE_HEIGHT = 1;
const HOUR_HEIGHT = 60 * MINUTE_HEIGHT;
const MARGIN_TOP = 50;
const HOUR_TITLE_WIDTH = 40;
const DATE_HEIGHT = 50;
const DATE_WIDTH = 100;

const {width, height} = Dimensions.get('window');

moment.locale('vi', {
  weekdaysShort: ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'],
  monthsShort: [
    'Thg 1',
    'Thg 2',
    'Thg 3',
    'Thg 4',
    'Thg 5',
    'Thg 6',
    'Thg 7',
    'Thg 8',
    'Thg 9',
    'Thg 10',
    'Thg 11',
    'Thg 12',
  ],
});

const getHour = (x, y) => {
  const hm = (y / HOUR_HEIGHT).toFixed(1);
  const h = Math.floor(hm);
  const m = Math.floor((hm - h) * 60);
  return {
    h: h,
    m: m,
  };
};

const getHourFromDate = date => {
  return {
    h: moment(date).hour(),
    m: moment(date).minute(),
  };
};

const getPosition = (date, dates, dateWidth) => {
  const index = indexOfDate(date, dates);
  const h = moment(date).hour();
  const m = moment(date).minute();
  const position = {
    x: index * dateWidth,
    y: h * HOUR_HEIGHT + (m * HOUR_HEIGHT) / 60,
  };
  return position;
};

const getDateIndex = (x, dateWidth) => {
  return Math.floor(x / dateWidth);
};

const getMonthDates = (year, month) => {
  const dateMonth = month - 1;
  let i = 1;
  const days = [];
  let date = new Date(year, dateMonth, i);
  while (date.getMonth() === dateMonth) {
    days.push(date);
    date = new Date(year, dateMonth, ++i);
  }
  return days;
};

const indexOfDate = (date, dates) => {
  const dateNow = date.getDate();
  const monthNow = date.getMonth();
  const yearNow = date.getYear();
  let i = 0;
  for (i; i < dates.length; i++) {
    if (
      dates[i].getDate() === dateNow &&
      dates[i].getMonth() === monthNow &&
      dates[i].getYear() === yearNow
    ) {
      break;
    }
  }
  return i;
};

const getMonIndex = (index, dates) => {
  const date = dates[index];
  let i = index;
  while (dates[i].getDay() !== 1) {
    i--;
  }
  return i;
};

const getDay = date => {
  return moment(date).format('ddd');
};

const getDate = (date, position) => {
  const hm = getHour(position.x, position.y);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hm.h,
    hm.m,
  );
};

export default {
  HOUR_HEIGHT,
  MARGIN_TOP,
  HOUR_TITLE_WIDTH,
  DATE_WIDTH,
  DATE_HEIGHT,
  width,
  height,
  getHourFromDate,
  getHour,
  getPosition,
  getDateIndex,
  getMonthDates,
  indexOfDate,
  getMonIndex,
  getDay,
  getDate,
};
