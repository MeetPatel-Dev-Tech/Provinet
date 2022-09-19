import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Entypo from 'react-native-vector-icons/Entypo';
import Constant from '../../CommonFiles/Constant';

export default function CustomButton({ text, onPress, isGrayBackground }) {
  return (
    <TouchableOpacity onPress={onPress}>
      <View
        style={[
          styles.Button,
          {
            backgroundColor: isGrayBackground
              ? Constant.primaryGray
              : Constant.darkturquoise,
          },
        ]}>
        <Text
          style={[
            styles.Buttontext,
            {
              color: isGrayBackground ? 'black' : 'white',
              fontWeight: isGrayBackground ? null : 'bold',
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
    paddingVertical: 17,
    paddingHorizontal: 15,
    borderRadius: 10,
  },
  Buttontext: {
    textTransform: 'uppercase',
    fontSize: 16,
    textAlign: 'center',
  },
});
