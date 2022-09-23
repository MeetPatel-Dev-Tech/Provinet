import React, { useState, useEffect, useRef, useContext } from 'react'
import {
    View,
    Text,
    SafeAreaView,
    ScrollView,
    Dimensions,
    FlatList,
    TouchableOpacity,
    Platform,
    Image,
    SliderBase,
    Alert,
    UIManager,
    LayoutAnimation
} from "react-native";
import Octicons from 'react-native-vector-icons/Octicons';
import moment from 'moment';
import { GetApi } from '../../../Api/Api';
import Constant from '../../../CommonFiles/Constant';
import { CommonUtilsObj } from '../../../Utils/CommonUtils';
import { ArrowIcon, Timer } from '../../../CommonFiles/SvgFile';

export default function TimeSheet({ navigation }) {


    const [dailyAttendance, setDailtAttendance] = useState('');
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);
    const [ids, setIds] = useState('');

    useEffect(() => {
        userAllpunchInOut();
    }, []);

    const userAllpunchInOut = async () => {
        const ResponseData = await GetApi(Constant.DailyAttendanceURL + CommonUtilsObj.EmployeDetails[0].user)
        console.log('DailyAttendanceURL', ResponseData);
        setDailtAttendance(ResponseData.data);
    }


    const DateChange = (date) => {

        const new_date = moment(date)
        //   const data = new_date.add(1, 'day')
        const data1 = new_date.day()

        if (data1 == 0) {
            return 'Sun'
        } else if (data1 == 1) {
            return 'Mon'
        } else if (data1 == 2) {
            return 'Tue'
        } else if (data1 == 3) {
            return 'Wed'
        } else if (data1 == 4) {
            return 'Thur'
        } else if (data1 == 5) {
            return 'Fri'
        } else if (data1 == 6) {
            return 'Sat'
        }

    }
    const DateChange1 = (date) => {

        const new_date = moment(date)
        //   const data = new_date.add(1, 'day')
        const data1 = new_date.format('DD')


        return data1

    }
    const decimalToHours = (decimalTimeString) => {
        if (
            decimalTimeString == "NaN" ||
            decimalTimeString == null ||
            decimalTimeString == undefined
        ) {
            return "0 Hrs 0 Mins";
        } else {
            var decimalTime = parseFloat(decimalTimeString);
            decimalTime = decimalTime * 60 * 60;
            var hours = Math.floor(decimalTime / (60 * 60));
            decimalTime = decimalTime - hours * 60 * 60;
            var minutes = Math.floor(decimalTime / 60);
            decimalTime = decimalTime - minutes * 60;
            var seconds = Math.round(decimalTime);
            return `${hours} Hrs ${minutes} Mins`;
        }
    };

    const RenderBackgroundColor = (day) => {
        const new_date = moment(day)
        const Day = new_date.day()
        if (Day == 0) {
            return 'orange'
        } else if (Day == 1) {
            return '#FBF7EB'
        } else if (Day == 2) {
            return '#F2F0FD'
        } else if (Day == 3) {
            return '#FFF2FA'
        } else if (Day == 4) {
            return '#F1FDF3'
        } else if (Day == 5) {
            return '#FEDDE4'
        } else if (Day == 6) {
            return '#CCFFFD'
        }
    }

    const renderAbsuluteClr = (day) => {
        const new_date = moment(day)
        const Day = new_date.day()
        if (Day == 0) {
            return '#E9BD1E'
        } else if (Day == 1) {
            return '#E9BD1E'
        } else if (Day == 2) {
            return '#816DF0'
        } else if (Day == 3) {
            return '#A7196F'
        } else if (Day == 4) {
            return '#4CE264'
        } else if (Day == 5) {
            return '#E9BD1E'
        } else if (Day == 6) {
            return '#A7196F'
        }
    }

    if (
        Platform.OS === "android" &&
        UIManager.setLayoutAnimationEnabledExperimental
    ) {
        UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    const addUserId = id => {
        //console.log('selectedSongID: ', selectedSongID);
        if (ids.length !== 0) {
            if (!ids.includes(id)) {
                setIds([...ids, id]);
                //addSuccessMesage("Song added to the playlist!");
            } else {
                let newArr = ids.filter(i => i !== id);
                setIds(newArr);
                //addErrorMesage("Song removed from the playlist!");
            }
        } else {
            let arr = [];
            arr.push(id);
            setIds(arr);
        }
    };

    const randerDetailView = (id) => {
        let renderData = [...ids];
        for (let data of renderData) {
            if (data == id) {
                return (
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10, marginLeft: 25 }}>
                        <View style={{ alignItems: 'center' }}>
                            <View style={{
                                backgroundColor: '#816DF0',
                                padding: 5,
                                borderRadius: 15,
                                shadowColor: 'black',
                                shadowOffset: { width: 2, height: 5 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 3,
                            }} >
                                <Timer height={15} width={15} />
                            </View>
                            <View style={{ flex: 1, borderWidth: 1, paddingVertical: 10, borderColor: 'gray', alignItems: 'center', justifyContent: 'center' }}>

                            </View>
                            <View style={{
                                backgroundColor: '#816DF0',
                                padding: 5,
                                borderRadius: 15,
                                shadowColor: 'black',
                                shadowOffset: { width: 2, height: 5 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 3,
                            }}>
                                <Timer height={15} width={15} />
                            </View>
                        </View>
                        <View style={{ marginLeft: 10, justifyContent: 'center', flex: 1 }}>
                            <View>
                                <Text>
                                    Punch In at
                                </Text>
                            </View>
                            <View style={{ flex: 1, paddingVertical: 10, }}>
                                <Text>10:50PM</Text>
                            </View>
                            <View style={{}}>
                                <Text>Punch out at</Text>
                            </View>
                        </View>
                    </View>
                )
            }
        }
    }


    const renderAllDayAttendanceReport = ({ item }) => {
        return (
            <View style={{
                marginTop: 10,
                backgroundColor: 'white',
                borderRadius: 20,
                shadowColor: 'black',
                shadowOffset: { width: 2, height: 5 },
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 3,
                padding: 15, marginHorizontal: 20,

            }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>


                    <View style={{ backgroundColor: RenderBackgroundColor(item.date), height: 70, width: 70, justifyContent: 'center', borderRadius: 10 }}>
                        <Text style={{ fontWeight: 'bold', textAlign: 'center', }}>
                            {DateChange(item.date)}
                        </Text>
                        <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                            {DateChange1(item.date)}
                        </Text>
                        <View style={{
                            position: 'absolute',
                            top: -10,
                            left: 23,
                            alignItems: 'center',
                            backgroundColor: renderAbsuluteClr(item.date),
                            padding: 5,
                            borderRadius: 15,
                        }}>
                            <Timer height={15} width={15} />
                        </View>
                    </View>
                    <View style={{ flexDirection: 'row', flex: 1, }}>
                        <View style={{// width: '49.5%',
                            flex: 1, alignItems: 'center'
                        }}>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Hours</Text>
                            <Text style={{}}>{decimalToHours(item.hours)}</Text>
                        </View>
                        <View style={{ width: '1%' }}>
                            <View style={{ borderLeftWidth: 1, borderColor: 'gray', flex: 1, borderStyle: 'dashed' }}>

                            </View>
                        </View>
                        <View style={{ //width: '49.5%',
                            flex: 1,
                            alignItems: 'center'
                        }}>
                            <Text style={{ fontWeight: 'bold' }}>Brake Time</Text>
                            <Text style={{ textAlign: 'center' }}>{decimalToHours(item.breakTime)}</Text>
                        </View>
                    </View>
                    <View>
                        <TouchableOpacity style={{
                            //transform: renderRotateIcon(item.id),
                            backgroundColor: '#F3F3F3',
                            padding: 5,
                            borderRadius: 5,
                            shadowColor: 'black',
                            shadowOffset: { width: 2, height: 5 },
                            shadowOpacity: 1,
                            shadowRadius: 2,
                            elevation: 3, alignItems: 'center',
                            justifyContent: 'center'
                        }}

                            onPress={() => {
                                setShow(!show);
                                addUserId(item.id);
                                //    renderRotateIcon(item.id)
                                // setId(item.id);
                                // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeIn);
                                LayoutAnimation.configureNext({
                                    duration: 500,
                                    create: { type: "linear", property: "opacity" },
                                    update: { type: "linear", springDamping: 0.4 },
                                    delete: { type: "linear", property: "opacity" }
                                });
                            }}>
                            {/* <View style={{
                                transform: [{ rotate: show == true ? '90deg' : '0deg' }],
                                backgroundColor: '#F3F3F3',
                                padding: 5,
                                borderRadius: 5,
                                shadowColor: 'black',
                                shadowOffset: { width: 2, height: 5 },
                                shadowOpacity: 1,
                                shadowRadius: 2,
                                elevation: 3, alignItems: 'center'
                            }}> */}
                            <ArrowIcon height={10} width={10} />
                            {/* </View> */}
                        </TouchableOpacity>
                    </View>
                </View>
                {randerDetailView(item.id)}
            </View >
        )
    }

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Constant.darkturquoise }}>
            <View style={{
                marginTop: 10,
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15
            }}>
                <View style={{
                    marginHorizontal: 20,
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: "#CCFFFD",
                    shadowColor: 'black',
                    shadowOffset: { width: 2, height: 5 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    elevation: 3,
                    flexDirection: 'row', alignItems: 'center'
                }}>
                    <View style={{}}>
                        <Octicons name='arrow-left' size={20} />
                    </View>
                    <View style={{ flex: 1, alignItems: 'center' }}>
                        <Text>August 2022</Text>
                    </View>
                    <View style={{}}>
                        <Octicons name='arrow-right' size={20} />
                    </View>
                </View>
                <View>
                    <FlatList showsVerticalScrollIndicator={false}
                        data={dailyAttendance}
                        renderItem={renderAllDayAttendanceReport}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}