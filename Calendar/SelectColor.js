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
import Modal from 'react-native-modal';


const SelectColor = () => {


	return (
		<View>
			<Modal isVisible={true}>
				<View style={{ flex: 1, backgroundColor:'red', zIndex: 10000 }}>
					<Text>I am the modal content!</Text>
				</View>
			</Modal>
		</View>
	)

}

export default SelectColor