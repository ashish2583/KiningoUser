import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, Platform, TouchableWithoutFeedback, } from 'react-native';
import HomeHeader from './components/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import { Rating } from 'react-native-ratings';
import ViewMoreText from 'react-native-view-more-text';
import Toggle from "react-native-toggle-element";
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import DatePicker from 'react-native-datepicker';
import { baseUrl, requestPostApi, notification_list, requestGetApi, shop_eat, art_notifications, clear_notifications, creation_getNotifications, creation_deletenoti } from '../../../WebApi/Service'
import Loader from '../../../WebApi/Loader';
import MyAlert from '../../../component/MyAlert';

import { useSelector, useDispatch } from 'react-redux';
import messaging from '@react-native-firebase/messaging';
import { setcookingnotificationcount } from '../../../redux/actions/user_action';
import { Toast } from 'react-native-toast-message/lib/src/Toast';

const CookingNotifications = (props) => {
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
            // if (remoteMessage.notification.body === 'Order Delivered Successfully!') {
            //   setalert_sms3('Do you want to rate order?');
            //   setMy_Alert3(true);
            //   setRemoteMessageData(remoteMessage.data);
            // } else if (remoteMessage.notification.body === 'new message') {
            //   // Handle new message scenario
            //   // dispatch(setMessageCount(mapdata.messagecount + 1));
            //   // props.navigation.navigate('ShopMyOrderDetails', { data: remoteMessage.data });
            // }
        });

        messaging().onNotificationOpenedApp(remoteMessage => {
            const data = remoteMessage.data;
            console.log('Notification caused app to open from the background state:', remoteMessage);
            // if (remoteMessage.notification.title === 'Kinengo') {
            //   if (remoteMessage.notification.body === 'Order Delivered Successfully!') {
            //     setalert_sms3('Do you want to rate order?');
            //     setMy_Alert3(true);
            //     setRemoteMessageData(remoteMessage.data);
            //   } else {
            //     props.navigation.navigate('ShopMyOrderDetails', { data: remoteMessage.data });
            //   }
            // } else if (remoteMessage.notification.body === 'new message') {
            //   props.navigation.navigate('ShopMyOrderDetails', { data: remoteMessage.data });
            //   dispatch(setMessageCount(mapdata.messagecount + 1));
            // }
        });

        messaging()
            .getInitialNotification()
            .then(remoteMessage => {
                console.log('====================================');
                console.log(remoteMessage, 'my message after notification');
                console.log('====================================');
                // if (remoteMessage.notification.title === 'Kinengo') {
                //   if (remoteMessage.notification.body === 'Order Delivered Successfully!') {
                //     setalert_sms3('Do you want to rate order?');
                //     setMy_Alert3(true);
                //     setRemoteMessageData(remoteMessage.data);
                //   } else {
                //     props.navigation.navigate('ShopMyOrderDetails', { data: remoteMessage.data });
                //   }
                // } else if (remoteMessage.notification.body === 'new message') {
                //   dispatch(setMessageCount(mapdata.messagecount + 1));
                //   props.navigation.navigate('ShopMyOrderDetails', { data: remoteMessage.data });
                // }
            });
    }, []);

    const getAllNotificationsList = async () => {
        console.log('kkkk notification');
        setLoading(true)

        const { responseJson, err } = await requestGetApi(creation_getNotifications + 51, '', 'GET', User.token)
        setLoading(false)
        console.log('the res in_cart notification_list ==>>', responseJson)
        if (responseJson.headers.success == 1) {
            // var counts = 0
            // for (let i = 1; i <= responseJson.body.length; i++) {
            //   if (responseJson.body[i - 1].in_cart == '1') {
            //     counts = parseInt(counts) + parseInt('1')
            //   }
            // }
            // setcartCount(counts)
            console.log('my data lenght', responseJson.body.data);
            let a = responseJson.body.data.length
            setNotificationData(responseJson.body.data)
            console.log('my notifications coking', responseJson.body.data);
            const hasStatusZero = data.some((item) => item.status === 0);
            console.log('item for notification', item);
            // Dispatch the action based on the condition
            dispatch(setcookingnotificationcount(hasStatusZero ? 1 : 0));

            // dispatch(setcookingnotificationcount(0));
        } else {
            setalert_sms(err)
            setMy_Alert(true)
        }
    };

    const ClearNotification = async () => {
        setLoading(true)
        const { responseJson, err } = await requestPostApi(creation_deletenoti + 51, '', 'DELETE', User.token)
        setLoading(false)
        console.log('the res of cler notification', responseJson)
        if (responseJson.headers.success == 1) {
            console.log('the res of cler notification from creation', responseJson)
            setNotificationData(responseJson.body)
            // Toast.show({ text1: responseJson.headers.message });
        } else {

            setalert_sms(err)
            setMy_Alert(true)
        }
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={{}}>
                <HomeHeader height={100} extraStyle={{ paddingtop: 10, paddingBottom: 25 }} paddingHorizontal={15} borderBottomLeftRadius={20} borderBottomRightRadius={20} backgroundColor='#ED1C24'
                    press1={() => { props.navigation.goBack() }} img1={require('../../../assets/images/service-header-back-button.png')} img1width={25} img1height={18}
                    press2={() => { }} title2={'Cooking'} fontWeight={'500'} img2height={20} color={'#fff'}
                    img3={notificationData.length ? require('../../../assets/clearNotifications.png') : null}
                    img3backgroundColor={'transparent'} img3padding={8} img3borderRadius={4}

                />
            </View>
            {notificationData.length > 0 ? <TouchableOpacity onPress={() => ClearNotification()} style={{ marginTop: 12, justifyContent: 'flex-end' }}>
                <Text style={{ fontSize: 16, color: '#ED1C24', textAlign: 'right', marginRight: 20 }}>Clear All</Text>
            </TouchableOpacity> : null}
            <ScrollView>
                <View style={{ width: '100%', alignSelf: 'center', marginTop: 10, paddingHorizontal: 10, }}>

                    {console.log(notificationData.length, 'my console for notification data')}
                    {notificationData.length != 0 ?

                        notificationData.map((item, index) => {
                            { console.log(item, 'item for object notification flatList') }
                            return (
                                <TouchableOpacity style={{ width: '95%', alignSelf: 'center', backgroundColor: '#fff', borderRadius: 5, marginVertical: 10 }} onPress={() => {

                                    {
                                        item.article_id
                                            != undefined ? props.navigation.navigate('CookingPost', { id: item.article_id, }) : Toast.show({ text1: 'Article not Found' })
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
                            <Image source={require('../../../assets/Art/noPostCooking.png')} style={{ width: '100%', height: 340, }}></Image>
                            <Text style={{ fontWeight: '600', color: "#000", fontSize: 18, marginHorizontal: 5, textAlign: 'center', marginTop: 3, height: 34 }}>No Notifications</Text>

                            <View style={{ width: '100%', alignSelf: 'center', marginTop: 25 }}>
                                <MyButtons title="Go To Home" height={35} width={'100%'} borderRadius={5} alignSelf="center"
                                    press={() => {
                                        props.navigation.navigate('CookingHome')
                                    }} fontSize={14} paddingHorizontal={10}
                                    titlecolor={Mycolors.BG_COLOR} backgroundColor='rgba(237, 28, 36, 0.5)' />
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


export default CookingNotifications;

