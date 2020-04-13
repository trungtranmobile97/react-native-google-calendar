import React, {
  useState,
  createRef,
  useEffect,
  forwardRef,
  useImperativeHandle,
} from 'react';
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
  ScrollView,
} from 'react-native';
import {Picker} from '@react-native-community/picker';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import utils from './utils';
import moment from 'moment';

import Modal from 'react-native-modal';

// import Modal, { ModalContent } from 'react-native-modals';

import ToggleSwitch from 'toggle-switch-react-native';

const COLORS = ['red', 'green', 'blue', 'black', 'yellow', 'pink', 'purple'];

const Popup = forwardRef((props, ref) => {
  const {visible, onOk, onCancel, id = 0, from = null, to = null} = props;

  const [fromDate, setFromDate] = useState(null);
  const [toDate, setToDate] = useState(null);
  const [color, setColor] = useState(COLORS[2]);
  const [description, setDescription] = useState('');
  const [chooseFrom, setChooseFrom] = useState(false);
  const [chooseTo, setChooseTo] = useState(false);
  const [showDate, setShowDate] = useState(false);
  const [typeDate, setTypeDate] = useState('date');
  const [typeEvent, setTypeEvent] = useState('from');

  const [isVisible, setVisible] = useState(false);

  useImperativeHandle(ref, () => {
    return {
      onShowModal: () => onShow(),
    };
  });

  const onShow = () => {
    setVisible(true);
  };

  const onShowDateFrom = () => {
    setTypeDate('date');
    setShowDate(true);
    setTypeEvent('from');
  };

  const onShowTimeFrom = () => {
    setTypeDate('time');
    setShowDate(true);
    setTypeEvent('from');
  };

  const hideDatePicker = () => {
    setChooseDay(false);
  };

  const handleConfirm = date => {
    console.log(date);
    setShowDate(false);
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
        </View>
        <View style={{borderBottomWidth: 1, borderColor: '#ccc'}}>
          <View style={{marginLeft: 40}}>
            <TextInput
              style={{
                height: 40,
                fontSize: 20,
                paddingVertical: 0,
                fontWeight: '600',
              }}
              placeholder="Thêm Tiêu Đề"
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
                  <View style={{marginLeft: 20, flex: 1}}>
                    <Text>Cả ngày</Text>
                  </View>
                  <View>
                    <ToggleSwitch
                      isOn={false}
                      onColor="#2E9AFE"
                      offColor="#BDBDBD"
                      size="small"
                      onToggle={isOn => console.log('changed to : ', isOn)}
                    />
                  </View>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}>
                  <View style={{width: 40}}>
                    {/* <Image source={require('./src/images/clock.png')} style={{ height: 20, width: 20 }} /> */}
                  </View>
                  <TouchableOpacity
                    style={{marginLeft: 20, flex: 1}}
                    onPress={onShowDateFrom}>
                    <Text style={styles.tvTime}>Th3, 14 thg 4 2020</Text>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={onShowTimeFrom}>
                    <Text style={styles.tvTime}>16:30</Text>
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginTop: 10,
                  }}
                  onPress={() => setShowDate(true)}>
                  <View style={{width: 40}}>
                    {/* <Image source={require('./src/images/clock.png')} style={{ height: 20, width: 20 }} /> */}
                  </View>
                  <View style={{marginLeft: 20, flex: 1}}>
                    <Text style={styles.tvTime}>Th3, 14 thg 4 2020</Text>
                  </View>
                  <View>
                    <Text style={styles.tvTime}>18:30</Text>
                  </View>
                </View>

                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <View style={{width: 40}}>
                    <Image
                      source={require('./src/images/replay.png')}
                      style={{height: 20, width: 20}}
                    />
                  </View>
                  <View style={{marginLeft: 20}}>
                    <Text style={styles.tvTime}>Không lặp lại</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#ccc',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View style={{marginLeft: 20, marginRight: 20}}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <View style={{width: 40}}>
                    <Image
                      source={require('./src/images/member.png')}
                      style={{height: 20, width: 20}}
                    />
                  </View>
                  <View style={{marginLeft: 20}}>
                    <Text style={styles.tvTime}>Thêm người</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#ccc',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View style={{marginLeft: 20, marginRight: 20}}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <View style={{width: 40}}>
                    <Image
                      source={require('./src/images/marker.png')}
                      style={{height: 20, width: 20}}
                    />
                  </View>
                  <View style={{marginLeft: 20}}>
                    {/* <Text style={styles.tvTime}>Thêm vị trí</Text> */}
                    <Text style={styles.tvTime}>Hồ Chí Minh</Text>
                    <Text style={[styles.tvTime, {color: '#ccc'}]}>
                      Hồ Chí Minh, Việt Nam
                    </Text>
                  </View>
                </TouchableOpacity>
              </View>
              <View style={{marginTop: 10, marginBottom: 10}}>
                <Image
                  source={{
                    uri:
                      'https://image.thanhnien.vn/768/uploaded/minhnguyet/2018_07_31/toanha_ztfy.jpg',
                  }}
                  style={{height: 180, resizeMode: 'cover'}}
                />
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#ccc',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View style={{marginLeft: 20, marginRight: 20}}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <View style={{width: 40}}>
                    <Image
                      source={require('./src/images/notification.png')}
                      style={{height: 20, width: 20}}
                    />
                  </View>
                  <View style={{marginLeft: 20}}>
                    <Text style={styles.tvTime}>Thêm thông báo</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#ccc',
                paddingTop: 10,
                paddingBottom: 10,
              }}>
              <View style={{marginLeft: 20, marginRight: 20}}>
                <TouchableOpacity
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <View style={{width: 40}}>
                    <View
                      style={{
                        height: 20,
                        width: 20,
                        backgroundColor: 'red',
                        borderRadius: 20 / 2,
                      }}
                    />
                  </View>
                  <View style={{marginLeft: 20}}>
                    <Text style={styles.tvTime}>Màu mặc định</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                borderBottomWidth: 1,
                borderColor: '#ccc',
                paddingTop: 10,
                paddingBottom: 10,
                justifyContent: 'center',
              }}>
              <View style={{marginLeft: 20, marginRight: 20}}>
                <View
                  style={{
                    flexDirection: 'row',
                    marginTop: 10,
                    alignItems: 'center',
                  }}>
                  <View style={{width: 40}}>
                    <Image
                      source={require('./src/images/list.png')}
                      style={{height: 20, width: 20}}
                    />
                  </View>
                  <View
                    style={{marginLeft: 20, flex: 1, justifyContent: 'center'}}>
                    <TextInput
                      style={{
                        fontSize: 18,
                        paddingVertical: 0,
                        minHeight: 40,
                        alignItems: 'center',
                      }}
                      placeholder="Thêm mô tả"
                      multiline
                    />
                  </View>
                </View>
              </View>
            </View>
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
  );

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
    color: '#000',
  },
});
