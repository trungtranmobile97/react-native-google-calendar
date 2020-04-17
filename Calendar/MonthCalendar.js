import React, {useEffect, useState} from 'react';
import {View, Text, StyleSheet, FlatList} from 'react-native';
import utils from './utils';

const HEADER_HEIGHT = 100;

const MonthCalendar = () => {
  const [today, setToday] = useState(0);
  const [year, setYear] = useState([]);

  const initialState = () => {
    const today = new Date();
    const year = utils.getYearMonths(today.getFullYear());
    setToday(today);
    setYear(year);
  };

  useEffect(() => {
    initialState();
  }, []);

  /***********************************************************************/
  /***********************************************************************/
  /******************    RENDER     **************************************/
  /***********************************************************************/
  /***********************************************************************/

  const renderDate = () => {};

  const renderMonth = (item, index) => {
    const Mon = [];
    const Tue = [];
    const Wed = [];
    const Thu = [];
    const Fri = [];
    const Sat = [];
    const Sun = [];

    return (
      <View style={styles.calendar}>
        <View style={styles.ctDay}>{Mon}</View>
        <View style={styles.ctDay}>{Tue}</View>
        <View style={styles.ctDay}>{Wed}</View>
        <View style={styles.ctDay}>{Thu}</View>
        <View style={styles.ctDay}>{Fri}</View>
        <View style={styles.ctDay}>{Sat}</View>
        <View style={styles.ctDay}>{Sun}</View>
      </View>
    );
  };

  return (
    <View style={StyleSheet.absoluteFill}>
      <View style={styles.header}>
        <Text>April</Text>
      </View>
      <FlatList
        horizontal={true}
        style={styles.flatList}
        data={year}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderMonth}
      />
    </View>
  );

  /***********************************************************************/
  /***********************************************************************/
  /******************   END RENDER     ***********************************/
  /***********************************************************************/
  /***********************************************************************/
};

const styles = StyleSheet.create({
  container: {},
  header: {
    height: HEADER_HEIGHT,
    width: '100%',
  },
  flatList: {
    width: '100%',
    height: utils.height - HEADER_HEIGHT,
  },
  calendar: {
    width: utils.width,
    height: utils.height - HEADER_HEIGHT,
    backgroundColor: 'red',
    flexDirection: 'row',
  },
  ctDay: {
    width: utils.width / 7,
    height: '100%',
  },
  day: {
    flex: 1 / 6,
  },
});

export default MonthCalendar;
