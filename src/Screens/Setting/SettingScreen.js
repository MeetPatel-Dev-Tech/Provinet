import moment from 'moment';
import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Slider, FlatList, Image } from 'react-native';
import SelectDropdown from 'react-native-select-dropdown'
import { GetApi } from '../../Api/Api';
import Constant from '../../CommonFiles/Constant';
import { CommonUtilsObj } from '../../Utils/CommonUtils';

export default function SettingScreen({ navigation }) {

    const [dailyAttendance, setDailtAttendance] = useState('')
    const [weeklyAttendance, setWeeklyAttendance] = useState('')
    const [selectedIndex, setSelectedIndex] = useState('')


    useEffect(() => {

        // getCurrentAddressBasedOnLatLong();

        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                //     getEmployePunchInOutDetails();
                //    Allpunchinout();
                //   WeeklyWorkingHour();
                //   usermonthlyworkinghour();
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
    const WeeklyWorkingHour = async () => {
        const ResponseData = await GetApi(Constant.WeeklyWorkingHoureURL + CommonUtilsObj.EmployeDetails[0].user)
        console.log('WeeklyWorkingHour', ResponseData.data)
        setWeeklyAttendance(ResponseData.data)
    }
    const usermonthlyworkinghour = async () => {
        const ResponseData = await GetApi(Constant.UsermonthlyworkinghourURL + CommonUtilsObj.EmployeDetails[0].user)
        console.log('usermonthlyworkinghour', ResponseData.data)
        setWeeklyAttendance(ResponseData.data)
    }

    const getEmployePunchInOutDetails = async () => {
        const ResponseData = await GetApi(Constant.PunchInOutDetailsURL + CommonUtilsObj.EmployeDetails[0].user)
        console.log('GetEmployeDetails..........', ResponseData.data)
        setDailtAttendance(ResponseData.data)
    }


    const renderWeeklyHourList = ({ item }) => {
        return (
            <View style={{ padding: 20, backgroundColor: 'orange', borderRadius: 10, marginTop: 20 }}>
                <View>
                    {/* <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>
                        {moment(item.date).format('DD/MM/YY')}
                    </Text> */}
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        Total hours : {decimalToHours(item.hours)}
                    </Text>
                    {/* <Text style={{ fontSize: 16, color: 'black' }}> */}
                    {/* minutes : {moment(item.minutes, 'hh:mm').format('hh:mm')} */}
                    {/* </Text> */}
                    {/* <Text style={{ fontSize: 16, color: 'black' }}>
                        outtime : {item.outtime == null ? '' : moment(item.outtime, 'hh:mm').format('hh:mm')}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        minutes : {item.minutes}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        latitude : {item.latitude}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        longitude : {item.longitude}
                    </Text> */}
                </View>
            </View>
        )
    }

    const renderAttendanceList = ({ item }) => {
        return (
            <View style={{ padding: 20, backgroundColor: 'orange', borderRadius: 10, marginTop: 20 }}>
                <View>
                    <Text style={{ textAlign: 'center', fontSize: 16, color: 'black' }}>
                        {moment(item.date).format('DD/MM/YY')}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        userid : {item.userid}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        intime : {moment(item.intime, 'hh:mm').format('hh:mm')}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        outtime : {item.outtime == null ? '' : moment(item.outtime, 'hh:mm').format('hh:mm')}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        Hours : {decimalToHours(item.dailyhour)}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        PunchInLocation : {item.address}
                    </Text>
                    {/* <Text style={{ fontSize: 16, color: 'black' }}>
                        latitude : {item.latitude}
                    </Text>
                    <Text style={{ fontSize: 16, color: 'black' }}>
                        longitude : {item.longitude}
                    </Text> */}
                </View>
            </View>
        )
    }

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>work in progress...</Text>
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