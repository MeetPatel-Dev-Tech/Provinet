import React from 'react';
import { View, Text, SafeAreaView, ScrollView, TextInput, StatusBar, FlatList, TouchableOpacity, Platform, Image, SliderBase, Alert } from "react-native"
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Attendance from '../../../Screens/Attandance/Attandance';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Task from '../../../Screens/Task/Task';
import HomeScreen from '../../../Screens/Home/HomeScreen';
import Constant from '../../../CommonFiles/Constant';
import TabNavigation from '../TabNavigation/TabNavigation';
import Leave from '../../../Screens/Leave/AppliedLeave';
import AppliedLeave from '../../../Screens/Leave/AppliedLeave';
import LeaveDetail from '../../../Screens/Leave/LeaveDetail';
import News from '../../../Screens/News/News';
import Holiday from '../../../Screens/Holiday/Holiday';
import DayAllPunchInOutDetail from '../../../Screens/Attandance/DayAllPunchInOutDetail';
import Chat from '../../../Screens/Chat/Chat';
import ProfileScreen from '../../../Screens/Profile/ProfileScreen';
import UserList from '../../../Screens/Chat/UserList/Userlist';
import TopTabBarNavigation from '../TopTabNavigation/TopTabBarNavigation';
import Approvals from '../../../Screens/Approvals/Approvals';
import { Tasks } from '../../../CommonFiles/SvgFile';
import CreateGroup from '../../../Screens/Chat/CreateGroupScreen/CreateGroup';
import GroupName from '../../../Screens/Chat/CreateGroupScreen/GroupName';
import DailyReport from '../../../Screens/DailyReport/DailyReport';
import LeaveApprovals from '../../../Screens/Approvals/LeaveApprovals/LeaveApprovals';
import TimeSheet from '../../../Screens/Approvals/TimeSheet/TimeSheet';
import ExpenseAndClaimsUser from '../../../Screens/Approvals/ExpenseAndClaimsUser/ExpenseAndClaimsUser';
import ExpenseAndClaims from '../../../Screens/Approvals/ExpenseAndClaimsAdmin/ExpanseAndClaims';
import ExpenseAndClaimsDetails from '../../../Screens/Approvals/ExpenseAndClaimsAdmin/ExpanseAndClaimsDetails';
import AddAttechment from '../../../Screens/Approvals/ExpenseAndClaimsAdmin/AddAttechment';
import GroupChat from '../../../Screens/Chat/GroupChat';
import GroupDetailScreen from '../../../Screens/Chat/CreateGroupScreen/GroupDetailScreen';
import AudioCallScreen from '../../../Screens/Chat/AudioCallScreen/AudioCallScreen';
import VideoCallScreen from '../../../Screens/Chat/VideoCallScreen/VideoCallScreen';
;

export default function AppStackNavigation({ navigation }) {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: { fontWeight: '500', fontSize: 24, color: Constant.darkturquoise },
            }}
            initialRouteName="TabNavigation"
        >
            {/* <Stack.Screen
                name="HomeScreen"
                component={HomeScreen}
                options={{ headerShown: false }}
            /> */}
            <Stack.Screen
                name="TabNavigation"
                component={TabNavigation}
                options={({ navigation }) => ({
                    title: 'TabNavigation',
                    headerShown: false
                })}
            />
            <Stack.Screen
                name="Attendance"
                component={Attendance}
                options={({ navigation }) => ({
                    title: 'Attendance'
                })}
            />
            {/* <Stack.Screen
                name="Task"
                component={Task}
                options={({ navigation }) => ({
                    title: 'Task'
                })}
            /> */}
            <Stack.Screen
                name="Task"
                component={Task}
                options={({ navigation }) => ({
                    title: 'Task',
                    //   headerStyle: { backgroundColor: Constant.darkturquoise }
                })}
            />
            <Stack.Screen
                name="ApplieLeave"
                component={AppliedLeave}
                options={({ navigation }) => ({
                    title: 'Applie Leave',
                })}
            />
            <Stack.Screen
                name="LeaveDetail"
                component={LeaveDetail}
                options={({ navigation }) => ({
                    title: 'Leave Detail',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }

                })}
            />
            <Stack.Screen
                name="News"
                component={News}
                options={({ navigation }) => ({
                    title: 'News'
                })}
            />
            <Stack.Screen
                name="Holiday"
                component={Holiday}
                options={({ navigation }) => ({
                    title: 'Holiday'
                })}
            />
            <Stack.Screen
                name="DayAllPunchInOutDetail"
                component={DayAllPunchInOutDetail}
                options={({ navigation }) => ({
                    title: 'Daily Attendance'
                })}
            />
            <Stack.Screen
                name="Chat"
                component={Chat}
                options={({ navigation }) => ({
                    title: '',
                    headerStyle: {},
                    headerShadowVisible: true
                })}
            />
            <Stack.Screen
                name="GroupChat"
                component={GroupChat}
                options={({ navigation }) => ({
                    title: '',
                    headerStyle: {},
                    headerShadowVisible: true
                })}
            />
            <Stack.Screen
                name="AudioCallScreen"
                component={AudioCallScreen}
                options={({ navigation }) => ({
                    headerShown: false,
                    headerStyle: {},
                    headerShadowVisible: true
                })}
            />
            <Stack.Screen
                name="VideoCallScreen"
                component={VideoCallScreen}
                options={({ navigation }) => ({
                    headerShown: false,
                    headerStyle: {},
                    headerShadowVisible: true
                })}
            />
            <Stack.Screen
                name="Profile"
                component={ProfileScreen}
                options={({ navigation }) => ({
                    title: 'Profile'
                })}
            />
            <Stack.Screen
                name="Approvals"
                component={Approvals}
                options={({ navigation }) => ({
                    title: 'Approvals',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="LeaveApprovals"
                component={LeaveApprovals}
                options={({ navigation }) => ({
                    title: 'LeaveApprovals',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="TimeSheet"
                component={TimeSheet}
                options={({ navigation }) => ({
                    title: 'Time Sheet',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="ExpenseAndClaims"
                component={ExpenseAndClaims}
                options={({ navigation }) => ({
                    title: 'Expense & Claims',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="ExpenseAndClaimsUser"
                component={ExpenseAndClaimsUser}
                options={({ navigation }) => ({
                    title: 'Expense & Claims',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="ExpenseAndClaimsDetails"
                component={ExpenseAndClaimsDetails}
                options={({ navigation }) => ({
                    title: 'Expense & Claims',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="Attechment"
                component={AddAttechment}
                options={({ navigation }) => ({
                    title: 'Attechment',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="CreateGroup"
                component={CreateGroup}
                options={({ navigation }) => ({
                    title: 'New Group',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="GroupName"
                component={GroupName}
                options={({ navigation }) => ({
                    title: 'New Group',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="GroupDetailScreen"
                component={GroupDetailScreen}
                options={({ navigation }) => ({
                    title: 'Group info',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="DailyReport"
                component={DailyReport}
                options={({ navigation }) => ({
                    title: 'Attendance',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    headerTitleStyle: { color: 'white' }
                })}
            />
            <Stack.Screen
                name="UserList"
                component={TopTabBarNavigation}
                options={({ navigation }) => ({
                    //  title: 'gg',
                    headerStyle: { backgroundColor: Constant.darkturquoise },
                    // headerLeft: () => (
                    //     <>
                    //         <TouchableOpacity onPress={() => navigation.goBack()}>
                    //             <AntDesign name='arrowleft' size={25} color='white' />
                    //         </TouchableOpacity>
                    //         <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: 'white' }}>Chat</Text>
                    //     </>
                    // ),
                    // headerRight: () => (
                    //     <>
                    //         <AntDesign name='search1' size={20} style={{ marginLeft: 5 }} color='white' />
                    //     </>
                    // ),
                })}
            />
        </Stack.Navigator>
    );
}
