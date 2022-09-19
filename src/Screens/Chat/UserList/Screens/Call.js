import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native"
import Octicons from 'react-native-vector-icons/Octicons';
import ProgressLoader from 'rn-progress-loader';
import { io } from "socket.io-client";
import { useScrollToTop } from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { GetApi, PostApi } from '../../../../Api/Api';
import CommonStyle from '../../../../CommonFiles/CommonStyle';
import Constant from '../../../../CommonFiles/Constant';
import { navigationRef } from '../../../../Navigation/RootNavigation';
import { CommonUtilsObj } from '../../../../Utils/CommonUtils';
import { CallIcon, DownIcon, UpIcon, VideoCallIcon } from '../../../../CommonFiles/SvgFile';
import { CredentialsContext } from '../../../../Components/Context/CredentialsContext';

export default function Call({ navigation }) {

    const ref = React.useRef(null);
    // useScrollToTop(ref);
    useScrollToTop(React.useRef({
        scrollToTop: () => ref.current?.scrollToOffset({ offset: -100 }),
    }));
    const [loading, setLoading] = useState(false);
    const [userDetail, setUserDetail] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [count, setcount] = useState('');
    const [chatData, setChatData] = useState('');
    const [selectedTab, setSelectedTab] = useState('Chat');
    const { storeData, setStoreData } = useContext(CredentialsContext);

    let socket = io(Constant.socketLocationURL, {
        query: { id: CommonUtilsObj.EmployeDetails[0].user },
        reconnectionDelayMax: 1000,
    });

    useEffect(() => {
        getAllUserDetails();
    }, []);


    const getAllUserDetails = async () => {
        const Responsedata = await GetApi(Constant.socketIdURL + CommonUtilsObj.EmployeDetails[0].user)
        //  console.log('Responsedataaaaaaaa', Responsedata.data)
        setUserDetail(Responsedata.data);
        setUserSearch(Responsedata.data);
    }

    const onPress = (item) => {
        // // if (item.socketid != '') {
        // onEventPress(item);
        // navigation.navigate('Chat', {
        //     socketId: item.socketid,
        //     userFirstName: item.firstName,
        //     userLastName: item.lastName,
        //     userId: item.user,
        //     profilePic: item.profilepic
        // })
        // // }
    }
    const renderUserList = ({ item }) => {
        return (
            // <View style={{ marginHorizontal: 10, marginBottom: 25, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 10 }}>
                <View>
                    <Image source={item.profilepic == null ? require('../../../../Assets/Image/EmptyProfile.jpg')
                        :
                        { uri: Constant.getProfilePicURL + item.profilepic }}
                        style={{ width: 45, height: 45, borderRadius: 40, marginLeft: 5 }}
                    />
                    {/* {item.online == 'Y'  */}
                    <View style={{ position: 'absolute', bottom: 0, right: 0 }}>
                        {item.online == 'Y' ?
                            <UpIcon height={15} width={15} /> :
                            <DownIcon height={15} width={15} />
                        }
                    </View>
                    {/* } */}
                </View>
                <View style={{ flexDirection: 'row', paddingVertical: 10, flex: 1, alignItems: 'center', marginLeft: 15, borderBottomWidth: 0.2, borderColor: 'gray' }}>
                    <TouchableOpacity style={{ flex: 1 }}
                        onPress={() => { onPress(item) }}
                    >
                        <Text style={{ fontSize: 20, }}>{item.firstName} {item.lastName}</Text>
                        <Text style={{}}>message</Text>
                    </TouchableOpacity>
                    <View style={{ marginRight: 10, alignItems: 'baseline', flexL: 1, }}>
                        {item.online == 'Y' ?
                            <VideoCallIcon height={40} width={40} />
                            :
                            <CallIcon height={40} width={40} />
                        }
                    </View>
                </View>
            </View>
            // </View>
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
    const handleSearch = (e) => {
        console.log(e)
        // let { name, value } = e.target;
        setUserDetail(
            userSearch.filter((x) => {
                // console.log(x);
                if (JSON.stringify(x).toLowerCase().includes(e.toLowerCase())) {
                    return x;
                }
            }))
    }

    return (
        <SafeAreaView >
            <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            />
            <FlatList
                data={userDetail}
                ref={ref}
                renderItem={renderUserList}
                style={{ marginTop: storeData == false ? 60 : 0 }}
            />
            {/* <FlatList
                data={chatData}
                renderItem={renderCharData}
            /> */}
            {storeData == false &&
                <View style={{
                    position: 'absolute', width: '100%', top: 0,
                    alignItems: "center",
                    flexDirection: 'row',
                    backgroundColor: "white",
                    marginBottom: 5,
                    shadowColor: 'black',
                    shadowOffset: { width: 2, height: 5 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    elevation: 5
                }}>
                    <View style={{ marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => { setStoreData(true), getAllUserDetails() }}>
                            <MaterialCommunityIcons name='keyboard-backspace' size={30} color='black' />
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1 }}>
                        <TextInput
                            label="Search"
                            onChangeText={e => handleSearch(e)}
                            keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                            placeholder="Search..."
                            autoFocus={true}
                            style={{
                                height: 55,
                                //  margin: 12,
                                //  borderWidth: 1,
                                padding: 10,
                            }}
                        />
                    </View>
                </View>
            }
        </SafeAreaView>
    )
}