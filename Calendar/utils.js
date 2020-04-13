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

const getPosition = hm => {
  const position = {
    x: 0,
    y: hm.h * HOUR_HEIGHT + (hm.m * HOUR_HEIGHT) / 60,
  };
  return position;
};

const getDateIndex = (x, dateWidth) => {
  return Math.floor(x / dateWidth);
};

const getMonthDates = (year, month) => {
  const date = new Date(year, month - 1, 1);
  const days = [];
  while (date.getMonth() === month - 1) {
    days.push(new Date(date));
    date.setDate(date.getDate() + 1);
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
  while (date.getDay() !== 1) {
    date.setDate(date.getDate() - 1);
    index--;
  }
  console.log('index: ', index);
  return index;
};

const getDay = date => {
  return moment(date).format('ddd');
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
};
