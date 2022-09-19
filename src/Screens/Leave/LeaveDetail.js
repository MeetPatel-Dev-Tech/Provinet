import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, StatusBar, StyleSheet, TouchableOpacity, Image, FlatList, Animated, close } from "react-native";
import ProgressLoader from 'rn-progress-loader';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { RectButton, ScrollView, GestureHandlerRootView } from 'react-native-gesture-handler';
import { TextInput } from 'react-native-paper';
import { Dropdown } from 'react-native-element-dropdown';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Calendar } from 'react-native-calendars';
import Modal from 'react-native-modal';
import Toast from 'react-native-root-toast';
import moment from 'moment';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { deleteApi, GetApi, PostApi } from '../../Api/Api';
import CommonStyle from '../../CommonFiles/CommonStyle';
import Constant from '../../CommonFiles/Constant';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { CommonUtilsObj } from '../../Utils/CommonUtils';
import CustomBorderButton from '../../Components/CustomButton/CustomBorderButton';
import { ErrorToast, SuccessToast } from '../ToastMessage/Toast';
import Message from '../../CommonFiles/Message';

export default function LeaveDetail({ navigation }) {
    let rowRefs = new Map();
    let prevOpenedRow;

    const [totalLeave, setTotalLeave] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [applieLeaveDetails, setApplieLeaveDetails] = useState('');
    const [isMoadlVisible, setIsModalVisible] = useState(false);
    const [appliedLeaveModalVisible, setAppliedLeaveModalVisible] = useState(false);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);


    const [leaveReason, setLevaveReason] = useState('');
    const [startDate, setStartDate] = useState('');
    const [date, setDate] = useState();
    const [dateEnd, setDateEnd] = useState();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [isStartDateModalVisible, setisStartDateModalVisible] = useState(false);
    const [isEndDateModalVisible, setIsEndDateModalVisible] = useState(false);
    const [isCalModalVisible, setIsCalModalVisible] = useState(false);
    const [isFocusdropdown1, setIsFocusdropdown1] = useState(false);
    const [isFocusdropdown2, setIsFocusdropdown2] = useState(false);
    const [isFocusdropdown3, setIsFocusdropdown3] = useState(false);
    const [leavesType, setLeavesType] = useState('');
    const [leaveStartDateHalfType, setLeaveStartDateHalfType] = useState('');
    const [leaveEndDateHalfType, setLeaveEndDateHalfType] = useState('');
    const [isEdit, setIsEdit] = useState(true);
    const [ids, setIds] = useState(true);

    useEffect(() => {
        GetUserAllLeave();
        GetUserLeave();
        navigation.addListener('focus', () => {
            //  setTimeout(() => {
            GetUserAllLeave();
            GetUserLeave();
            //   }, 200);
        });
    }, []);

    const GetUserAllLeave = async () => {
        const ResponseData = await GetApi(Constant.GettotalleavesURL + 23)
        console.log('<<<<<<', ResponseData[0])
        setTotalLeave(ResponseData[0]);
        ResponseData.shift();
        console.log('ddddddd', ResponseData)
        setLeaveType(ResponseData)
    }
    const GetUserLeave = async () => {
        setLoading(true);
        const ResponseData = await GetApi(Constant.GetUserLeaveURL + CommonUtilsObj.EmployeDetails[0].user)
        console.log('Historie', ResponseData)
        if (ResponseData.status == 'success') {
            setApplieLeaveDetails(ResponseData.data);
            setLoading(false);
        } else {
            setLoading(false);
        }
    }

    const RenderFontColor = (status) => {
        if (status == 'Approved') {
            return '#4CE264'
        } else if (status == 'Pending') {
            return '#E9BD1E'
        } else if (status == 'Rejected') {
            return '#E91E1E'
        }
    }
    const RenderBackgroundColor = (status) => {
        if (status == 'Approved') {
            return '#F1FDF3'
        } else if (status == 'Pending') {
            return '#FBF7EB'
        } else if (status == 'Rejected') {
            return '#FBEBEB'
        }
    }

    const RenderLeaveCard = ({ item }) => {
        return (
            <View style={{
                flex: 1,
                backgroundColor: 'white',
                paddingVertical: 15,
                paddingHorizontal: 4,
                marginTop: 10, marginRight: 4, marginLeft: 4,
                borderRadius: 10,
                //  alignItems: 'center',
                //  justifyContent: 'space-around',
                shadowColor: 'black',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 5, marginBottom: 5
            }}>
                {/* <Text style={{ fontSize: 18, fontWeight: 'bold', textAlign: 'center', }}>{item.LeaveType}</Text> */}
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>
                    {item.name}
                </Text>
                <View style={{ marginTop: 5 }}>
                    <Text style={{ fontSize: 14, color: 'gray' }}>Total : <Text style={{ color: '#A7196F' }}>{item.balance}</Text></Text>
                    <Text style={{ fontSize: 14, color: 'gray' }}>
                        Used : <Text style={{ color: '#FFC500' }}>{item.used == null ? 0 : item.used}</Text>
                    </Text>
                    <Text style={{ fontSize: 14, color: 'gray' }}>
                        Remain : <Text style={{ color: '#00E6DF', }}>{item.balance}</Text>
                    </Text>
                </View>
            </View>
        )
    }

    // const renderLeftActions = (progress, dragX) => {

    //     console.log('swipable')
    //     const trans = dragX.interpolate({
    //         inputRange: [1, 50, 100, 101],
    //         outputRange: [1, 1, 1, 2],
    //     });
    //     // const translateX = translation.x
    //     return (
    //         // <RectButton style={{ height: 50, width: 100 }} onPress={() => console.log('>>><<<')}>
    //         //     <Text
    //         //         style={
    //         //             {
    //         //                 transform: [{ translateX: 5 }], color: 'red'
    //         //             }
    //         //         }>
    //         //         Archive
    //         //     </Text>
    //         // </RectButton>
    //         <View style={{
    //             justifyContent: 'center',
    //             backgroundColor: 'red',
    //             padding: 10, marginVertical: 20,
    //             transform: [{ translatex: trans }]
    //         }}>
    //             <Text>ms</Text>
    //         </View>
    //     );

    // };

    // const LeftSwipeActions = () => {
    //     return (
    //         <View
    //             style={{
    //                 flex: 1, backgroundColor: '#ccffbd',
    //                 justifyContent: 'center',
    //                 marginTop: 10, marginBottom: 4
    //             }}
    //         >
    //             <Text
    //                 style={{
    //                     color: '#40394a',
    //                     paddingHorizontal: 10,
    //                     fontWeight: 'bold', fontSize: 18,
    //                     paddingHorizontal: 30,
    //                     paddingVertical: 20,
    //                 }}
    //             >
    //                 Edit
    //             </Text>
    //         </View>
    //     );
    // };
    const LeaveType = [
        { name: 'Sick' },
        { name: 'Casual' },
        { name: 'Privilege' }
    ]
    const HalfType = [
        { name: 'First Half' },
        { name: 'Second Half' },
    ]

    const OnSubmitPress = () => {
        let flag = true
        let errorMsg = [];

        if (leavesType == '') {
            flag = false;
            errorMsg.push('Please Select Leave Type')
        }
        if (leaveStartDateHalfType == '') {
            flag = false;
            errorMsg.push('Select Leave Half Type')
        }
        if (startDate == '') {
            flag = false;
            errorMsg.push('Select Leave Start Date')
        }
        if (leaveEndDateHalfType == '') {
            flag = false;
            errorMsg.push('Select Leave Half Type')
        }
        if (endDate == '') {
            flag = false;
            errorMsg.push('Select Leave End Date')
        }
        if (leaveReason == '') {
            flag = false;
            errorMsg.push('Please Give Leave Reason')
        }
        if (flag) {
            SubmitData();
        } else {
            let errmsg = ''
            if (errorMsg.length > 2) {
                errmsg = Message.KRequiredFiledsEmpty
            } else {
                if (errorMsg.length == 2) {
                    errmsg = errorMsg[0] + ', ' + errorMsg[1];
                } else {
                    errmsg = errorMsg[0];
                }
            }
            ErrorToast(errmsg);
        }
    }

    const SubmitData = async () => {
        setLoading(true);
        console.log('<<<<<', moment(startDate).format('DD-MM-YYYY'))
        const data = {
            leavetype: leavesType,
            startdate: moment(startDate).format('DD-MM-YYYY'),
            enddate: moment(endDate).format('DD-MM-YYYY'),
            //  status: 'Pending',
            description: leaveReason,
            userid: CommonUtilsObj.EmployeDetails[0].user,
            starthalf: leaveStartDateHalfType,
            endhalf: leaveEndDateHalfType,
            declineReaso: 'No reason'
        }
        const ResponseData = await PostApi(
            isEdit == false ? Constant.ApplyLeaveURL : Constant.UpdateLeaveURL,
            isEdit == false ? data : { ...data, id: ids },
            isEdit == false ? false : true
        )
        console.log('ApplyLeave', ResponseData)
        if (ResponseData.status == 'success') {
            if (isEdit == false) {
                SuccessToast('Leave Succesfully Applied');
                setLoading(false);
            } else {
                SuccessToast('Leave Succesfully Update');
                setLoading(false);
            }
            setAppliedLeaveModalVisible(false);
            setStartDate('');
            setLevaveReason('');
            setEndDate('');
            setLeavesType('');
            setLeaveStartDateHalfType('');
            setLeaveEndDateHalfType('');
            setIds('');
            setIsEdit(true);
        } else {
            ErrorToast(ResponseData.message);
            setloading(false);
        }
    }


    const LeftSwipeActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });
        return (
            <View
                style={{
                    backgroundColor: 'darkgrey',
                    justifyContent: 'center',
                    marginTop: 11, marginBottom: 4, marginRight: 20, flex: 1
                }}>
                <Animated.Text
                    style={{
                        color: 'black',
                        paddingHorizontal: 10,
                        fontWeight: '600',
                        transform: [{ translateX: trans }],
                        fontSize: 20
                    }}>
                    Edit
                </Animated.Text>
            </View>
        )
    }


    const rightSwipeActions = (progress, dragX, item) => {
        // const scale = dragX.interpolate({
        // inputRange: [-100, 0],
        //     outputRange: [0.7, 0]
        // })
        return (
            <>
                <View style={{
                    backgroundColor: 'red',
                    justifyContent: 'center',
                    marginTop: 12,
                    marginBottom: 4, borderRadius: 10, marginRight: 5,
                }}>
                    <TouchableOpacity onPress={() => {
                        setIsModalVisible(true), setId(item.id);
                    }}>
                        <Animated.Text
                            style={{
                                color: 'white',
                                paddingHorizontal: 10,
                                fontWeight: 'bold',
                                // transform: [{ scale }],
                                fontSize: 18
                            }}>
                            Delete
                        </Animated.Text>
                    </TouchableOpacity>
                </View>
                {/* <View style={{ backgroundColor: 'green', justifyContent: 'center' }}>
                    <Animated.Text
                        style={{
                            color: 'white',
                            paddingHorizontal: 10,
                            fontWeight: '600',
                            transform: [{ scale }]
                        }}>
                        Archive
                    </Animated.Text>
                </View> */}
            </>
        )
    }


    // const rightSwipeActions = () => {
    //     return (
    //         <View
    //             style={{
    //                 backgroundColor: '#ff8303',
    //                 justifyContent: 'center',
    //                 alignItems: 'flex-end',
    //                 marginTop: 10, marginBottom: 4
    //             }}
    //         >
    //             <Text
    //                 style={{
    //                     color: '#1b1a17',
    //                     //  paddingHorizontal: 10,
    //                     fontWeight: '600',
    //                     paddingHorizontal: 30,
    //                     paddingVertical: 20,
    //                 }}
    //             >
    //                 Delete
    //             </Text>
    //         </View>
    //     );
    // };

    const swipeFromLeftOpen = (progress, item) => {
        console.log(item, progress)
        {
            [...rowRefs.entries()].forEach(([key, ref]) => {
                ref.close();
            });
        }
        // navigation.navigate('ApplieLeave', {
        //     detailObj: item,
        //     isEdit: true,
        // })
        setAppliedLeaveModalVisible(true);
        setStartDate(moment(item.startdate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
        setLevaveReason(item.description);
        setEndDate(moment(item.enddate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
        setLeavesType(item.leavetype);
        setLeaveStartDateHalfType(item.starthalf);
        setLeaveEndDateHalfType(item.endhalf);
        setIds(item.id);
        setIsEdit(true);
    };
    const swipeFromRightOpen = () => {
        alert('Swipe from right');
    };

    const closeRow = (index) => {

        if (prevOpenedRow && prevOpenedRow !== row[index]) {
            return prevOpenedRow.current.close();
        }
        prevOpenedRow = row[index];

    }

    const ReanderLeaveDetailCard = ({ item, index }) => {
        console.log('item...', item)
        return (
            <GestureHandlerRootView>
                <Swipeable
                    //  renderLeftActions={LeftSwipeActions}
                    //  renderRightActions={rightSwipeActions}
                    //   onSwipeableRightOpen={swipeFromRightOpen}
                    onSwipeableLeftOpen={(progress) => swipeFromLeftOpen(progress, item)}
                    //    onSwipeableClose
                    // ref={ref => row[index] = ref}
                    // onSwipeableOpen={closeRow(index)}
                    renderLeftActions={LeftSwipeActions}
                    leftThreshold={10}
                    key={item.id}
                    ref={ref => {
                        if (ref && !rowRefs.get(item.id)) {
                            rowRefs.set(item.id, ref);
                        }
                    }}
                    onSwipeableWillOpen={() => {
                        [...rowRefs.entries()].forEach(([key, ref]) => {
                            if (key !== item.id && ref) ref.close();
                        });
                    }}
                    // onSwipeableOpen={left}

                    //  onSwipeableWillClose={swipeFromRightOpen}
                    renderRightActions={(progress, dragX) => rightSwipeActions(progress, dragX, item, index)}
                >
                    <View style={{
                        marginHorizontal: 20,
                        backgroundColor: 'white',
                        paddingVertical: 10,
                        paddingHorizontal: 10,
                        marginTop: 10,
                        borderRadius: 10,
                        // alignItems: 'center',
                        //  justifyContent: 'space-around',
                        shadowColor: 'black',
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 5, marginBottom: 5
                    }}>
                        <View style={{ flexDirection: 'row', }}>

                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, fontWeight: 'bold', color: 'black' }}>{item.leavetype}</Text>
                            </View>
                            <View style={{
                                padding: 5, paddingHorizontal: 10, backgroundColor: RenderBackgroundColor(item.status), borderRadius: 20,
                                shadowColor: 'black',
                                shadowOffset: { width: 2, height: 5 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 1, marginBottom: 5
                            }}>
                                <Text style={{
                                    fontSize: 16,
                                    fontWeight: 'bold',
                                    //  textAlign: 'center',m
                                    //     color: item.status == 'Approved' ? 'orange' : '#E9BD1E',
                                    color: RenderFontColor(item.status)
                                }}>
                                    {item.status}
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ color: 'gray', marginTop: -10 }}>{item.startdate} TO {item.enddate}</Text>
                        </View>
                        <View>
                            <Text style={{ marginTop: 5 }}>Duration : <Text style={{ color: 'gray' }}>{item.dayscount} days</Text></Text>
                        </View>
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16, color: 'green' }}>{item.leavetype}</Text>
                                <Text style={{ fontSize: 16, color: 'gray' }}>
                                    StartDate : {item.startdate}
                                </Text>
                                <Text style={{ fontSize: 16, color: 'gray' }}>
                                    EndDate : {item.enddate}
                                </Text>
                            </View>
                            <View style={{ alignItems: "flex-end" }}>
                                <Text style={{ fontSize: 16, color: 'gray' }}>Total Days : {item.dayscount}</Text>
                                <Text style={{ color: 'gray' }}>{item.starthalf}</Text>
                                <Text style={{ color: 'gray' }}>{item.endhalf}</Text>
                            </View>
                        </View> */}
                        <View style={{ flexDirection: 'row', flex: 1, marginTop: 5 }}>
                            <Text>Description : </Text>
                            <Text style={{ flex: 1, color: 'gray', }}>{item.description}</Text>
                        </View>
                    </View>
                </Swipeable>
            </GestureHandlerRootView>
        )
    }

    const RenderColor = (item) => {
        console.log('?????????', item)
        if (item.name == 'Total') {
            return ('red')
        } else if (item.name == 'Casual') {
            return 'pink'
        } else if (item.name == 'Sick') {
            return 'yellow'
        } else if (item.name == 'Privileged') {
            return 'green'
        }
    }

    const onDelete = async id => {
        // setLoading(true);
        console.log('cardid', id);
        const response = await deleteApi(Constant.DeleteUserLeaveURL + id);
        console.log('delete', response);
        if (response.status == 'success') {
            GetUserLeave();
            // setLoading(false);
        } else {
            ErrorToast(response.message);
            //  setLoading(false);
            // HandleApiResponseError(response)
        }
    };

    return (
        <SafeAreaView style={[CommonStyle.SafeAreaView]}>
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
            {/* {!loading && */}
            <View style={{ backgroundColor: Constant.darkturquoise, flex: 1 }}>
                <View style={{ flex: 1, backgroundColor: 'white', borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                    <View style={{
                        backgroundColor: 'white', paddingVertical: 10, borderRadius: 10, marginTop: 20,
                        shadowColor: 'black',
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 5, marginHorizontal: 20,
                    }}>
                        <View style={{ marginHorizontal: 10 }}>
                            <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Balance</Text>
                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 5 }}>
                                <Text style={{ fontSize: 14, }}>Total : <Text style={{ color: '#A7196F' }}>{totalLeave.total}</Text></Text>
                                <Text style={{ fontSize: 14, }}>used : <Text style={{ color: '#FFC500' }}>{totalLeave.used}</Text></Text>
                                <Text style={{ fontSize: 14, }}>Remain : <Text style={{ color: '#00E6DF' }}>{totalLeave.used}</Text></Text>
                            </View>
                        </View>

                    </View>
                    <View style={{ marginTop: 10, marginHorizontal: 15 }}>
                        <FlatList
                            //  horizontal={true}
                            //  showsHorizontalScrollIndicator={false}
                            numColumns={3}
                            data={leaveType}
                            renderItem={RenderLeaveCard}
                        />
                    </View>
                    <View style={{ marginHorizontal: 20, marginTop: 10 }}>
                        <Text>History</Text>
                    </View>
                    <View>
                        <FlatList
                            showsHorizontalScrollIndicator={false}
                            data={applieLeaveDetails}
                            renderItem={ReanderLeaveDetailCard}
                        />
                    </View>
                    {/* <View style={{ marginTop: 10, marginHorizontal: 20, justifyContent: 'flex-end', flex: 1, marginBottom: 20 }}>
                        <CustomButton text='applied for leave' onPress={() => navigation.navigate('ApplieLeave', { isEdit: false })} />
                    </View> */}
                    <View style={{ position: "absolute", bottom: 20, right: 20, padding: 15, borderRadius: 40, backgroundColor: Constant.darkturquoise }}>
                        {/* <TouchableOpacity onPress={() => navigation.navigate('ApplieLeave', { isEdit: false })}> */}
                        <TouchableOpacity onPress={() => { setAppliedLeaveModalVisible(true), setIsEdit(false) }}>
                            <FontAwesome5 name='plus' size={20} color='white' />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            {/* } */}
            <Modal isVisible={isMoadlVisible}>
                <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1 }}>
                                <Text style={{ fontSize: 16 }}>Cancel Leave?</Text>
                            </View>
                            <View style={{}}>
                                <Image source={require('../../Assets/Icon/Close.png')}
                                    style={{ height: 30, width: 30 }}
                                />
                            </View>
                        </View>
                        <View style={{ marginTop: 10 }}>
                            <Text style={{ fontSize: 16 }}>Are you sure, You want to cancel Leave?</Text>
                        </View>
                        <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, marginRight: 20 }}>
                                <CustomButton text='no' onPress={() => {
                                    [...rowRefs.entries()].forEach(([key, ref]) => {
                                        ref.close();
                                    });
                                    setIsModalVisible(false)
                                }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomButton text='yes' onPress={() => {
                                    [...rowRefs.entries()].forEach(([key, ref]) => {
                                        ref.close();
                                    });
                                    onDelete(id), setIsModalVisible(false)
                                }} />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>


            <Modal isVisible={appliedLeaveModalVisible}
                onBackdropPress={() => {
                    setAppliedLeaveModalVisible(false);
                    setStartDate('');
                    setLevaveReason('');
                    setEndDate('');
                    setLeavesType('');
                    setLeaveStartDateHalfType('');
                    setLeaveEndDateHalfType('');
                }}
            //  onSwipeDown={() => setIsFileTransferModalVisible(false)}
            >
                <View style={{ justifyContent: 'flex-end', flex: 1, marginBottom: -20, marginHorizontal: -20, }}>
                    <View style={{ backgroundColor: 'white', padding: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 }}>
                        <View style={{ alignItems: 'center', }}>
                            <View style={{ height: 2, width: 40, backgroundColor: 'gray' }}></View>
                            <View style={{ height: 2, width: 40, backgroundColor: 'gray', marginTop: 2 }}></View>
                        </View>
                        <View>
                            <Text style={{ textAlign: 'center', marginTop: 5 }}>Applied Leave</Text>
                        </View>

                        <KeyboardAwareScrollView
                            //   style={{ flex: 1 }}
                            keyboardShouldPersistTaps="handled"
                            contentContainerStyle={{ flexGrow: 1 }}
                            showsVerticalScrollIndicator={false}
                        >
                            <View style={{ marginHorizontal: 10, }}>
                                <Dropdown
                                    placeholder="Leave Type"
                                    label="name"
                                    style={{
                                        borderWidth: 1,
                                        borderRadius: 10,
                                        paddingHorizontal: 8,
                                        height: 58,
                                        marginTop: 15,
                                        borderColor: isFocusdropdown1
                                            ? Constant.darkturquoise
                                            : 'gray',
                                    }}
                                    maxHeight={200}
                                    data={LeaveType}
                                    value={leavesType}
                                    labelField="name"
                                    valueField="name"
                                    autoScroll={true}
                                    onFocus={() => setIsFocusdropdown1(true)}
                                    onBlur={() => setIsFocusdropdown1(false)}
                                    onChange={item => {
                                        setLeavesType(item.name);
                                        setIsFocusdropdown1(false);
                                    }}
                                    renderRightIcon={() => (
                                        <Image
                                            source={require('../../Assets/Icon/DropDown.png')}
                                        />
                                    )}
                                />
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                                    <TouchableOpacity style={{ flex: 1, marginRight: 20 }} onPress={() => setIsCalModalVisible(true)}>
                                        <TextInput
                                            value={startDate != '' ? moment(startDate).format('DD-MM-YYYY') : ''}
                                            mode="outlined"
                                            label="StartDate"
                                            onChangeText={Leave => setLevaveStart(Leave)}
                                            keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                            placeholder="Enter Your Email"
                                            theme={Constant.theme}
                                            editable={false}
                                            activeOutlineColor={Constant.darkturquoise}
                                            style={{ marginTop: 20, }}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ flex: 1, marginTop: 6 }}>
                                        <Dropdown
                                            placeholder="Half Type"
                                            label="name"
                                            style={{
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                paddingHorizontal: 8,
                                                height: 58,
                                                marginTop: 20,
                                                borderColor: isFocusdropdown2
                                                    ? Constant.darkturquoise
                                                    : 'gray',
                                            }}
                                            maxHeight={200}
                                            data={HalfType}
                                            value={leaveStartDateHalfType}
                                            labelField="name"
                                            valueField="name"
                                            dropdownPosition='bottom'
                                            autoScroll={true}
                                            onFocus={() => setIsFocusdropdown2(true)}
                                            onBlur={() => setIsFocusdropdown2(false)}
                                            onChange={item => {
                                                setLeaveStartDateHalfType(item.name);
                                                setIsFocusdropdown2(false);
                                            }}
                                            renderRightIcon={() => (
                                                <Image
                                                    source={require('../../Assets/Icon/DropDown.png')}
                                                />
                                            )}
                                        />
                                    </View>
                                </View>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <TouchableOpacity style={{ flex: 1, marginRight: 20 }} onPress={() => setIsEndDateModalVisible(true)}>
                                        <TextInput
                                            value={endDate != '' ? moment(endDate).format('DD-MM-YYYY') : ''}
                                            editable={false}
                                            mode="outlined"
                                            label="EndDate"
                                            onChangeText={Leave => setLevaveStart(Leave)}
                                            keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                            placeholder="Enter Your Email"
                                            theme={Constant.theme}
                                            activeOutlineColor={Constant.darkturquoise}
                                            style={{ marginTop: 20, }}
                                        />
                                    </TouchableOpacity>
                                    <View style={{ flex: 1, marginTop: 6 }}>
                                        <Dropdown
                                            placeholder="Half Type"
                                            label="name"
                                            style={{
                                                borderWidth: 1,
                                                borderRadius: 10,
                                                paddingHorizontal: 8,
                                                height: 58,
                                                marginTop: 20,
                                                borderColor: isFocusdropdown3
                                                    ? Constant.darkturquoise
                                                    : 'gray',
                                            }}
                                            maxHeight={200}
                                            data={HalfType}
                                            value={leaveEndDateHalfType}
                                            labelField="name"
                                            valueField="name"
                                            dropdownPosition='bottom'
                                            autoScroll={true}
                                            onFocus={() => setIsFocusdropdown3(true)}
                                            onBlur={() => setIsFocusdropdown3(false)}
                                            onChange={item => {
                                                setLeaveEndDateHalfType(item.name);
                                                setIsFocusdropdown3(false);
                                            }}
                                            renderRightIcon={() => (
                                                <Image
                                                    source={require('../../Assets/Icon/DropDown.png')}
                                                />
                                            )}
                                        />
                                    </View>
                                </View>
                                <View>
                                    <TextInput
                                        value={leaveReason}
                                        mode="outlined"
                                        label="Reason"
                                        onChangeText={Leave => setLevaveReason(Leave)}
                                        keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                        placeholder="Enter Your Reason"
                                        numberOfLines={5}
                                        multiline
                                        theme={Constant.theme}
                                        activeOutlineColor={Constant.darkturquoise}
                                        style={{ marginTop: 20 }}
                                    />
                                </View>


                            </View>
                            <View style={{ marginTop: 30, marginHorizontal: 10, }}>
                                <CustomButton text='submit' onPress={() => { OnSubmitPress() }} />
                            </View>
                        </KeyboardAwareScrollView>
                    </View>
                </View>
            </Modal>

            <Modal isVisible={isCalModalVisible}>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Calendar
                            // initialDate={'2022-08-15'}
                            minDate={moment().format('YYYY-MM-DD')}
                            onDayPress={day => {
                                console.log('selected day', day.dateString);
                                setSelectedDate(
                                    { [day.dateString]: { selected: true, marked: true, selectedColor: Constant.darkturquoise } }
                                )
                                setDate(day.dateString)
                            }}
                            markedDates={selectedDate == '' ?
                                { [startDate]: { selected: true, marked: true, selectedColor: Constant.darkturquoise } }
                                : selectedDate
                            }

                        />
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <View style={{ flex: 1, marginRight: 20 }}>
                                <CustomButton text='cancel' onPress={() => { setIsCalModalVisible(false), setSelectedDate(''), setDate(startDate) }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomButton text='confirm'
                                    onPress={() => { setStartDate(date), setIsCalModalVisible(false) }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>
            <Modal isVisible={isEndDateModalVisible}>
                <View style={{ justifyContent: 'center', flex: 1 }}>
                    <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10 }}>
                        <Calendar
                            // initialDate={'2022-08-15'}
                            minDate={startDate}
                            onDayPress={day => {
                                console.log('selected day', day.dateString);
                                setSelectedEndDate(
                                    { [day.dateString]: { selected: true, marked: true, selectedColor: Constant.darkturquoise } }
                                )
                                setDateEnd(day.dateString)
                            }}
                            markedDates={selectedEndDate == '' ?
                                { [endDate]: { selected: true, marked: true, selectedColor: Constant.darkturquoise } }
                                : selectedEndDate
                            }

                        />
                        <View style={{ flexDirection: 'row', marginTop: 20 }}>
                            <View style={{ flex: 1, marginRight: 20 }}>
                                <CustomButton text='cancel' onPress={() => { setIsEndDateModalVisible(false), setSelectedEndDate(''), setDateEnd(endDate) }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomButton text='confirm'
                                    onPress={() => { setEndDate(dateEnd), setIsEndDateModalVisible(false) }}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </Modal>

        </SafeAreaView>
    )
}