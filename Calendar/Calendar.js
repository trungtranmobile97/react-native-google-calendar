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
const NUM_WEEKS = 5;
const WEEKS = utils.getWeeks(TO_DAY, YEAR_DAYS, NUM_WEEKS);
const EVENT = {
  id: 1,
  start: new Date(2020, 3, 15, 6, 30),
  end: new Date(2020, 3, 17, 6, 30),
  describe: 'SAMPLE EVENT',
  color: 'green',
  position: 1,
  flex: 1,
};

const HOUR_EVENTS = [
  {
    id: 1,
    start: new Date(2020, 3, 15, 6, 30),
    end: new Date(2020, 3, 15, 8, 0),
    describe: 'SAMPLE EVENT',
    color: 'green',
    position: 1,
    flex: 1,
  },
];

const Calendar = () => {
  const refModal = useRef();
  const refWeekScroll = useRef();
  let id = 1;
  const [canScroll, setCanScroll] = useState(true);
  const [start, setStart] = useState(null);
  const [move, setMove] = useState(null);
  const [hourEvents, setHourEvents] = useState(HOUR_EVENTS);
  const [visible, setVisible] = useState(false);
  const [dateWidth, setDateWidth] = useState(
    (utils.width - utils.HOUR_TITLE_WIDTH) / 7,
  );
  const [dateSelectedIndex, setDateSelectedIndex] = useState(-1);
  const [nowDate, setNowDate] = useState(TO_DAY);
  const [dateEvents] = useState([]);
  const [years, setYears] = useState(YEAR_DAYS);
  const [weeks, setWeeks] = useState(WEEKS);
  const [week, setWeek] = useState(
    // YEAR_DAYS.slice(
    //   utils.getMonIndex(INDEX_DATE_NOW, YEAR_DAYS),
    //   utils.getMonIndex(INDEX_DATE_NOW, YEAR_DAYS) + 7,
    // ),
    weeks[Math.floor(NUM_WEEKS / 2)],
  );
  const [headerHeight, setHeaderHeight] = useState(0);

  const restartState = () => {
    utils.convertEvents(hourEvents);
    const maxPosition = utils.convertHeaderEvents(dateEvents);
    console.log('max: ', maxPosition);
    const headerHeight =
      utils.DATE_HEIGHT + maxPosition * utils.HEADER_EVENT_HEIGHT;
    setHeaderHeight(headerHeight);
    setCanScroll(true);
    setStart(null);
    setMove(null);
    setVisible(false);
    setDateSelectedIndex(-1);
  };

  useEffect(() => {
    restartState();
    setTimeout(() => {
      refWeekScroll.current.scrollTo({
        x: (utils.width - utils.HOUR_TITLE_WIDTH) * 2,
        y: 0,
        animated: false,
      });
    }, 500);
  }, []);

  // const onLongPress = evt => {
  //   const start = {
  //     x: evt.nativeEvent.locationX,
  //     y: evt.nativeEvent.locationY,
  //   };
  //   const dateIndex = utils.getDateIndex(start.x, dateWidth);

  //   setDateSelectedIndex(dateIndex);
  //   setCanScroll(false);
  //   setCreateEventHeight(5);
  //   setStart(start);
  // };

  const onLongPress = (evt, day) => {
    const start = {
      x: evt.nativeEvent.locationX,
      y: evt.nativeEvent.locationY,
    };
    const index = day.getDay();
    setStart(start);
    setDateSelectedIndex(index);
    setCanScroll(false);
  };

  const onMove = evt => {
    if (canScroll) {
    } else {
      const move = {
        x: evt.nativeEvent.locationX,
        y: evt.nativeEvent.locationY,
      };
      setMove(move);
    }
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
    if (canScroll) return;
    refModal.current.onShowModal(
      utils.getDate(week[dateSelectedIndex - 1], start),
      utils.getDate(week[dateSelectedIndex - 1], move),
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
      utils.getMonIndex(indexDateNow - 7, YEAR_DAYS) + 7,
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
      utils.getMonIndex(indexDateNow + 7, YEAR_DAYS) + 7,
    );
    setWeek(newWeek);
    setNowDate(newWeek[0]);
  };

  const onPreMonth = () => {
    const index = utils.indexOfDate(
      new Date(nowDate.getFullYear(), nowDate.getMonth() - 1, 1),
      years,
    );
    const monIndex = utils.getAfterMonIndex(index, years);
    const newWeek = years.slice(monIndex, monIndex + 7);
    setNowDate(newWeek[0]);
    setWeek(newWeek);
  };
  const onNextMonth = () => {
    const index = utils.indexOfDate(
      new Date(nowDate.getFullYear(), nowDate.getMonth() + 1, 1),
      years,
    );
    const monIndex = utils.getAfterMonIndex(index, years);
    const newWeek = years.slice(monIndex, monIndex + 7);
    setNowDate(newWeek[0]);
    setWeek(newWeek);
  };

  const onScrollWeek = evt => {
    const weekWidth = utils.width - utils.HOUR_TITLE_WIDTH;
    const weekIndex = evt.nativeEvent.contentOffset.x / weekWidth;
    if (weeks[weekIndex][0].getTime() === week[0].getTime()) {
      return;
    }
    setWeek(weeks[weekIndex]);
    // if (weekIndex === 0) {
    //   const monIndex = utils.indexOfDate(week[0], years);
    //   const newWeek = years.slice(monIndex - 7, monIndex);
    //   weeks.unshift(newWeek);
    //   // setWeeks(newWeeks);
    //   console.log('weeks: ', weeks);
    // } else if (weekIndex >= weeks.length - 1) {
    //   const monIndex = utils.indexOfDate(week[0], years);
    //   const newWeek = years.slice(monIndex + 7, monIndex + 14);
    //   weeks.push(newWeek);
    //   console.log('weeks: ', weeks);
    // }
  };
  /************************************************************************** */
  /************************************************************************** */
  /**********       RENDER        ******************************************* */
  /************************************************************************** */
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

  const renderDate = () => {
    let id = 0;

    const thisWeek = week.map(date => {
      return (
        <View
          key={id++}
          style={{
            flexDirection: 'row',
            width: dateWidth,
          }}>
          <View style={styles.date}>
            <Text>{utils.getDay(date)}</Text>
            <Text>{date.getDate()}</Text>
          </View>
          <View style={[styles.lineColumn, {height: headerHeight}]} />
        </View>
      );
    });

    return thisWeek;
  };

  const renderWeek = () => {
    return (
      <View style={[styles.ctDate, {height: headerHeight}]}>
        <View style={styles.title} />
        <View style={styles.hourLineColumn} />
        {renderDate()}
        {renderHeaderEvents()}
      </View>
    );
  };

  const renderHeaderEvents = () => {
    const weekEvents = utils.getWeekDateEvents(week[0], dateEvents);
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

  // const renderEvents = events => {
  //   utils.convertEvents(events);
  //   const eventsView = events.map(event => {
  //     const start = utils.getPosition(event.start, week, dateWidth);
  //     const end = utils.getPosition(event.end, week, dateWidth);
  //     return (
  //       <TouchableOpacity
  //         key={++id}
  //         onPress={() => {
  //           alert(event.describe);
  //         }}
  //         style={[
  //           styles.event,
  //           {
  //             backgroundColor: event.color,
  //             top: start.y,
  //             left: start.x + ((event.position - 1) * dateWidth) / event.flex,
  //             width: dateWidth / event.flex,
  //             height: end.y - start.y,
  //           },
  //         ]}>
  //         <Text style={styles.txtEvent}>{event.describe}</Text>
  //       </TouchableOpacity>
  //     );
  //   });
  //   return eventsView;
  // };

  // const renderTable = events => {
  //   return (
  //     <View
  //       style={styles.ctTable}
  //       onStartShouldSetResponder={evt => true}
  //       onMoveShouldSetResponder={evt => true}
  //       onResponderMove={onMove}
  //       onResponderRelease={onRelease}>
  //       <TouchableOpacity style={styles.touch} onLongPress={onLongPress} />
  //       <View
  //         style={[
  //           styles.createEvent,
  //           {
  //             height: createEventHeight,
  //             left: dateSelectedIndex * dateWidth,
  //             top: start ? start.y : 0,
  //             width: dateWidth,
  //           },
  //         ]}
  //       />
  //       {renderEvents(events)}
  //     </View>
  //   );
  // };

  const renderNewEvents = day => {
    const dateEvents = utils.getDateEvents(day, hourEvents);
    utils.convertDateEvents(dateEvents);
    return dateEvents.map(event => {
      const pot = utils.getEventPosition(event);
      return (
        <TouchableOpacity
          key={event.id}
          onPress={() => alert(event.describe)}
          style={{
            position: 'absolute',
            top: pot.y,
            left: pot.x,
            height: pot.height,
            width: pot.width - 1,
            backgroundColor: event.color,
            padding: 5,
            marginHorizontal: 1,
          }}>
          <Text style={{color: 'white'}}>{event.describe}</Text>
        </TouchableOpacity>
      );
    });
  };

  const renderTableDay = week => {
    return week.map(day => {
      return (
        <View
          key={day}
          onStartShouldSetResponder={evt => true}
          onMoveShouldSetResponder={evt => true}
          onResponderMove={onMove}
          onResponderRelease={onRelease}
          style={{
            flex: 1,
            borderLeftWidth: 1,
            borderColor: '#CCC',
          }}>
          <TouchableOpacity
            onLongPress={evt => onLongPress(evt, day)}
            activeOpacity={1}
            style={{
              flex: 1,
            }}>
            {renderNewEvents(day)}
            <View
              style={[
                styles.createEvent,
                {
                  height:
                    day.getDay() === dateSelectedIndex
                      ? move && start
                        ? move.y - start.y != 5
                          ? move.y - start.y
                          : 5
                        : 5
                      : 0,
                  left: 0,
                  top: start ? start.y : 0,
                  width: '100%',
                  // width: (utils.width - utils.HOUR_TITLE_WIDTH) / 7,
                },
              ]}
            />
          </TouchableOpacity>
        </View>
      );
    });
  };

  const renderWeekTable = week => {
    let id = 0;
    return (
      <View
        key={week + id++}
        style={{
          width: utils.width - utils.HOUR_TITLE_WIDTH,
          height: utils.HOUR_HEIGHT * 24,
          flexDirection: 'row',
          borderLeftWidth: 1,
          borderRightWidth: 1,
        }}>
        {renderTableDay(week)}
      </View>
    );
  };

  const renderNewTable = () => {
    return (
      <ScrollView
        ref={refWeekScroll}
        scrollEnabled={canScroll}
        style={{
          marginLeft: utils.HOUR_TITLE_WIDTH,
          width: utils.width - utils.HOUR_TITLE_WIDTH,
          height: utils.HOUR_HEIGHT * 24,
          position: 'absolute',
        }}
        horizontal={true}
        pagingEnabled={true}
        onMomentumScrollEnd={onScrollWeek}>
        {weeks.map(week => {
          return renderWeekTable(week);
        })}
      </ScrollView>
    );
  };

  const renderCalendar = () => {
    return (
      <ScrollView
        style={[styles.scrollView, {marginBottom: headerHeight + 30}]}
        scrollEnabled={canScroll}>
        <View style={styles.calendar}>
          {renderHour()}
          {renderNewTable()}
          {/* {renderTable(hourEvents)} */}
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
        from={
          start && dateSelectedIndex >= 0
            ? utils.getDate(week[dateSelectedIndex], start)
            : null
        }
        to={
          move && dateSelectedIndex >= 0
            ? utils.getDate(week[dateSelectedIndex], move)
            : null
        }
      />
      {renderMoveMonth()}
      {renderWeek()}
      <View style={{}}>{renderCalendar()}</View>
      {/* <TouchableOpacity onPress={onPreWeek} style={styles.touchImgLeft}>
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
      </TouchableOpacity> */}
      <TouchableOpacity onPress={onAddEvent} style={styles.touchImgAddEvent}>
        <Image
          style={styles.imgAddEvent}
          source={require('./src/images/plus.png')}
        />
      </TouchableOpacity>
    </View>
  );
  /******* END MAIN  ***************************************/
  /******* END MAIN  ***************************************/
  /******* END MAIN  ***************************************/
  /******* END MAIN  ***************************************/
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
  hourLineColumn: {
    width: 1,
    backgroundColor: 'black',
    height: utils.height,
  },
});

export default Calendar;
