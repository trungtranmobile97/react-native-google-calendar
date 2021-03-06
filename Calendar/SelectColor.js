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
	ScrollView,
	FlatList
} from 'react-native';
import Modal from 'react-native-modal';


const SelectColor = forwardRef((props, ref) => {

	const { onSelect } = props
	const colors = 
		[
			{ label: 'Màu đỏ cà chua', value: '#FF0000' },
			{ label: 'Màu cam', value: '#FF8000' },
			{ label: 'Màu chuối', value: '#FFFF00' },
			{ label: 'Màu mặc định', value: '#00BFFF'},
		]

	const [isVisible, setVisible] = useState(false);

	useImperativeHandle(ref, () => {
		return {
			onSelectColor: () => onShow(),
		};
	});



	onShow = () => {
		setVisible(true)
	}


	_selectColor = (item) => {
		setVisible(false)
		onSelect(item)
	}


	renderColor = ({item, index}) => {
		return (
			<TouchableOpacity style={{marginBottom: 10}} onPress={() => _selectColor(item)}>
				<View style={{flexDirection:'row'}}>
					<View style={{height: 25, width: 25, borderRadius: 25/2, backgroundColor: item.value}}>

					</View>
					<View style={{marginLeft: 10}}>
						<Text>{item.label}</Text>
					</View>
				</View>
			</TouchableOpacity>
		)
	}


	return (
		<View>
			<Modal
				 isVisible={isVisible}
				 style={{alignItems:'center'}}
				 onBackdropPress={() => setVisible(false)}
			 >
				<View style={{ backgroundColor: '#FFF', paddingTop: 10, paddingBottom: 10, borderRadius: 5, paddingLeft: 12, paddingRight: 12, width: 400}}>
					<FlatList
						data={colors}
						renderItem={this.renderColor}
						keyExtractor={(item, index) => index.toString()}
					/>
				</View>
			</Modal>
		</View>
	)

})

export default SelectColor