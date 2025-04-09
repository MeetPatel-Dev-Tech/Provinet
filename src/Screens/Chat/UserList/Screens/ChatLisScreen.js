import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, Animated, Easing, SafeAreaView, Dimensions, ScrollView, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native"
import Octicons from 'react-native-vector-icons/Octicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
// import { TextInput } from 'react-native-paper';
import ProgressLoader from 'rn-progress-loader';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
// import Animated, { FadeIn, useAnimatedStyle, FadeOut, Layout, RollInLeft, ZoomIn, ZoomInRotate, ZoomOut } from "react-native-reanimated";
import { io } from "socket.io-client";
import { GetApi, PostApi } from '../../../../Api/Api';
import CommonStyle from '../../../../CommonFiles/CommonStyle';
import Constant from '../../../../CommonFiles/Constant';
import { navigationRef } from '../../../../Navigation/RootNavigation';
import { CommonUtilsObj } from '../../../../Utils/CommonUtils';
import { CredentialsContext } from '../../../../Components/Context/CredentialsContext';

export default function ChatListScreen({ navigation, route }) {


    const [loading, setLoading] = useState(false);
    const [userChatList, setUserChatList] = useState('');
    const [userSearch, setuserSearch] = useState('');
    const { storeData, setStoreData } = useContext(CredentialsContext);
    const { group, setGroup } = useContext(CredentialsContext);
    const [groupDetails, setGroupDetails] = useState('');
    const isFocused = useIsFocused();

    let interval = useRef(null)
    let interval2 = useRef(null)

    let socket = io(Constant.socketLocationURL, {
        query: { id: CommonUtilsObj.EmployeDetails[0].id },
        reconnectionDelayMax: 1000,
    });

    console.log('useIsFocused', useIsFocused())

    useEffect(() => {
        if (storeData == false) {
            fadeOut()
        }
    }, [storeData]);


    useFocusEffect(
        React.useCallback(() => {
            console.log('CommonUtilsObj.EmployeDetails[0].id', CommonUtilsObj.EmployeDetails[0].id)
            // interval.current = setInterval(() => {
            const unsubscribe = socket.emit('getuserlist', CommonUtilsObj.EmployeDetails[0].id)
            getGroupList()
            // }, 3000)
            //   isFocused == false && clearInterval(interval.current);
            return () => unsubscribe
        }, [])
    )

    socket.on('getList', async response => {
        console.log('response....', response.result)
        //   setcount(ex.result[0])
        setUserChatList(response.result)
        setuserSearch(response.result)
    })
    socket.on('groupgetList', async response => {
        console.log('groupgetList....', response.result)
        console.log('groupgetList', response.result[0].fromuserid)
        //   setcount(ex.result[0])
        // setUserChatList(response.result)
        // setuserSearch(response.result)
    })

    const getGroupList = async () => {
        console.log('123')
        const responseData = await GetApi(Constant.KRoomList)

        console.log('resp<><><><>', responseData)
        console.log('resp<1><2><><>', responseData.status)
        console.log('resp<1><2><><>', groupDetails.length)

        if (responseData.status == 200) {
            setGroupDetails(responseData.data)
        }
    }



    const onPress = (item) => {
        // if (item.socketid != '') {
        clearInterval(interval.current)
        setStoreData(true);
        onEventPress(item);
        console.log('hhgg', item.fromuserid.firstName)
        console.log('hhgg', item.touserid.firstName)
        if (item.touserid.id == CommonUtilsObj.EmployeDetails[0].id) {
            navigation.navigate('Chat', {
                //  socketId: item.socketid,
                userFirstName: item.fromuserid.firstName,
                userLastName: item.fromuserid.lastName,
                userId: item.fromuserid.id,
                profilePic: item.fromuserid.profilepic,
                //   status: item.fromuserid.online
            })
        } else {
            navigation.navigate('Chat', {
                //  socketId: item.socketid,
                userFirstName: item.touserid.firstName,
                userLastName: item.touserid.lastName,
                userId: item.touserid.id,
                profilePic: item.touserid.profilepic,
                //   status: item.touserid.online
            })
        }


        // navigation.navigate('Chat', {
        //     //  socketId: item.socketid,
        //     userFirstName: item.firstName,
        //     userLastName: item.lastName,
        //     userId: item.user,
        //     profilePic: item.profilepic,
        //     status: item.online
        // })

        // }
    }
    const onPressGroup = (item) => {
        // if (item.socketid != '') {
        clearInterval(interval.current)
        setStoreData(true);
        onEventPress(item);
        console.log('hhgg', item.name)
        navigation.navigate('GroupChat', {
            //  socketId: item.socketid,
            userFirstName: item.name,
            //   userLastName: item.fromuserid.lastName,
            userId: item.id,
            profilePic: item.profilepic,
            //  search: true
            //   status: item.fromuserid.online
        })

    }

    const renderUserList = ({ item }) => {

        //  console.log('count.user', count.user, item.user)
        return (
            <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', }}>
                {/* marginBottom: 25, marginTop: 10  */}

                <View style={{}}>
                    <Image source={item.profilepic == null ? require('../../../../Assets/Image/EmptyProfile.jpg')
                        :
                        { uri: Constant.getProfilePicURL + item.profilepic }}
                        style={{ width: 45, height: 45, borderRadius: 40, marginLeft: 5 }}
                    />
                    {item.online == 'Y' &&
                        <View style={{ position: 'absolute', bottom: -5, right: -1 }}>
                            <Octicons name='dot-fill' size={25} color='green' />
                        </View>
                    }
                </View>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    flex: 1,
                    alignItems: 'center',
                    marginLeft: 15,
                    borderBottomWidth: 0.2,
                    borderColor: 'gray'
                }}>
                    <TouchableOpacity style={{ flex: 1 }}
                        onPress={() => { onPress(item) }}
                    >
                        {item.touserid.id == CommonUtilsObj.EmployeDetails[0].id ?
                            <Text style={{ fontSize: 20, }}>{item.fromuserid.firstName} {item.fromuserid.lastName}</Text>
                            :
                            <Text style={{ fontSize: 20, }}>{item.touserid.firstName} {item.touserid.lastName}</Text>
                        }

                        <Text style={{}}>{item.message}</Text>
                        {/* <View style={{ borderWidth: 0.5 }}></View> */}
                    </TouchableOpacity>
                    {item.count != undefined &&
                        <View style={{ marginRight: 20, backgroundColor: Constant.darkturquoise, paddingHorizontal: 7, alignItems: 'baseline', flexL: 1, borderRadius: 5 }}>
                            <Text style={{
                                fontSize: 16,
                                fontWeight: 'bold', color: 'white', textAlign: 'center',
                                shadowColor: 'black',
                                shadowOffset: { width: -2, height: 4 },
                                shadowOpacity: 0.2,
                                shadowRadius: 3, elevation: 5,
                            }}>{item.count}</Text>
                        </View>}
                </View>

            </View>
        )
    }

    const renderGroupList = ({ item }) => {
        return (
            <View style={{ marginLeft: 10, flexDirection: 'row', alignItems: 'center', }}>
                {/* marginBottom: 25, marginTop: 10  */}

                <View style={{}}>
                    <Image source={require('../../../../Assets/Image/EmptyProfile.jpg')}
                        style={{ width: 45, height: 45, borderRadius: 40, marginLeft: 5 }}
                    />
                    {/* {item.online == 'Y' &&
                        <View style={{ position: 'absolute', bottom: -5, right: -1 }}>
                            <Octicons name='dot-fill' size={25} color='green' />
                        </View>
                    } */}
                </View>
                <View style={{
                    flexDirection: 'row',
                    paddingVertical: 10,
                    flex: 1,
                    alignItems: 'center',
                    marginLeft: 15,
                    borderBottomWidth: 0.2,
                    borderColor: 'gray'
                }}>
                    <TouchableOpacity style={{ flex: 1 }}
                        onPress={() => { onPressGroup(item.room) }}
                    >
                        <Text style={{ fontSize: 20, }}>{item.room.name}</Text>
                        <Text style={{}}>message</Text>
                        {/* <View style={{ borderWidth: 0.5 }}></View> */}
                    </TouchableOpacity>
                </View>

            </View>
        )
    }

    const handleSearch = (e) => {
        console.log(e)
        // let { name, value } = e.target;
        setUserChatList(
            userSearch.filter((x) => {
                // console.log(x);
                if (JSON.stringify(x).toLowerCase().includes(e.toLowerCase())) {
                    return x;
                }
            }))
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

    // const trans = interpolate({
    //     inputRange: [0, 50, 100, 101],
    //     outputRange: [-20, 0, 0, 1],
    // });

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.bezier(.07, 1, .33, .89),
            useNativeDriver: true
        }).start();
    };
    const fadeIn = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true
        }).start();
    };

    return (
        <SafeAreaView style={{ flex: 1 }}>
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
                data={userChatList}
                renderItem={renderUserList}
                keyExtractor={(item, index) => index.toString()}
                style={{ marginTop: storeData == false ? 60 : 0, }}
            />
            {groupDetails.length > 0 &&
                <Text style={{ marginTop: 20, fontSize: 20, marginHorizontal: 20, fontWeight: 'bold' }}>
                    Groups
                </Text>
            }
            <FlatList
                data={groupDetails}
                renderItem={renderGroupList}
                keyExtractor={(item, index) => index.toString()}
                style={{ marginTop: 15, }}
            />
            {storeData == false &&
                <Animated.View
                    // entering={FadeIn}
                    // exiting={FadeIn.delay(500)}
                    // layout={Layout.delay(200)}
                    //  onTouchEnd={() => { setStoreData(true), socket.emit('getuserlist', CommonUtilsObj.EmployeDetails[0].user) }}
                    style={{
                        position: 'absolute', width: '100%', top: 0,
                        alignItems: "center",
                        flexDirection: 'row',
                        backgroundColor: "white",
                        marginBottom: 5,
                        shadowColor: 'black',
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 5, opacity: fadeAnim,
                        transform: [{
                            translateX: fadeAnim.interpolate({
                                inputRange: [0, 1],
                                outputRange: [Dimensions.get('window').width, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                            }),
                        }]
                    }}>
                    <View style={{ marginLeft: 20 }}>
                        <TouchableOpacity onPress={() => {
                            fadeIn(),
                                setTimeout(() => {
                                    setStoreData(true),
                                        socket.emit('getuserlist', CommonUtilsObj.EmployeDetails[0].id)
                                }, 300);
                        }}>
                            {/* <TouchableOpacity onPress={() => { fadeOut() }}> */}
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
                                height: 55,
                                //  margin: 12,
                                //  borderWidth: 1,
                                padding: 10,
                            }}
                        />
                    </View>
                </Animated.View>
            }

            <Modal
                isVisible={isFocused == true && group}
                style={{
                    position: 'absolute',
                    top: -10,
                    // bottom: -20,
                    //  left: -20,
                    right: -10,
                    // backgroundColor: 'black',
                }}
                // onRequestClose={() => setGroup(false)}
                onBackdropPress={() => {
                    setGroup(false)
                }}
                animationIn='fadeInRight'
                animationOut='fadeOutRight'
                transparent={true}
                backdropOpacity={0}
            >
                <View style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
                    <TouchableOpacity onPress={() => { setGroup(false), navigation.navigate('GroupName') }}>
                        <Text>New Group</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </SafeAreaView>
    )
}