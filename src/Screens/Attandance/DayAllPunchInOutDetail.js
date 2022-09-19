import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, FlatList, Image } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import { GetApi } from '../../Api/Api';
import CommonStyle from '../../CommonFiles/CommonStyle';
import Constant from '../../CommonFiles/Constant';
import { CommonUtilsObj } from '../../Utils/CommonUtils';

export default function DayAllPunchInOutDetail({ navigation }) {

    const [dailyAttendance, setDailtAttendance] = useState('')
    const [weeklyAttendance, setWeeklyAttendance] = useState('')
    const [selectedIndex, setSelectedIndex] = useState('')


    useEffect(() => {

        // getCurrentAddressBasedOnLatLong();

        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                getEmployePunchInOutDetails();
                //     // userDailyAttendance();
            }, 1000);
        });
        return unsubscribe;
    }, []);

    const decimalToHours = (decimalTimeString) => {
        if (
            decimalTimeString == "NaN" ||
            decimalTimeString == null ||
            decimalTimeString == undefined
        ) {
            return "0 Hrs 0 Mins";
        } else {
            var decimalTime = parseFloat(decimalTimeString);
            decimalTime = decimalTime * 60 * 60;
            var hours = Math.floor(decimalTime / (60 * 60));
            decimalTime = decimalTime - hours * 60 * 60;
            var minutes = Math.floor(decimalTime / 60);
            decimalTime = decimalTime - minutes * 60;
            var seconds = Math.round(decimalTime);
            return `${hours} Hrs ${minutes} Mins`;
        }
    };

    const Allpunchinout = async () => {
        const ResponseData = await GetApi(Constant.AllPunchOutURL + CommonUtilsObj.EmployeDetails[0].user)
        console.log('AllPunchInOut', ResponseData)
    }
    // const userDailyAttendance = async () => {
    //     const ResponseData = await GetApi(Constant.DailyAttendanceURL + CommonUtilsObj.EmployeDetails[0].user)
    //     console.log('userDailyAttendance', ResponseData)
    // }

    // const getAddress = async (latitude, longitude) => {

    //     // "latitude": "37.4217937", "longitude": "-122.083922"
    //     let response = await GetApi(
    //         `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Constant.KGoogleMapAPIKey}`,
    //     );
    //     console.log('ResLocation---------------', JSON.stringify(response));
    //     //   return String(response.results[0].formatted_address)

    // }

    // const getCurrentAddressBasedOn = (latitude, longitude) => {
    //     const data = getAddress(latitude, longitude);
    //     return data
    // };

    const getEmployePunchInOutDetails = async () => {
        const ResponseData = await GetApi(Constant.PunchInOutDetailsURL + CommonUtilsObj.EmployeDetails[0].user)
        console.log('GetEmployeDetails..........', ResponseData.data)
        setDailtAttendance(ResponseData.data)
    }


    const renderAttendanceList = ({ item }) => {
        return (
            <View style={{
                flex: 1,
                padding: 10,
                marginBottom: 10,
                marginTop: 10,
                marginHorizontal: 20,
                backgroundColor: 'white', borderRadius: 20, shadowColor: 'black',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 5,
            }}>
                <Text style={{ textAlign: 'center', fontSize: 16, color: 'black', fontWeight: 'bold' }}>
                    {moment(item.date).format('dddd Do MMMM, YYYY')}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            userid :
                        </Text>
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            intime :
                        </Text>
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            outtime :
                        </Text>
                        <Text style={{ fontSize: 16, color: 'black' }}>
                            Hours :
                        </Text>
                        {/* <Text style={{ fontSize: 16, color: 'black' }}>
                            PunchInLocation :
                        </Text> */}
                    </View>
                    <View style={{ marginLeft: 10 }}>
                        <Text style={{ fontSize: 16, }}>
                            {item.userid}
                        </Text>
                        <Text style={{ fontSize: 16, }}>
                            {moment(item.intime, 'hh:mm').format('hh:mm')}
                        </Text>
                        <Text style={{ fontSize: 16, }}>
                            {item.outtime == null ? '' : moment(item.outtime, 'hh:mm').format('hh:mm')}
                        </Text>
                        <Text style={{ fontSize: 16, }}>
                            {decimalToHours(item.dailyhour)}
                        </Text>
                        {/* <Text style={{ fontSize: 16, color: 'black' }}>
                            {item.address}
                        </Text> */}
                    </View>
                </View>
                <View >
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        PunchInLocation : <Text style={{ color: 'gray' }}>{item.address}</Text>
                    </Text>
                </View>
            </View>
        )
    }

    return (
        <View style={CommonStyle.SafeAreaView}>
            <View style={{}}>
                <FlatList showsVerticalScrollIndicator={false}
                    data={dailyAttendance}
                    renderItem={renderAttendanceList}
                />
            </View>
        </View>
    )
}

const style = StyleSheet.create({
    ButtonStyle: {
        width: '100%',
        marginTop: 5,
        borderRadius: 10,
        height: 50,
        backgroundColor: '#fff',
        shadowColor: "blue",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.18,
        shadowRadius: 2.62,
        elevation: 10,
    }
})