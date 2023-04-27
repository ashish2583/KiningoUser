import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SearchInputEnt from '../../../component/SearchInputEnt';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Modal from 'react-native-modal';
// import Toast from 'react-native-simple-toast'
import Toast from 'react-native-toast-message'
import Loader from '../../../WebApi/Loader';
import { baseUrl, login, shop_eat_business, requestPostApi, requestGetApi, shop_product_business, shop_product_home } from '../../../WebApi/Service'
import GetLocation from 'react-native-get-location'
import MyAlert from '../../../component/MyAlert'
import { useSelector, useDispatch } from 'react-redux';
import { saveUserResult, saveUserToken, setUserType, onLogoutUser } from '../../../redux/actions/user_action';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import Geocoder from "react-native-geocoding";
import { GoogleApiKey } from '../../../WebApi/GoogleApiKey';
import { setRestorentLocation } from '../../../redux/actions/latLongAction';
import AntDesign from 'react-native-vector-icons/AntDesign';
import AsyncStorage from '@react-native-async-storage/async-storage';

Geocoder.init(GoogleApiKey);
const GOOGLE_MAPS_APIKEY = GoogleApiKey;
const isEmulator = false
let lat = null
let lan = null
console.log("ShopProductShopProductShopProduct......");
const ShopProduct = (props) => {
  const dispatch = useDispatch();
  const [searchValue, setsearchValue] = useState('')
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const myTextInput = useRef()
  const [multiSliderValue, setMultiSliderValue] = useState([0, 100])
  const [showChooseMilesModal, setShowChooseMilesModal] = useState(false)
  const [upData, setupData] = useState([
    {
      id: '1',
      title: 'Hair Cut',
      desc: '',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '2',
      title: 'Shaving',
      desc: '',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '3',
      title: 'Facial',
      desc: '',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '4',
      title: 'Hair Color',
      desc: '',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '5',
      title: 'Hair wash',
      desc: '',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '6',
      title: 'Beard style',
      desc: '',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '7',
      title: 'Facial',
      desc: '',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
  ])
  const multiSliderValuesChange = (values) => { setMultiSliderValue(values) }
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState(null)
  // const [lat, setlat] = useState(null)
  // const [lan, setlan] = useState(null)
  // const [isLatlong, setIsLatlong] = useState(true)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [My_Alert2, setMy_Alert2] = useState(false)
  const [alert_sms2, setalert_sms2] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  const [addre, setaddre] = useState(' ');
  const [googleAddress, setGoogleAddress] = useState('');
  const [googleLatLng, setGoogleLatLng] = useState({});

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log('locations latitude longitude', location);
        // setlat(location.latitude)
        // setlan(location.longitude)
        lat = location?.latitude
        lan = location?.longitude
        let My_cord = ''
        My_cord = { latitude: location?.latitude, longitude: location?.longitude }
        dispatch(setRestorentLocation(My_cord))
        homePage(location?.latitude, location?.longitude)
        LatlongTo_address(My_cord)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
        if (code === 'UNAVAILABLE') {
          // Toast.show({ text1: 'Please turn on your location to see results' })
          setalert_sms('To see results, either turn on your location or search any location')
          setMy_Alert(true)
        }
      })
  }, [])

  const checkcon = () => {
    console.log('locations latitude longitude2', lat, lan);
    if (lat !== null && lan !== null) {
      homePage(lat, lan)
    } else {
      GetLocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 15000,
      })
        .then(location => {
          console.log('locations latitude longitude', location);
          // setlat(location.latitude)
          // setlan(location.longitude)
          lat = location?.latitude
          lan = location?.longitude
          let My_cord = ''
          My_cord = { latitude: location?.latitude, longitude: location?.longitude }
          dispatch(setRestorentLocation(My_cord))
          homePage(location?.latitude, location?.longitude)
          LatlongTo_address(My_cord)
        })
        .catch(error => {
          const { code, message } = error;
          console.warn(code, message);
          if (code === 'UNAVAILABLE') {
            // Toast.show({ text1: 'Please turn on your location to see results' })
            setalert_sms('To see results, either turn on your location or search any location')
            setMy_Alert(true)
          }
        })
    }
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    // setRefreshing(true);
    // fetchSuccessDetails()
    checkcon()
    wait(2000).then(() => {

      setRefreshing(false)

    });
  }, []);

  const LatlongTo_address = async (latlong) => {
    console.log('LatlongTo_address called');
    // var courentlocation = mapdata.curentPosition
    // dispatch(setStartPosition(courentlocation))
    let ll = ''
    ll = latlong
    console.log('ll', ll);
    Geocoder.from(ll.latitude, ll.longitude)
      .then(json => {
        var addressComponent = json.results[0].formatted_address;
        console.log('The address is', json.results[0].formatted_address);
        setaddre(addressComponent)
        // setGoogleLatLng({
        //   lat: latlong.latitude,
        //   lng: latlong.longitude,
        //   });
        // setGoogleAddress(addressComponent);
        // UpdateLocation(latlong,addressComponent)
      })
      .catch(error => console.warn(error));
  }

  const homePage = async (l, lo) => {
    if (l == null && lo == null) {
      // Toast.show({ text1: 'Please turn on your location to see results' })
      setalert_sms('To see results, either turn on your location or search any location')
      setMy_Alert(true)
      return
    }
    // const endPoint = isLatlong ? `${shop_product_business}?lat=${lat}&long=${lan}` : `${shop_product_business}?name=Nile`
    let endPoint = ''
    console.log('l, lo', l, lo);
    // if (isEmulator) {
    //   endPoint = `${shop_product_home}?lat=${28.6176}&long=${77.422}`
    // } else {
    //   endPoint = `${shop_product_home}?lat=${l}&long=${lo}`
    // }
    endPoint = `${shop_product_home}?lat=${l}&long=${lo}`
    console.log('homepage endPoint', endPoint);
    setLoading(true)
    const { responseJson, err } = await requestGetApi(endPoint, '', 'GET', '')
    setLoading(false)
    console.log('the res==>>Home', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        console.log('the res==>>Home.body.vendors', responseJson.body)
        setresData(responseJson.body)
      } else {
        Toast.show({ text1: responseJson.headers.message })
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }

  }

  const handleNavigate = (latitude, longitude) => {

  }
  function renderDescription(rowData) {
    const title = rowData.structured_formatting.main_text;
    const address = rowData.structured_formatting.secondary_text;
    // console.log('renderDescription', address);
    return (
      <View style={{ minHeight: 200 }}>
        <Text style={{ color: 'gray' }}>
          {title}
        </Text>
        <Text style={{ color: 'gray' }}>
          {address}
        </Text>
      </View>

    );
  }
  const logoutDriver = async () => {
    AsyncStorage.clear();
    dispatch(onLogoutUser())
  }

  return (
    <SafeAreaView scrollEnabled={scrollEnabled} style={{ height: '100%', backgroundColor: '#F8F8F8' }}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        keyboardShouldPersistTaps="handled"
      >
        <HomeHeader height={60} paddingHorizontal={15}
          press1={() => { props.navigation.goBack() }}
          // img1={require('../../../assets/arrow.png')} 
          img1width={18} img1height={15}
          press2={() => { }} title2={'Product'} fontWeight={'500'} img2height={20}
          // press3={() => { }} img3width={25} img3height={25} />
          press3={() => {
            // props.navigation.navigate('ShopEatNotificationList') 
            setalert_sms2('Are you sure want to logout?')
            setMy_Alert2(true)
            //   AsyncStorage.clear(); 
            // dispatch(onLogoutUser())
          }} img3width={20} img3height={20} img3={require('../../../assets/dating-logout-image.png')} />
        {/* <View style={{width:'95%',alignSelf:'center',backgroundColor:'rgba(0,0,0,0.025)',borderRadius:10,borderBottomColor:'rgba(0,0,0,0.5)',borderBottomWidth:0.2}}>
  <HomeHeader height={40}  paddingHorizontal={15}
   press1={()=>{}} img1={require('../../../assets/images/product_location_icon.png')} img1width={11} img1height={15} 
   press2={()=>{}} title2={'New Yark USA'} fontWeight={'500'} img2height={20} right={dimensions.SCREEN_WIDTH*26/100} fontSize={10} color={Mycolors.GrayColor}
   press3={()=>{setShowChooseMilesModal(true)}} img3={require('../../../assets/images/shape_32.png')} img3width={25} img3height={25} />
</View> */}
        <View style={{
          flexDirection: 'row',
          justifyContent: 'space-evenly',
          marginHorizontal: 10,
          // backgroundColor: 'rgba(0,0,0,0.025)',
          paddingHorizontal: 5,
          // paddingVertical: 5,
          // alignSelf: 'center',
          // alignItems: 'center',
          backgroundColor: '#fff',
          width: '94%',
          borderRadius: 10,
        }}>
          <TouchableOpacity style={{ justifyContent: 'center', position: 'absolute', height: 55, left: 15 }}>
            <Image source={require('../../../assets/shape_33.png')} style={{ width: 12, height: 15 }}></Image>
          </TouchableOpacity>
          <View style={{ width: '86%', justifyContent: 'center', alignItems: 'center', }}>
            <GooglePlacesAutocomplete
              placeholder={addre?.trim()?.length > 0 ? addre.substring(0, 45) : 'Search Address'}
              textInputProps={{
                placeholderTextColor: addre?.trim()?.length > 0 ? '#000' : 'gray',
                // width: '95%',
                // placeholderTextColor: Colors.BLACK,
                returnKeyType: 'search',
                // onFocus: () => setShowPlacesList(true),
                // onBlur: () => setShowPlacesList(false),
                multiline: true,
                numberOfLines: 3,
                // onTouchStart: ()=>{downButtonHandler()}
                height: 50,
                color: '#000'
                // shadowColor:  'gray',
                //   shadowOffset: {
                //     width:3,
                //     height:3
                //   },
                //   shadowRadius: 5,
                //   shadowOpacity: 1.0,
                //   justifyContent: 'center',
                //   elevation: 5
              }}
              enablePoweredByContainer={false}
              listViewDisplayed={'auto'}
              styles={{
                textInputContainer: {
                  width: '100%',
                  marginLeft: 0,
                  // backgroundColor: 'grey',
                },
                description: {
                  color: '#000',
                  width: '74%',
                  // fontWeight: '300'
                },
                poweredContainer: {
                  justifyContent: 'flex-end',
                  alignItems: 'center',
                  borderBottomRightRadius: 5,
                  borderBottomLeftRadius: 5,
                  borderColor: '#C8C7CC',
                  borderTopWidth: 0.5,
                  color: '#000'
                },
                powered: {},
                listView: {
                  // color:'#000'
                  borderWidth: 0.5,
                  borderColor: '#000',
                  // borderRadius:10,
                  overflow: 'hidden',
                  paddingBottom: 10,
                },
                row: {
                  // backgroundColor: '#FFFFFF',
                  paddingVertical: 10,
                  height: 50,
                  flexDirection: 'row',
                },
                separator: {
                  height: 0.5,
                  backgroundColor: '#C8C7CC',
                  color: '#000',
                  marginTop: 10
                },
                textInput: {
                  backgroundColor: 'transparent',
                  height: 40,
                  borderRadius: 5,
                  paddingVertical: 5,
                  paddingHorizontal: 10,
                  fontSize: 13,
                  color: '#000',
                  flex: 1,
                  // paddingHorizontal: 5,
                },
              }}
              onPress={(data, details = null) => {
                console.log(data, details);
                // 'details' is provided when fetchDetails = true
                // setShowPlacesList(false)
                homePage(details.geometry.location.lat, details.geometry.location.lng)
                dispatch(setRestorentLocation({
                  latitude: details.geometry.location.lat,
                  longitude: details.geometry.location.lng,
                }))

                setGoogleLatLng({
                  lat: details.geometry.location.lat,
                  lng: details.geometry.location.lng,
                });
                setGoogleAddress(data?.description);
              }}
              GooglePlacesDetailsQuery={{
                fields: 'geometry',
              }}
              fetchDetails={true}
              // currentLocation={true}
              query={{
                key: GOOGLE_MAPS_APIKEY,
                language: 'en',
              }}
              renderRow={rowData => {
                return (
                  <View>
                    {renderDescription(rowData)}
                  </View>
                )
              }}
            />
          </View>
          <View style={{
            height: 55, position: 'absolute', right: -10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            marginHorizontal: 8, top: 0,
            backgroundColor: '#835E23',
            paddingVertical: 5,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            borderTopRightRadius: 10, borderBottomRightRadius: 10
          }}>
            <TouchableOpacity onPress={() => { props.navigation.navigate('ShopEatFilter') }}>
              <Image source={require('../../../assets/product_filter.png')} style={{ width: 25, height: 25 }}></Image>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: '96%', alignSelf: 'center' }}>
          {/* <SearchInputEnt marginTop={10} placeholder={'Restaurant Name. Cuisine, Dishes'} 
serchValue={searchValue} 
searchIcon={require('../../../assets/images/product_search_icon.png')}
onChangeText={(e)=>{setsearchValue(e)}} 
press={()=>{Alert.alert('Hi')}}
presssearch={()=>{Alert.alert('Search Pressed')}}
paddingLeft={50}/> */}

          {/* <TouchableOpacity style={{ width: '98%', height: 50, borderRadius: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 10 }}
            onPress={() => { props.navigation.navigate('VendorSearch', { datas: resData.vendors, lat: lat, lan: lan, from: 'search' }) }}>
            <View style={{ padding: 5, marginLeft: 10 }}>
              <Image source={require('../../../assets/images/product_search_icon.png')} style={{ width: 20, height: 20 }}></Image>
            </View>
            <View style={{ padding: 5 }}>
              <Text style={{ color: 'gray', fontSize: 12 }}>Search by Vendors, Categories</Text>
            </View>
          </TouchableOpacity> */}

          <TouchableOpacity style={{ width: '98%', height: 50, borderRadius: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 10, justifyContent: "space-between" }}
            // onPress={() => { props.navigation.navigate('ShopSearch', { datas: [], from: 'search' }) }}
            onPress={() => { props.navigation.navigate('ShopProductSearch', { datas: [], from: 'search' }) }}
          >

            <View style={{ padding: 5 }}>
              <Text style={{ color: 'gray', fontSize: 12, left: 9 }}>Search by Vendors, Categories</Text>
            </View>
            <View style={{
              width: 40, height: 40, backgroundColor: '#835E23', justifyContent: 'center', shadowOffset: {
                width: 0,
                height: 3
              },
              shadowColor: '#F5F5F5',
              shadowRadius: 1,
              shadowOpacity: 0.3,
              justifyContent: 'center',
              alignItems: 'center',
              borderRadius: 10,
              elevation: 5,
              padding: 5,
            }}>
              <AntDesign name="search1" color={'#FFF'} size={24} />
              {/* <Image source={require('../../../assets/Search-red.png')} style={{ width: 45, height: 48, overflow: 'hidden', alignSelf: 'center', right: 3 }}></Image> */}
            </View>
          </TouchableOpacity>

          <View style={{ width: '100%', alignSelf: 'center', marginTop: 15 }}>
            {resData?.coupons?.length > 0 ?
              <FlatList
                data={resData.coupons}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ width: dimensions.SCREEN_WIDTH * 75 / 100, marginHorizontal: 5, borderRadius: 10, overflow:'hidden' }}>
                      <TouchableOpacity style={{ width: '100%', height: 120, backgroundColor: Mycolors.LogininputBox, alignSelf: 'center', alignSelf: 'center', }}
                        onPress={() => { props.navigation.navigate('ShopProductSearch', { datas: [], from: '' }) }}>
                        <Image resizeMode='stretch' source={{ uri: item.image }} style={{ width: '100%', height: '100%', alignSelf: 'center', }}></Image>
                      </TouchableOpacity>
                    </View>
                  )
                }}
                keyExtractor={item => item.id}
              />
              :
              <Text style={{ color: '#835E23', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>No Coupons Found</Text>
            }
          </View>

          {/* <View style={{height:140,borderRadius:10,overflow:'hidden',marginVertical:10,width:'98%',alignSelf:'center'}}>
     <ImageSlider 
    //  localImg={true}
    data={[
        // require('../../assets/Group75972.png'),
        {img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU'},
        {img: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg'},
        {img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg'}
    ]}
    onClick={(item, index) => {Alert.alert('hello'+index)}}
    autoPlay={true}
   // onItemChanged={(item) => console.log("item", item)}
    closeIconColor="transparent"
/>
   </View> */}
          <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 30 }}>
            <Text style={{ color: Mycolors.Black, fontWeight: 'bold', fontSize: 18 }}>Explore Nearby</Text>
            {resData?.vendors?.length > 0 ?
              <Text style={{ color: '#835E23', fontWeight: '500', textDecorationLine: "underline", fontSize: 14, }}
                onPress={() => { props.navigation.navigate('ShopProductSearch', { datas: [], from: 'search' }) }}>View More</Text>
              : null}
          </View>

          <View style={{ width: '100%', alignSelf: 'center', marginTop: 10, }}>
            {/* <FlatList
              data={resData?.vendors}
              showsHorizontalScrollIndicator={false}
              numColumns={2}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ width: dimensions.SCREEN_WIDTH / 2.2, marginHorizontal: 5 }}>
                    <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH / 2.2, height: 170, backgroundColor: '#F8F8F8', alignSelf: 'center' }}
                      // onPress={()=>{props.navigation.navigate('FoodDetails')}}>
                      onPress={() => {
                        props.navigation.navigate('ShopProductAll', { vendorId: item.userid, vendorName: item.name })
                        // dispatch(setProductVenderDetail(item))
                      }}>
                      <Image source={{ uri: item.banner_image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 7 }}></Image>
                    </TouchableOpacity>
                    <View style={{}}>
                      <Text style={{ fontSize: 11, color: Mycolors.Black, marginTop: 5, textAlign: 'left', fontWeight: 'bold' }}>{item.name}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 5, paddingLeft: 0, top: -10 }}>
                      <Text style={{ fontSize: 9, color: '#FFC40C', marginTop: 5, textAlign: 'left', }}>{item.category_name}</Text>
                      <TouchableOpacity onPress={() => handleNavigate(item.latitude, item.longitude)} style={{
                        width: 25, height: 25, borderRadius: 5, backgroundColor: '#fff', shadowColor: '#000',
                        shadowOffset: {
                          width: 0,
                          height: 3
                        },
                        shadowRadius: 1,
                        shadowOpacity: 0.3,
                        justifyContent: 'center',
                        elevation: 5,
                      }}>
                        <Image source={require('../../../assets/images/layer_9.png')} style={{ width: 10, height: 15, alignSelf: 'center' }}></Image>
                      </TouchableOpacity>
                    </View>
                  </View>
                )
              }}
              keyExtractor={item => item.id}
            /> */}
            {resData?.vendors?.length > 0 ?
              <FlatList
                data={resData.vendors}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{
                      width: 190, marginHorizontal: 6,
                      // borderColor:'#DEDEDE',borderWidth:1,
                      borderRadius: 15, backgroundColor: '#FFFF', overflow:'hidden', borderColor:'red'
                    }}>
                      <TouchableOpacity style={{ width: "100%", height: 130, backgroundColor: Mycolors.LogininputBox, alignSelf: 'center', padding: 1 }}
                        onPress={() => {
                          props.navigation.navigate('ShopProductDetails', { vendorId: item.userid, vendorName: item.name, businessid: item.business_id })
                          // dispatch(setProductVenderDetail(item))
                        }}>
                        <Image source={{ uri: item.banner_image }} style={{ width: '100%', height: '100%', alignSelf: 'center', resizeMode: 'stretch' }}></Image>
                      </TouchableOpacity>
                      <View style={{ left: 9 }}>
                        <Text style={{ fontSize: 12, color: Mycolors.Black, marginTop: 2, fontWeight: 'bold', left: 2 }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: '#9B9B9B', marginTop: 2, fontWeight: '500', left: 2,fontStyle: 'italic',}}>Caegory Name: Italian +2</Text>
                      </View>
                      <View style={{ padding: 5, left: 5, top: -3 }}>
                        <View style={{ flexDirection: 'row', }}>
                          <Image source={require('../../../assets/Star.png')} style={{ width: 13, height: 13 }}></Image>
                          <Text style={{ fontSize: 12, color: Mycolors.Black, left: 2 }}>{parseFloat(Number(item.rating).toFixed(5))}</Text>
                          {/* <View style={{ backgroundColor: '#9B9B9B', height: 4, width: 4, justifyContent: "center", alignItems: "center", marginHorizontal: 9, borderRadius: 4 / 2, marginTop: 7 }} />
                          <Image source={require('../../../assets/Clock.png')} style={{ width: 13, height: 13, marginLeft: -1, top: 1 }}></Image>
                          <Text style={{ fontSize: 12, color: Mycolors.Black, left: 2 }}>{item.tentative_time}</Text> */}
                        </View>
                        {/* <TouchableOpacity style={{width:25,height:25,borderRadius:5,backgroundColor:'#fff',shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 1,
      shadowOpacity: 0.3,
      justifyContent: 'center',
      elevation: 5,}}>
          <Image source={require('../../../assets/layer_9.png')} style={{width:10,height:15,alignSelf:'center'}}></Image>
          </TouchableOpacity> */}
                      </View>
                    </View>
                  )
                }}
                keyExtractor={item => item.id}
              />

              :
              <Text style={{ color: '#835E23', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>No Vendors Found</Text>
            }
          </View>


          <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 30 }}>
            <Text style={{ color: Mycolors.Black, fontWeight: 'bold', fontSize: 18, width: '70%', }}>Buy what makes you <Text style={{ color: '#0EA00E', fontWeight: 'bold', fontSize: 18, width: '70%', }}> HAPPY!</Text></Text>
            {resData?.categories?.length > 0 ?
              <Text style={{ color: '#835E23', fontWeight: '500', textDecorationLine: "underline", fontSize: 14, top: 10 }}
                onPress={() => { props.navigation.navigate('CatSearch', { datas: resData.categories, from: '' }) }}>View More</Text>
              : null}
          </View>

          <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
            {resData?.categories?.length > 0 ?
              <FlatList
                data={resData.categories}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // numColumns={2}
                renderItem={({ item, index }) => {
                  return (



                    <View style={{ width: 140, height: 200, marginHorizontal: 0, marginVertical: 5, }}>
                      <ImageBackground source={require('../../../assets/Food-Cover-image.png')} style={{ width: '100%', height: '95%', borderRadius: 10, }} resizeMode='cover'>
                        <TouchableOpacity style={{
                          paddingTop: 20
                          // width: 100, height: 120, padding: 10, backgroundColor: '#fff',
                          // shadowOffset: {
                          //   width: 0,
                          //   height: 3
                          // },
                          // shadowRadius: 1,
                          // shadowOpacity: 0.3,
                          // // justifyContent: 'center',
                          // elevation: 5, borderRadius: 10
                        }} onPress={() => { props.navigation.navigate('ShopProductSearch', { datas: [item], from: 'CatClick' }) }}>
                          <View style={{
                            width: 60, height: 60, alignSelf: 'center', borderRadius: 60 / 2, shadowOffset: {
                              width: 0,
                              height: 3
                            },
                            shadowRadius: 1,
                            shadowOpacity: 0.5,
                            elevation: 10,
                          }}>
                            <Image source={{ uri: item.category_image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 50, overflow: 'hidden' }}></Image>
                          </View>
                          <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, textAlign: 'center', marginTop: 9 }} >{item.category_name}</Text>
                          <Text style={{ color: '#0EA00E', fontWeight: '400', fontSize: 12, textAlign: 'center', marginTop: 5, }} >{item.total_vendors == 0 || item.total_vendors == undefined ? 'No Places NearBy' : item.total_vendors + ' Places NearBy'} </Text>
                        </TouchableOpacity>
                      </ImageBackground>
                    </View>

                  )
                }}
                keyExtractor={item => item.id}
              />
              :
              <Text style={{ color: '#835E23', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>No Categories Found</Text>
            }

          </View>






        </View>
        <View style={{ height: 100 }} />

      </ScrollView>
      <Modal
        isVisible={showChooseMilesModal}
        swipeDirection="down"
        onBackdropPress={() => setShowChooseMilesModal(false)}
        onSwipeComplete={(e) => {
          setShowChooseMilesModal(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '50%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            <View style={{ alignItems: 'center' }}>
              <Text style={{ color: Mycolors.Black, fontWeight: '500', marginBottom: 30, marginTop: 10 }}>Choose Miles</Text>
              <MultiSlider
                // values={[multiSliderValue[0], multiSliderValue[1]]}
                values={[multiSliderValue[0]]}
                sliderLength={320}
                onValuesChange={multiSliderValuesChange}
                min={0}
                max={100}
                step={1}
                allowOverlap={false}
                minMarkerOverlapDistance={10}
                markerStyle={{
                  ...Platform.select({
                    ios: {
                      height: 30,
                      width: 30,
                      shadowColor: '#000000',
                      shadowOffset: {
                        width: 0,
                        height: 3
                      },
                      shadowRadius: 1,
                      shadowOpacity: 0.1,
                      borderColor: '#ED1C24',
                      borderWidth: 1
                    },
                    android: {
                      height: 30,
                      width: 30,
                      borderRadius: 50,
                      backgroundColor: '#fff',
                      borderColor: '#ED1C24',
                      borderWidth: 1
                    }
                  })
                }}
                pressedMarkerStyle={{
                  ...Platform.select({
                    android: {
                      height: 30,
                      width: 30,
                      borderRadius: 20,
                      backgroundColor: '#ED1C24'
                    }
                  })
                }}
                selectedStyle={{ backgroundColor: '#ED1C24' }}
                trackStyle={{
                  height: 5
                }}
                touchDimensions={{
                  height: 40,
                  width: 40,
                  borderRadius: 20,
                  slipDisplacement: 40
                }}
              />
              <View style={{
                flexDirection: 'row', alignItems: 'center', width: '95%',
                height: 60,
                paddingHorizontal: 20,
                backgroundColor: '#fff',
                alignSelf: 'center',
                shadowColor: 'rgba(0, 0, 0, 0.5)',
                shadowOffset: {
                  width: 0,
                  height: 3
                },
                shadowRadius: 1,
                shadowOpacity: 0.1,
                // overflow: 'hidden',
                elevation: 5,
                marginTop: 30,
                marginBottom: 30,
              }}>
                <TextInput
                  ref={myTextInput}
                  value={String(multiSliderValue[0])}
                  onChangeText={(e) => {
                    const value = e.replace(/[^0-9]/g, '')
                    if (Number(value) > 100) {
                      Toast.show({ text1: 'Miles cannot be more than 100' });
                    } else if (Number(value) < 0) {
                      Toast.show({ text1: 'Miles cannot be less than 0' });
                    } else {
                      multiSliderValuesChange([Number(value)])
                    }
                  }}
                  textAlignVertical={'center'}
                  // onChangeText={(e) => console.log('e', e)}
                  placeholder={'0'}
                  placeholderTextColor="#263238"
                  multiline={true}
                  // maxLength={500}
                  // keyboardType="number-pad"
                  autoCapitalize='none'
                  style={{
                    color: '#263238',
                    fontSize: 12,
                    fontWeight: '500'
                  }}
                  keyboardType='numeric'
                />
                <Text onPress={() => { myTextInput.current.focus() }} style={{ color: '#263238', fontSize: 12, fontWeight: '500' }}> miles</Text>
              </View>
              {/* <Text style={{color:Mycolors.GrayColor,fontWeight:'600',fontSize:12,marginTop:9}} >{multiSliderValue[0]} miles</Text> */}
            </View>

            <View style={{ width: '95%', alignSelf: 'center' }}>
              <MyButtons title="Save" height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => { props.navigation.navigate('ShopPayment') }} marginHorizontal={20} fontSize={11}
                titlecolor={Mycolors.BG_COLOR} backgroundColor={'#FFD037'} marginVertical={0} />
            </View>

            {/* <View style={{width:100,height:100}} /> */}
          </ScrollView>

        </View>
      </Modal>
      {/* {!showChooseMilesModal && !loading ?
<TouchableOpacity onPress={()=>props.navigation.navigate('ShopProdCart')} style={{width:'80%',height:60,flexDirection:'row',justifyContent:'flex-end',position:'absolute',bottom:40, right:20, shadowColor: '#FFD037', shadowOffset: {width: 0,height: 3},shadowRadius: 1,shadowOpacity: 0.1,elevation: 5}}>
<Image source={require('../../../assets/images/prod_cart_img.png')} style={{width:100,height:100 }}/>
</TouchableOpacity>:null} */}
      <View style={{ width: '100%', height: 60, flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0, alignSelf: 'center', backgroundColor: '#fff', height: 80, paddingHorizontal: '3%' }}>


        <View style={{ width: '100%' }}>
          <MyButtons title="My Orders" height={45} width={'100%'} borderRadius={10} alignSelf="center" press={() => { props.navigation.navigate('ShopMyOrder') }} marginHorizontal={20} fontSize={11}
            titlecolor={Mycolors.BG_COLOR} hLinearColor={['#000000', '#000000']} />

        </View>

      </View>
      {loading ? <Loader /> : null}
      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}
      {My_Alert2 ? <MyAlert sms={alert_sms2} sms2={'Logout'} okPress={() => { logoutDriver() }} canclePress={() => { setMy_Alert2(false) }} /> : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({

});
export default ShopProduct 