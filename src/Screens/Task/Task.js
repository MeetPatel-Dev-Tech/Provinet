import React, { useState, useEffect } from 'react'
import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Image } from "react-native"
import { Calendar, CalendarList, Agenda } from 'react-native-calendars';
import { Card, Avatar } from 'react-native-paper';
import CommonStyle from '../../CommonFiles/CommonStyle';


export default function Task({ navigation }) {

    const [items, setItems] = useState({})

    const loadItems = (day) => {
        // const items = items || {};

        setTimeout(() => {
            for (let i = -15; i < 85; i++) {
                const time = day.timestamp + i * 24 * 60 * 60 * 1000;
                const strTime = timeToString(time);

                if (!items[strTime]) {
                    items[strTime] = [];

                    const numItems = Math.floor(Math.random() * 3 + 1);
                    for (let j = 0; j < numItems; j++) {
                        items[strTime].push({
                            name: 'Item for ' + strTime + ' #' + j,
                            height: Math.max(50, Math.floor(Math.random() * 150)),
                            day: strTime
                        });
                    }
                }
            }

            const newItems: AgendaSchedule = {};
            Object.keys(items).forEach(key => {
                newItems[key] = items[key];
            });
            setItems(newItems)
        }, 1000);
    }

    const timeToString = (time) => {
        const date = new Date(time);
        return date.toISOString().split('T')[0];
    }

    const renderItem = (item) => {
        return (
            <TouchableOpacity style={{ marginTop: 5 }}>
                <Card>
                    <Card.Content>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text>
                                {/* {item.name} */}
                            </Text>
                            {/* <Avatar.Text label='m' /> */}
                        </View>
                    </Card.Content>
                </Card>
            </TouchableOpacity>
        )
    }




    return (
        <SafeAreaView style={CommonStyle.SafeAreaView}>
            <View style={{ marginHorizontal: 5, flex: 1, marginTop: 5 }}>
                <Agenda
                    items={items}
                    loadItemsForMonth={loadItems}
                    renderItem={renderItem}
                    renderDay={(day, item) => {
                        return <View style={{ justifyContent: 'center' }}>
                            <Text>hi</Text>
                        </View>;
                    }}
                />
            </View>
        </SafeAreaView>
    );



}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
        backgroundColor: 'white',
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    capture: {
        flex: 0,
        backgroundColor: '#fff',
        borderRadius: 5,
        padding: 15,
        paddingHorizontal: 20,
        alignSelf: 'center',
        margin: 20,
    },
});
