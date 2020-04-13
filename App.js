import React from 'react';
import {View, Text} from 'react-native';
import Calendar from './Calendar/Calendar';

const App = () => {
  return (
    <View style={{flex: 1, margintTop: 200}}>
      <Calendar />
    </View>
  );
};

export default App;
