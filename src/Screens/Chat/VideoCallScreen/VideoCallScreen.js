import React, { useEffect, useState } from 'react';
import {
    SafeAreaView,
    StyleSheet,
    ScrollView,
    View,
    Text,
    StatusBar,
    TouchableOpacity,
    Dimensions,
    ImageBackground, Pressable
} from 'react-native';
import {
    RTCPeerConnection,
    RTCIceCandidate,
    RTCSessionDescription,
    RTCView,
    MediaStream,
    MediaStreamTrack,
    mediaDevices,
    registerGlobals
} from 'react-native-webrtc';
import io from 'socket.io-client';
import InCallManager from '@slayter/react-native-incall-manager';
import RNNotificationCall from "react-native-full-screen-notification-incoming-call";

const dimensions = Dimensions.get('window')
let socket = null;
const VideoCallScreen = () => {
    const [localStream, setLocalStream] = useState(null);
    const [remoteStream, setRemoteStream] = useState(null);
    const [is, setIs] = useState(null);
    const [call, setCall] = useState(true);
    const [answer, setAnswer] = useState(true);
    const [disconnect, setDisconnect] = useState(false);
    const [calling, setCalling] = useState(true);

    let sdp;

    let candidates = [];
    //let pc = null;


    let socket = io.connect('http://45.80.152.23:4568/webrtcPeer',
        {
            path: '/io/webrtc',
            query: {}
        }
    )
    console.log('--is socket connected--', socket)
    socket.on('connection-success', success => {
        console.log('success')
        console.log(success)
    })

    useEffect(() => {
        console.log('--use effect------------------------')


        socket.on('connect', () => {
            console.log('Connection Done');
        });
        console.log('--is socket connected--', socket)
        socket.on('connection-success', success => {
            console.log('success')
            console.log(success)
        })

        socket.on('offerOrAnswer', (sdp) => {
            console.log('offerOrAnswer')
            console.log('offerOrAnswer... ', JSON.stringify(sdp))
            sdp = JSON.stringify(sdp)

            // // set sdp as remote description
            // pc.setRemoteDescription(new RTCSessionDescription(sdp))

            // retrieve and parse the SDP copied from the remote peer
            const desc = JSON.parse(sdp)

            // set sdp as remote description
            pc.setRemoteDescription(new RTCSessionDescription(desc))
        })

        socket.on('candidate', (candidate) => {
            console.log('candidate')
            //console.log('From Peer... ', JSON.stringify(candidate))
            // this.candidates = [...this.candidates, candidate]
            pc.addIceCandidate(new RTCIceCandidate(candidate))
        })

        const pc_config = {
            "iceServers": [
                // {
                //   urls: 'stun:[STUN_IP]:[PORT]',
                //   'credentials': '[YOR CREDENTIALS]',
                //   'username': '[USERNAME]'
                // },
                {
                    urls: 'stun:stun.l.google.com:19302'
                }
            ]
        }

        pc = new RTCPeerConnection(pc_config)

        pc.onicecandidate = (e) => {
            console.log('sendToPeer - candidate')
            // send the candidates to the remote peer
            // see addCandidate below to be triggered on the remote peer
            if (e.candidate) {
                // console.log(JSON.stringify(e.candidate))
                sendToPeer('candidate', e.candidate)
            }
        }

        // triggered when there is a change in connection state
        pc.oniceconnectionstatechange = (e) => {
            console.log('-e-', e)
            console.log('-eee-', e.currentTarget.iceConnectionState)
            setIs(e.currentTarget.iceConnectionState)
            setTimeout(() => {
                if (is == 'failed') {
                    setLocalStream(null)
                }
            }, 2000)
        }

        pc.onaddstream = (e) => {
            debugger
            console.log('onaddstream')
            // this.remoteVideoref.current.srcObject = e.streams[0]
            setTimeout(() => {
                setRemoteStream(e.stream)
            }, 3000);
        }

        const success = (stream) => {
            console.log('set local stream')
            console.log(stream.toURL())
            setLocalStream(stream)
            pc.addStream(stream)
        }

        const failure = (e) => {
            console.log('getUserMedia Error: ', e)
        }

        let isFront = true;
        mediaDevices.enumerateDevices().then(sourceInfos => {
            console.log('mediadevices')
            console.log(sourceInfos);
            let videoSourceId;
            for (let i = 0; i < sourceInfos.length; i++) {
                const sourceInfo = sourceInfos[i];
                if (sourceInfo.kind == "videoinput" && sourceInfo.facing == (isFront ? "front" : "environment")) {
                    videoSourceId = sourceInfo.deviceId;
                }
            }

            const constraints = {
                audio: true,
                video: {
                    mandatory: {
                        // minWidth: 500, // Provide your own width, height and frame rate here
                        // minHeight: 300,
                        width: { min: 1024, ideal: 1280, max: 1920 },
                        height: { min: 576, ideal: 720, max: 1080 },
                        minFrameRate: 30
                    },
                    facingMode: (isFront ? "user" : "environment"),
                    optional: (videoSourceId ? [{ sourceId: videoSourceId }] : [])
                }
            }

            mediaDevices.getUserMedia(constraints)
                .then(success)
                .catch(failure);
        });

        //   if (this.state.localStream && this.state.remoteStream) {
        //     InCallManager.start({ media: 'video' });
        //     console.log('incall 1--')
        //   }

        RNNotificationCall.addEventListener("answer", () => {
            console.log('press answer'), createAnswer()
        })
        RNNotificationCall.addEventListener("endCall", () => {
            console.log('press endCall'),
                InCallManager.stopRingtone();
            InCallManager.stop();
            socket.close();
            if (localStream != null) {
                localStream.getTracks().forEach(track => track.stop());
            }
            if (remoteStream != null) {
                remoteStream.getTracks().forEach(track => track.stop());
            }
            pc.close();
            setLocalStream(null);
            setRemoteStream(null);
        })
        return () => {
            RNNotificationCall.removeEventListener("answer")
            RNNotificationCall.removeEventListener("endCall")
        };
    }, []);

    useEffect(() => {
        if (remoteStream) {
            console.log('stopring')
            InCallManager.stopRingback();
        }

        if (answer && remoteStream) {
            console.log('rington')
            InCallManager.start({ media: 'video' });
            InCallManager.startRingtone('_BUNDLE_');
            display();
        }
    }, [remoteStream, answer]);

    const display = () => {
        console.log('displayy')
        setTimeout(() => {
            RNNotificationCall.displayNotification(
                "22221a97-8eb4-4ac2-b2cf-0a3c0b9100ad",
                //null,
                'https://t4.ftcdn.net/jpg/03/17/25/45/360_F_317254576_lKDALRrvGoBr7gQSa1k4kJBx7O2D15dc.jpg',
                30000,
                {
                    channelId: "com.abc.incomingcall",
                    channelName: "Incoming video call",
                    notificationIcon: "ic_launcher",//mipmap
                    notificationTitle: "yash",
                    notificationBody: "Incoming video call",
                    answerText: "Answer",
                    declineText: "Decline",
                    notificationColor: 'colorAccent'//path color in android
                }
            )
        }, 0)
    }

    const sendToPeer = (messageType, payload) => {
        console.log('--sendtopeer socketid', socket.id, messageType, payload)
        socket.emit(messageType, {
            socketID: socket.id,
            payload
        })
    }

    const createOffer = () => {
        console.log('Offer')
        setCall(false)
        setAnswer(false)
        setDisconnect(true)
        InCallManager.start({ media: 'video', ringback: '_DTMF_' });

        // https://developer.mozilla.org/en-US/docs/Web/API/RTCPeerConnection/createOffer
        // initiates the creation of SDP
        pc.createOffer({ offerToReceiveVideo: 1 })
            .then(sdp => {
                console.log(JSON.stringify(sdp))

                // set offer sdp as local description
                pc.setLocalDescription(sdp)

                sendToPeer('offerOrAnswer', sdp)
                // console.log('new----', socket.id)
                // socket.emit('offerOrAnswer', {
                //     socketID: socket.id,
                //     sdp
                // })
            })
    }

    const createAnswer = () => {
        console.log('Answer')
        //InCallManager.stopRingback();
        InCallManager.stopRingtone();
        setCall(false)
        setAnswer(false)
        setDisconnect(true)

        pc.createAnswer({ offerToReceiveVideo: 1 })
            .then(sdp => {
                // console.log(JSON.stringify(sdp))

                // set answer sdp as local description
                pc.setLocalDescription(sdp)

                sendToPeer('offerOrAnswer', sdp)
            })
    }

    const setRemoteDescription = () => {
        // retrieve and parse the SDP copied from the remote peer
        const desc = JSON.parse(sdp)

        // set sdp as remote description
        pc.setRemoteDescription(new RTCSessionDescription(desc))
    }

    const addCandidate = () => {
        // retrieve and parse the Candidate copied from the remote peer
        // const candidate = JSON.parse(this.textref.value)
        // console.log('Adding candidate:', candidate)

        // add the candidate to the peer connection
        // this.pc.addIceCandidate(new RTCIceCandidate(candidate))

        candidates.forEach(candidate => {
            console.log(JSON.stringify(candidate))
            pc.addIceCandidate(new RTCIceCandidate(candidate))
        });
    }

    return (
        <SafeAreaView style={{ flex: 1, }}>
            <View style={{ ...styles.buttonsContainer }}>
                {(call && !remoteStream) && <View style={{ flex: 1, }}>
                    <TouchableOpacity onPress={() => {
                        createOffer()
                    }}>
                        <View style={styles.button}>
                            <Text style={{ ...styles.textContent, }}>Call</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
                {(remoteStream && answer) && <View style={{ flex: 1, }}>
                    <TouchableOpacity onPress={() => { createAnswer() }}>
                        <View style={styles.button}>
                            <Text style={{ ...styles.textContent, }}>Answer</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
                {console.log('---remote---', remoteStream)}
                {(disconnect || (answer && remoteStream)) && <View style={{ flex: 1, }}>
                    <TouchableOpacity onPress={() => {
                        InCallManager.stop();
                        socket.close();
                        if (localStream != null) {
                            localStream.getTracks().forEach(track => track.stop());
                        }
                        if (remoteStream != null) {
                            remoteStream.getTracks().forEach(track => track.stop());
                        }
                        pc.close();
                        setLocalStream(null);
                        setRemoteStream(null);
                    }}>
                        <View style={styles.button}>
                            <Text style={{ ...styles.textContent, }}>disconnect</Text>
                        </View>
                    </TouchableOpacity>
                </View>}
            </View>
            <View style={{ ...styles.videosContainer, }}>
                <ScrollView style={{ ...styles.scrollView }}>
                    <View style={{
                        flex: 1,
                        width: '100%',
                        backgroundColor: 'black',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                        {remoteStream && is != 'failed' ?
                            <RTCView
                                key={2}
                                mirror={true}
                                style={{ ...styles.rtcViewRemote }}
                                objectFit='contain'
                                streamURL={remoteStream && remoteStream.toURL()}
                            />
                            :
                            <View style={{ padding: 15, }}>
                                <Text style={{ fontSize: 22, textAlign: 'center', color: 'white' }}>Waiting for Peer connection ...</Text>
                            </View>
                        }
                    </View>
                </ScrollView>
                <View style={{
                    position: 'absolute',
                    zIndex: 1,
                    bottom: 10,
                    right: 10,
                    width: 100, height: 200,
                    backgroundColor: 'black', //width: '100%', height: '100%'
                }}>
                    <View style={{ flex: 1 }}>
                        <TouchableOpacity onPress={() => localStream._tracks[1]._switchCamera()}>
                            <View>
                                <RTCView
                                    key={1}
                                    mirror={true}
                                    zOrder={0}
                                    objectFit='cover'
                                    style={{ ...styles.rtcView }}
                                    streamURL={localStream && localStream.toURL()}
                                />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    buttonsContainer: {
        flexDirection: 'row',
    },
    button: {
        margin: 5,
        paddingVertical: 10,
        backgroundColor: 'lightgrey',
        borderRadius: 5,
    },
    textContent: {
        fontFamily: 'Avenir',
        fontSize: 20,
        textAlign: 'center',
    },
    videosContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center',
    },
    rtcView: {
        width: '100%',//100, //dimensions.width,
        height: '100%',//200,//dimensions.height / 2,
        backgroundColor: 'black',
    },
    scrollView: {
        flex: 1,
        // flexDirection: 'row',
        backgroundColor: 'teal',
        padding: 15,
    },
    rtcViewRemote: {
        width: dimensions.width - 30,
        height: 200,//dimensions.height / 2,
        backgroundColor: 'black',
    },


    name: {
        fontSize: 30,
        fontWeight: 'bold',
        color: 'white',
        marginTop: 100,
        marginBottom: 15,
    },
    phoneNumber: {
        fontSize: 20,
        color: 'white',
    },
    bg: {
        backgroundColor: 'red',
        flex: 1,
        alignItems: 'center',
        padding: 10,
        paddingBottom: 50,
    },

    row: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'space-around',
    },
    iconContainer: {
        alignItems: 'center',
        marginVertical: 20,
    },
    iconText: {
        color: 'white',
        marginTop: 10,
    },
    iconButtonContainer: {
        backgroundColor: 'red',
        padding: 15,
        borderRadius: 50,
        margin: 10,
    },
});


export default VideoCallScreen;