import React, { useState, useEffect, useRef, useContext } from 'react'
import { View, Text, LayoutAnimation, UIManager, SafeAreaView, ScrollView, Dimensions, TextInput, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native";
import Octicons from 'react-native-vector-icons/Octicons';
import moment from 'moment';
import { GetApi } from '../../Api/Api';
import Constant from '../../CommonFiles/Constant';
import { ArrowIcon, EllipseGreen, Timer, EllipseParpale, EllipseRed, EllipseYellow, Logout } from '../../CommonFiles/SvgFile';
import { CommonUtilsObj } from '../../Utils/CommonUtils';
import { AccordionList } from "accordion-collapse-react-native";

export default function DailyReport({ navigation }) {


    const [ref, setRef] = useState(null);
    const [flatListRef, setFlatListRef] = useState('');
    const [dailyAttendance, setDailtAttendance] = useState('');
    const [count, setCount] = useState(0);
    const [show, setShow] = useState(false);
    const [ids, setIds] = useState('');


    useEffect(() => {

        navigation.setOptions({
            headerRight: () => (
                <View style={{}}>
                    <Logout height={25} width={25} />
                </View>
            ),
        });

    }, []);


    useEffect(() => {
        userAllpunchInOut();
    }, []);

    const userAllpunchInOut = async () => {
        const ResponseData = await GetApi(Constant.DailyAttendanceURL + CommonUtilsObj.EmployeDetails[0].user)
        console.log('DailyAttendanceURL', ResponseData);
        setDailtAttendance(ResponseData.data);
    }

    const data = [
        { id: 1, name: 'jan' },
        { id: 2, name: 'fab' },
        { id: 3, name: 'mar' },
        { id: 4, name: 'apr' },
        { id: 5, name: 'may' },
        { id: 6, name: 'june' },
        { id: 7, name: 'july' },
        { id: 8, name: 'aug' },
        { id: 9, name: 'sep' },
        { id: 10, name: 'aug' },
        { id: 11, name: 'nov' },
        { id: 12, name: 'dec' },
    ]

    const renderData = ({ item }) => {
        return (
            <View style={{ flex: 1, marginRight: 50, marginLeft: 40 }}>
                <Text>{item.name}</Text>
            </View>
        )
    }

    setTimeout(() => {
        console.log('----acrtive screen -----',)
        if (ref != null) {
            console.log('---qqqqqqqqqqqqqqqq------')
            ref.scrollToIndex({
                animated: true,
                index: count,
                viewPosition: 0
            })
        }
    }, 100);

    const leftButton = () => {
        setCount(count - 1)
    }
    const RightButton = () => {
        setCount(count + 1)
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
            return `0${hours}.${minutes} Hrs`;
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
                            }}>
                                <Timer height={15} width={15} />
                            </View>
                            <View style={{ flex: 1, borderLeftWidth: 1, paddingVertical: 10, borderColor: 'gray', alignItems: 'center', justifyContent: 'center' }}>

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
                padding: 10, marginHorizontal: 2,

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

    const renderAccordition = (item) => {
        return (
            <View>
                <Text>Hello</Text>
            </View>
        )
    }


    return (
        <SafeAreaView style={{
            flex: 1,
            backgroundColor: Constant.darkturquoise
        }}>
            <View style={{
                marginTop: 10,
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15
            }}>
                <View style={{ marginHorizontal: 20, flex: 1 }}>
                    {/* <Text style={{ marginTop: 10, }}>Last Punch Out</Text>

                    <View style={{
                        marginTop: 10,
                        backgroundColor: 'white',
                        borderRadius: 20,
                        shadowColor: 'black',
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 3,
                        padding: 10,
                        flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                    }}>
                        <View style={{ backgroundColor: '#FBF7EB', justifyContent: 'center', borderRadius: 10 }}>
                            <View style={{ paddingVertical: 15, paddingHorizontal: 20, }}>
                                <Text style={{ fontWeight: 'bold' }}>
                                    Mon
                                </Text>
                                <Text style={{ textAlign: 'center', fontWeight: 'bold' }}>
                                    22
                                </Text>
                            </View>
                        </View>
                        <View>
                            <Text style={{ fontWeight: 'bold', textAlign: 'center' }}>Hours</Text>
                            <Text style={{}}>10:15AM</Text>
                        </View>
                        <View >
                            <View style={{ borderLeftWidth: 0.5, borderColor: 'gray', flex: 1, borderStyle: 'dashed' }}>

                            </View>
                        </View>
                        <View>
                            <Text style={{ fontWeight: 'bold' }}>Brake Time</Text>
                            <Text style={{ textAlign: 'center' }}>07:15PM</Text>
                        </View>
                        <View>
                            <ArrowIcon height={10} width={10} />
                        </View>
                    </View> */}
                    <View style={{ marginTop: 20, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                        {count > 0 &&
                            <View>
                                <TouchableOpacity onPress={() => { leftButton() }}>
                                    <Octicons name='arrow-left' size={20} />
                                </TouchableOpacity>
                            </View>
                        }
                        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                            <FlatList
                                data={data}
                                renderItem={renderData}
                                horizontal={true}
                                showsHorizontalScrollIndicator={false}
                                ref={
                                    (ref) => {
                                        //    console.log('--ref--', ref);
                                        setRef(ref);
                                    }
                                }
                            //  pagingEnabled={true}
                            />
                        </View>
                        {count < 15 &&
                            <View>
                                <TouchableOpacity onPress={() => {
                                    RightButton()
                                }}>
                                    <Octicons name='arrow-right' size={20} />
                                </TouchableOpacity>
                            </View>
                        }
                    </View>
                    <View style={{ marginTop: 5, marginBottom: 50, }}>
                        <FlatList showsVerticalScrollIndicator={false}
                            data={dailyAttendance}
                            renderItem={renderAllDayAttendanceReport}
                        />
                        {/* <AccordionList
                            list={dailyAttendance}
                            header={renderAllDayAttendanceReport}
                            body={renderAccordition}
                            keyExtractor={item => `${item.id}`}

                        /> */}
                    </View>



                </View>


            </View>
        </SafeAreaView>
    )
}