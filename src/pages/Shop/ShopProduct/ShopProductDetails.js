import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, Platform, TouchableWithoutFeedback, Linking } from 'react-native';
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
import { baseUrl, shop_eat_cart, user_payment_method, shop_eat_menu, shop_eat_orders, shop_eat_cart_book_dining, shop_eat_cart_book_table, shop_product_delete_cart_item, shop_eat_business_id, shop_eat_menu_userid, requestPostApi, requestGetApi, shop_eat, shop_product_productlist, shop_product_cart, shop_vendor_details, shop_product_similar_Products, shop_product_categories } from '../../../WebApi/Service'
import Loader from '../../../WebApi/Loader';
import MyAlert from '../../../component/MyAlert';
import { useSelector, useDispatch } from 'react-redux';
import DropDownPicker from 'react-native-dropdown-picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import openMap from 'react-native-open-maps';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import Toast from 'react-native-toast-message';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MapView, { PROVIDER_GOOGLE, Marker, Polyline, AnimatedRegion, Animated } from 'react-native-maps';
import { GoogleApiKey } from '../../../WebApi/GoogleApiKey'
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import ProductSearchInput from './components/ProductSearchInput';


function newAddMinutes(time, minsToAdd) {
  function D(J) { return (J < 10 ? '0' : '') + J; };
  var piece = time.split(':');
  var mins = piece[0] * 60 + +piece[1] + +minsToAdd;
  return D(mins % (24 * 60) / 60 | 0) + ':' + D(mins % 60);
}
const dummyImages = true
// const dummyBannerImages = [{image: `https://kinengo-dev.s3.us-west-1.amazonaws.com/uploads/products/shopping-site-2.jpg`},{image: `https://kinengo-dev.s3.us-west-1.amazonaws.com/uploads/products/shopping-sites-1.png`}]
const dummyBannerImages = [{ image: `https://kinengo-dev.s3.us-west-1.amazonaws.com/uploads/products/shopping-site-2.jpg` }, { image: `https://kinengo-dev.s3.us-west-1.amazonaws.com/uploads/products/shopping-site-2.jpg` }]
const takeAwayNonButton = true

const FoodDetails = (props) => {
  const User = useSelector(state => state.user.user_details)
  const [searchValue, setsearchValue] = useState('')
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [selectedTab, setselectedTab] = useState('Take Away')
  const [cookingIns, setcookingIns] = useState('')
  const [selectedTime, setselectedTime] = useState('')
  const [selectedTime2, setselectedTime2] = useState('')
  const [counter, setcounter] = useState(1)
  const [date, setDate] = useState('')
  const [toggleValue, setToggleValue] = useState(false);
  const [modlevisual1, setmodlevisual1] = useState(false)
  const [modlevisual2, setmodlevisual2] = useState(false)
  const [modlevisual3, setmodlevisual3] = useState(false)
  const [modlevisual4, setmodlevisual4] = useState(false)
  const [modlevisual5, setmodlevisual5] = useState(false)
  const [modlevisual6, setmodlevisual6] = useState(false)
  const [slots, setSlots] = useState([])
  const [selectedSlot, setSelectedSlot] = useState({})
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState([])
  const [menuresData, setmenuresData] = useState([])
  const [menuresData2, setmenuresData2] = useState([])
  const [similarProducts, setSimilarProducts] = useState([])
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [bannerimg, setbannerimg] = useState('')
  const [allImg, setAllImg] = useState([{ img: '' }])
  const [ClickedItemData, setClickedItemData] = useState('')
  const [diningItens, setdiningItens] = useState([])
  const [diningItens1, setdiningItens1] = useState([])
  const [reloades, setreloades] = useState(false)
  const [cartCount, setcartCount] = useState('0')
  const [futureTimes, setfutureTimes] = useState([])
  const [imgcartCount, setimgcartCount] = useState(1)
  const [timimgs, settimimgs] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  const [selectedValue, setselectedValue] = useState('Regular')
  const [menutypeOpen, setmenutypeOpen] = useState(false);
  const [menutypevalue, setmenutypevalue] = useState(null);
  const [menutypedate, setmenutypedate] = useState([
    {
      "label": "Electrical",
      "value": "Electrical"
    },
    {
      "label": "Plumbing",
      "value": "Plumbing"
    },
    {
      "label": "Farm, Pet & Ranch",
      "value": "Farm, Pet & Ranch"
    },
    {
      "label": "Hand Tools",
      "value": "Hand Tools"
    }
  ]);
  const [showda, setshowda] = useState(false)
  const [categoryData, setCategoryData] = useState([])
  const [selectedCategory, setSelectedCategory] = useState({})
  const [viewmore, setviewmore] = useState(true)
  const [mtype, setmType] = useState('standard')
  const [curentCord, setCurentCord] = useState({
    latitude: 26.4788922,
    longitude: 83.7454171,
  })
  const mapStyle = [
    { elementType: 'geometry', stylers: [{ color: '#242f3e' }] },
    { elementType: 'labels.text.fill', stylers: [{ color: '#746855' }] },
    { elementType: 'labels.text.stroke', stylers: [{ color: '#242f3e' }] },
    {
      featureType: 'administrative.locality',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'geometry',
      stylers: [{ color: '#263c3f' }],
    },
    {
      featureType: 'poi.park',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#6b9a76' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry',
      stylers: [{ color: '#38414e' }],
    },
    {
      featureType: 'road',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#212a37' }],
    },
    {
      featureType: 'road',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#9ca5b3' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry',
      stylers: [{ color: '#746855' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'geometry.stroke',
      stylers: [{ color: '#1f2835' }],
    },
    {
      featureType: 'road.highway',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#f3d19c' }],
    },
    {
      featureType: 'transit',
      elementType: 'geometry',
      stylers: [{ color: '#2f3948' }],
    },
    {
      featureType: 'transit.station',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#d59563' }],
    },
    {
      featureType: 'water',
      elementType: 'geometry',
      stylers: [{ color: '#17263c' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.fill',
      stylers: [{ color: '#515c6d' }],
    },
    {
      featureType: 'water',
      elementType: 'labels.text.stroke',
      stylers: [{ color: '#17263c' }],
    },
  ];
  const [showProductInfoModal, setShowProductInfoModal] = useState(false)

  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      vendorDetail();
      menuList(null);
      getMenuTypeDate();
      // getSimilarProducts();
    })
    return unsubscribe;
  }, [])

  const checkcon = () => {
    vendorDetail()
    menuList(menutypevalue)
    // getSimilarProducts();
  }

  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    checkcon()
    wait(2000).then(() => {
      setRefreshing(false)
    });
  }, []);

  const addMinutes = (time, minutes) => {
    var date = new Date(new Date('01/01/2015 ' + time).getTime() + minutes * 60000);
    var tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
      ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes())
      + ':' + ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
    return tempTime;
  }

  const setBannerImages = () => {
    console.log('ashish kumar verma');
    var j = 1
    for (j = 1; j <= allImg.length; j++) {
      setTimeout(() => {
        setbannerimg(allImg[j - 1])
        console.log('hii');
      }, 500)
      if (j == allImg.length) {
        j = 1
      }
    }
  }

  const A = () => {
    console.log('heooop');
    setTimeout(() => {
      var imm = allImg
      var total_len = imm.length

      console.log('total_len', total_len);
      if (total_len == imgcartCount) {
        console.log('imgcartCount', imgcartCount);
        setimgcartCount(1)
      } else {
        setimgcartCount(parseInt(imgcartCount) + parseInt(1))
      }
      setbannerimg(imm[imgcartCount - 1])
      setreloades(!reloades)
      console.log('imgggg', imm[parseInt(imgcartCount - 1)]);
      B()
    }, 5000)
  }

  const B = () => {
    A()
  }

  // const bookTables = async () => {
  //   var td = ''
  //   var tt = ''
  //   // if(date==''){
  //   // //  if(selectedTime==''){
  //   //  if(Object.keys(selectedSlot)?.length === 0){
  //   //   setalert_sms('Please Select Time Slot')
  //   //   setMy_Alert(true)
  //   //   // Alert.alert('Please Select Time Slot')
  //   //   // Toast.show('Please Select Time Slot')
  //   //  }else{
  //   //    td=new Date()
  //   //    tt=selectedSlot
  //   //  }
  //   // }

  //   if (Object.keys(selectedSlot)?.length === 0) {
  //       Toast.show({text1: 'Please Select Time Slot'}); 
  //     // setalert_sms('Please Select Time Slot')
  //     // setMy_Alert(true)
  //     return
  //   } else {
  //     tt = selectedSlot
  //   }
  //   if (date == '') {
  //     Toast.show({text1: 'Please Select Date'}); 
  //     // setalert_sms('Please Select Date')
  //     // setMy_Alert(true)
  //     return
  //   } else {
  //     td =  date

  //   }
  //   // else{
  //   //   if(selectedTime2==''){
  //   //     // Toast.show('Please Select Time Slot')
  //   //     setalert_sms('Please Select Time Slot')
  //   //   setMy_Alert(true)
  //   //     // Alert.alert('Please Select Time Slot')
  //   //    }else{
  //   //     td=date
  //   //     tt=selectedTime2
  //   //    }
  //   // }
  //   if (td != '' && tt != '') {
  //     setLoading(true)
  //     var data = {
  //       "business_id": props.route.params.data.business_id,
  //       "no_of_person": counter,
  //       "schedule_date": moment(td).format('YYYY-MM-DD'),
  //       "schedule_time_from": tt?.start,
  //       "schedule_time_to": tt?.end
  //     }
  //     console.log('bookTables data', data);
  //     const { responseJson, err } = await requestPostApi(shop_eat_cart_book_table, data, 'POST', User.token)
  //     setLoading(false)
  //     console.log('the res==>>', responseJson)
  //     if (responseJson.headers.success == 1) {
  //       // setmodlevisual3(false)
  //       // setmodlevisual4(true)
  //       // setmodlevisual1(false)
  //       // setmodlevisual2(false)
  //       setalert_sms('Booking request has been sent successfully you will receive a notification once your table is finalized.')
  //       setMy_Alert(true)
  //       // Toast.show({text1: 'Please Select Date'}); 
  //       // Alert.alert(
  //       //   '',
  //       //   'Booking request has been sent successfully you will receive a notification once your table is finalized.', // <- this part is optional, you can pass an empty string
  //       //   [
  //       //     {text: 'OK', onPress: () => props.navigation.navigate('DiningAndBookTable')},
  //       //   ],
  //       //   // {cancelable: false},
  //       // );
  //       // Alert.alert('Booking request has been sent successfully you will receive a notification once your table is finalized.')
  //     } else {
  //       setalert_sms(err)
  //       setMy_Alert(true)
  //     }
  //   } else {
  //     //Toast.show('Please Select date and time')
  //   }
  // }

  const bookTables = async () => {
    var td = ''
    var tt = ''


    if (date == '') {
      Toast.show({ text1: 'Please Select Date' })

      return
    } else {
      td = date
    }
    if (Object.keys(selectedSlot)?.length === 0) {
      Toast.show({ text1: 'Please Select Time Slot' })

      return
    } else {
      tt = selectedSlot
    }

    // else{
    //   if(selectedTime2==''){
    //     // Toast.show('Please Select Time Slot')
    //     setalert_sms('Please Select Time Slot')
    //   setMy_Alert(true)
    //     // Alert.alert('Please Select Time Slot')
    //    }else{
    //     td=date
    //     tt=selectedTime2
    //    }
    // }
    if (td != '' && tt != '') {
      setLoading(true)
      var data = {
        "business_id": props.route.params.vendorId,
        "no_of_person": counter,
        "schedule_date": moment(td).format('YYYY-MM-DD'),
        "schedule_time_from": tt?.start,
        "schedule_time_to": tt?.end
      }
      console.log('bookTables data', data);
      const { responseJson, err } = await requestPostApi(shop_eat_cart_book_table, data, 'POST', User.token)
      setLoading(false)
      console.log('the res==>>', responseJson)
      if (responseJson.headers.success == 1) {
        // setmodlevisual3(false)
        // setmodlevisual4(true)
        // setmodlevisual1(false)
        // setmodlevisual2(false)
        setalert_sms('Booking request has been sent successfully you will receive a notification once your table is finalized.')
        setMy_Alert(true)
        // Alert.alert(
        //   '',
        //   'Booking request has been sent successfully you will receive a notification once your table is finalized.', // <- this part is optional, you can pass an empty string
        //   [
        //     {text: 'OK', onPress: () => props.navigation.navigate('DiningAndBookTable')},
        //   ],
        //   // {cancelable: false},
        // );
        // Alert.alert('Booking request has been sent successfully you will receive a notification once your table is finalized.')
      } else {
        setalert_sms(err)
        setMy_Alert(true)
      }
    } else {
      //Toast.show('Please Select date and time')
    }

  }


  const putcart = async (item, add) => {
    console.log('putcart item', item);
    setLoading(true)
    var data = ''
    if (add == '+') {
      data = {
        id: item.cart_id,
        product_id: item.id,
        quantity: item.cart_quantity + 1,
      }
    } else {
      console.log('item.quantity', item);
      if (item.cart_quantity > 1) {
        data = {
          id: item.cart_id,
          product_id: item.id,
          quantity: item.cart_quantity - 1,
        }
      } else {
        console.log('detel API');
        deletcart(item)
      }
    }

    const { responseJson, err } = await requestPostApi(shop_product_delete_cart_item + item.cart_id, data, 'PUT', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        //  Toast.show(responseJson.headers.message)
        // Alert.alert(responseJson.headers.message)
        Toast.show({ text1: responseJson.headers.message });
        console.log('putcart searchValue',searchValue);
        if(searchValue?.text != ''){
          menuList(menutypevalue, searchValue?.text)
        }else{
          menuList(menutypevalue)
        }
        setreloades(!reloades)
      } else {
        Toast.show({ text1: responseJson.headers.message })
        // setalert_sms(err)
        // setMy_Alert(true)
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const deletcart = async (item) => {

    setLoading(true)

    const { responseJson, err } = await requestPostApi(shop_product_delete_cart_item + item.cart_id, '', 'DELETE', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        // Toast.show(responseJson.headers.message)
        Toast.show({ text1: responseJson.headers.message });
        if(searchValue?.text != ''){
          menuList(menutypevalue, searchValue?.text)
        }else{
          menuList(menutypevalue)
        }
        setreloades(!reloades)
      } else {
        menuList(menutypevalue)
        Toast.show({ text1: responseJson.headers.message })
        // setalert_sms(err)
        // setMy_Alert(true)
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const postcart = async (items) => {
    console.log('postcart called', items);
    // return
    // setLoading(true)
    var data = {
      product_id: items.id,
      quantity: 1,
      business_id: props.route.params.businessid,
      // business_id: props.route.params.vendorId,
      product_type: items.product_type
    }
    console.log('postcart data', data);
    const { responseJson, err } = await requestPostApi(shop_product_cart, data, 'POST', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        //  Toast.show(responseJson.headers.message)
        Toast.show({ text1: responseJson.headers.message });
        if(searchValue?.text != ''){
          menuList(menutypevalue, searchValue?.text)
        }else{
          menuList(menutypevalue)
        }
        //  props.navigation.navigate('ShopCart')
      } else {
        Toast.show({ text1: responseJson.headers.message })
        // setalert_sms(err)
        // setMy_Alert(true)
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }
  const myfun = (stime, etime) => {
    var starttime = stime;
    var interval = "30";
    var endtime = etime;
    var timeslots = [starttime];
    while (starttime != endtime) {
      starttime = addMinutes(starttime, interval);
      timeslots.push(starttime);
    }
    console.log('hello ji times===>>', timeslots);
    return timeslots;
  }

  function formatDate(date) {
    var d = new Date(date);
    var hh = d.getHours();
    var m = d.getMinutes();
    var s = d.getSeconds();
    var dd = "AM";
    var h = hh;
    if (h >= 12) {
      h = hh - 12;
      dd = "PM";
    }
    if (h == 0) {
      h = 12;
    }
    m = m < 10 ? "0" + m : m;

    s = s < 10 ? "0" + s : s;

    /* if you want 2 digit hours:
    h = h<10?"0"+h:h; */

    var pattern = new RegExp("0?" + hh + ":" + m + ":" + s);

    var replacement = h + ":" + m;
    /* if you want to add seconds
    replacement += ":"+s;  */
    replacement += " " + dd;

    return date.replace(pattern, replacement);
  }

  const goToMap = (l, n) => {
    openMap(
      {
        latitude: l,
        longitude: n,
        provider: 'google',
        //  start:'Noida ,Uttar Pradesh,India',
        end: resData.address,
      }
    );
  }

  const vendorDetail = async () => {

    setLoading(true)
    console.log('saurabh url', shop_vendor_details + props.route.params.businessid);
    const { responseJson, err } = await requestGetApi(shop_vendor_details + props.route.params.businessid, '', 'GET', User.token)
    setLoading(false)
    console.log('vendorDetail responseJson', responseJson);
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        console.log('the res shop_eat_business_id services ==>>', responseJson.body.services)
        // console.log('the res features ==>>', responseJson.body.features)
        var updated = 0
        for (let j = 1; j <= responseJson.body.services.length; j++) {
          // if (responseJson.body.services[j - 1].attribute_label == 'Book A Table' && responseJson.body.services[j - 1].attribute_value == 'yes') {
          //   console.log('kumar===>>', responseJson.body.services[j - 1].attribute_detail.substring(0, 5) + ':00');
          //   console.log('verma===>>', responseJson.body.services[j - 1].attribute_detail.substring(10, 15) + ':00');
          //   console.log('saurabh===>>', responseJson.body.services[j - 1].attribute_detail);
          //   const slotDuration = 30
          //   const breakDuration = 15
          //   const startTime = responseJson.body.services[j - 1].attribute_detail.substring(0, 5)
          //   const endTime = responseJson.body.services[j - 1].attribute_detail.substring(6)
          //   const startInMinutes = startTime.split(':').reduce((a, b) => Number(a) * 60 + Number(b), 0)
          //   const endInMinutes = endTime.split(':').reduce((a, b) => Number(a) * 60 + Number(b), 0)
          //   const minutesDifferent = endInMinutes - startInMinutes
          //   const isAdditionalSlot = (minutesDifferent % (slotDuration + breakDuration)) >= slotDuration
          //   const slotsWithGap = Math.floor(minutesDifferent / (slotDuration + breakDuration))
          //   console.log('minutesDifferent', minutesDifferent);
          //   console.log('slotsWithGap', slotsWithGap);
          //   console.log('isAdditionalSlot', isAdditionalSlot);
          //   let allSlots = []
          //   let start = startTime
          //   let newTime = ''
          //   Array.from(Array(slotsWithGap).keys()).map(el => {
          //     newTime = newAddMinutes(start, slotDuration)
          //     allSlots.push({ start: start, end: newTime })
          //     console.log('{start: start, end: newTime}', { start: start, end: newTime });
          //     start = newAddMinutes(newTime, Math.abs(slotDuration - breakDuration))
          //   })
          //   if (isAdditionalSlot) {
          //     allSlots.push({ start: start, end: newAddMinutes(start, slotDuration) })
          //   }
          //   setSlots(allSlots)
          //   console.log('all slots', allSlots);
          //   // var stimess= myfun(responseJson.body.services[j-1].attribute_detail.substring(0,5)+':00',responseJson.body.services[j-1].attribute_detail.substring(10,15)+':00')
          //   //  setfutureTimes(stimess)
          //   settimimgs(responseJson.body.services[j - 1].attribute_detail.substring(0, 5) + ':00 - ' + responseJson.body.services[j - 1].attribute_detail.substring(10, 15) + ':00')
          // }
          if (responseJson.body.services[j - 1].attribute_value == 'yes' && updated == 0) {
            console.log('setselectedTab', responseJson.body.services[j - 1].attribute_label);
            updated = 1
          }
        }
        setbannerimg(responseJson.body.bannerImages[0].image)
        var allimgs = [];
        if (dummyImages) {
          for (let i = 1; i <= dummyBannerImages.length; i++) {
            allimgs.push({ img: dummyBannerImages[i - 1].image })
          }
        } else {
          for (let i = 1; i <= responseJson.body.bannerImages.length; i++) {
            allimgs.push({ img: responseJson.body.bannerImages[i - 1].image })
          }
        }
        console.log('allimgs', allimgs);
        setAllImg(allimgs)
        setresData(responseJson.body)
        //  A()
      } else {
        Toast.show({ text1: responseJson.headers.message })
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }

  }

  const getMenuTypeDate = async () => {
    // const { responseJson, err } = await requestGetApi(shop_eat_menu_userid + props.route.params.vendorId, '', 'GET', User.token)
    const { responseJson, err } = await requestGetApi(shop_product_categories, '', 'GET', User.token)
    setLoading(false)
    console.log('getMenuTypeDate', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        setCategoryData(responseJson.body)
        // setmenutypedate(responseJson.body)
      } else {
        Toast.show({ text1: responseJson.headers.message })
        // setalert_sms(err)
        // setMy_Alert(true)
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }

  }
  const cart_Count = async () => {
    // const { responseJson, err } = await requestGetApi(shop_eat_menu_userid + props.route.params.vendorId, '', 'GET', User.token)
    const { responseJson, err } = await requestGetApi(shop_product_productlist + props.route.params.vendorId, '', 'GET', User.token)
    setLoading(false)
    console.log('the res in_cart cart_Count ==>>', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        var counts = 0
        for (let i = 1; i <= responseJson.body.products.length; i++) {
          if (responseJson.body.products[i - 1].in_cart == '1') {
            counts = parseInt(counts) + parseInt('1')
          }
        }
        setcartCount(counts)
        setreloades(!reloades)
      } else {
        Toast.show({ text1: responseJson.headers.message })
        // setalert_sms(err)
        // setMy_Alert(true)
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }

  }

  const menuList = async (dd, tt = '') => {
    cart_Count()
    console.log('menuList inside', dd, props.route.params.vendorId);
    setLoading(true)
    var urls = ''
    console.log('shop_product_productlist + props.route.params.vendorId', shop_product_productlist + props.route.params.vendorId);
    if (dd == null) {
      // urls=shop_eat_menu+props.route.params.data.userid+'?menu_type='+dd
      urls = shop_product_productlist + props.route.params.vendorId
    } else {
      urls = shop_product_productlist + props.route.params.vendorId + '?menu_type=' + dd
      // urls=shop_eat_menu_userid+props.route.params.data.userid
    }
    console.log('menuList tt', tt);
    if (tt !== '') {
      urls += '?name=' + tt
    } 
    console.log('the res in_cart shop_eat_menu_userid urls==>>', urls)
    const { responseJson, err } = await requestGetApi(urls, '', 'GET', User.token)
    setLoading(false)
    console.log('the res in_cart shop_eat_menu_userid ==>>', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        // var counts = 0
        // for (let i = 1; i <= responseJson.body.length; i++) {
        //   if (responseJson.body[i - 1].in_cart == '1') {
        //     counts = parseInt(counts) + parseInt('1')
        //   }
        // }
        // setcartCount(counts)
        setmenuresData(responseJson.body)
        setmenuresData2(responseJson.body)
        setreloades(!reloades)
      } else {
        Toast.show({ text1: responseJson.headers.message })
        // setalert_sms(err)
        // setMy_Alert(true)
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }
  const getSimilarProducts = async (dd) => {
    setLoading(true)
    console.log('similar endpoint', shop_product_similar_Products + props.route.params.category);
    const { responseJson, err } = await requestGetApi(shop_product_similar_Products + props.route.params.category, '', 'GET', User.token)
    setLoading(false)
    console.log('getSimilarProducts responseJson', responseJson)
    if (responseJson.headers.success == 1) {
      setSimilarProducts(responseJson.body)
      // var counts = 0
      // for (let i = 1; i <= responseJson.body.length; i++) {
      //   if (responseJson.body[i - 1].in_cart == '1') {
      //     counts = parseInt(counts) + parseInt('1')
      //   }
      // }
      // setcartCount(counts)
      setreloades(!reloades)
    } else {
      // setalert_sms(err)
      // setMy_Alert(true)
    }
  }

  const searchmenuList = async (tt) => {
    if (tt != '' || tt.trim().length != 0) {
      console.log('hello');
      setLoading(true)

      // const { responseJson, err } = await requestGetApi(shop_eat_menu_userid + props.route.params.vendorId + '?name=' + tt, '', 'GET', User.token)
      const { responseJson, err } = await requestGetApi(shop_product_productlist + props.route.params.vendorId + '?name=' + tt, '', 'GET', User.token)
      setLoading(false)
      console.log('the res search shop_eat_menu_userid ==>>', responseJson)
      if (responseJson !== null) {
        if (responseJson.headers.success == 1) {
          setmenuresData2(responseJson.body)
          // setsearchValue('')
        } else {
          setmenuresData2({})
          Toast.show({ text1: responseJson.headers.message })
          // Toast.show({text1: responseJson.headers.message})
          // setalert_sms(err)
          // setMy_Alert(true) 
        }
      } else {
        setalert_sms(err)
        setMy_Alert(true)
      }

    } else {
      Toast.show({ text1: 'Please enter the item name in search.' })
    }

  }

  const itemloop = (item) => {
    // diningItens.includes(item) ? true : false,
    var rdata = false
    var resdd = diningItens1
    console.log('klklkl', resdd);
    console.log('lklklklkl', item);
    for (let i = 1; i <= resdd.length; i++) {
      if (resdd[i - 1].id == item.id) {
        rdata = true
      }
    }
    return rdata;
  }

  const itemqty = (item) => {
    // diningItens.includes(item) ? true : false,
    var rdata = 1
    var resdd = diningItens1
    for (let i = 1; i <= resdd.length; i++) {
      if (resdd[i - 1].id == item.id) {
        rdata = resdd[i - 1].cart_quantity
      }
    }
    return rdata;
  }

  const plushqty = (item) => {
    // diningItens.includes(item) ? true : false,
    console.log('state1');
    var resdd = diningItens1
    for (let i = 1; i <= resdd.length; i++) {
      if (resdd[i - 1].id == item.id) {
        console.log('state2');
        resdd[i - 1].cart_quantity = parseInt(resdd[i - 1].cart_quantity) + 1
      }
    }
    console.log('state3', resdd);
    setdiningItens1(resdd)
    setreloades(!reloades)
  }

  const minus = (item) => {
    // diningItens.includes(item) ? true : false,
    var resdd = diningItens1
    for (let i = 1; i <= resdd.length; i++) {
      if (resdd[i - 1].id == item.id) {
        console.log('state2');
        if (resdd[i - 1].cart_quantity <= 1) {
          const previousSecondElementOfTheArray = resdd.splice(resdd[i - 1], 1);
        } else {
          resdd[i - 1].cart_quantity = parseInt(resdd[i - 1].cart_quantity) - 1
        }

      }
    }
    console.log('state3', resdd);
    setdiningItens1(resdd)
    setreloades(!reloades)

  }

  const design = (img, ti, tit, w, imgh, imgw, bg, redious) => {
    return (
      <View style={{ flexDirection: 'row', alignItems: 'center', width: w, marginTop: 10 }}>
        <View style={{ width: 50, height: 50, backgroundColor: bg, justifyContent: 'center', borderRadius: redious, borderColor: 'gray', borderWidth: 0.5 }}>
          <Image source={{ uri: img }} style={{ width: imgw, height: imgh, overflow: 'hidden', alignSelf: 'center' }}></Image>
        </View>
        <View style={{ marginLeft: 15, }}>
          <Text style={{ fontSize: 12, fontWeight: 'bold', color: Mycolors.Black }}>{ti}</Text>
          <Text style={{ fontSize: 12, color: Mycolors.GrayColor, top: 3 }}>{tit}</Text>
        </View>

      </View>
    )
  }

  const flatliistDesign = (img, ti, rs, des, press, allpress, item, mpress, apress, boxcolor) => {
    return (
      <TouchableOpacity style={{
        width: '100%', height: 145, marginHorizontal: 5, marginVertical: 8, padding: 10, backgroundColor: '#fff',
        // borderColor: '#dee4ec',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 10
        },
        shadowRadius: 10,
        shadowOpacity: 0.9,
        // borderWidth: 1,
        overflow: 'hidden',
        elevation: 5, borderRadius: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center'
      }}
        onPress={allpress}>
        <View style={{ width: '28%', height: 100, alignSelf: 'center', borderRadius: 10, borderWidth: 3, borderColor: '#dee4ec' }}>
          <Image source={{ uri: img }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 10, resizeMode: 'stretch' }} ></Image>
        </View>
        <View style={{ marginLeft: 15, width: '70%' }}>
          <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 9, }} >{ti}</Text>
          <View style={{ marginTop: 5, backgroundColor: '#fff', alignItems: 'flex-start', flexDirection: 'row' }}>

            <Rating
              type='custom'
              ratingCount={5}
              imageSize={12}
              startingValue={item.rating}
              // style={{alignSelf:'flex-start',backgroundColor:'#835E23'}}
              // onSwipeRating={(d)=>{setvenderRating(d)}}
              // onFinishRating={(d)=>{setvenderRating(d)}}
              readonly={true}
            />
            <Text style={{ color: 'gray', fontSize: 11, top: -2 }}> {parseFloat(Number(item.rating).toFixed(2))} Ratings</Text>
          </View>
          <Text style={{ color: '#835E23', fontWeight: '600', fontSize: 12, marginTop: 3 }} >{rs}</Text>
          {/* <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: Mycolors.GrayColor, fontWeight: '600', fontSize: 12, marginTop: 3 }} >Food Preparation Time:</Text>
            <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 3 }} >{des}</Text>
          </View> */}


          {item.in_cart != '1' ?
            <View style={{ width: 70 }}>
              <MyButtons title="ADD" height={30} width={'100%'} borderRadius={5} alignSelf="center" press={press} marginHorizontal={20} fontSize={11}
                titlecolor={Mycolors.BG_COLOR} backgroundColor={'#835E23'} marginVertical={0} />
            </View>
            :
            <View style={{ width: 100, height: 30, flexDirection: 'row', alignItems: 'center', marginTop: 5, }}>
              <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#FFE2E6', justifyContent: 'center' }}
                onPress={mpress}>
                <Text style={{ textAlign: 'center', fontSize: 25, color: '#835E23', top: -4 }}>-</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 10, color: Mycolors.Black }}>{item.cart_quantity}</Text>
              <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#835E23', justifyContent: 'center' }}
                onPress={apress}>
                <Text style={{ textAlign: 'center', fontSize: 25, color: '#fff', top: -3 }}>+</Text>
              </TouchableOpacity>
            </View>
          }
        </View>

      </TouchableOpacity>
    )
  }

  const DiningflatliistDesign = (img, ti, rs, des, press, allpress, border, plush, qty, minus, boxcolor) => {
    return (
      <TouchableOpacity style={{
        width: '95%', height: 120, marginHorizontal: 5, marginVertical: 5, padding: 10, backgroundColor: '#fff',
        borderColor: border ? 'green' : '#dee4ec',
        // borderColor: '#dee4ec',
        shadowColor: 'black',
        shadowOffset: {
          width: 0,
          height: 10
        },
        shadowRadius: 10,
        shadowOpacity: 0.9,
        // borderWidth: 1,
        overflow: 'hidden',
        elevation: 5, borderRadius: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center'
      }}
        onPress={allpress}>
        <View style={{ width: 100, height: 100, alignSelf: 'center', borderRadius: 10, borderWidth: 3, borderColor: '#dee4ec' }}>
          <Image source={{ uri: img }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 10, resizeMode: 'stretch' }} ></Image>
        </View>
        <View style={{ marginLeft: 15 }}>
          <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 9 }} >{ti}</Text>
          <Text style={{ color: Mycolors.RED, fontWeight: '600', fontSize: 12, marginTop: 6 }} >{rs}</Text>
          <View style={{ flexDirection: 'row' }}>
            <Text style={{ color: Mycolors.GrayColor, fontWeight: '600', fontSize: 12, marginTop: 6 }} >Food Preparation Time:</Text>
            <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 6 }} >{des}</Text>
          </View>



          {!border ?
            <View style={{ width: 70 }}>
              <MyButtons title="ADD" height={30} width={'100%'} borderRadius={5} alignSelf="center" press={press} marginHorizontal={20} fontSize={11}
                titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} />
            </View>
            :
            <View style={{ width: 100, height: 30, flexDirection: 'row', alignItems: 'center', marginTop: 5, }}>
              <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#FFE2E6', justifyContent: 'center' }}
                onPress={minus}>
                <Text style={{ textAlign: 'center', fontSize: 25, color: '#835E23', top: -4 }}>-</Text>
              </TouchableOpacity>
              <Text style={{ marginHorizontal: 10, color: Mycolors.Black }}>{qty}</Text>
              <TouchableOpacity style={{ width: 30, height: 30, borderRadius: 20, backgroundColor: '#835E23', justifyContent: 'center' }}
                onPress={plush}>
                <Text style={{ textAlign: 'center', fontSize: 25, color: '#fff', top: -3 }}>+</Text>
              </TouchableOpacity>
            </View>
          }
        </View>
        {/* <View style={{position:'absolute',width:20,height:20,top:10,right:10,borderRadius:3,backgroundColor:boxcolor,justifyContent:'center'}}>
  <View style={{width:10,height:10,borderRadius:10,alignSelf:'center',backgroundColor:'#fff'}} />
  </View> */}
      </TouchableOpacity>
    )
  }
  const resetStacks = (page) => {
    props.navigation.reset({
      index: 0,
      routes: [{ name: page }],
    });
  }
  const getDropdownData = () => {
    console.log('some data selectedTab', selectedTab);
    console.log('some data selectedCategory', selectedCategory, menuresData);
    console.log('some data menuresData', menuresData);
    let data = ''
    if (!selectedCategory?.category_code) {
      data = menuresData?.products
    } else {
      // const data = menuresData?.filter(item => item.product_type?.toLowerCase() === selectedTab?.toLowerCase() && item.category?.toLowerCase() == menutypevalue?.toLowerCase())
      data = menuresData?.products?.filter(item => item?.product_type?.toLowerCase() === selectedTab?.replace(' ', '')?.toLowerCase() && item?.category?.toLowerCase() == selectedCategory?.category_name?.toLowerCase())
      // menuresData?.filter(item => item.product_type?.toLowerCase() === selectedTab?.toLowerCase() && item.category?.toLowerCase() == menutypevalue?.toLowerCase())
    }
    // console.log('getDropdownData menuresData', menuresData, selectedTab);
    return (
      <>
        {data?.length > 0 ?
          data?.map(item =>
            flatliistDesign(item.image, item.name, '$' + Number(item.price).toFixed(2), item.tentative_time, () => { postcart(item) },
              () => {
                setClickedItemData(item)
                setShowProductInfoModal(true)
                setmodlevisual1(false)
                {/* setmodlevisual2(true) */ }
              },
              item, () => { putcart(item, '-') }, () => { putcart(item, '+') }, 'green'
            )
          )
          :
          <View >
            <Text style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', marginTop: 10 }}>No Items Found</Text>
          </View>
        }
      </>

    )
  }

  const design1 = (img, ti, tit, w, imgh, imgw, bg, redious, press) => {
    return (
      <View style={{
        alignItems: 'center', width: dimensions.SCREEN_WIDTH * 30 / 100, borderRadius: 15, height: 60, paddingHorizontal: 10, backgroundColor: '#FFFFFF', height: 114, borderRadius: 30, shadowColor: '#455A64',
        shadowOffset: {
          width: 0,
          height: 3
        },
        shadowRadius: 1,
        shadowOpacity: 0.8,
        elevation: 5, paddingTop: 10, marginHorizontal: 4, marginVertical: 5
      }}>
        <TouchableOpacity onPress={press ? press : () => { }}
          style={{ width: '100%', height: 70, backgroundColor: bg, justifyContent: 'center', borderRadius: redious }}>
          <Image resizeMode='stretch' source={img} style={{ width: imgw, height: imgh, overflow: 'hidden', alignSelf: 'center' }}></Image>
        </TouchableOpacity>
        <View style={{ alignItems: 'center', }}>
          <Text style={{ fontSize: 12, fontWeight: '500', color: '#455A64' }}>{ti}</Text>
        </View>
      </View>

    )
  }

  const dialCall = (num) => {
    console.log('numbers', num);
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = `tel:${num}`;
    }
    else {
      phoneNumber = `telprompt:${num}`;
    }
    console.log('phoneNumber', phoneNumber);
    Linking.openURL(phoneNumber);
  };

  const sendEmail = (myMail) => {
    console.log('sendEmail email', myMail);
    Linking.openURL(`mailto:${myMail}`)
  }

  const removeCategoryFilter = () => {
    setSelectedCategory({})
    // getDropdownData()
  }

  return (
    <SafeAreaView style={{ backgroundColor: Mycolors.BG_COLOR }}>
      <View style={{}}>
        <HomeHeader height={60} paddingHorizontal={15}
          press1={() => { props.navigation.goBack() }} img1={require('../../../assets/arrow.png')}
          img1width={30} img1height={30} img1backgroundColor={'#fff'} img1padding={5} img1borderRadius={4}
          press2={() => { }} title2={resData.name} fontWeight={'bold'} img2height={20} color={Mycolors.TEXT_COLOR}
          press3={() => { props.navigation.navigate('ShopProdCart', { vendorId: props.route.params.vendorId, businessid: props.route.params.businessid }) }} img3width={45} img3height={45}
          img3={selectedTab != 'Book A Table' && selectedTab != 'Dining' ? require('../../../assets/Cart.png') : ''}
          img3backgroundColor={'transparent'} img3padding={8} img3borderRadius={4} />
        {cartCount != '0' && selectedTab != 'Book A Table' && selectedTab != 'Dining' ?
          <View style={{ position: 'absolute', right: 8, top: 4, width: 20, height: 20, borderRadius: 20, backgroundColor: '#835E23', justifyContent: 'center', zIndex: 999 }}>
            <Text style={{ fontSize: 11, textAlign: 'center', color: '#fff' }}>{cartCount}</Text>
          </View>
          : null
        }
      </View>


      <ScrollView
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        }
      >

        <View style={{ backgroundColor: '#fff', height: dimensions.SCREEN_HEIGHT * 33 / 100, width: '100%' }}>



          <View style={{ overflow: 'hidden', top: 0, width: '100%', alignSelf: 'center', position: 'absolute', zIndex: -999 }}>
            <ImageSlider
              //  localImg={true}'
              data={allImg}
              timer={5000}
              // onClick={(item, index) => {alert('hello'+index)}}
              autoPlay={true}
              indicatorContainerStyle={{ top: -125 }}

              caroselImageStyle={{ resizeMode: 'cover' }}
              // onItemChanged={(item) => console.log("item", item)}
              closeIconColor="#fff"
            />
          </View>
        </View>
        <View style={{ width: '96%', alignSelf: 'center', backgroundColor: Mycolors.BG_COLOR }}>

          <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', alignSelf: 'center', backgroundColor: '#fff', borderRadius: 9, paddingHorizontal: 22, paddingTop: 15, top: -30 }}>
            <View>
              {/* <Text style={{ color: Mycolors.Black, fontSize: 22, fontWeight: 'bold' }}>{resData.name}</Text> */}
              <Text style={{ color: Mycolors.Black, fontSize: 22, fontWeight: 'bold' }}>{resData.business_name}</Text>
              <Text style={{ color: Mycolors.GrayColor, fontSize: 13, fontWeight: '500', marginVertical: 10 }}>E-commerce store</Text>
              <View style={{ flexDirection: 'row', marginTop: 5 }}>
                <Image source={require('../../../assets/Star.png')} style={{ width: 18, height: 18 }}></Image>
                <Text style={{ color: Mycolors.Black, fontSize: 14, fontWeight: '600', left: 5 }}>{resData.rating ? resData.rating : '0.0'}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => setmodlevisual6(true)} style={{ position: 'absolute', right: 22, top: 15, marginVertical: 4, }}>
              <AntDesign name="infocirlce" color={'#835E23'} size={24} />
              {/* <Text style={{ color: '#fd001f', fontSize: 13, fontWeight: '500', marginVertical: 4, textDecorationLine: "underline", }}>View Details</Text> */}
            </TouchableOpacity>
            <View>
              <TouchableOpacity style={{
                width: 25, height: 25, borderRadius: 5, backgroundColor: '#fff', marginTop: 10,
                shadowColor: '#000',
                shadowOffset: {
                  width: 0,
                  height: 3
                },
                shadowRadius: 1,
                shadowOpacity: 0.3,
                justifyContent: 'center',
                elevation: 5,
              }} onPress={() => { goToMap(resData.latitude, resData.longitude) }}>
                <Image source={require('../../../assets/layer_9.png')} style={{ width: 10, height: 15, alignSelf: 'center' }}></Image>
              </TouchableOpacity>
            </View>

          </View>

          <TouchableOpacity style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'gray', padding: 4, borderRadius: 5, marginTop: -10 }}
            onPress={() => { setmodlevisual1(true) }}>
            <Text style={{ color: Mycolors.GrayColor, fontWeight: 'bold', left: 8, fontSize: 16 }}> Search Products</Text>
            <View style={{ height: 40, flexDirection: 'row' }}>
              <TouchableOpacity style={{
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
              }}
                onPress={() => { setmodlevisual1(true) }}>
                <AntDesign name="search1" color={'#FFF'} size={24} />
              </TouchableOpacity>

            </View>


          </TouchableOpacity>

          {/* <View style={{ width: '95%', alignSelf: 'center', marginHorizontal: 20, borderRadius: 10, justifyContent: "center" }}>
            <FlatList
              data={resData.services}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item, index }) => {
                return (
                  <>
                    {item.attribute_value == 'yes' ?
                    takeAwayNonButton ?
                      <View style={{ width: dimensions.SCREEN_WIDTH * 40 / 100, marginHorizontal: 0, paddingVertical: 5 }}>
                        <View style={styles.taBox}>
                          <View style={styles.brownDot} />
                          <Text style={{ color: '#835E23', fontSize:15, fontWeight:'bold' }} >{item.attribute_label}</Text>
                        </View>
                      </View>
                        :
                      <View style={{ width: dimensions.SCREEN_WIDTH * 40 / 100, marginHorizontal: 0, paddingVertical: 5 }}>
                        <MyButtons title={item.attribute_label} height={37} width={'100%'} borderRadius={5} alignSelf="center"
                          press={() => { setselectedTab(item.attribute_label) }} marginHorizontal={20} fontSize={15}
                          titlecolor={selectedTab == item.attribute_label ? Mycolors.BG_COLOR : Mycolors.Black} marginVertical={0} backgroundColor={selectedTab == item.attribute_label ? '#835E23' : 'transparent'} />
                      </View>
                      :
                      <>
                      </>
                    }
                  </>
                )
              }}
              keyExtractor={item => item.id}
            />
          </View> */}


          {selectedTab == 'Take Away' || selectedTab == 'Delivery' ?
            <View>
              {/* <View style={{ width: '95%', alignSelf: 'center', top: -5 }}>
                <Text style={{ fontSize: 11, color: Mycolors.TEXT_COLOR }}>{viewmore ? resData.business_info ? resData.business_info.substring(0, 150) : resData.business_info : resData.business_info}</Text>
                <Text onPress={() => { setviewmore(!viewmore) }} style={{ color: '#835E23', textDecorationLine: "underline", fontSize: 12 }}>{viewmore ? 'View more' : 'View less'}</Text>

              </View> */}

              <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
                {resData.features ?
                  resData.features.map((item, index) => {
                    return (
                      <View style={{ alignSelf: 'center', width: '95%' }}>
                        {design(item.attribute_image, item.attribute_value, item.attribute_detail, '45%', 25, 28, 'transparent', 40)}
                      </View>
                    )
                  })
                  : null}
              </View>

              {/*  
<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:dimensions.SCREEN_WIDTH*95/100,alignSelf:'center'}}>
  {design(require('../../../assets/shape_39.png'),'Food Preparation Time','34 minutes','45%',25,28,'#835E23',20)}
  {design(require('../../../assets/shape_40.png'),'Hygiene Food','','45%',25,28,'#835E23',20)}
</View>
{design(require('../../../assets/shape_41.png'),'Location','Disneys Hollvwood Studios Main Entrance.Kissimmee. FL 34747. United States','95%',25,28,5)}
<View>
  {design(require('../../../assets/shape_42.png'),'Timing','Open at 10:00 AM','95%',28,28,5)}
<TouchableOpacity style={{width:100,height:30,borderColor:'#835E23',borderWidth:0.5,position:'absolute',right:5,top:15,justifyContent:'center',borderRadius:5}}>
<Text style={{fontSize:11,textAlign:'center',color:"red",fontWeight:'bold'}}>Call Restaurant</Text>
</TouchableOpacity>
</View>
{design(require('../../../assets/shape_43.png'),'Cost','Cost for two - $24.78(approx)','95%',35,24,5)}
 */}

            </View>
            :
            selectedTab == 'Dining' ?
              <View>
                {/* <View style={{width:'100%',alignSelf:'center',marginTop:10}}>
         <FlatList
                  data={upData}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  // numColumns={2}
                  renderItem={({item,index})=>{
                    return(
                      <TouchableOpacity style={{width:100,height:130,marginHorizontal:5,backgroundColor:'#fff',
                      shadowOffset: {
                      width: 0,
                      height: 3
                    },
                    shadowRadius: 1,
                    shadowOpacity: 0.3,
                   // justifyContent: 'center',
                    elevation: 5,borderRadius:10}}>
          <View style={{width:100,height:130,alignSelf:'center'}}>
          <Image source={require('../../../assets/images/diningimg.png')} style={{width:'100%',height:'100%',alignSelf:'center',resizeMode: 'stretch'}}></Image>
          </View>
          </TouchableOpacity>
                    )
                  }}
                  keyExtractor={item => item.id}
                /> 
         </View>*/}

              </View>
              :
              null
          }
          {selectedTab != 'Book A Table' ?
            <>

              {/* <TouchableOpacity style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: 'gray', padding: 4, borderRadius: 5, marginTop: 0 }}
                onPress={() => { setmodlevisual1(true) }}>
                <Text style={{ color: Mycolors.GrayColor, fontWeight: 'bold', left: 8, fontSize: 16 }}> Search Products</Text>
                <View style={{ height: 40, flexDirection: 'row' }}>
                  <TouchableOpacity style={{
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
                  }}
                    onPress={() => { setmodlevisual1(true) }}>
                    <AntDesign name="search1" color={'#FFF'} size={24} />
                  </TouchableOpacity>

                </View>


              </TouchableOpacity> */}
              {/* <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', alignItems: 'center', marginBottom: 1, borderWidth: 1, borderColor: 'gray', padding: 4, borderRadius: 5, marginTop: 4 }}>
                <View style={{ width: '98%', height: 40, zIndex: 999 }}>



                  <DropDownPicker
                    open={menutypeOpen}
                    value={menutypevalue}
                    items={menutypedate}
                    //multiple={true}
                    setOpen={() => { setmenutypeOpen(!menutypeOpen) }}
                    setValue={(v) => { setmenutypevalue(v) }}
                    setItems={(i) => { setmenutypedate(i) }}
                    // listMode="MODAL"
                    placeholder="Select Item Type"
                    onChangeValue={(value) => {
                      setmenutypevalue(value)
                      console.log('hihiihi', value)
                      // getData(makeUrl(value))
                      menuList(value)
                      setselectedValue(value)
                      // setreloades(!reloades)
                    }}
                    dropDownDirection="TOP"
                    placeholderStyle={{
                      color: Mycolors.GrayColor,
                      fontSize: 16,
                      // fontWeight: 'bold'
                    }}
                    textStyle={{
                      color: Mycolors.GrayColor,
                      fontSize: 16,
                      fontWeight: 'bold'
                      //  fontSize:5
                    }}
                    style={{ borderColor: 'transparent', backgroundColor: 'transparent', height: 40, zIndex: 999, top: -5, }}
                    containerStyle={{
                      width: '102%',
                      borderColor: '#835E23',
                      height: 40,
                      zIndex: 999
                    }}
                    disabledStyle={{
                      opacity: 0.5
                    }}
                    dropDownContainerStyle={{
                      // width: '100%',
                      backgroundColor: "#fff",
                      borderColor: '#000',
                      // height:360,
                      borderWidth: 0.2,
                      shadowColor: '#000000',
                      shadowOffset: {
                        width: 0,
                        height: 3
                      },
                      shadowRadius: 5,
                      shadowOpacity: 1.0,
                      elevation: 5,
                      zIndex: 999
                    }}
                  />

                </View>

              </View> */}

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20, }}>
                <Text style={{ color: Mycolors.Black, fontWeight: '500', width: '50%' }} >Pick from a wide range of categories</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  {Object.keys(selectedCategory)?.length > 0 ?
                    <TouchableOpacity onPress={removeCategoryFilter} style={styles.refreshView}>
                      <Image source={require('../../../assets/product_refresh.png')} ></Image>
                      <Text style={{ color: '#fff', fontSize: 12, fontWeight: '400', marginLeft: 10 }} >Clear</Text>
                    </TouchableOpacity>
                    :
                    null
                  }
                  <TouchableOpacity onPress={() => { setmodlevisual5(true) }}>
                    <Text style={{ color: '#835E23', fontWeight: '500', textDecorationLine: "underline", textDecorationColor: '#835E23' }} >View All</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ width: '100%', alignSelf: 'center', marginTop: 20, }}>
                <FlatList
                  data={categoryData}
                  horizontal={true}
                  style={{ marginBottom: 20 }}
                  showsHorizontalScrollIndicator={false}
                  // numColumns={2}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={[{ width: 100, marginHorizontal: 5, overflow: 'hidden', paddingBottom: 5 }, selectedCategory?.category_code === item?.category_code ? styles.categorySelectedStyle : null]}>
                        <TouchableOpacity style={{ width: 100, height: 80, backgroundColor: '#F8F8F8', alignSelf: 'center' }}
                          onPress={() => { setSelectedCategory(item) }}>
                          <Image source={{ uri: item.category_image }} style={{ width: "100%", height: "100%", alignSelf: 'center', borderRadius: 7 }}></Image>
                        </TouchableOpacity>
                        <View style={{}}>
                          <Text style={{ fontSize: 11, color: (selectedCategory?.category_code === item?.category_code) ? '#835E23' : Mycolors.Black, marginTop: 5, textAlign: 'center', fontWeight: 'bold' }}>{item?.category_name}</Text>
                        </View>
                      </View>
                    )
                  }}
                // keyExtractor={item => item.id}
                />
              </View>

              {getDropdownData()}
              {/* {menuresData.length > 0 ?

                <View style={{ width: '100%', alignSelf: 'center', marginTop: 10, zIndex: -888 }}>
                  {selectedTab != 'Dining' ?
                    selectedTab == 'Take Away' ?

                      menuresData.map((item, index) => {
                        return (
                          <View>
                            {item.menuType == menutypevalue && item.serviceType == 'Take Away' ?
                              flatliistDesign(item.image, item.name, '$' + parseFloat(Number(item.price).toFixed(2)), item.tentative_time, () => { postcart(item) },
                                () => {
                                  setClickedItemData(item)
                                  setmodlevisual1(false)
                                
                                },
                                item, () => { putcart(item, '-') }, () => { putcart(item, '+') }, 'green'
                              )
                              :
                              item.menuType != menutypevalue && item.serviceType == 'Take Away' ?
                                flatliistDesign(item.image, item.name, '$' + parseFloat(Number(item.price).toFixed(2)), item.tentative_time, () => { postcart(item) }, () => {
                                  setClickedItemData(item)
                                  setmodlevisual1(false)
                                
                                },
                                  item, () => { putcart(item, '-') }, () => { putcart(item, '+') }, '#835E23'
                                )
                                : null
                            }
                          </View>
                        )
                      }

                      )
                      :
                      menuresData.map((item, index) => {
                        return (
                          <View>
                            {item.menuType == selectedValue && item.serviceType == 'Delivery' ?
                              flatliistDesign(item.image, item.name, '$' + parseFloat(Number(item.price).toFixed(2)), item.tentative_time, () => { postcart(item) },
                                () => {
                                  setClickedItemData(item)
                                  setmodlevisual1(false)
                                },
                                item, () => { putcart(item, '-') }, () => { putcart(item, '+') }, 'green'
                              )
                              :
                              item.menuType != selectedValue && item.serviceType == 'Delivery' ?
                                flatliistDesign(item.image, item.name, '$' + parseFloat(Number(item.price).toFixed(2)), item.tentative_time, () => { postcart(item) }, () => {
                                  setClickedItemData(item)
                                  setmodlevisual1(false)
                                },
                                  item, () => { putcart(item, '-') }, () => { putcart(item, '+') }, '#835E23'
                                )
                                : null
                            }
                          </View>
                        )
                      }
                      )
                    :
                    menuresData.map((item, index) => {
                      return (
                        <View>

                          {item.menuType == menutypevalue && item.serviceType == 'Dinning' ?
                            DiningflatliistDesign(item.image, item.name, '$' + parseFloat(Number(item.price).toFixed(2)), item.tentative_time,
                              () => {
                                // let arr=diningItens
                                let arr1 = diningItens1
                                if (itemloop(item)) {

                                } else {
                                  // arr.push(item)
                                  arr1.push({
                                    "cart_id": item.cart_id,
                                    "cart_quantity": 1,
                                    "category": item.category,
                                    "default_image": item.default_image,
                                    "id": item.id,
                                    "image": item.image,
                                    "in_cart": item.in_cart,
                                    "menuType": item.menuType,
                                    "name": item.name,
                                    "price": item.price,
                                    "product_desc": item.product_desc,
                                    "serviceType": item.serviceType,
                                    "status": item.status,
                                    "subcategory": item.subcategory
                                  })
                                }

                                //setdiningItens(arr)
                                setdiningItens1(arr1)
                                setreloades(!reloades)
                              }, () => {
                                setClickedItemData(item)
                                // setmodlevisual1(false)
                                // setmodlevisual2(true)
                              },
                              itemloop(item),
                              () => { plushqty(item) },
                              itemqty(item),
                              () => { minus(item) }, 'green'
                            )
                            :
                            item.menuType != menutypevalue && item.serviceType == 'Dinning' ?
                              DiningflatliistDesign(item.image, item.name, '$' + parseFloat(Number(item.price).toFixed(2)), item.tentative_time,
                                () => {
                                  let arr1 = diningItens1
                                  if (itemloop(item)) {

                                  } else {
                                    arr1.push({
                                      "cart_id": item.cart_id,
                                      "cart_quantity": 1,
                                      "category": item.category,
                                      "default_image": item.default_image,
                                      "id": item.id,
                                      "image": item.image,
                                      "in_cart": item.in_cart,
                                      "menuType": item.menuType,
                                      "name": item.name,
                                      "price": item.price,
                                      "product_desc": item.product_desc,
                                      "serviceType": item.serviceType,
                                      "status": item.status,
                                      "subcategory": item.subcategory
                                    })
                                  }

                                  setdiningItens1(arr1)
                                  setreloades(!reloades)
                                }, () => {
                                  setClickedItemData(item)
                                  // setmodlevisual1(false)
                                  // setmodlevisual2(true)
                                },
                                itemloop(item),
                                () => { plushqty(item) },
                                itemqty(item),
                                () => { minus(item) }, '#835E23'
                              )
                              : null
                          }
                        </View>
                      )
                    }
                    )
                  }

                </View>
                :
                <Text style={{ color: '#000', textAlign: 'center', fontWeight: 'bold', marginTop: 10 }}>No Items Found</Text>
                } */}
            </>
            :
            null
          }
        </View>


        <View style={{ height: 140 }} />

        {/* <View>
<View style={{width:'100%',alignSelf:'center',marginTop:10}}>
<View style={{width:'95%',marginTop:15,alignSelf:'center'}}>

  <View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginTop:20, marginBottom:20,}}>
  <Text style={{color:Mycolors.Black,fontWeight:'600'}}>Explore Similar Products</Text>
  <Text style={{color:'#835E23',textDecorationLine: "underline", textDecorationColor:'#835E23'}} onPress={()=>{}}>View More</Text>
</View>

<FlatList
                  data={similarProducts}
                  showsHorizontalScrollIndicator={true}
                  horizontal
                  renderItem={({item,index})=>{
                    console.log('similar item', item);
                    return(
                      <View style={{width:dimensions.SCREEN_WIDTH/2.2,marginHorizontal:5}}>
          <TouchableOpacity style={{width:dimensions.SCREEN_WIDTH/2.2,height:170,backgroundColor:'#fff',alignSelf:'center', borderRadius:15, overflow:'hidden'}}
          onPress={()=>{props.navigation.navigate('ShopProductDetails', {category: item.category, productName:item.name, productId:item.id, vendorId:props.route.params.vendorId, businessid:props.route.params.businessid, })}}
          >
          <Image source={{uri: item.image}} style={{width:'100%',height:'100%',alignSelf:'center'}}></Image>
          </TouchableOpacity>
          <View style={{}}>
          <Text style={{fontSize:11,color:Mycolors.Black,marginTop:5,textAlign:'left',fontWeight:'bold'}}>{item.name}</Text>
          </View>
          <View style={{padding:5,paddingLeft:0,top:-5}}>
          <Text style={{fontSize:9,color:Mycolors.GrayColor,marginTop:5,textAlign:'left',}}>{item.price}</Text>
          </View>
          </View>
                    )
                  }}
                  keyExtractor={item => item.id}
                />

                <View style={{height:100}} />  

</View>
</View>

</View> */}

      </ScrollView>
      {selectedTab == 'Dining' ?
        <View style={{ width: '92%', alignSelf: 'center', position: 'absolute', bottom: 60, height: 80, backgroundColor: '#fff' }}>
          <MyButtons title="Confirm Order" height={45} width={'100%'} borderRadius={5} alignSelf="center"
            press={() => {
              if (diningItens1.length > 0) {
                setmodlevisual4(false)
                setmodlevisual3(true)
                setmodlevisual1(false)
                setmodlevisual2(false)
              } else {
                Toast.show({ text1: 'Please add items from the menu to place an order.', });
              }

            }} marginHorizontal={20} fontSize={12}
            titlecolor={Mycolors.BG_COLOR} marginVertical={0} hLinearColor={['#fd001f', '#b10027']} backgroundColor={'transparent'} />
        </View>
        : null
      }
      {/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model1 Search Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
      <Modal
        isVisible={modlevisual1}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual1(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        onBackdropPress={() => setmodlevisual1(false)}
        onModalWillShow={() => { setmenuresData2({ ...menuresData }) }}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '70%', backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            <View style={{ paddingHorizontal: 4 }}>
              {/* <SearchInput2 marginTop={10} placeholder={'Search Cuisine,Dishes'}
                serchValue={searchValue}
                onChangeText={(e) => {
                  setsearchValue(e)
                  searchmenuList(e.text)
                }}
                // press={() => { Alert.alert('Hi') }}
                presssearch={() => { searchmenuList(searchValue.text) }}
                paddingLeft={9} /> */}
              <ProductSearchInput marginTop={10} placeholder={'Search Products'}
                serchValue={searchValue}
                onChangeText={(e) => {
                  if (e === '') {
                    setsearchValue(e)
                    setmenuresData2({ ...menuresData })
                  } else {
                    setsearchValue(e)
                    searchmenuList(e.text)
                  }
                }}
                // press={() => { Alert.alert('Hi') }}
                presssearch={() => { searchmenuList(searchValue.text) }}
                paddingLeft={9} />
            </View>

            {/* <Text style={{ fontWeight: 'bold', fontSize: 16, marginTop: 15, left: 5, color: '#cbcbcb' }}></Text> */}

            <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
              {menuresData2?.products?.length > 0 ?
                (menuresData2?.products?.map((item, index) => {
                  return (
                    <View>
                      {
                        flatliistDesign(item.image, item.name, '$' + parseFloat(Number(item.price).toFixed(2)), item.tentative_time, () => { selectedTab == 'Dining' ? '' : postcart(item) }, () => {
                          setClickedItemData(item)
                          {/* setmodlevisual1(false)*/ }
                          {/* setmodlevisual2(true) */ }
                        }, item, () => { putcart(item, '-') }, () => { putcart(item, '+') }, '#fff'
                        )
                      }
                    </View>
                  )
                }
                ))
                :
                <View style={{ width: '100%', justifyContent: 'center', paddingTop: 20, }}>
                  <View style={{ width: '80%', marginLeft: 8 }}>
                    <Text style={{ color: '#B4B4B4', textAlign: 'left', fontWeight: '500', fontSize: 21 }}>Hungry for a</Text>
                    <Text style={{ color: '#ADC430', textAlign: 'left', fontWeight: 'bold', fontSize: 25 }}>Specific Cuisine?</Text>
                    <Text style={{ color: '#000000', textAlign: 'left', fontSize: 14 }}>Just type it in and let our search menu do the rest. </Text>
                  </View>
                  <View style={{ width: 220, height: 220, alignSelf: 'flex-end', marginTop: 20, marginRight: 15 }}>
                    <Image source={require('../../../assets/Shop-eat-empty-cat-image.png')} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 5, resizeMode: 'stretch' }} ></Image>
                  </View>
                </View>
              }
            </View>

            <View style={{ width: 100, height: 100 }} />
          </ScrollView>

        </View>

        {loading ? <Loader /> : null}

      </Modal>

      {/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model2 Product Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
      <Modal
        isVisible={modlevisual2}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual2(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        propagateSwipe={true}
        onBackdropPress={() => setmodlevisual2(false)}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '50%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

            <TouchableOpacity style={{
              width: '95%', height: 90, marginHorizontal: 5, marginVertical: 5, padding: 10, backgroundColor: '#fff',
              // borderColor: '#dee4ec',
              shadowColor: 'black',
              shadowOffset: {
                width: 0,
                height: 10
              },
              shadowRadius: 10,
              shadowOpacity: 0.9,
              // borderWidth: 1,
              overflow: 'hidden',
              elevation: 5, borderRadius: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center'
            }}
            >
              <View style={{ width: 100, height: 100, alignSelf: 'center', borderRadius: 10, borderWidth: 3, borderColor: '#dee4ec' }}>
                <Image source={{ uri: ClickedItemData.image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 10, resizeMode: 'stretch' }} ></Image>
              </View>
              <View style={{ marginLeft: 15 }}>
                <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 9 }} >{ClickedItemData.name}</Text>
                <View style={{ flexDirection: 'row' }}>
                  <Text style={{ color: Mycolors.GrayColor, fontWeight: '600', fontSize: 12, marginTop: 9 }} >Food Preparation Time:</Text>
                  <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 6 }} > {resData.tentative_time}</Text>
                </View>
              </View>
              <View style={{ position: 'absolute', width: 20, height: 20, top: 10, right: 10, borderRadius: 3, backgroundColor: '#835E23', justifyContent: 'center' }}>
                <View style={{ width: 10, height: 10, borderRadius: 10, alignSelf: 'center', backgroundColor: '#fff' }} />
              </View>
            </TouchableOpacity>

            <View style={{ width: '95%', height: 100, borderRadius: 2, marginTop: 10, alignSelf: 'center' }}>

              <TextInput
                value={cookingIns}
                onChangeText={(e) => setcookingIns(e)}
                placeholder={'Add Cooking Instructions'}
                placeholderTextColor="#bbbbbb"
                multiline={true}
                // maxLength={500}
                // keyboardType="number-pad"
                autoCapitalize='none'
                style={[styles.input]}
              />

            </View>

            <View style={{ width: '95%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginVertical: 15 }}>
              <Text style={{ color: Mycolors.Black, fontWeight: '500' }}>Total Payable Amount</Text>
              <Text style={{ color: Mycolors.Black, fontWeight: '500' }}>${ClickedItemData.price}</Text>
            </View>
            <View style={{ width: '95%', alignSelf: 'center' }}>
              <MyButtons title="Proceed to payment" height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => { props.navigation.navigate('ShopPayment') }} marginHorizontal={20} fontSize={14}
                titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027', '#fd001f']} />
            </View>

            <View style={{ width: 100, height: 100 }} />
          </ScrollView>

        </View>
      </Modal>

      {/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model3 Book A Table sloat Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}

      {/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model4 Book A Sloat Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
      <Modal
        isVisible={modlevisual4}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual4(false)
        }}
        scrollTo={() => { }}
        onBackdropPress={() => setmodlevisual4(false)}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '48%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

            <Text style={{ fontWeight: 'bold', color: Mycolors.Black, marginVertical: 10 }}>Book A Slot</Text>

            <Text style={{ color: Mycolors.RED, fontWeight: '400', fontSize: 12, marginTop: 20 }}>#KIN876549</Text>
            <View>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                <View style={{ width: '50%' }}>
                  <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 15 }}>Table Number</Text>
                  <Text style={{ color: Mycolors.GrayColor, fontSize: 11, marginTop: 4 }}>14</Text>
                </View>
                <View style={{ width: '50%' }}>
                  <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 15 }}>Booking for</Text>
                  <Text style={{ color: Mycolors.GrayColor, fontSize: 11, marginTop: 4 }}>3 person</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%', marginTop: 10 }}>
                <View style={{ width: '50%' }}>
                  <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 15 }}>Table Booking Time</Text>
                  <Text style={{ color: Mycolors.GrayColor, fontSize: 11, marginTop: 4 }}>21 July 2021, 11:00 AM</Text>
                </View>
                <View style={{ width: '50%' }}>
                  <TouchableOpacity style={{ width: 120, height: 40, borderColor: Mycolors.RED, borderWidth: 0.5, borderRadius: 4, justifyContent: 'center', top: 8 }}>
                    <Text style={{ textAlign: 'center', color: Mycolors.RED, fontSize: 12, fontWeight: '600' }}>View Order</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>


            <View style={{ width: '100%', padding: 10, borderRadius: 15, borderColor: Mycolors.GrayColor, borderWidth: 0.3, marginTop: 20 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', width: '85%', marginTop: 10 }}>
                <View style={{ width: 40, height: 40, backgroundColor: Mycolors.GREEN, justifyContent: 'center', borderRadius: 20 }}>
                  <Image source={require('../../../assets/shape_39.png')} style={{ width: 25, height: 28, overflow: 'hidden', alignSelf: 'center' }}></Image>
                </View>
                <View style={{ marginLeft: 10, width: '85%' }}>
                  <Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black }}>Order Status</Text>
                  <Text style={{ fontSize: 13, color: Mycolors.GREEN, marginTop: 7, lineHeight: 18 }}>Accepted by restaurant vour table no 14 is booked</Text>
                </View>

              </View>
              <View style={{ flexDirection: 'row', marginTop: 10 }}>
                <Text style={{ fontWeight: '600', color: Mycolors.Black, fontSize: 12 }}>Note:</Text>
                <Text style={{ fontWeight: '400', color: Mycolors.Black, fontSize: 12 }}> Show your booking number when asked</Text>
              </View>
            </View>

            <View style={{ width: 100, height: 100 }} />
          </ScrollView>

        </View>
      </Modal>
      <Modal
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
                      }, selectedCategory?.category_code === item?.category_code ? styles.categorySelectedStyle : null]}
                      onPress={() => { setSelectedCategory(item); setmodlevisual5(false) }}
                    >
                      <Image source={{ uri: item.category_image }} style={{ width: '40%', height: 100, borderRadius: 7 }} resizeMode='stretch' ></Image>
                      <View style={{ justifyContent: 'center', alignItems: 'center', width: "60%" }}>
                        <Text style={{ fontSize: 14, color: (selectedCategory?.category_id === item?.category_id) ? '#835E23' : Mycolors.Black, marginTop: 5, textAlign: 'center', fontWeight: 'bold' }}>{item?.category_name}</Text>
                      </View>
                    </TouchableOpacity>
                    // <View style={{ width: 100, marginHorizontal: 5 }}>
                    //   <TouchableOpacity style={{ width: 100, height: 80, backgroundColor: '#F8F8F8', alignSelf: 'center' }}
                    //     onPress={() => { setSelectedCategory(item) }}>
                    //     <Image source={{ uri:  item.category_image }} style={{ width: "100%", height: "100%", alignSelf: 'center', borderRadius: 7 }}></Image>
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

        </View>
      </Modal>
      <Modal
        isVisible={showProductInfoModal}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setShowProductInfoModal(false)
        }}
        scrollTo={() => { }}
        onBackdropPress={() => setShowProductInfoModal(false)}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '80%', backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

            <Text style={{ color: Mycolors.Black, fontWeight: '500', fontSize: 22, textAlign: 'center' }} >Product Details</Text>

            <View style={{ height: 'auto', borderRadius: 20, overflow: 'hidden', marginTop: 20, width: '96%', alignSelf: 'center' }}>
              <ImageSlider
                //  localImg={true}
                data={[
                  // require('../../assets/Group75972.png'),
                  {
                    img: ClickedItemData?.default_image
                  },
                  {
                    img: ClickedItemData?.image
                  },
                  // { img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU' },
                  // { img: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg' },
                  // { img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg' }
                ]}
                // onClick={(item, index) => {alert('hello'+index)}}
                autoPlay={true}
                // onItemChanged={(item) => console.log("item", item)}
                closeIconColor="#fff"
              />
            </View>

            <View style={{ width: '96%', alignSelf: 'center', backgroundColor: '#F8F8F8' }}>

              <View style={{ width: '96%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', backgroundColor: '#F8F8F8', borderRadius: 9, paddingVertical: 10 }}>
                <View style={{ width: '70%' }}>
                  <Text style={{ color: Mycolors.Black, fontWeight: '600' }}>{ClickedItemData?.name}</Text>
                  <View style={{flexDirection:'row', alignItems:'center', marginVertical: 4}}>
                    <Text style={{ color: 'black', fontSize: 13, }}>Category:</Text>
                    <Text style={{ color: '#835E23', fontSize: 13, fontWeight: 'bold', marginLeft:5 }}>{ClickedItemData?.category}</Text>
                  </View>
                </View>

                <View>
                  <View style={{ flexDirection: 'row', marginTop: 5 }}>
                    <Image source={require('../../../assets/images/Star.png')} style={{ width: 18, height: 18 }}></Image>
                    <Text style={{ color: Mycolors.Black, fontSize: 14, fontWeight: '600', left: 5 }}>{Number(ClickedItemData?.rating).toFixed(1)}</Text>
                  </View>
                  <Text style={{ color: '#835E23', textAlign: 'right', fontSize: 16 }}>${Number(ClickedItemData?.price).toFixed(2)}</Text>
                  {/* <Text style={{ color: Mycolors.GrayColor, fontSize: 11 }}>0% off, ${Number(ClickedItemData?.price).toFixed(2)}</Text> */}
                </View>

              </View>


              <View>
                <View style={{ width: '95%', alignSelf: 'center' }}>
                  <Text style={{ color: Mycolors.DARK_GREY }}>
                    {''+ClickedItemData?.product_desc}
                  </Text>
                  {/* <ViewMoreText
                numberOfLines={3}
                renderViewMore={(onPress) => {
                  return (
                    <Text onPress={onPress} style={{ color: '#FFC40C', textDecorationLine: "underline" }}>View more</Text>
                  )
                }}
                renderViewLess={(onPress) => {
                  return (
                    <Text onPress={onPress} style={{ color: '#FFC40C', textDecorationLine: "underline" }}>View less</Text>
                  )
                }}
                textStyle={{ textAlign: 'left', width: '95%' }}
              >
                <Text style={{ color: Mycolors.DARK_GREY }}>
                  {ClickedItemData?.product_desc}
                </Text>
              </ViewMoreText> */}

                  {/* <View>
                <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
                  <View style={{ width: '95%', marginTop: 15, alignSelf: 'center' }}>

                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flexDirection: 'row' }}>
                        <Image source={require('../../../assets/images/store_image.png')} />
                        <View style={{ marginLeft: 15, marginTop: 5 }}>
                          <Text style={{ fontSize: 16, fontWeight: '500', color: '#263238' }}>{'productDetailsData.Business_name'}</Text>
                          {productDetailsData['AVG(star)'] ?
                            <View style={{ flexDirection: 'row', marginTop: 5 }}>
                              <Image source={require('../../../assets/images/Star.png')} style={{ width: 18, height: 18 }}></Image>
                              <Text style={{ color: Mycolors.Black, fontSize: 14, fontWeight: '600', left: 5 }}>4.5</Text>
                            </View>
                            : null}
                          <TouchableOpacity onPress={() => setmodlevisual1(true)} >
                            <AntDesign name="infocirlce" color={'#FFC40C'} size={24} />
                          </TouchableOpacity>
                        </View>
                      </View>
                      <TouchableOpacity style={{ justifyContent: 'center', alignItems: 'center', marginTop: 5, height: 45, width: '35%', borderRadius: 20, backgroundColor: '#FFC40C', shadowColor: '#000', shadowOffset: { width: 3, height: 3 }, shadowRadius: 5, shadowOpacity: 1.0, elevation: 5 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>Contact store</Text>
                      </TouchableOpacity>
                    </View>

                    <View style={{ flexDirection: 'row', marginTop: 15, marginBottom: 20 }}>
                      <Image source={require('../../../assets/images/product_location2.png')} style={{ height: 30, width: 30, flex: 1 }} resizeMode='contain' />
                      <View style={{ marginLeft: 15, flex: 4 }}>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#455A64' }}>Location</Text>
                        <Text style={{ fontSize: 14, fontWeight: '500', color: '#B2B7B9' }}>500 S Buena Vista St, Burbank, CA 91521, United States</Text>
                      </View>
                      <Image source={require('../../../assets/images/product_google_maps_2.png')} style={{ height: 42, width: 42, flex: 2 }} resizeMode='contain' />
                    </View>

                  </View>
                </View>

              </View> */}


                </View>


              </View>

              <View style={{ flexDirection: 'row', marginTop: 10 }}>


              </View>



            </View>


            <View style={{ width: 100, height: 100 }} />
          </ScrollView>

        </View>
      </Modal>
      <Modal
        isVisible={modlevisual6}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual6(false)
        }}
        scrollTo={() => { }}
        onBackdropPress={() => setmodlevisual6(false)}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '78%', backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', backgroundColor: '#F8F8F8', borderRadius: 9, paddingHorizontal: 10, }}>
              <View>
                <Text style={{ color: Mycolors.Black, fontSize: 22, fontWeight: 'bold' }}>{resData?.business_name}</Text>
                {/* <Text style={{ color: Mycolors.GrayColor, fontSize: 13, fontWeight: '500', marginVertical: 4 }}>Restaurant</Text> */}
                <View style={{ flexDirection: 'row', marginTop: 5, width: '100%', }}>
                  <Image source={require('../../../assets/Star.png')} style={{ width: 18, height: 18 }}></Image>
                  <Text style={{ color: Mycolors.Black, fontSize: 14, fontWeight: '600', left: 5 }}>{resData?.rating ? resData?.rating : '0.0'}</Text>
                </View>
              </View>
              <View style={{ flexDirection: 'row', top: 9 }}>
                <TouchableOpacity onPress={() => {
                  dialCall(resData?.phone)
                }} style={{ height: 40, width: 40 }}>
                  <Image source={require('../../../assets/call.png')} style={{ height: 40, width: 40, resizeMode: 'stretch' }}></Image>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => {
                  sendEmail(resData?.emailid)
                }} style={{ height: 40, width: 40 }}>
                  <Image source={require('../../../assets/Envelope.png')} style={{ height: 40, width: 40, resizeMode: 'stretch' }}></Image>
                </TouchableOpacity>

              </View>
            </View>
            {resData?.business_info ?
              <View style={{ alignSelf: 'center', width: '99%', marginTop: 10, paddingHorizontal: 6 }}>
                <Text style={{ fontSize: 11, color: Mycolors.TEXT_COLOR }}>{viewmore ? resData?.business_info ? resData?.business_info.substring(0, 150) : resData?.business_info : resData?.business_info}</Text>
                <Text onPress={() => { setviewmore(!viewmore) }} style={{ color: 'red', textDecorationLine: "underline", fontSize: 12 }}>{viewmore ? 'View more' : 'View less'}</Text>
              </View>
              : null}

            <View style={{ alignItems: 'center', width: '96%', alignSelf: 'center', borderRadius: 10, overflow: 'hidden', marginTop: 10, }}>
              <MapView
                style={{
                  height: dimensions.SCREEN_HEIGHT * 22 / 100,
                  width: 400,
                  justifyContent: 'flex-end',
                  alignItems: 'center', borderRadius: 10
                }}
                provider={PROVIDER_GOOGLE}
                initialRegion={{
                  latitude: Number(resData?.latitude),
                  longitude: Number(resData?.longitude),
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
                customMapStyle={mapStyle}
                showsUserLocation={false}
                userLocationCalloutEnabled={true}
                // showsMyLocationButton={true}
                mapPadding={{ top: 30, right: 30, bottom: 30, left: 40 }}
                showsScale={true}
                // showsCompass={true} 
                rotateEnabled={true}
                // onRegionChange={data=>console.log('the resion change',data)}
                // onPress={(data)=>onMapPress(data)}
                mapType={mtype}
                zoomEnabled={true}
                pitchEnabled={true}
                followsUserLocation={true}
                // showsCompass={true}
                showsBuildings={true}
                //showsTraffic={true}
                showsIndoors={true}
                showsIndoorLevelPicker={true}
              >
                <Marker
                  coordinate={{ latitude: Number(resData?.latitude), longitude: Number(resData?.longitude) }}
                >
                  <Image
                    source={require('../../../assets/shape_33.png')}
                    style={{
                      width: 26, height: 28,
                    }}
                    resizeMode="contain"
                  />
                </Marker>

              </MapView>
            </View>
            <View style={{ flexDirection: 'row', alignItems: 'center', borderColor: '#B2B7B9', borderWidth: 1, height: 70, width: '96%', marginHorizontal: 7, borderBottomLeftRadius: 15, borderBottomRightRadius: 15, top: -6, borderTopColor: 'transparent', paddingLeft: 12 }}>
              <EvilIcons name="location" color={'#FFD037'} size={24} />
              <View style={{ width: '85%', marginLeft: 8 }}>
                <Text numberOfLines={2} style={{ fontSize: 13, fontWeight: '400', color: '#000' }} >{resData?.address}</Text>
              </View>
            </View>
            <View style={{ marginTop: 20, marginLeft: 7 }}>
              <Text numberOfLines={2} style={{ fontSize: 16, fontWeight: '500', color: '#455A64', lineHeight: 16 }} >Service Offerings</Text>
            </View>

            <View style={{ width: '100%', alignSelf: 'center', }}>
              <FlatList
                data={resData?.services}
                horizontal={true}
                showsHorizontalScrollIndicator={false}
                // numColumns={3}
                renderItem={({ item, index }) => {
                  return (
                    <>
                      {item?.attribute_value == 'yes' ?
                        item?.attribute_label == 'Delivery' ?
                          design1(require('../../../assets/Delivery_icon1.png'), 'Delivery', '', '23%', 42, 45, '', 20, () => { })
                          :
                          item?.attribute_label == 'Take Away' ?
                            design1(require('../../../assets/Take_away_icon.png'), 'Take Away', '', '23%', 42, 40, '', 20, () => { })
                            :
                            item?.attribute_label == 'Dining' ?
                              design1(require('../../../assets/dining_icon.png'), 'Dining', '', '23%', 42, 47, '', 20, () => { })
                              :
                              item?.attribute_label == 'Book A Table' ?
                                design1(require('../../../assets/Booked_table_icon.png'), 'Booked Table', '', '23%', 42, 42, '', 20, () => { })
                                :
                                null
                        :
                        null
                      }
                    </>
                  )
                }}
                keyExtractor={item => item.id}
              />
            </View>

            {resData?.features?.length > 0 ?
              <>

                <View style={{ marginTop: 40, marginLeft: 7, marginBottom: 20 }}>
                  <Text numberOfLines={2} style={{ fontSize: 16, fontWeight: '500', color: '#455A64', lineHeight: 16 }} >Badges</Text>
                </View>



                <FlatList
                  data={resData?.features}
                  horizontal={true}
                  style={{ marginBottom: 20, }}
                  showsHorizontalScrollIndicator={false}
                  // numColumns={2}
                  renderItem={({ item, index }) => {
                    return (
                      <ImageBackground source={require('../../../assets/badges_background.png')} style={styles.badgeContainer}>
                        <View style={styles.badgeView}>
                          <Image source={{ uri: item?.attribute_image }} style={{ height: 25, width: 25 }} />
                        </View>
                        <Text style={styles.badgeText}>{item?.attribute_value}</Text>
                      </ImageBackground>
                    )
                  }}
                  keyExtractor={item => item?.id}
                />
              </>
              : null}

            <View style={{ width: 100, height: 100 }} />
          </ScrollView>
        </View>
      </Modal>
      {loading ? <Loader /> : null}
      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}

    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  input: {
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
  dateIcon: {
    width: 22,
    height: 23,
    // marginRight:20
  },
  datePickerSelectInput: {
    height: 45,
    width: '100%',
    fontSize: 15,
    borderColor: null,
    backgroundColor: '#fff',
    borderRadius: 10,
    color: '#fff',
  },
  radioButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 5
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
    backgroundColor: '#835E23',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50
  },
  taBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderColor: '#835E23',
    borderWidth: 1,
    paddingHorizontal: 25,
    paddingVertical: 5,
    borderRadius: 5
  },
  brownDot: {
    backgroundColor: '#835E23',
    height: 15,
    width: 15,
    borderRadius: 15 / 2
  }
});
export default FoodDetails


const vendorDetailData = {
  "headers": {
    "success": 1,
    "message": "Vendor Details"
  },
  "body": {
    "first_name": "Nile",
    "last_name": "Dev",
    "emailid": "support@nileprojects.in",
    "phone": "9999887766",
    "status": 1,
    "business_id": 9,
    "name": "Dominos Restaurant",
    "address_line": "Sector 57, Noida, India",
    "latitude": 28.704099655151367,
    "longitude": 77.10250091552734,
    "business_info": "Dominos Restaurant in Patiala Ho, Patiala is a top player in the category North Indian Restaurants in the Patiala. This well-known establishment acts as a one-stop destination servicing customers both local and from other parts of Patiala. Over the course of its journey, this business has established a firm foothold in it’s industry. The belief that customer satisfaction is as important as their products and services, have helped this establishment garner a vast base of customers, which continues to grow by the day. This business employs individuals that are dedicated towards their respective roles and put in a lot of effort to achieve the common vision and larger goals of the company. In the near future, this business aims to expand its line of products and services and cater to a larger client base. In Patiala, this establishment occupies a prominent location in Patiala Ho. It is an effortless task in commuting to this establishment as there are various modes of transport readily available. It is at Bhupindra Road, Oppsite Dashera Ground,, which makes it easy for first-time visitors in locating this establishment. It is known to provide top service in the following categories: Restaurants, North Indian Restaurants, North Indian Delivery Restaurants, Multicuisine Restaurants, Indian Restaurants, Multicuisine Delivery Restaurants, South Indian Restaurants, Home Delivery Restaurants.",
    "rating": "3.1",
    "total_orders": 31,
    "address": "Sector 57, Noida, India",
    "tentative_time": "30 Minutes",
    "services": [
      {
        "id": 73,
        "business_id": 9,
        "attribute_type": "rest_service",
        "attribute_code": "delivery",
        "attribute_value": "yes",
        "attribute_detail": "",
        "attribute_label": "Delivery"
      },
      {
        "id": 77,
        "business_id": 9,
        "attribute_type": "rest_service",
        "attribute_code": "capacity",
        "attribute_value": "300",
        "attribute_detail": "",
        "attribute_label": "Sitting Capacity"
      },
      {
        "id": 89,
        "business_id": 9,
        "attribute_type": "rest_service",
        "attribute_code": "takeaway",
        "attribute_value": "yes",
        "attribute_detail": "",
        "attribute_label": "Take Away"
      },
      {
        "id": 90,
        "business_id": 9,
        "attribute_type": "rest_service",
        "attribute_code": "dining",
        "attribute_value": "yes",
        "attribute_detail": "",
        "attribute_label": "Dining"
      },
      {
        "id": 93,
        "business_id": 9,
        "attribute_type": "rest_service",
        "attribute_code": "booktable",
        "attribute_value": "yes",
        "attribute_detail": "10:00,15:16",
        "attribute_label": "Book A Table"
      }
    ],
    "features": [
      {
        "id": 19,
        "attribute_type": "MenuBadges",
        "attribute_code": "hygiene-food",
        "attribute_value": "Hygiene Food",
        "attribute_image": "http://54.153.75.225/images/admin/fork.png",
        "status": "Approved"
      },
      {
        "id": 21,
        "attribute_type": "MenuBadges",
        "attribute_code": "vaccinated",
        "attribute_value": "Vaccinated",
        "attribute_image": "http://54.153.75.225/images/admin/vaccinated.png",
        "status": "Approved"
      }
    ],
    "bannerImages": [
      {
        "id": 1,
        "image": "http://54.153.75.225/images/vendor/1.jpg"
      },
      {
        "id": 2,
        "image": "http://54.153.75.225/images/vendor/3.jpg"
      }
    ]
  }
}