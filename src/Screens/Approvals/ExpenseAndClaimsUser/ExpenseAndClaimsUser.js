import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, Dimensions, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native";
import Constant from '../../../CommonFiles/Constant';
import { CalenderDate, Category2, Reciept, Rupee2 } from '../../../CommonFiles/SvgFile';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../../Components/CustomButton/CustomButton';
import { ExpenseAndClaimsssss } from '../../../Navigation/TopTab/TopTabNavigation';

export default function ExpenseAndClaimsUser({ navigation }) {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Constant.darkturquoise }}>
            <View style={{
                marginTop: 10,
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15
            }}>
                <View style={{ marginTop: 8, flex: 1 }}>
                    <ExpenseAndClaimsssss />
                </View>
            </View>
        </SafeAreaView>
    )
}