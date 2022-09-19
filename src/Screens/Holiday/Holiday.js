import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, SliderBase, Alert } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressLoader from 'rn-progress-loader';
import moment from 'moment';
import { GetApi } from '../../Api/Api';
import CommonStyle from '../../CommonFiles/CommonStyle';
import Constant from '../../CommonFiles/Constant';
import { ErrorToast } from '../ToastMessage/Toast';


export default function Holiday() {

    const [holidays, setHolidays] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getHolidays();
    }, []);

    const getHolidays = async () => {
        setLoading(true);
        const responseData = await GetApi(Constant.HolidayURL)
        console.log('Holidays', responseData.data)
        if (responseData.status == 'success') {
            setHolidays(responseData.data);
            setLoading(false);
            console.log('<<<<Holidays>>>>', responseData.data)
        } else {
            setLoading(false);
            ErrorToast(responseData.message)
        }
    }

    const renderHolidayCard = ({ item }) => {
        return (
            <View style={{
                flex: 1,
                padding: 10,
                backgroundColor: "white",
                marginBottom: 10,
                marginTop: 10,
                marginHorizontal: 20,
                backgroundColor: 'white', borderRadius: 20, shadowColor: 'black',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 5
            }}>
                <View style={{ justifyContent: 'center' }}>
                    <Text style={{ fontSize: 18, color: 'black' }}>Date : <Text style={{ fontSize: 18, color: 'gray', fontWeight: 'bold' }}>
                        {moment(item.date).format('DD-MM-yyyy')} </Text>
                    </Text>
                    <Text style={{ fontSize: 18, color: 'black' }}>Name : <Text style={{ color: 'gray', fontSize: 18, fontWeight: 'bold' }}>{item.name}</Text> </Text>
                </View>

            </View>
        )
    }

    return (
        <SafeAreaView style={CommonStyle.SafeAreaView}>
            <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            />
            {!loading &&
                <FlatList
                    data={holidays}
                    renderItem={renderHolidayCard}
                />
            }
        </SafeAreaView>
    )
}