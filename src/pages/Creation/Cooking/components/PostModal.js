
// import React, { useEffect, pnguseState, useRef, useState } from 'react';
// import {
//     View,
//     Image,
//     Text,
//     StyleSheet,
//     SafeAreaView,
//     TextInput,
//     FlatList,
//     Alert,
//     TouchableOpacity,
//     ScrollView,
//     ImageBackground,
// } from 'react-native';
// import Modal from 'react-native-modal';
// import Toast from 'react-native-toast-message';
// import { dimensions, Mycolors } from '../../../../utility/Mycolors';
// import VideoPlayer from 'react-native-video-player'
// import { useNavigation } from '@react-navigation/native';
// //import ReadMoreComponent from '../Components/ReadMoreComponent';
// import { connect_people_react_post, connect_people_save_post, requestGetApi, requestPostApi, connect_people_like_post, connect_people_dislike_post, connect_people_home_page, art_HomePage } from '../../../../WebApi/Service';
// import Loader from '../../../../WebApi/Loader';

// import { useSelector, useDispatch } from 'react-redux';

// const PostModal = ({ isVisible, setIsVisible, data, startFromIndex = 0, additionalParam, id }) => {
//     const User = useSelector(state => state.user.user_details)
//     const [loading, setLoading] = useState(false)
//     const [loading2, setLoading2] = useState(false)
//     const [categoryData, setCategorydata] = useState([])
//     console.log('id captured', id);
//     const ref = useRef(null)
//     useEffect(() => {
//         console.log('id captured', id);
//         // ArtCategory()
//         // generateThumb()
//     }, [])
//     // const ArtCategory = async () => {
//     //     console.log('modal api');
//     //     setLoading(true)

//     //     console.log('my url---------->', art_HomePage)

//     //     const { responseJson, err } = await requestGetApi(art_HomePage, '', 'GET', User.token)
//     //     setLoading(false)
//     //     console.log('the res Home after hit==>>', responseJson)
//     //     if (responseJson.headers.success == 1) {
//     //         console.log('the res after sucess from modal', responseJson.body.articles)
//     //         // setCategorydata(responseJson.body.articles)
//     //         generateThumb(responseJson.body.articles)
//     //         const latestRecordsArray = responseJson.body.articles.slice(0, 3);

//     //         // Update the state with the latest records
//     //         setLatestRecords(latestRecordsArray);
//     //         // Toast.show({ text1: responseJson.headers.message });
//     //     } else {

//     //         setalert_sms(err)
//     //         setMy_Alert(true)
//     //     }
//     // }
//     // const generateThumb = async (item) => {
//     //     setLoading2(true)
//     //     // const videos = item.filter(el => {
//     //     //   if (!el.files) {
//     //     //     return false
//     //     //   } else {
//     //     //     if (el.files.find(js => js.post_type == 'Video')) {
//     //     //       return true
//     //     //     } else {
//     //     //       return false
//     //     //     }
//     //     //   }
//     //     // })

//     //     const allData = await Promise.all(
//     //         item.map?.(async (el) => {
//     //             if (!el.files) {
//     //                 return { ...el, type: "none" };
//     //             }
//     //             else if (el.files.find((js) => js.post_type == "Image")) {
//     //                 return {
//     //                     ...el,
//     //                     type: "image",
//     //                 };
//     //             } else {
//     //                 console.log("createThumbnail will be called in modal", el.files[0].file_url);
//     //                 const thumb = await createThumbnail({
//     //                     url: el.files[0].file_url,
//     //                     timeStamp: 1000, // Specify the time position for the thumbnail (in milliseconds)
//     //                 });
//     //                 return {
//     //                     ...el,
//     //                     thumb,
//     //                     type: "video",
//     //                 };
//     //             }
//     //         })

//     //     );


//     //     console.log("allData post", allData);
//     //     setCategorydata(allData);

//     //     // console.log('llllllllffff');
//     //     // const getSquare = async (file) => {
//     //     //   console.log(file.files[0].file_url, 'file');
//     //     //   const thumbnail = await createThumbnail({
//     //     //     url: file.files[0].file_url,
//     //     //     timeStamp: 10000, // Specify the time position for the thumbnail (in milliseconds)
//     //     //   });
//     //     //   console.log('articleDatathumbnail', url)
//     //     //   return thumbnail

//     //     // }
//     //     // const printSquares = async () => {
//     //     //   const nums =
//     //     //     item.filter(el => {
//     //     //       if (!el.files) {
//     //     //         return false
//     //     //       } else {
//     //     //         if (el.files.find(js => js.post_type == 'Video')) {
//     //     //           return true
//     //     //         } else {
//     //     //           return false
//     //     //         }
//     //     //       }
//     //     //     })
//     //     //   const promiseArray = nums.map(x => getSquare(x));
//     //     //   const resolvedPromises = await Promise.all(promiseArray);
//     //     //   console.log(resolvedPromises, 'hhhhhhh');
//     //     // };
//     //     // printSquares();
//     //     setLoading2(false)
//     // };

//     return (
//         <>

//             <Modal
//                 animationType="fade"
//                 transparent={true}
//                 visible={isVisible}
//                 onRequestClose={() => {
//                     isVisible(false);
//                 }}>
//                 <View
//                     style={styles.shippingView}>
//                     <ScrollView>
//                         <View
//                             style={{
//                                 width: "100%",
//                                 borderRadius: 20,
//                                 marginTop: 115,
//                                 justifyContent: "center",
//                                 alignItems: 'center',
//                                 shadowColor: '#000',
//                                 shadowOffset: {
//                                     width: 0,
//                                     height: 2,
//                                 },
//                                 shadowOpacity: 0.25,
//                                 shadowRadius: 4,
//                                 elevation: 6,

//                             }}>

//                             <View style={{
//                                 backgroundColor: '#FFFFFF',
//                                 height: "100%",
//                                 width: '100%',
//                                 padding: 10,
//                                 borderRadius: 32,
//                                 alignItems: 'center',
//                                 flexDirection: 'column'
//                             }}>
//                                 <TouchableOpacity onPress={() => { setIsVisible(false) }}
//                                     style={{ position: "absolute", width: 13, borderRadius: 35, height: 13, right: 20, top: 20 }}>
//                                     <Image
//                                         source={require('../../../../assets/images/dating-reject-image.png')}
//                                         style={{
//                                             width: 13,
//                                             height: 13, alignSelf: 'center'
//                                         }}

//                                     />
//                                 </TouchableOpacity>

//                                 <TouchableOpacity style={{ marginTop: 15, marginHorizontal: 20, height: 25, flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
//                                     <Text style={{ marginTop: 2, marginLeft: 10, textAlign: 'center', fontSize: 20, color: '#263238', fontWeight: '500', fontFamily: 'Cera Pro' }}>Edit reciever’s details</Text>


//                                 </TouchableOpacity>
//                                 <View style={{ width: 53, height: 53, borderRadius: 8, marginTop: 28 }}>
//                                 </View>
//                                 <View style={{
//                                     marginTop: -39
//                                 }}>
//                                     < TextInput style={{ width: 286, height: 50, borderRadius: 4, borderColor: '#E7EEE7', borderWidth: 1, backgroundColor: 'white', font: 'Avenir LT Std', fontSize: 14, fontWeight: '400', marginTop: 23, color: '#000000' }}

//                                         // placeholder={recieverName}
//                                         label="area_village"
//                                     // value={recieverName}
//                                     // onChangeText={(text) => {
//                                     //     setRecievername(text)
//                                     // }}
//                                     />

//                                 </View>
//                                 <View style={{

//                                 }}>
//                                     < TextInput style={{ width: 286, height: 50, borderRadius: 4, borderColor: '#E7EEE7', borderWidth: 1, backgroundColor: 'white', font: 'Avenir LT Std', fontSize: 14, fontWeight: '400', marginTop: 23, color: '#000000' }}

//                                         placeholder='uuuu'
//                                         label="area_village"
//                                     // value={senderPhone}
//                                     // onChangeText={(text) => {
//                                     //     setSenderPhone(text)
//                                     // }}
//                                     />

//                                 </View>
//                                 <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 20, flexDirection: 'row', height: 45, marginHorizontal: 20, marginTop: 30 }}>
//                                     <TouchableOpacity
//                                     // onPress={() => onReciever()
//                                     //     // navigation.navigate('Sucess')
//                                     // }
//                                     >
//                                         <View style={{ justifyContent: 'center', width: 286, flex: 1, backgroundColor: '#0F265B', borderRadius: 7 }}>
//                                             <Text style={{ color: 'white', fontFamily: 'Avenir', fontWeight: '400', fontSize: 14, alignSelf: 'center' }}>Submit </Text>
//                                         </View>
//                                     </TouchableOpacity>
//                                 </View>
//                             </View>
//                         </View>
//                     </ScrollView>
//                 </View>
//             </Modal>

//         </>
//     );
// };
// const styles = StyleSheet.create({
//     flatlistMainView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         backgroundColor: '#fff',
//         paddingHorizontal: 15,
//         paddingVertical: 10,
//         // width:'90%', 
//         width: dimensions.SCREEN_WIDTH * 0.9,
//         borderTopLeftRadius: 20,
//         borderTopRightRadius: 20,
//         alignSelf: 'center',
//         borderLeftWidth: 1,
//         borderRightWidth: 1,
//         borderBottomWidth: 1,
//         borderLeftColor: '#EAEBEB',
//         borderRightColor: '#EAEBEB',
//         borderBottomColor: '#EAEBEB'

//     },
//     followingImageView: {
//         flexDirection: 'row',
//         alignItems: 'center'
//     },
//     followingView: {
//         justifyContent: 'center',
//         marginLeft: 10
//     },
//     flatlistMainBottomView: {
//         backgroundColor: '#fff',
//         paddingVertical: 15,
//         paddingHorizontal: 15,
//         // width:'90%', 
//         width: dimensions.SCREEN_WIDTH * 0.9,
//         borderBottomRightRadius: 20,
//         borderBottomLeftRadius: 20,
//         alignSelf: 'center',
//         borderLeftWidth: 1,
//         borderRightWidth: 1,
//         borderBottomWidth: 1,
//         borderLeftColor: '#EAEBEB',
//         borderRightColor: '#EAEBEB',
//         borderBottomColor: '#EAEBEB'
//     },
//     flatlistBottomView: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',

//     },
//     text1: {
//         fontSize: 13,
//         fontWeight: '400',
//         color: '#455A64',
//     },
//     imageView: {
//         width: '100%',
//         height: 200,
//         backgroundColor: '#F8F8F8',
//         alignSelf: 'center'
//     },
//     rightButtonsView: {
//         backgroundColor: '#F8F8F8',
//         padding: 10,
//         borderRadius: 20
//     },
//     shippingView: {
//         flex: 1,
//         justifyContent: 'flex-end',
//         alignItems: 'center',
//         backgroundColor: 'rgba(140, 141, 142, 0.7)',
//         width: '100%'
//     },
// })
// export default PostModal;
















import React, { useEffect, pnguseState, useRef, useState } from 'react';
import {
    View,
    Image,
    Text,
    StyleSheet,
    SafeAreaView,
    TextInput,
    FlatList,
    Alert,
    TouchableOpacity,
    ScrollView,
    ImageBackground,
    PanResponder,

} from 'react-native';
import Animated, { useAnimatedGestureHandler, useSharedValue, withDecay, useAnimatedStyle, withScale, onGestureEvent } from 'react-native-reanimated';

import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import { dimensions, Mycolors } from '../../../../utility/Mycolors';
import VideoPlayer from 'react-native-video-player'
// import VideoPlayer from 'react-native-video-controls';

import { PanGestureHandler, PinchGestureHandler } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
//import ReadMoreComponent from '../Components/ReadMoreComponent';
import { connect_people_react_post, connect_people_save_post, requestGetApi, requestPostApi, connect_people_like_post, connect_people_dislike_post, connect_people_home_page, art_HomePage } from '../../../../WebApi/Service';
import Loader from '../../../../WebApi/Loader';

import { useSelector, useDispatch } from 'react-redux';

const PostModal = ({ isVisible, setIsVisible, data, startFromIndex = 0, additionalParam, id }) => {
    const User = useSelector(state => state.user.user_details)
    const [loading, setLoading] = useState(false)
    const [loading2, setLoading2] = useState(false)
    const [categoryData, setCategorydata] = useState([])
    console.log('id captured', id);
    const ref = useRef(null)
    useEffect(() => {
        console.log('id captured', id);
        // ArtCategory()
        // generateThumb()
    }, [])
    // const ArtCategory = async () => {
    //     console.log('modal api');
    //     setLoading(true)

    //     console.log('my url---------->', art_HomePage)

    //     const { responseJson, err } = await requestGetApi(art_HomePage, '', 'GET', User.token)
    //     setLoading(false)
    //     console.log('the res Home after hit==>>', responseJson)
    //     if (responseJson.headers.success == 1) {
    //         console.log('the res after sucess from modal', responseJson.body.articles)
    //         // setCategorydata(responseJson.body.articles)
    //         generateThumb(responseJson.body.articles)
    //         const latestRecordsArray = responseJson.body.articles.slice(0, 3);

    //         // Update the state with the latest records
    //         setLatestRecords(latestRecordsArray);
    //         // Toast.show({ text1: responseJson.headers.message });
    //     } else {

    //         setalert_sms(err)
    //         setMy_Alert(true)
    //     }
    // }
    // const generateThumb = async (item) => {
    //     setLoading2(true)
    //     // const videos = item.filter(el => {
    //     //   if (!el.files) {
    //     //     return false
    //     //   } else {
    //     //     if (el.files.find(js => js.post_type == 'Video')) {
    //     //       return true
    //     //     } else {
    //     //       return false
    //     //     }
    //     //   }
    //     // })

    //     const allData = await Promise.all(
    //         item.map?.(async (el) => {
    //             if (!el.files) {
    //                 return { ...el, type: "none" };
    //             }
    //             else if (el.files.find((js) => js.post_type == "Image")) {
    //                 return {
    //                     ...el,
    //                     type: "image",
    //                 };
    //             } else {
    //                 console.log("createThumbnail will be called in modal", el.files[0].file_url);
    //                 const thumb = await createThumbnail({
    //                     url: el.files[0].file_url,
    //                     timeStamp: 1000, // Specify the time position for the thumbnail (in milliseconds)
    //                 });
    //                 return {
    //                     ...el,
    //                     thumb,
    //                     type: "video",
    //                 };
    //             }
    //         })

    //     );


    //     console.log("allData post", allData);
    //     setCategorydata(allData);

    //     // console.log('llllllllffff');
    //     // const getSquare = async (file) => {
    //     //   console.log(file.files[0].file_url, 'file');
    //     //   const thumbnail = await createThumbnail({
    //     //     url: file.files[0].file_url,
    //     //     timeStamp: 10000, // Specify the time position for the thumbnail (in milliseconds)
    //     //   });
    //     //   console.log('articleDatathumbnail', url)
    //     //   return thumbnail

    //     // }
    //     // const printSquares = async () => {
    //     //   const nums =
    //     //     item.filter(el => {
    //     //       if (!el.files) {
    //     //         return false
    //     //       } else {
    //     //         if (el.files.find(js => js.post_type == 'Video')) {
    //     //           return true
    //     //         } else {
    //     //           return false
    //     //         }
    //     //       }
    //     //     })
    //     //   const promiseArray = nums.map(x => getSquare(x));
    //     //   const resolvedPromises = await Promise.all(promiseArray);
    //     //   console.log(resolvedPromises, 'hhhhhhh');
    //     // };
    //     // printSquares();
    //     setLoading2(false)
    // };
    const videoRef = useRef(null);
    const scaleValue = useRef(new Animated.Value(1)).current;
    const [baseScale, setBaseScale] = useState(1);
    const [pinchScale, setPinchScale] = useState(1);



    return (
        <>
            {/* <Modal
                isVisible={isVisible}
                swipeDirection="down"
                onBackdropPress={() => setIsVisible(false)}
                onSwipeComplete={e => {
                    setIsVisible(false);
                }}
                scrollTo={() => { }}
                scrollOffset={1}
                propagateSwipe={true}
                coverScreen={true}

                backdropColor="transparent"
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                }}>
                <View
                    style={{
                        height: '100%',
                        backgroundColor: '#F8F8F8',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        paddingVertical: 20,
                        marginTop: 60
                    }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, marginTop: 35, marginLeft: 16 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: '#263238' }}>Recommended for you</Text>

                    </View>
                    <View style={{ width: dimensions.SCREEN_WIDTH - 40, alignSelf: 'center', marginTop: 10, height: '90%', marginLeft: 20, marginRight: 20 }}>

                        <ScrollView nestedScrollEnabled={true}>
                            <FlatList
                                data={data.filter(item => item.id === id)}
                                showsHorizontalScrollIndicator={true}

                                renderItem={({ item, index }) => {
                                    console.log('category modal', item)
                                    let videoUrl = null; // Declare and initialize the videoUrl variable

                                    if (item.type === "video") {
                                        // Get the video URL from the files array
                                        videoUrl = item.files[0]?.file_url; // Assuming the URL is stored in the 'url' property of the file object
                                    }
                                    console.log();
                                    return (

                                        <>
                                            <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH, marginRight: 15, flexDirection: 'row', marginBottom: 20, }}
                                                onPress={() => {

                                                }}

                                            >
                                                <TouchableOpacity onPress={() => {

                                                }}    >

                                                    {item.type == 'video' ?



                                                        <VideoPlayer
                                                            resizeMode="contain"
                                                            video={{ uri: videoUrl }}
                                                            style={{ borderRadius: 10, borderWidth: 2, resizeMode: 'stretch', width: dimensions.SCREEN_WIDTH, height: 180, alignSelf: 'center' }}
                                                            videoWidth={dimensions.SCREEN_WIDTH}
                                                            videoHeight={180}
                                                            autoplay={false}
                                                            thumbnail={{ uri: item.thumb.path }}
                                                            endWithThumbnail
                                                            disableControlsAutoHide
                                                            customStyles={{
                                                                thumbnail: { width: dimensions.SCREEN_WIDTH - 40, height: 180, alignSelf: 'center' },
                                                                // videoWrapper: { width: dimensions.SCREEN_WIDTH / 2.5, height: 90, },
                                                                wrapper: { width: dimensions.SCREEN_WIDTH - 40, height: 105, resizeMode: 'stretch' },
                                                            }}
                                                        />




                                                        : <Image source={{
                                                            uri: item.cover_photo
                                                        }} style={{ width: dimensions.SCREEN_WIDTH - 40, height: 180, borderRadius: 10, alignSelf: 'center' }}></Image>}

                                                </TouchableOpacity>

                                            </TouchableOpacity >
                                            <View style={{ borderBottomWidth: 1, borderBottomColor: '#D9D9D9', height: 1, width: '100%', marginBottom: 20, marginTop: 80 }}></View>
                                        </>
                                    )
                                }}
                                keyExtractor={(item, index) => index.toString()}
                            />
                        </ScrollView>
                    </View>
                </View>

            </Modal > */}
            < Modal
                isVisible={isVisible}
                // swipeDirection="down"
                onBackdropPress={() => setIsVisible(false)}
                // onSwipeComplete={e => {
                //   setProfileModal(false);
                // }}

                style={{
                    justifyContent: 'center', // Update justifyContent to 'center' to center the modal vertically
                    margin: 0,
                    backgroundColor: 'transparent',
                }}>
                <View
                    style={{
                        height: '40%', // Set the height to 40% of the screen height
                        // backgroundColor: 'rgba(0,0,0,0.5)',
                        width: '95%', // Set the width to 90% of the screen width
                        alignSelf: 'center',
                        justifyContent: 'center', // Center the content vertically
                        borderRadius: 10,
                    }}>

                    <View
                        style={{
                            height: '100%',

                            borderTopLeftRadius: 30,
                            borderTopRightRadius: 30,
                            paddingVertical: 20,
                            marginTop: 10
                        }}>

                        <View style={{ width: dimensions.SCREEN_WIDTH - 40, alignSelf: 'center', height: '100%', marginLeft: 20, marginRight: 20 }}>

                            <ScrollView nestedScrollEnabled={true}>
                                <FlatList
                                    data={data.filter(item => item.id === id)}
                                    showsHorizontalScrollIndicator={true}

                                    renderItem={({ item, index }) => {
                                        console.log('category modal', item)
                                        let videoUrl = null; // Declare and initialize the videoUrl variable

                                        if (item.type === "video") {
                                            // Get the video URL from the files array
                                            videoUrl = item.files[0]?.file_url; // Assuming the URL is stored in the 'url' property of the file object
                                        }
                                        console.log();
                                        return (

                                            <>
                                                {/* <TouchableOpacity style={{ alignItems: 'flex-end', marginBottom: 20 }} onPress={() => setIsVisible(false)}>
                                                    <Image source={require('../../../../assets/dating-reject-image.png')} style={{ tintColor: '#29913C' }} />
                                                </TouchableOpacity> */}
                                                {/* <View>
                                                    <Text style={{ color: 'red', fontSize: 12 }}>Around the world</Text>
                                                </View> */}
                                                <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH, flexDirection: 'row', marginBottom: 20, }}
                                                    onPress={() => {

                                                    }}

                                                >
                                                    <TouchableOpacity onPress={() => {

                                                    }}    >

                                                        {item.type == 'video' ?



                                                            <VideoPlayer
                                                                resizeMode="contain"
                                                                video={{ uri: videoUrl }}
                                                                style={{ borderRadius: 10, borderWidth: 2, resizeMode: 'stretch', width: dimensions.SCREEN_WIDTH, height: 180, alignSelf: 'center' }}
                                                                videoWidth={dimensions.SCREEN_WIDTH}
                                                                videoHeight={200}
                                                                autoplay={false}
                                                                thumbnail={{ uri: item.thumb.path }}
                                                                endWithThumbnail
                                                                disableControlsAutoHide
                                                                customStyles={{
                                                                    thumbnail: { width: dimensions.SCREEN_WIDTH - 40, height: 200, alignSelf: 'center' },
                                                                    // videoWrapper: { width: dimensions.SCREEN_WIDTH / 2.5, height: 90, },
                                                                    wrapper: { width: dimensions.SCREEN_WIDTH - 40, height: 105, resizeMode: 'stretch' },
                                                                }}
                                                            />




                                                            : <Image source={{
                                                                uri: item.cover_photo
                                                            }} style={{ width: dimensions.SCREEN_WIDTH - 40, height: 180, borderRadius: 10, alignSelf: 'center' }}></Image>}

                                                    </TouchableOpacity>

                                                </TouchableOpacity >
                                                <View style={{ height: 1, width: '100%', marginBottom: 20, marginTop: 80 }}></View>
                                            </>
                                        )
                                    }}
                                    keyExtractor={(item, index) => index.toString()}
                                />
                            </ScrollView>
                        </View>
                    </View>

                </View>
            </Modal >
            {
                loading ?
                    <Loader />
                    : null}
        </>
    );
};
const styles = StyleSheet.create({
    flatlistMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        // width:'90%',
        width: dimensions.SCREEN_WIDTH * 0.9,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        alignSelf: 'center',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftColor: '#EAEBEB',
        borderRightColor: '#EAEBEB',
        borderBottomColor: '#EAEBEB'

    },
    followingImageView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    followingView: {
        justifyContent: 'center',
        marginLeft: 10
    },
    flatlistMainBottomView: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 15,
        // width:'90%',
        width: dimensions.SCREEN_WIDTH * 0.9,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        alignSelf: 'center',
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftColor: '#EAEBEB',
        borderRightColor: '#EAEBEB',
        borderBottomColor: '#EAEBEB'
    },
    flatlistBottomView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',

    },
    text1: {
        fontSize: 13,
        fontWeight: '400',
        color: '#455A64',
    },
    imageView: {
        width: '100%',
        height: 200,
        backgroundColor: '#F8F8F8',
        alignSelf: 'center'
    },
    rightButtonsView: {
        backgroundColor: '#F8F8F8',
        padding: 10,
        borderRadius: 20
    },
})
export default PostModal;