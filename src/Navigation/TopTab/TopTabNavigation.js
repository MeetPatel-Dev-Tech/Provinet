import React, { useEffect, useState, useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import PendigLeave from '../../Screens/Approvals/LeaveApprovals/PendingLeave/PendingLeave';
import HistoryLeave from '../../Screens/Approvals/LeaveApprovals/HistoryLeave/HistoryLeave';
import Constant from '../../CommonFiles/Constant';
import PendingExpanse from '../../Screens/Approvals/ExpenseAndClaimsUser/PendingExpanse';
import HistoryExpanse from '../../Screens/Approvals/ExpenseAndClaimsUser/HistoryExpanse';

const Tab = createMaterialTopTabNavigator();
const CalendarTabs = () => {
    return (
        <Tab.Navigator
            initialRouteName="Pending"
            // tabBarOptions={{
            //     showIcon: true,
            //     tabStyle: {
            //         flexDirection: 'row',
            //     },
            //     activeTintColor: Colors.white,
            //     inactiveTintColor: Colors.textColor,
            //     indicatorStyle: {
            //         backgroundColor: Colors.theme,
            //         borderRadius: 10,
            //         height: '100%',
            //     },
            //     labelStyle: {
            //         fontFamily: Typography.FONT_FAMILY_REGULAR,
            //         fontWeight: Typography.FONT_WEIGHT_REGULAR,
            //         fontSize: Typography.FONT_SIZE_14,
            //         textTransform: 'none',
            //     },
            //     style: {
            //         width: windowWidth * 0.90,
            //         height: 50,
            //         borderWidth: 1,
            //         borderRadius: 10,
            //         borderColor: Colors.borderColor,
            //         justifyContent: 'center',
            //         alignSelf: 'center',

            //         backgroundColor: Colors.white,
            //         shadowColor: Colors.textColor,
            //         shadowOffset: { width: 0, height: 2 },
            //         shadowOpacity: 0.3,
            //         shadowRadius: 10,
            //         elevation: 5,
            //     },

            // }}
            screenOptions={{
                headerShadowVisible: true,
                //tabBarScrollEnabled: true,
                tabBarIndicatorStyle: {
                    backgroundColor: Constant.darkturquoise
                }, tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' }
            }}
        >
            <Tab.Screen
                name="Pending"
                component={PendigLeave}
                options={{
                    tabBarLabel: 'Pending',
                    // tabBarIcon: ({ focused }) => (
                    //     <Image source={Images.calwhite} style={{ height: 20, width: 20, tintColor: focused ? focused : Colors.textColor }} />
                    // ),
                }}

            />
            <Tab.Screen
                name="History"
                component={HistoryLeave}
                options={{
                    tabBarLabel: 'History',
                    // tabBarIcon: ({ focused }) => (
                    //     <Image source={Images.listwhite} style={{ height: 15, width: 15, top: 5, tintColor: focused ? focused : Colors.textColor }} />
                    // ),
                }}
            />
        </Tab.Navigator>
    );
};
const ExpenseAndClaimsssss = () => {
    return (
        <Tab.Navigator
            initialRouteName="PendingExpanse"
            // tabBarOptions={{
            //     showIcon: true,
            //     tabStyle: {
            //         flexDirection: 'row',
            //     },
            //     activeTintColor: Colors.white,
            //     inactiveTintColor: Colors.textColor,
            //     indicatorStyle: {
            //         backgroundColor: Colors.theme,
            //         borderRadius: 10,
            //         height: '100%',
            //     },
            //     labelStyle: {
            //         fontFamily: Typography.FONT_FAMILY_REGULAR,
            //         fontWeight: Typography.FONT_WEIGHT_REGULAR,
            //         fontSize: Typography.FONT_SIZE_14,
            //         textTransform: 'none',
            //     },
            //     style: {
            //         width: windowWidth * 0.90,
            //         height: 50,
            //         borderWidth: 1,
            //         borderRadius: 10,
            //         borderColor: Colors.borderColor,
            //         justifyContent: 'center',
            //         alignSelf: 'center',

            //         backgroundColor: Colors.white,
            //         shadowColor: Colors.textColor,
            //         shadowOffset: { width: 0, height: 2 },
            //         shadowOpacity: 0.3,
            //         shadowRadius: 10,
            //         elevation: 5,
            //     },

            // }}
            screenOptions={{
                headerShadowVisible: true,
                //tabBarScrollEnabled: true,
                tabBarIndicatorStyle: {
                    backgroundColor: Constant.darkturquoise
                }, tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' }
            }}
        >
            <Tab.Screen
                name="PendingExpanse"
                component={PendingExpanse}
                options={{
                    tabBarLabel: 'Pending',
                    // tabBarIcon: ({ focused }) => (
                    //     <Image source={Images.calwhite} style={{ height: 20, width: 20, tintColor: focused ? focused : Colors.textColor }} />
                    // ),
                }}

            />
            <Tab.Screen
                name="HistoryExpanse"
                component={HistoryExpanse}
                options={{
                    tabBarLabel: 'History',
                    // tabBarIcon: ({ focused }) => (
                    //     <Image source={Images.listwhite} style={{ height: 15, width: 15, top: 5, tintColor: focused ? focused : Colors.textColor }} />
                    // ),
                }}
            />
        </Tab.Navigator>
    );
};

export { CalendarTabs, ExpenseAndClaimsssss }
