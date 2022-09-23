import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, Dimensions, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native";
import Constant from '../../CommonFiles/Constant';
import { Attendance2, Leave2, Ruppesign, TimeSheet } from '../../CommonFiles/SvgFile';

export default function Approvals({ navigation }) {

    const data = [
        { id: 1, name: 'Leave', image: <Leave2 height={25} width={25} />, count: '4' },
        { id: 2, name: 'Time Sheet', image: <TimeSheet height={25} width={25} />, count: '4' },
        { id: 3, name: 'Expense and Claims', image: <Ruppesign height={25} width={25} />, count: '4' },
        { id: 4, name: 'Attendance Regularization', image: <Attendance2 height={25} width={25} />, count: '4' },
    ]

    const renderBackClr = (name) => {
        if (name == 'Leave') {
            return '#F2F0FD'
        } else if (name == 'Time Sheet') {
            return '#FBF7EB'
        } else if (name == 'Expense and Claims') {
            return '#FFF2FA'
        } else if (name == 'Attendance Regularization') {
            return '#CCFFFD'
        }
    }
    const renderClr = (name) => {
        if (name == 'Leave') {
            return '#816DF0'
        } else if (name == 'Time Sheet') {
            return '#E9BD1E'
        } else if (name == 'Expense and Claims') {
            return '#A7196F'
        } else if (name == 'Attendance Regularization') {
            return '#00E6DF'
        }
    }

    const onPressEvent = (name) => {
        if (name == 'Leave') {
            navigation.navigate('LeaveApprovals')
        } else if (name == 'Time Sheet') {
            navigation.navigate('TimeSheet')
        } else if (name == 'Expense and Claims') {
            navigation.navigate('ExpenseAndClaimsUser')
        } else if (name == 'Attendance Regularization') {
            //    return '#00E6DF'
        }
    }

    const RenderAprrovalList = ({ item }) => {
        return (
            // <TouchableOpacity onPress={() => onPressEvent(item.name)} activeOpacity={0.95}>
            <TouchableOpacity onPress={() => onPressEvent(item.name)} activeOpacity={0.8}
                style={{
                    backgroundColor: 'white',
                    borderRadius: 20, padding: 20,
                    marginHorizontal: 10,
                    marginTop: 10,
                    marginBottom: 10,
                    shadowColor: 'black',
                    shadowOffset: { width: 2, height: 5 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    elevation: 3,
                }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{
                        backgroundColor: renderBackClr(item.name), padding: 5, borderRadius: 5,
                        shadowColor: 'black',
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 3,
                    }}>
                        {item.image}
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                    </View>
                    <View style={{
                        backgroundColor: renderBackClr(item.name), paddingHorizontal: 10, paddingVertical: 5, borderRadius: 20,
                        shadowColor: 'black',
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 3,
                    }}>
                        <Text style={{ color: renderClr(item.name) }}>{item.count}</Text>
                    </View>
                </View>
            </TouchableOpacity>
            // </TouchableOpacity>
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Constant.darkturquoise }}>
            <View style={{
                marginTop: 10,
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15
            }}>
                <View style={{ marginHorizontal: 10, marginTop: 10 }}>
                    <FlatList
                        data={data}
                        renderItem={RenderAprrovalList}
                    />

                </View>
            </View>
        </SafeAreaView>
    )
}