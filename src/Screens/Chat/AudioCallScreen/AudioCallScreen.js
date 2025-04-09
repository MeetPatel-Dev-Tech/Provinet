import React, { useState, useEffect, useRef } from 'react'
import {
    View,
    Text,
    SafeAreaView,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Image,
    StatusBar,
    Animated
} from "react-native";
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Feather from 'react-native-vector-icons/Feather';
import Octicons from 'react-native-vector-icons/Octicons';
import Constant from '../../../CommonFiles/Constant';

export default function AudioCallScreen({ navigation, route }) {

    const [memberList, setMemberList] = useState('');

    useEffect(() => {
        startAnimation()
    }, []);


    const animation = new Animated.Value(0)
    // Animated.loop([
    //     Animated.spring(shakeAnimation, {
    //         toValue: 1,
    //         duration: 2000,
    //         useNativeDriver: true
    //     }),
    //     Animated.spring(shakeAnimation, {
    //         toValue: 0,
    //         duration: 2000
    //     })
    // ]).start();

    const startAnimation = () => {
        Animated.loop(Animated.timing(animation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
            isInteraction: true
        })).start(({ finished }) => {
            console.log(finished)
        });
    }
    const rotateInterpolate = animation.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "360deg"]
    });

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#36454F' }}>
            <StatusBar barStyle='light-content' backgroundColor='#36454F' />
            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center', }}>
                <TouchableOpacity onPress={() => { navigation.goBack() }}
                    style={{ marginLeft: 15, }}>
                    <MaterialIcons name='arrow-back' size={30} color='white' />
                </TouchableOpacity>
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={{ color: 'white', fontSize: 20, fontWeight: 'bold' }}>
                        {route.params.firstname} {route.params.lastname}
                    </Text>
                    <Text style={{ color: 'white', fontSize: 16, marginTop: 5, }}>connecting</Text>
                </View>
                <View style={{ marginRight: 20 }}>
                    <Octicons name='unmute' size={25} color='white' />
                </View>

            </View>
            <View style={{ justifyContent: 'center', flex: 1, alignSelf: 'center' }}>
                <Animated.View style={{
                    alignItems: 'center', backgroundColor: Constant.darkturquoise, height: 150, width: 150, borderRadius: 75,
                    shadowColor: 'white',
                    shadowOffset: { width: 2, height: 5 },
                    shadowOpacity: 1,
                    shadowRadius: 2,
                    elevation: 5, marginBottom: 10, marginTop: 5, justifyContent: 'center',
                    transform: [
                        { rotate: rotateInterpolate }
                    ]
                }}>
                    <TouchableOpacity onPress={() => { animation.stopAnimation() }}>
                        <Text style={{ fontSize: 30, fontWeight: 'bold' }}>{route.params.firstname[0]} {route.params.lastname[0]}</Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
            <View style={{ justifyContent: 'flex-end', marginBottom: 20, marginHorizontal: 20, }}>
                <View style={{ justifyContent: 'space-around', flexDirection: 'row', alignItems: 'center' }}>
                    <View>
                        <Image source={require('../../../Assets/Icon/SkypeMute.png')}
                            style={{ height: 50, width: 50, borderRadius: 25 }}
                        />
                    </View>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('VideoCallScreen', {
                            firstname: route.params.firstname,
                            lastname: route.params.lastname
                        })
                    }}
                        style={{ backgroundColor: 'white', padding: 8, borderRadius: 50 }}>
                        <Feather name='video' size={32} />
                    </TouchableOpacity>
                    <View>
                        <Image source={require('../../../Assets/Icon/SkypeCallEnd.png')}
                            style={{ height: 50, width: 50, borderRadius: 25 }}
                        />
                    </View>
                </View>
            </View>

        </SafeAreaView>
    );



}

