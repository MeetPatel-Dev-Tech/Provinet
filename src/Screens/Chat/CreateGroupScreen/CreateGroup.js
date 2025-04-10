import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, Animated, TextInput, FlatList, Keyboard, KeyboardAvoidingView, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressLoader from 'rn-progress-loader';
// import Animated, { FadeIn, FadeInLeft, Layout, RotateInDownLeft, Transition, ZoomIn, ZoomInDown, ZoomInRotate, ZoomOut } from "react-native-reanimated";
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { io } from "socket.io-client";
import { useScrollToTop } from '@react-navigation/native';
import { GetApi, PostApi } from '../../../Api/Api';
import CommonStyle from '../../../CommonFiles/CommonStyle';
import Constant from '../../../CommonFiles/Constant';
import { navigationRef } from '../../../Navigation/RootNavigation';
import { CommonUtilsObj } from '../../../Utils/CommonUtils';
import { CredentialsContext } from '../../../Components/Context/CredentialsContext';
import { Cancel, Chat, Chats, RoundIcon, Selected } from '../../../CommonFiles/SvgFile';
import { ErrorToast } from '../../ToastMessage/Toast';
import CustomButton from '../../../Components/CustomButton/CustomButton';

export default function CreateGroup({ navigation, route }) {

    const [loading, setLoading] = useState(false);
    const [userDetail, setUserDetail] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [userSearch1, setUserSearch1] = useState('');
    const [count, setcount] = useState('');
    const [chatData, setChatData] = useState('');
    const [selectedUserId, setSelectedUserId] = useState(route.params.status == 'create' ? [CommonUtilsObj.EmployeDetails[0].id] : []);
    const [selectedUserDetail, setSelectedUserDetail] = useState([]);
    const [selectedUserObj, setSelectedUserObj] = useState('');
    const { storeData, setStoreData } = useContext(CredentialsContext);
    const [search, setSearch] = useState(true);
    const [keyboardOpen, setKeyBoardOpen] = useState(false);
    const [preUseId, setPreUseId] = useState([]);


    console.log('<><>', selectedUserId)
    // console.log('Route', route.params.id)

    useEffect(() => {
        getAllUserDetails();
        getMemberList();
    }, []);

    useEffect(() => {
        navigation.setOptions({
            headerShown: search,
            headerRight: () => (
                <TouchableOpacity onPress={() => {
                    setSearch(false)
                }}>
                    <AntDesign name='search1' size={20} style={{ marginLeft: 5 }} color='white' />
                </TouchableOpacity>
            ),
        });
    }, [search]);

    useEffect(() => {
        const keyboardDidShowListener = Keyboard.addListener(
            'keyboardDidShow',
            () => {
                console.log('keyboardopen');
                setKeyBoardOpen(true);
            }
        );
        const keyboardDidHideListener = Keyboard.addListener(
            'keyboardDidHide',
            () => {
                console.log('keyboardhide');
                setKeyBoardOpen(false);
            }
        );

        return () => {
            keyboardDidHideListener.remove();
            keyboardDidShowListener.remove();
        };
    }, [Keyboard]);

    const getMemberList = async () => {
        console.log('route', route.params.id)
        const responseData = await GetApi(Constant.KGroupMemberList + route.params.id)
        console.log('respppp......', responseData.data)
        console.log('respppp......id', responseData.data)
        //    setUseId(responseData.data)
        const followingGroups = responseData.data
        let followingIds = (followingGroups.map(group => group.employee.id))
        setPreUseId(followingIds)
        //  console.log('followingIds', useId)
        console.log('followingIds', followingIds)
    }




    const getAllUserDetails = async () => {
        const Responsedata = await GetApi(Constant.GetEployeList)
        console.log('Responsedataaaaaaaa', Responsedata.data)
        setUserDetail(Responsedata.data)
        setUserSearch(Responsedata.data)
        setUserSearch1(Responsedata.data)
        // setSelectedUserDetail(Responsedata.data)
    }

    const onPressHandler = (id) => {
        let renderData = [...userDetail];
        for (let data of renderData) {
            if (data.id == id) {
                data.selected = (data.selected == null) ? true : !data.selected;
                break;
            }
        }
        setUserDetail(renderData);
        setUserSearch(renderData);
        setUserSearch1(renderData);
        // setSelectedUserDetail(renderData)
        // console.log('renderData', renderData)
    }

    const ud = (id) => {
        var result = preUseId.filter(function (o1) {
            return id.some(function (o2) {
                return o1 === o2.id; // return the ones with equal id
            });
        });
        console.log('results', result)
        return result
    }

    const renderUserList = ({ item, index }) => {
        return (
            <View style={{ marginHorizontal: 10, marginBottom: 10, marginTop: 5, flex: 1 }}>
                {item.firstName != null && item.lastName != null &&
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <View>
                            <Image source={item.profilepic == null ? require('../../../Assets/Image/EmptyProfile.jpg')
                                :
                                { uri: Constant.getProfilePicURL + item.profilepic }}
                                style={{ width: 45, height: 45, borderRadius: 40, marginLeft: 5 }}
                            />
                            {(item.selected == true || ud([item]) == item.id) &&
                                <View style={{ position: 'absolute', bottom: 0, right: -10 }}>
                                    <Selected height={25} width={25} />
                                </View>
                            }
                        </View>
                        <TouchableOpacity disabled={ud([item]) == item.id ? true : false} style={{ marginLeft: 25 }}
                            // onPress={() => { setAddUser([...addUser, item.user]) }}
                            onPress={() => { addUserDetail(item), addUserId(item.id), onPressHandler(item.id), setSearch(true) }}
                        >
                            <Text style={{ fontSize: 20, }}>{item.firstName} {item.lastName}</Text>
                            <Text style={{}}>message</Text>
                        </TouchableOpacity>
                    </View>
                }
            </View>
        )
    }

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 3000,
            useNativeDriver: true
        }).start();
    };


    const renderSelectedUserList = ({ item, index }) => {
        return (
            <View style={{
                justifyContent: 'center', paddingVertical: 10, alignItems: 'center', marginTop: 2
            }}
            // entering={ZoomIn}
            // exiting={FadeInLeft}
            // layout={Transition}
            >
                <View
                    style={{ marginRight: 10, marginLeft: 6, alignItems: 'center', }}>
                    <TouchableOpacity onPress={() => { addUserDetail(item), addUserId(item.id), onPressHandler(item.id) }} style={{ alignItems: 'center' }}>
                        <Image source={item.profilepic == null ? require('../../../Assets/Image/EmptyProfile.jpg')
                            :
                            { uri: Constant.getProfilePicURL + item.profilepic }}
                            style={{ width: 45, height: 45, borderRadius: 40, }}
                        />
                        {item.selected == true &&
                            <View style={{ position: 'absolute', bottom: 0, right: -10, }}>
                                <Cancel height={25} width={25} />
                            </View>
                        }
                    </TouchableOpacity>
                    <View>
                        <Text style={{ textAlign: "center" }}>{item.firstName}</Text>
                    </View>
                </View>


            </View>

        )
    }

    const addUserId = id => {
        //console.log('selectedSongID: ', selectedSongID);
        if (selectedUserId.length !== 0) {
            if (!selectedUserId.includes(id)) {
                setSelectedUserId([...selectedUserId, id]);
                //addSuccessMesage("id added to");
            } else {
                let newArr = selectedUserId.filter(i => i !== id);
                setSelectedUserId(newArr);
                //addErrorMesage("id removed ");
            }
        } else {
            let arr = [];
            arr.push(id);
            setSelectedUserId(arr);
            //addSuccessMesage("id added ");
        }
    };
    const addUserDetail = id => {
        //console.log('selectedSongID: ', selectedSongID);
        if (selectedUserObj.length !== 0) {
            if (!selectedUserObj.includes(id)) {
                setSelectedUserObj([...selectedUserObj, id]);
                setSelectedUserDetail([...selectedUserDetail, id])
                //addSuccessMesage("Song added to the playlist!");
            } else {
                let newArr = selectedUserObj.filter(i => i !== id);
                setSelectedUserObj(newArr);
                setSelectedUserDetail(newArr)
                //addErrorMesage("Song removed from the playlist!");
            }
        } else {
            let arr = [];
            arr.push(id);
            setSelectedUserObj(arr);
            setSelectedUserDetail(arr)
            //addSuccessMesage("Song added to the playlist!");
        }
    };

    const onEventPress = async (item) => {
        const data = {
            fromuserid: CommonUtilsObj.EmployeDetails[0].user,
            touserid: item.user
        }
        const ResponseData = await PostApi(Constant.udateStatusURL, data, true)
        console.log('ResponseData', ResponseData)
    }



    const handleSearch = (e) => {
        console.log(e)
        // let { name, value } = e.target;
        setUserSearch(
            userSearch1.filter((x) => {
                // console.log(x);
                if (JSON.stringify(x).toLowerCase().includes(e.toLowerCase())) {
                    return x;
                }
            }))
    }

    const onSubmitPress = () => {
        console.log(selectedUserId.length)
        if (route.params.status == 'create') {
            if (selectedUserId.length > 1) {
                createGroup()
                // navigation.navigate('GroupName', { user: selectedUserObj, userid: selectedUserId });
                setSearch(true);
            } else {
                ErrorToast('Select atleast one user to creat group')
            }
        } else {
            if (selectedUserId.length > 0) {
                createGroup()
                // navigation.navigate('GroupName', { user: selectedUserObj, userid: selectedUserId });
                setSearch(true);
            } else {
                ErrorToast('please select user')
            }
        }
    }

    const createGroup = async () => {
        setLoading(true)
        //  selectedUserId.push(CommonUtilsObj.EmployeDetails[0].id)
        console.log('selectedUserId', selectedUserId)
        const data = {
            employee: selectedUserId,
            room: route.params.id
        }
        const responseData = await PostApi(Constant.KGroupMembereURL, data, false)
        console.log('resp....', responseData)
        if (responseData.status == 200) {
            setLoading(false);
            if (route.params.status == 'create') {
                navigation.navigate('Chats');
            } else {
                navigation.goBack();
            }
        } else {
            setLoading(false);
        }
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
            <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            />
            {/* <KeyboardAvoidingView style={{}}> */}
            <View style={{}}>

                {search == false &&
                    <View
                        // entering={ZoomIn}
                        // exiting={FadeIn}
                        // layout={Layout}
                        style={{
                            // position: 'absolute', width: '100%', top: 0,
                            alignItems: "center",
                            flexDirection: 'row',
                            backgroundColor: "white",
                            shadowColor: 'black',
                            shadowOffset: { width: 2, height: 5 },
                            shadowOpacity: 1,
                            shadowRadius: 2,
                            elevation: 5,
                            height: 50
                        }}>
                        <View style={{ marginLeft: 20 }}>
                            <TouchableOpacity onPress={() => { setSearch(true) }}>
                                <MaterialCommunityIcons name='keyboard-backspace' size={30} color='black' />
                            </TouchableOpacity>
                        </View>
                        <View style={{ flex: 1 }}>
                            <TextInput
                                label="Search"
                                onChangeText={e => handleSearch(e)}
                                // keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                placeholder="Search..."
                                autoFocus={true}
                                //  theme={Constant.theme}
                                //  activeOutlineColor={Constant.darkturquoise}
                                style={{
                                    // height: 55,
                                    //  margin: 12,
                                    //  borderWidth: 1,
                                    padding: 10,
                                }}
                            />
                        </View>
                    </View>
                }
                <FlatList
                    data={selectedUserDetail}
                    horizontal={true}
                    // contentContainerStyle={{ flexGrow: 1 }}
                    renderItem={renderSelectedUserList}
                    keyExtractor={(item, index) => index.toString()}
                    style={{
                        // marginTop: search == false ? 50 : 0,
                        borderBottomWidth: selectedUserDetail.length > 0 ? 1 : 0,
                    }}
                />
                {search == true ?
                    <FlatList
                        data={userDetail}
                        contentContainerStyle={{}}
                        renderItem={renderUserList}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ marginBottom: selectedUserDetail.length > 0 ? 85 : 0, }}//
                    />
                    :
                    <FlatList
                        data={userSearch}
                        //contentContainerStyle={{}}
                        renderItem={renderUserList}
                        keyExtractor={(item, index) => index.toString()}
                        style={{ marginBottom: selectedUserDetail.length > 0 ? 135 : search == false ? 50 : 0, }}//
                    />
                }


                {/* {search == false &&
                        <View
                            // entering={ZoomIn}
                            // exiting={FadeIn}
                            // layout={Layout}
                            style={{
                                position: 'absolute', width: '100%', top: 0,
                                alignItems: "center",
                                flexDirection: 'row',
                                backgroundColor: "white",
                                shadowColor: 'black',
                                shadowOffset: { width: 2, height: 5 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 5,
                                height: 50
                            }}>
                            <View style={{ marginLeft: 20 }}>
                                <TouchableOpacity onPress={() => { setSearch(true) }}>
                                    <MaterialCommunityIcons name='keyboard-backspace' size={30} color='black' />
                                </TouchableOpacity>
                            </View>
                            <View style={{ flex: 1 }}>
                                <TextInput
                                    label="Search"
                                    onChangeText={e => handleSearch(e)}
                                    // keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                    placeholder="Search..."
                                    autoFocus={true}
                                    //  theme={Constant.theme}
                                    //  activeOutlineColor={Constant.darkturquoise}
                                    style={{
                                        // height: 55,
                                        //  margin: 12,
                                        //  borderWidth: 1,
                                        padding: 10,
                                    }}
                                />
                            </View>
                        </View>
                    } */}
            </View>
            {/* </KeyboardAvoidingView> */}

            {/* <TouchableOpacity onPress={() => onSubmitPress()}
                style={{ position: "absolute", bottom: 30, right: 10, }}>
                <RoundIcon height={70} width={70} />
            </TouchableOpacity> */}
            <View style={{ marginHorizontal: 20, justifyContent: 'flex-end', flex: 1, marginBottom: 20 }}>
                <CustomButton text='create group' onPress={() => onSubmitPress()} />
            </View>
        </SafeAreaView>
    )
}