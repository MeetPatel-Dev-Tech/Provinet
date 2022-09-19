import React, { useState, useEffect, useRef } from 'react'
import { View, Text, SafeAreaView, TextInput, FlatList, StatusBar, TouchableOpacity, Dimensions, Platform, animated, Image, SliderBase, Alert, KeyboardAvoidingView, ImageBackground } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import Modal from 'react-native-modal';
import Ionicons from 'react-native-vector-icons/Ionicons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Entypo from 'react-native-vector-icons/Entypo';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scrollview';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { scale, verticalScale, moderateScale, moderateVerticalScale, ScaledSheet, ms } from 'react-native-size-matters';
import moment from 'moment';
import DocumentPicker from 'react-native-document-picker';
import FileViewer from 'react-native-file-viewer';
var RNFS = require('react-native-fs');
import { io } from 'socket.io-client';
import CommonStyle from '../../CommonFiles/CommonStyle';
import Constant from '../../CommonFiles/Constant';
import { CommonUtilsObj } from '../../Utils/CommonUtils';
import { GetApi } from '../../Api/Api';
import Message from '../../CommonFiles/Message';
import CustomStyle from './CustomStyle';
import { ErrorToast } from '../ToastMessage/Toast';
// import { Message } from 'react-native-gifted-chat';

export default function Chat({ route, navigation }) {

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


    const width = Dimensions.get('window').width;
    const height = Dimensions.get('window').height;
    const btnHeight = (Dimensions.get('window').width * 10.5) / 100;
    // console.log('message', message)
    //   const chatItem = [{ name: message }]

    // console.log('hhhh', route.params)

    useEffect(() => {
        socketConnection();
    }, []);
    useEffect(() => {
        // console.log('<><><><>', message)
    }, [message]);
    useEffect(() => {
        navigation.setOptions({
            // backgroundColor: 'pink',
            //    title: (route.params.userFirstName + ' ' + route.params.userLastName),
            headerLeft: () => (
                <>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <AntDesign name='arrowleft' size={25} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setIsModalVisible(true)}>
                        <Image source={route.params.profilePic == null ? require('../../Assets/Image/EmptyProfile.jpg')
                            :
                            { uri: Constant.getProfilePicURL + route.params.profilePic }}
                            style={{ width: 45, height: 45, borderRadius: 40, marginLeft: 5 }}
                        />
                    </TouchableOpacity>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', marginLeft: 10, color: 'white' }}>{(route.params.userFirstName + ' ' + route.params.userLastName)}</Text>
                </>
            ),
            headerRight: () => (
                <>
                    <Ionicons name='call' size={25} style={{ marginLeft: 5 }} color='white' />
                </>
            ),
        });
    }, [navigation]);

    let socket = io(Constant.socketLocationURL, {
        query: { id: CommonUtilsObj.EmployeDetails[0].user },
        reconnectionDelayMax: 2000,
    });
    const socketConnection = () => {
        socket.on('connect', () => {
            console.log('Connection Done');
        });
        // console.log('connection done');
        let data = ({
            fromUserId: CommonUtilsObj.EmployeDetails[0].user,
            toUserId: route.params.userId,
        })
        console.log(data)
        socket.emit('getMessages', data)

        socket.on('getMessagesResponse', ex => {
            console.log('getMessagesResponse', ex.result.rows)
            setMessage(ex.result.rows)
        })

        // socket.on('file-uploaded', response => {
        //     console.log('response-------', response)
        // })

    };

    socket.on('addMessageResponse', ex => {
        console.log('addMessageResponse1--', ex.message, 'mm', ex.fromUserId)
        if (ex.fromUserId == route.params.userId) {
            setMessage(message => [...message, ex])
        }
        //  console.log('....', message)
        // setMessage(obj)
        // setMessage(reacivemsg)

    })

    socket.on('image-uploaded', response => {
        console.log('response-------', response.response.fromUserId, response.response.fileFormat)
        // let msg = 
        if (
            response.response.fromUserId != CommonUtilsObj.EmployeDetails[0].user &&
            response.response.toUserId == CommonUtilsObj.EmployeDetails[0].user
        ) {
            console.log('imageResponse')
            setMessage([...message, {
                filepath: response.file,
                fromuserid: response.response.fromUserId,
                fileformat: response.response.fileFormat,
            }])
        }
    })


    const onClickViewDocument = (item) => {
        console.log('item----', item?.docFileUri ?? false);
        let isDocFile = item?.docFileUri ?? false
        if (isDocFile == false) {
            const url = 'http://192.168.1.32:4553/uploads/socketupload/' + item.filepath; //Constant.KBaseDownloadURL + item.name
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


    //console.log('userId', route.params.userId)

    //  console.log('<>', message)

    // const pushMethodCall = () => {
    //     // setMessage([...message,
    //     // { message: chat, type: 'send' }
    //     // ]), setChat('')
    //     sendmessage();
    // }

    const sendmessage = (isImage) => {
        if (!isImage) {
            findSocketId()
        } else {
            message.push({
                filePath: docFilePlaceholderURI,
                filepath: docFile,
                fromuserid: CommonUtilsObj.EmployeDetails[0].user,
                fileformat: docFileType,
                docFileUri: docFileURI

            })
            console.log('before64', currentDocRes.uri)
            RNFS.readFile(currentDocRes.uri, 'base64').then((res) => {
                //  console.log('after Res', res);
                setBase64Image(res)
                setTimeout(() => {
                    findImageSocketId(res);
                }, 200);
            });
            // console.log('Image--message', message)
            // setTimeout(() => {
            //     findImageSocketId();
            // }, 1000);
        }
    }

    const findSocketId = () => {
        console.log('id', route.params.userId)
        socket.emit('chat-list', route.params.userId)

        socket.once('chat-list-response', response => {
            console.log('chat-list-response', response)
            let send = ({
                fromUserId: CommonUtilsObj.EmployeDetails[0].user,
                toUserId: route.params.userId,
                message: chat,
                date: moment().format("DD-MM-YYYY"),
                time: moment().format("hh:mm"),
                toSocketId: response.chatList[0].socketid
            })
            //   console.log('send', send)


            socket.emit('addMessage', send)
            setChat('')
            setMessage([...message, send])

        })

    }

    const findImageSocketId = (base64ImageResp) => {

        socket.emit('chat-list', route.params.userId)

        socket.once('chat-list-response', response => {
            console.log('chat-list-response', response)
            let send = ({
                fromUserId: CommonUtilsObj.EmployeDetails[0].user,
                toUserId: route.params.userId,
                fileFormat: docFileType,
                date: moment().format("DD-MM-YYYY"),
                time: moment().format("hh:mm"),
                toSocketId: response.chatList[0].socketid,
                image: 'data:' +
                    docFileType +
                    ';base64,' +
                    base64ImageResp,
                name: docFile
            })

            setTimeout(() => {
                console.log('send-----', send)
                socket.emit('upload-image', send)
            }, 200);


            // socket.on('image-uploaded', ex => {
            //     console.log('image-uploaded', ex)
            //     // props.setcount(props.count + 1)
            //     //  setmess("")
            // })

        }
        )

    }


    const renderChatList = ({ item }) => {
        return (
            // <View style={{
            //     padding: moderateScale(5),
            //     borderRadius: 10,
            //     backgroundColor: 'pink',
            //     marginHorizontal: 20,
            //     width: moderateVerticalScale(10),
            //     //  height: verticalScale(50),
            //     //   justifyContent: 'flex-start'

            // }}>
            //     <Text>{item.name}</Text>
            // </View>
            <View style={{
                alignSelf: (item.fromuserid || item.fromUserId) == CommonUtilsObj.EmployeDetails[0].user ? 'flex-end' : 'flex-start', marginHorizontal: 10, marginTop: 10
            }}>
                {item.message != null &&
                    <View View style={{
                        backgroundColor: (item.fromuserid || item.fromUserId) != CommonUtilsObj.EmployeDetails[0].user ? 'orange' : 'pink',
                        borderTopLeftRadius: 15,
                        borderTopRightRadius: 15,
                        borderBottomRightRadius: (item.fromuserid || item.fromUserId) != CommonUtilsObj.EmployeDetails[0].user ? 15 : 0,
                        borderBottomLeftRadius: (item.fromuserid || item.fromUserId) != CommonUtilsObj.EmployeDetails[0].user ? 0 : 15,
                        paddingVertical: 10,
                        paddingHorizontal: 15
                    }}>

                        <Text style={{ fontSize: 16 }}>{item.message}</Text>
                    </View>
                }

                {
                    (item.filePath !== null || item.filepath !== null) && (item.filePath != undefined || item.filepath != undefined) &&
                    <TouchableOpacity onPress={() => onClickViewDocument(item)}>
                        <View>
                            {item.fileformat === 'application/pdf' ||
                                item.fileformat ===
                                'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ? (
                                <View
                                    style={[
                                        CustomStyle.outgoingMsgBallonContainer,
                                        {
                                            alignItems: 'center',
                                            paddingTop: 0,
                                            marginBottom: 5,
                                        },
                                    ]}>
                                    <Image
                                        style={{
                                            width: 110,
                                            height: 110,
                                        }}
                                        source={require('../../Assets/Image/docFile.png')}
                                        resizeMode="stretch"
                                    />
                                    <Text
                                        style={[
                                            CustomStyle.msgFont,
                                            { color: 'white' },
                                        ]}>
                                        {item.filepath}
                                    </Text>
                                </View>
                            ) :
                                <Image source={
                                    item.filePath
                                        ? item.filePath
                                        : {
                                            uri:
                                                'http://192.168.1.32:4553/uploads/socketupload/' +
                                                item.filepath,
                                        }
                                }
                                    style={{ height: 120, width: 120 }}
                                />
                            }
                        </View>
                    </TouchableOpacity>
                }
                <View>
                </View>
            </View >
        )
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
                const source = { uri: 'data:image/jpeg;base64,' + response.base64 };
                setUploadImageuri({ uri: response.assets[0].uri });
                setModalOption('');
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


    const onClickPickDocument = async () => {
        try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
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
                <ImageBackground imageStyle={{ opacity: 0.2 }} style={{ flex: 1, }} source={require('../../Assets/Image/ChatBackGround.jpg')}>
                    {/* <> */}
                    <View style={{ flex: 1, }}>
                        <FlatList style={{}}
                            //  inverted
                            data={message}
                            renderItem={renderChatList}
                            ref={yourRef}
                            onContentSizeChange={() => yourRef.current.scrollToEnd({ animated: false })}
                            keyExtractor={(item, index) => index.toString()}
                        // onLayout={() => yourRef.current.scrollToEnd({ animated: true })}
                        //   ref={ref => flatListRef = ref}
                        //   onContentSizeChange={() => flatListRef.scrollToEnd({ animated: true })}
                        // onLayout={() => this.flatList.scrollToEnd({ animated: true })}
                        //  ref={chatList}
                        //  onContentSizeChange={() => ref.scrollToEnd()}

                        />
                    </View>
                    {/* <View style={{  }}> */}
                    <View style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: 10,
                        marginBottom: 10,
                    }}>
                        <View style={{
                            flexDirection: 'row',
                            flex: 1,
                            backgroundColor: '#E9ECF1',
                            marginHorizontal: 15,
                            borderRadius: 20,
                        }}>
                            <TextInput
                                value={chat}
                                onChangeText={e => setChat(e)}
                                style={{
                                    flex: 1,
                                    padding: 5,
                                    paddingHorizontal: 15,
                                    marginRight: 5,
                                    paddingTop: 15,
                                }}
                                multiline={true}
                                maxLength={50}
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
                                <TouchableOpacity onPress={() => onClickPickDocument()}>
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
                            <TouchableOpacity onPress={() => { chat != '' && sendmessage(false) }}>
                                <FontAwesome
                                    name="paper-plane"
                                    size={30}
                                    color={'black'}
                                    style={{ transform: [{ rotate: '0deg' }] }}
                                />
                            </TouchableOpacity>
                        </View>
                    </View>
                    {/* </> */}
                </ImageBackground>
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
                <View style={{ justifyContent: 'flex-end', flex: 1, marginBottom: 45 }}>
                    <View style={{ backgroundColor: 'white', padding: 10 }}>
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
                        </View>
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
        </SafeAreaView>
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