import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, Platform, TouchableWithoutFeedback, } from 'react-native';
import HomeHeaderRoundBottom from '../../../component/HomeHeaderRoundBottom';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import MyButtons from '../../../component/MyButtons';
import { baseUrl, requestPostApi, notification_list, requestGetApi, shop_eat, art_notifications, clear_notifications, creation_getNotifications, creation_deletenoti, notification_status, game_notification } from '../../../WebApi/Service'
import Loader from '../../../WebApi/Loader';
import { useSelector, useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { setGameNotificationCount } from '../../../redux/actions/user_action';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const VideoNotification = (props) => {
    const dispatch = useDispatch();

    const [notificationData, setNotificationData] = useState([]);
    const [loading, setLoading] = useState(false)
    const [menutypedate, setmenutypedate] = useState(null);
    const [My_Alert, setMy_Alert] = useState(false)
    const [alert_sms, setalert_sms] = useState('')
    const User = useSelector(state => state.user.user_details)
    const chatindictor = useSelector(state => state.user.cooking_counter);
    console.log(chatindictor, 'chatindictor');
    useEffect(() => {

        getAllNotificationsList();
        messaging().onMessage(remoteMessage => {
            const data = remoteMessage;
            console.log('onMessage remoteMessage', remoteMessage);
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
            const data = remoteMessage.data;
            console.log('Notification caused app to open from the background state:', remoteMessage);
        });

        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                console.log('====================================');
                console.log(remoteMessage, 'my message after notification');
                console.log('====================================');
            });
    }, []);

    const getAllNotificationsList = async () => {
        console.log('notification endpoint', game_notification);
        setLoading(true)

        const { responseJson, err } = await requestGetApi(game_notification, '', 'GET', User.token)
        setLoading(false)
        console.log('the res in_cart notification_list ==>>', responseJson)
        if (responseJson.headers.success == 1) {
            console.log('my data lenght', responseJson.body.data);
            let a = responseJson.body.data.length
            setNotificationData(responseJson.body.data)
            statusNotification(responseJson.body.data);
            const hasStatusZero = data.some((item) => item.status === 0);
            console.log('item for notification', item);
            dispatch(setGameNotificationCount(hasStatusZero ? 1 : 0));
        } else {
            setalert_sms(err)
            setMy_Alert(true)
        }
    };

    const ClearNotification = async () => {
        setLoading(true)
        const { responseJson, err } = await requestPostApi(creation_deletenoti + 57, '', 'DELETE', User.token)
        setLoading(false)
        console.log('the res of cler notification', responseJson)
        if (responseJson.headers.success == 1) {
            console.log('the res of cler notification from creation', responseJson)
            setNotificationData([])
        } else {
            setalert_sms(err)
            setMy_Alert(true)
        }
    }
    const statusNotification = async (item) => {
        console.log('my status has bee called', item);
        const id = item.map(el => el.id);
        console.log('my notification array----->', id);
        setLoading(true)
        const data = {
            'notificationlist': id
        };
        const { responseJson, err } = await requestPostApi(notification_status + 57, data, 'PUT', User.token)
        setLoading(false)
        console.log('the res of status notification', responseJson)
        if (responseJson.headers.success == 1) {
            console.log('the res of cler notification from creation', responseJson)
        } else {
            setalert_sms(err)
            setMy_Alert(true)
        }
    }
    return (
        <SafeAreaView style={styles.container}>
            <View style={{}}>
            <HomeHeaderRoundBottom height={100} extraStyle={{ paddingtop: 10, paddingBottom: 25 }} paddingHorizontal={15} borderBottomLeftRadius={20} borderBottomRightRadius={20} backgroundColor='#ED1C24'
                    press1={() => { props.navigation.goBack() }} img1={require('../../../assets/images/service-header-back-button.png')} img1width={25} img1height={18}
                    press2={() => { }} title2={'Profile'} fontWeight={'500'} img2height={20} color={'#fff'}
                    press3={() => { props.navigation.navigate('VideoNotification') }} img3={require('../../../assets/images/fashion-bell-icon.png')} img3width={25} img3height={22}
                    press4={() => {
                        AsyncStorage.clear();
                        dispatch(onLogoutUser())

                    }} img4={require('../../../assets/People/PeopleLogoutIconModal.png')} img4width={25} img4height={22}
                />
            </View>
            {notificationData.length > 0 ? <TouchableOpacity onPress={() => ClearNotification()} style={{ marginTop: 12, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 16, color: '#FFC40C', textAlign: 'right', marginRight: 20 }}>Clear All</Text>
            </TouchableOpacity> : null}
            <ScrollView>
                <View style={{ width: '100%', alignSelf: 'center', marginTop: 10, paddingHorizontal: 10, }}>

                    {console.log(notificationData.length, 'my console for notification data')}
                    {notificationData.length != 0 ?

                        notificationData?.map((item, index) => {
                            { console.log(item, 'item for object notification flatList') }
                            return (
                                <TouchableOpacity style={{ width: '95%', alignSelf: 'center', backgroundColor: '#fff', borderRadius: 5, marginVertical: 10 }} onPress={() => {

                                    {
                                        item.article_id && item.object_id
                                            != undefined ? props.navigation.navigate('StartupPost', { id: item.article_id, }) : Toast.show({ text1: 'Article not Found' })
                                    }

                                }}>
                                    <View style={{ padding: 15, flexDirection: 'row' }}>
                                        <View>
                                            {/* <Image source={{ uri: item.profile_image }} style={{ width: 50, height: 50, borderRadius: 100 }} resizeMode='stretch'></Image> */}
                                            {item.profile_image
                                                ? (
                                                    <Image
                                                        source={{
                                                            uri: item.profile_image

                                                        }}
                                                        style={{ width: 35, height: 35, borderRadius: 100, }}

                                                    />
                                                ) : (
                                                    <Image
                                                        source={require('../../../assets/blankProfile.png')}
                                                        style={{ width: 35, height: 35, borderRadius: 90 }}
                                                    />
                                                )}
                                        </View>
                                        <View style={{ width: '85%' }}>

                                            <Text style={{ fontWeight: '600', color: "#000", fontSize: 13, lineHeight: 16, marginTop: 6, marginLeft: 12 }}>{item.message}</Text>

                                            <View style={{ alignSelf: 'flex-start', flexDirection: 'row', marginTop: 15, marginLeft: 12 }}>
                                                <Image source={require('../../../assets/images/fashion-calendar-icon.png')} style={{ width: 15, height: 15 }}></Image>
                                                <Text style={{ fontWeight: '400', color: "gray", fontSize: 11, lineHeight: 16, marginLeft: 3 }}>{item.created_date}</Text>
                                            </View>

                                        </View>


                                    </View>



                                </TouchableOpacity>
                            )
                        }
                        )
                        :
                        <View style={{ alignSelf: 'center', width: '90%' }}>
                            <Image source={require('./images/NotificationStartup.png')} style={{ width: 180, height: 180, alignItems: 'center', justifyContent: 'center', alignSelf: 'center', marginTop: '30%' }}></Image>
                            <Text style={{ fontWeight: '600', color: "#000", fontSize: 18, marginHorizontal: 5, textAlign: 'center', marginTop: '20%', height: 34 }}>No Notifications</Text>

                            <View style={{ width: '100%', alignSelf: 'center', marginTop: 25 }}>
                                <MyButtons title="Go To Home" height={35} width={'100%'} borderRadius={5} alignSelf="center"
                                    press={() => {
                                        props.navigation.navigate('StartupHome')
                                    }} fontSize={14} paddingHorizontal={10}
                                    titlecolor={Mycolors.BG_COLOR} backgroundColor='rgba(255, 196, 12, 0.5)' />
                            </View>

                        </View>
                    }

                </View>

                <View style={{ width: 10, height: 150 }}></View>
            </ScrollView>
            {loading ? <Loader /> : null}
        </SafeAreaView >
    );
};

const styles = StyleSheet.create({
    input: {
        paddingLeft: 15,
        width: '100%',
        fontSize: 13,
        borderColor: 'rgba(0,0,0,0.2)',
        borderWidth: 0.5,
        // backgroundColor: '#34333a',
        color: '#fff',
        height: 100,
        borderRadius: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        color: Mycolors.Black
    },

});


export default VideoNotification;

