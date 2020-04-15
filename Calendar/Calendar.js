import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
  Image,
  Button,
} from 'react-native';

import utils from './utils';
import Popup from './Popup';
import moment from 'moment';

const TO_DAY = new Date();
const YEAR_DAYS = utils.getYearDates(TO_DAY.getFullYear());
const INDEX_DATE_NOW = utils.indexOfDate(TO_DAY, YEAR_DAYS);
const EVENT = {
  id: 1,
  start: new Date(2020, 3, 15, 6, 30),
  end: new Date(2020, 3, 17, 6, 30),
  describe: 'SAMPLE EVENT',
  color: 'green',
  position: 1,
  flex: 1,
};

const Calendar = () => {
  const refModal = useRef();
  let id = 1;
  const [canScroll, setCanScroll] = useState(true);
  const [start, setStart] = useState(null);
  const [move, setMove] = useState(null);
  const [hourEvents, setHourEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [createEventHeight, setCreateEventHeight] = useState(0);
  const [sumDate, setSumDate] = useState(7);
  const [dateWidth, setDateWidth] = useState(0);
  const [dateSelectedIndex, setDateSelectedIndex] = useState(-1);
  const [nowDate, setNowDate] = useState(TO_DAY);
  const [dateEvents] = useState([]);
  const [week, setWeek] = useState(
    YEAR_DAYS.slice(
      utils.getMonIndex(INDEX_DATE_NOW, YEAR_DAYS),
      utils.getMonIndex(INDEX_DATE_NOW, YEAR_DAYS) + 8,
    ),
  );
  const maxPosition = utils.convertHeaderEvents(dateEvents);
  const headerHeight =
    utils.DATE_HEIGHT + maxPosition * utils.HEADER_EVENT_HEIGHT;

  const restartState = () => {
    setCanScroll(true);
    setStart(null);
    setMove(null);
    setVisible(false);
    setCreateEventHeight(0);
  };

  useEffect(() => {
    const width = (utils.width - utils.HOUR_TITLE_WIDTH) / sumDate;
    setDateWidth(width);
  }, [sumDate]);

  const onLongPress = evt => {
    const start = {
      x: evt.nativeEvent.locationX,
      y: evt.nativeEvent.locationY,
    };
    const dateIndex = utils.getDateIndex(start.x, dateWidth);

    setDateSelectedIndex(dateIndex);
    setCanScroll(false);
    setCreateEventHeight(5);
    setStart(start);
  };

  const onMove = evt => {
    if (canScroll) return;
    const move = {
      x: evt.nativeEvent.locationX,
      y: evt.nativeEvent.locationY,
    };
    setMove(move);
    setCreateEventHeight(move.y - start.y);
  };

  const onOk = event => {
    new Date(
      event.start.getFullYear(),
      event.start.getMonth(),
      event.start.getDate(),
    ).getTime() ===
    new Date(
      event.end.getFullYear(),
      event.end.getMonth(),
      event.end.getDate(),
    ).getTime()
      ? hourEvents.push(event)
      : dateEvents.push(event);
    onCancel();
  };

  const onCancel = () => {
    restartState();
  };

  const onRelease = evt => {
    console.log('CHeck');
    if (canScroll) return;
    refModal.current.onShowModal(
      utils.getDate(week[dateSelectedIndex], start),
      utils.getDate(week[dateSelectedIndex], move),
    );
  };

  const onAddEvent = () => {
    setCanScroll(false);
    const date = week[0];
    refModal.current.onShowModal(
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0),
      new Date(date.getFullYear(), date.getMonth(), date.getDate(), 1, 0),
    );
  };

  const onPreWeek = () => {
    const indexDateNow = utils.getMonIndex(
      utils.indexOfDate(nowDate, YEAR_DAYS),
      YEAR_DAYS,
    );
    const newWeek = YEAR_DAYS.slice(
      utils.getMonIndex(indexDateNow - 7, YEAR_DAYS),
      utils.getMonIndex(indexDateNow - 7, YEAR_DAYS) + 8,
    );
    setWeek(newWeek);
    setNowDate(newWeek[0]);
  };

  const onNextWeek = () => {
    const indexDateNow = utils.getMonIndex(
      utils.indexOfDate(nowDate, YEAR_DAYS),
      YEAR_DAYS,
    );
    const newWeek = YEAR_DAYS.slice(
      utils.getMonIndex(indexDateNow + 7, YEAR_DAYS),
      utils.getMonIndex(indexDateNow + 7, YEAR_DAYS) + 8,
    );
    setWeek(newWeek);
    setNowDate(newWeek[0]);
  };

  const onPreMonth = () => {
    const index = utils.indexOfDate(
      new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, 1),
      YEAR_DAYS,
    );
    const newWeek = YEAR_DAYS.slice(
      utils.getMonIndex(index, YEAR_DAYS),
      utils.getMonIndex(index, YEAR_DAYS) + 8,
    );
    setNowDate(new Date(nowDate.getFullYear(), nowDate.getMonth() - 1), 1);
    setWeek(newWeek);
  };
  const onNextMonth = () => {
    const index = utils.indexOfDate(
      new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 1),
      YEAR_DAYS,
    );
    const newWeek = YEAR_DAYS.slice(
      utils.getMonIndex(index, YEAR_DAYS),
      utils.getMonIndex(index, YEAR_DAYS) + 8,
    );
    setNowDate(new Date(nowDate.getFullYear(), nowDate.getMonth() + 1), 1);
    setWeek(newWeek);
  };

  /************************************************************************** */
  /**********       RENDER        ******************************************* */
  /************************************************************************** */

  const renderHour = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(
        i != 0 ? (
          <View
            key={i}
            style={[
              styles.itemHour,
              {
                borderBottomWidth: i === 23 ? 1 : 0,
              },
            ]}>
            <Text style={styles.txtHour}>{i}</Text>
            <View style={styles.lineRow} />
          </View>
        ) : (
          <View key={i} style={styles.itemHour} />
        ),
      );
    }
    return <View style={styles.ctHour}>{hours}</View>;
  };

  const renderDate = week => {
    let id = 0;
    return week.map(date => {
      return (
        <View
          key={id++}
          style={{
            flexDirection: 'row',
            width: dateWidth,
          }}>
          <View
            style={[styles.lineColumn, {height: utils.height - headerHeight}]}
          />
          <View style={styles.date}>
            <Text>{utils.getDay(date)}</Text>
            <Text>{date.getDate()}</Text>
          </View>
        </View>
      );
    });
  };

  const renderWeek = (week, dateEvents) => {
    return (
      <View style={[styles.ctDate, {height: headerHeight}]}>
        <View style={styles.title} />
        {renderDate(week)}
        {renderHeaderEvents(dateEvents)}
      </View>
    );
  };

  const renderHeaderEvents = events => {
    const weekEvents = utils.getWeekDateEvents(week[0], events);
    return weekEvents.map(event => {
      return (
        <TouchableOpacity
          onPress={() => {
            alert(event.describe);
          }}
          key={event.id}
          style={[
            styles.headerEvent,
            {
              left:
                utils.HOUR_TITLE_WIDTH + (event.start.getDay() - 1) * dateWidth,
              backgroundColor: event.color,
              top:
                utils.DATE_HEIGHT +
                utils.HEADER_EVENT_HEIGHT * (event.position - 1),
              width:
                (event.end.getDate() - event.start.getDate() + 1) * dateWidth,
            },
          ]}>
          <Text style={styles.txtEvent}>{event.describe}</Text>
        </TouchableOpacity>
      );
    });
  };

  const renderEvents = events => {
    utils.convertEvents(events);
    const eventsView = events.map(event => {
      const start = utils.getPosition(event.start, week, dateWidth);
      const end = utils.getPosition(event.end, week, dateWidth);
      return (
        <TouchableOpacity
          key={++id}
          onPress={() => {
            alert(event.describe);
          }}
          style={[
            styles.event,
            {
              backgroundColor: event.color,
              top: start.y,
              left: start.x + ((event.position - 1) * dateWidth) / event.flex,
              width: dateWidth / event.flex,
              height: end.y - start.y,
            },
          ]}>
          <Text style={styles.txtEvent}>{event.describe}</Text>
        </TouchableOpacity>
      );
    });
    return eventsView;
  };

  const renderTable = events => {
    return (
      <View
        style={styles.ctTable}
        onStartShouldSetResponder={evt => true}
        onMoveShouldSetResponder={evt => true}
        onResponderMove={onMove}
        onResponderRelease={onRelease}>
        <TouchableOpacity style={styles.touch} onLongPress={onLongPress} />
        <View
          style={[
            styles.createEvent,
            {
              height: createEventHeight,
              left: dateSelectedIndex * dateWidth,
              top: start ? start.y : 0,
              width: dateWidth,
            },
          ]}
        />
        {renderEvents(events)}
      </View>
    );
  };

  const renderCalendar = hourEvents => {
    return (
      <ScrollView
        style={[styles.scrollView, {marginBottom: headerHeight + 30}]}
        scrollEnabled={canScroll}>
        <View style={styles.calendar}>
          {renderHour()}
          {renderTable(hourEvents)}
        </View>
      </ScrollView>
    );
  };

  const renderMoveMonth = () => {
    return (
      <View style={styles.ctMoveMonth}>
        <Button title="PreMonth" onPress={onPreMonth} />
        <View style={styles.ctYear}>
          <Text>{moment(nowDate).format('MMM')}</Text>
          <Text>{moment(nowDate).format('YYYY')}</Text>
        </View>
        <Button title="NextMonth" onPress={onNextMonth} />
      </View>
    );
  };

  /******* START MAIN  ***************************************/
  /******* START MAIN  ***************************************/
  /******* START MAIN  ***************************************/

  return (
    <View style={StyleSheet.absoluteFill}>
      <Popup
        ref={refModal}
        id={++id}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        from={start ? utils.getDate(week[dateSelectedIndex], start) : null}
        to={move ? utils.getDate(week[dateSelectedIndex], move) : null}
      />
      {renderMoveMonth()}
      {renderWeek(week, dateEvents)}
      <View style={{}}>{renderCalendar(hourEvents)}</View>
      <TouchableOpacity onPress={onPreWeek} style={styles.touchImgLeft}>
        <Image
          style={styles.imgLeft}
          source={require('./src/images/left_arrow.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onNextWeek} style={styles.touchImgRight}>
        <Image
          style={styles.imgRight}
          source={require('./src/images/right_arrow.png')}
        />
      </TouchableOpacity>
      <TouchableOpacity onPress={onAddEvent} style={styles.touchImgAddEvent}>
        <Image
          style={styles.imgAddEvent}
          source={require('./src/images/plus.png')}
        />
      </TouchableOpacity>
    </View>
  );
  /******* END MAIN  ***************************************/
};

const styles = StyleSheet.create({
  ctHour: {},
  ctTable: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    marginLeft: utils.HOUR_TITLE_WIDTH,
    // marginTop: headerHeight,
  },
  itemHour: {
    height: utils.HOUR_HEIGHT,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  lineRow: {
    width: utils.width - utils.HOUR_TITLE_WIDTH,
    backgroundColor: '#CCC',
    height: 1,
  },
  lineColumn: {
    width: 1,
    backgroundColor: '#000',
  },
  txtHour: {
    top: -8,
    textAlign: 'right',
    width: utils.HOUR_TITLE_WIDTH,
    paddingRight: 10,
  },
  scrollView: {
    borderTopWidth: 1,
  },
  hide: {
    width: 0,
    height: 0,
  },
  createEvent: {
    position: 'absolute',
    backgroundColor: 'green',
  },
  event: {
    position: 'absolute',
  },
  txtEvent: {
    margin: 5,
    color: 'white',
  },
  touch: {
    flex: 1,
  },
  calendar: {
    flexDirection: 'row',
    marginBottom: 50,
  },
  ctDate: {
    // marginTop: utils.MARGIN_TOP,
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  date: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    height: utils.DATE_HEIGHT,
  },
  title: {
    width: utils.HOUR_TITLE_WIDTH,
    // justifyContent: 'center',
    // alignItems: 'center',
    // marginHorizontal: 50,
  },
  imgLeft: {
    width: 30,
    height: 30,
  },
  imgRight: {
    width: 30,
    height: 30,
  },
  touchImgLeft: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: utils.height / 2,
    left: 10,
  },
  touchImgRight: {
    position: 'absolute',
    width: 30,
    height: 30,
    top: utils.height / 2,
    right: 10,
  },
  ctMoveMonth: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 20,
  },
  ctYear: {
    marginHorizontal: 50,
  },
  headerEvent: {
    position: 'absolute',
    height: utils.HEADER_EVENT_HEIGHT,
    alignItems: 'center',
  },
  imgAddEvent: {
    width: 50,
    height: 50,
  },
  touchImgAddEvent: {
    position: 'absolute',
    width: 50,
    height: 50,
    bottom: 50,
    right: 50,
  },
});

export default Calendar;
