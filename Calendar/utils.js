import {Dimensions} from 'react-native';
import moment from 'moment';

const MINUTE_HEIGHT = 1;
const HOUR_HEIGHT = 60 * MINUTE_HEIGHT;
const MARGIN_TOP = 50;
const HOUR_TITLE_WIDTH = 40;
const DATE_HEIGHT = 50;
const DATE_WIDTH = 100;
const HEADER_EVENT_HEIGHT = 30;
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

const get3YearDates = year => {
  const days = [];
  let date = new Date(year - 1, 0, 1);
  while (date.getFullYear() >= year - 1 && date.getFullYear() <= year + 1) {
    days.push(date);
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 1);
  }
  return days;
};

const addYearTo = (year, dates) => {
  let date = new Date(year + 1, 0, 1 - 1);
  while (date.getFullYear() === year) {
    dates.unshift(date);
    date = new Date(year, date.getMonth(), date.getDate() - 1);
  }
};

const addNextYearTo = (year, dates) => {
  const dateMonth = 0;
  let i = 1;
  let date = new Date(year, dateMonth, i);
  while (date.getFullYear() === year) {
    dates.push(date);
    date = new Date(year, dateMonth, ++i);
  }
};

const getYearMonths = year => {
  const result = [];

  for (let i = 0; i < 12; i++) {
    const month = [];
    let date = new Date(year, i, 1);
    const j = 1;
    while (date.getMonth() === i) {
      month.push(new Date(year, i, j++));
      date = new Date(year, i, j);
    }
    result.push(month);
  }
  return result;
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
  let i = index;
  while (dates[i].getDay() !== 1) {
    i--;
  }
  return i;
};

const getAfterMonIndex = (index, dates) => {
  let i = index;
  while (dates[i].getDay() !== 1) {
    i++;
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

const compareHeaderEvent = (eventA, eventB) => {
  if (eventA.start.getDay() >= eventB.start.getDay()) {
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

const convertHeaderEvents = events => {
  if (events.length <= 0) return 0;
  events.sort(compareHeaderEvent);
  let maxPosition = 1;
  for (let i = 0; i < events.length - 1; i++) {
    const maxEnd = events[i].end.getMonth() * 31 + events[i].end.getDate();
    while (
      i < events.length - 1 &&
      (events[i].end.getMonth() * 31 + events[i].end.getDate() >
        events[i + 1].start.getMonth() * 31 + events[i + 1].start.getDate() ||
        events[i + 1].start.getMonth() * 31 + events[i + 1].start.getDate() <=
          maxEnd)
    ) {
      if (
        events[i + 1].end.getMonth() * 31 + events[i + 1].end.getDate() >
        maxEnd
      ) {
        maxEnd =
          events[i + 1].end.getMonth() * 31 + events[i + 1].end.getDate();
      }

      if (
        events[i].end.getMonth() * 31 + events[i].end.getDate() >
        events[i + 1].start.getMonth() * 31 + events[i + 1].start.getDate() - 1
      ) {
        events[i + 1].position = events[i].position + 1;
        maxPosition =
          events[i + 1].position > maxPosition
            ? events[i + 1].position
            : maxPosition;
      } else {
        events[i + 1].position = events[i].position;
      }

      i++;
    }
  }

  return maxPosition;
};

const getWeekDateEvents = (monDate, events) => {
  events.sort(compareHeaderEvent);
  const result = [];
  const monTime = new Date(
    monDate.getFullYear(),
    monDate.getMonth(),
    monDate.getDate(),
  ).getTime();
  const sunTime = new Date(
    monDate.getFullYear(),
    monDate.getMonth(),
    monDate.getDate() + 6,
  ).getTime();
  for (let i = 0; i < events.length; i++) {
    const iTime = new Date(
      events[i].start.getFullYear(),
      events[i].start.getMonth(),
      events[i].start.getDate(),
    ).getTime();
    if (iTime >= monTime) {
      if (iTime > sunTime) break;
      result.push(events[i]);
    }
  }
  return result;
};

const getDateEvents = (date, events) => {
  const result = [];
  for (let i = 0; i < events.length; i++) {
    if (events[i].start.getDate() > date.getDate()) break;
    const eventDate = new Date(
      events[i].start.getFullYear(),
      events[i].start.getMonth(),
      events[i].start.getDate(),
    );
    if (eventDate.getTime() === date.getTime()) result.push(events[i]);
  }
  return result;
};

const convertDateEvents = events => {
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

const getDayY = day => {
  const h = moment(day).hour();
  const m = moment(day).minute();
  return h * HOUR_HEIGHT + (m * HOUR_HEIGHT) / 60;
};

const getEventPosition = event => {
  return {
    x: ((event.position - 1) * (width - HOUR_HEIGHT)) / 7 / 2,
    y: getDayY(event.start),
    width: (width - HOUR_HEIGHT) / 7 / event.flex,
    height: getDayY(event.end) - getDayY(event.start),
  };
};

const getWeeks = (currentDate, dates, numWeeks) => {
  const result = [];
  const index = indexOfDate(currentDate, dates);
  const monIndex = getMonIndex(index, dates);
  for (let i = -Math.floor(numWeeks / 2); i < Math.round(numWeeks / 2); i++) {
    result.push(dates.slice(monIndex + i * 7, monIndex + i * 7 + 7));
  }
  return result;
};

const getPreWeek = (currentDate, dates) => {
  const index = indexOfDate(currentDate, dates);
  return dates.slice(index - 7, index);
};

const getNextWeek = (currentDate, dates) => {
  const index = indexOfDate(currentDate, dates);
  return dates.slice(index + 7, index + 14);
};

export default {
  HOUR_HEIGHT,
  MARGIN_TOP,
  HOUR_TITLE_WIDTH,
  DATE_WIDTH,
  DATE_HEIGHT,
  HEADER_EVENT_HEIGHT,
  width,
  height,
  getHourFromDate,
  getHour,
  getPosition,
  getDateIndex,
  getMonthDates,
  indexOfDate,
  getMonIndex,
  getAfterMonIndex,
  getDay,
  getDate,
  compareEvent,
  convertEvents,
  getYearDates,
  convertHeaderEvents,
  getWeekDateEvents,
  getYearMonths,
  getDateEvents,
  convertDateEvents,
  getDayY,
  getEventPosition,
  getWeeks,
  getPreWeek,
  getNextWeek,
  addYearTo,
  addNextYearTo,
  get3YearDates,
};
