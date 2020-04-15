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

const getYearDates = year => {
  const dateMonth = 0;
  let i = 1;
  const days = [];
  let date = new Date(year, dateMonth, i);
  while (date.getFullYear() === year) {
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

const compareEvent = (eventA, eventB) => {
  const timeA = eventA.start.getTime();
  const timeB = eventB.start.getTime();

  if (timeA >= timeB) {
    return 1;
  }
  return -1;
};

const convertEvents = events => {
  events.sort(compareEvent);
  for (let i = 0; i < events.length - 1; i++) {
    let flex = 1;
    const j = i;
    let maxEnd = events[i].end.getHours() * 60 + events[i].end.getMinutes();
    while (
      i < events.length - 1 &&
      events[i].start.getDate() === events[i + 1].start.getDate() &&
      (events[i + 1].end.getHours() * 60 + events[i + 1].end.getMinutes() <=
        maxEnd ||
        events[i + 1].start.getHours() * 60 + events[i + 1].start.getMinutes() <
          events[i].end.getHours() * 60 + events[i].end.getMinutes())
    ) {
      const iEndTime =
        events[i].end.getHours() * 60 + events[i].end.getMinutes();
      const i1StartTime =
        events[i + 1].start.getHours() * 60 + events[i + 1].start.getMinutes();
      const i1EndTime =
        events[i + 1].end.getHours() * 60 + events[i + 1].end.getMinutes();

      if (i1EndTime > maxEnd) {
        maxEnd = i1EndTime;
      }

      if (iEndTime <= i1StartTime) {
        events[i].position = flex;
        events[i + 1].position = flex;
      } else {
        events[i].position = flex;
        events[i + 1].position = ++flex;
      }
      // events[i + 1].position = ++flex;

      i++;
    }
    for (j; j <= i; j++) {
      events[j].flex = flex;
    }
  }
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
  compareEvent,
  convertEvents,
  getYearDates,
};
