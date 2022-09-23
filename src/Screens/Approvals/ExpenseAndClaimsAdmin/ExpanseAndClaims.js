import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, Dimensions, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native";
import Constant from '../../../CommonFiles/Constant';
import Active from './Active';

export default function ExpenseAndClaims({ navigation }) {


    const [selectedTab, setSelectedTab] = useState('Active');

    const renderTabs = () => {
        if (selectedTab === 'Active') return <Active navigation={navigation} />;
        // else if (selectedTab === 'History')
        //     return <CreditScreen />;
        // else if (selectedTab === 'Debit') return <DebitScreen />;
        // else return;
    };

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Constant.darkturquoise }}>
            <View style={{
                marginTop: 10,
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15
            }}>
                <View style={{ marginHorizontal: 20, marginTop: 20, marginBottom: 5 }}>
                    <View style={{
                        flexDirection: 'row', alignItems: 'center', borderRadius: 5, shadowColor: 'black',
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 3, backgroundColor: 'white', borderWidth: 0.7, borderColor: 'gray'
                    }}>
                        <TouchableOpacity onPress={() => setSelectedTab('Active')}
                            style={{
                                // width: '49.5%',
                                alignItems: 'center',
                                backgroundColor: selectedTab == 'Active' ? Constant.darkturquoise : 'white',
                                padding: 5,
                                borderTopLeftRadius: 5,
                                borderBottomLeftRadius: 5, flex: 1
                            }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: selectedTab == 'Active' ? 'white' : 'black' }}>Active</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setSelectedTab('History')}
                            style={{
                                // width: '49.5%',
                                flex: 1,
                                alignItems: "center",
                                backgroundColor: selectedTab == 'History' ? Constant.darkturquoise : 'white',
                                padding: 5, borderTopRightRadius: 5, borderBottomRightRadius: 5
                            }}>
                            <Text style={{ fontSize: 16, fontWeight: 'bold', color: selectedTab == 'History' ? 'white' : 'black' }}>History</Text>
                        </TouchableOpacity>
                    </View>
                </View>
                <View style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
                    {renderTabs()}
                </View>
            </View>
        </SafeAreaView>
    )
}