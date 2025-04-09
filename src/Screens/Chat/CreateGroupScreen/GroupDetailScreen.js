import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, FlatList, StyleSheet, TouchableOpacity, Image } from "react-native";
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import ProgressLoader from 'rn-progress-loader';
import moment from 'moment';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Constant from '../../../CommonFiles/Constant';
import { deleteApi, GetApi } from '../../../Api/Api';
import { CommonUtilsObj, setLoggedEmployeDetails } from '../../../Utils/CommonUtils';

export default function GroupDetailScreen({ navigation, route }) {

    const [memberList, setMemberList] = useState('');
    const [createOn, setCreateOn] = useState('');
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [userDetails, setUserDetails] = useState('');
    const [userId, setUserId] = useState('');
    const [myId, setMyId] = useState('');
    const [loading, setLoading] = useState(false);

    // useEffect(() => {
    //     getMemberList()
    // }, []);

    useFocusEffect(
        React.useCallback(() => {
            const unsubscribe =
                getMemberList()
            return () => unsubscribe
        }, [])
    )

    const getMemberList = async () => {
        console.log('route', route.params.roomId)
        const responseData = await GetApi(Constant.KGroupMemberList + route.params.roomId)
        console.log('respppp', responseData.data)
        setMemberList(responseData.data)
        setCreateOn(responseData.data[0].createdOn)
    }

    const renderMemberlist = ({ item }) => {
        return (
            <View style={{ marginLeft: 10, }}>
                {item.employee.id == CommonUtilsObj.EmployeDetails[0].id && setMyId(item.id)}
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Image source={item.profilepic == null ? require('../../../Assets/Image/EmptyProfile.jpg')
                            :
                            { uri: Constant.getProfilePicURL + item.profilepic }}
                            style={{ width: 45, height: 45, borderRadius: 40, }}
                        />
                    </View>
                    <View style={{ flexDirection: 'row', paddingVertical: 15, flex: 1, alignItems: 'center', marginLeft: 10, borderBottomWidth: 0.2, borderColor: 'gray' }}>
                        <TouchableOpacity style={{}}
                            onPress={() => { (item.employee.id == CommonUtilsObj.EmployeDetails[0].id) ? null : setIsModalVisible(true), setUserDetails(item.employee), setUserId(item) }}
                        >
                            {
                                item.employee.id == CommonUtilsObj.EmployeDetails[0].id ?
                                    <Text style={{ fontSize: 20, }}>You</Text>
                                    :
                                    <Text style={{ fontSize: 20, }}>{item.employee.firstName} {item.employee.lastName}</Text>
                            }

                            {/* <Text style={{}}>message</Text> */}
                        </TouchableOpacity>
                    </View>
                </View>
            </View >
        )
    }

    const onpress = async () => {
        console.log(userDetails.id)
        const responseData = await deleteApi(Constant.KDeleteMember + userId.id)
        console.log('resss', responseData);
        if (responseData.status == 200) {
            setIsModalVisible(false);
            getMemberList();
        }
    }

    const exitGroup = async () => {
        console.log(myId)
        setLoading(true); 0
        const responseData = await deleteApi(Constant.KDeleteMember + myId)
        console.log('resss', responseData);
        if (responseData.status == 200) {
            setLoading(false);
            navigation.navigate('Chats')
        } else {
            setLoading(false);
        }
    }

    const infoPress = () => {
        console.log('id', userId)
        setIsModalVisible(false);
        navigation.navigate('Chat', {
            //  socketId: item.socketid,
            userFirstName: userId.employee.firstName,
            userLastName: userId.employee.lastName,
            userId: userId.employee.id,
            profilePic: userId.employee.profilepic,
            //   status: item.fromuserid.online
        })
    }

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
            <View style={{ alignItems: 'center', marginTop: 10 }}>
                <Image source={require('../../../Assets/Image/EmptyProfile.jpg')}
                    style={{ height: 80, width: 80, }}
                />
                <Text style={{ fontSize: 25, fontWeight: 'bold', color: 'black', marginTop: 5 }}>
                    {route.params.groupName}
                </Text>
                <Text>group  {memberList.length} participants</Text>

            </View>
            <View style={{
                flexDirection: 'row',
                justifyContent: 'space-around',
                alignItems: 'center',
                marginTop: 10,
                marginHorizontal: 20
            }}>
                <View style={{
                    paddingHorizontal: 30, paddingVertical: 10,
                    backgroundColor: 'white',
                    elevation: 3,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0.5, height: 2 }, // change this for more shadow
                    shadowOpacity: 0.4,
                    shadowRadius: 6, borderRadius: 10, alignItems: 'center'
                }}>
                    <Ionicons name='call' size={25} color={Constant.darkturquoise} />
                    <Text >audio</Text>
                </View>
                <View style={{
                    paddingHorizontal: 30, paddingVertical: 10,
                    backgroundColor: 'white', elevation: 3,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0.5, height: 2 }, // change this for more shadow
                    shadowOpacity: 0.4,
                    shadowRadius: 6, borderRadius: 10, alignItems: 'center'
                }}>
                    <Ionicons name='ios-videocam' size={25} color={Constant.darkturquoise} />
                    <Text>video</Text>
                </View>
                <View
                    style={{
                        paddingHorizontal: 25, paddingVertical: 10,
                        backgroundColor: 'white', elevation: 3,
                        shadowColor: "#000000",
                        shadowOffset: { width: 0.5, height: 2 }, // change this for more shadow
                        shadowOpacity: 0.4,
                        shadowRadius: 6, borderRadius: 10, alignItems: 'center'
                    }}>
                    <Ionicons name='ios-search-outline' size={25} color={Constant.darkturquoise} />
                    <Text>search</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 20, marginTop: 15, flex: 1 }}>
                <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{memberList.length} Participants</Text>
                <FlatList
                    data={memberList}
                    renderItem={renderMemberlist}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ marginTop: 15, backgroundColor: 'white', borderRadius: 10, paddingBottom: 10, flexGrow: 0 }}
                />
            </View>
            <View style={{ justifyContent: 'flex-end', marginBottom: 20, marginHorizontal: 20, marginTop: 10, }}>
                <TouchableOpacity onPress={() => {
                    navigation.navigate("CreateGroup", {
                        id: route.params.roomId,
                        status: 'update'
                    })
                }}
                    style={{ backgroundColor: 'white', padding: 10, borderRadius: 10 }}>
                    <Text style={{ fontSize: 18, color: Constant.darkturquoise }}>Add Participants</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => exitGroup()}
                    style={{ backgroundColor: 'white', padding: 10, borderRadius: 10, marginTop: 5 }}>
                    <Text style={{ fontSize: 18, color: 'red' }}>Exit Group</Text>
                </TouchableOpacity>
                <Text style={{ marginTop: 5, marginLeft: 5 }}>Created {moment(createOn).format("Do MMM YYYY")}</Text>
            </View>

            <Modal
                isVisible={isModalVisible}
                animationIn='fadeInUp'
                animationOut='fadeOutDown'
                transparent={true}
                backdropOpacity={0.5}
            >
                <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: 'transparent' }}>
                    <View style={{ backgroundColor: 'white', paddingBottom: 10, borderRadius: 10 }}>
                        <View style={{ paddingVertical: 10, borderBottomWidth: 0.4 }}>
                            <Text style={{ textAlign: 'center', fontSize: 14 }}>{userDetails.firstName} {userDetails.lastName}</Text>
                        </View>
                        <TouchableOpacity onPress={() => infoPress()}
                            style={{ paddingVertical: 10, borderBottomWidth: 0.4 }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, color: Constant.darkturquoise }}>Info</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => onpress()}
                            style={{ paddingTop: 10 }}>
                            <Text style={{ textAlign: 'center', fontSize: 18, color: Constant.darkturquoise }}>Remove From Group</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity onPress={() => setIsModalVisible(false)}
                        style={{ backgroundColor: 'white', paddingVertical: 10, borderRadius: 10, marginTop: 10 }}>

                        <Text style={{ textAlign: 'center', fontSize: 18, color: Constant.darkturquoise, fontWeight: 'bold' }}>Cancel</Text>
                    </TouchableOpacity>
                </View>
            </Modal>

        </SafeAreaView>
    );



}

