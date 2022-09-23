import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, Dimensions, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native";
import Constant from '../../../CommonFiles/Constant';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { TextInput } from 'react-native-paper';
import { DownloadIcon } from '../../../CommonFiles/SvgFile';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../../Components/CustomButton/CustomButton';

export default function AddAttechment({ navigation }) {



    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Constant.darkturquoise }}>
            <View style={{
                marginTop: 10,
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15
            }}>
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ marginHorizontal: 20, marginTop: 10, flex: 1 }}>
                        <View style={{
                            marginTop: 20,
                            height: 110,
                            backgroundColor: '#CCFFFD',
                            borderRadius: 10,
                            alignItems: 'center', justifyContent: 'center',
                            borderWidth: 1,
                            borderStyle: 'dashed',
                            borderColor: Constant.darkturquoise,
                            shadowColor: 'black',
                            shadowOffset: { width: 2, height: 5 },
                            shadowOpacity: 0.2,
                            shadowRadius: 2,
                            elevation: 1,
                        }}>
                            <DownloadIcon height={70} width={70} />
                        </View>
                        <TextInput
                            //   value={email}
                            mode="outlined"
                            label="Amount"
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
                                    label="Date"
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
                                    label="Category"
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
                            label="Description"
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
                    <View style={{ marginHorizontal: 20, marginBottom: 20, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, marginRight: 20 }}>
                                <CustomBorderButton text='cancel' onPress={() => {
                                    navigation.goBack()
                                }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomButton text='save' onPress={() => {
                                    navigation.goBack()
                                }} />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    )
}