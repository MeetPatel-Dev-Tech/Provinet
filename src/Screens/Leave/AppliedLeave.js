import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image, FlatList } from "react-native";
import { TextInput } from 'react-native-paper';
import Modal from 'react-native-modal';
import { Dropdown } from 'react-native-element-dropdown';
import ProgressLoader from 'rn-progress-loader';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { Calendar } from 'react-native-calendars';
import moment from 'moment';
import CommonStyle from '../../CommonFiles/CommonStyle'
import Constant from '../../CommonFiles/Constant';
import CustomButton from '../../Components/CustomButton/CustomButton';
import Message from '../../CommonFiles/Message';
import { ErrorToast, SuccessToast } from '../ToastMessage/Toast';
import { CommonUtilsObj, setLoggedEmployeDetails } from '../../Utils/CommonUtils';
import { PostApi } from '../../Api/Api';
import { navigationRef } from '../../Navigation/RootNavigation';

export default function AppliedLeave({ route, navigation }) {

    const [leaveStart, setLevaveStart] = useState('');
    const [loading, setLoading] = useState(false);
    const [leaveReason, setLevaveReason] = useState(route.params?.detailObj?.description ?? '');
    const [startDate, setStartDate] = useState(route.params.detailObj == undefined ? '' : moment(route.params.detailObj.startdate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
    const [date, setDate] = useState();
    const [dateEnd, setDateEnd] = useState();
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedEndDate, setSelectedEndDate] = useState('');
    const [endDate, setEndDate] = useState(route.params.detailObj == undefined ? '' : moment(route.params.detailObj.enddate, 'DD-MM-YYYY').format('YYYY-MM-DD'));
    const [isStartDateModalVisible, setisStartDateModalVisible] = useState(false);
    const [isEndDateModalVisible, setIsEndDateModalVisible] = useState(false);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFocusdropdown1, setIsFocusdropdown1] = useState(false);
    const [isFocusdropdown2, setIsFocusdropdown2] = useState(false);
    const [isFocusdropdown3, setIsFocusdropdown3] = useState(false);
    const [leaveType, setLeaveType] = useState(route.params?.detailObj?.leavetype ?? '');
    const [leaveStartDateHalfType, setLeaveStartDateHalfType] = useState(route.params?.detailObj?.starthalf ?? '');
    const [leaveEndDateHalfType, setLeaveEndDateHalfType] = useState(route.params?.detailObj?.endhalf ?? '');

    // useEffect(() => {
    //     setStartDate('');
    //     setEndDate('');
    // }, []);
    //  console.log('<<<<<<<<', moment(startDate).format('YYYY-MM-DD'))
    console.log('<<<<<<<<', selectedDate)
    console.log('start', startDate)

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

        if (leaveType == '') {
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
        setloading(true);
        console.log('<<<<<', moment(startDate).format('DD-MM-YYYY'))
        const data = {
            leavetype: leaveType,
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
            route.params.isEdit == false ? Constant.ApplyLeaveURL : Constant.UpdateLeaveURL,
            route.params.isEdit == false ? data : { ...data, id: route.params.detailObj.id },
            route.params.isEdit == false ? false : true
        )
        console.log('ApplyLeave', ResponseData)
        if (ResponseData.status == 'success') {
            if (route.params.isEdit == false) {
                SuccessToast('Leave Succesfully Applied');
                setloading(false);
            } else {
                SuccessToast('Leave Succesfully Update');
                setloading(false);
            }
            navigation.goBack()
        } else {
            ErrorToast(ResponseData.message);
            setloading(false);
        }
    }

    return (
        <SafeAreaView style={CommonStyle.SafeAreaView}>
            <ProgressLoader
                visible={loading}
                isModal={true}
                isHUD={true}
                hudColor={'#fff'}
                height={200}
                width={200}
                color={'#000'}
            />
            <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
            >
                <View style={{ marginHorizontal: 20, flex: 1 }}>
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
                        value={leaveType}
                        labelField="name"
                        valueField="name"
                        autoScroll={true}
                        onFocus={() => setIsFocusdropdown1(true)}
                        onBlur={() => setIsFocusdropdown1(false)}
                        onChange={item => {
                            setLeaveType(item.name);
                            setIsFocusdropdown1(false);
                        }}
                        renderRightIcon={() => (
                            <Image
                                source={require('../../Assets/Icon/DropDown.png')}
                            />
                        )}
                    />
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>

                        <TouchableOpacity style={{ flex: 1, marginRight: 20 }} onPress={() => setIsModalVisible(true)}>
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
                <View style={{ marginTop: 30, marginBottom: 20, marginHorizontal: 20, }}>
                    <CustomButton text='submit' onPress={() => { OnSubmitPress() }} />
                </View>


                {/* <DatePicker
                modal
                open={isStartDateModalVisible}
                date={startDate} 
                mode={'date'}
                onConfirm={(date) => {
                    setisStartDateModalVisible(false)
                    setStartDate(date)
                }}
                onCancel={() => {
                    setisStartDateModalVisible(false)
                }}
            /> */}
                {/* <DatePicker
                modal
                open={isEndDateModalVisible}
                date={endDate}
                mode={'date'}
                onConfirm={(date) => {
                    setIsEndDateModalVisible(false)
                    setDate(date)
                }}
                onCancel={() => {
                    setIsEndDateModalVisible(false)
                }}
            /> */}
            </KeyboardAwareScrollView>
            <Modal isVisible={isModalVisible}>
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
                                <CustomButton text='cancel' onPress={() => { setIsModalVisible(false), setSelectedDate(''), setDate(startDate) }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomButton text='confirm'
                                    onPress={() => { setStartDate(date), setIsModalVisible(false) }}
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