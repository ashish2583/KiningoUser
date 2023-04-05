import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, TouchableWithoutFeedback } from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Loader from '../../../WebApi/Loader';
// import Loader2 from '../../../WebApi/Loader2';
import { baseUrl, login, shop_eat_business, requestPostApi, requestGetApi, shop_product_cart, shop_product_delete_cart_item, user_address, delete_Update_Address, shop_product_cart_apply_coupon, shop_product_coupons_userid, shop_product_remove_coupon, user_selected_address } from '../../../WebApi/Service'
import MyAlert from '../../../component/MyAlert'
import { useSelector, useDispatch } from 'react-redux';
import AntDesign from 'react-native-vector-icons/AntDesign';
import GetLocation from 'react-native-get-location'
import Toast from 'react-native-toast-message';
import Geolocation from "react-native-geolocation-service";
import { GoogleApiKey } from '../../../WebApi/GoogleApiKey'
import Geocoder from "react-native-geocoding";
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment';

const GOOGLE_MAPS_APIKEY = 'AIzaSyACzgsZq8gI9VFkOw_fwLJdmezbc4iUxiM';
Geolocation.setRNConfiguration(GoogleApiKey);
Geocoder.init(GoogleApiKey);


function newAddMinutes(time, minsToAdd) {
  function D(J) { return (J < 10 ? '0' : '') + J; };
  var piece = time.split(':');
  var mins = piece[0] * 60 + +piece[1] + +minsToAdd;
  return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
}

const ShopProduct = (props) => {
  const userdetaile = useSelector(state => state.user.user_details)
  const ProductVenderDetails = useSelector(state => state.user.productVendorDetail)
  const [searchValue, setsearchValue] = useState('')
  let selectedIndex = -1;
  let row = [];
  let prevOpenedRow;
  const [cartItems, setCartItems] = useState([
    {
      id: '1',
      title: 'Intel 3rd Gen Motherboard',
      price: 140,
      quantity: 1,
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '2',
      title: 'Intel 3rd Gen Motherboard',
      price: 140,
      quantity: 1,
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '3',
      title: 'Intel 3rd Gen Motherboard',
      price: 140,
      quantity: 1,
      img: require('../../../assets/images/images.png'),
    },
  ])

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
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [loading, setLoading] = useState(false)
  const [loading2, setLoading2] = useState(false)
  const [res, setres] = useState('')
  const [resData, setresData] = useState(null)
  const [selectedTime,setselectedTime]=useState('1')
  const [selectedTime2,setselectedTime2]=useState('')
  const [selectedSlot,setSelectedSlot]=useState({})
  
  const [takeAwayDate,setTakeAwayDate]=useState('')
  const [dayData, setDayData]=useState([{dayPart:'Day', id: 1},{dayPart:'Afternoon', id: 2},{dayPart:'Evening', id: 3}])
  const [showda, setshowda] = useState(false)
  const [refreshing, setRefreshing] = useState(false);
  const [pincode, setpincode] = useState('');
  const [state, setstate] = useState('');
  const [selectedAddress, setselectedAddress] = useState('');
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [ordertype, setordertype] = useState('delivery')
  const [promocode, setpromocode] = useState('')
  const [rescopun, setrescopun] = useState([{ "coupon_code": "KINENGO3", "coupon_name": "Dummy Coupon", "coupon_type": "flat", "discount_id": 9, "discount_value": "3.00", "expred_on": "2023-10-31", "image": "http://54.153.75.225/images/app-icons/offer2.jpg", "min_order_value": 10 }])
  const [discount_id, setdiscount_id] = useState(null)
  const [discountPrice, setdiscountPrice] = useState('0.0')
  const [dilivery, setdilivery] = useState('0.0')
  const [vendorCharges, setVendorCharges] = useState('0.0')
  const [addressMethodData, setAddressMethodData] = useState([
    {
      id: '1',
      name1: 'Enter',
      name2: 'Complete Address',
      icon: require('../../../assets/danish_complete.png')
    },
    {
      id: '2',
      name1: 'Seacrh',
      name2: 'Address',
      icon: require('../../../assets/danish_search.png')
    },
    {
      id: '3',
      name1: 'Current',
      name2: 'Address',
      icon: require('../../../assets/danish_current.png')
    },
  ])
  const [taxes, setTaxes] = useState('0.0')
  const [totla, settotal] = useState('0.0')
  const [modlevisual, setmodlevisual] = useState(false)
  const [showTimeModal, setShowTimeModal] = useState(false)
  const [timeData, setTimeData] = useState([
    {
      id:'1',
      time: '10:00 am',
    },
    {
      id:'2',
      time: '11:00 am',
    },
    {
      id:'3',
      time: '12:00 pm',
    },
    {
      id:'4',
      time: '01:00 pm',
    },
  ])
  const [addressListData, setaddressListData] = useState([])
  const [landmark, setlandmark] = useState('');
  const [address_type, setaddress_type] = useState('2');
  const [city, setCity] = useState('');
  const [full_name, setfull_name] = useState('');
  const [area_village, setarea_village] = useState('');
  const [ShippingAddressPopUp, setShippingAddressPopUp] = useState(false);
  const [house_no, sethouse_no] = useState('');
  const [phone, setphone] = useState('');
  const [AddressId, setAddressId] = useState(null)
  const [edit, setedit] = useState(false)
  const [subTotal, setsubTotal] = useState('0.0')
  const [reloades, setreloades] = useState(false)
  const [applyedCoupen, setapplyedCoupen] = useState('')
  const [chooseAddressModeModal, setChooseAddressModeModal] = useState(false);
  const [openGoogleAddressModal, setOpenGoogleAddressModal] = useState(false);
  const [addressMode, setAddressMode] = useState(null);
  const [googleAddress, setGoogleAddress] = useState('');
  const [googleLatLng, setGoogleLatLng] = useState({});
  const [loaderText, setLoaderText] = useState('');
  const [slots, setSlots] = useState([]);

  const createDate = (timeParam) => {
    let d = new Date();
    d.setHours(timeParam.split(':')[0], timeParam.split(':')[1], 0);
    return d
  }

  const getTimeSlots = (startTime, endTime) => {
    // const allTime = "10:00,15:16"
    const slotDuration = 30
    const breakDuration = 15
    // const startTime = allTime.substring(0, 5)
    // const endTime = allTime.substring(6)
    // const startTime = responseJson.body.services[j - 1].attribute_detail.substring(0, 5)
    // const endTime = responseJson.body.services[j - 1].attribute_detail.substring(6)
    const startInMinutes = startTime.split(':').reduce((a, b) => Number(a) * 60 + Number(b), 0)
    const endInMinutes = endTime.split(':').reduce((a, b) => Number(a) * 60 + Number(b), 0)
    const minutesDifferent = endInMinutes - startInMinutes
    const isAdditionalSlot = (minutesDifferent % (slotDuration + breakDuration)) >= slotDuration
    const slotsWithGap = Math.floor(minutesDifferent / (slotDuration + breakDuration))
    console.log('minutesDifferent', minutesDifferent);
    console.log('slotsWithGap', slotsWithGap);
    console.log('isAdditionalSlot', isAdditionalSlot);
    let allSlots = []
    let start = startTime
    let newTime = ''
    Array.from(Array(slotsWithGap).keys()).map((el, index) => {
      newTime = newAddMinutes(start, slotDuration)
      const slotDate = createDate(newTime)
      console.log('slotDate', slotDate);
      moment(slotDate).isBetween()
      // console.log('moment(newTime)', moment(newTime).format('HH'));
      let endHours = newTime.split(':')[0]
      let timeOfDay = ''
      // console.log('isbetween', moment(slotDate).isBetween(createDate('05:00'), createDate('12:00')));
      if(moment(slotDate).isBetween(createDate('05:00'), createDate('12:00'))){
        timeOfDay = 'day'
      }else if(moment(slotDate).isBetween(createDate('12:00'), createDate('18:00'))){
        timeOfDay = 'afternoon'
      }else if(moment(slotDate).isBetween(createDate('18:00'), createDate('22:00'))){
        timeOfDay = 'evening'
      }else if(moment(slotDate).isBetween(createDate('22:00'), createDate('05:00'))){
        timeOfDay = 'night'
      }
      console.log('timeOfDay', timeOfDay);
      // if(endHours > 5  && endHours <= 12){
      //   timeOfDay = 'day'
      // }else if(endHours > 12 && endHours <= 18){
      //   timeOfDay = 'afternoon'
      // }else if(endHours > 18 && endHours <= 22){
      //   timeOfDay = 'evening'
      // }else if(endHours > 22 || endHours <= 5){
      //   timeOfDay = 'night'
      // } 
      allSlots.push({id: String(index), start: start, end: newTime, timeOfDay })
      // allSlots.push({id: String(index), start: start, end: newTime })
      console.log('{start: start, end: newTime}', { start: start, end: newTime });
      start = newAddMinutes(newTime, Math.abs(slotDuration - breakDuration))
    })
    if (isAdditionalSlot) {
      allSlots.push({id: String(slotsWithGap?.length), start: start, end: newAddMinutes(start, slotDuration) })
    }
    console.log('setSlots', allSlots);
    setSlots(allSlots)

  }

  useEffect(() => {
    console.log('userdetaile.token', userdetaile.token);
    getcart()
    // getCopun()
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
    // getCopun()
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
  const getcart = async (callGetCopunFun = true) => {
    setLoading(true)
    const { responseJson, err } = await requestGetApi(shop_product_cart, '', 'GET', userdetaile.token)
    setLoading(false)
    // console.log('', responseJson.body.items.length)
    console.log('the res get shop_product_cart ==>>', responseJson.body)
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
          if (responseJson.body.items[i - 1].product_type != null) {
            myCartItem.push(responseJson.body.items[i - 1])
          }
        }
        setresData(myCartItem)
        // setresData(responseJson.body.items)
        setsubTotal(responseJson.body.sub_total)
        setdilivery(responseJson.body.delivery_charge)
        setVendorCharges(responseJson.body.vendor_charges)
        // console.log('nnn', responseJson.body);
        console.log('nnn', responseJson.body.business_start_time, responseJson.body.business_end_time);
        getTimeSlots(responseJson.body.business_start_time, responseJson.body.business_end_time)
        setTaxes(responseJson.body.taxes)
        settotal(responseJson.body.total)
        setreloades(!reloades)
        if (callGetCopunFun) {
          await getCopun(responseJson.body.business_id)
        }
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
  const getCopun = async (businessId) => {
    // console.log('getCopun endpoint', shop_product_coupons_userid+ProductVenderDetails.userid); 
    console.log('getCopun endpoint 2', shop_product_coupons_userid + businessId);
    setLoading(true)

    // const { responseJson, err } = await requestGetApi(shop_product_coupons_userid+ProductVenderDetails.userid, '', 'GET',  User.token)
    const { responseJson, err } = await requestGetApi(shop_product_coupons_userid + businessId, '', 'GET', userdetaile.token)
    setLoading(false)
    console.log('the res get shop_eat_coupons_userid ==>>', responseJson)
    if (responseJson.headers.success == 1) {
      setrescopun(responseJson.body)
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }

  }
  const getAddress = async (newAddressId = '') => {
    setLoading(true)
    const { responseJson, err } = await requestGetApi(user_address, '', 'GET', userdetaile.token)
    setLoading(false)
    console.log('the res get user_address get==>>', responseJson)
    if (responseJson.headers.success == 1) {
      setaddressListData(responseJson.body)
      setselectedAddress(responseJson.body.find(el => el.is_default == '1'))
      // if(newAddressId){
      //   setselectedAddress(responseJson.body.find(el=>el.id == newAddressId))
      // }else {
      //   setselectedAddress(responseJson.body[0])
      // }
    } else {
      //  setalert_sms(err)
      //  setMy_Alert(true)
    }
  }
  const getSelectedAddress = async () => {
    setLoading(true)
    const { responseJson, err } = await requestGetApi(user_selected_address, '', 'GET', userdetaile.token)
    setLoading(false)
    console.log('the res getSelectedAddress', responseJson)
    if (responseJson.headers.success == 1) {
      // setselectedAddress()
    } else {
      //  setalert_sms(err)
      //  setMy_Alert(true)
    }
  }
  const sendSelectedAddress = async (id) => {
    setLoading(true)
    const { responseJson, err } = await requestPostApi(user_selected_address + `id/${id}`, '', 'PUT', userdetaile.token)
    setLoading(false)
    console.log('the res sendSelectedAddress==>>', responseJson)
    if (responseJson.headers.success == 1) {
      // setselectedAddress()
    } else {
      //  setalert_sms(err)
      //  setMy_Alert(true)
    }
  }
  const deletAddress = async (item) => {
    console.log('itemsss', item);
    setLoading(true)

    const { responseJson, err } = await requestPostApi(delete_Update_Address + item.id, '', 'DELETE', userdetaile.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.headers.success == 1) {
      Toast.show({ text1: responseJson.headers.message })
      //  Alert.alert(responseJson.headers.message)
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
    const { responseJson, err } = await requestPostApi(delete_Update_Address + AddressId, data, 'PUT', userdetaile.token)
    setLoading(false)
    console.log('the res UpdateAddress==>>', responseJson)
    if (responseJson.headers.success == 1) {
      Toast.show({ text1: responseJson.headers.message })
      // Alert.alert(responseJson.headers.message)
      setShippingAddressPopUp(false)
      setShowTimeModal(true)
      setedit(false)
      setAddressId('')
      setfull_name('')
      setaddress_type('')
      sethouse_no('')
      setarea_village('')
      setCity('')
      setstate('')
      getAddress(AddressId)
    } else {
      // Toast.show({text1: err})
      // setalert_sms(err)
      // setMy_Alert(true)
    }
    setShippingAddressPopUp(false)
  }
  const removeCoupan = async () => {
    setLoading(true)
    var data = {
      discount_id: discount_id,
    }
    console.log('removeCoupan data', data);
    const { responseJson, err } = await requestPostApi(shop_product_remove_coupon, data, 'POST', userdetaile.token)
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
    const { responseJson, err } = await requestPostApi(user_address, data, 'POST', userdetaile.token)
    setLoading(false)
    console.log('the res user_address set==>>', responseJson)
    if (responseJson.headers.success == 1) {
      getAddress(responseJson.body.id)
      setfull_name('')
      setaddress_type('')
      sethouse_no('')
      setarea_village('')
      setCity('')
      setstate('')
      setShippingAddressPopUp(false)
    } else {
      // Toast.show({text1: err})
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
    if (googleAddress === '') {
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
    if (matches > 3) {
      matches = 3
    }
    for (let i = 0; i < matches + 1; i++) {
      lastindex = getLastIndex(addressValue)
      if (i !== 3) {
        partOfString = addressValue.substring(lastindex + 1)
        addressValue = addressValue.substring(0, lastindex)
      }
      // console.log('i', i);
      // console.log('lastindex', lastindex);
      // console.log('partOfString', partOfString);
      // console.log('addressValue', addressValue);
      if (i == 0) {
        addressData.country = partOfString?.trim()
      } else if (i == 1) {
        addressData.state = partOfString?.trim()
      } else if (i == 2) {
        addressData.city = partOfString?.trim()
      } else if (i == 3) {
        addressData.address_line1 = addressValue?.trim()
      }
      if (i == 3) {
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
    const { responseJson, err } = await requestPostApi(user_address, data, 'POST', userdetaile.token)
    setLoading(false)
    // close modal
    setOpenGoogleAddressModal(false)
    console.log('the res google user_address set==>>', responseJson)
    if (responseJson.headers.success == 1) {
      getAddress(responseJson.body.id)
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
    if (matches > 3) {
      matches = 3
    }
    for (let i = 0; i < matches + 1; i++) {
      lastindex = getLastIndex(addressValue)
      if (i !== 3) {
        partOfString = addressValue.substring(lastindex + 1)
        addressValue = addressValue.substring(0, lastindex)
      }
      // console.log('lastindex', lastindex);
      // console.log('partOfString', partOfString);
      // console.log('addressValue', addressValue);
      if (i == 0) {
        addressData.country = partOfString?.trim()
      } else if (i == 1) {
        addressData.state = partOfString?.trim()
      } else if (i == 2) {
        addressData.city = partOfString?.trim()
      } else if (i == 3) {
        addressData.address_line1 = addressValue?.trim()
      }
      console.log('addressData', addressData);
      // if(i == 3){
      //   break
      // }
    }
    setLoaderText('Your Current location')
    setLoading2(true)
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
    const { responseJson, err } = await requestPostApi(user_address, data, 'POST', userdetaile.token)
    setLoading2(false)
    // close modal
    // setOpenGoogleAddressModal(false)
    console.log('the res current user_address set==>>', responseJson)
    if (responseJson.headers.success == 1) {
      getAddress(responseJson.body.id)
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
            AddAddressUsingCurrentLoation({ lat: position.coords.latitude, lng: position.coords.longitude }, json.results[0].formatted_address)
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
  const openAddressModel = () => {
    // if(addressMode == ''){
    //    setalert_sms('Please select address method')
    //    setMy_Alert(true)
    //   return
    // }
    if (addressMode == '1') {
      setShippingAddressPopUp(true)
    } else if (addressMode == '2') {
      setOpenGoogleAddressModal(true)
    } else if (addressMode == '3') {
      myposition()
    }
    setChooseAddressModeModal(false)
    // setAddressMode('')
  }
  const applyCoupan = async () => {
    if (discount_id == null) {
      Toast.show({ text1: 'Please select any coupon' })
      // Alert.alert('Please select any coupon')
    } else {
      setLoading(true)
      var data = {
        discount_id: discount_id,
      }
      const { responseJson, err } = await requestPostApi(shop_product_cart_apply_coupon, data, 'POST', userdetaile.token)
      setLoading(false)
      console.log('the res shop_product_cart_apply_coupon==>>', responseJson)
      if (responseJson.headers.success == 1) {
        Toast.show({ text1: responseJson.headers.message })
        setdiscountPrice(responseJson.body.coupon_discount)
        setsubTotal(responseJson.body.sub_total)
        setVendorCharges(responseJson.body.vendor_charges)
        setTaxes(responseJson.body.taxes)
        setdilivery(responseJson.body.delivery_charge)
        settotal(responseJson.body.total)
        setapplyedCoupen(responseJson.body.coupon)
      } else {
        Toast.show({ text1: responseJson.headers.message })
        // setalert_sms(err)
        // setMy_Alert(true)
      }
    }

  }
  const deleteCartItems = async (id) => {
    setLoading(true)
    const { responseJson, err } = await requestPostApi(shop_product_delete_cart_item + id, '', 'DELETE', userdetaile.token)
    setLoading(false)
    console.log('the res==>>shop delete cart', responseJson)
    if (responseJson.headers.success == 1) {
      console.log('the res==>>Home.body.delete cart', responseJson.body)
      getcart(false)
    } else {
      Toast.show({ text1: err })
      //  setalert_sms(err)
      //  setMy_Alert(true)
    }

  }
  const deleteItem = ({ item, index }) => {
    // console.log('deleteItem item', item);
    deleteCartItems(item.id)
    // const cartItemsCopy = [...cartItems]
    // const remainingItems = cartItemsCopy.filter(el=>el.id !== item.id)
    // setCartItems(remainingItems)
  }

  const renderItem = ({ item, index }, onClick) => {
    const closeRow = (index) => {
      console.log('closerow');
      selectedIndex = index;
      if (prevOpenedRow && prevOpenedRow !== row[index]) {
        prevOpenedRow.close();
      }
      prevOpenedRow = row[index];
    };
    const renderRightActions = (progress, dragX, onClick) => {
      return (
        <View
          style={{
            backgroundColor: '#835E23',
            justifyContent: 'center',
            alignItems: 'flex-end',
            width: 100,
            paddingRight: 30,
            borderTopRightRadius: 15,
            borderBottomRightRadius: 15
          }}

        >
          <TouchableOpacity onPress={onClick}>
            <Image resizeMode="contain" source={require('../../../assets/images/prod_delete_icon.png')} style={{ width: 40, height: 40 }} />
          </TouchableOpacity>
        </View>
      );
    };

    const mpress = async (id) => {
      const selectedItem = resData.find(el => el.id === id)
      if (selectedItem.quantity === 1) {
        deleteCartItems(id)
        // Alert.alert('cannot reduce quantity')
        return
      }
      const data = {
        id: selectedItem.id,
        product_id: selectedItem.product_id,
        quantity: selectedItem.quantity - 1
      }
      setLoading(true)
      const { responseJson, err } = await requestPostApi(shop_product_delete_cart_item + selectedItem.id, data, 'PUT', userdetaile.token)
      setLoading(false)
      console.log('the res==>>shop update cart', responseJson)
      if (responseJson.headers.success == 1) {
        console.log('the res==>>Home.body.update cart', responseJson.body)
        getcart(false)
      } else {
        Toast.show({ text1: err })
        //  setalert_sms(err)
        //  setMy_Alert(true)
      }

    }
    const apress = async (id) => {
      const selectedItem = resData.find(el => el.id === id)
      const data = {
        id: selectedItem.id,
        product_id: selectedItem.product_id,
        quantity: selectedItem.quantity + 1
      }
      setLoading(true)
      const { responseJson, err } = await requestPostApi(shop_product_delete_cart_item + selectedItem.id, data, 'PUT', userdetaile.token)
      setLoading(false)
      console.log('the res==>>shop update cart', responseJson)
      if (responseJson.headers.success == 1) {
        console.log('the res==>>Home.body.update cart', responseJson.body)
        getcart(false)
      } else {
        Toast.show({ text1: err })
        //  setalert_sms(err)
        //  setMy_Alert(true)
      }
    }
    return (
      <View style={{ width: '100%', height: 200, alignSelf: 'center' }}>
        <Swipeable
          renderRightActions={(progress, dragX) =>
            renderRightActions(progress, dragX, onClick)
          }
          onSwipeableOpen={() => closeRow(index)}
          ref={(ref) => (row[index] = ref)}
          rightOpenValue={-100}
        >
          <View
            style={{
              paddingHorizontal: 10,
              paddingVertical: 20,
              backgroundColor: 'white',
              borderRadius: 15,
              flexDirection: 'row',
            }}
          >
            <View style={{ borderWidth: 5, borderRadius: 5, borderColor: 'rgba(255, 196, 12, 0.2)', marginRight: 20, justifyContent: 'center', borderRadius: 20, height: 100 }}>
              <Image source={{ uri: item.image }} resizeMode='contain' style={{ width: 50, height: 50, marginHorizontal: 10 }} />
            </View>
            <View>
              <Text style={{ fontSize: 16, color: '#263238' }}>{item.name}</Text>
              <Text style={{ fontSize: 16, color: '#263238', marginTop: 5 }}>${item.item_total.toFixed(2)}</Text>
              {/* <View style={{flexDirection:'row', alignItems:'center', marginTop:15}}> */}
              <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 15 }}>
                <Text style={{ fontSize: 12, color: Mycolors.GrayColor, marginRight: 10 }}>Quantity</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#FFE2E6', justifyContent: 'center', alignItems: 'center', marginRight: 10 }}
                    onPress={() => mpress(item.id)}>
                    <AntDesign
                      name='minus'
                      size={16}
                      color={'red'}
                    />
                    {/* <Text style={{textAlign:'center',fontSize:25,color:'red'}}>-</Text> */}
                  </TouchableOpacity>
                  <Text style={{ fontSize: 12, color: '#263238' }}>{item.quantity}</Text>
                  <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: 'red', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}
                    onPress={() => apress(item.id)}>
                    <AntDesign
                      name='plus'
                      size={16}
                      color={'#fff'}
                    />
                    {/* <Text style={{textAlign:'center',fontSize:25,color:'#fff'}}>+</Text> */}
                  </TouchableOpacity>
                </View>
              </View>
              {/* </View> */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 10, width: '70%' }}>
                <Text style={{ fontSize: 12, color: '#263238', textDecorationColor: '#263238', textDecorationLine: 'underline', fontWeight: 'bold' }}>View Breakup Amount</Text>
                {/* <Image resizeMode="contain" source={index == selectedIndex ? require('../../../assets/images/prod_unsel_circle.png') : require('../../../assets/images/prod_sel_circle.png')} style={{width:30, height:30}}/> */}
                <Image resizeMode="contain" source={false ? require('../../../assets/images/prod_unsel_circle.png') : require('../../../assets/images/prod_sel_circle.png')} style={{ width: 30, height: 30 }} />
              </View>
            </View>
          </View>
        </Swipeable>
      </View>
    )
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
      >
        <HomeHeader height={60} paddingHorizontal={15}
          press1={() => { props.navigation.goBack() }} img1={require('../../../assets/arrow.png')} img1width={18} img1height={15}
          press2={() => { }} title2={'Cart'} fontWeight={'500'} img2height={20}
          press3={() => { }} img3width={25} img3height={25} backgroundColor='#fff' />

        <View style={{ width: '94%', alignSelf: 'center', marginTop: 20 }}>
          {resData?.length > 0 ?
            <>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, color: Mycolors.Black, marginTop: 5, fontWeight: 'bold' }}>Total {resData?.length} items</Text>
                <Text style={{ fontSize: 13, color: '#835E23', marginTop: 5, textDecorationColor: '#835E23', textDecorationLine: 'underline' }}>Select All</Text>
              </View>

              <View style={{ marginTop: 40 }}>
                <FlatList
                  data={resData}
                  numColumns={1}
                  keyExtractor={item => item.id}
                  renderItem={(v) =>
                    renderItem(v, () => {
                      //   console.log('Pressed', v);
                      deleteItem(v);
                    })
                  }
                />

              </View>
            </>
            : null}

          {resData?.length > 0 ?
            <View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5, width: '100%' }}>
                <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 14, }} >Select PickUp Time and Date</Text>
                {/* <Text style={{ color: Mycolors.RED, fontSize: 13, }} onPress={() => { setChooseAddressModeModal(true) }}>Choose Address</Text> */}
              </View>

              <View style={{
                width: '100%', marginVertical: 5, padding: 20, backgroundColor: '#fff',
                borderColor: '#dee4ec',
                borderWidth: 1,
                elevation: 5, borderRadius: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'
              }}
              >

                <View style={{ width: '80%' }}>
                  {/* <Text style={{ fontWeight: 'bold', fontSize: 14, color: '#000' }}>{selectedAddress.location_name}</Text>
                  <Text style={{ fontSize: 13, marginVertical: 5, color: '#000' }}>{selectedAddress.address_line1} , {selectedAddress.city} , {selectedAddress.state}</Text>
                  <Text style={{ fontSize: 13, color: '#000' }}>{selectedAddress.address_line2}</Text> */}
                  {selectedTime2 !== '' ?
                  <Text style={{fontSize:11,color:Mycolors.GrayColor,fontWeight:'bold'}}>{selectedSlot?.start}-{selectedSlot?.end}</Text>
                   :null}
                </View>

                <TouchableOpacity style={{ width: 25, height: 25, alignSelf: 'center' }} onPress={() => { setShowTimeModal(true) }}>
                  <Image source={require('../../../assets/arrow_right_black.png')} style={{ width: 25, height: 25, resizeMode: 'stretch' }} ></Image>
                </TouchableOpacity>

              </View>
              {/* <View style={{width:'95%',height:100,borderRadius:2,marginTop:10,alignSelf:'center'}}>

   <TextInput
      value={cookingIns}
      onChangeText={(e) => setcookingIns(e)}
      placeholder={'Add Cooking Instructions'}
      placeholderTextColor="#bbbbbb"
      multiline={true}
    // maxLength={500}
    // keyboardType="number-pad"
      autoCapitalize = 'none'
      style={{ 
        paddingLeft: 15,
    width:'100%',
    fontSize: 13,
    borderColor: 'rgba(0,0,0,0.2)',
    borderWidth:0.5,
   // backgroundColor: '#34333a',
    color:'#fff',
    height:80,
    borderRadius:5,
    paddingHorizontal:15,
    paddingVertical:10,
    color:Mycolors.Black}}
    />

</View> */}

              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, width: '100%' }}>
                <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 14, }} >Coupons</Text>
                <Text style={{ color: Mycolors.RED, fontSize: 13, }} onPress={() => { setmodlevisual(true) }}>View All</Text>
              </View>

              <View style={{ width: '100%', marginTop: 5, marginBottom: 25, alignSelf: 'center' }}>

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
                  width: '100%', marginHorizontal: 5, marginVertical: 5, padding: 10, backgroundColor: '#fff',
                  borderColor: '#dee4ec', borderWidth: 1, elevation: 5, borderRadius: 7, alignSelf: 'center', flexDirection: 'row', alignItems: 'center'
                }}
                >
                  <View style={{ width: 25, height: 25, alignSelf: 'center', borderRadius: 2, borderWidth: 0.5, borderColor: '#dee4ec' }}>
                    <Image source={{ uri: applyedCoupen.image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 2, resizeMode: 'stretch' }} ></Image>
                  </View>
                  <View style={{ marginLeft: 10, width: '63%' }}>
                    <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13 }} >{applyedCoupen.coupon_desc}</Text>
                    <Text style={{ color: Mycolors.GREEN, fontSize: 11, marginTop: 5, marginBottom: 5 }} >Save ${parseFloat(Number(applyedCoupen.discount_value).toFixed(2))} with this code</Text>
                    <MyButtons title={applyedCoupen.coupon_code} height={27} width={'50%'} borderRadius={15} press={() => {
                      setpromocode(applyedCoupen.coupon_code)
                      setdiscount_id(applyedCoupen.discount_id)
                    }} fontSize={12}
                      titlecolor={Mycolors.RED} borderColor={Mycolors.RED} borderWidth={0.5} backgroundColor={'transparent'} fontWeight={'300'} />
                  </View>
                  <TouchableOpacity onPress={removeCoupan} style={{ paddingHorizontal: 10, height: 30, justifyContent: 'center', alignItems: 'center', borderRadius: 5 }} >
                    <Text style={{ color: 'red', textAlign: 'center' }}>Remove</Text>
                  </TouchableOpacity>
                  <View style={{ position: 'absolute', right: 10, top: 10 }}>
                    <View style={{ width: 80, }}>
                      {/* <MyButtons title={applyedCoupen.coupon_code} height={27} width={'100%'} borderRadius={15} alignSelf="center" press={()=>{
          setpromocode(applyedCoupen.coupon_code)
          setdiscount_id(applyedCoupen.discount_id)
        }} marginHorizontal={20} fontSize={12}
          titlecolor={Mycolors.RED}   borderColor={Mycolors.RED} borderWidth={0.5} backgroundColor={'transparent'} fontWeight={'300'}/> */}
                    </View>
                  </View>
                </View>
                : null
              }

              <View style={{
                width: '100%', marginHorizontal: 5, marginVertical: 5, padding: 10, backgroundColor: '#fff',
                borderColor: '#dee4ec', borderWidth: 1, elevation: 5, borderRadius: 7, alignSelf: 'center'
              }}
              >
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, fontWeight: '600' }} >Sub Total</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >${parseFloat(Number(subTotal).toFixed(2))}</Text>
                </View>
                {/* <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, }} >Delivery Charges</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >${parseFloat(Number(dilivery).toFixed(2))}</Text>
                </View> */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, }} >Vendor Charges</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >${vendorCharges}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, }} >Taxes</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >${parseFloat(Number(taxes).toFixed(2))}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 13, }} >Discount</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 13, marginTop: 5 }} >-${parseFloat(Number(discountPrice).toFixed(2))}</Text>
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}>
                  <Text style={{ color: Mycolors.Black, fontSize: 14, fontWeight: '600' }} >Total Cost</Text>
                  <Text style={{ color: Mycolors.TEXT_COLOR, fontSize: 14, marginTop: 5, fontWeight: '600' }} >${parseFloat(Number(totla).toFixed(2))}</Text>
                </View>
              </View>

              <View style={{ width: '95%', alignSelf: 'center', marginTop: 15 }}>
                <MyButtons title="Proceed to payment" height={50} width={'100%'} borderRadius={5} alignSelf="center"
                  press={() => {
                    if (selectedAddress === '') {
                      if (addressListData?.length === 0) {
                        Toast.show({ text1: 'Please add an address' })
                        return
                      } else {
                        Toast.show({ text1: 'Please select an address' })
                        return
                      }
                    }
                    props.navigation.navigate('ShopPayment', { address: selectedAddress, orderType: ordertype })
                  }}
                  marginHorizontal={20} fontSize={11}
                  titlecolor={Mycolors.BG_COLOR} backgroundColor={'#835E23'} marginVertical={0} />
              </View>

            </View>
            :
            <View style={{ justifyContent: 'center', alignSelf: 'center', height: dimensions.SCREEN_HEIGHT - 250 }}>
              <Image style={{ width: 150, height: 150, alignSelf: 'center' }} source={require('../../../assets/Cart.png')}></Image>
              <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 20, color: '#000' }}>Your cart is empty.</Text>
              <View style={{ flexDirection: 'row', alignSelf: 'center' }}>
                <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 4, color: '#000' }}> Please add </Text>
                <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 4, color: '#835E23', textDecorationLine: 'underline' }} onPress={() => { props.navigation.navigate('ShopEat') }}>items </Text>
                <Text style={{ textAlign: 'center', fontSize: 14, marginTop: 4, color: '#000', }}>to order.</Text>

              </View>
            </View>
          }


          {/* <View style={{width:'95%',alignSelf:'center',marginTop:15}}>
  <MyButtons title="Proceed to payment" height={40} width={'100%'} borderRadius={5} alignSelf="center" press={()=>{props.navigation.navigate('ShopPayment')}} marginHorizontal={20} fontSize={11}
  titlecolor={Mycolors.BG_COLOR} backgroundColor={'#835E23'} marginVertical={0}/>
</View> */}
        </View>
        <View style={{ height: 100 }} />

      </ScrollView>
      {loading ? <Loader /> : null}
      {/* {loading2 ? <Loader2 text={loaderText} /> : null} */}
      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}

      {modlevisual ?
        <View style={{ width: dimensions.SCREEN_WIDTH, height: dimensions.SCREEN_HEIGHT, backgroundColor: 'rgba(0,0,0,0.4)', position: 'absolute', left: 0, top: 0, justifyContent: 'center' }}>
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
                      <Text style={{ color: Mycolors.GREEN, fontSize: 11, marginTop: 5 }} >Save ${parseFloat(Number(item.discount_value).toFixed(2))} with this code</Text>
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

        </View>
        : null
      }

      <Modal
        isVisible={ShippingAddressPopUp}
        swipeDirection="down"
        onBackdropPress={() => setShippingAddressPopUp(false)}
        onSwipeComplete={(e) => {
          setShippingAddressPopUp(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        onModalWillShow={() => { setAddressMode('1') }}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >

        {/* <View style={{ width: dimensions.SCREEN_WIDTH, height: dimensions.SCREEN_HEIGHT, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}> */}

        <View style={{ width: '100%', height: dimensions.SCREEN_HEIGHT * 80 / 100, position: 'absolute', bottom: 0, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: '#fff' }}>
          <KeyboardAwareScrollView>



            <View style={{ marginTop: 15, height: 30, justifyContent: "center", alignItems: 'center' }}>
              {/* <View onPress={()=>{}} style={{borderBottomWidth:1, alignSelf:'center', borderColor: '#000000', marginVertical:5}} /> */}
              <TouchableOpacity
                onPress={() => setShippingAddressPopUp(false)}
                // style={{
                //   width: '20%',
                //   borderWidth: 2,
                //   borderColor: 'grey',
                //   marginBottom:5,
                //   // ...style
                // }}
                style={{ width: 50, height: 4, backgroundColor: Mycolors.GrayColor, borderRadius: 2, alignSelf: 'center', marginBottom: 5 }}
              />
              <Text style={{ marginTop: 2, textAlign: 'center', fontSize: 22, color: '#000000', fontWeight: '500' }}>Add Address</Text>


            </View>

            <TextInput style={styles.textInput}
              placeholder='Complete Address'
              placeholderTextColor="#8F93A0"
              label="complete address"
              value={full_name}
              onChangeText={e => setfull_name(e)}
            />
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

              <Text style={{ color: 'black', textAlign: "left", fontSize: 16, fontWeight: "400", marginLeft: 10 }}>Address Type</Text>

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
            <View style={{ width: '95%', alignSelf: 'center', marginTop: 55 }}>
              <MyButtons title={edit ? "Update" : "Save"} height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => {
                edit ? UpdateAddress() : AddAddress()
              }}
                // marginHorizontal={20} 
                fontSize={14}
                titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />
            </View>

            <View style={{ width: '100%', height: 200 }}></View>

          </KeyboardAwareScrollView>


        </View>


        {/* </View> */}
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
        <View style={{ height: '40%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, paddingHorizontal: 20 }}>
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
                multiline: true,
                // onTouchStart: ()=>{downButtonHandler()}
                height: 55,
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


            <View style={{ height: 20 }} />
            <MyButtons title={"Save"} height={40} width={'100%'} borderRadius={5} alignSelf="center" press={AddAddressUsingGoogleSearch} marginHorizontal={20} fontSize={11}
              titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />

            {/* <MyButtons title="Submit" height={45} width={'50%'} borderRadius={10} alignSelf="center" press={openAddressModel} marginHorizontal={20} fontSize={11}
                          titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.GREEN}  />   */}

          </ScrollView>

        </View>
      </Modal>


      <Modal
        isVisible={showTimeModal}
        swipeDirection="down"
        onBackdropPress={() => setShowTimeModal(false)}
        onSwipeComplete={(e) => {
          setShowTimeModal(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        {/* <View style={{width:dimensions.SCREEN_WIDTH,height:dimensions.SCREEN_HEIGHT,position:'absolute',top:0,bottom:0,left:0,right: 0,backgroundColor:'rgba(0,0,0,0.5)'}}> */}
        <View style={{ width: '100%', height: dimensions.SCREEN_HEIGHT * 80 / 100, position: 'absolute', bottom: 0, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: '#fff' }}>

          <View style={{ flex: 1 }}>
            {/* <TouchableOpacity onPress={() => { setaddressList(false) }}
                                          style={{ position: "absolute", width: 30,  borderRadius: 35, height: 30, right: 10, top: 10 }}>
                                          <Image
                                              source={require('../../../assets/crossed.png')}
                                              style={{
                                                  width: 35,
                                                  height: 35, alignSelf: 'center'
                                              }}

                                          />
                                      </TouchableOpacity> */}
            <TouchableOpacity style={{ width: 50, height: 4, backgroundColor: '#9B9B9B', borderRadius: 2, alignSelf: 'center', marginBottom: 30, marginTop: 10 }} onPress={() => { setShowTimeModal(false) }} />
            <Text style={{ fontSize: 22, fontWeight: '700', color: 'black', textAlign: 'center', marginBottom: 25, }}>Select PickUp Time and Date</Text>
            <View
              style={{
                justifyContent: "center",
                alignItems: "flex-start",
                
                marginHorizontal: 10,
                marginTop: 10,
                marginBottom: 200
              }}>


{
                showda ?
                  <View>
                    <DateTimePicker
                      value={new Date()}
                      mode='calendar'
                      // is24Hour={false}
                      display="spinner"
                      onChange={(event, sTime) => {
                        setshowda(false)
                        console.log(sTime.toDateString());
                        setTakeAwayDate(sTime)
                        console.log(event);
                      }}
                    />
                  </View>
                  :
                  <TouchableOpacity style={{ width: '100%', height: 50, justifyContent: 'center', backgroundColor: Mycolors.HEADERCOLOR, borderColor: 'transparent', zIndex: -999, borderRadius: 5 }}>
                    <Text style={{ fontSize: 15, color: '#000', left: 10 }} onPress={() => { setshowda(true) }}>{takeAwayDate ? takeAwayDate.toString().substring(0, 16) : 'Select Date'}</Text>
                  </TouchableOpacity>
              }
              {/* <FlatList
                data={dayData}
                horizontal={true}
                // style={{backgroundColor:'yellow', height:'auto'}}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity style={{ flexDirection: 'row', width: 100, marginRight: 10, height: 40, justifyContent: 'space-between', alignItems: 'center', borderWidth: 0.5, borderRadius: 5, paddingHorizontal: 10, borderColor: selectedTime == item.id ? '#835E23' : Mycolors.GrayColor, backgroundColor: selectedTime == item.id ? 'rgba(255, 196, 12, 0.05)' : 'transparent' }}
                      onPress={() => { setselectedTime(item.id) }}>
                      <Text style={{ fontSize: 11, color: selectedTime == item.id ? '#835E23' : Mycolors.GrayColor, textAlign: 'center', fontWeight: 'bold' }}>{item.dayPart}</Text>
                      {selectedTime == item.id ?
                        <Image source={require('../../../assets/images/product_sel_circle.png')} style={{ width: 20, height: 20, alignSelf: 'center', borderRadius: 5, resizeMode: 'stretch' }} ></Image>
                        :
                        <Image source={require('../../../assets/images/ent_unsel_circle.png')} style={{ width: 20, height: 20, alignSelf: 'center', borderRadius: 5, resizeMode: 'stretch' }} ></Image>
                      }
                    </TouchableOpacity>
                  )
                }}
                keyExtractor={item => item.id}
              /> */}
              {/* <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', marginTop: 20 }}> */}
                <Text style={{ color: Mycolors.Black, fontWeight: '500', fontSize: 13, marginTop:10, marginBottom:10 }}>Select Time Slot</Text>
              {/* </View> */}

              {/* <View style={{ width: '97%', marginTop: 10, backgroundColor:'yellow' }}> */}
                <FlatList
                  data={slots}
                  horizontal={true}
                  style={{}}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item,index})=>{
                    return(
                      <View style={{width:90,marginRight:5}}>
          <TouchableOpacity style={{width:90,height:40,justifyContent:'center',borderWidth:0.5,borderRadius:5,borderColor:selectedTime2==item.id ? '#835E23' : Mycolors.GrayColor, backgroundColor: selectedTime2==item.id ? 'rgba(255, 196, 12, 0.05)' : 'transparent'}}
          onPress={()=>{setselectedTime2(item.id); setSelectedSlot(item)}}>
  
          <Text style={{fontSize:11,color:selectedTime2==item.id ? '#835E23' : Mycolors.GrayColor,textAlign:'center',fontWeight:'bold'}}>{item.start}-{item.end}</Text>
          </TouchableOpacity>
          </View>
                    )
                  }}
                  keyExtractor={item => item.id}
                />

            {/* </View> */}
            </View>

          </View>
          <View style={{ width: '90%', alignSelf: 'center', position: 'absolute', bottom: 100 }}>
            <MyButtons title="Save" height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => {
              setShowTimeModal(false)
            }} marginHorizontal={20} fontSize={11}
              titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />
          </View>

        </View>
        {/* </View> */}
      </Modal>
      <Modal
        isVisible={chooseAddressModeModal}
        swipeDirection="down"
        onBackdropPress={() => setChooseAddressModeModal(false)}
        onSwipeComplete={(e) => {
          setChooseAddressModeModal(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        onModalWillShow={() => { setAddressMode('1') }}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '85%', backgroundColor: '#fff', borderTopLeftRadius: 20, borderTopRightRadius: 20, paddingHorizontal: 20 }}>
          <TouchableOpacity style={{ width: 50, height: 4, backgroundColor: '#9B9B9B', borderRadius: 2, alignSelf: 'center', marginBottom: 30, marginTop: 10 }} onPress={() => { setChooseAddressModeModal(false) }} />
          <Text style={{ fontSize: 22, fontWeight: '700', color: 'black', textAlign: 'center', marginBottom: 25, }}>Choose Address Method</Text>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

            {addressMethodData?.map(el =>
              <TouchableOpacity onPress={() => { setAddressMode(el.id) }} style={[styles.radioButtonContainer, el.id == addressMode ? styles.radioButtonContainerSelected : null]}>
                <View style={[styles.iconContainer, el.id == addressMode ? { backgroundColor: 'white' } : null]}>
                  <Image source={el.icon} style={{ height: 40, width: 40 }} />
                </View>
                <View>
                  <Text style={{ color: '#9B9B9B', fontWeight: '600', fontSize: 14, marginLeft: 10, fontStyle: 'italic' }} >{el.name1}</Text>
                  <Text style={{ color: 'black', fontWeight: 'bold', fontSize: 18, marginLeft: 10 }} >{el.name2}</Text>
                </View>
                {el.id == addressMode ?
                  <Image source={require('../../../assets/danish_selected.png')} style={styles.selectedCheck} />
                  : null}
              </TouchableOpacity>
            )}

            {/* <TouchableWithoutFeedback style={{marginTop:15}} onPress={()=>{setAddressMode('2')}}>
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
                        </TouchableWithoutFeedback> */}

            <View style={{ height: 30 }} />
            <MyButtons title={"Save"} height={50} width={'100%'} borderRadius={5} alignSelf="center" press={openAddressModel} marginHorizontal={20} fontSize={14}
              titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />

            {/* <MyButtons title="Submit" height={45} width={'50%'} borderRadius={10} alignSelf="center" press={openAddressModel} marginHorizontal={20} fontSize={11}
                          titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.GREEN}  />   */}

          </ScrollView>

        </View>
      </Modal>

      <Modal
        isVisible={ShippingAddressPopUp}
        swipeDirection="down"
        onBackdropPress={() => setShippingAddressPopUp(false)}
        onSwipeComplete={(e) => {
          setShippingAddressPopUp(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        onModalWillShow={() => { setAddressMode('1') }}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >

        {/* <View style={{ width: dimensions.SCREEN_WIDTH, height: dimensions.SCREEN_HEIGHT, position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}> */}

        <View style={{ width: '100%', height: dimensions.SCREEN_HEIGHT * 80 / 100, position: 'absolute', bottom: 0, borderTopRightRadius: 20, borderTopLeftRadius: 20, backgroundColor: '#fff' }}>
          <KeyboardAwareScrollView>



            <View style={{ marginTop: 15, height: 30, justifyContent: "center", alignItems: 'center' }}>
              {/* <View onPress={()=>{}} style={{borderBottomWidth:1, alignSelf:'center', borderColor: '#000000', marginVertical:5}} /> */}
              <TouchableOpacity
                onPress={() => setShippingAddressPopUp(false)}
                // style={{
                //   width: '20%',
                //   borderWidth: 2,
                //   borderColor: 'grey',
                //   marginBottom:5,
                //   // ...style
                // }}
                style={{ width: 50, height: 4, backgroundColor: Mycolors.GrayColor, borderRadius: 2, alignSelf: 'center', marginBottom: 5 }}
              />
              <Text style={{ marginTop: 2, textAlign: 'center', fontSize: 22, color: '#000000', fontWeight: '500' }}>Add Address</Text>


            </View>

            <TextInput style={styles.textInput}
              placeholder='Complete Address'
              placeholderTextColor="#8F93A0"
              label="complete address"
              value={full_name}
              onChangeText={e => setfull_name(e)}
            />
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

              <Text style={{ color: 'black', textAlign: "left", fontSize: 16, fontWeight: "400", marginLeft: 10 }}>Address Type</Text>

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
            <View style={{ width: '95%', alignSelf: 'center', marginTop: 55 }}>
              <MyButtons title={edit ? "Update" : "Save"} height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => {
                edit ? UpdateAddress() : AddAddress()
              }}
                // marginHorizontal={20} 
                fontSize={14}
                titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />
            </View>

            <View style={{ width: '100%', height: 200 }}></View>

          </KeyboardAwareScrollView>


        </View>


        {/* </View> */}
      </Modal>
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
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    borderWidth: 2,
    borderColor: '#f5f5f5',
    marginBottom: 20,
    borderRadius: 10,
  },
  radioButtonContainerSelected: {
    backgroundColor: '#F5F5F5',
    borderColor: '#D00100',
    borderWidth: 1,
    borderRadius: 20,
  },
  iconContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 10,
  },
  selectedCheck: {
    position: 'absolute',
    height: 30,
    width: 30,
    top: 10,
    right: 10
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
      marginTop: 5,
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
export default ShopProduct 