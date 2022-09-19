import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from "react-native";
import { GetApi } from '../../Api/Api';
import CommonStyle from '../../CommonFiles/CommonStyle'
import Constant from '../../CommonFiles/Constant';
import { CommonUtilsObj } from '../../Utils/CommonUtils';
import * as RootNavigation from '../../Navigation/RootNavigation';
import { Chats, Chat } from '../../CommonFiles/SvgFile';

// import Camera from 'react-native-facerecognition';
export default function AboutScreen({ navigation }) {

    const [dailyAttendance, setDailtAttendance] = useState('')


    useEffect(() => {

        // getCurrentAddressBasedOnLatLong();

        const unsubscribe = navigation.addListener('focus', () => {
            setTimeout(() => {
                getEmployePunchInOutDetails();
                //   Allpunchinout();
                //   WeeklyWorkingHour();
                // userDailyAttendance();
            }, 1000);
        });
        return unsubscribe;
    }, []);


    const getEmployePunchInOutDetails = async () => {
        const ResponseData = await GetApi(Constant.PunchInOutDetailsURL + CommonUtilsObj.EmployeDetails[0].user)
        console.log('GetEmployeDetails..........', ResponseData.data[1].image)
        setDailtAttendance(ResponseData.data[1].image)
    }

    return (
        <View style={styles.container}>

            <Text style={{ marginTop: 50 }} onPress={() => navigation.navigate('Attendance')}>hi</Text>
            <View style={{ marginTop: 30, height: 200, backgroundColor: 'red' }}>
                <Chats height={20} width={20} />
                <Chat height={20} width={20} />
            </View>
        </View>
    );



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});
