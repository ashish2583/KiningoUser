import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, Keyboard, Platform } from 'react-native';
import HomeHeaderRoundBottom from '../../../component/HomeHeaderRoundBottom';
import SearchInput2 from '../../../component/SearchInput2';
import SearchInputEnt from '../../../component/SearchInputEnt';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message'
import LinearGradient from 'react-native-linear-gradient'
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import VideoPlayer from 'react-native-video-player'
import { PermissionsAndroid } from 'react-native';
import Loader from '../../../WebApi/Loader';
import { baseUrl, shop_eat_cart, user_payment_method, shop_eat_orders, shop_eat_cart_book_dining, shop_eat_cart_book_table, shop_eat_cart_id, shop_eat_business_id, shop_eat_menu_userid, requestPostApi, requestGetApi, shop_eat, connect_people_create_post } from '../../../WebApi/Service'
import { useSelector, useDispatch } from 'react-redux';

const image1 = require('../../../assets/images/people-following-person.png')

const PeopleCreatePost = (props) => {
  const User = useSelector(state => state.user.user_details)
  const [searchValue, setsearchValue] = useState('')
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const myTextInput = useRef()
  const [userMessage, setUserMessage] = useState('')
  const [multiSliderValue, setMultiSliderValue] = useState([0, 100])
  const [showChooseMilesModal, setShowChooseMilesModal] = useState(false)
  const [pick, setpick] = useState('')
  const [capturedVideo, setcapturedVideo] = useState('')
  const [filepath, setfilepath] = useState(null)
  const [pick1, setpick1] = useState('')
  const [filepath1, setfilepath1] = useState(null)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [loading, setLoading] = useState(false);
  const [descrbe, setdescrbe] = useState('');
  useEffect(() => {

  }, [])


  const openLibrary = async () => {

    let options = {
      // title: 'Video Picker', 
      mediaType: 'mixed',
      // storageOptions:{
      //   skipBackup:true,
      //   path:'images'
      // }
      durationLimit: 30,
      title: 'Select Image/Video',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option'
        },
      ],
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    launchImageLibrary(options, (image) => {
      if (!image.didCancel) {
        console.log('the ddd==', image.assets[0].uri)
        var photo = {
          uri: image.assets[0].uri,
          type: image.assets[0].type,
          name: image.assets[0].fileName 
        };
        console.log("image", photo);
        setpick(photo)
        setfilepath(image)
      }
    })


  }
  const requestCameraPermission = async () => {
    if (Platform.OS === 'ios') {
      opencamera();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.CAMERA,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to access camera',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          opencamera();
          console.log('Storage Permission Granted.');
        } else {
          Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('ERROR' + err);
      }
    }
  };
  const opencamera = async () => {
    let options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option'
        },
      ],
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };

    // let options = {
    //   title: 'Select Image',
    //   customButtons: [
    //     {
    //       name: 'customOptionKey',
    //       title: 'Choose Photo from Custom Option'
    //     },
    //   ],
    //   mediaType:'video',
    //   maxWidth: 500,
    //   maxHeight: 500,
    //   storageOptions: {
    //     skipBackup: true,
    //     path: 'images',
    //   },
    // };

    launchCamera(options, (image) => {
      if (!image.didCancel) {
        console.log('the ddd==', image)
        var photo = {
          uri: image.assets[0].uri,
          type: image.assets[0].type,
          name: image.assets[0].fileName 
        };
        console.log("imageCamera", photo);
        setpick(photo)
        setfilepath(image)
      }

    })

  }

  const Createpost = async () => {

    console.log("pick UPLOAD", pick);
    if (pick == '' || descrbe == '') {
      Alert.alert('please selected required field')
    } else {
      let formdata = new FormData();
      formdata.append('post_description', descrbe);
      formdata.append('file', pick);
      setLoading(true);
      console.log("data.......", formdata);
      const { responseJson, err } = await requestPostApi(connect_people_create_post, formdata, 'POST', User.token)
      setLoading(false)
      console.log('the Createpost==>>', responseJson)
      if (responseJson.headers.success == 1) {
      props.navigation.goBack('')
        Toast.show({ text1: responseJson.headers.message });
      } else {

        setalert_sms(err)
        setMy_Alert(true)
      }
    }

  }

  return (
    <SafeAreaView scrollEnabled={scrollEnabled} style={{ backgroundColor: '#F8F8F8' }}>
      <ScrollView>
        <HomeHeaderRoundBottom height={80} paddingHorizontal={15} backgroundColor='#fff'
          press1={() => { props.navigation.goBack() }} img1={require('../../../assets/images/events_arrow.png')} img1width={25} img1height={20}
          press2={() => { }} title2={'Create Post'} fontWeight={'500'} img2height={20} color='#455A64'
          press3={() => { }} img3width={25} img3height={25} borderBottomLeftRadius={25} borderBottomRightRadius={25} />
        <View style={{ width: '90%', alignSelf: 'center', marginTop: 20 }}>



          <View style={{ width: '100%', alignSelf: 'center', marginTop: 20, backgroundColor: '#F8F8F8' }}>

            <View style={styles.rowWithImageView}>

              <View style={{ flexDirection: 'row', alignItems: 'center', }}>
                <Image source={image1} />
                <Text style={{ fontSize: 14, fontWeight: '600', color: '#455A64', marginLeft: 10 }}>Aayav Nadkarni</Text>
              </View>

              <TouchableOpacity onPress={() => { props.navigation.navigate('PeopleProfileScreen') }} style={styles.eyeView}>
                <Image source={require('../../../assets/images/people-eye-image.png')} />
                <Text style={{ fontSize: 14, fontWeight: '400', color: '#fff', marginLeft: 10 }}>View Profile</Text>
              </TouchableOpacity>
            </View>

            <View style={{ marginTop: 10, marginBottom: 20 }}>
              <TextInput
                //  value={reson}
                onChangeText={(e) => setdescrbe(e)}
                placeholder={`What's on your mind`}
                placeholderTextColor="#bbbbbb"
                multiline={true}
                textAlignVertical='top'
                // maxLength={500}
                // keyboardType="number-pad"
                autoCapitalize='none'
                style={[styles.input]}
              />
            </View>

            <LinearGradient
              colors={['rgba(255, 255, 255, 1)', 'rgba(249, 249, 249, 1)']}
              style={styles.uploadImageView}>
              <TouchableOpacity onPress={() => { openLibrary() }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={styles.imageView}>
                  <Image source={require('../../../assets/images/people-upload-photo-video.png')} />
                </View>
                <Text style={styles.imageText}>Photo/Video</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { openLibrary() }}>
                <Image source={require('../../../assets/images/people-right-arrow.png')} />
              </TouchableOpacity>

            </LinearGradient>
            <Image style={{ height: 80, width: 80 }} source={{ uri: pick.uri }} />
            <LinearGradient
              colors={['rgba(255, 255, 255, 1)', 'rgba(249, 249, 249, 1)']}
              style={[styles.uploadImageView, { marginTop: 10 }]}>
              <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }} onPress={() => { requestCameraPermission() }}>
                <View style={styles.imageView}>
                  <Image source={require('../../../assets/images/people-camera-image.png')} />
                </View>
                <Text style={styles.imageText}>Camera</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => { requestCameraPermission() }}>
                <Image source={require('../../../assets/images/people-right-arrow.png')} />
              </TouchableOpacity>
            </LinearGradient>

          </View>






        </View>
        <View style={{ height: 100 }} />
        <View style={{ width: '90%', height: 60, flexDirection: 'row', justifyContent: 'space-between', bottom: 60, alignSelf: 'center', zIndex: 999 }}>
          <MyButtons title="Post" height={50} width={'100%'} borderRadius={5} press={() => { Createpost() }} fontSize={13}
            titlecolor={Mycolors.BG_COLOR} marginVertical={0} backgroundColor={'#0089CF'} />

        </View>
      </ScrollView>

      {loading ?
        <Loader />
        : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  searchView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    height: 50,
  },
  searchLeftSubView: {
    width: '83%',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingVertical: 5,
    paddingLeft: 10,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 5,
  },
  rowWithImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  eyeView: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#0089CF',
    borderRadius: 20,
    paddingVertical: 10,
    paddingHorizontal: 12,
  },
  input: {
    paddingLeft: 15,
    width: '100%',
    fontSize: 14,
    backgroundColor: '#fff',
    height: 200,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: Mycolors.Black,
    borderRadius: 10,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  uploadImageView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 0.03,
    elevation: 1,
  },
  imageView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    padding: 10,
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  imageText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#455A64',
    marginLeft: 10
  }
});
export default PeopleCreatePost 