import {Dimensions} from 'react-native';
import moment from 'moment';

const MINUTE_HEIGHT = 1;
const HOUR_HEIGHT = 60 * MINUTE_HEIGHT;
const MARGIN_TOP = 50;
const HOUR_TITLE_WIDTH = 40;
const DATE_HEIGHT = 50;
const DATE_WIDTH = 100;

const {width, height} = Dimensions.get('window');

const getHour = (x, y) => {
  const hm = (y / HOUR_HEIGHT).toFixed(1);
  const h = Math.floor(hm);
  const m = Math.floor((hm - h) * 60);

  return {
    h: h,
    m: m,
  };
};

getHourFromDate = date => {
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

export default {
  HOUR_HEIGHT,
  MARGIN_TOP,
  HOUR_TITLE_WIDTH,
  DATE_WIDTH,
  DATE_HEIGHT,
  width,
  height,
  getHour,
  getPosition,
  getHourFromDate,
};
