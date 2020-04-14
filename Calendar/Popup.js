import React, { useState, createRef, useEffect, forwardRef, useImperativeHandle } from 'react';
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  TextInput,
  PickerItem,
  Image,
  Switch,
  StyleSheet,
  ScrollView
} from 'react-native';
import { Picker } from '@react-native-community/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import utils from './utils';

import Modal from 'react-native-modal';

// import Modal, { ModalContent } from 'react-native-modals';

import ToggleSwitch from 'toggle-switch-react-native'


const COLORS = ['red', 'green', 'blue', 'black', 'yellow', 'pink', 'purple'];


import moment from 'moment';

const Popup = forwardRef((props, ref) => {
  const { visible, onOk, onCancel, id = 0, from = null, to = null } = props;

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [color, setColor] = useState(COLORS[2]);
  const [description, setDescription] = useState('');
  const [chooseFrom, setChooseFrom] = useState(false);
  const [chooseTo, setChooseTo] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [typeDate, setTypeDate] = useState('date');
  const [typeEvent, setTypeEvent] = useState('from');


  /// DATE TIME START
  const [dateFrom, setDateFrom] = useState(null);
  const [timeFrom, setTimeFrom] = useState(null);
  const [dateEnd, setDateEnd] = useState(null);
  const [timeEnd, setTimeEnd] = useState(null);

  const [isVisible, setVisible] = useState(false);


  useImperativeHandle(ref, () => {
    return {
      onShowModal: (startDate, endDate) => onShow(startDate, endDate)
    }
  })

  const onShow = (startDate, endDate) => {
    console.log("START", startDate)
    console.log("END", endDate)

    const startTime = moment(startDate).format("HH:mm")
    const endTime = moment(endDate).format("HH:mm")
    const startDates = moment(startDate).format("DD/MM/YYYY")
    const endDates = moment(endDate).format("DD/MM/YYYY")

    setVisible(true)
    setTimeFrom(startTime)
    setTimeEnd(endTime)
    setDateFrom(startDates)
    setDateEnd(endDates)
  }


  const onShowDateFrom = () => {
    setTypeDate('date')
    setShowDate(true)
    setTypeEvent('from')
  }

  const onShowTimeFrom = () => {
    setTypeDate('time')
    setShowDate(true)
    setTypeEvent('from')
  }

  const hideDatePicker = () => {
    setChooseDay(false);
  };

  const handleConfirm = date => {
    console.log(date)
    setShowDate(false)
  };

  const hideDatePickerFrom = () => {
    setChooseFrom(false);
  };

  const handleConfirmFrom = date => {
    setFromDate(utils.getHourFromDate(date));
    hideDatePickerFrom();
  };

  const hideDatePickerTo = () => {
    setChooseTo(false);
  };

  const handleConfirmTo = date => {
    setToDate(utils.getHourFromDate(date));
    hideDatePickerTo();
  };

  const addEvent = () => {
    onCancel();
    const newFromDate = new Date(dateFrom.slice(6,10),dateFrom.slice(3,5),dateFrom.slice(0,2),timeFrom.slice(0,2),timeFrom.slice(3,5))
    console.log(newFromDate)
    const newEndDate = new Date(dateEnd.slice(6,10),dateEnd.slice(3,5),dateEnd.slice(0,2),timeEnd.slice(0,2),timeEnd.slice(3,5))
    console.log(newEndDate)

    
    const event = {
      id: id,
      color: 'red',
      describe: description,
      start: newFromDate,
      end: newEndDate,
    };

    console.log(event)

    setVisible(false)

    return onOk(event);

  };

  const renderItemPicker = () => {
    return COLORS.map(item => {
      return <Picker.Item key={item} label={item} value={item} color={item} />;
    });
  };


  // useEffect(() => {
  //   setFromDate(from);
  //   setToDate(to);
  //   console.log('from', from);
  //   console.log('to', to);
  //   console.log('fromDate', fromDate);
  //   console.log('toDate', toDate);
  // }, [from, to]);


  return (
    <Modal isVisible={isVisible} style={{ alignItems: 'center', flex: 1, margin: 0 }}>
      <View style={{ backgroundColor: '#fff', borderRadius: 10, width: '80%' }}>
        <View style={{ flexDirection: 'row', marginTop: 20 }}>
          <TouchableOpacity style={{ flex: 1, marginLeft: 20, height: 40, width: 40 }} onPress={() => { setVisible(false), onCancel() }}>
            <Image source={require('./src/images/close.png')} style={{ height: 20, width: 20 }} />
          </TouchableOpacity>
          <TouchableOpacity style={{ backgroundColor: '#0080FF', paddingLeft: 12, paddingRight: 12, paddingBottom: 8, paddingTop: 8, marginRight: 20, borderRadius: 5 }} onPress={addEvent}>
            <Text style={{ color: '#fff' }}>Lưu</Text>
          </TouchableOpacity>
        </View>
        <View style={{ borderBottomWidth: 1, borderColor: '#ccc' }}>
          <View style={{ marginLeft: 40 }}>
            <TextInput
              style={{ height: 40, fontSize: 20, paddingVertical: 0, fontWeight: '600' }}
              placeholder='Thêm Tiêu Đề'
              onChangeText={(value) => setDescription(value)}
              />
          </View>
        </View>
        <ScrollView>
          <View style={{ flex: 1 }}>
            <View style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingTop: 10, paddingBottom: 10 }}>
              <View style={{ marginLeft: 20, marginRight: 20 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ width: 40 }}>
                    <Image source={require('./src/images/clock.png')} style={{ height: 20, width: 20 }} />
                  </View>
                  <View style={{ marginLeft: 20, flex: 1 }}>
                    <Text>Cả ngày</Text>
                  </View>
                  <View>
                    <ToggleSwitch
                      isOn={false}
                      onColor="#2E9AFE"
                      offColor="#BDBDBD"
                      size="small"
                      onToggle={isOn => console.log("changed to : ", isOn)}
                    />
                  </View>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <View style={{ width: 40 }}>
                    {/* <Image source={require('./src/images/clock.png')} style={{ height: 20, width: 20 }} /> */}
                  </View>
                  <TouchableOpacity style={{ marginLeft: 20, flex: 1 }} onPress={onShowDateFrom}>
                    <Text style={styles.tvTime}>{dateFrom}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onShowTimeFrom}>
                    <Text style={styles.tvTime}>{timeFrom}</Text>
                  </TouchableOpacity>
                </View>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                  <View style={{ width: 40 }}>
                    {/* <Image source={require('./src/images/clock.png')} style={{ height: 20, width: 20 }} /> */}
                  </View>
                  <TouchableOpacity style={{ marginLeft: 20, flex: 1 }} onPress={() => onShowDateFrom(true)}>
                    <Text style={styles.tvTime}>{dateEnd}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => onShowTimeFrom(true)}>
                    <Text style={styles.tvTime}>{timeEnd}</Text>
                  </TouchableOpacity>
                </View>

                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <View style={{ width: 40 }}>
                    <Image source={require('./src/images/replay.png')} style={{ height: 20, width: 20 }} />
                  </View>
                  <View style={{ marginLeft: 20 }}>
                    <Text style={styles.tvTime}>Không lặp lại</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingTop: 10, paddingBottom: 10 }}>
              <View style={{ marginLeft: 20, marginRight: 20 }}>
                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <View style={{ width: 40 }}>
                    <Image source={require('./src/images/member.png')} style={{ height: 20, width: 20 }} />
                  </View>
                  <View style={{ marginLeft: 20 }}>
                    <Text style={styles.tvTime}>Thêm người</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingTop: 10, paddingBottom: 10 }}>
              <View style={{ marginLeft: 20, marginRight: 20 }}>
                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <View style={{ width: 40 }}>
                    <Image source={require('./src/images/marker.png')} style={{ height: 20, width: 20 }} />
                  </View>
                  <View style={{ marginLeft: 20 }}>
                    {/* <Text style={styles.tvTime}>Thêm vị trí</Text> */}
                    <Text style={styles.tvTime}>Hồ Chí Minh</Text>
                    <Text style={[styles.tvTime, { color: '#ccc' }]}>Hồ Chí Minh, Việt Nam</Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{ marginTop: 10, marginBottom: 10 }}>
                <Image source={{ uri: 'https://image.thanhnien.vn/768/uploaded/minhnguyet/2018_07_31/toanha_ztfy.jpg' }} style={{ height: 180, resizeMode: 'cover' }} />
              </View>
            </View>
            <View style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingTop: 10, paddingBottom: 10 }}>
              <View style={{ marginLeft: 20, marginRight: 20 }}>
                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <View style={{ width: 40 }}>
                    <Image source={require('./src/images/notification.png')} style={{ height: 20, width: 20 }} />
                  </View>
                  <View style={{ marginLeft: 20 }}>
                    <Text style={styles.tvTime}>Thêm thông báo</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingTop: 10, paddingBottom: 10 }}>
              <View style={{ marginLeft: 20, marginRight: 20 }}>
                <TouchableOpacity style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <View style={{ width: 40 }}>
                    <View style={{ height: 20, width: 20, backgroundColor: 'red', borderRadius: 20 / 2 }} />
                  </View>
                  <View style={{ marginLeft: 20 }}>
                    <Text style={styles.tvTime}>Màu mặc định</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            {/* <View style={{ borderBottomWidth: 1, borderColor: '#ccc', paddingTop: 10, paddingBottom: 10, justifyContent: 'center' }}>
              <View style={{ marginLeft: 20, marginRight: 20 }}>
                <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                  <View style={{ width: 40 }}>
                    <Image source={require('./src/images/list.png')} style={{ height: 20, width: 20 }} />
                  </View>
                  <View style={{ marginLeft: 20, flex: 1, justifyContent: 'center' }}>
                    <TextInput
                      style={{ fontSize: 18, paddingVertical: 0, minHeight: 40, alignItems: 'center' }}
                      placeholder='Thêm mô tả'
                      multiline
                      onChangeText={(value) => setDescription(value)}
                    />
                  </View>
                </View>
              </View>
            </View> */}
          </View>
        </ScrollView>
        <DateTimePickerModal
          isVisible={showDate}
          mode={typeDate}
          onConfirm={handleConfirm}
          onCancel={() => setShowDate(false)}
        />
      </View>
    </Modal>
  )

  // return (
  //   <Modal visible={visible} transparent={true}>
  //     <View style={{flex: 1, backgroundColor: 'black', opacity: 0.5}} />
  //     <View
  //       style={{
  //         marginTop: '50%',
  //         alignSelf: 'center',
  //         position: 'absolute',
  //         width: '80%',
  //         justifyContent: 'center',
  //         backgroundColor: 'white',
  //         borderRadius: 20,
  //         paddingVertical: 50,
  //       }}>
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           marginBottom: 20,
  //         }}>
  //         <TouchableOpacity
  //           style={{
  //             borderWidth: 1,
  //             width: '90%',
  //             marginHorizontal: 20,
  //             padding: 10,
  //             borderRadius: 20,
  //             alignItems: 'center',
  //           }}
  //           onPress={() => setChooseFrom(true)}>
  //           <Text>{fromDate ? `${fromDate.h} : ${fromDate.m}` : 'From'}</Text>
  //         </TouchableOpacity>
  //         <DateTimePickerModal
  //           isVisible={chooseFrom}
  //           mode="datetime"
  //           onConfirm={handleConfirmFrom}
  //           onCancel={hideDatePickerFrom}
  //         />
  //       </View>

  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           marginBottom: 20,
  //         }}>
  //         <TouchableOpacity
  //           style={{
  //             borderWidth: 1,
  //             width: '90%',
  //             marginHorizontal: 20,
  //             padding: 10,
  //             borderRadius: 20,
  //             alignItems: 'center',
  //           }}
  //           onPress={() => setChooseTo(true)}>
  //           <Text>{toDate ? `${toDate.h} : ${toDate.m}` : 'To'}</Text>
  //         </TouchableOpacity>
  //         <DateTimePickerModal
  //           isVisible={chooseTo}
  //           mode="datetime"
  //           onConfirm={handleConfirmTo}
  //           onCancel={hideDatePickerTo}
  //         />
  //       </View>

  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           alignItems: 'center',
  //           marginBottom: 20,
  //           marginHorizontal: 20,
  //         }}>
  //         <Text style={{fontSize: 16, fontWeight: 'bold'}}>Color: </Text>
  //         <Picker
  //           selectedValue={color}
  //           style={{height: 150, width: '85%'}}
  //           itemStyle={{
  //             height: 150,
  //             borderWidth: 1,
  //             borderRadius: 20,
  //             backgroundColor: 'grey',
  //           }}
  //           onValueChange={value => {
  //             setColor(value);
  //           }}>
  //           {renderItemPicker()}
  //         </Picker>
  //       </View>
  //       <TextInput
  //         style={{
  //           borderWidth: 1,
  //           width: '90%',
  //           marginHorizontal: 20,
  //           borderRadius: 20,
  //           height: '30%',
  //           padding: 10,
  //         }}
  //         value={description}
  //         onChangeText={text => {
  //           setDescription(text);
  //         }}
  //         placeholder="Enter event description"
  //       />
  //       <View
  //         style={{
  //           flexDirection: 'row',
  //           justifyContent: 'center',
  //           marginTop: 30,
  //         }}>
  //         <TouchableOpacity
  //           onPress={addEvent}
  //           style={{
  //             borderWidth: 1,
  //             marginHorizontal: 20,
  //             padding: 10,
  //             borderRadius: 20,
  //             width: 100,
  //             alignItems: 'center',
  //           }}>
  //           <Text>Ok</Text>
  //         </TouchableOpacity>
  //         <TouchableOpacity
  //           onPress={onCancel}
  //           style={{
  //             borderWidth: 1,
  //             width: 100,
  //             marginHorizontal: 20,
  //             padding: 10,
  //             borderRadius: 20,
  //             alignItems: 'center',
  //           }}>
  //           <Text>Cancel</Text>
  //         </TouchableOpacity>
  //       </View>
  //     </View>
  //   </Modal>
  // );
});

export default Popup;



const styles = StyleSheet.create({
  tvTime: {
    fontSize: 20,
    color: '#000'
  }
})