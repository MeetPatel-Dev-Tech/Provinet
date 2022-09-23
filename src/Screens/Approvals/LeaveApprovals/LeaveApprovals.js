import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, Dimensions, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native";
import Constant from '../../../CommonFiles/Constant';
import { CalendarTabs } from '../../../Navigation/TopTab/TopTabNavigation';

export default function LeaveApprovals() {



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Constant.darkturquoise }}>
            <View style={{
                marginTop: 10,
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15
            }}>
                <View style={{ marginHorizontal: 10, flex: 1, marginTop: 5 }}>
                    <CalendarTabs />
                </View>
            </View>
        </SafeAreaView>
    )
}