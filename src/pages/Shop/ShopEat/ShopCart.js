import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, View, Image, Text, StyleSheet, Dimensions, SafeAreaView, KeyboardAvoidingView, Platform, TextInput, FlatList, Alert, TouchableOpacity, Pressable, ScrollView, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import { Rating } from 'react-native-ratings';
import ViewMoreText from 'react-native-view-more-text';
import Toggle from "react-native-toggle-element";
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setSelectedCarTab } from '../../../redux/actions/user_action';
import DatePicker from 'react-native-datepicker';
import { baseUrl, delete_Update_Address, shop_eat_cart, shop_eat_cart_id, user_address, shop_eat_coupons_userid, shop_eat_cart_apply_coupon, login, shop_eat_business_id, shop_eat_menu_userid, requestPostApi, requestGetApi, shop_eat, shop_remove_coupon } from '../../../WebApi/Service'
import Loader from '../../../WebApi/Loader';
import Toast from 'react-native-simple-toast'
import MyAlert from '../../../component/MyAlert';
import { useSelector, useDispatch } from 'react-redux';
import GetLocation from 'react-native-get-location'
import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Geolocation from "react-native-geolocation-service";
import {GoogleApiKey} from '../../../WebApi/GoogleApiKey'
import Geocoder from "react-native-geocoding";

var WIDTH = Dimensions.get('window').width;
var HEIGHT = Dimensions.get('window').height;
const GOOGLE_MAPS_APIKEY = 'AIzaSyACzgsZq8gI9VFkOw_fwLJdmezbc4iUxiM';
Geolocation.setRNConfiguration(GoogleApiKey);
Geocoder.init(GoogleApiKey);

const ShopCart = (props) => {
  const person_Image = "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  const [checkitem, setcheckitem] = useState('')
  const [res, setres] = useState('')
  const [upData, setupData] = useState([
    {
      id: '1',
      title: '**** **** **** 5967',
      height: 33,
      width: 55,
      time: 'Expires 24/22',
      img: require('../../../assets/images/layer_48.png'),
    },
    {
      id: '2',
      title: '**** **** **** 5967',
      height: 18,
      width: 55,
      time: 'Expires 24/22',
      img: require('../../../assets/images/group_36.png'),
    },

  ])
  const User = useSelector(state => state.user.user_details)
  const VenderDetails = useSelector(state => state.user.venderDeatil)
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState([])
  const [promocode, setpromocode] = useState('')
  const [rescopun, setrescopun] = useState([{ "coupon_code": "KINENGO3", "coupon_name": "Dummy Coupon", "coupon_type": "flat", "discount_id": 9, "discount_value": "3.00", "expred_on": "2023-10-31", "image": "http://54.153.75.225/images/app-icons/offer2.jpg", "min_order_value": 10 }])
  const [discount_id, setdiscount_id] = useState(null)
  const [discountPrice, setdiscountPrice] = useState('0.0')
  const [subTotal, setsubTotal] = useState('0.0')
  const [dilivery, setdilivery] = useState('0.0')
  const [vendorCharges, setVendorCharges] = useState('0.0')
  const [taxes, setTaxes] = useState('0.0')
  const [totla, settotal] = useState('0.0')
  const [applyedCoupen, setapplyedCoupen] = useState('')
  const [modlevisual, setmodlevisual] = useState(false)
  const [addressList, setaddressList] = useState(false)
  const [addressListData, setaddressListData] = useState([])
  const [landmark, setlandmark] = useState('');
  const [address_type, setaddress_type] = useState('2');
  const [city, setCity] = useState('');
  const [full_name, setfull_name] = useState('');
  const [area_village, setarea_village] = useState('');
  const [ShippingAddressPopUp, setShippingAddressPopUp] = useState(false);
  const [house_no, sethouse_no] = useState('');
  const [phone, setphone] = useState('');
  const [pincode, setpincode] = useState('');
  const [state, setstate] = useState('');
  const [selectedAddress, setselectedAddress] = useState(null);
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [ordertype, setordertype] = useState('delivery')
  const [reloades, setreloades] = useState(false)
  const [edit, setedit] = useState(false)
  const [AddressId, setAddressId] = useState(null)
  const [refreshing, setRefreshing] = useState(false);
  const [cookingIns, setcookingIns] = useState('')
  const [googleAddress, setGoogleAddress] = useState('');
  const [googleLatLng, setGoogleLatLng] = useState({});
  // const [currentAddress, setCurrentAddress] = useState('');
  // const [currentLatLng, setCurrentLatLng] = useState({});
  const [chooseAddressModeModal, setChooseAddressModeModal] = useState(false);
  const [openGoogleAddressModal, setOpenGoogleAddressModal] = useState(false);
  const [addressMode, setAddressMode] = useState(null);
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')

  useEffect(() => {
    console.log('hello ji ==>>', User);
    getcart()
    getCopun()
    getAddress()
    GetLocation.getCurrentPosition({
      enableHighAccuracy: true,
      timeout: 15000,
    })
      .then(location => {
        // console.log('locations latitude longitude',location);
        setlat(location.latitude)
        setlan(location.longitude)
      })
      .catch(error => {
        const { code, message } = error;
        console.warn(code, message);
      })
  }, [])


  const checkcon = () => {
    getcart()
    getCopun()
    getAddress()
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


  const putcart = async (item, add) => {

    setLoading(true)
    var data = ''
    if (add == '+') {
      data = {
        id: item.id,
        product_id: item.product_id,
        quantity: item.quantity + 1,
      }
    } else {
      if (item.quantity > 1) {
        data = {
          id: item.id,
          product_id: item.product_id,
          quantity: item.quantity - 1,
        }
      } else {
        deletcart(item)
      }

    }

    const { responseJson, err } = await requestPostApi(shop_eat_cart_id + item.id, data, 'PUT', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.headers.success == 1) {
      // Toast.show(responseJson.headers.message)
      Alert.alert(responseJson.headers.message)
      getcart()

    } else {
      // setalert_sms(err)
      // setMy_Alert(true)
    }
  }

  const deletcart = async (item) => {

    setLoading(true)

    const { responseJson, err } = await requestPostApi(shop_eat_cart_id + item.id, '', 'DELETE', User.token)
    setLoading(false)
    console.log('the res==>>delete ', responseJson)
    if (responseJson.headers.success == 1) {
      Alert.alert(responseJson.headers.message)
      // Toast.show(responseJson.headers.message)
      getcart()
    } else {
      getcart()
      // setalert_sms(err)
      // setMy_Alert(true)
    }
  }

  const deletAddress = async (item) => {
    console.log('itemsss', item);
    setLoading(true)

    const { responseJson, err } = await requestPostApi(delete_Update_Address + item.id, '', 'DELETE', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.headers.success == 1) {
      // Toast.show(responseJson.headers.message)
      Alert.alert(responseJson.headers.message)
      getAddress()
      setreloades(!reloades)
    } else {

      // setalert_sms(err)
      // setMy_Alert(true)
    }
  }

  const UpdateAddress = async (item) => {

    var data = {
      "location_name": full_name,
      "location_type": address_type,
      "latitude": lat,
      "longitude": lan,
      "address_line1": house_no,
      "address_line2": area_village,
      "city": city,
      "state": state,
      "country_id": 1,
      "is_default": 1
    }
    setLoading(true)
    const { responseJson, err } = await requestPostApi(delete_Update_Address + AddressId, data, 'PUT', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.headers.success == 1) {
      // Toast.show(responseJson.headers.message)
      Alert.alert(responseJson.headers.message)
      setShippingAddressPopUp(false)
      setaddressList(true)
      setedit(false)
      setAddressId('')
      setfull_name('')
      setaddress_type('')
      sethouse_no('')
      setarea_village('')
      setCity('')
      setstate('')
      getAddress()
    } else {
      // setalert_sms(err)
      // setMy_Alert(true)
    }
  }

  const getcart = async () => {
    // setresData([])
    setLoading(true)
    const { responseJson, err } = await requestGetApi(shop_eat_cart, '', 'GET', User.token)
    setLoading(false)
    // console.log('the res get shop_eat_cart ==>>', responseJson.body.items.length)
    console.log('the res get shop_eat_cart ==>>', responseJson.body)
    if (responseJson.headers.success == 1) {
      if (responseJson.body.items.length == 0) {
        setres([])
        setresData([])
        setsubTotal('')
        setdilivery('')
        setVendorCharges('')
        setTaxes('')
        settotal('0')
        setreloades(!reloades)
      } else {
        if (responseJson.body.items[0].serviceType == 'Take Away') {
          setordertype('take-away')
        }
        setres(responseJson.body)
        var myCartItem = []
        for (let i = 1; i <= responseJson.body.items.length; i++) {
          if (responseJson.body.items[i - 1].serviceType != null) {
            myCartItem.push(responseJson.body.items[i - 1])
          }
        }
        setresData(myCartItem)
        // setresData(responseJson.body.items)
        setsubTotal(responseJson.body.sub_total)
        setdilivery(responseJson.body.delivery_charge)
        setVendorCharges(responseJson.body.vendor_charges)
        setTaxes(responseJson.body.taxes)
        settotal(responseJson.body.total)
        setreloades(!reloades)
      }
    } else {
      setres([])
      setresData([])
      setsubTotal('')
      setdilivery('')
      setVendorCharges('')
      setTaxes('')
      settotal('0')
      setreloades(!reloades)
      //  setalert_sms(err)
      //  setMy_Alert(true)
    }

  }

  const applyCoupan = async () => {
    if (discount_id == null) {
      // Toast.show('Please select any coupon')
      Alert.alert('Please select any coupon')
    } else {
      setLoading(true)
      var data = {
        discount_id: discount_id,
      }
      const { responseJson, err } = await requestPostApi(shop_eat_cart_apply_coupon, data, 'POST', User.token)
      setLoading(false)
      console.log('the res shop_eat_cart_apply_coupon==>>', responseJson)
      if (responseJson.headers.success == 1) {
        setdiscountPrice(responseJson.body.coupon_discount)
        setsubTotal(responseJson.body.sub_total)
        setdilivery(responseJson.body.delivery_charge)
        setVendorCharges(responseJson.body.vendor_charges)
        setTaxes(responseJson.body.taxes)
        settotal(responseJson.body.total)
        setapplyedCoupen(responseJson.body.coupon)
      } else {
        // setalert_sms(err)
        // setMy_Alert(true)
      }
    }

  }
  const removeCoupan = async () => {
    setLoading(true)
    var data = {
      discount_id: discount_id,
    }
    const { responseJson, err } = await requestPostApi(shop_remove_coupon, data, 'POST', User.token)
    setLoading(false)
    console.log('remove coupon response', responseJson)
    console.log('remove coupon response body', responseJson.body)
    if (responseJson.headers.success == 1) {
      setdiscountPrice(responseJson.body.coupon_discount)
      setsubTotal(responseJson.body.sub_total)
      setdilivery(responseJson.body.delivery_charge)
      setVendorCharges(responseJson.body.vendor_charges)
      setTaxes(responseJson.body.taxes)
      settotal(responseJson.body.total)
      setapplyedCoupen('')
      setpromocode('')
    } else {
      // setalert_sms(err)
      // setMy_Alert(true)
    }
    

  }

  const AddAddress = async () => {
    if (full_name == '') {
      Alert.alert('Please Add Name')
    } else if (area_village == '') {
      Alert.alert('Please Add Address')
    } else if (city == '') {
      Alert.alert('Please Add City')
    } else if (state == '') {
      Alert.alert('Please Add State')
    }
    setLoading(true)
    var data = {
      "location_name": full_name,
      "location_type": address_type,
      "latitude": lat,
      "longitude": lan,
      "address_line1": house_no,
      "address_line2": area_village,
      "city": city,
      "state": state,
      "country_id": 1,
      "is_default": 1
    }
    console.log('Ashush===>>', data);
    const { responseJson, err } = await requestPostApi(user_address, data, 'POST', User.token)
    setLoading(false)
    console.log('the res user_address set==>>', responseJson)
    if (responseJson.headers.success == 1) {
      getAddress()
      setfull_name('')
      setaddress_type('')
      sethouse_no('')
      setarea_village('')
      setCity('')
      setstate('')
      setShippingAddressPopUp(false)
    } else {
      // setalert_sms(err)
      // setMy_Alert(true)
    }


  }

  const getMatches = (str) => {
    var count = (str.match(/,/g) || []).length;
    return count
  }
  const getLastIndex = (str) => {
    return str.lastIndexOf(",")
  }
  const AddAddressUsingGoogleSearch = async () => {
    console.log('googleAddress', googleAddress);
    if(googleAddress === ''){
      Alert.alert('Please Add Address')
      return
    }
    // if (full_name == '') {
    //   Alert.alert('Please Add Name')
    // } else if (area_village == '') {
    //   Alert.alert('Please Add Address')
    // } else if (city == '') {
    //   Alert.alert('Please Add City')
    // } else if (state == '') {
    //   Alert.alert('Please Add State')
    // }
    // address_line1, city, state, country
    let matches = getMatches(googleAddress)
    console.log('matches', matches);
    const addressData = {
      country: '',
      state: '',
      city: '',
      address_line1: '',
    }
    let addressValue = googleAddress
    console.log('googleAddress', googleAddress);
    let lastindex = null
    let partOfString = null
    if(matches > 3){
      matches = 3 
    }
    for(let i = 0; i < matches + 1; i++){
      lastindex = getLastIndex(addressValue)
      if(i !== 3){
        partOfString = addressValue.substring(lastindex + 1)
        addressValue = addressValue.substring(0, lastindex)
      }
      // console.log('i', i);
      // console.log('lastindex', lastindex);
      // console.log('partOfString', partOfString);
      // console.log('addressValue', addressValue);
      if(i == 0){
        addressData.country = partOfString?.trim()
      }else if(i == 1){
        addressData.state = partOfString?.trim()
      }else if(i == 2){
        addressData.city = partOfString?.trim()
      }else if(i == 3){
        addressData.address_line1 = addressValue?.trim()
      }
      if(i == 3){
        break
      }
    }
    setLoading(true)
    var data = {
      "location_name": '',
      "location_type": '1',
      "latitude": googleLatLng.lat,
      "longitude": googleLatLng.lng,
      // "address_line1": house_no,
      "address_line2": '',
      // "city": city,
      // "state": state,
      "country_id": 1,
      "is_default": 1,
      ...addressData
    }
    // console.log('addressData', addressData);
    console.log('google address data===>>', data);
    // return
    const { responseJson, err } = await requestPostApi(user_address, data, 'POST', User.token)
    setLoading(false)
    // close modal
    setOpenGoogleAddressModal(false)
    console.log('the res google user_address set==>>', responseJson)
    if (responseJson.headers.success == 1) {
      getAddress()
      setfull_name('')
      setaddress_type('')
      sethouse_no('')
      setarea_village('')
      setCity('')
      setstate('')
      setGoogleLatLng({})
      setGoogleAddress('')
      setShippingAddressPopUp(false)
    } else {
      // setalert_sms(err)
      // setMy_Alert(true)
    }


  }
  const AddAddressUsingCurrentLoation = async (latLng, currentAddress) => {
    // if(googleAddress === ''){
    //   Alert.alert('Please Add Address')
    //   return
    // }
    // if (full_name == '') {
    //   Alert.alert('Please Add Name')
    // } else if (area_village == '') {
    //   Alert.alert('Please Add Address')
    // } else if (city == '') {
    //   Alert.alert('Please Add City')
    // } else if (state == '') {
    //   Alert.alert('Please Add State')
    // }
    // address_line1, city, state, country
    let matches = getMatches(currentAddress)
    console.log('matches', matches);
    const addressData = {
      country: '',
      state: '',
      city: '',
      address_line1: '',
    }
    let addressValue = currentAddress
    console.log('currentAddress', currentAddress);
    let lastindex = null
    let partOfString = null
    if(matches > 3){
      matches = 3 
    }
    for(let i = 0; i < matches + 1; i++){
      lastindex = getLastIndex(addressValue)
      if(i !== 3){
        partOfString = addressValue.substring(lastindex + 1)
        addressValue = addressValue.substring(0, lastindex)
      }
      // console.log('lastindex', lastindex);
      // console.log('partOfString', partOfString);
      // console.log('addressValue', addressValue);
      if(i == 0){
        addressData.country = partOfString?.trim()
      }else if(i == 1){
        addressData.state = partOfString?.trim()
      }else if(i == 2){
        addressData.city = partOfString?.trim()
      }else if(i == 3){
        addressData.address_line1 = addressValue?.trim()
      }
      console.log('addressData', addressData);
      // if(i == 3){
      //   break
      // }
    }
    setLoading(true)
    var data = {
      "location_name": '',
      "location_type": '1',
      "latitude": latLng.lat,
      "longitude": latLng.lng,
      // "address_line1": house_no,
      "address_line2": '',
      // "city": city,
      // "state": state,
      "country_id": 1,
      "is_default": 1,
      ...addressData
    }
    // console.log('addressData', addressData);
    console.log('current address data===>>', data);
    const { responseJson, err } = await requestPostApi(user_address, data, 'POST', User.token)
    setLoading(false)
    // close modal
    // setOpenGoogleAddressModal(false)
    console.log('the res current user_address set==>>', responseJson)
    if (responseJson.headers.success == 1) {
      getAddress()
      setfull_name('')
      setaddress_type('')
      sethouse_no('')
      setarea_village('')
      setCity('')
      setstate('')
      setShippingAddressPopUp(false)
    } else {
      // setalert_sms(err)
      // setMy_Alert(true)
    }


  }
  const myposition = () => {
    Geolocation.getCurrentPosition(
      position => {
        setLoading(true)
        let My_cord = { latitude: position.coords.latitude, longitude: position.coords.longitude }
        Geocoder.from(position.coords.latitude, position.coords.longitude)
        .then(json => {
          var addressComponent = json.results[0].formatted_address;
          console.log('The address is', json.results[0].formatted_address);
          AddAddressUsingCurrentLoation({lat: position.coords.latitude, lng: position.coords.longitude}, json.results[0].formatted_address)
        })
        .catch(error => {
          setLoading(false)
          console.warn(error)
        });
      },
      error => {
        setLoading(false)
        Alert.alert(error.message.toString());
      },
      {
        showLocationDialog: true,
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0
      }
    );
  }
  const getAddress = async () => {
    setLoading(true)
    const { responseJson, err } = await requestGetApi(user_address, '', 'GET', User.token)
    setLoading(false)
    console.log('the res get user_address get==>>body', responseJson)
    if (responseJson != null) {
      if (responseJson.headers.success == 1) {
        setaddressListData(responseJson.body)
        setselectedAddress(responseJson.body[0])
      } else {
        // setaddressListData(null)
        setselectedAddress(null)
        //  setalert_sms(err)
        //  setMy_Alert(true)
      }
    } else {
      // setaddressListData(null)
      setselectedAddress(null)
    }

  }


  const getCopun = async () => {

    setLoading(true)

    const { responseJson, err } = await requestGetApi(shop_eat_coupons_userid + VenderDetails.userid, '', 'GET', User.token)
    setLoading(false)
    console.log('the res get shop_eat_coupons_userid ==>>', responseJson)
    if (responseJson.headers.success == 1) {
      setrescopun(responseJson.body)
    } else {
      //  setalert_sms(err)
      //  setMy_Alert(true)
    }

  }
  const openAddressModel = () => {
    // if(addressMode == ''){
    //    setalert_sms('Please select address method')
    //    setMy_Alert(true)
    //   return
    // }
    if(addressMode == '1'){
      setShippingAddressPopUp(true)
    } else if(addressMode == '2'){
      setOpenGoogleAddressModal(true)
    } else if(addressMode == '3'){
      myposition()
    }
    setChooseAddressModeModal(false)
    // setAddressMode('')
  }
  const flatliistDesign = (img, ti, rs, des, mpress, apress, dpress, qty) => {
    return (
      <View style={{
        width: '100%', marginHorizontal: 5, marginVertical: 8, padding: 10, backgroundColor: '#fff',
        // borderColor: '#dee4ec',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 1,
        shadowOpacity: 0.3,
        shadowColor:'#555555',
        // borderWidth: 1,
        elevation: 5, borderRadius: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center'
      }}
      >
        <View style={{ width: 120, height: 120, alignSelf: 'center', borderRadius: 10, borderWidth: 3, borderColor: '#dee4ec' }}>
          <Image source={{ uri: img }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 10, resizeMode: 'stretch' }} ></Image>
        </View>
        <View style={{ marginLeft: 15, width: '58%', top: -10 }}>
          <View style={{}}>
            <Text style={{ color: '#C1C1C1', fontWeight: '600', fontSize: 22, marginTop: 0 }} >{ti}</Text>
          </View>

          <Text numberOfLines={2} style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 14, marginTop: 6 }} >{rs}</Text>
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
            <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 14, marginTop: 6 }} >{des}</Text>

          </View>

        </View>
        <TouchableOpacity style={{ position: 'absolute', width: 20, height: 22, top: 10, right: 10, borderRadius: 3, justifyContent: 'center' }}
          onPress={dpress}>
          <Image source={require('../../../assets/bin.png')} style={{ width: '100%', height: '100%', alignSelf: 'center', resizeMode: 'stretch' }} ></Image>
        </TouchableOpacity>
        <View style={{ width: 100, height: 30, flexDirection: 'row', alignItems: 'center', marginTop: 5, marginLeft: 70, position: 'absolute', bottom: 5, right: 0 }}>
          <TouchableOpacity style={{ width: 28, height: 28, borderRadius: 20, backgroundColor: '#FFE2E6', justifyContent: 'center' }}
            onPress={mpress}>
            <Text style={{ textAlign: 'center', fontSize: 25, color: 'red', top: -4 }}>-</Text>
          </TouchableOpacity>
          <Text style={{ marginHorizontal: 10, color: Mycolors.Black }}>{qty}</Text>
          <TouchableOpacity style={{ width: 28, height: 28, borderRadius: 20, backgroundColor: 'red', justifyContent: 'center' }}
            onPress={apress}>
            <Text style={{ textAlign: 'center', fontSize: 25, color: '#fff', top: -3 }}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <View>
      <HomeHeader height={60} paddingHorizontal={15} backgroundColor={'#fff'}
          press1={() => { props.navigation.goBack() }} img1={require('../../../assets/arrow.png')} img1width={18} img1height={15}
          press2={() => { }} title2={'Cart'} fontWeight={'500'} img2height={20}
          press3={() => { }} img3width={25} img3height={25} />
      </View>
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}

          />
        }
      >
      

        <View style={{ width: '92%', alignSelf: 'center',marginTop:8 }}>



          {resData.length > 0 ?
            resData.map((item, index) => {
              return (
                <View>
                  {flatliistDesign(item.image, item.category, item.name, '$' + item.price, () => { putcart(item, '-') }, () => { putcart(item, '+') }, () => { deletcart(item) }, item.quantity)}
                </View>
              )
            }
            )
            : null
          }
          {resData.length > 0 ?
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 8, width: '100%',marginTop:18 }}>
                <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 14, }} >Choose Delivery Address</Text>
                {/* <Text style={{ color: Mycolors.RED, fontSize: 13, }} onPress={() => { setShippingAddressPopUp(true) }}>Add Address</Text> */}
                <Text style={{ color: Mycolors.RED, fontSize: 13, }} onPress={() => { setChooseAddressModeModal(true) }}>Choose Address</Text>
              </View>
              {selectedAddress != null ?
                <View style={{
                  width: '100%', marginHorizontal: 5, marginVertical: 5, padding: 12, backgroundColor: '#fff',
                  // borderColor: '#dee4ec',
                  // borderWidth: 1,
                  shadowOffset: {
                    width: 0,
                    height: 10
                  },
                  shadowRadius: 1,
                  shadowOpacity: 0.9,
                  shadowColor:'#555555',
                  elevation: 5, borderRadius: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
                }}
                >

                  <View>
                    <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }}>{selectedAddress.location_name}</Text>
                    <Text style={{ fontSize: 13, marginVertical: 5, color: '#000' }}>{selectedAddress.address_line1} , {selectedAddress.city} , {selectedAddress.state}</Text>
                    <Text style={{ fontSize: 13, color: '#000' }}>{selectedAddress.address_line2}</Text>
                  </View>

                  <TouchableOpacity style={{ width: 25, height: 25, alignSelf: 'center' }} onPress={() => { setaddressList(true) }}>
                    <Image source={require('../../../assets/arrow_right_black.png')} style={{ width: 25, height: 25, resizeMode: 'stretch' }} ></Image>
                  </TouchableOpacity>

                </View>
                : null}
                
              <View style={{ width: '100%', marginHorizontal: 5, height: 100, borderRadius: 2, marginTop: 10, alignSelf: 'center' }}>

                <TextInput
                  value={cookingIns}
                  onChangeText={(e) => setcookingIns(e)}
                  placeholder={'Add Cooking Instructions'}
                  placeholderTextColor="#bbbbbb"
                  multiline={true}
                  // maxLength={500}
                  // keyboardType="number-pad"
                  autoCapitalize='none'
                  style={{
                    paddingLeft: 15,
                    width: '100%',
                    fontSize: 13,
                    borderColor: 'rgba(0,0,0,0.2)',
                    borderWidth: 0.5,
                    // backgroundColor: '#34333a',
                    color: '#fff',
                    height: 80,
                    borderRadius: 5,
                    paddingHorizontal: 15,
                    paddingVertical: 10,
                    color: Mycolors.Black
                  }}
                />

              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5, width: '100%' }}>
                <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 14, }} >Coupons</Text>
                <Text style={{ color: Mycolors.RED, fontSize: 13, }} onPress={() => { setmodlevisual(true) }}>View All</Text>
              </View>

              <View style={{ width: dimensions.SCREEN_WIDTH - 30, marginTop: 3, alignSelf: 'center',marginBottom:15 }}>

                <TextInput
                  value={promocode}
                  onChangeText={(text) => {
                    setpromocode(text)
                  }}
                  placeholder="Promo Code"
                  placeholderTextColor={Mycolors.placeholdercolor}
                  style={[styles.input, { paddingRight: 70 }]}
                />
                <View style={{ position: 'absolute', right: 3, top: 3, backgroundColor: 'red', paddingHorizontal: 10, height: 40, justifyContent: 'center', borderRadius: 5 }}>
                  <TouchableOpacity onPress={() => { applyCoupan() }} style={{ with: '100%', height: '100%', justifyContent: 'center', }}>
                    <Text style={{ textAlign: 'center', color: '#fff' }}>Apply</Text>
                  </TouchableOpacity>
                </View>
              </View>

              

              {applyedCoupen != '' ?
                <View style={{
                  width: '100%', marginHorizontal: 5, marginVertical: 5, padding: 12, backgroundColor: '#fff',
                  borderColor: '#dee4ec', borderWidth: 1, elevation: 5, borderRadius: 7, alignSelf: 'center', flexDirection: 'row', alignItems: 'center'
                }}
                >
                  <View style={{ width: 25, height: 25, alignSelf: 'center', borderRadius: 2, borderWidth: 0.5, borderColor: '#dee4ec' }}>
                    <Image source={{ uri: applyedCoupen.image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 2, resizeMode: 'stretch' }} ></Image>
                  </View>
                  <View style={{ marginLeft: 10, width: '63%' }}>
                    <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13 }} >{applyedCoupen.coupon_desc}</Text>
                    <Text style={{ color: Mycolors.GREEN, fontSize: 11, marginTop: 5 }} >Save ${applyedCoupen.discount_value} with this code</Text>
                  </View>
                  <View style={{ position: 'absolute', right: 10, top: 10 }}>
                    <View style={{ width: 80, }}>
                      <TouchableOpacity onPress={removeCoupan} style={{backgroundColor: 'red', paddingHorizontal: 10, height: 30, justifyContent: 'center', alignItems:'center', borderRadius: 5}} >
                        <Text style={{color:'white', textAlign:'center'}}>Remove</Text>
                      </TouchableOpacity>
                      <MyButtons title={applyedCoupen.coupon_code} height={27} width={'100%'} borderRadius={15} alignSelf="center" press={() => {
                        setpromocode(applyedCoupen.coupon_code)
                        setdiscount_id(applyedCoupen.discount_id)
                      }} marginHorizontal={20} fontSize={12}
                        titlecolor={Mycolors.RED} borderColor={Mycolors.RED} borderWidth={0.5} backgroundColor={'transparent'} fontWeight={'300'} />
                    </View>
                  </View>
                </View>
                : null
              }

              <View style={{
                width: '100%', marginHorizontal: 5, marginVertical: 5, padding: 10, backgroundColor: '#fff',
                 elevation: 5, borderRadius: 7, alignSelf: 'center'
              }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between',paddingHorizontal:5 }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, fontWeight: '600' }} >Sub Total</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >${subTotal}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5,paddingHorizontal:5 }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, }} >Delivery Charges</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >${dilivery}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5,paddingHorizontal:5 }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, }} >Vendor Charges</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >${vendorCharges}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5,paddingHorizontal:5 }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, }} >Taxes</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >${parseFloat(Number(taxes).toFixed(2))}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5,paddingHorizontal:5 }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, }} >Discount</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >-${discountPrice}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10,backgroundColor:'#ADC430',height:46,alignItems:"center",borderRadius:7 ,padding:10}}>
                  <Text style={{ color: Mycolors.Black, fontSize: 14, fontWeight: '600' }} >Total Cost</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 14,  fontWeight: '600',textAlign:'center' }} >${parseFloat(Number(totla).toFixed(2))}</Text>
                </View>
              </View>

              <View style={{ width: '95%', alignSelf: 'center', marginTop: 25 }}>
                <MyButtons title="Proceed to payment" height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => {
                  if (selectedAddress != null) {
                    props.navigation.navigate('ShopPayment', { address: selectedAddress, orderType: ordertype, cooking: cookingIns })
                  } else {
                    Alert.alert('Please Add Address')
                  }

                }} marginHorizontal={20} fontSize={14}
                  titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />
              </View>

            </View>
            :
            <View style={{ justifyContent: 'center', alignSelf: 'center', height: dimensions.SCREEN_HEIGHT - 250 }}>
              <Image style={{ width: 150, height: 150, alignSelf: 'center' }} source={require('../../../assets/Cart.png')}></Image>
              <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 20, color: '#000' }}>Your cart is empty.</Text>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 4, color: '#000' }}> Please add </Text>
                <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 4, color: 'red', textDecorationLine: 'underline' }} onPress={() => { props.navigation.navigate('ShopEat') }}>items </Text>
                <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 4, color: '#000', }}>to order.</Text>

              </View>
            </View>
          }


        </View>


        <View style={{ height: 100 }} />
      </ScrollView>

      {modlevisual ?
        <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH, height: dimensions.SCREEN_HEIGHT, backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', left: 0, top: 0, justifyContent: 'center' }} onPress={() => { setmodlevisual(false) }}>
          <View style={{ height: 300, backgroundColor: '#fff', borderRadius: 30, position: 'absolute', width: '95%', borderColor: '#fff', borderWidth: 0.3, alignSelf: 'center', padding: 10 }}>

            {
              rescopun.map((item, index) => {
                return (
                  <View style={{
                    width: '100%', marginHorizontal: 5, marginVertical: 5, padding: 10, backgroundColor: '#fff',
                    borderColor: '#dee4ec', borderWidth: 1, elevation: 5, borderRadius: 7, alignSelf: 'center', flexDirection: 'row', alignItems: 'center'
                  }}
                  >
                    <View style={{ width: 25, height: 25, alignSelf: 'center', borderRadius: 2, borderWidth: 0.5, borderColor: '#dee4ec' }}>
                      <Image source={{ uri: item.image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 2, resizeMode: 'stretch' }} ></Image>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13 }} >{item.coupon_name}</Text>
                      <Text style={{ color: Mycolors.GREEN, fontSize: 11, marginTop: 5 }} >Save ${item.discount_value} with this code</Text>
                    </View>
                    <View style={{ position: 'absolute', right: 10, top: 10 }}>
                      <View style={{ width: 80, }}>
                        <MyButtons title={item.coupon_code} height={27} width={'100%'} borderRadius={15} alignSelf="center" press={() => {
                          setpromocode(item.coupon_code)
                          setdiscount_id(item.discount_id)
                          setmodlevisual(false)
                        }} marginHorizontal={20} fontSize={12}
                          titlecolor={Mycolors.RED} borderColor={Mycolors.RED} borderWidth={0.5} backgroundColor={'transparent'} fontWeight={'300'} />
                      </View>
                    </View>
                  </View>
                )
              }
              )
            }







          </View>

        </TouchableOpacity>
        : null
      }

      {ShippingAddressPopUp ?
        <View style={{ width: dimensions.SCREEN_WIDTH, height: dimensions.SCREEN_HEIGHT, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>

          <View style={{ width: '100%', height: dimensions.SCREEN_HEIGHT * 80 / 100, position: 'absolute', bottom: 0, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: '#fff' }}>
            <KeyboardAwareScrollView>



              <View style={{ marginTop: 15, height: 30, flexDirection: "row", justifyContent: "center", alignItems: 'center' }}>
                <Text style={{ marginTop: 2, marginLeft: 10, textAlign: 'center', fontSize: 20, color: '#000000', fontWeight: '500' }}>Add Address</Text>


              </View>
              <TouchableOpacity onPress={() => { setShippingAddressPopUp(false) }}
                style={{ position: "absolute", width: 30, borderRadius: 35, height: 30, right: 10, top: 10 }}>
                <Image
                  source={require('../../../assets/crossed.png')}
                  style={{
                    width: 35,
                    height: 35, alignSelf: 'center'
                  }}

                />
              </TouchableOpacity>
              <TextInput style={styles.textInput}
                placeholder='Full Name'
                placeholderTextColor="#8F93A0"
                label="full name"
                value={full_name}
                onChangeText={e => setfull_name(e)}
              />
              {/* <TextInput style={styles.textInput}
                                          placeholder='Phone number'
                                          placeholderTextColor="#8F93A0"
                                          maxLength={12}
                                          label="phone"
                                          value={phone}
                                          onChangeText={e => setphone(e)}
                                      /> */}
              <TextInput style={styles.textInput}
                placeholder='Zip code'
                placeholderTextColor="#8F93A0"
                label="pincode"

                maxLength={9}
                value={pincode}
                onChangeText={e => setpincode(e)}
              />
              <TextInput style={styles.textInput}
                placeholder='State'
                placeholderTextColor="#8F93A0"
                label="state"
                value={state}
                onChangeText={e => setstate(e)}
              />
              <TextInput style={styles.textInput}
                placeholder='City'
                placeholderTextColor="#8F93A0"
                label="ity"
                value={city}
                onChangeText={e => setCity(e)}
              />
              <TextInput style={styles.textInput}
                placeholder='Address'
                placeholderTextColor="#8F93A0"
                value={house_no}
                onChangeText={e => sethouse_no(e)}
              />
              <TextInput style={styles.textInput}
                placeholder='Area Colony'
                placeholderTextColor="#8F93A0"
                label="area village"
                value={area_village}
                onChangeText={e => setarea_village(e)}
              />
              <TextInput style={styles.textInput}
                placeholder='Landmark'
                placeholderTextColor="#8F93A0"
                label="landmark"
                value={landmark}
                onChangeText={e => setlandmark(e)}
              />

              <View style={{ height: 45, width: "98%", marginTop: 14, alignItems: 'flex-start', justifyContent: "flex-start", marginLeft: 10 }}>

                <Text style={{ color: 'black', textAlign: "left", fontSize: 16, fontWeight: "400" }}>Address Type</Text>

                <View style={{ height: 45, width: "90%", marginTop: 5, alignItems: 'center', justifyContent: "flex-start", flexDirection: "row" }}>

                  <View
                    style={{
                      marginLeft: 10,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      height: 40,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setaddress_type('1')
                      }}>

                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <View style={{ width: 17, height: 17, borderRadius: 15, borderColor: '#000', borderWidth: 0.5, justifyContent: 'center' }}>
                          <View style={{ width: 12, height: 12, borderRadius: 15, justifyContent: 'center', alignSelf: 'center', backgroundColor: address_type == '1' ? '#000' : 'transparent' }} />
                        </View>
                        <Text
                          style={{
                            fontWeight: "500",
                            textAlign: 'left',
                            fontSize: 11,
                            color: "black",
                            marginLeft: 3
                          }}>
                          Home
                        </Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      marginLeft: 30,
                      justifyContent: 'center',
                      flexDirection: 'row',
                      height: 40,
                    }}>
                    <TouchableOpacity
                      onPress={() => {
                        setaddress_type('2')
                      }}>

                      <View
                        style={{
                          flex: 1,
                          flexDirection: 'row',
                          justifyContent: 'flex-start',
                          alignItems: 'center',
                        }}>
                        <View style={{ width: 17, height: 17, borderRadius: 15, borderColor: '#000', borderWidth: 0.5, justifyContent: 'center' }}>
                          <View style={{ width: 12, height: 12, borderRadius: 15, justifyContent: 'center', alignSelf: 'center', backgroundColor: address_type == '2' ? '#000' : 'transparent' }} />
                        </View>

                        <Text
                          style={{
                            fontWeight: "500",
                            textAlign: 'left',
                            fontSize: 11,
                            color: "black",
                            marginLeft: 4
                          }}>
                          Work
                        </Text>
                      </View>

                    </TouchableOpacity>
                  </View>

                </View>
              </View>
              {/* <View style={{ justifyContent: "center", alignItems: "center", marginBottom: 0, flexDirection: 'row', height: 34, marginHorizontal: 20, marginTop: 60 }}>
                                          <TouchableOpacity
                                              onPress={() => {AddAddress()}} >
                                              <View style={{ justifyContent: 'center', width: 200, flex: 1, backgroundColor: '#ffcc00', borderRadius: 50 }}>
                                                  <Text style={{textAlign:'center'}}>Save</Text>
                                              </View>
                                          </TouchableOpacity>
                                      </View> */}
              <View style={{ width: '70%', alignSelf: 'center', marginTop: 55 }}>
                <MyButtons title={edit ? "Update" : "Save"} height={40} width={'100%'} borderRadius={5} alignSelf="center" press={() => {
                  edit ? UpdateAddress() : AddAddress()
                }} marginHorizontal={20} fontSize={11}
                  titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />
              </View>

              <View style={{ width: '100%', height: 200 }}></View>

              {loading ? <Loader /> : null}
            </KeyboardAwareScrollView>


          </View>


        </View>
        :
        null
      }


      {addressList ?
        <View style={{ width: dimensions.SCREEN_WIDTH, height: dimensions.SCREEN_HEIGHT, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <View style={{ width: '100%', height: dimensions.SCREEN_HEIGHT * 80 / 100, position: 'absolute', bottom: 0, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: '#fff' }}>

            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={() => { setaddressList(false) }}
                style={{ position: "absolute", width: 30, borderRadius: 35, height: 30, right: 10, top: 10 }}>
                <Image
                  source={require('../../../assets/crossed.png')}
                  style={{
                    width: 35,
                    height: 35, alignSelf: 'center'
                  }}

                />
              </TouchableOpacity>
              <Text style={{ marginLeft: 15, marginTop: 15, textAlign: 'left', fontSize: 17, color: '#000000', fontWeight: "500" }}>Select Delivery Address</Text>
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "flex-start",
                  flexDirection: "row",
                  height: '78%',
                  marginHorizontal: 10,
                  marginTop: 10,
                  marginBottom: 200
                }}>

                {addressListData != null ?
                  <FlatList
                    vertical
                    data={addressListData}
                    keyExtractor={(item, index) => String(index)}

                    renderItem={({ item, index }) => {
                      // console.warn('checked ----------->', item, props?.route?.params?.address)
                      return <View style={{
                        width: '95%',
                        height: 150,
                        marginHorizontal: 10,
                        // marginLeft: 10,
                        // marginRight: 15,
                        shadowColor: '#000000',
                        // shadowOffset: { width: 0, height: 4 },
                        shadowRadius: 6,
                        shadowOpacity: 0.2,
                        //elevation: 3,
                        borderRadius: 20,
                        borderColor: "#ffcc00",
                        borderWidth: 1,
                        // backgroundColor: 'red'
                        marginTop: 8,
                        marginBottom: addressListData.length - 1 == index ? 100 : 10
                      }}>
                        <View style={{ flexDirection: 'column' }}>
                          <View style={{ height: 30, flexDirection: 'row', marginLeft: 15 }}>
                            <View style={{ width: 25, height: 50, justifyContent: "center", alignItems: 'center', marginTop: 15, left: 6 }} >

                            </View>
                            <View style={{ flex: 1, marginTop: 10, left: 20, }}>
                              <Text style={{ textAlign: 'left', fontSize: 12, color: '#000000', fontWeight: "500", fontSize: 16 }}>{item.location_name}</Text>
                            </View>

                          </View>
                        </View>

                        <View style={{ marginHorizontal: 10, marginLeft: 50, width: "80%", right: -9, height: 65, marginTop: 5, paddingVertical: 4 }}>
                          <ScrollView>
                            <Text style={{ textAlign: 'left', fontSize: 14, color: '#676767', fontWeight: '400' }}>{item.address_line1},  {item.city}, {item.state},</Text>
                            <Text style={{ textAlign: 'left', fontSize: 14, color: '#676767', fontWeight: '400', marginTop: 4 }}>{item.address_line2} </Text>
                          </ScrollView>
                        </View>


                        <View style={{ flexDirection: 'row', left: 30, marginTop: 10, position: "absolute", bottom: 10 }}>

                          <View style={{ width: 25, height: 25, justifyContent: "center", alignItems: 'center', marginTop: 10, left: 27 }}>
                            <TouchableOpacity onPress={() => {

                              setfull_name(item.location_name)
                              setaddress_type(item.location_type)
                              setlat(item.latitude)
                              setlan(item.longitude)
                              sethouse_no(item.address_line1)
                              setarea_village(item.address_line2)
                              setCity(item.city)
                              setstate(item.state)
                              setAddressId(item.id)
                              setShippingAddressPopUp(true)
                              setaddressList(false)
                              setedit(true)
                            }}>
                              <Image source={require('../../../assets/pen.png')}
                                style={{ width: 25, height: 25 }} />
                            </TouchableOpacity>

                          </View>



                          <View style={{ width: 25, height: 25, justifyContent: "center", alignItems: 'center', borderRadius: 20 / 2, marginTop: 10, left: 57, }}>
                            <TouchableOpacity onPress={() => { deletAddress(item) }}>
                              <Image source={require('../../../assets/bin.png')}
                                style={{ width: 25, height: 25 }} />
                            </TouchableOpacity>
                          </View>

                          <TouchableOpacity style={{ width: 170, height: 30, justifyContent: "center", alignItems: 'center', borderRadius: 20, marginTop: 9, left: 80, backgroundColor: "red" }}
                            onPress={() => {
                              setselectedAddress(item)
                              setaddressList(false)
                            }}>
                            <View style={{}}>
                              {/* <Image source={require('../assets/buttonSave.png')}
                                                    /> */}
                              <Text style={{ color: '#FFFFFF', fontWeight: "600", fontSize: 12, textAlign: 'left' }}>Select Address</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    }
                    }
                  />
                  : null}
              </View>

            </View>
            <View style={{ width: '90%', alignSelf: 'center', position: 'absolute', bottom: 100 }}>
              <MyButtons title="Add New Address" height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => {
                // setShippingAddressPopUp(true)
                setaddressList(false)
                setChooseAddressModeModal(true)
              }} marginHorizontal={20} fontSize={11}
                titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />
            </View>

          </View>
        </View>
        :
        null
      }
      <Modal
                isVisible={chooseAddressModeModal}
                swipeDirection="down"
                onBackdropPress={() => setChooseAddressModeModal(false)}
                onSwipeComplete={(e) => {
                    setChooseAddressModeModal(false)
                }}
                scrollTo={() => { }}
                scrollOffset={1}
                onModalWillShow={()=>{setAddressMode('1')}}
                propagateSwipe={true}
                coverScreen={false}
                backdropColor='transparent'
                style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <View style={{ height: '40%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal:20 }}>
                    <Text style={{ fontSize: 22, fontWeight: '700', color: '#455A64', textAlign: 'center', marginBottom: 25, marginTop: 30 }}>Choose Address Method</Text>
                    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

                        <TouchableWithoutFeedback onPress={()=>{setAddressMode('1')}}>
                          <View style={styles.radioButtonContainer}>
                            <MaterialCommunityIcons name={'1' === addressMode ? "radiobox-marked":"radiobox-blank"} color={'#455A64'} size={24} />
                            <Text style={{ color: '#455A64', fontWeight: '600', fontSize: 14, marginLeft:10}} >Enter Complete Address</Text>
                          </View>
                        </TouchableWithoutFeedback>  
                        
                        <TouchableWithoutFeedback style={{marginTop:15}} onPress={()=>{setAddressMode('2')}}>
                          <View style={styles.radioButtonContainer}>
                            <MaterialCommunityIcons name={'2' === addressMode ? "radiobox-marked":"radiobox-blank"} color={'#455A64'} size={24} />
                            <Text style={{ color: '#455A64', fontWeight: '600', fontSize: 14, marginLeft:10}} >Search Address</Text>
                          </View>
                        </TouchableWithoutFeedback>  
                        <TouchableWithoutFeedback style={{marginTop:15}} onPress={()=>{setAddressMode('3')}}>
                          <View style={styles.radioButtonContainer}>
                            <MaterialCommunityIcons name={'3' === addressMode ? "radiobox-marked":"radiobox-blank"} color={'#455A64'} size={24} />
                            <Text style={{ color: '#455A64', fontWeight: '600', fontSize: 14, marginLeft:10}} >Current Address</Text>
                          </View>
                        </TouchableWithoutFeedback>

                        <View style={{height:30}} />
                        <MyButtons title={"Save"} height={50} width={'100%'} borderRadius={5} alignSelf="center" press={openAddressModel} marginHorizontal={20} fontSize={11}
                  titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />

                        {/* <MyButtons title="Submit" height={45} width={'50%'} borderRadius={10} alignSelf="center" press={openAddressModel} marginHorizontal={20} fontSize={11}
                          titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.GREEN}  />   */}

                    </ScrollView>

                </View>
            </Modal>
            <Modal
                isVisible={openGoogleAddressModal}
                swipeDirection="down"
                onBackdropPress={() => setOpenGoogleAddressModal(false)}
                onSwipeComplete={(e) => {
                    setOpenGoogleAddressModal(false)
                }}
                scrollTo={() => { }}
                scrollOffset={1}
                propagateSwipe={true}
                coverScreen={false}
                backdropColor='transparent'
                style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
            >
                <View style={{ height: '40%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal:20 }}>
                    <Text style={{ fontSize: 18, fontWeight: '700', color: '#455A64', textAlign: 'center', marginBottom: 20, marginTop: 30 }}>Search Address</Text>
                    <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} keyboardShouldPersistTaps="handled" >

                    <GooglePlacesAutocomplete
            placeholder="Add Location"
            textInputProps={{
              placeholderTextColor: '#c9c9c9',
              // placeholderTextColor: Colors.BLACK,
              returnKeyType: 'search',
              // onFocus: () => setShowPlacesList(true),
              // onBlur: () => setShowPlacesList(false),
              multiline:true,
              // onTouchStart: ()=>{downButtonHandler()}
              height:55,
            }}
            enablePoweredByContainer={false}
            listViewDisplayed={'auto'}
            styles={styles.searchbar}
            onPress={(data, details = null) => {
              // 'details' is provided when fetchDetails = true
              // setShowPlacesList(false)
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
            query={{
              key: GOOGLE_MAPS_APIKEY,
              language: 'en',
            }}
          />
                        

                        <View style={{height:20}} />
                        <MyButtons title={"Save"} height={40} width={'100%'} borderRadius={5} alignSelf="center" press={AddAddressUsingGoogleSearch} marginHorizontal={20} fontSize={11}
                  titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />

                        {/* <MyButtons title="Submit" height={45} width={'50%'} borderRadius={10} alignSelf="center" press={openAddressModel} marginHorizontal={20} fontSize={11}
                          titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.GREEN}  />   */}

                    </ScrollView>

                </View>
            </Modal>
            {My_Alert ? <MyAlert sms={alert_sms} okPress={()=>{setMy_Alert(false)}} /> : null }
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
    height: 45,
    width: '100%',
    // fontSize: 12,
    borderColor: 'transparent',
    borderWidth: 1,
    borderRadius: 5,
    color: Mycolors.TEXT_COLOR,
    paddingLeft: 15,

    backgroundColor: Mycolors.BG_COLOR,
    top: 1
  },
  textInput: {
    marginTop: 14, borderRadius: 10, marginHorizontal: 20, paddingLeft: 15,
    flexDirection: 'row',
    height: 45,
    shadowColor: '#11032586',
    backgroundColor: 'white',
    alignItems: 'center',
    borderColor: "#D7D7D7",
    borderWidth: 1,
    flexDirection: 'column',
    justifyContent: "center", color: 'black',
    fontWeight: '400',
    fontSize: 14,
  },
  radioButtonContainer:{
    flexDirection:'row',
    alignItems:'center',
  },
  searchbar: {
    description: {
      fontWeight: 'bold',
    },
    predefinedPlacesDescription: {
      color: '#1faadb',
    },
    textInputContainer: {
      backgroundColor: 'rgba(0,0,0,0)',
      // top: 50,
      // width: width - 10,
      borderWidth: 0,
      marginTop:5,
    },
    textInput: {
      paddingLeft: 15,
      width: '100%',
      fontSize: 13,
      borderColor: 'rgba(0,0,0,0.2)',
      borderWidth: 0.5,
      // backgroundColor: '#34333a',
      color: '#fff',
      height: 80,
      borderRadius: 5,
      paddingHorizontal: 15,
      paddingVertical: 10,
      color: Mycolors.Black
    },
    listView: {
      // backgroundColor: 'rgba(192,192,192,0.9)',
      // top: 23,
    },
  },
});
export default ShopCart










