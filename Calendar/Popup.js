import React, {useState, createRef, useEffect} from 'react';
import {
  View,
  Text,
  Modal,
  Button,
  TouchableOpacity,
  TextInput,
  PickerItem,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import utils from './utils';
import moment from 'moment';

const COLORS = ['red', 'green', 'blue', 'black', 'yellow', 'pink', 'purple'];

const Popup = props => {
  const {visible, onOk, onCancel, id = 0, from = null, to = null} = props;

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [color, setColor] = useState(COLORS[2]);
  const [description, setDescription] = useState('');
  const [chooseFrom, setChooseFrom] = useState(false);
  const [chooseTo, setChooseTo] = useState(false);

  const hideDatePicker = () => {
    setChooseDay(false);
  };

  const handleConfirm = date => {
    setDay(date);
    hideDatePicker();
  };

  const hideDatePickerFrom = () => {
    setChooseFrom(false);
  };

  const handleConfirmFrom = date => {
    setFromDate(date);
    hideDatePickerFrom();
  };

  const hideDatePickerTo = () => {
    setChooseTo(false);
  };

  const handleConfirmTo = date => {
    setToDate(date);
    hideDatePickerTo();
  };

  const addEvent = () => {
    onCancel();
    const event = {
      id: id,
      color: color,
      describe: description,
      start: fromDate,
      end: toDate,
    };
    return onOk(event);
  };

  const renderItemPicker = () => {
    return COLORS.map(item => {
      return <Picker.Item key={item} label={item} value={item} color={item} />;
    });
  };

  useEffect(() => {
    setFromDate(from);
    setToDate(to);
  }, [from, to]);

  return (
    <Modal visible={visible} transparent={true}>
      <View style={{flex: 1, backgroundColor: 'black', opacity: 0.5}} />
      <View
        style={{
          marginTop: '50%',
          alignSelf: 'center',
          position: 'absolute',
          width: '80%',
          justifyContent: 'center',
          backgroundColor: 'white',
          borderRadius: 20,
          paddingVertical: 50,
        }}>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              width: '90%',
              marginHorizontal: 20,
              padding: 10,
              borderRadius: 20,
              alignItems: 'center',
            }}
            onPress={() => setChooseFrom(true)}>
            <Text>
              {fromDate
                ? moment(fromDate).format('ddd DD MM YYYY - HH:mm')
                : 'From'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={chooseFrom}
            mode="datetime"
            onConfirm={handleConfirmFrom}
            onCancel={hideDatePickerFrom}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
          }}>
          <TouchableOpacity
            style={{
              borderWidth: 1,
              width: '90%',
              marginHorizontal: 20,
              padding: 10,
              borderRadius: 20,
              alignItems: 'center',
            }}
            onPress={() => setChooseTo(true)}>
            <Text>
              {toDate ? moment(toDate).format('ddd DD MM YYYY - HH:mm') : 'To'}
            </Text>
          </TouchableOpacity>
          <DateTimePickerModal
            isVisible={chooseTo}
            mode="datetime"
            onConfirm={handleConfirmTo}
            onCancel={hideDatePickerTo}
          />
        </View>

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            marginBottom: 20,
            marginHorizontal: 20,
          }}>
          <Text style={{fontSize: 16, fontWeight: 'bold'}}>Color: </Text>
          <Picker
            selectedValue={color}
            style={{height: 150, width: '85%'}}
            itemStyle={{
              height: 150,
              borderWidth: 1,
              borderRadius: 20,
              backgroundColor: 'grey',
            }}
            onValueChange={value => {
              setColor(value);
            }}>
            {renderItemPicker()}
          </Picker>
        </View>
        <TextInput
          style={{
            borderWidth: 1,
            width: '90%',
            marginHorizontal: 20,
            borderRadius: 20,
            height: '30%',
            padding: 10,
          }}
          value={description}
          onChangeText={text => {
            setDescription(text);
          }}
          placeholder="Enter event description"
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'center',
            marginTop: 30,
          }}>
          <TouchableOpacity
            onPress={addEvent}
            style={{
              borderWidth: 1,
              marginHorizontal: 20,
              padding: 10,
              borderRadius: 20,
              width: 100,
              alignItems: 'center',
            }}>
            <Text>Ok</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={onCancel}
            style={{
              borderWidth: 1,
              width: 100,
              marginHorizontal: 20,
              padding: 10,
              borderRadius: 20,
              alignItems: 'center',
            }}>
            <Text>Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default Popup;
