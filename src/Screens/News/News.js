import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, FlatList, TouchableOpacity, Image, SliderBase, Alert } from "react-native"
import AntDesign from 'react-native-vector-icons/AntDesign';
import ProgressLoader from 'rn-progress-loader';
import { WebView } from 'react-native-webview';
import { GetApi } from '../../Api/Api';
import CommonStyle from '../../CommonFiles/CommonStyle';
import Constant from '../../CommonFiles/Constant';
import { ErrorToast } from '../ToastMessage/Toast';

export default function News() {

    const [news, setNews] = useState('');
    const [content, setContent] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        getNews()
        // GetUserAllLeave();
        // GetUserLeave();
        // navigation.addListener('focus', () => {
        //     //  setTimeout(() => {
        //     GetUserAllLeave();
        //     GetUserLeave();
        //     //   }, 200);
        // });
    }, []);

    const data = [
        { name: 'meet', image: require('../../Assets/Icon/News.png') },
        { name: 'meet', image: require('../../Assets/Icon/News.png') },
        { name: 'meet', image: require('../../Assets/Icon/News.png') },
        { name: 'meet', image: require('../../Assets/Icon/News.png') },
        { name: 'meet', image: require('../../Assets/Icon/News.png') },
        { name: 'meet', image: require('../../Assets/Icon/News.png') },
        { name: 'meet', image: require('../../Assets/Icon/News.png') },
        { name: 'meet', image: require('../../Assets/Icon/News.png') },
        { name: 'meet', image: require('../../Assets/Icon/News.png') },
    ]

    const getNews = async () => {
        setLoading(true);
        const responseData = await GetApi(Constant.NewsURL)
        console.log('<<<<<<<<<<<<<<<<<', responseData)
        if (responseData.status == 'success') {
            setNews(responseData.data);
            setLoading(false);
        } else {
            setLoading(false);
            ErrorToast(responseData.message)
        }
    }

    const nameeee = (item) => {
        {
            <WebView
                originWhitelist={['*']}
                style={{
                    backgroundColor: 'transparent',
                    // fontFamily: Constant.KThemeFontRegular,
                }}
                showsVerticalScrollIndicator={false}
                source={{
                    html:
                        '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body><p style="font-size:15px">' +
                        item
                        +
                        '</p></body></html>',
                }}
            />
        }
    }

    const RenderNewsList = ({ item }) => {
        return (
            <View style={{ flexDirection: 'row', marginBottom: 5, alignItems: 'center', marginHorizontal: 20, marginTop: 10 }}>
                {/* <Text>{item.name}</Text> */}
                <View style={{}}>
                    <Image source={{ uri: Constant.NewsImageURL + item.image }}
                        style={{ height: 50, width: 50, borderRadius: 10 }}
                    />
                </View>
                <View style={{ marginLeft: 15, flex: 1 }}>
                    <Text style={{ fontWeight: 'bold' }}>{item.title}</Text>
                    {/* <Text>{item.name}</Text> */}
                    {/* <Text>{nameeee(item.name)}</Text> */}

                    <WebView
                        originWhitelist={['*']}
                        style={{
                            flex: 1, padding: 10,
                            // backgroundColor: 'transparent',
                            // height: 20
                            // fontFamily: Constant.KThemeFontRegular,
                        }}
                        showsVerticalScrollIndicator={false}
                        // source={{
                        //     html:
                        //         '<html><head><meta name="viewport" content="width=device-width, initial-scale=1"/></head><body><p style="font-size:15px">' +
                        //         item.name
                        //         +
                        //         '</p></body></html>',
                        // }}
                        source={{
                            html:
                                '<body  ><font size=7>' +
                                item.name +
                                '</font></body>',
                        }}
                    />
                    <Text>{item.createAt}</Text>

                </View>
            </View>
        )
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
            {!loading &&
                <FlatList
                    data={news}
                    renderItem={RenderNewsList}
                />
            }
        </SafeAreaView>
    )
}