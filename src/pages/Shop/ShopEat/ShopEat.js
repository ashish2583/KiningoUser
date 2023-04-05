import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, StatusBar } from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import { baseUrl, login, shop_eat_business, requestPostApi, requestGetApi, shop_eat } from '../../../WebApi/Service'
import Loader from '../../../WebApi/Loader';
import Toast from 'react-native-toast-message';
import MyAlert from '../../../component/MyAlert';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserResult, saveUserToken, setVenderDetail,onLogoutUser, setUserType } from '../../../redux/actions/user_action';
import {setRestorentLocation } from '../../../redux/actions/latLongAction';
import GetLocation from 'react-native-get-location'
import Geocoder from "react-native-geocoding";
import { GoogleApiKey } from '../../../WebApi/GoogleApiKey';
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import { log } from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';

Geocoder.init(GoogleApiKey);
const GOOGLE_MAPS_APIKEY = 'AIzaSyACzgsZq8gI9VFkOw_fwLJdmezbc4iUxiM';

const ShopEat = (props) => {
  const [searchValue, setsearchValue] = useState('')
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
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
  const [resData, setresData] = useState(null)
  const [venderdata, setvenderdata] = useState(null)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [refreshing, setRefreshing] = useState(false);
  const [addre, setaddre] = useState(' ');
  const [cartCount, setcartCount] = useState('0')
  const mapdata = useSelector(state => state.maplocation) 
  const [googleAddress, setGoogleAddress] = useState('');
  const [googleLatLng, setGoogleLatLng] = useState({});

  useEffect(() => {
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        console.log('locations latitude longitude', location);
        setlat(28.6176)
        setlan(77.422)
        let My_cord = { latitude: 28.6176, longitude: 77.422 }
        dispatch(setRestorentLocation(My_cord))
         homePage(location.latitude,location.longitude)
        LatlongTo_address(My_cord)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
   
    // venderList()
  }, [])

  const LatlongTo_address = async (latlong) => {
    // var courentlocation = mapdata.curentPosition
    // dispatch(setStartPosition(courentlocation))
    Geocoder.from(latlong.latitude, latlong.longitude)
      .then(json => {
        var addressComponent = json.results[0].formatted_address;
        console.log('The address is', json.results[0].formatted_address);
        setaddre(addressComponent)
        // UpdateLocation(latlong,addressComponent)
      })
      .catch(error => console.warn(error));
  }

  const checkcon = () => {
    homePage()
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

  const homePage = async (l,lo) => {
    console.log('the res==>>Home')
    setLoading(true)

    // const { responseJson, err } = await requestGetApi(shop_eat+ '?lat=' + l + '&long=' + lo, '', 'GET', '')
    const { responseJson, err } = await requestGetApi(shop_eat+ '?lat=' + '28.6176' + '&long=' + '77.422', '', 'GET', '')
    setLoading(false)
    console.log('the res==>>Home', responseJson)
    if (responseJson.headers.success == 1) {
      console.log('the res==>>Home.body.vendors', responseJson.body)
      setresData(responseJson.body)
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const homePageSearch = async () => {
    //  if(searchValue==''){
    //   Toast.show('Please input ')
    //  }
    setLoading(true)
    const { responseJson, err } = await requestGetApi(shop_eat + '?name=' + searchValue.text + '&lat=' + lat + '&long=' + lan, '', 'GET', '')
    setLoading(false)
    console.log('the res==>>Home ?name=', responseJson)
    if (responseJson.headers.success == 1) {
      props.navigation.navigate('ShopSearch', { datas: responseJson.body.vendors })
      setresData(responseJson.body)
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const venderList = async () => {
    setLoading(true)
    const { responseJson, err } = await requestGetApi(shop_eat_business, '', 'GET', '')
    setLoading(false)
    console.log('the res==>>shop_eat_business', responseJson)
    if (responseJson.headers.success == 1) {
      setvenderdata(responseJson.body)
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  return (
    <SafeAreaView style={{}}>
      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
        showsVerticalScrollIndicator={false} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled"
      >
      <View>
        <HomeHeader height={60} paddingHorizontal={15}
          press1={() => { props.navigation.goBack() }}  img1width={18} img1height={15}
          press2={() => { }} title2={'Food'} fontWeight={'500'} img2height={20}
          press3={() => {
            // props.navigation.navigate('ShopEatNotificationList') 
            AsyncStorage.clear(); 
          dispatch(onLogoutUser())
            }} img3width={20} img3height={20} img3={require('../../../assets/dating-logout-image.png')} />
        {cartCount != '0' ?
          <View style={{ position: 'absolute', right: 8, top: 8, width: 20, height: 20, borderRadius: 20, backgroundColor: 'red', justifyContent: 'center', zIndex: 999 }}>
            <Text style={{ fontSize: 11, textAlign: 'center', color: '#fff' }}>{cartCount}</Text>
          </View>
          : null
        }
      </View>

   

     {/* <View style={{
          flexDirection: 'row', justifyContent: 'space-between',
          marginHorizontal: 15, backgroundColor: 'rgba(0,0,0,0.025)',
          paddingVertical: 5,
          alignSelf: 'center', alignItems: 'center',
          backgroundColor: '#fff',
          // shadowColor: 'gray',
          // shadowOffset: {
          //   width: 3,
          //   height: 3
          // },
          // shadowRadius: 3,
          // shadowOpacity: 0.5,
          // justifyContent: 'center',
          // elevation: 5,
          borderRadius: 10,
        }}>
          <View style={{position:'absolute',flexDirection:'row', justifyContent: 'space-between',width:'100%', paddingHorizontal: 15,}}>
          <TouchableOpacity style={{justifyContent: 'flex-start',top:4 }}>
            <Image source={require('../../../assets/shape_33.png')} style={{ width: 12, height: 15 }}></Image>
          </TouchableOpacity>
          <TouchableOpacity style={{ justifyContent: 'flex-end',zIndex:999 ,width: 25, height: 25}} onPress={() => { props.navigation.navigate('ShopEatFilter') }}>
            <Image source={require('../../../assets/shape_32.png')} style={{ width: 25, height: 25 }}></Image>
          </TouchableOpacity>
          </View>
          <GooglePlacesAutocomplete
            placeholder={addre.substring(0, 45)}
            textInputProps={{
              placeholderTextColor: '#000',
              // placeholderTextColor: Colors.BLACK,
              returnKeyType: 'search',
              // onFocus: () => setShowPlacesList(true),
              // onBlur: () => setShowPlacesList(false),
              multiline: true,
              // onTouchStart: ()=>{downButtonHandler()}
              height: 45,
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
                marginLeft:10,
                  // backgroundColor: 'grey',
                },
              description: {
                color: '#000',
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
              },
              row: {
                backgroundColor: '#FFFFFF',
                padding: 13,
                height: 44,
                flexDirection: 'row',
              },
              separator: {
                height: 0.5,
                backgroundColor: '#C8C7CC',
                color: '#000'
              },
              textInput: {
                backgroundColor: 'transparent',
                height: 35,
                borderRadius: 5,
                paddingVertical: 5,
                fontSize: 13,
                color: '#000',
                flex: 1,
                paddingLeft: 25,
                paddingRight:40,
              },
            }}
            onPress={(data, details = null) => {
              console.log(data, details);
            // 'details' is provided when fetchDetails = true
            // setShowPlacesList(false)
            homePage(details.geometry.location.lat,details.geometry.location.lng)
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
          />
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
              placeholder={addre.substring(0, 45)}
              textInputProps={{
                placeholderTextColor: '#000',
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
                },
                row: {
                  // backgroundColor: '#FFFFFF',
                  paddingVertical: 10,
                  height: 44,
                  flexDirection: 'row',
                },
                separator: {
                  height: 0.5,
                  backgroundColor: '#C8C7CC',
                  color: '#000'
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
            homePage(details.geometry.location.lat,details.geometry.location.lng)
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
            />
          </View>
          <View style={{
            height: 55, position: 'absolute', right: -10,
            borderTopRightRadius: 10,
            borderBottomRightRadius: 10,
            marginHorizontal: 8, top: 0,
            backgroundColor: '#ADC430',
            paddingVertical: 5,
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
            width: 40,
            borderTopRightRadius: 10, borderBottomRightRadius: 10
          }}>
            <TouchableOpacity onPress={() => { props.navigation.navigate('ShopEatFilter') }}>
              <Image source={require('../../../assets/shape_32.png')} style={{ width: 25, height: 25 }}></Image>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{ width: '96%', alignSelf: 'center' }}>
         
          <TouchableOpacity style={{ width: '98%', height: 50, borderRadius: 10, backgroundColor: '#fff', flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginTop: 10,justifyContent:"space-between" }}
            onPress={() => { props.navigation.navigate('ShopSearch', { datas: [], from: 'search' }) }}>
            
            <View style={{ padding: 5 }}>
              <Text style={{ color: 'gray', fontSize: 12, left:9 }}>Search Cuisine,Dishes</Text>
            </View>
            <View style={{ padding: 5, }}>
              <Image source={require('../../../assets/Search-red.png')} style={{ width: 45, height: 49 }}></Image>
            </View>
          </TouchableOpacity>

          <View style={{ width: '100%', alignSelf: 'center', marginTop: 15 }}>
            {resData != null ?
              <FlatList
                data={resData.coupons}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ width: dimensions.SCREEN_WIDTH * 75 / 100, marginHorizontal: 5, borderRadius: 10}}>
                      <TouchableOpacity style={{ width: '100%', height: 120, backgroundColor: Mycolors.LogininputBox, alignSelf: 'center', alignSelf:'center' }}
                        onPress={() => { props.navigation.navigate('ShopSearch', { datas: [], from: '' }) }}>
                        <Image resizeMode='stretch' source={{ uri: item.image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 10,  }}></Image>
                      </TouchableOpacity>
                    </View>
                  )
                }}
                keyExtractor={item => item.id}
              />
              : null}
          </View>


          <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 30 }}>
            <Text style={{ color: Mycolors.Black, fontWeight: 'bold',fontSize:22}}>Explore Nearby</Text>
            <Text style={{ color: Mycolors.RED, fontWeight: '500', textDecorationLine: "underline",fontSize:14, }}
              onPress={() => { props.navigation.navigate('ShopSearch', { datas: [], from: 'search' }) }}>View More</Text>
          </View>


          <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
            {resData != null ?
              <FlatList
                data={resData.vendors}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{ width: 190, marginHorizontal: 6,
                    // borderColor:'#DEDEDE',borderWidth:1,
                    borderRadius:15,backgroundColor:'#FFFF', }}>
                      <TouchableOpacity style={{ width: "100%", height: 130, backgroundColor: Mycolors.LogininputBox, alignSelf: 'center' ,padding:1}}
                        onPress={() => {
                          props.navigation.navigate('FoodDetails', { data: item })
                          dispatch(setVenderDetail(item))
                        }}>
                        <Image source={{ uri: item.banner_image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 8, resizeMode: 'stretch' }}></Image>
                      </TouchableOpacity>
                      <View style={{left: 9 }}>
                        <Text style={{ fontSize: 12, color: Mycolors.Black, marginTop: 2, fontWeight: 'bold', left: 2 }}>{item.name}</Text>
                        <Text style={{ fontSize: 12, color: '#9B9B9B', marginTop: 2, fontWeight: '500', left: 2,fontStyle: 'italic',}}>Cusine Name: Italian +2</Text>
                      </View>
                      <View style={{ padding: 5,left: 5,top:-3 }}>
                        <View style={{ flexDirection: 'row', }}>
                          <Image source={require('../../../assets/Star.png')} style={{ width: 13, height: 13 }}></Image>
                          <Text style={{ fontSize: 12, color: Mycolors.Black, left: 2 }}>{parseFloat(Number(item.rating).toFixed(5))}</Text>
                          <View style={{backgroundColor:'#9B9B9B',height:4,width:4,justifyContent:"center",alignItems:"center",marginHorizontal:9,borderRadius:4/2,marginTop:7}} />
                          <Image source={require('../../../assets/Clock.png')} style={{ width: 13, height: 13, marginLeft: -1, top: 1 }}></Image>
                          <Text style={{ fontSize: 12, color: Mycolors.Black, left: 2 }}>{item.tentative_time}</Text>
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

              : null}
          </View>


          <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 30 }}>
            <Text style={{ color: Mycolors.Black, fontWeight: 'bold',fontSize:22, width: '70%', }}>Eat what makes you <Text style={{ color: '#0EA00E', fontWeight: 'bold',fontSize:22, width: '70%', }}> HAPPY!</Text></Text>
            <Text style={{ color: Mycolors.RED, fontWeight: '500', textDecorationLine: "underline",fontSize:14,top:10 }}
              onPress={() => { props.navigation.navigate('CatSearch', { datas: resData.categories, from: '' }) }}>View More</Text>
          </View>

          <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
            {resData != null ?
              <FlatList
                data={resData.categories}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    

                 
                    <View style={{ width: 140, height: 200, marginHorizontal: 0, marginVertical: 5, }}>
                      <ImageBackground source={require('../../../assets/Food-Cover-image.png')}style={{width:'100%',height:'95%',  borderRadius: 10, }}resizeMode='cover'> 
                      <TouchableOpacity style={{ paddingTop:20
                        // width: 100, height: 120, padding: 10, backgroundColor: '#fff',
                        // shadowOffset: {
                        //   width: 0,
                        //   height: 3
                        // },
                        // shadowRadius: 1,
                        // shadowOpacity: 0.3,
                        // // justifyContent: 'center',
                        // elevation: 5, borderRadius: 10
                      }} onPress={() => { props.navigation.navigate('ShopSearch', { datas: [item], from: 'CatClick' }) }}>
                        <View style={{ width: 60, height: 60, alignSelf: 'center',borderRadius:60/2,shadowOffset: {
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
                        <Text style={{ color: '#0EA00E', fontWeight: '400', fontSize: 12, textAlign: 'center', marginTop: 9, }} >{item.total_vendors==0 ? 'No Places NearBy' : item.total_vendors+' Places NearBy'} </Text>
                      </TouchableOpacity>
                      </ImageBackground>
                    </View>
                    
                  )
                }}
                keyExtractor={item => item.id}
              />
              : null}

          </View>

        </View>
        <View style={{ height: 100 }} />

      </ScrollView>
      <View style={{ width: '100%', height: 60, flexDirection: 'row', justifyContent: 'space-between', position: 'absolute', bottom: 0, alignSelf: 'center',backgroundColor:'#fff', height:80,paddingHorizontal:'3%'}}>
        <View style={{ width: '47%' }}>
          <MyButtons title="Dining & Booked Table" height={45} width={'100%'} borderRadius={10} alignSelf="center" press={() => { props.navigation.navigate('DiningAndBookTable') }} marginHorizontal={20} fontSize={11}
            titlecolor={Mycolors.BG_COLOR} hLinearColor={['#fd001f', '#b10027']} />
        </View>

        <View style={{ width: '47%' }}>
          <MyButtons title="My Orders" height={45} width={'100%'} borderRadius={10} alignSelf="center" press={() => { props.navigation.navigate('ShopMyOrder') }} marginHorizontal={20} fontSize={11}
            titlecolor={Mycolors.BG_COLOR} hLinearColor={['#000000', '#000000']} />

        </View>

      </View>
      {loading ? <Loader /> : null}
      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({

});
export default ShopEat 