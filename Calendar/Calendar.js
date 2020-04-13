import React, {useState} from 'react';
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

const Calendar = () => {
  let id = 1;
  const [canScroll, setCanScroll] = useState(true);
  const [start, setStart] = useState(null);
  const [move, setMove] = useState(null);
  const [events, setEvents] = useState([]);
  const [visible, setVisible] = useState(false);
  const [createEventHeight, setCreateEventHeight] = useState(0);
  const [sumDate, setSumDate] = useState(7);

  const restartState = () => {
    setCanScroll(true);
    setStart(null);
    setMove(null);
    setVisible(false);
    setCreateEventHeight(0);
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
    const result = [];
    for (let i = 0; i < sumDate; i++) {
      result.push(<View key={i} style={styles.date} />);
    }
    return result;
  };

  const renderWeek = () => {
    return <View style={styles.ctDate}>{renderDate()}</View>;
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
              width: utils.DATE_WIDTH,
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
        <TouchableOpacity
          style={styles.touch}
          onLongPress={evt => {
            const start = {
              x: evt.nativeEvent.locationX,
              y: evt.nativeEvent.locationY,
            };
            setCanScroll(false);
            setCreateEventHeight(10);
            setStart(start);
          }}
        />
        <View
          style={[
            styles.createEvent,
            {
              height: createEventHeight,
              left: 0,
              top: start ? start.y : 0,
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
      <View
        style={{
          marginTop: utils.MARGIN_TOP,
        }}>
        {renderCalendar()}
      </View>
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
    height: 1,
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
    width: utils.DATE_WIDTH,
    height: 10,
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
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  date: {
    flex: 1,
    backgroundColor: 'green',
  },
});

export default Calendar;
