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
                Allpunchinout();
                WeeklyWorkingHour();
                usermonthlyworkinghour();
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


    const data = [
        'DailyReport',
        'WeeklyReport',
        'MonthlyReport',
    ]

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
        <View style={{ marginHorizontal: 20, marginBottom: 150 }}>
            <View style={{ marginTop: 20 }}>
                <Text style={{ fontSize: 20, textAlign: 'center', marginBottom: 10, color: 'green' }}>Attendence Details</Text>

                <SelectDropdown
                    data={data}
                    onSelect={(selectedItem, index) => {
                        setSelectedIndex(index);
                        getEmployePunchInOutDetails();
                        WeeklyWorkingHour();
                        console.log('..........')
                    }}
                    // buttonTextAfterSelection={(selectedItem, index) => {
                    //     console.log('vvvvvvvvv', selectedItem)
                    //     return selectedItem.value
                    // }}
                    rowTextForSelection={(item, index) => {
                        // text represented for each item in dropdown
                        // if data array is an array of objects then return item.property to represent item in dropdown
                        return item
                    }}
                    buttonStyle={style.ButtonStyle}
                    dropdownIconPosition='right'
                    renderSearchInputRightIcon={() =>
                        <Image source={require('../../Assets/Image/DropDown.png')} style={{ height: 20 }} />
                    }
                />
            </View>

            {selectedIndex == 0 &&
                <FlatList showsVerticalScrollIndicator={false}
                    data={dailyAttendance}
                    renderItem={renderAttendanceList}
                />}
            {selectedIndex == 1 &&
                <FlatList showsVerticalScrollIndicator={false}
                    data={weeklyAttendance}
                    renderItem={renderWeeklyHourList}
                />}
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