import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, ScrollView, TextInput, StatusBar, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native"
import Octicons from 'react-native-vector-icons/Octicons';
import ProgressLoader from 'rn-progress-loader';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { io } from "socket.io-client";
import { GetApi, PostApi } from '../../../Api/Api';
import CommonStyle from '../../../CommonFiles/CommonStyle';
import Constant from '../../../CommonFiles/Constant';
import { CommonUtilsObj } from '../../../Utils/CommonUtils';
import ChatListScreen from './Screens/ChatLisScreen';
import ContactsListScreen from './Screens/ContactsListScreen';
import { Contacts } from '../../../CommonFiles/SvgFile';

export default function UserList({ navigation }) {


    const [loading, setLoading] = useState(false);
    const [userDetail, setUserDetail] = useState('');
    const [count, setcount] = useState('');
    const [chatData, setChatData] = useState('');
    const [selectedTab, setSelectedTab] = useState('Chat');

    let socket = io(Constant.socketLocationURL, {
        query: { id: CommonUtilsObj.EmployeDetails[0].user },
        reconnectionDelayMax: 1000,
    });

    useEffect(() => {
        getAllUserDetails();
        socket.emit('getuserlist', CommonUtilsObj.EmployeDetails[0].user)

        socket.on('getList', async (response) => {
            console.log('response....', response)
            //   setcount(ex.result[0])
            //  setChatData(ex.result)
        })
    }, []);
    useEffect(() => {
        navigation.setOptions({
            // backgroundColor: 'pink',
            //    title: (route.params.userFirstName + ' ' + route.params.userLastName),
            headerLeft: () => (
                <>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' size={25} color='white' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: 'white' }}>Chat</Text>
                </>
            ),
            headerRight: () => (
                <>
                    <AntDesign name='search1' size={20} style={{ marginLeft: 5 }} color='white' />
                </>
            ),
        });
    }, [navigation]);

    const renderTabs = () => {
        if (selectedTab === 'Chat') return <ChatListScreen navigation={navigation} selectedTab={selectedTab} />;
        else if (selectedTab === 'Contacts')
            return <ContactsListScreen navigation={navigation} />;
        // else if (selectedTab === 'Debit') return <DebitScreen />;
        else return;
    };


    const getAllUserDetails = async () => {
        const Responsedata = await GetApi(Constant.socketIdURL + CommonUtilsObj.EmployeDetails[0].user)
        //  console.log('Responsedataaaaaaaa', Responsedata.data)
        setUserDetail(Responsedata.data)
    }

    const onPress = (item) => {
        // if (item.socketid != '') {
        onEventPress(item);
        navigation.navigate('Chat', {
            socketId: item.socketid,
            userFirstName: item.firstName,
            userLastName: item.lastName,
            userId: item.user,
            profilePic: item.profilepic
        })
        // }
    }

    // const renderUserList = ({ item }) => {
    //     return (
    //         <View style={{ marginHorizontal: 20, marginTop: 20, alignItems: 'center' }}>
    //             <TouchableOpacity onPress={() => {
    //                 onPress(item)

    //             }}>
    //                 <Text style={{ fontSize: 25 }}>{item.firstName} {item.lastName}</Text>
    //             </TouchableOpacity>
    //         </View>
    //     )
    // }
    const renderUserList = ({ item }) => {

        //  console.log('count.user', count.user, item.user)
        return (
            <View style={{ marginHorizontal: 10, marginBottom: 25 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Image source={item.profilepic == null ? require('../../../Assets/Image/EmptyProfile.jpg')
                            :
                            { uri: Constant.getProfilePicURL + item.profilepic }}
                            style={{ width: 45, height: 45, borderRadius: 40, marginLeft: 5 }}
                        />
                        {item.online == 'Y' &&
                            <View style={{ position: 'absolute', bottom: -5, right: -5 }}>
                                <Octicons name='dot-fill' size={25} color='green' />
                            </View>
                        }
                    </View>
                    <TouchableOpacity style={{ marginLeft: 25 }}
                        onPress={() => { onPress(item) }}
                    >
                        <Text style={{ fontSize: 20, }}>{item.firstName} {item.lastName}</Text>
                        <Text style={{}}>message</Text>
                    </TouchableOpacity>
                    {
                        count.user == item.user ?
                            <View style={{ flex: 1, alignItems: 'flex-end', marginRight: 10 }}>
                                <Text style={{ fontSize: 20, color: 'green' }}>{count.count}</Text>
                            </View>
                            :
                            <View>
                                <Text></Text>
                            </View>
                    }
                </View>
            </View>
        )
    }

    const onEventPress = async (item) => {
        const data = {
            fromuserid: CommonUtilsObj.EmployeDetails[0].user,
            touserid: item.user
        }
        const ResponseData = await PostApi(Constant.udateStatusURL, data, true)
        console.log('ResponseData', ResponseData)
    }

    const renderCharData = ({ item }) => {
        return (
            <View style={{ flex: 1 }}>
                <TouchableOpacity onPress={() => onEventPress(item)}>
                    <Text style={{ fontSize: 20 }}>{item.firstName}</Text>
                </TouchableOpacity>
            </View>
        )
    }

    return (
        <SafeAreaView style={[CommonStyle.SafeAreaView, { backgroundColor: Constant.darkturquoise }]} >
            <StatusBar backgroundColor={Constant.darkturquoise} />
            <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            />
            <View style={{ padding: 10, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 20, marginTop: -15 }}>
                <TouchableOpacity onPress={() => setSelectedTab('Chat')} style={{ flex: 1, alignItems: 'center', marginTop: selectedTab == 'Chat' ? 15 : 0 }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Chat</Text>
                    <View style={selectedTab == 'Chat' && { height: 2, width: '100%', marginTop: 14, backgroundColor: 'white' }}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab('Contacts')} style={{ flex: 1, alignItems: 'center', marginTop: selectedTab == 'Contacts' ? 15 : 0 }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Contacts</Text>
                    <View style={selectedTab == 'Contacts' && { height: 2, width: '100%', marginTop: 14, backgroundColor: 'white' }}></View>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setSelectedTab('Status')} style={{ flex: 1, alignItems: 'center', marginTop: selectedTab == 'Status' ? 15 : 0 }}>
                    <Text style={{ color: 'white', fontSize: 16 }}>Groups</Text>
                    <View style={selectedTab == 'Status' && { height: 2, width: '100%', marginTop: 14, backgroundColor: 'white' }}></View>
                </TouchableOpacity>
            </View>
            <View style={{
                flex: 1,
                borderTopLeftRadius: 20,
                borderTopRightRadius: 20, backgroundColor: 'white', shadowColor: 'black',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 15,
            }} showsVerticalScrollIndicator={false}>
                {renderTabs()}
            </View>
            {selectedTab == 'Chat' &&
                <View style={{ position: 'absolute', bottom: 20, right: 20, }}>
                    {/* <Text>ms</Text> */}
                    <Contacts height={70} width={70} />
                </View>
            }

        </SafeAreaView>
    )
}