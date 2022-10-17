import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, Dimensions, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native";
import Modal from 'react-native-modal';
import { TextInput } from 'react-native-paper';
import Constant from '../../../CommonFiles/Constant';
import { CrossIcon, DownloadIcon, Plus } from '../../../CommonFiles/SvgFile';
import { navigationRef } from '../../../Navigation/RootNavigation';

export default function Active(props) {


    const data = [
        { id: 1, name: 'Report #77891', Rs: '2000', date: '03/03/19', status: 'Submitted' },
        { id: 2, name: 'Report #77891', Rs: '2000', date: '03/03/19', status: 'To be paid' },
        { id: 3, name: 'Report #77891', Rs: '2000', date: '03/03/19', status: 'Submitted' },
        { id: 4, name: 'Report #77891', Rs: '2000', date: '03/03/19', status: 'To be paid' },
        { id: 5, name: 'Report #77891', Rs: '2000', date: '03/03/19', status: 'Submitted' },
        { id: 6, name: 'Report #77891', Rs: '2000', date: '03/03/19', status: 'To be paid' },
        { id: 7, name: 'Report #77891', Rs: '2000', date: '03/03/19', status: 'Submitted' },
    ]

    const renderActiveExpanse = ({ item }) => {
        return (
            <TouchableOpacity onPress={() => { props.navigation.navigate('ExpenseAndClaimsDetails') }}
                style={{
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
                        <View style={{ marginTop: 5 }}>
                            <Text>{item.date}</Text>
                        </View>
                    </View>
                    <View>
                        <Text style={{ textAlign: 'right', fontWeight: 'bold' }}>Rs.{item.Rs}</Text>
                        <View style={{
                            marginTop: 5,
                            backgroundColor: item.status == 'Submitted' ? '#FBF7EB' : '#B5F5D1',
                            paddingHorizontal: 10, paddingVertical: 5, borderRadius: 10, marginRight: -5
                        }}>
                            <Text style={{ color: item.status == 'Submitted' ? '#E9BD1E' : '#439C58' }}>{item.status}</Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <View style={{ marginHorizontal: 10 }}>
                <FlatList
                    data={data}
                    renderItem={renderActiveExpanse}
                    showsVerticalScrollIndicator={false}
                />
            </View>
            <View style={{
                position: 'absolute', bottom: 20, right: 20, padding: 15,
                borderRadius: 40,
                backgroundColor: Constant.darkturquoise,
                shadowColor: 'black',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 3,
            }}>
                <TouchableOpacity onPress={() => props.navigation.navigate('Attechment')}>
                    <Plus height={20} width={20} />
                </TouchableOpacity>
            </View>

            {/* <Modal isVisible={true}
                swipeDirection='down'
                onSwipeComplete={() => {
                }}
                onBackdropPress={() => {
                }}
            >
                <View style={{ justifyContent: 'flex-end', flex: 1, marginBottom: -20, marginHorizontal: -20, }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 }}>
                        <View style={{ alignItems: 'center', }}>
                            <View style={{ height: 2, width: 40, backgroundColor: 'gray' }}></View>
                            <View style={{ height: 2, width: 40, backgroundColor: 'gray', marginTop: 2 }}></View>
                        </View>
                        <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 16 }}>Attachment</Text>
                        <View style={{
                            marginTop: 20,
                            height: 100,
                            backgroundColor: '#CCFFFD',
                            borderRadius: 10,
                            alignItems: 'center', justifyContent: 'center'
                        }}>
                            <DownloadIcon height={70} width={70} />
                        </View>
                        <TextInput
                            //   value={email}
                            mode="outlined"
                            label="Email"
                            // onChangeText={email => setEmail(email)}
                            keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                            placeholder="Enter Your Email"
                            theme={Constant.theme}
                            activeOutlineColor={Constant.darkturquoise}
                            style={{ marginTop: 20 }}
                        />
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 20 }}>
                            <View style={{ marginRight: 20, flex: 1 }}>
                                <TextInput
                                    //   value={email}
                                    mode="outlined"
                                    label="Email"
                                    // onChangeText={email => setEmail(email)}
                                    keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                    placeholder="Enter Your Email"
                                    theme={Constant.theme}
                                    activeOutlineColor={Constant.darkturquoise}
                                    style={{}}
                                />
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    //   value={email}
                                    mode="outlined"
                                    label="Email"
                                    // onChangeText={email => setEmail(email)}
                                    keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                    placeholder="Enter Your Email"
                                    theme={Constant.theme}
                                    activeOutlineColor={Constant.darkturquoise}
                                    style={{}}
                                />
                            </View>
                        </View>
                        <TextInput
                            //   value={email}
                            mode="outlined"
                            label="Email"
                            // onChangeText={email => setEmail(email)}
                            keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                            placeholder="Enter Your Email"
                            theme={Constant.theme}
                            multiline={true}
                            activeOutlineColor={Constant.darkturquoise}
                            numberOfLines={5}
                            style={{ marginTop: 20, height: 100 }}
                        />
                    </View>
                </View>
            </Modal> */}


        </SafeAreaView>
    )
}