import React, { useEffect, useState, useContext } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import { View, Text, TouchableOpacity, StatusBar, } from 'react-native';
import Constant from '../../../CommonFiles/Constant';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Entypo from 'react-native-vector-icons/Entypo';
import { TextInput } from 'react-native-paper';
import ChatListScreen from '../../../Screens/Chat/UserList/Screens/ChatLisScreen';
import ContactsListScreen from '../../../Screens/Chat/UserList/Screens/ContactsListScreen';
import Call from '../../../Screens/Chat/UserList/Screens/Call';
import { CredentialsContext } from '../../../Components/Context/CredentialsContext';

const Tab = createMaterialTopTabNavigator();

export default function TopTabBarNavigation({ navigation }) {


    const [header, setHeader] = useState(true);
    const [visible, setVisible] = useState(false);
    const { storeData, setStoreData } = useContext(CredentialsContext);
    const { group, setGroup } = useContext(CredentialsContext);

    useEffect(() => {

        navigation.setOptions({
            headerShown: storeData,
            headerLeft: () => (
                <>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' size={25} color='white' />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: 'white' }}>Chat</Text>
                </>
            ),
            headerRight: () => (
                <>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <TouchableOpacity onPress={() => {
                            // setVisible(true),
                            //   setHeader(false),
                            setStoreData(false)
                        }}>
                            <AntDesign name='search1' size={20} style={{ marginLeft: 5 }} color='white' />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => {
                            // setVisible(true),
                            //   setHeader(false),
                            setGroup(true)
                        }}>
                            <Entypo name='dots-three-vertical' size={18} style={{ marginLeft: 5 }} color='white' />
                        </TouchableOpacity>
                    </View>
                </>
            ),
        });

    }, [storeData]);

    return (
        <>
            <StatusBar backgroundColor={Constant.darkturquoise} />
            <Tab.Navigator
                initialRouteName="Chats"
                screenOptions={{
                    headerShadowVisible: true,
                    swipeEnabled: storeData == true ? true : false,
                    //tabBarScrollEnabled: true,
                    tabBarIndicatorStyle: {
                        backgroundColor: 'white'
                    },
                    tabBarStyle: {
                        backgroundColor: Constant.darkturquoise, height: storeData == false ? 0 : null

                    }, tabBarLabelStyle: { fontSize: 16, fontWeight: 'bold' }
                }}
            //  headerTransparent: true,
            // }}
            >
                {console.log('gggg', header)}
                <Tab.Screen name="Chats"
                    component={ChatListScreen}
                    initialParams={{ header: header }}
                    options={({ navigation }) => ({
                        title: 'Chat',
                    })}
                />
                <Tab.Screen name="Contacts" component={ContactsListScreen} />
                <Tab.Screen name="Calls" component={Call} />
            </Tab.Navigator>
            {/* {visible &&
                <View style={{ position: 'absolute', width: '100%', top: -50, }}>
                    <TextInput
                        //   value={email}
                        mode="outlined"
                        label="Email"
                        //   onChangeText={email => setEmail(email)}
                        keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                        placeholder="Enter Your Email"
                        theme={Constant.theme}
                        activeOutlineColor='blue'
                        style={{ marginTop: 50 }}
                    />
                </View>} */}
        </>
    );
}
