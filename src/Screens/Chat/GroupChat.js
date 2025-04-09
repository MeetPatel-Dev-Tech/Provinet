import React, { useState, useEffect, useRef, useCallback } from 'react'
import { View, Text, SafeAreaView, TextInput, Keyboard, FlatList, Animated, ActivityIndicator, PermissionsAndroid, StatusBar, TouchableOpacity, Dimensions, Platform, animated, Image, SliderBase, Alert, KeyboardAvoidingView, ImageBackground, Linking } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useIsFocused, useFocusEffect } from '@react-navigation/native';
import Entypo from 'react-native-vector-icons/Entypo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { scale, verticalScale, moderateScale, moderateVerticalScale, ScaledSheet, ms } from 'react-native-size-matters';
import moment from 'moment';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
var RNFS = require('react-native-fs');
import { io } from 'socket.io-client';
import CommonStyle from '../../CommonFiles/CommonStyle';
import Constant from '../../CommonFiles/Constant';
import { CommonUtilsObj } from '../../Utils/CommonUtils';
import { GetApi, PostApi } from '../../Api/Api';
import Message from '../../CommonFiles/Message';
import CustomStyle from './CustomStyle';
import { ErrorToast } from '../ToastMessage/Toast';
import { Camera, Contact, Documents, Images, Location, Music } from '../../CommonFiles/SvgFile';
// import { Message } from 'react-native-gifted-chat';

export default function GroupChat({ route, navigation }) {

    const flatListRef = React.useRef();
    const chatList = React.useRef();
    const yourRef = useRef();
    const [chat, setChat] = useState('');
    const [message, setMessage] = useState([]);
    const [reacivemsg, setReaciveMsg] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isFileTransferModalVisible, setIsFileTransferModalVisible] = useState(false);
    const [modalOption, setModalOption] = useState('');
    const [uploadImageUri, setUploadImageuri] = useState('');
    const [docFile, setDocFile] = useState('');
    const [docFileURI, setDocFileURI] = useState(require('../../Assets/Image/EmptyProfile.jpg'));
    const [docFileType, setDocFileType] = useState('');
    const [docFileExt, setDocFileExt] = useState('');
    const [base64Image, setBase64Image] = useState('');
    const [docFilePlaceholderURI, setDocFilePlaceholderURI] = useState(require('../../Assets/Image/docFile.png'));
    const [currentDocRes, setCurrentDocRes] = useState('');
    const [EXT, setEXT] = useState('');
    const [isVisibleUploadPopup, setIsVisibleUploadPopup] = useState(false);
    const [msgTextInputHeight, setMsgTextInputHeight] = useState((height * 6) / 100);
    const [popupMsgTextInputHeight, setPopupMsgTextInputHeight] = useState((height * 6) / 100);
    const [status, setStatus] = useState('');
    const [typing, setTyping] = useState('');
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState(route.params.search);
    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const btnHeight = (Dimensions.get('window').width * 10.5) / 100;

    const data = [
        { id: 1, name: 'Documents', image: <Documents height={30} width={30} /> },
        { id: 2, name: 'Gallary', image: <Images height={30} width={30} /> },
        { id: 3, name: 'Camera', image: <Camera height={30} width={30} /> },
        { id: 4, name: 'Location', image: <Location height={30} width={30} /> },
        { id: 5, name: 'Contact', image: <Contact height={30} width={30} /> },
        { id: 6, name: 'Audio', image: <Music height={30} width={30} /> },
    ]


    useEffect(() => {
        socketConnection();
    }, []);
    useEffect(() => {

    }, []);



    useEffect(() => {
        navigation.setOptions({

            // backgroundColor: 'pink',
            //    title: (route.params.userFirstName + ' ' + route.params.userLastName),
            //    headerShown: search,
            headerLeft: () => (
                <>
                    <TouchableOpacity onPress={() => { onEventPress(), navigation.goBack() }}>
                        <AntDesign name='arrowleft' size={25} />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                        <Image source={route.params.profilePic == null ? require('../../Assets/Image/EmptyProfile.jpg')
                            :
                            { uri: Constant.getProfilePicURL + route.params.profilePic }}
                            style={{ width: 45, height: 45, borderRadius: 40, marginLeft: 5 }}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => {
                        navigation.navigate('GroupDetailScreen', {
                            groupName: route.params.userFirstName,
                            roomId: route.params.userId
                        })
                    }}
                        style={{ flexDirection: 'column', marginLeft: 10 }}>
                        <Text style={{ fontSize: 20, }}>{(route.params.userFirstName)}</Text>
                    </TouchableOpacity>
                </>
            ),
            headerRight: () => (
                <>
                    <Ionicons name='call' size={25} style={{ marginLeft: 5 }} color={Constant.darkturquoise} />
                </>
            ),
        });
    }, [status, search]);

    // useEffect(() => {
    //     const keyboardDidShowListener = Keyboard.addListener(
    //         'keyboardDidShow',
    //         () => {
    //             console.log('keyboardopen')
    //             //  typingOn();

    //         }
    //     );
    //     const keyboardDidHideListener = Keyboard.addListener(
    //         'keyboardDidHide',
    //         () => {
    //             console.log('keyboardhide')
    //             //typingOff();

    //         }
    //     );

    //     return () => {
    //         keyboardDidHideListener.remove();
    //         keyboardDidShowListener.remove();
    //     };
    // }, [Keyboard]);

    let socket = io(Constant.socketLocationURL, {
        query: { id: CommonUtilsObj.EmployeDetails[0].id },
        reconnectionDelayMax: 2000,
    });
    const socketConnection = () => {
        let data = ({
            fromUserId: CommonUtilsObj.EmployeDetails[0].id,
            room: route.params.userId,
        })
        console.log('data', data)
        socket.emit('groupgetMessages', data)

        socket.on('groupgetMessagesResponse', ex => {
            console.log('getMessagesResponse', ex.result)
            setMessage(ex.result)
        })

        socket.on('groupimage-uploaded', response => {
            // console.log('response-------', response.response.fromUserId)
            // console.log('response-------', response)
            // let msg =
            if (
                response.response.fromUserId != CommonUtilsObj.EmployeDetails[0].id &&
                response.response.room == route.params.userId
            ) {
                console.log('imageResponse')
                setMessage((message) => [...message, {
                    filepath: response.file,
                    fromuserid: {
                        id: response.response.fromUserId,
                        firstName: response.response.firstName,
                        lastName: response.response.lastName
                    },
                    fileformat: response.response.fileFormat,
                    time: response.response.time
                }])
            }
        })


        socket.on('offline', ex => {

            if (ex.user == route.params.userId) {
                console.log('offline--', ex.status)
                setStatus(ex.status)
            }

        })
        socket.on('online', ex => {

            // console.log('status', ex.status)
            if (ex.user == route.params.userId) {
                console.log('online--', ex.status)
                setStatus(ex.status)
            }
        })

    };

    // useFocusEffect(
    //     React.useCallback(() => {
    //         Online_Offline();
    //     }, [])
    // )

    const Online_Offline = () => {
        console.log('check')
        socket.emit('chat-list', route.params.userId)
        socket.once('chat-list-response', response => {
            console.log('<<>>>chat-list-response', response.chatList.online)
            if (response.chatList.online == 'Y') {
                setStatus('online')
            }
        })
    }


    // useEffect(() => {
    //     let timer = setTimeout(() => {
    //         console.log(`I can see you're not typing. I can use "${chat}" now!`);
    //         typingOff();
    //     }, 1500)
    //     return () => clearTimeout(timer)
    // }, [chat]);

    socket.on('groupaddMessageResponse', (ex) => {
        console.log('groupaddMessageResponse--', ex)
        const data = {
            fromuserid: { id: ex.fromUserId, firstName: ex.firstName, lastName: ex.lastName },
            message: ex.message,
            time: moment().format(),
            date: moment().format("DD-MM-YYYY"),
            toUserId: ex.toUserId,
        }
        if (ex.fromUserId !== CommonUtilsObj.EmployeDetails[0].id &&
            ex.room == route.params.userId) {
            setMessage(message => [...message, data])
        }
        //  console.log('....', message)
        // setMessage(obj)
        // setMessage(reacivemsg)


    })


    const typingOn = () => {
        //  console.log('typing on ');
        socket.emit('chat-list', route.params.userId)
        socket.once('chat-list-response', response => {
            console.log('chat-list-response', response)
            let send = ({
                socket_id: response.chatList.socketid,
                typing: 'true',
                userId: CommonUtilsObj.EmployeDetails[0].id
            })
            socket.emit('typing', send)
            socket.on('typing', ex => {
                console.log('typing---', ex)
            })
        })
    }
    const typingOff = () => {
        //   console.log('typing off');
        socket.emit('chat-list', route.params.userId)
        socket.once('chat-list-response', response => {
            console.log('chat-list-response', response)
            let send = ({
                socket_id: response.chatList.socketid,
                typing: 'false',
                userId: CommonUtilsObj.EmployeDetails[0].id
            })
            socket.emit('typing', send)
        })
    }

    const onEventPress = async () => {
        const data = {
            fromuserid: CommonUtilsObj.EmployeDetails[0].id,
            touserid: route.params.userId
        }
        const ResponseData = await PostApi(Constant.udateStatusURL, data, true)
        console.log('ResponseData', ResponseData)
    }

    socket.on('typing', ex => {
        console.log('typing', ex.typing, ex.userid)
        if (ex.userid == route.params.userId) {
            console.log('tttttt')
            setTyping(ex.typing)
        }
    })

    const onClickViewDocument = (item) => {
        console.log('item----', item?.docFileUri ?? false);
        let isDocFile = item?.docFileUri ?? false
        if (isDocFile == false) {
            const url = Constant.KBaseURLlocal + item.filepath; //Constant.KBaseDownloadURL + item.name
            const localFile = `${RNFS.DocumentDirectoryPath}/${item.filepath}`;

            console.log(url);
            console.log(localFile);

            const options = {
                fromUrl: url,
                toFile: localFile,
            };
            RNFS.downloadFile(options)
                .promise.then(() => FileViewer.open(localFile))
                .then(() => {
                    // success
                })
                .catch((error) => {
                    console.log(error);
                });
        } else {
            console.log('55')
            FileViewer.open(docFileURI)

        }
    }

    const onPressEvent = (item) => {
        console.log(item)
        if (item.name == 'Documents') {
            onClickPickDocument(item.name);
            setIsFileTransferModalVisible(false);
        } else if (item.name == 'Gallary') {
            onClickPickDocument(item.name);
            setIsFileTransferModalVisible(false);
        } else if (item.name == 'Camera') {
            Opencamera();
        } else if (item.name == 'Location') {
            Locations();
            setIsFileTransferModalVisible(false);
            //  onClickPickDocument()
        } else if (item.name == 'Conatact') {
            //  onClickPickDocument()
        } else if (item.name == 'Audio') {
            onClickPickDocument(item.name);
            setIsFileTransferModalVisible(false);
        }
    }

    const sendmessage = (isImage, File) => {
        if (!isImage) {
            findSocketId()
        } else {
            if (File == undefined) {
                //   console.log('before64--', File)
                message.push({
                    filePath: docFilePlaceholderURI,
                    filepath: docFile,
                    fromuserid: { id: CommonUtilsObj.EmployeDetails[0].id },
                    fileformat: docFileType,
                    docFileUri: docFileURI,
                    time: moment().format()
                })

                RNFS.readFile(currentDocRes.uri, 'base64').then((res) => {
                    //  console.log('after Res', res);
                    setBase64Image(res)
                    setTimeout(() => {
                        findImageSocketId(res);
                    }, 200);
                });
            } else {
                console.log('before64',)
                message.push({
                    filePath: { uri: File.uri },
                    filepath: File.fileName,
                    fromuserid: { id: CommonUtilsObj.EmployeDetails[0].id },
                    fileformat: File.type,
                    docFileUri: File.uri,
                    time: moment().format()
                })

                RNFS.readFile(File.uri, 'base64').then((res) => {
                    //  console.log('after Res', res);
                    setBase64Image(res)
                    setTimeout(() => {
                        findImageSocketId2(res, File);
                    }, 200);
                });
            }
        }
    }

    const findSocketId = () => {
        // console.log('time', moment().format())
        // console.log('id', route.params.userId)
        // socket.emit('chat-list', route.params.userId)

        const data = {
            fromuserid: { id: CommonUtilsObj.EmployeDetails[0].id },
            message: chat,
            time: moment().format(),
            date: moment().format("DD-MM-YYYY"),
            toUserId: route.params.userId,
        }


        setChat('')
        setMessage([...message, data])

        // socket.once('chat-list-response', response => {
        console.log('route.params.userId', route.params.userId)
        let send = ({
            fromUserId: CommonUtilsObj.EmployeDetails[0].id,
            room: route.params.userId,
            message: chat,
            date: moment().format("DD-MM-YYYY"),
            time: moment().format(),
            firstName: CommonUtilsObj.EmployeDetails[0].firstName,
            lastName: CommonUtilsObj.EmployeDetails[0].lastName
        })
        console.log('send', send)


        socket.emit('groupaddMessage', send)
        // })

    }

    const findImageSocketId2 = (base64ImageResp, File) => {

        // socket.emit('chat-list', route.params.userId)

        // socket.once('chat-list-response', response => {
        // console.log('chat-list-response', response)
        let send = ({
            fromUserId: CommonUtilsObj.EmployeDetails[0].id,
            room: route.params.userId,
            fileFormat: File.type,
            date: moment().format("DD-MM-YYYY"),
            time: moment().format(),
            //  toSocketId: response.chatList.socketid,
            image: 'data:' +
                File.type +
                ';base64,' +
                base64ImageResp,
            name: File.fileName,
            firstName: CommonUtilsObj.EmployeDetails[0].firstName,
            lastName: CommonUtilsObj.EmployeDetails[0].lastName
        })

        setTimeout(() => {
            socket.emit('groupupload-image', send)
        }, 200);

        // }
        // )

    }
    const findImageSocketId = (base64ImageResp) => {

        // socket.emit('chat-list', route.params.userId)

        // socket.once('chat-list-response', response => {
        // console.log('chat-list-response', response)
        let send = ({
            fromUserId: CommonUtilsObj.EmployeDetails[0].id,
            room: route.params.userId,
            fileFormat: docFileType,
            date: moment().format("DD-MM-YYYY"),
            time: moment().format(),
            //  toSocketId: response.chatList.socketid,
            image: 'data:' +
                docFileType +
                ';base64,' +
                base64ImageResp,
            name: docFile,
            firstName: CommonUtilsObj.EmployeDetails[0].firstName,
            lastName: CommonUtilsObj.EmployeDetails[0].lastName
        })

        setTimeout(() => {
            socket.emit('groupupload-image', send)
        }, 200);


        // socket.on('image-uploaded', ex => {
        //     console.log('image-uploaded', ex)
        //     // props.setcount(props.count + 1)
        //     //  setmess("")
        // })

        // }
        // )

    }

    const renderChatList = ({ item }) => {
        return (
            <View style={{
                alignSelf: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 'flex-end' : 'flex-start', marginHorizontal: 10, marginTop: 10
            }}>
                {item.message != null &&
                    <View View style={{
                        backgroundColor: (item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id ? '#E9ECF1' : Constant.darkturquoise,
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        borderBottomRightRadius: (item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id ? 15 : 0,
                        borderBottomLeftRadius: (item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id ? 0 : 15,
                        paddingVertical: 10,
                        paddingHorizontal: 15
                    }}>
                        {(item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id &&
                            <Text style={{ marginTop: -8, marginLeft: -5, color: 'orange', marginBottom: 2 }}>{item.fromuserid.firstName} {item.fromuserid.lastName}</Text>
                        }
                        <Text style={{ fontSize: 16 }}>{item.message}</Text>
                    </View>
                }
                {item.message != null &&
                    <View style={{ alignItems: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 'flex-end' : 'flex-start' }}>
                        <Text style={{ marginTop: 2, fontSize: 10 }}>{moment((item.time || item.createdOn)).format("hh:mm A")}</Text>
                    </View>
                }

                {
                    (item.filePath != null || item.filepath != null) && (item.filePath != undefined || item.filepath != undefined) &&
                    <TouchableOpacity onPress={() => onClickViewDocument(item)}>
                        <View>
                            {(item.fileformat === 'application/pdf' ||
                                item.fileformat ===
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document') &&
                                <>
                                    <View
                                        style={[
                                            CustomStyle.outgoingMsgBallonContainer,
                                            {

                                                backgroundColor: (item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id ? '#E9ECF1' : Constant.darkturquoise,
                                                //  alignItems: 'center',
                                                paddingTop: 2,
                                                marginBottom: 5,
                                                borderTopLeftRadius: 20,
                                                borderTopRightRadius: 20,
                                                borderBottomLeftRadius: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 20 : 0,
                                                borderBottomRightRadius: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 0 : 20,
                                            },
                                        ]}>
                                        {(item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id &&
                                            <Text style={{ marginLeft: 8, marginTop: 2, color: 'orange', marginBottom: 5 }}>{item.fromuserid.firstName} {item.fromuserid.lastName}</Text>
                                        }
                                        <View style={{ alignItems: 'center', backgroundColor: '#F1FDF3', flexDirection: 'row', borderRadius: 20 }}>
                                            <Image
                                                style={{
                                                    width: 50,
                                                    height: 50,
                                                }}
                                                source={require('../../Assets/Image/docFile.png')}
                                                resizeMode="stretch"
                                            />
                                            <Text numberOfLines={2}
                                                style={[
                                                    CustomStyle.msgFont,
                                                    { color: 'black', width: '80%' },
                                                ]}>
                                                {item.filepath}
                                            </Text>
                                        </View>
                                    </View>
                                    <View style={{ alignItems: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 'flex-end' : 'flex-start' }}>
                                        <Text style={{ marginTop: 2, fontSize: 10 }}>{moment((item.time || item.createdOn), 'HH:mm').format("hh:mm A")}</Text>
                                    </View>
                                </>
                            }
                            {
                                item.fileformat === 'image/jpeg' &&
                                <>
                                    <View style={{
                                        padding: 10,
                                        backgroundColor: (item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id ? '#E9ECF1' : Constant.darkturquoise,
                                        borderTopLeftRadius: 15,
                                        borderTopRightRadius: 15,
                                        borderBottomLeftRadius: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 20 : 0,
                                        borderBottomRightRadius: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 0 : 20,
                                    }}>
                                        {(item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id &&
                                            <Text style={{ marginTop: -8, marginLeft: -5, color: 'orange', marginBottom: 5 }}>{item.fromuserid.firstName} {item.fromuserid.lastName}</Text>
                                        }
                                        <Image source={
                                            item.filePath
                                                ? item.filePath
                                                : {
                                                    uri:
                                                        Constant.SocketImageURL +
                                                        item.filepath,
                                                    //   headers: { Authorization: 'someAuthToken' },
                                                    //   priority: FastImage.priority.normal,
                                                }

                                        }
                                            style={{ height: 120, width: 120 }}
                                        />
                                    </View>
                                    <View style={{ alignItems: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 'flex-end' : 'flex-start' }}>
                                        <Text style={{ marginTop: 2, fontSize: 10 }}>{moment((item.time || item.createdOn)).format("hh:mm A")}</Text>
                                    </View>
                                </>
                            }
                            {
                                item.fileformat === 'audio/mpeg' &&
                                <>
                                    <View style={{
                                        maxWidth: moderateScale(250, 2),
                                        padding: 5,
                                        backgroundColor: (item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id ? '#E9ECF1' : Constant.darkturquoise,
                                        borderTopLeftRadius: 15,
                                        borderTopRightRadius: 15,
                                        borderBottomLeftRadius: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 20 : 0,
                                        borderBottomRightRadius: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 0 : 20,
                                    }}>
                                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', }}> */}
                                        {/* <View style={{}}>
                                            
                                        </View> */}
                                        {(item.fromuserid.id || item.fromUserId.id) != CommonUtilsObj.EmployeDetails[0].id &&
                                            <Text style={{ marginTop: -8, marginLeft: -5, color: 'orange', marginBottom: 5 }}>{item.fromuserid.firstName} {item.fromuserid.lastName}</Text>
                                        }
                                        <View style={{
                                            flexDirection: 'row',
                                            alignItems: 'center',
                                        }}>
                                            <View style={{ marginRight: 10 }}>
                                                <MaterialIcons name='multitrack-audio' size={40} />
                                            </View>
                                            <View style={{ width: '80%' }}>
                                                <Text numberOfLines={1}>
                                                    {item.filepath}
                                                </Text>
                                                <Text >
                                                    Audio
                                                </Text>
                                            </View>
                                        </View>
                                        {/* </View> */}
                                    </View>
                                    <View style={{ alignItems: (item.fromuserid.id || item.fromUserId.id) == CommonUtilsObj.EmployeDetails[0].id ? 'flex-end' : 'flex-start' }}>
                                        <Text style={{ marginTop: 2, fontSize: 10 }}>{moment((item.time || item.createdOn), 'HH:mm').format("hh:mm A")}</Text>
                                    </View>
                                </>
                            }
                        </View>
                    </TouchableOpacity>
                }
                <View>
                </View>
            </View >
        )
    }

    const renderType = (item) => {
        if (item === 'Documents') {
            return [DocumentPicker.types.allFiles]
            // return [DocumentPicker.types.doc]
        } else if (item === 'Gallary') {
            return [DocumentPicker.types.images]
        } else if (item === 'Audio') {
            return [DocumentPicker.types.audio]
        }
    }

    const Opencamera = () => {
        let options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: false,
        };
        launchCamera(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('user cancle image picker');
            } else if (response.error) {
                console.log('imagepicker error:', response.error);
            } else if (response.customButton) {
                console.log('user taped custom button: ', response.customButton);
            } else {
                console.log('fddggg', response.assets[0]);
                // if (response.assets[0].fileSize < 3145728) {

                setTimeout(() => {
                    sendmessage(true, response.assets[0]);
                }, 200);
                setIsFileTransferModalVisible(false);
                //  setIsVisibleUploadPopup(true);
                // setModalOption('');
                // } else {
                //     ErrorToast(Message.KImageSize);
                // }
            }
        });
    };

    const Opengallary = () => {
        let options = {
            storageOptions: {
                path: 'images',
                mediaType: 'photo',
            },
            includeBase64: false,
        };
        launchImageLibrary(options, response => {
            console.log('Response = ', response);
            if (response.didCancel) {
                console.log('user cancle image picker');
            } else if (response.error) {
                console.log('imagepicker error:', response.error);
            } else if (response.customButton) {
                console.log('user taped custom button: ', response.customButton);
            } else {
                console.log('kjnjjn', response.assets[0].uri);
                if (response.assets[0].type != 'image/gif') {
                    // if (response.assets[0].fileSize < 3145728) {
                    const source = { uri: 'data:image/jpeg;base64,' + response.base64 };
                    setUploadImageuri({ uri: response.assets[0].uri });
                    setModalOption('');
                    // } else {
                    //     ErrorToast(Message.KImageSize);
                    // }
                } else {
                    ErrorToast(Message.KInvalidFormate);
                }
            }
        });
    };


    const onClickPickDocument = async (item) => {
        try {
            const res = await DocumentPicker.pick({
                //  type: [DocumentPicker.types.allFiles],
                type: renderType(item),
            });
            console.log('res', res);
            console.log(
                res[0].uri,
                res[0].type, // mime type
                res[0].name,
                res[0].size,
            );

            const split = res[0].type.split('/');

            var ext = split.pop().toLowerCase();

            if (
                ext == 'vnd.openxmlformats-officedocument.wordprocessingml.document'
            ) {
                ext = 'docx';
            }
            console.log('split' + ext);

            if (
                ext == 'png' ||
                ext == 'jpg' ||
                ext == 'jpeg' ||
                ext == 'pdf' ||
                ext == 'doc' ||
                ext == 'docx' ||
                ext == 'mpeg'
            ) {
                setDocFile(res[0].name)
                setDocFileURI(res[0].uri)
                setDocFileType(res[0].type)
                setDocFileExt(ext)
                setDocFilePlaceholderURI(
                    ext == 'png' || ext == 'jpg' || ext == 'jpeg'
                        ? { uri: res[0].uri }
                        : require('../../Assets/Image/Profile.jpg')),

                    setCurrentDocRes(res[0])
                setTimeout(() => {
                    setIsVisibleUploadPopup(true)
                }, 500);
            } else {
                ErrorToast('KFileFormateNotMatched')
            }
        } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err;
            }
        }
    }

    const onTypingStart = (e) => {
        //  console.log('e');

        // useEffect(() => {
        //     useCallback(() => {
        //         typingOn();
        //     }, []);
        // }, []);


        // if (e) {
        //     typingOn();
        // }
    }

    // useEffect(() => {
    //     incrementNum()
    // }, [chat]);

    const incrementNum = useCallback(() => {
        typingOn();
    }, []);

    const Locations = () => {

        // const scheme = Platform.select({ ios: 'maps:0,0?q=', android: 'geo:0,0?q=' });
        const scheme = Platform.OS == 'ios' ? 'maps:0,0?q=' : 'geo:0,0?q=';
        const latLng = `${36.400},${-122.566}`;
        const label = 'Custom Label';
        const url = Platform.select({
            ios: `${scheme}${label}@${latLng}`,
            android: `${scheme}${latLng}(${label})`
        });
        Linking.openURL(url);

    }

    const ListFooterComponent = () => {
        if (!loading) return null;
        return (
            <View
                style={{
                }}
            >
                {/* <Text style={{ textAlign: 'center' }}>Loading...</Text> */}
                <ActivityIndicator animating size='large' color={Constant.darkturquoise} />
                {/* <Spinner
                    //visibility of Overlay Loading Spinner
                    visible={true}
                    //Text with the Spinner
                    textContent={'Loading...'}
                //Text style of the Spinner Text
                // textStyle={styles.spinnerTextStyle}
                /> */}
            </View>
        );
    }

    const onEndReached = () => {
        return (
            setLoading(false)
        )
    }

    const fadeAnim = useRef(new Animated.Value(0)).current;

    const fadeOut = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 700,
            easing: Easing.bezier(.07, 1, .33, .89),
            useNativeDriver: true
        }).start();
    };
    const fadeIn = () => {
        // Will change fadeAnim value to 0 in 3 seconds
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 700,
            useNativeDriver: true
        }).start();
    };

    const generateColor = (text) => {
        // const randomColor = Math.floor(Math.random() * 16777215)
        //     .toString(16)
        //     .padStart(6, '0');
        // return `#${randomColor}`;


        if (text.startsWith('t')) {
            return 'orange';
        } else if (text.startsWith('Y')) {
            return 'pink'
        } else {
            'blue'
        }
    };



    return (
        <SafeAreaView style={CommonStyle.SafeAreaView}>
            {/* <StatusBar barStyle="light-content" color='green' /> */}
            {/* <KeyboardAwareScrollView
                style={{ flex: 1 }}
                keyboardShouldPersistTaps="handled"
                contentContainerStyle={{ flexGrow: 1 }}
                showsVerticalScrollIndicator={false}
                behavior={Platform.OS === 'android' ? '' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 64}
                enableOnAndroid={true}
                enableAutoAutomaticScroll={(Platform.OS === 'ios')}
                resetScrollToCoords={{ x: 0, y: 0 }}
                scrollToOverflowEnabled={true}
                enableAutomaticScroll={true}
                contentInsetAdjustmentBehavior="automatic"
                onContentSizeChange={() => yourRef.current.scrollToEnd({ animated: true })}
            > */}
            <KeyboardAvoidingView
                style={{ flex: 1, }}
                behavior={Platform.OS === 'android' ? '' : 'padding'}
                keyboardVerticalOffset={Platform.OS === 'android' ? 0 : 64}
            //  contentContainerStyle={'bottom'}
            >
                {/* <ImageBackground imageStyle={{ opacity: 0.2 }} style={{ flex: 1, }} source={require('../../Assets/Image/ChatBackGround.jpg')}> */}
                {/* <> */}
                <View style={{ flex: 1, }}>
                    <FlatList style={{}}
                        inverted
                        initialNumToRender={14}
                        maxToRenderPerBatch={20}
                        ListFooterComponent={message != '' && message.length > 20 && ListFooterComponent}
                        onEndReached={onEndReached}
                        onEndReachedThreshold={0.75}
                        // legacyImplementation={true}
                        data={[...message].reverse()}
                        //   data={message}
                        renderItem={renderChatList}
                        ref={yourRef}
                        // contentContainerStyle={{ flexDirection: 'column-reverse' }}
                        //  onContentSizeChange={() => yourRef.current.scrollToEnd({ animated: true })}
                        keyExtractor={(item, index) => index.toString()}
                    // onLayout={() => yourRef.current.scrollToEnd({ animated: true })}
                    //   ref={ref => flatListRef = ref}
                    //   onContentSizeChange={() => flatListRef.scrollToEnd({ animated: true })}
                    // onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                    //  ref={chatList}
                    //  onContentSizeChange={() => ref.scrollToEnd()}

                    />
                    {typing == 'true' &&
                        <View style={{ marginBottom: 10, marginLeft: 10 }}>
                            <Text style={{}}>Typing...</Text>
                        </View>
                    }
                </View>
                {/* <View style={{  }}> */}
                <View style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    //  marginTop: 10,
                    backgroundColor: 'white', elevation: 10,
                    shadowColor: "#000000",
                    shadowOffset: { width: 0.5, height: 2 }, // change this for more shadow
                    shadowOpacity: 0.4,
                    shadowRadius: 6
                }}>
                    <View style={{
                        flexDirection: 'row',
                        flex: 1,
                        backgroundColor: '#E9ECF1',
                        marginHorizontal: 15,
                        borderRadius: 20, shadowColor: 'black',
                        shadowOffset: { width: 2, height: 5 },
                        shadowOpacity: 1,
                        shadowRadius: 2,
                        elevation: 5, marginBottom: 10, marginTop: 5
                    }}>
                        <TextInput
                            value={chat}
                            onChangeText={e => {
                                //  onTypingStart(e), 
                                setChat(e)
                            }}
                            style={{
                                flex: 1,
                                padding: 5,
                                paddingHorizontal: 15,
                                marginRight: 5,
                                paddingTop: 15, maxHeight: 100
                            }}
                            multiline={true}
                            // maxLength={50}
                            textAlignVertical={'top'}
                        />
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginRight: 15,
                            }}
                        // onPress={this.onClickPickDocument.bind(this)}
                        >
                            {/* <TouchableOpacity onPress={() => onClickPickDocument()}> */}
                            <TouchableOpacity onPress={() => setIsFileTransferModalVisible(true)}>
                                <FontAwesome
                                    name="paperclip"
                                    size={25}
                                    color={'#1A1A1A'}
                                    style={{ transform: [{ rotate: '90deg' }] }}
                                />
                            </TouchableOpacity>
                        </TouchableOpacity>
                    </View>
                    <View style={{ marginRight: 20, marginLeft: 5 }}>
                        <TouchableOpacity onPress={() => { (chat != '' && sendmessage(false)) }}>
                            <FontAwesome
                                name="paper-plane"
                                size={30}
                                color={Constant.darkturquoise}
                                style={{ transform: [{ rotate: '0deg' }] }}
                            />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* </> */}
                {/* </ImageBackground> */}
                {/* </View> */}

                {/* </KeyboardAwareScrollView> */}
            </KeyboardAvoidingView>




            {/* <View style={{ position: 'absolute', bottom: 20, left: 0, right: 0, flex: 1, marginTop: 20 }}> */}
            <Modal isVisible={isModalVisible}
                onBackdropPress={() => setIsModalVisible(false)}
            >
                <View style={{ justifyContent: 'center', alignItems: 'center', flex: 1 }}>
                    <View style={{ backgroundColor: 'white', padding: 1 }}>
                        {route.params.profilePic == null ?
                            <Image source={require('../../Assets/Image/EmptyProfile.jpg')}
                                style={{ width: 200, height: 200, }}
                            />
                            :
                            <Image source={{ uri: Constant.getProfilePicURL + route.params.profilePic }}
                                style={{ width: 200, height: 200, }}
                            />
                        }
                    </View>
                </View>
            </Modal>
            <Modal isVisible={isFileTransferModalVisible}
                animationIn='slideInUp'
                animationOut='slideOutDown'
                swipeDirection='down'
                onSwipeComplete={() => setIsFileTransferModalVisible(false)}
                onBackdropPress={() => setIsFileTransferModalVisible(false)}
                onModalHide={() => {
                    console.log('opetion', modalOption);
                    if (modalOption == 1) {
                        Opengallary();
                    } else if (modalOption == 2) {
                        Opencamera();
                    }
                }}
            >
                <View style={{ justifyContent: 'flex-end', flex: 1, marginBottom: -20, marginHorizontal: -20, }}>
                    <View style={{ backgroundColor: 'white', padding: 10, borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingBottom: 40 }}>
                        <View style={{ alignItems: 'center', }}>
                            <View style={{ height: 2, width: 40, backgroundColor: 'gray' }}></View>
                            <View style={{ height: 2, width: 40, backgroundColor: 'gray', marginTop: 2 }}></View>
                        </View>
                        <Text style={{ textAlign: 'center', marginTop: 10, fontSize: 16 }}>Attachment</Text>
                        <FlatList numColumns={3}
                            data={data} style={{ marginHorizontal: 10 }}
                            renderItem={({ item }) =>
                                <TouchableOpacity onPress={() => onPressEvent(item)} activeOpacity={0.8} style={{ flex: 1, marginTop: 20, }}>
                                    <View style={{
                                        paddingHorizontal: 0, paddingVertical: 20, backgroundColor: 'white', shadowColor: 'black',
                                        shadowOffset: { width: 2, height: 5 },
                                        shadowOpacity: 5,
                                        shadowRadius: 2,
                                        elevation: 3,
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        flex: 1,
                                        marginBottom: 8,
                                        //   marginTop: 10,
                                        marginRight: 10,
                                        marginLeft: 10,
                                        borderRadius: 10
                                    }}>
                                        <View>
                                            {item.image}
                                        </View>
                                    </View>
                                    <View>
                                        <Text style={{ textAlign: 'center' }}>{item.name}</Text>
                                    </View>
                                </TouchableOpacity>
                            }
                        />
                        {/* <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, justifyContent: 'space-between', marginTop: 20 }}>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity>
                                    <Image source={require('../../Assets/Image/Documents.png')}
                                        style={{ height: 50, width: 50, borderRadius: 10, marginBottom: 5 }}
                                    />
                                </TouchableOpacity>
                                <Text>Documents</Text>
                            </View>
                            <View style={{ alignItems: 'center', }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalOption(2);
                                        setIsFileTransferModalVisible(false);
                                    }}>
                                    <Image source={require('../../Assets/Image/Camera1.png')}
                                        style={{ height: 50, width: 50, borderRadius: 10, marginBottom: 5 }}
                                    />
                                </TouchableOpacity>
                                <Text>Camera</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalOption(1);
                                        setIsFileTransferModalVisible(false);
                                    }}>
                                    <Image source={require('../../Assets/Image/Gallery.png')}
                                        style={{ height: 50, width: 50, borderRadius: 10, marginBottom: 5 }}
                                    />
                                </TouchableOpacity>
                                <Text>Gallery</Text>
                            </View>
                        </View>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginHorizontal: 20, justifyContent: 'space-between' }}>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity>
                                    <Image source={require('../../Assets/Image/Documents.png')}
                                        style={{ height: 50, width: 50, borderRadius: 10, marginBottom: 5 }}
                                    />
                                </TouchableOpacity>
                                <Text>Documents</Text>
                            </View>
                            <View style={{ alignItems: 'center', }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalOption(2);
                                        setIsFileTransferModalVisible(false);
                                    }}>
                                    <Image source={require('../../Assets/Image/Camera1.png')}
                                        style={{ height: 50, width: 50, borderRadius: 10, marginBottom: 5 }}
                                    />
                                </TouchableOpacity>
                                <Text>Camera</Text>
                            </View>
                            <View style={{ alignItems: 'center' }}>
                                <TouchableOpacity
                                    onPress={() => {
                                        setModalOption(1);
                                        setIsFileTransferModalVisible(false);
                                    }}>
                                    <Image source={require('../../Assets/Image/Gallery.png')}
                                        style={{ height: 50, width: 50, borderRadius: 10, marginBottom: 5 }}
                                    />
                                </TouchableOpacity>
                                <Text>Gallery</Text>
                            </View>
                        </View> */}
                    </View>
                </View>
            </Modal>

            {/* {isVisibleUploadPopup &&
                <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'black',
                    }}></View>
            } */}
            <Modal
                style={{
                    position: 'absolute',
                    top: -20,
                    bottom: -20,
                    left: -20,
                    right: -20,
                    // backgroundColor: 'black',
                }}
                animationType="slide"
                transparent={true}
                visible={isVisibleUploadPopup}
            >
                {/* <View
                    style={{
                        position: 'absolute',
                        top: 0,
                        bottom: 0,
                        left: 0,
                        right: 0,
                        backgroundColor: 'black', opacity: 0.5,
                    }}></View> */}
                <View style={{ flex: 1, backgroundColor: 'white' }}>
                    <View style={{ marginLeft: 20, marginTop: 20 }}>
                        <TouchableOpacity onPress={() => setIsVisibleUploadPopup(false)}>
                            <Text style={{ fontSize: 20 }}>CLOSE</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', }}>
                        <Image
                            style={{ width: '100%', height: 200 }}
                            source={docFilePlaceholderURI}
                            resizeMode={'contain'}
                        />
                    </View>
                    <View style={{ alignItems: 'flex-end', marginBottom: 10, marginRight: 20 }}>
                        <TouchableOpacity onPress={() => { sendmessage(true), setIsVisibleUploadPopup(false) }}>
                            <Text style={{ fontSize: 20 }}>SEND</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                {/* <View
                    style={[
                        CustomStyle.popupContainer,
                        {
                            backgroundColor: '#fff',
                            marginTop: Constant.width < 350 ? '40%' : '40%',

                        },
                    ]}>

                    <KeyboardAwareScrollView
                        contentContainerStyle={{ flex: 1 }}
                    // getTextInputRefs={() => {
                    //     return [this._popuptextInputRef];
                    // }}
                    >
                        <TouchableOpacity
                            activeOpacity={0.8}
                            style={{
                                marginTop: 10,
                                marginRight: 10,
                                backgroundColor: 'black',
                                borderRadius: (height * 5.5) / 100 / 2,
                                height: (height * 5) / 100,
                                width: (height * 5) / 100,
                                justifyContent: 'center',
                                alignItems: 'center',
                                alignSelf: 'flex-end',
                            }}
                            onPress={() => {
                                console.log('close');
                                setIsVisibleUploadPopup(false)
                                setMessage('')
                                setDocFile('')
                                setDocFileURI(require('../../Assets/Image/Profile.jpg'))
                                setDocFileType('')
                                setDocFileExt('')
                                setDocFilePlaceholderURI(require('../../Assets/Image/Profile.jpg'))
                                setCurrentDocRes('')
                                setMsgTextInputHeight((height * 6) / 100)
                                setPopupMsgTextInputHeight((height * 6) / 100)
                            }}>
                            <FontAwesome5 name="times" size={20} color={'#fff'} />
                        </TouchableOpacity>
                        <View style={{ height: '60%', width: '60%', alignSelf: 'center' }}>
                            <Image
                                style={{ width: '100%', height: '100%' }}
                                source={docFilePlaceholderURI}
                                resizeMode={'contain'}
                            />
                        </View>

                        <View
                            style={[
                                CustomStyle.chatBottomConatiner,
                                // {position: 'absolute', bottom: 0},
                            ]}>

                            <View>
                                <TouchableOpacity onPress={() => this.onSubmitMsg(true)}>
                                    <Text style={CustomStyle.listTypeFont}>Send</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </KeyboardAwareScrollView>
                </View> */}
            </Modal>
        </SafeAreaView >
    )
}


const styles = ScaledSheet.create({
    container: {

        paddingHorizontal: '22@ms0.3',
        paddingVertical: '11.5@ms0.3',
        //     padding: '2@msr', // = Math.round(moderateScale(2))
        margin: 5, backgroundColor: 'orange'
    },
    row: {
        padding: '10@ms0.3', // = moderateScale(10, 0.3)
        width: '50@ms', // = moderateScale(50)
        height: '30@mvs0.3' // = moderateVerticalScale(30, 0.3)
    }
});