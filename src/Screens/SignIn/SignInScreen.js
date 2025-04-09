import React, { useState, useContext } from 'react'
import { View, Text, SafeAreaView } from "react-native"
import CommonStyle from '../../CommonFiles/CommonStyle'
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { TextInput } from 'react-native-paper';
import ProgressLoader from 'rn-progress-loader';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Constant from '../../CommonFiles/Constant';
import CustomButton from '../../Components/CustomButton/CustomButton';
import { PostApi } from '../../Api/Api';
import { io } from 'socket.io-client';
import Message from '../../CommonFiles/Message';
import { ErrorToast, SuccessToast } from '../ToastMessage/Toast';
import { CommonUtilsObj, setLoggedEmployeDetails } from '../../Utils/CommonUtils';
import { CredentialsContext } from '../../Components/Context/CredentialsContext';

export default function SignInScreen({ navigation }) {

    const [email, setEmail] = useState('meet1234@gmail.com');
    const [password, setPassword] = useState('meet1234');
    const [loading, setLoading] = useState(false);
    const { storedCredentials, setStoredCredentials } = useContext(CredentialsContext);

    const onLoginClick = async () => {
        var flag = true;
        var errorMsg = [];

        if (email == '') {
            flag = false;
            errorMsg.push(Message.KEmailEmpty)
        } if (password == '') {
            flag = false;
            errorMsg.push(Message.KPasswordInvalid)
        }
        if (flag) {
            LoginCredential()
        } else {
            console.log(errorMsg.length)
            if (errorMsg.length > 1) {
                ErrorToast(Message.KRequiredFiledsEmpty);
            } else {
                ErrorToast(errorMsg[0])
            }
        }
    }


    const LoginCredential = async () => {
        setLoading(true);
        const data = {
            email: email,
            password: password,
        }
        const ResponseData = await PostApi(Constant.KLoginURL, data, false)
        console.log('ffffffffffffffff', ResponseData)
        if (ResponseData != undefined && ResponseData.message == 'Login Successfully') {
            console.log('hhhhh', ResponseData.data.id)
            setSocketConnection(ResponseData.data.id);
            let userInfo = [];
            userInfo.push(ResponseData.data);
            if (Platform.OS === 'android') {
                setLoggedEmployeDetails(JSON.stringify(userInfo));
            } else {
                setLoggedEmployeDetails(userInfo);
            }
            setTimeout(() => {
                setLoading(false);
                SuccessToast(ResponseData.message);
                setStoredCredentials(ResponseData.data)
                //  navigation.navigate('TabNavigation')
            }, 1000);
        } else {
            ErrorToast(ResponseData.message);
            setLoading(false);
        }
    }

    const setSocketConnection = (userId) => {
        console.log('userid', userId)
        let socket = io(Constant.socketLocationURL, {
            query: { id: userId },
            reconnectionDelayMax: 2000,
        });

        socket.on('connect', () => {
            console.log('Connection Done');
        });

        socket.emit('online', userId)
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
            <View style={{ marginHorizontal: 20, }}>
                <View style={{ marginTop: 20 }}>
                    <Text style={[CommonStyle.TextColor, { fontSize: 16 }]}>Enter your username and password Login Admin</Text>
                </View>
                <TextInput
                    value={email}
                    mode="outlined"
                    label="Email"
                    onChangeText={email => setEmail(email)}
                    keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                    placeholder="Enter Your Email"
                    theme={Constant.theme}
                    activeOutlineColor={Constant.darkturquoise}
                    style={{ marginTop: 50 }}
                />
                <TextInput
                    value={password}
                    mode="outlined"
                    label="Password"
                    onChangeText={password => setPassword(password)}
                    keyboardType={Platform.OS === 'ios' ? 'ascii-capable' : 'visible-password'}
                    placeholder="Enter Your Passwod"
                    theme={Constant.theme}
                    activeOutlineColor={Constant.darkturquoise}
                    style={{ marginTop: 30 }}
                />
                <View style={{ flexDirection: 'row', marginTop: 20, justifyContent: 'center', alignItems: 'center' }}>
                    <View style={{}}>
                        <MaterialCommunityIcons name='checkbox-blank-outline' size={30} color='black' />
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }}>
                        <Text style={CommonStyle.TextColor}>Remember Me</Text>
                    </View>
                    <View style={{}}>
                        <Text style={CommonStyle.TextColor}>Forget Password</Text>
                    </View>
                </View>
                <View style={{ marginTop: 50 }}>
                    <CustomButton text='Login' onPress={() => onLoginClick()} />
                </View>
            </View>

        </SafeAreaView>
    )
}