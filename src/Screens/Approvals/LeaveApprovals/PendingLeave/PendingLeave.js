import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, Dimensions, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native";
import Constant from '../../../../CommonFiles/Constant';
import { CancelIcon, Eye, Right } from '../../../../CommonFiles/SvgFile';

export default function PendigLeave() {


    const data = [
        { id: 1, name: 'meet', status: 'pending', leaverType: 'Sick', date: "March 25 - March 27 2018" },
        { id: 2, name: 'hiren', status: 'pending', leaverType: 'Sick', date: "March 25 - March 27 2018" },
        { id: 3, name: 'tejas', status: 'pending', leaverType: 'Sick', date: "March 25 - March 27 2018" },
        { id: 4, name: 'arpit', status: 'pending', leaverType: 'Sick', date: "March 25 - March 27 2018" },
        { id: 5, name: 'vrutik', status: 'pending', leaverType: 'Sick', date: "March 25 - March 27 2018" },
        { id: 6, name: 'yash', status: 'pending', leaverType: 'Sick', date: "March 25 - March 27 2018" },
    ]

    const renderpendingLeave = ({ item }) => {
        return (
            <View style={{
                padding: 15,
                backgroundColor: 'white',
                shadowColor: 'black',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 3,
                borderRadius: 10,
                marginHorizontal: 10,
                marginTop: 10,
                marginBottom: 10
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={{ flex: 1 }}>
                        <Text style={{ fontWeight: 'bold' }}>{item.name}</Text>
                        <Text style={{ marginTop: 5, color: 'gray' }}>{item.leaverType}</Text>
                        <Text style={{ marginTop: 5, color: 'gray' }}>{item.date}</Text>
                    </View>
                    <View>
                        <View style={{
                            backgroundColor: '#FBF7EB', padding: 5, borderRadius: 5,
                            shadowColor: 'black',
                            shadowOffset: { width: 2, height: 5 },
                            shadowOpacity: 1,
                            shadowRadius: 2,
                            elevation: 3, justifyContent: 'center'
                        }}>
                            <Text style={{ color: '#E9BD1E', textAlign: 'center' }}>{item.status}</Text>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <View style={{
                                backgroundColor: '#B5F5D1', padding: 5, borderRadius: 5,
                                shadowColor: 'black',
                                shadowOffset: { width: 2, height: 5 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 3,
                            }}>
                                <Right height={15} width={15} />
                            </View>
                            <View style={{
                                backgroundColor: '#FFDCDC', padding: 5, borderRadius: 5,
                                shadowColor: 'black',
                                shadowOffset: { width: 2, height: 5 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 3, marginLeft: 5
                            }}>
                                <CancelIcon height={15} width={15} />
                            </View>
                            <View style={{
                                backgroundColor: '#F3F3F3', padding: 5, borderRadius: 5,
                                shadowColor: 'black',
                                shadowOffset: { width: 2, height: 5 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 3, marginLeft: 5
                            }}>
                                <Eye height={15} width={15} />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
        )
    }


    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>
            <View style={{}}>
                <FlatList
                    data={data}
                    renderItem={renderpendingLeave}
                />
            </View>
        </SafeAreaView>
    )
}