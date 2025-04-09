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

    useEffect(() => {
        //  socketconnection();
    }, []);

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

    const socketconnection = () => {

        console.log('id', CommonUtilsObj.EmployeDetails[0].id)

        let socket = io(Constant.socketLocationURL, {
            query: { id: CommonUtilsObj.EmployeDetails[0].id },
            reconnectionDelayMax: 2000,
            transports: ['websocket']
        });

        socket.on('connect', () => {
            console.log('Connection Done');
        });

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

                <View style={{ justifyContent: 'flex-end', marginBottom: 20, flex: 1 }}>
                    <CustomButton text='logout' onPress={() => { onLogoutPress() }} />
                </View>

            </View>
        </SafeAreaView>
    )
}