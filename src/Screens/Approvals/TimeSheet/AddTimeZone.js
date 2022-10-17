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
import { Calendar } from 'react-native-calendars';
import { TextInput } from 'react-native-paper';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import moment from 'moment';
import Constant from '../../../CommonFiles/Constant';
import CustomBorderButton from '../../../Components/CustomButton/CustomBorderButton';
import CustomButton from '../../../Components/CustomButton/CustomButton';

export default function AddTimeZone({ navigation }) {



    const [totalLeave, setTotalLeave] = useState('');
    const [leaveType, setLeaveType] = useState('');
    const [applieLeaveDetails, setApplieLeaveDetails] = useState('');
    const [isMoadlVisible, setIsModalVisible] = useState(false);
    const [appliedLeaveModalVisible, setAppliedLeaveModalVisible] = useState(false);
    const [id, setId] = useState('');
    const [loading, setLoading] = useState(false);


    const [startDate, setStartDate] = useState('');
    const [date, setDate] = useState();
    const [dateEnd, setDateEnd] = useState();
    const [selectedDate, setSelectedDate] = useState('');


    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: Constant.darkturquoise }}>
            <View style={{
                marginTop: 10,
                flex: 1,
                backgroundColor: 'white',
                borderTopLeftRadius: 15,
                borderTopRightRadius: 15
            }}>
                <KeyboardAwareScrollView
                    style={{ flex: 1 }}
                    keyboardShouldPersistTaps="handled"
                    contentContainerStyle={{ flexGrow: 1 }}
                    showsVerticalScrollIndicator={false}
                >
                    <View style={{ flex: 1 }}>
                        <View>
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
                                //  headerStyle={{ backgroundColor: 'orange' }}
                                theme={{

                                    'stylesheet.calendar.header': {
                                        // header: {
                                        //     backgroundColor: '#CCFFFD',
                                        //        flexDirection: 'row',
                                        //        alignItems: 'center',ju
                                        // },
                                        arrow: {
                                            // padding: 15,
                                        },
                                        arrowImage: {
                                            tintColor: 'blue', borderRadius: 5, backgroundColor: '#CCFFFD'
                                        }, headerContainer: {
                                            flexDirection: 'row',
                                            margin: 5,
                                        },
                                        partialWeek: {
                                            paddingRight: 10
                                        }, backgroundColor: 'orange'

                                    },
                                    // calendarBackground: Colors.white,
                                    textSectionTitleColor: '#b6c1cd',
                                    // textSectionTitleDisabledColor: '#d9e1e8',
                                    // selectedDayTextColor: Colors.gray,
                                    // todayTextColor: Colors.theme,
                                    // dayTextColor: Colors.textColor,
                                    // textDisabledColor: '#d9e1e8',
                                    // arrowColor: 'orange',
                                    // textDayFontFamily: Typography.FONT_FAMILY_REGULAR,
                                    // textMonthFontFamily: Typography.FONT_FAMILY_REGULAR,
                                    // textDayHeaderFontFamily: Typography.FONT_FAMILY_REGULAR,
                                    // textDayFontWeight: Typography.FONT_WEIGHT_MEDIUM,
                                    // textMonthFontWeight: Typography.FONT_WEIGHT_BOLD,
                                    // textDayHeaderFontWeight: Typography.FONT_WEIGHT_MEDIUM,
                                    // textDayFontSize: Typography.FONT_SIZE_12,
                                    // textMonthFontSize: Typography.FONT_SIZE_12,
                                    // textDayHeaderFontSize: Typography.FONT_SIZE_12
                                }}
                            />
                        </View>
                        <View style={{ marginHorizontal: 20 }}>
                            <TextInput
                                //   value={email}
                                mode="outlined"
                                label="Project Name"
                                // onChangeText={email => setEmail(email)}
                                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                placeholder="Provitious App"
                                theme={Constant.theme}
                                activeOutlineColor={Constant.darkturquoise}
                                style={{ marginTop: 20 }}
                            />
                            <TextInput
                                //   value={email}
                                mode="outlined"
                                label="Task Name"
                                // onChangeText={email => setEmail(email)}
                                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                placeholder="Enter Your Email"
                                theme={Constant.theme}
                                activeOutlineColor={Constant.darkturquoise}
                                style={{ marginTop: 20 }}
                            />
                            <TextInput
                                //   value={email}
                                mode="outlined"
                                label="Time"
                                // onChangeText={email => setEmail(email)}
                                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                placeholder="Enter Your Email"
                                theme={Constant.theme}
                                activeOutlineColor={Constant.darkturquoise}
                                style={{ marginTop: 20 }}
                            />
                            <TextInput
                                //   value={email}
                                mode="outlined"
                                label="Description"
                                // onChangeText={email => setEmail(email)}
                                keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                                placeholder="Enter Your Email"
                                theme={Constant.theme}
                                activeOutlineColor={Constant.darkturquoise}
                                style={{ marginTop: 20 }}
                            />
                        </View>
                    </View>
                    <View style={{ marginHorizontal: 20, marginBottom: 20, marginTop: 20 }}>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ flex: 1, marginRight: 20 }}>
                                <CustomBorderButton text='cancel' onPress={() => {
                                    navigation.goBack()
                                }} />
                            </View>
                            <View style={{ flex: 1 }}>
                                <CustomButton text='Add' onPress={() => {
                                    navigation.goBack()
                                }} />
                            </View>
                        </View>
                    </View>
                </KeyboardAwareScrollView>
            </View>
        </SafeAreaView>
    )
}