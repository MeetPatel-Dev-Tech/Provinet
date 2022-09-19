import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Constant from '../../CommonFiles/Constant';

export default function CustomBorderButton({
  text,
  onPress,
  isGrayBackground,
  isBlack,
  isAddIcon,
}) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.Button,
          {
            backgroundColor: isGrayBackground
              ? Constant.primaryGray
              : Constant.white,
          },
        ]}>
        <Text
          style={[
            styles.Buttontext,
            {
              color: isBlack ? Constant.black : Constant.primaryGreen,
              // fontWeight: isGrayBackground && 'bold',
              fontSize: isAddIcon ? 25 : 16,
            },
          ]}>
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  Button: {
    alignItems: 'center',
    justifyContent: 'center',
    borderColor: '#47CA6C',
    borderRadius: 10,
    borderWidth: 1,
    backgroundColor: 'white',
    height: 55,
  },
  Buttontext: {
    color: Constant.primaryGreen,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
  },
});
