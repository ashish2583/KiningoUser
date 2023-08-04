
import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, } from 'react-native';
import HomeHeaderRoundBottom from './components/HomeHeaderRoundBottm';
import { androidCameraPermission } from './Permissions';
import { baseUrl, shop_eat_cart, user_payment_method, shop_eat_orders, shop_eat_cart_book_dining, shop_eat_cart_book_table, shop_eat_cart_id, shop_eat_business_id, shop_eat_menu_userid, requestPostApi, requestGetApi, shop_eat, connect_people_create_post, connect_people_newPost, art_getCollection, requestPostApiMedia, art_PostCollection, postApiWithToken2, art_HomePage, addProfile_image, get_profile, delet_article, update_profileImg, creation_addPhoto, creation_profile, creation_delete_article, creation_delete } from '../../../WebApi/Service'
import { useSelector, useDispatch } from 'react-redux';
import ImagePicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Loader from '../../../WebApi/Loader';
import { saveUserResult, saveUserToken, setVenderDetail, onLogoutUser, savepeoplemoduleuserdata } from '../../../redux/actions/user_action';
import SearchInput2 from '../../../component/SearchInput2';
import SearchInputEnt from '../../../component/SearchInputEnt';
import FashionSearch from './components/FashionSearch';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import LinearGradient from 'react-native-linear-gradient'
import AppIntroSlider from 'react-native-app-intro-slider';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';

import VideoPlayer from 'react-native-video-player'
import { createThumbnail } from "react-native-create-thumbnail";
import ViewMoreText from 'react-native-view-more-text';

const CookingProfile = (props) => {
    const dispatch = useDispatch();
    const User = useSelector(state => state.user.user_details)
    console.log('User', User);
    const [categoryData, setCategoryData] = useState([])
    const [articleData, setArticleData] = useState('')
    const [searchValue, setsearchValue] = useState('')
    const [scrollEnabled, setScrollEnabled] = useState(false)
    const myTextInput = useRef()
    const [multiSliderValue, setMultiSliderValue] = useState([0, 100])
    const [showChooseMilesModal, setShowChooseMilesModal] = useState(false)
    const [loading, setLoading] = useState(false)
    const [showModal, setShowModal] = useState({ isVisible: false, data: null });
    const [showVideoModal, setShowVideoModal] = useState(false)
    const [selectedVideo, setSelectedVideo] = useState({})
    const [showReportModal, setShowReportModal] = useState(false)
    const [selectedReasonId, setSelectedReasonId] = useState(null)
    const [image, setImage] = useState('');
    const [image2, setimage2] = useState('')
    const [profileModal, setProfileModal] = useState('')

    const [isimageChange, setisimageChange] = useState(false);
    const [editModal, setEditModal] = useState(false)
    const [profileImg, setProfileImg] = useState(
        '')
    const [modlevisual5, setmodlevisual5] = useState(false)
    const [selectedId, setSelectedId] = useState(null);
    const [myselectcat, setMyslectcat] = useState('')
    const [modlevisual, setmodlevisual] = useState(false);
    const [reportReasonData, setReportReasonData] = useState([
        {
            id: '1',
            name: 'I just don’t like it',
            description: '',
            selected: true
        },
        {
            id: '2',
            name: 'Nudity or pornography',
            description: '',
            selected: false
        },
        {
            id: '3',
            name: 'Hate speech or symbols',
            description: 'Racist, homophobic or sexist slurs',
            selected: false
        },
        {
            id: '4',
            name: 'Violence or threat of violence',
            description: `Graphic injury, unlawful activity, dangerous or criminal organizations`,
            selected: false
        },
        {
            id: '5',
            name: 'Sale or promotion of firearms',
            description: '',
            selected: false
        },
        {
            id: '6',
            name: 'Sale or promotion of drugs',
            description: '',
            selected: false
        },
        {
            id: '7',
            name: 'Harassment or bullying',
            description: '',
            selected: false
        },
        {
            id: '8',
            name: 'Intellectual property violation',
            description: 'Copyright or trademark infringement',
            selected: false
        },
    ])
    const [videoDetails, setVideoDetails] = useState([
        { url: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4` },
        { url: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4` },
        { url: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4` },
    ])
    const [classesList, setClassesList] = useState([
        {
            id: '1',
            title: 'Graphic Design Class',
            price: 949,
            desc: ['Get 2x deeper dust removal with unique foam je technology', 'Recommended for ACs serviced more than 6 months ago'],
            distance: '3 kms away',
            img: require('../../../assets/images/service-product-image.png'),
        },
        {
            id: '2',
            title: 'Graphic Design Class',
            price: 949,
            desc: ['Get 2x deeper dust removal with unique foam je technology', 'Recommended for ACs serviced more than 6 months ago'],
            distance: '3 kms away',
            img: require('../../../assets/images/service-product-image.png'),
        },
        {
            id: '3',
            title: 'Graphic Design Class',
            price: 949,
            desc: ['Get 2x deeper dust removal with unique foam je technology', 'Recommended for ACs serviced more than 6 months ago'],
            distance: '3 kms away',
            img: require('../../../assets/images/service-product-image.png'),
        },
    ])
    const [aroundTheWorldData, setAroundTheWorldData] = useState([
        {
            id: '1',
            name: 'Leslie Alexander',
            desc: '',
            time: '14 hours ago',
            img: require('../../../assets/images/fashion-around-the-world-image.png'),
            likes: '4k',
            dislikes: '1k',
        },
        {
            id: '2',
            name: 'Leslie Alexander',
            desc: '',
            time: '14 hours ago',
            img: require('../../../assets/images/fashion-around-the-world-image.png'),
            likes: '4k',
            dislikes: '1k',
        },
        {
            id: '3',
            name: 'Leslie Alexander',
            desc: '',
            time: '14 hours ago',
            img: require('../../../assets/images/fashion-around-the-world-image.png'),
            likes: '4k',
            dislikes: '1k',
        },
    ])
    const [courseData, setCourseData] = useState([
        {
            id: '1',
            title: 'Celebrity Style',
            desc: '',
            time: '',
            img: require('../../../assets/images/fashion-celebrity-style.png'),
        },
        {
            id: '2',
            title: 'Street Style',
            desc: '',
            time: '',
            img: require('../../../assets/images/fashion-celebrity-style.png'),
        },
        {
            id: '3',
            title: 'Models',
            desc: '',
            time: '',
            img: require('../../../assets/images/fashion-celebrity-style.png'),
        },
    ])
    const [upData, setupData] = useState([
        {
            id: '1',
            catId: '1',
            title: 'Intel 3rd Gen Motherboard',
            desc: '',
            price: '$140.00',
            time: '',
            img: require('../../../assets/images/intel_motherboard.png'),
        },
        {
            id: '2',
            catId: '2',
            title: 'Intel 3rd Gen Motherboard',
            desc: '',
            price: '$140.00',
            time: '',
            img: require('../../../assets/images/intel_motherboard.png'),
        },
        {
            id: '3',
            catId: '3',
            title: 'Intel 3rd Gen Motherboard',
            desc: '',
            price: '$140.00',
            time: '',
            img: require('../../../assets/images/intel_motherboard.png'),
        },
        {
            id: '4',
            catId: '4',
            title: 'Intel 3rd Gen Motherboard',
            desc: '',
            price: '$140.00',
            time: '',
            img: require('../../../assets/images/intel_motherboard.png'),
        },
        {
            id: '5',
            catId: '1',
            title: 'Intel 3rd Gen Motherboard',
            desc: '',
            price: '$140.00',
            time: '',
            img: require('../../../assets/images/intel_motherboard.png'),
        },
        {
            id: '6',
            catId: '2',
            title: 'Intel 3rd Gen Motherboard',
            desc: '',
            price: '$140.00',
            time: '',
            img: require('../../../assets/images/intel_motherboard.png'),
        },
        {
            id: '7',
            catId: '3',
            title: 'Intel 3rd Gen Motherboard',
            desc: '',
            price: '$140.00',
            time: '',
            img: require('../../../assets/images/intel_motherboard.png'),
        },
    ])
    const [ctegoryData, setCategorydata] = useState('')
    const [selectedCategory, setSelectedCategory] = useState({})
    console.log('selected category', selectedCategory);
    const [introSliderData] = useState([
        // require('../../assets/Group75972.png'),
        { key: 'one', image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU', title: 'Art-Aficionado Tim Newton on How to Collect Art', status: 'Fine Art', date: 'March 4, 2022' },
        { key: 'two', image: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg', title: 'Art-Aficionado Tim Newton on How to Collect Art', status: 'Fine Art', date: 'March 4, 2022' },
        { key: 'three', image: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg', title: 'Art-Aficionado Tim Newton on How to Collect Art', status: 'Fine Art', date: 'March 4, 2022' }
    ])
    const [likes, setLikes] = useState('')
    const [dislike, setdisikes] = useState('')
    const [comment, setcommes] = useState('')
    const [profile, setProile] = useState('')
    const [desData, setData] = useState([])
    const [desc, setdesc] = useState('')
    const [title, setTile] = useState('')
    const [article, setArticle] = useState('')
    const [userame, setUserName] = useState()
    const [selectedCategoryy, setSelectedCategoryy] = useState(null);
    const [loading2, setLoading2] = useState(false);
    const [isViewVisible, setIsViewVisible] = useState(false);
    const [selectedItemId, setSelectedItemId] = useState(null);
    const [isEditingOptionsVisible, setEditingOptionsVisible] = useState(false);

    const handleToggleView = (itemId) => {
        console.log('itemId', itemId[0].article_id);
        setSelectedItemId(itemId[0].article_id);
    };
    useEffect(() => {
        if (selectedItemId !== null) {
            console.log('is selected item selecte', selectedItemId)

            setEditingOptionsVisible(true);
        } else {
            setEditingOptionsVisible(false);
        }
    }, [selectedItemId]);
    React.useEffect(() => {
        const unsubscribe = props.navigation.addListener('focus', () => {
            // The screen is focused
            setSelectedItemId(null);
            // Call any action
            ArtCategory()
            // Categories()

            // console.log('my user id of state----->', userID);
        });
        // Return the function to unsubscribe from the event so it gets removed on unmount
        return unsubscribe;
    }, [props]);
    const ArtCategory = async () => {
        setLoading(true)
        var fUrl = creation_profile
        var urls = User.userid
        var murl = '?module_id=' + '51'
        console.log('my url---------->', urls)
        if (urls != undefined) {
            fUrl = fUrl + urls + murl
        }

        console.log("LIKE CLICK for cooking:::", murl);
        const { responseJson, err } = await requestGetApi(fUrl, '', 'GET', User.token)
        setLoading(false)

        console.log('the res after sucess of profile vrinda', responseJson.body)
        if (Object.keys(responseJson.body).length == 0) {
            // If data is null, set the states to 0
            console.log('0 is called  kkkkkkkk');
            setLikes(0);
            setdisikes(0);
            setcommes(0);
        } else {

            // Check if the API call was successful (responseJson.headers.success == 1)
            if (responseJson.headers.success === 1) {

                generateThumb(responseJson.body.data.dataArray);
                console.log('username for profile data ', responseJson.body.data.dataArray[0].username
                );
                setLikes(responseJson.body.data.total_article_likes);
                setdisikes(responseJson.body.data.total_article_dislikes);
                setcommes(responseJson.body.data.total_article_comments);
                setProile(responseJson.body.data.user_profileImage);
                setUserName(responseJson.body.data.dataArray[0].username);
                // Toast.show({ text1: responseJson.headers.message });
            } else {
                setalert_sms(err);
                setMy_Alert(true);
            }
        }
    }
    const multiSliderValuesChange = (values) => { setMultiSliderValue(values) }

    const handleCloseView = () => {
        setIsViewVisible(false);
    };
    const HomePage = async (removeFilter = false) => {
        console.log('removeFilter', removeFilter);
        setLoading(true)
        console.log('iiiiiiitemm');
        const { responseJson, err } = await requestGetApi(art_HomePage, '', 'GET', User.token)
        setLoading(false)
        console.log('the res Home==>>', responseJson)
        if (responseJson.headers.success == 1) {
            // console.log('the rsponse of article agter selection', responseJson.body.articles)
            if (removeFilter) { setSelectedCategory({}) }
            setArticleData(responseJson.body.articles)
            const latestRecordsArray = responseJson.body.articles.slice(0, 3);

            // Update the state with the latest records
            setLatestRecords(latestRecordsArray);
            console.log('remove filter', selectedCategory);

            // Toast.show({ text1: responseJson.headers.message });
        } else {
            console.log('profile image', err);
            setalert_sms(err)
            setMy_Alert(true)
        }
    }

    const Delete = async (id) => {
        setLoading(true)
        console.log('the deleteee post id', id)
        console.log('myy url ', creation_delete + id)

        const { responseJson, err } = await requestPostApi(creation_delete + id, '', 'DELETE', User.token)
        // props.navigation.navigate('MyProfile')
        console.log('the deleteee post of cooking', responseJson)

        if (responseJson.headers
            .success == 1) {
            // setUserid(nameAgeList[0].rest.userid)
            // props.navigation.navigate('MyProfile')
            // setdescrbe(responseJson.post.post_description)
            Toast.show({ text1: responseJson.headers.message });
            setLoading(false)
            ArtCategory()
            // setLoading(false)
            // Toast.show({ text1: responseJson.headers.message });

        } else {

            setalert_sms(err)
            setMy_Alert(true)

        }
        setLoading(false)
    }
    const openImageModal = (index) => {

        console.log('my image')
        setmodlevisual(true)
    }
    const onCamera = () => {
        ImagePicker.openCamera({
            width: 300,
            height: 400,
            cropping: true,
        }).then(image => {
            setImage(image)
            setimage2(image?.path)
            console.log('imagre set-------////////', image);
            setisimageChange(true)
            console.log(image.path);
            { profile ? UpdateProfileImg(image) : changeProfileImg(image) }
            setmodlevisual(false)
        });
    }
    const onGallery = async () => {
        try {
            let value = await ImagePicker.openPicker({
                width: 1080,
                height: 1080,
                cropping: true,
                mediaType: 'photo',
                compressImageQuality: 1,
                compressImageMaxHeight: 1080 / 2,
                compressImageMaxWidth: 1080 / 2,
            }).then(image => {
                setImage(image);
                setimage2(image?.path)
                setisimageChange(true)
                console.log('imagre set------- profile////////', profile);
                console.log('my profile cccccccccc');
                { profile ? UpdateProfileImg(image) : changeProfileImg(image) }
                setmodlevisual(false)
            });
        } catch (error) {
            console.log('error in openLibrary', error);
        }
    };

    const changeProfileImg = async (image) => {
        console.log('oes it reach to profile image');
        setLoading(true)
        const feedBackData = new FormData();
        console.log('image-------->', image);
        ;
        if (image != '') {
            var imageName = image.path.slice(
                image.path.lastIndexOf('/'),
                image.path.length,
            );
            feedBackData.append('file', {
                name: imageName,
                type: image.mime,
                uri: image.path,
            });
        }
        console.log('formdata-------->', feedBackData)
        const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${User.token}`,
        };
        const url = 'http://54.153.75.225/backend/api/v1/creation/common/add-profile-image';
        try {
            const response = await fetch(url, {
                method: 'POST',
                headers,
                body: feedBackData,
            });

            const responseJson = await response.json();
            console.log('myyyyyyyy edit profile image', responseJson)


            // console.log(responseJson
            //     , 'my response of profile');
            setLoading(false)
            //Toast.show({ text1: responseJson.message });


        } catch (error) {
            console.log('Error uploading data:', error);
        }




    }

    const UpdateProfileImg = async (image) => {
        console.log('oes it reach to updateee image');
        setLoading(true)
        const feedBackData = new FormData();
        console.log('image-------->', image);
        ;
        if (image != '') {
            var imageName = image.path.slice(
                image.path.lastIndexOf('/'),
                image.path.length,
            );
            feedBackData.append('file', {
                name: imageName,
                type: image.mime,
                uri: image.path,
            });
        }
        console.log('formdata-------->', feedBackData)
        const headers = {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${User.token}`,
        };
        const url = 'http://54.153.75.225/backend/api/v1/creation/common/update-profile-image';
        try {
            const response = await fetch(url, {
                method: 'PUT',
                headers,
                body: feedBackData,
            });

            const responseJson = await response.json();
            console.log('myyyyyyyy update  profile image uploaded success', responseJson)


            // console.log(responseJson
            //     , 'my response of profile');
            setLoading(false)
            //Toast.show({ text1: responseJson.message });


        } catch (error) {
            console.log('Error uploading data:', error);
        }




    }

    const generateThumb = async (item) => {
        console.log('item  profile', item);
        setLoading2(true)
        const allData1 =
            await Promise.all(item?.map(async (el) => {
                console.log('myyyy thumb commr', el.total_comments)
                const data = await Promise.all(el.images?.map(async (imgData, index) => {
                    if (imgData?.post_type === "Image") {
                        return { ...imgData, type: 'image', id: index, description: el.description, likes: el.total_likes, dislike: el.total_dislikes, cretedTime: el.created_date, article_id: el.article_id, title: el.headline, comment: el.total_comments, category_data: el.category_id, category_name: el.category }
                    } else {
                        console.log("createThumbnail will be called for profile ", imgData);
                        const thumb = await createThumbnail({
                            url: imgData.file_url,
                            timeStamp: 10, // Specify the time position for the thumbnail (in milliseconds)
                        });
                        return {
                            ...imgData,
                            thumb,
                            type: "video",
                            id: index,
                            description: el.description,
                            likes: el.total_likes,
                            dislike: el.total_dislikes,
                            cretedTime: el.created_date,
                            article_id: el.article_id,
                            title: el.headline,
                            comment: el.total_comments,
                            category_data: el.category_id,
                            category_name: el.category
                        };
                    }
                }))
                return data
            }))
        console.log(allData1, 'my profile thumb11111');
        setData(allData1)

        setLoading2(false)
    };
    // const _renderItem = ({ item }) => {
    //     console.log(item, 'item ggggg');
    //     return (
    //         <>
    //             {
    //                 item.type === 'video' ? <VideoPlayer
    //                     resizeMode="contain"
    //                     video={{ uri: item.file_url }}
    //                     style={{ borderWidth: 2, }}
    //                     videoWidth={dimensions.SCREEN_WIDTH}
    //                     videoHeight={350}
    //                     autoplay={false}
    //                     thumbnail={{ uri: item.thumb.path }}
    //                     endWithThumbnail
    //                     disableControlsAutoHide
    //                     customStyles={{
    //                         thumbnail: { width: '100%', height: 350, alignSelf: 'center', resizeMode: 'cover' },
    //                         videoWrapper: { width: '100%', height: 350, resizeMode: 'stretch' },
    //                         // wrapper: { width: '100%', height: 227 },
    //                     }}
    //                 />
    //                     :
    //                     <Image source={{ uri: item.file_url }} style={{ width: '100%', height: 350, alignSelf: 'center' }} />
    //             }
    //         </>
    //     );
    // }

    const _renderItem = ({ item }) => {
        console.log(item, 'item ggggg');


        return (
            <>
                {
                    item.type === 'video' ? (
                        <VideoPlayer
                            resizeMode="contain"
                            video={{ uri: item.file_url }}
                            style={{ borderWidth: 2 }}
                            videoWidth={dimensions.SCREEN_WIDTH}
                            videoHeight={200}
                            autoplay={false}
                            thumbnail={{ uri: item.thumb.path }}
                            endWithThumbnail
                            disableControlsAutoHide
                            customStyles={{
                                thumbnail: { width: '100%', height: 230, },
                                videoWrapper: { width: '100%', height: 200, resizeMode: 'stretch' },
                                // wrapper: { width: '100%', height: 227 },
                            }}
                        />
                    ) : (
                        <Image source={{ uri: item.file_url }} style={{ width: '100%', height: 350, alignSelf: 'center' }} />
                    )
                }
            </>
        );
    }
    return (
        <SafeAreaView scrollEnabled={scrollEnabled} style={{ height: '100%', backgroundColor: '#F8F8F8' }}>
            <ScrollView>
                {/* <HomeHeaderRoundBottom height={80} extraStyle={{ paddingtop: 10, paddingBottom: 25 }} paddingHorizontal={15} borderBottomLeftRadius={20} borderBottomRightRadius={20} backgroundColor='#29913C'
                    press1={() => { props.navigation.goBack() }} img1={require('../../../assets/images/service-header-back-button.png')} img1width={25} img1height={18}
                    press2={() => { }} title2={'Art'} fontWeight={'500'} img2height={20} color={'#fff'}
                    press3={() => { props.navigation.navigate('ArtNotifications') }} img3={require('../../../assets/images/fashion-bell-icon.png')} img3width={25} img3height={22} /> */}
                <HomeHeaderRoundBottom height={100} extraStyle={{ paddingtop: 10, paddingBottom: 25 }} paddingHorizontal={15} borderBottomLeftRadius={20} borderBottomRightRadius={20} backgroundColor='#ED1C24'
                    press1={() => { props.navigation.goBack() }} img1={require('../../../assets/images/service-header-back-button.png')} img1width={25} img1height={18}
                    press2={() => { }} title2={'Cooking'} fontWeight={'500'} img2height={20} color={'#fff'}
                    press3={() => { props.navigation.navigate('CookingNotifications') }} img3={require('../../../assets/images/fashion-bell-icon.png')} img3width={25} img3height={22}
                    press4={() => {
                        AsyncStorage.clear();
                        dispatch(onLogoutUser())

                    }} img4={require('../../../assets/People/PeopleLogoutIconModal.png')} img4width={25} img4height={22}
                />
                <View style={{
                    flex: 1,

                    backgroundColor: '#F8F8F8'
                }}>
                    <View style={{ height: 200, marginTop: 20 }}>
                        <LinearGradient
                            colors={['rgba(255, 255, 255, 1)', 'rgba(249, 249, 249, 1)']}
                            style={styles.descriptionView}
                        >
                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>

                                <View style={{ flex: 1 }}>
                                    {console.log(profile, 'myProfileeeee')}
                                    <Image
                                        source={
                                            isimageChange
                                                ? { uri: image2 }

                                                : profile
                                                    ? { uri: profile }
                                                    : require('../../../assets/blankProfile.png')
                                        }
                                        style={{
                                            height: '50%',
                                            width: '80%',
                                            borderWidth: 2,
                                            borderRadius: 90,
                                            alignSelf: 'center', // Add this to center the image
                                        }}
                                        resizeMode="contain" // Set resizeMode as per your requirement
                                    />
                                </View>
                                {profile == 'null' ? <TouchableOpacity style={{ position: 'absolute', marginLeft: 26, top: 54 }} onPress={openImageModal}>
                                    <Image
                                        source={require('../../../assets/Art/ArtFile.png')}
                                        style={{ width: 15, height: 15, borderRadius: 30, }}
                                    />
                                </TouchableOpacity> :
                                    <TouchableOpacity style={{ position: 'absolute', marginLeft: 26, top: 54 }} onPress={openImageModal}>
                                        <Image
                                            source={require('../../../assets/Art/ArtFile.png')}
                                            style={{ width: 15, height: 15, borderRadius: 30, }}
                                        />
                                    </TouchableOpacity>}
                                {/* <View style={styles.descriptionView}> */}
                                <View style={{ flex: 5, }}>
                                    <View style={styles.imageRowView}>

                                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                            <Text style={{ fontSize: 14, fontWeight: '600', color: '#455A64', left: -2 }}>
                                                {/* {`${firstname} ${lastname}`} */}

                                                {userame
                                                }
                                            </Text>

                                        </View>


                                        <TouchableOpacity style={styles.threeDotsView} onPress={() => { props.navigation.navigate('CookingUpload') }}>
                                            <Text style={{ height: 23, alignSelf: 'center', bottom: 4, color: 'white' }}>Add Post</Text>
                                        </TouchableOpacity>
                                    </View>

                                </View>
                            </View>

                            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-evenly', marginTop: 10, }}>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 1)', 'rgba(249, 249, 249, 1)']}
                                    style={[styles.numView, { marginRight: 10 }]}
                                >
                                    <Text style={{
                                        fontSize: 20,
                                        fontWeight: '500',
                                        color: '#455A64', marginHorizontal: 12
                                    }}>

                                        {/* {postCount} */}
                                        {likes}
                                    </Text>
                                    <Text style={styles.numText}>Likes</Text>
                                </LinearGradient>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 1)', 'rgba(249, 249, 249, 1)']}
                                    style={[styles.numView, { marginRight: 10 }]}
                                >
                                    <TouchableOpacity


                                    >
                                        <Text style={{
                                            fontSize: 20,
                                            fontWeight: '500',
                                            color: '#455A64', marginHorizontal: 12
                                        }}>

                                            {/* {foolCount} */}
                                            {dislike}
                                        </Text>
                                        <Text style={styles.numText}>Dislikes</Text>
                                    </TouchableOpacity>
                                </LinearGradient>
                                <LinearGradient
                                    colors={['rgba(255, 255, 255, 1)', 'rgba(249, 249, 249, 1)']}
                                    style={styles.numView}
                                >
                                    <TouchableOpacity style={{ alignItems: 'center' }}>
                                        <View style={{ flexDirection: 'column', marginRight: 10 }}>
                                            {/* Vertical text */}
                                            <Text style={{
                                                fontSize: 20,
                                                fontWeight: '500',
                                                color: '#455A64', marginHorizontal: 12
                                            }}>
                                                {comment}

                                            </Text>
                                        </View>
                                        <View style={{ width: '100%' }}>
                                            {/* Horizontal text */}
                                            <Text style={{
                                                fontSize: 12,
                                                fontWeight: '400',
                                                color: '#455A64',
                                                marginLeft: -3
                                            }}>Comments</Text>
                                        </View>
                                    </TouchableOpacity>
                                </LinearGradient>
                            </View>

                        </LinearGradient>
                    </View>

                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 40, marginBottom: 10, marginLeft: 20 }}>
                        <Text style={{ fontSize: 16, fontWeight: '500', color: '#263238' }}>My posts</Text>
                        <TouchableOpacity onPress={() => { props.navigation.navigate('ArtViewAll') }}>

                        </TouchableOpacity>
                    </View>


                    <View style={{ width: dimensions.SCREEN_WIDTH * 0.9, alignSelf: 'center', marginTop: 10 }}>
                        {desData.length === 0 ? (
                            <Text style={{ fontSize: 16, color: 'red', alignSelf: 'center', alignItems: 'center', justifyContent: 'center', marginTop: 30 }}>No posts Found</Text>
                        ) : (<FlatList
                            data={desData}
                            showsHorizontalScrollIndicator={false}
                            numColumns={1}
                            style={{}}
                            renderItem={({ item, index }) => {
                                console.log(item, 'harticle_id of profile');
                                return (

                                    <View style={{ width: '95.5%', marginVertical: 10, borderRadius: 30, }}>
                                        <TouchableOpacity style={styles.flatlistMainView} onPress={() => { props.navigation.navigate('CookingPost', { id: item[0].article_id }) }}>

                                            <View style={styles.followingImageView}>
                                                <View style={{}} onPress={() => {

                                                }}>

                                                    {profile ? (
                                                        <Image
                                                            source={{
                                                                uri: profile
                                                            }}
                                                            style={{ width: 35, height: 35, borderRadius: 90, }}
                                                            resizeMode="contain"
                                                        />
                                                    ) : (
                                                        <Image
                                                            source={require('../../../assets/blankProfile.png')}
                                                            style={{ width: 35, height: 35, borderRadius: 40 }}
                                                        />
                                                    )}
                                                </View>
                                                <View style={styles.followingView}>
                                                    <View onPress={() => {


                                                    }}>
                                                        <Text style={{ fontSize: 14, fontWeight: '600', color: '#455A64' }}>  {userame
                                                        }</Text>
                                                    </View>

                                                </View>
                                            </View>
                                            <View>
                                                <Text style={{ marginRight: 0, color: '#263238', }}>{item[0].cretedTime}</Text>
                                            </View>
                                            <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                {/* <TouchableOpacity onPress={() => { setThreedotclickdata(item.userid), setShowModal(true) }} style={[styles.rightButtonsView, { marginRight: 12, marginLeft: -10 }]}> */}
                                                <TouchableOpacity
                                                    onPress={() => {
                                                        // handleToggleView(item) 
                                                        setSelectedItemId(item[0].article_id)

                                                    }}

                                                    // setEditItemId(item.id);
                                                    // setEditModal({
                                                    //     active: true,
                                                    //     id: item.id,

                                                    // });
                                                    // setProfileModal({
                                                    //     active: true,
                                                    //     id_article: item[0].article_id,
                                                    //     category: item.category_id,
                                                    //     description: item.description
                                                    // })

                                                    // setSelectedId(item[0].article_id);
                                                    // setSelectedCategoryy(item.category_id);
                                                    // setdesc(item[0].description)

                                                    // setTile(item[0].title)

                                                    style={[styles.rightButtonsView, { marginRight: 0, marginLeft: -10, }]}
                                                >
                                                    <Image source={require('../../../assets/images/people-three-dots.png')} style={{ width: 20, height: 20 }} resizeMode='contain' />
                                                </TouchableOpacity>
                                                <View style={{ position: 'relative', }}>
                                                    {console.log(selectedItemId === item[0].article_id, 'hhhhhhhhbid check')}
                                                    {selectedItemId === item[0].article_id && (
                                                        <View
                                                            style={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                right: 25,
                                                                width: 100,
                                                                height: 90,
                                                                backgroundColor: 'white',
                                                                zIndex: -999,
                                                                borderRadius: 5,
                                                                borderColor: '#D9D9D9',
                                                                borderWidth: 1,

                                                            }}
                                                            onTouchEnd={() => setSelectedItemId(null)}
                                                        >
                                                            {/* View content */}
                                                            <TouchableOpacity style={{}}>
                                                                <TouchableOpacity onPress={() => { setSelectedItemId(null), props.navigation.navigate('CookingEditArticle', { id: item[0].article_id, cat: item.category_id, desc: item[0].description, title: item[0].title, category: item[0].category_data }) }}>
                                                                    <Text

                                                                        style={{
                                                                            fontWeight: '500',
                                                                            marginLeft: 15, marginTop: 10, color: 'black', fontSize: 12
                                                                        }}
                                                                    >Edit</Text>
                                                                </TouchableOpacity>
                                                                <View style={{ width: '100%', height: 1, backgroundColor: '#E0E0E0', marginTop: 4 }} />
                                                                <TouchableOpacity onPress={() => { setSelectedItemId(null), Delete(item[0].article_id) }} style={{ marginTop: 2 }}>
                                                                    <Text

                                                                        style={{ fontWeight: '500', color: 'black', fontSize: 12, marginLeft: 15, marginTop: 4 }}
                                                                    >Delete</Text>
                                                                </TouchableOpacity>
                                                                <View style={{ width: '100%', height: 1, backgroundColor: '#E0E0E0', marginTop: 4 }} />
                                                                <TouchableOpacity onPress={() => { setSelectedItemId(null) }} style={{ marginTop: 2 }}>
                                                                    <Text

                                                                        style={{ fontWeight: '500', color: 'black', fontSize: 12, marginLeft: 15, marginTop: 4 }}
                                                                    >Close</Text>
                                                                </TouchableOpacity>
                                                            </TouchableOpacity>
                                                        </View>
                                                    )}

                                                    {/* Trigger the view */}
                                                    <TouchableOpacity >
                                                        {/* Render the desired component (e.g., an image) */}
                                                    </TouchableOpacity>
                                                </View>
                                            </View>

                                        </TouchableOpacity>

                                        <View style={{ width: dimensions.SCREEN_WIDTH, alignSelf: 'center', }}>
                                            <View style={{ justifyContent: 'flex-start', backgroundColor: 'white' }}>
                                                <View style={styles.scrollViewContent}>
                                                    {console.log(item, 'my filter function for rrr')
                                                    }
                                                    <View style={styles.imageContainer} >
                                                        <View style={styles.imageView} onPress={() => { props.navigation.navigate('CookingPost', { id: item[0].article_id }) }}>
                                                            {console.log(image, 'image under flatList')}
                                                            <AppIntroSlider
                                                                data={item.filter(item => item.file_url !== null)}

                                                                renderItem={_renderItem}
                                                                // renderPagination={() => null}
                                                                renderDoneButton={() => <View />}
                                                                renderNextButton={() => <View />}
                                                                activeDotStyle={{ backgroundColor: '#ED1C24', height: 4, width: 18, borderRadius: 0, top: 20 }}
                                                                dotStyle={{ backgroundColor: '#fff', height: 4, width: 18, borderRadius: 0, top: 20 }}
                                                                keyExtractor={(item) => item.id}
                                                            />
                                                            {/* // <Image
                                                                //     source={{ uri: image?.file_url }}
                                                                //     style={styles.image}
                                                                //     resizeMode='stretch'
                                                                // /> */}

                                                        </View>
                                                    </View>
                                                </View>
                                            </View>
                                        </View>

                                        <TouchableOpacity style={styles.flatlistMainBottomView} onPress={() => { props.navigation.navigate('CookingPost', { id: item[0].article_id }) }}>

                                            <View style={styles.flatlistBottomView}>

                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                    <View style={{ marginRight: 10 }}>
                                                    </View>
                                                </View>
                                            </View>
                                            {
                                                <View>
                                                    <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center', marginTop: 10 }} onPress={() => {
                                                        props.navigation.navigate('LikedUserList', { postid: item.id })
                                                    }}>
                                                        <View style={styles.textContainerrrr}>
                                                            <Text style={{
                                                                fontSize: 16,
                                                                fontWeight: 'bold',
                                                                color: '#263238',
                                                                width: '60%', marginBottom: 10, marginTop: -12
                                                            }}>{item[0].title}</Text>
                                                            <Text style={{
                                                                fontSize: 14,
                                                                fontWeight: '500',
                                                                color: '#ED1C24',
                                                                textAlign: 'right', marginBottom: 10, marginTop: -12
                                                            }}>{item[0].category_name}</Text>
                                                        </View>
                                                    </TouchableOpacity>
                                                    <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                                                        < View style={styles.buttonsContainer} >
                                                            <TouchableOpacity style={styles.buttonView}>
                                                                <Image
                                                                    source={require('../../../assets/images/fashion-dark-like-button.png')}
                                                                    style={styles.buttonIcon}
                                                                />
                                                                <Text style={styles.buttonText}>{item[0].likes} Likes</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={styles.buttonView}>
                                                                <Image
                                                                    source={require('../../../assets/images/fashion-dark-dislike-button.png')}
                                                                    style={styles.buttonIcon}
                                                                />
                                                                <Text style={styles.buttonText}>{item[0].dislike} Dislikes</Text>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity style={styles.buttonView}>
                                                                <Image
                                                                    source={require('../../../assets/People/commentPostPeople.png')}
                                                                    style={styles.buttonIcon}
                                                                />
                                                                <Text style={styles.buttonText}>{item[0].comment} Comments</Text>
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                </View>

                                            }
                                        </TouchableOpacity>
                                    </View>
                                )
                            }}
                            keyExtractor={item => item.id}
                        />)}
                    </View>
                </View >
            </ScrollView >
            <Modal
                isVisible={editModal}
                swipeDirection="down"
                selectedId={selectedId}
                selectedCategoryy={selectedCategoryy}
                title={title}
                desc={desc}
                onBackdropPress={() => setEditModal(false)}
                onSwipeComplete={e => {
                    setEditModal(false);
                }}
                scrollTo={() => { }}
                scrollOffset={1}
                propagateSwipe={true}
                coverScreen={false}
                backdropColor="transparent"
                style={{
                    justifyContent: 'flex-end',
                    margin: 0,
                    backgroundColor: 'rgba(211, 211, 211, 0.7)',
                }}>
                <View
                    style={{
                        height: '35%',
                        backgroundColor: '#FFF',
                        borderTopLeftRadius: 30,
                        borderTopRightRadius: 30,
                        paddingVertical: 20,
                    }}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}>
                        <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                            <View style={{ backgroundColor: '#F8F8F8', paddingHorizontal: 10, paddingVertical: 20, borderRadius: 10 }}>
                                <TouchableOpacity style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                                    console.log('my id111', title)
                                    props.navigation.navigate('EditArticle', { id: selectedId, cat: selectedCategoryy, desc: desc, title: title }), setEditModal(false)


                                }}>
                                    {/* <Image source={require('../../../assets/images/people-bookmark.png')} style={{width:20, height:20}} resizeMode='contain'/> */}

                                    <Text style={{ fontSize: 14, color: 'black', }}>Edit Article</Text>

                                </TouchableOpacity>


                            </View>

                            <View style={{
                                backgroundColor: '#F8F8F8', paddingHorizontal: 10, paddingVertical: 20, borderRadius: 10, marginTop: 20
                            }}>
                                <TouchableOpacity style={{ marginHorizontal: 20, flexDirection: 'row', alignItems: 'center' }} onPress={() => {

                                }}>
                                    {/* <Image source={require('../../../assets/images/people-bookmark.png')} style={{width:20, height:20}} resizeMode='contain'/> */}

                                    <Text style={{ fontSize: 14, color: 'black', }}>Delete Article</Text>

                                </TouchableOpacity>


                            </View>
                        </View>

                        <View style={{ width: 100, height: 100 }} />
                    </ScrollView>
                </View >
            </Modal >

            {/* <Modal
                isVisible={modlevisual5}
                swipeDirection="down"
                onSwipeComplete={(e) => {
                    setmodlevisual5(false)
                }}
                scrollTo={() => { }}
                onBackdropPress={() => setmodlevisual5(false)}
                scrollOffset={1}
                propagateSwipe={true}
                coverScreen={false}
                backdropColor='transparent'
                style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <View style={{ height: '80%', backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 20 }}>
                    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

                        <Text style={{ color: Mycolors.Black, fontWeight: '500', fontSize: 22, textAlign: 'center' }} >Pick from a wide range of categories</Text>

                        <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
                            <FlatList
                                data={categoryData}
                                // horizontal={true}
                                // showsHorizontalScrollIndicator={false}
                                // numColumns={2}
                                renderItem={({ item, index }) => {
                                    return (
                                        <TouchableOpacity
                                            style={[{
                                                width: '96%', marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginBottom: 20,
                                                overflow: 'hidden',
                                                // borderWidth:1, borderColor:'black'
                                                shadowColor: '#E0E0E0',
                                                shadowOffset: {
                                                    width: 0,
                                                    height: 3
                                                },
                                                shadowRadius: 5,
                                                shadowOpacity: 0.6,
                                                elevation: 3,
                                            }, selectedCategory?.name === item?.name ? styles.categorySelectedStyle : null]}
                                            onPress={() => {
                                                setSelectedCategory(item);

                                                HomePage2(item)

                                                setmodlevisual5(false)
                                            }}
                                        >
                                            <Image source={{ uri: item.category_image }} style={{ width: '20%', height: 60, borderRadius: 7 }} resizeMode='stretch' ></Image>
                                            <View style={{ justifyContent: 'center', alignItems: 'center', width: "60%" }}>
                                                <Text style={{ fontSize: 14, color: (selectedCategory?.category_id === item?.category_id) ? '#835E23' : Mycolors.Black, marginTop: 5, textAlign: 'center', fontWeight: 'bold' }}>{item?.name}</Text>
                                            </View>
                                        </TouchableOpacity>
                                        // <View style={{ width: 100, marginHorizontal: 5 }}>
                                        //   <TouchableOpacity style={{ width: 100, height: 80, backgroundColor: '#F8F8F8', alignSelf: 'center' }}
                                        //     onPress={() => { setSelectedCategory(item) }}>
                                        //     <Image source={{ uri: item.category_image }} style={{ width: "100%", height: "100%", alignSelf: 'center', borderRadius: 7 }}></Image>
                                        //   </TouchableOpacity>
                                        //   <View style={{}}>
                                        //     <Text style={{ fontSize: 11, color: (selectedCategory?.category_id === item?.category_id) ? '#835E23' : Mycolors.Black, marginTop: 5, textAlign: 'center', fontWeight: 'bold' }}>{item?.category_name}</Text>
                                        //   </View>
                                        // </View>
                                    )
                                }}
                            // keyExtractor={item => item.id}
                            />
                        </View>


                        <View style={{ width: 100, height: 100 }} />
                    </ScrollView>

                </View >
            </Modal > */}
            <Modal

                isVisible={modlevisual}
                swipeDirection="down"
                onSwipeComplete={() => setmodlevisual(false)}
                coverScreen={false}
                backdropColor="transparent"
                style={{ justifyContent: 'flex-end', margin: 0 }}
            >
                <View style={{ height: 150, backgroundColor: Mycolors.BG_COLOR, borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20, margin: 0, bottom: 0 }}>
                    <View style={styles.mainView}>
                        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
                            <TouchableOpacity style={{ width: 150, height: 150 }} onPress={onGallery}>
                                <Image source={require('../../../assets/Art/GalleryCreation.png')} style={{ width: 40, height: 40, alignSelf: 'center' }} />
                                <Text style={{ textAlign: 'center', color: Mycolors.TEXT_COLOR }}>Open Library</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={{ width: 150, height: 150 }} onPress={onCamera}>
                                <Image source={require('../../../assets/Art/cameraCreation.png')} style={{ width: 40, height: 35, alignSelf: 'center' }} />
                                <Text style={{ textAlign: 'center', color: Mycolors.TEXT_COLOR }}>Open Camera</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </Modal>
            {/* edit modal */}

            {/* modify edit modal */}
            < Modal
                isVisible={profileModal}
                // swipeDirection="down"

                // onSwipeComplete={e => {
                //   setProfileModal(false);
                // }}
                swipeDirection="down"
                onBackdropPress={() => setProfileModal(false)}
                onSwipeComplete={(e) => {
                    setProfileModal(false)
                }}
                scrollTo={() => { }}
                scrollOffset={1}
                propagateSwipe={true}
                coverScreen={false}
                backdropColor='transparent'

                style={{
                    justifyContent: 'flex-start', // Update justifyContent to 'flex-start'
                    margin: 0,
                    height: 30,
                    backgroundColor: 'transparent',
                }}>
                <View
                    style={{
                        height: '15%',
                        backgroundColor: '#FFF',
                        marginTop: '24%',
                        width: '70%',
                        alignSelf: 'flex-end',
                        justifyContent: 'flex-end',
                        right: 20,
                        borderRadius: 20
                    }}>

                    <ScrollView
                        showsVerticalScrollIndicator={false}
                        nestedScrollEnabled={true}>
                        <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>
                            {/* <View>
                <TouchableOpacity onPress={() => { setProfileModal(false) }} style={{ alignSelf: 'flex-end', width: 30, height: 25, marginTop: 9 }}>
                  <Image source={require('../../../assets/People/ModelClode.png')} style={{ alignSelf: 'flex-end' }}></Image></TouchableOpacity>
              </View> */}
                            <View style={{ borderRadius: 10, }}>


                                <TouchableOpacity style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                                    props.navigation.navigate('EditArticle', { id: selectedId, cat: selectedCategoryy, desc: desc, title: title }), setProfileModal(false)

                                }}>
                                    <Image source={require('../../../assets/People/PeopleProfileIConModal.png')} style={{ width: 34, height: 34 }} resizeMode='contain' />
                                    <Text style={{ marginLeft: 4, fontSize: 14, left: 10, color: 'black' }}>Edit Artile</Text>
                                </TouchableOpacity>
                            </View >
                            <View style={{ backgroundColor: '#EDEEEE', height: 1, width: '100%', marginTop: 5 }}>

                            </View>
                            <View style={{ marginTop: 10 }}>
                                <TouchableOpacity style={{ marginHorizontal: 10, flexDirection: 'row', alignItems: 'center' }} onPress={() => {
                                    Delete(selectedId)
                                        , setProfileModal(false)
                                }} >
                                    <Image source={require('../../../assets/People/PeopleLogoutIconModal.png')} style={{ width: 34, height: 34 }} resizeMode='contain' />

                                    <Text style={{ fontSize: 14, left: 14, color: 'black' }}>Delete Article</Text>
                                </TouchableOpacity>


                            </View>


                        </View>

                        <View style={{ width: 100, height: 100 }} />
                    </ScrollView>
                </View>
            </Modal >


            {loading || loading2 ? <Loader /> : null}

        </SafeAreaView >
    );
}
const styles = StyleSheet.create({
    unselectedTabText: {
        fontSize: 14,
        fontWeight: '500',
        color: '#263238'
    },
    requestCallView: {
        marginTop: 10,
        width: 140,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#29913C',
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#6D2F91',
        shadowOffset: { width: 3, height: 3 },
        shadowRadius: 5,
        shadowOpacity: 0.17,
        elevation: 2
    },
    VideoThumbWrapper: {
        position: 'relative',
        // width: '48%',
        // marginRight: 8,
        marginBottom: 4,

        width: dimensions.SCREEN_WIDTH / 1.5,
        height: 160,
        marginRight: 20,
        borderRadius: 15,
        // shadowColor:'#000',
        // shadowOffset: {width: 0,height: 3},
        // shadowRadius: 1,
        // shadowOpacity: 0.03,
        // elevation: 1,
    },
    PlayIconContainer: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1,
    },
    PlayIconWrapper: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    BackGroundImage: {
        width: '100%',
        height: 160,
        justifyContent: 'center',
        borderRadius: 15
    },
    buttonsRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
        // backgroundColor: 'red',
        width: '50%',
        alignSelf: 'center'
    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    buttonText: {
        fontSize: 10,
        fontWeight: '500',
        color: '#8F93A0',
        marginLeft: 5
    },
    reasonView: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 15,
        // paddingVertical:10,
        paddingHorizontal: 10,
        width: '90%',
        height: 60,
    },
    selectedReasonView: {
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#fff',
        marginBottom: 15,
        // paddingVertical:10,
        paddingHorizontal: 10,
        width: '90%',
        height: 60,
        borderColor: '#E7F7FF',
        borderWidth: 1,
        shadowColor: '#455A64',
        shadowOffset: { width: 3, height: 3 },
        shadowRadius: 5,
        shadowOpacity: 0.10,
        elevation: 1
    },
    reportButtonView: {
        height: 60,
        width: '90%',
        alignSelf: 'center',
        backgroundColor: '#0089CF',
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 5,
        marginBottom: 30,
        shadowColor: '#000',
        shadowOffset: { width: 3, height: 3 },
        shadowRadius: 5,
        shadowOpacity: 0.10,
        elevation: 2
    },
    contMap: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: '20%',
        alignSelf: 'center',
        marginHorizontal: 20
    },
    categorySelectedStyle: {
        borderWidth: 2,
        borderColor: '#835E23',
        borderRadius: 10
    },
    refreshView: {
        flexDirection: 'row',
        alignItems: 'center',
        // width: '25%',
        // marginTop: 10,
        marginRight: 10,
        backgroundColor: '#29913C',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 50
    },
    descriptionView: {

        paddingTop: 10,
        width: dimensions.SCREEN_WIDTH * 0.9,
        alignSelf: 'center',
        paddingHorizontal: 10,
        paddingBottom: 20,
        borderRadius: 15,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },

        shadowRadius: 5,
        shadowOpacity: 0.03,
        elevation: 1,
    },
    imageRowView: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    followingView: {
        paddingHorizontal: 20,
        paddingVertical: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        shadowColor: '#0089CF',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 5,
    },
    numView: {
        alignItems: 'center',
        width: 90,
        height: 90,
        justifyContent: 'center',
        borderRadius: 15,
        paddingHorizontal: 10,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.03,
        elevation: 1,
    },
    numValue: {
        fontSize: 20,
        fontWeight: '500',
        color: '#455A64'
    },
    numText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#455A64'
    },
    blueButtonView: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#0089CF',
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 20,
        shadowColor: '#0089CF',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 1,
    },
    blueButtonSuperView: {
        justifyContent: 'center',
        backgroundColor: '#0089CF',
        width: 120,
        height: 40,
        borderRadius: 20,
        shadowColor: '#0089CF',
        shadowOffset: {
            width: 0,
            height: 3
        },
        shadowRadius: 5,
        shadowOpacity: 0.1,
        elevation: 1,
    },
    blueButtonSubView: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 10,
        justifyContent: 'center',
        flexDirection: 'row'
    },
    blueButtonText: {
        fontSize: 14,
        fontWeight: '400',
        color: '#fff',
        marginLeft: 10
    },
    allFiltersRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 20,
        paddingHorizontal: 20
    },
    filter1View: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-start'
    },
    filter2View: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'center'
    },
    filter3View: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'flex-end'
    },
    threeDotsView: {
        backgroundColor: '#ED1C24',
        padding: 10,
        borderRadius: 20, right: 12,
        width: 103, height: 31
    },
    imageView: {
        width: dimensions.SCREEN_WIDTH,
        height: 200,
        backgroundColor: '#F8F8F8',
    },
    scrollViewContent: {
        alignItems: 'center',
        flex: 1
    },
    image: {
        width: dimensions.SCREEN_WIDTH * 1,
        height: '99%',
        alignSelf: 'center',

        justifyContent: 'center',


    },
    imageContainer: {
        marginRight: 10, // Add margin between images
    },
    textContainer: {
        marginTop: 5, // Add margin between image and text

        flex: 1, // Allow the text container to take up remaining space
        flexDirection: 'row'
    },
    descriptionText: {
        fontSize: 16,
        fontWeight: '500',
        color: '#263238',
        textAlign: 'left',
    },
    buttonsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 0, // Add margin between text and buttons
        // Align buttons with the text,


    },
    buttonView: {
        flexDirection: 'row',
        alignItems: 'center',
        marginRight: 20, // Add margin between buttons

    },
    buttonIcon: {
        height: 20,
        width: 20,
    },
    buttonText: {
        marginLeft: 5, // Add spacing between icon and text
        fontSize: 14,
        color: '#263238',
    },
    topRightImage: {
        position: 'absolute',
        top: 10, // Adjust the top position as needed
        right: 10, // Adjust the right position as needed
        width: 30,
        height: 30,
        resizeMode: 'contain',
        //  backgroundColor: 'red'

    }, topRightImageContainer: {
        position: 'absolute',
        top: 30, // Adjust the top position as needed
        right: 30, // Adjust the right position as needed
        zIndex: 999,
        backgroundColor: 'transparent'
    },
    flatlistMainView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
        paddingHorizontal: 15,
        paddingVertical: 10,
        width: dimensions.SCREEN_WIDTH * 0.9,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        borderBottomWidth: 1,
        borderLeftColor: '#EDEEEE',
        borderRightColor: '#EDEEEE',
        borderBottomColor: '#EDEEEE',
        zIndex: 999,


    },
    followingImageView: {
        flexDirection: 'row',
        alignItems: 'center',

    },
    followingView: {
        justifyContent: 'center',
        marginLeft: 10
    },
    flatlistMainBottomView: {
        backgroundColor: '#fff',
        paddingVertical: 15,
        paddingHorizontal: 20,
        width: dimensions.SCREEN_WIDTH * 0.9,
        borderBottomRightRadius: 20,
        borderBottomLeftRadius: 20,
        borderLeftWidth: 1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderLeftColor: '#EAEBEB',
        borderRightColor: '#EAEBEB',
        borderBottomColor: '#EAEBEB',


    },
    flatlistBottomView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        //  marginBottom: 12
    },
    textContainerrrr: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%'

    },
    descriptionTextrrrr: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#263238',
        width: '60%'
    },
    createdTimeText: {
        fontSize: 12,
        fontWeight: '500',
        color: '#263238',
        textAlign: 'right',
    },

});
export default CookingProfile