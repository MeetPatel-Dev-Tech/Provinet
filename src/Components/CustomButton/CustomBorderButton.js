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
    <TouchableOpacity onPress={onPress} activeOpacity={0.7}>
      <View
        style={[
          styles.Button,
          {
            backgroundColor: isGrayBackground
              ? Constant.primaryGray
              : Constant.white,
            shadowColor: 'black',
            shadowOffset: { width: 2, height: 5 },
            shadowOpacity: 1,
            shadowRadius: 2,
            elevation: 2,
          },
        ]}>
        <Text
          style={[
            styles.Buttontext,
            {
              color: isBlack ? Constant.black : Constant.darkturquoise,
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
    borderColor: Constant.darkturquoise,
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
