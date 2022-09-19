import React, { useState, useEffect, useContext } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native"
import CommonStyle from '../../CommonFiles/CommonStyle';
import userDefaults from 'react-native-user-defaults';
import DefaultPreference from 'react-native-default-preference';
import { CredentialsContext } from '../../Components/Context/CredentialsContext';
import { io } from 'socket.io-client';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { navigationRef } from '../../Navigation/RootNavigation';
import { CommonUtilsObj } from '../../Utils/CommonUtils';
import Constant from '../../CommonFiles/Constant';

export default function ProfileScreen() {


    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext)

    console.log('<>', CommonUtilsObj.EmployeDetails[0])


    const onLogoutPress = () => {

        setTimeout(() => {
            clearUserDetails()
        }, 1000);

        let socket = io(Constant.socketLocationURL, {
            query: { id: CommonUtilsObj.EmployeDetails[0].user },
            reconnectionDelayMax: 2000,
        });

        socket.emit('offline', CommonUtilsObj.EmployeDetails[0].user)
    }

    const clearUserDetails = () => {
        if (Platform.OS === 'android') {
            DefaultPreference.clear(Constant.KEmployeDetailsKey)
                .then(data => {
                    setStoredCredentials(null)
                    console.log('clear data...')
                })
                .catch(function (err) {
                    console.log(err);
                });
        } else {
            userDefaults
                .remove(Constant.KEmployeDetailsKey)
                .then(data => {
                    setStoredCredentials(null)
                    console.log('clear data...')
                });
        }
    };

    return (
        <SafeAreaView style={CommonStyle.SafeAreaView}>
            <View style={{ marginHorizontal: 20, flex: 1 }}>
                <Text>FirstName : {CommonUtilsObj.EmployeDetails[0].firstName}</Text>
                <Text>LastName : {CommonUtilsObj.EmployeDetails[0].lastName}</Text>
                <Text>MiddleName : {CommonUtilsObj.EmployeDetails[0].middleName}</Text>
                <Text>PhonrNumber : {CommonUtilsObj.EmployeDetails[0].PhoneNumber}</Text>
                <Text>BloodGroup : {CommonUtilsObj.EmployeDetails[0].bloodgroup}</Text>
                <Text>Position : {CommonUtilsObj.EmployeDetails[0].position}</Text>
                <Text>Nationality : {CommonUtilsObj.EmployeDetails[0].nationality}</Text>

                <View style={{ justifyContent: 'flex-end', marginBottom: 20, flex: 1 }}>
                    <CustomButton text='logout' onPress={() => { onLogoutPress() }} />
                </View>

            </View>
        </SafeAreaView>
    )
}