import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, Dimensions, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native";
import Constant from '../../../CommonFiles/Constant';
import { CalenderDate, Category2, Reciept, Rupee2 } from '../../../CommonFiles/SvgFile';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../../Components/CustomButton/CustomButton';

export default function ExpenseAndClaimsDetails({ navigation }) {

    const data = [
        { id: 1, name: 'Reciept', description: 'profile', image: <Reciept height={25} width={25} /> },
        { id: 2, name: 'Amount', description: '$12.00', image: <Rupee2 height={25} width={25} /> },
        { id: 3, name: 'Date', description: 'April 16th', image: <CalenderDate height={25} width={25} /> },
        { id: 4, name: 'Category', description: 'Meal', image: <Category2 height={25} width={25} /> },
        { id: 5, name: 'Description', description: 'Coffee with candidate..', image: <Reciept height={25} width={25} /> },
    ]

    const renderBackClr = (name) => {
        if (name == 'Reciept') {
            return '#F2F0FD'
        } else if (name == 'Amount') {
            return '#CCFFFD'
        } else if (name == 'Date') {
            return '#FBF7EB'
        } else if (name == 'Category') {
            return '#FFF2FA'
        } else if (name == 'Description') {
            return '#F2F0FD'
        }
    }

    const RenderAprrovalList = ({ item }) => {
        return (
            // <TouchableOpacity onPress={() => onPressEvent(item.name)} activeOpacity={0.95}>
            <View style={{
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

                    }}>
                        <Text style={{}}>{item.description}</Text>
                    </View>
                </View>
            </View>
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
                <View style={{ justifyContent: 'flex-end', marginHorizontal: 20, flex: 1, marginBottom: 20 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View style={{ flex: 1, marginRight: 20 }}>
                            <CustomBorderButton text='WithDraw' onPress={() => navigation.navigate('ExpenseAndClaims')} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <CustomButton text='Edit' onPress={() => navigation.navigate('Attechment')} />
                        </View>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    )
}