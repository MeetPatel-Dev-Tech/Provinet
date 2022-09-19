import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SignInScreen from '../../Screens/SignIn/SignInScreen';
import Constant from '../../CommonFiles/Constant';
import TabNavigation from '../AppNavigation/TabNavigation/TabNavigation';

export default function StackNavigation({ navigation }) {
    const Stack = createNativeStackNavigator();
    return (
        <Stack.Navigator
            screenOptions={{
                headerTitleAlign: 'center',
                headerShadowVisible: false,
                headerTitleStyle: { fontWeight: '500', fontSize: 24, color: Constant.darkturquoise },
            }}
            initialRouteName="SignIn">
            <Stack.Screen
                name="SignIn"
                component={SignInScreen}
                options={{}}
            />
        </Stack.Navigator>
    );
}
