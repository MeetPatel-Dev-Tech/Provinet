import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, SliderBase, Alert } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import TextTicker from 'react-native-text-ticker'
import ProgressLoader from 'rn-progress-loader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import CommonStyle from '../../CommonFiles/CommonStyle'
import Constant from '../../CommonFiles/Constant';
import { CommonUtilsObj, getLiveLocation } from '../../Utils/CommonUtils';
import moment from 'moment';
import * as RootNavigation from '../../Navigation/RootNavigation';
import { GetApi, PostApi, PostApiImage } from '../../Api/Api';

import { useNavigation } from '@react-navigation/native';
import { ErrorToast, SuccessToast } from '../ToastMessage/Toast';
import Logo from "../../Assets/Image/ms.svg";
import { SvgUri } from 'react-native-svg';
import { Alerts, Attendance, Attendances, Chat, Chats, Client, Clients, DailyReport, DailyReports, Holiday, Holidays, Leave, Leaves, News, Newss, Salary, Salarys, Task, Tasks } from '../../CommonFiles/SvgFile';

export default function HomeScreen({ }) {
    const navigation = useNavigation();
    const [punchInResponse, setPunchInResponse] = useState('');
    const [currentLatitude, setCurrentLatitude] = useState('');
    const [currentLongiTude, setCurrentLongitude] = useState('');
    const [punchInStatus, setPunchInStatus] = useState('');
    const [punchInTime, setPunchInTime] = useState('');
    const [punchOutTime, setPunchOutTime] = useState('');
    const [punchInAddress, setPunchInAddress] = useState('');
    const [lastPunchInTime, setLastPunchInTime] = useState('');
    const [lastPunchOutTime, setLastPunchOutTime] = useState('');
    const [loading, setLoading] = useState(false);

    const data = [
        { name: 'Attendance', id: 1, image: <Attendances height={75} width={75} /> },// require('../../Assets/Icon/Attendance.png')
        { name: 'Daily Report', id: 2, image: <DailyReports height={75} width={75} /> },
        { name: 'Leave', id: 3, image: <Leaves height={75} width={75} /> },
        { name: 'Chat', id: 4, image: <Chats height={75} width={75} /> },
        { name: 'News', id: 5, image: <Newss height={75} width={75} /> },
        { name: 'Holiday', id: 6, image: <Holidays height={75} width={75} /> },
        { name: 'Task', id: 7, image: <Tasks height={75} width={75} /> },
        { name: 'Client', id: 8, image: <Clients height={75} width={75} /> },
        { name: 'Salary', id: 9, image: <Salarys height={75} width={75} /> },
        { name: 'Approvals', id: 10, image: <Salarys height={75} width={75} /> },
        {},
        {},
    ]

    useEffect(() => {
        //    getEmployePunchInOutDetails();
        getLiveLoc();
        console.log('mmmm', moment().format('HH:mm'))
        const unsubscribe = navigation.addListener('focus', () => {
            getEmployePunchInOutDetails();
            //  console.log('lastPunchInTime', lastPunchInTime, moment(lastPunchInTime, 'hh:mm').fromNow())

        });
        return unsubscribe;
    }, []);

    const renderNameList = ({ item }) => {
        return (
            <View style={{
                marginTop: 10,
                marginBottom: 5,
                flex: 1,
                marginHorizontal: 10,
                borderRadius: 10,
                backgroundColor: 'aquamarine',
                shadowColor: 'black',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 5,
                alignItems: 'center',
                justifyContent: "center",
                height: 50,
            }}>
                <View style={{ marginHorizontal: 10 }}>
                    <TouchableOpacity onPress={() => OnPressEvent(item)}>
                        <Text style={{ textAlign: "center", color: 'black', fontWeight: 'bold', fontSize: 18 }}>{item.name}</Text>
                    </TouchableOpacity>
                </View>
            </View>
        )
    }

    const PunchInOutCall = () => {
        if (punchInStatus == null) {
            PunchOut();
        } else {
            getLiveLoc();
            Opencamera();
        }
    }

    const OnPressEvent = (item) => {
        console.log('<<<<<<', item)
        if (item.name == 'Attendance') {
            return RootNavigation.navigate('Attendance')
        } else if (item.name == 'Task') {
            return navigation.navigate('Task')
        } else if (item.name == 'Leave') {
            return navigation.navigate('LeaveDetail')
        } else if (item.name == 'News') {
            return navigation.navigate('News')
        } else if (item.name == 'Holiday') {
            return navigation.navigate('Holiday')
        } else if (item.name == 'Chat') {
            return navigation.navigate('UserList')
        } else if (item.name == 'Approvals') {
            return navigation.navigate('Approvals')
        }
    }

    const getLiveLoc = async () => {
        //   setLoading(true);
        const { latitude, longitude, heading } = await getLiveLocation();
        console.log('Live Loc-----', latitude, longitude);
        getAddress(latitude, longitude);
        setCurrentLatitude(latitude);
        setCurrentLongitude(longitude);
    }

    const getAddress = async (latitude, longitude) => {
        console.log('latitude', latitude, longitude)
        let response = await GetApi(
            `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Constant.KGoogleMapAPIKey}`,
        );
        //   console.log('ResLocation---------------', JSON.stringify(response));
        console.log('ResLocation---------------', JSON.stringify(response.results[0].formatted_address));
        if (response.status == 'OK') {
            setPunchInAddress((response.results[0].formatted_address))
        }
    }

    const Opencamera = () => {
        let options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: false,
        };
        launchCamera(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('user cancle image picker');
            } else if (response.error) {
                console.log('imagepicker error:', response.error);
            } else if (response.customButton) {
                console.log('user taped custom button: ', response.customButton);
            } else {
                console.log('fddggg', response.assets[0]);
                // if (response.assets[0].fileSize < 3145728) {
                console.log('..................')
                setPunchInResponse({ uri: response.assets[0].uri });
                PunchIn(response.assets[0].uri);
                // } else {
                // ErrorToast(Message.KImageSize);
                // }
            }
        });
    };
    console.log('name', CommonUtilsObj.EmployeDetails[0].user)
    // if (punchInResponse != '') {
    //     PunchIn();
    // }

    // const UploadImage = async () => {
    //     var data = new FormData();
    //     data.append('image', {
    //         uri: punchInResponse.uri,
    //         type: 'image/jpeg',
    //         name: 'profile.jpg',
    //     });
    //     data.append('userid',
    //         CommonUtilsObj.EmployeDetails[0].user
    //     )
    // const data = {
    //     userid: CommonUtilsObj.EmployeDetails[0].user,
    //     image: punchInResponse.uri
    // }
    // const ResponseData = await PostApiImage((Constant.ImageURL + CommonUtilsObj.EmployeDetails[0].user), data)
    // console.log('image................', ResponseData)
    // if (ResponseData.status == 'success') {
    //     PunchIn();
    // }
    // }
    console.log('punchInStatus', punchInStatus)

    const PunchIn = async (image) => {
        console.log('..........................');
        console.log('mmmm', moment().format('HH:mm'));
        setLoading(true);
        var data = new FormData();
        data.append('image', {
            uri: image,
            type: 'image/jpeg',
            name: 'profile.jpg',
        });
        data.append('userid',
            CommonUtilsObj.EmployeDetails[0].user
        );
        data.append('latitude',
            currentLatitude
        );
        data.append('longitude',
            currentLongiTude
        );
        data.append('intime',
            String(moment().format('HH:mm'))
        );
        data.append('address',
            punchInAddress
        )
        // const DATA = {
        //     userid: CommonUtilsObj.EmployeDetails[0].user,
        //     //    image: punchInResponse.uri,
        //     image: data,
        //     latitude: currentLatitude,
        //     longitude: currentLongiTude,
        //     intime: String(moment().format('hh:mm'))
        // }
        const ResponseData = await PostApiImage(Constant.PunchInURL, data, false)
        console.log('dddddddddd', ResponseData)
        if (ResponseData.status == 'success') {
            BreakTime();
            setLoading(false);
            setPunchInStatus(ResponseData.status)
            SuccessToast('Successfully PunchIn')
            getEmployePunchInOutDetails();
        } else {
            ErrorToast(ResponseData.message);
            setLoading(false);
        }
    }

    const PunchOut = async () => {
        console.log('outTime....', (moment().format('HH:mm')))
        setLoading(true);
        const data = {
            userid: CommonUtilsObj.EmployeDetails[0].user,
            outtime: String(moment().format('HH:mm'))
        }
        const ResponseData = await PostApi(Constant.PunchOutURL, data, true)
        console.log('PUNCHOUT', ResponseData)
        if (ResponseData.status == 'success') {
            SuccessToast('SuccessFully PunchOut')
            getEmployePunchInOutDetails();
            setLoading(false);
            BreakTime();
        } else {
            ErrorToast(ResponseData.message);
            setLoading(false);
        }
    }

    const BreakTime = async () => {
        const data = {
            userid: CommonUtilsObj.EmployeDetails[0].user
        }
        const ResponseData = await PostApi(Constant.BreakTimeURL, data, true)
        console.log('BreakTime', ResponseData)
    }

    const getEmployePunchInOutDetails = async () => {
        const ResponseData = await GetApi(Constant.PunchInOutDetailsURL + CommonUtilsObj.EmployeDetails[0].user)
        // console.log('GetEmployeDetails..........', ResponseData.data[ResponseData.data.length - 1])
        console.log('12 hour...............', (moment(ResponseData.data[ResponseData.data.length - 1].intime, 'hh:mm').format('hh:mm')))
        console.log('hour...............', (moment(ResponseData.data[ResponseData.data.length - 1].outtime, 'hh:mm').format('hh:mm')))
        setPunchInStatus(ResponseData.data[ResponseData.data.length - 1].outtime)
        //  setPunchInTime(moment(ResponseData.data[ResponseData.data.length - 1].intime, 'hh:mm a').format('hh:mm a'))
        setLastPunchInTime(moment(ResponseData.data[ResponseData.data.length - 1].intime, 'HH:mm').format('HH:mm'))
        //   setLastPunchOutTime(moment(ResponseData.data[ResponseData.data.length - 1].outtime, 'HH:mm').format('HH:mm'))
        //  setPunchOutTime(ResponseData.data[ResponseData.data.length - 1].outtime == null ? null : moment(ResponseData.data[ResponseData.data.length - 1].outtime, 'hh:mm').format('hh:mm a'))
        // setTimeout(() => {
        //     console.log('fffffff', lastPunchInTime, moment(lastPunchInTime, 'hh:mm').fromNow())
        // }, 1000);
    }

    const RenderItemList = ({ item }) => {
        return (
            <View style={{ flex: 1 }}>
                <View style={{
                    // backgroundColor: 'red'
                    // //  paddingVertical: 25, 
                    // backgroundColor: 'white', shadowColor: 'black',
                    // shadowOffset: { width: 2, height: 5 },
                    // shadowOpacity: 5,
                    // shadowRadius: 2,
                    // elevation: 3,
                    //  justifyContent: 'space-between',
                    //  alignItems: 'center',
                    //   flex: 1,
                    // marginBottom: 10,
                    //   marginTop: 10,
                    // marginRight: 5,
                    //  marginLeft: 10,
                    //  height: 68, width: 68,
                    //  borderRadius: 10,
                }}>
                    <TouchableOpacity onPress={() => OnPressEvent(item)}
                        style={{ justifyContent: 'center', alignItems: 'center' }}
                    >
                        <View style={{
                            // backgroundColor: 'white', shadowColor: 'black',
                            // shadowOffset: { width: 2, height: 5 },
                            // shadowOpacity: 5,
                            // shadowRadius: 2,
                            // elevation: 3,
                        }}>
                            {item.image}
                        </View>
                        {/* <View style={{ backgroundColor: 'white' }}> */}
                        {/* {item.image} */}
                        {/* </View> */}
                    </TouchableOpacity>
                </View>
                <Text style={{ fontSize: 11, textAlign: 'center', marginBottom: 15 }}>{item.name}</Text>
            </View>
        )
    }

    const Icon = () => {
        return (
            <Image source={require('../../Assets/Icon/Alert.png')}
                style={{ height: 20, width: 20 }}
            />
            // <Alerts height={20} width={20} />
        )
    }


    //   console.log('punchInResponse.length', punchInResponse.uri.length)
    return (
        <SafeAreaView style={{ backgroundColor: 'white', flex: 1 }}>

            <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            />
            {/* <Text style={CommonStyle.TextColor}>hi</Text> */}
            {!loading &&
                <View style={{ flex: 1 }}>
                    <View style={{ marginHorizontal: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <TouchableOpacity onPress={() => { navigation.navigate('Profile') }}>
                                <Image source={require('../../Assets/Image/Profile.jpg')} style={{ height: 40, width: 40 }} />
                            </TouchableOpacity>
                            <View>
                                <Text style={{ fontSize: 16, fontWeight: 'bold' }}>{CommonUtilsObj.EmployeDetails[0].firstName}</Text>
                                <Text style={{ fontSize: 16, }}>{CommonUtilsObj.EmployeDetails[0].Department}</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end', justifyContent: 'flex-end', flex: 1, }}>
                                <TouchableOpacity onPress={() => PunchInOutCall()}>
                                    <View style={{
                                        padding: 10, borderRadius: 10, backgroundColor: 'white', shadowColor: 'black',
                                        shadowOffset: { width: 2, height: 5 },
                                        shadowOpacity: 1,
                                        shadowRadius: 2,
                                        elevation: 5,
                                    }}>
                                        {punchInStatus == null ?
                                            <Image source={require('../../Assets/Icon/PuchOut.png')}
                                                style={{ height: 30, width: 30, tintColor: 'red' }}
                                            />
                                            :
                                            <Image source={require('../../Assets/Icon/PunchIn.png')}
                                                style={{ height: 30, width: 30, tintColor: 'green' }}
                                            />
                                        }

                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <View style={{
                            marginTop: 25, padding: 10, borderRadius: 10, backgroundColor: 'white', shadowColor: 'black',
                            shadowOffset: { width: 2, height: 5 },
                            shadowOpacity: 1,
                            shadowRadius: 2,
                            elevation: 5,
                        }}>
                            <TextTicker
                                style={{ fontSize: 18, fontWeight: 'bold' }}
                                duration={10000}
                                loop={true}
                                animationType='auto'
                                bounce
                                repeatSpacer={200}
                                marqueeDelay={100}
                                scrollSpeed={10}
                            >
                                {Icon()}  Welcome to provitious team have a nice day...
                            </TextTicker>
                        </View>

                        {/* <View>
                        <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 20, marginTop: 20 }}>PUNCH IN OUT</Text>
                    </View>
                    <View style={{
                        marginTop: 10, padding: 20, backgroundColor: 'white', borderRadius: 20, shadowColor: 'black',
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 5,
                    }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                            <View style={{}}>
                                <Text style={{}}>PUNCH IN</Text>
                                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', color: 'black' }}>{punchInTime}</Text>
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                <Text style={{}}>PUNCH OUT</Text>
                                <Text style={{ color: 'white', textAlign: 'center', fontWeight: 'bold', color: 'black' }}>{punchOutTime}</Text>
                            </View>
                            <View style={{ justifyContent: 'flex-end', alignItems: 'flex-end', flex: 1 }}>
                                {
                                    punchInStatus == null ?
                                        <TouchableOpacity onPress={() => PunchOut()}>
                                            <View style={{
                                                padding: 10, backgroundColor: Constant.darkturquoise,
                                                borderRadius: 10,
                                                shadowColor: 'black',
                                                shadowOffset: { width: 0, height: 3 },
                                                shadowOpacity: 1,
                                                shadowRadius: 2,
                                                elevation: 10, alignItems: 'center'
                                            }}>
                                                <MaterialCommunityIcons name='logout' size={40} />
                                                <Text style={{ marginTop: 5, fontWeight: 'bold' }}>PUNCH OUT</Text>
                                            </View>
                                        </TouchableOpacity> :
                                        <TouchableOpacity onPress={() => { getLiveLoc(), Opencamera() }}>
                                            <View style={{
                                                padding: 10, backgroundColor: Constant.darkturquoise,
                                                borderRadius: 10,
                                                shadowColor: 'black',
                                                shadowOffset: { width: 0, height: 3 },
                                                shadowOpacity: 1,
                                                shadowRadius: 2,
                                                elevation: 10, alignItems: 'center'
                                            }}>
                                                <MaterialCommunityIcons name='logout' size={40} />

                                                <Text style={{ marginTop: 5, fontWeight: 'bold' }}>PUNCH IN</Text>
                                            </View>
                                        </TouchableOpacity>
                                }

                            </View>
                        </View>
                        
                      </View> */}
                        {/* <- */}
                    </View>
                    <View style={{ marginTop: 30, }}>
                        <FlatList
                            numColumns={4}
                            data={data}
                            renderItem={RenderItemList}
                        />
                    </View>

                </View>
            }
        </SafeAreaView>
    )
}