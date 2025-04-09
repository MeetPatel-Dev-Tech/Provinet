import React, { useRef, useEffect, useState } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, Image, Easing, Animated } from 'react-native';
import Ms from 'react-native-vector-icons/MaterialCommunityIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import HomeScreen from '../../../Screens/Home/HomeScreen';
import SettingScreen from '../../../Screens/Setting/SettingScreen';
import AboutScreen from '../../../Screens/About/AboutScreen';
import Constant from '../../../CommonFiles/Constant';
import AppStackNavigation from '../AppStackNavigation/AppStackNavigation';
import { Catagory, Home, Profile } from '../../../CommonFiles/SvgFile';


function TabNavigation() {
    const Tab = createBottomTabNavigator()
    const Viewref = useRef(null)
    const Viewref1 = useRef(null)


    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.bounce,
            useNativeDriver: true
        }).start();
    };
    //  const [animation, setanimation] = useState('swing')
    useEffect(() => {
        // <Animatable.View animation="rotate" duration={2000}>
        //     <Ms name='home' />
        // </Animatable.View>
    }, [HomeScreen])
    return (
        <Tab.Navigator screenOptions={{
            tabBarShowLabel: false,
            tabBarStyle: {
                backgroundColor: '#F8FCFF',
                //    borderTopRightRadius: 20,
                //borderTopLeftRadius: 20,
                //   position: 'absolute',
                //   bottom: 5,
                //    marginHorizontal: 10,
                zIndex: 1, height: 60
            },
            headerTransparent: true,
        }}
            initialRouteName="HomeScreen"
        >
            <Tab.Screen name='HomeScreen' component={HomeScreen}
                options={{
                    tabBarIcon: ({ focused }) => {

                        focused == true && fadeOut()
                        return (
                            <Animated.View style={{
                                // opacity: focused ? fadeAnim : 1,
                                // transform: [{
                                //     translateY: fadeAnim.interpolate({
                                //         inputRange: [0, 1],
                                //         outputRange: [50, 0]  // 0 : 150, 0.5 : 75, 1 : 0
                                //     }),
                                // }]
                            }}

                            >
                                <Home height={40} width={40} />
                            </Animated.View>
                        )
                    },
                    headerShown: false

                }} ></Tab.Screen>
            <Tab.Screen name='Setting' component={SettingScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            // <Image source={require('../../../Assets/Icon/Category.png')}
                            //     style={{ height: 30, width: 30 }}
                            // />
                            <Catagory height={30} width={30} />
                        )
                    },
                    headerShown: false,
                }} ></Tab.Screen>

            <Tab.Screen name='About' component={AboutScreen}
                options={{
                    tabBarIcon: ({ focused }) => {
                        return (
                            // <Image source={require('../../../Assets/Icon/IconProfile.png')}
                            //     style={{ height: 30, width: 30 }}
                            // />
                            <Profile height={30} width={30} />
                        )
                    }
                }}></Tab.Screen>
            {/* <Tab.Screen name='AppStackNavigation' component={AppStackNavigation}> */}

            {/* </Tab.Screen> */}
        </Tab.Navigator>
    )
}
export default TabNavigation;