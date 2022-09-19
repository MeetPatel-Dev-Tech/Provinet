import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, SafeAreaView, ScrollView, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native"
import Entypo from 'react-native-vector-icons/Entypo';
import ProgressLoader from 'rn-progress-loader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { io } from "socket.io-client";
import { useScrollToTop } from '@react-navigation/native';
import { GetApi, PostApi } from '../../../Api/Api';
import CommonStyle from '../../../CommonFiles/CommonStyle';
import Constant from '../../../CommonFiles/Constant';
import { navigationRef } from '../../../Navigation/RootNavigation';
import { CommonUtilsObj } from '../../../Utils/CommonUtils';
import { CredentialsContext } from '../../../Components/Context/CredentialsContext';
import { Cancel, Chat, Chats, RoundIcon, Selected } from '../../../CommonFiles/SvgFile';

export default function GroupName({ navigation, route }) {

    const [loading, setLoading] = useState(false);
    const [userDetail, setUserDetail] = useState('');
    const [userSearch, setUserSearch] = useState('');
    const [groupName, setGroupName] = useState('');
    const [userId, setUserId] = useState(route.params.userid);
    const [selectedUserDetail, setSelectedUserDetail] = useState(route.params.user);
    const { storeData, setStoreData } = useContext(CredentialsContext);
    const [addUser, setAddUser] = useState([]);

    console.log('user', userId.length)

    const renderSelectedUserList = ({ item, index }) => {
        // console.log('item', item.selected)
        return (
            <View style={{ flex: 1, }}>
                {/* {item.selected == true && */}
                <View style={{ marginRight: 10 }}>
                    <View
                        style={{ alignItems: 'center', justifyContent: 'flex-start', flex: 1 }}>
                        <Image source={item.profilepic == null ? require('../../../Assets/Image/EmptyProfile.jpg')
                            :
                            { uri: Constant.getProfilePicURL + item.profilepic }}
                            style={{ width: 45, height: 45, borderRadius: 40, }}
                        />
                    </View>
                    <Text style={{ textAlign: 'center' }}>{item.firstName}</Text>
                </View>
                {/* } */}
            </View>
        )
    }


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }} >
            <View style={{
                backgroundColor: 'white',
                shadowColor: 'black',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 3, padding: 10
            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <RoundIcon height={50} width={50} />
                    </View>
                    <View style={{ borderBottomWidth: 1, flex: 1, borderColor: Constant.darkturquoise }}>
                        <TextInput
                            data={groupName}
                            onChangeText={e => setGroupName(e)}
                            // keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                            placeholder="Type group subject here..."
                            autoFocus={true}
                            //  theme={Constant.theme}
                            //  activeOutlineColor={Constant.darkturquoise}
                            style={{
                                //   height: 55,
                                //  margin: 12,
                                //  borderWidth: 1,
                                //  padding: 10,
                            }}
                        />
                    </View>
                    <View>
                        <Entypo name='emoji-happy' size={20} />
                    </View>
                </View>
                <View style={{ marginTop: 10 }}>
                    <Text>Provide a group subject and optional group icon</Text>
                </View>
            </View>
            <View style={{ marginHorizontal: 20, marginTop: 20 }}>
                <Text>
                    Participants : {userId.length}
                </Text>
                <FlatList
                    data={selectedUserDetail}
                    numColumns={6}
                    columnWrapperStyle={{
                        flex: 1, justifyContent: 'flex-start'
                    }}
                    renderItem={renderSelectedUserList}
                    keyExtractor={(item, index) => index.toString()}
                    style={{ marginTop: 20, }}
                />
            </View>
            <TouchableOpacity onPress={() => { navigation.navigate('Chats', { data: selectedUserDetail }) }}
                style={{ position: "absolute", bottom: 20, right: 10, flex: 1 }}>
                <Selected height={70} width={70} />
            </TouchableOpacity>
        </SafeAreaView>
    )
}