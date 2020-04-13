import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  TouchableOpacity,
  Alert,
} from 'react-native';

import utils from './utils';
import Popup from './Popup';

const DATES = [
  {
    day: 'T2',
    date: 20,
  },
  {
    day: 'T3',
    date: 21,
  },
  {
    day: 'T4',
    date: 22,
  },
  {
    day: 'T5',
    date: 23,
  },
  {
    day: 'T6',
    date: 24,
  },
  {
    day: 'T7',
    date: 25,
  },
  {
    day: 'CN',
    date: 26,
  },
];

const Calendar = () => {
  let id = 1;
  const [canScroll, setCanScroll] = useState(true);
  const [start, setStart] = useState(null);
  const [move, setMove] = useState(null);
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [createEventHeight, setCreateEventHeight] = useState(0);
  const [sumDate, setSumDate] = useState(7);
  const [dateWidth, setDateWidth] = useState(0);
  const [dateIndex, setDateIndex] = useState(-1);

  const MONTH_DATES = utils.getMonthDates(2020, 4);
  const INDEX_DATE_NOW = utils.indexOfDate(new Date(), MONTH_DATES);
  const MON_INDEX = utils.getMonIndex(INDEX_DATE_NOW, MONTH_DATES);
  const PAGE = 0;
  const WEEK = MONTH_DATES.slice(MON_INDEX, MON_INDEX + 8);

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

    setDateIndex(dateIndex);
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
    events.push(event);
    onCancel();
  };

  const onCancel = () => {
    restartState();
  };

  const onRelease = evt => {
    if (canScroll) return;
    setVisible(true);
  };

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

  const renderDate = () => {
    return WEEK.map(date => {
      return (
        <View
          key={date.getDay()}
          style={{
            flexDirection: 'row',
            width: dateWidth,
          }}>
          <View style={styles.lineColumn} />
          <View style={styles.date}>
            <Text>{utils.getDay(date)}</Text>
            <Text>{date.getDate()}</Text>
          </View>
        </View>
      );
    });
  };

  const renderWeek = () => {
    return (
      <View style={styles.ctDate}>
        <View style={styles.title} />
        {renderDate()}
      </View>
    );
  };

  const renderEvents = events => {
    const eventsView = events.map(event => {
      const start = utils.getPosition(event.start);
      const end = utils.getPosition(event.end);
      return (
        <TouchableOpacity
          key={event.id}
          onPress={() => {
            alert(event.describe);
          }}
          style={[
            styles.event,
            {
              backgroundColor: event.color,
              top: start.y,
              width: dateWidth,
              height: end.y - start.y,
            },
          ]}>
          <Text style={styles.txtEvent}>{event.describe}</Text>
        </TouchableOpacity>
      );
    });
    return eventsView;
  };

  const renderTable = () => {
    return (
      <View
        style={styles.ctTable}
        onStartShouldSetResponder={evt => true}
        onMoveShouldSetResponder={evt => true}
        //   onResponderGrant={onStartMove}
        onResponderMove={onMove}
        onResponderRelease={onRelease}>
        <TouchableOpacity style={styles.touch} onLongPress={onLongPress} />
        <View
          style={[
            styles.createEvent,
            {
              height: createEventHeight,
              left: dateIndex * dateWidth,
              top: start ? start.y : 0,
              width: dateWidth,
            },
          ]}
        />
        {renderEvents(events)}
      </View>
    );
  };

  const renderCalendar = () => {
    return (
      <ScrollView style={styles.scrollView} scrollEnabled={canScroll}>
        <View style={styles.calendar}>
          {renderHour()}
          {renderTable()}
        </View>
      </ScrollView>
    );
  };

  /******* START MAIN  ***************************************/
  return (
    <View style={StyleSheet.absoluteFill}>
      <Popup
        id={++id}
        visible={visible}
        onOk={onOk}
        onCancel={onCancel}
        from={start ? utils.getHour(start.x, start.y) : null}
        to={move ? utils.getHour(move.x, move.y) : null}
      />
      {renderWeek()}
      <View style={{}}>{renderCalendar()}</View>
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
    // marginTop: utils.DATE_HEIGHT,
  },
  itemHour: {
    height: utils.HOUR_HEIGHT,
    justifyContent: 'flex-start',
    flexDirection: 'row',
  },
  lineRow: {
    width: utils.width - utils.HOUR_TITLE_WIDTH,
    backgroundColor: 'grey',
    height: 0.5,
  },
  lineColumn: {
    width: 0.5,
    height: utils.height - utils.DATE_HEIGHT,
    backgroundColor: 'black',
  },
  txtHour: {
    top: -8,
    textAlign: 'right',
    width: utils.HOUR_TITLE_WIDTH,
    paddingRight: 10,
  },
  scrollView: {
    borderTopWidth: 1,
    marginBottom: utils.DATE_HEIGHT + 30,
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
    height: utils.DATE_HEIGHT,
    marginTop: utils.MARGIN_TOP,
    flexDirection: 'row',
    borderTopWidth: 1,
  },
  date: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    width: utils.HOUR_TITLE_WIDTH,
  },
});

export default Calendar;
