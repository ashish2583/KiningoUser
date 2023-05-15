import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, View, Image, Text, Platform, Keyboard, KeyboardAvoidingView, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker';
import { Rating, AirbnbRating } from 'react-native-ratings';
import { CardField, CardFieldInput, useStripe, StripeContainer, } from '@stripe/stripe-react-native';
import { useSelector, useDispatch } from 'react-redux';
import { baseUrl, shop_eat_cart, user_payment_method, shop_product_cart_place_order, vendor_reviews, shop_eat_business_id, shop_eat_menu_userid, requestPostApi, requestGetApi, shop_eat } from '../../../WebApi/Service'
import Toast from 'react-native-toast-message';
import Loader from '../../../WebApi/Loader';
import moment from 'moment';
import MyAlert from '../../../component/MyAlert';

const ShopPayment = (props) => {
  const [checkitem, setcheckitem] = useState('')
  const [reson, setreson] = useState('')
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
    {
      id: '3',
      title: '    john.doe@gmail.com',
      height: 35,
      width: 40,
      time: '',
      img: require('../../../assets/images/layer_51.png'),
    },
    {
      id: '4',
      title: 'Cash Payment',
      height: 40,
      width: 40,
      time: 'Default method',
      img: require('../../../assets/images/cashondelivery.png'),
    },
  ])
  const creditCardRef = React.useRef();
  const dispatch = useDispatch();
  const User = useSelector(state => state.user.user_details)
  const [card, setCard] = useState(CardFieldInput.Details | null);
  const [addpayment, setaddpayment] = useState(false);
  const { confirmPayment, handleCardAction } = useStripe();
  const { initPaymentSheet, createToken, presentPaymentSheet } = useStripe();
  // const [appointmentId, setAppointmentId] = useState(null);
  const [loading, setLoading] = useState(false)
  const [showPaymentSuccess, setShowPaymentSuccess] = useState(false);
  const [allCardList, setallCardList] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')

  useEffect(() => {
    // setcheckitem({
    //   id: '',
    //   card_no: 'Cash Payment',
    //   exp_month:'Default method',
    //   exp_year:'',
    //   time:'Default method',
    //   img:require('../../../assets/images/cashondelivery.png'),
    // })
    getpaymentList()
  }, [])

  const checkcon = () => {
    getpaymentList()
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

  const handlePayClick = async () => {
    if (card === 0) {
      Toast.show({ text1: 'Please enter card details' });
      return;
    } else if (!card?.complete) {
      Toast.show({ text1: 'Please complete card details' });
      return;
    }
    setLoading(true);

    console.log('card', card);
    const res = await createToken({ card, type: 'Card' });
    console.log('res', res);
    var data = {
      token_id: res.token.id,
      card_no: res.token.card.last4,
      exp_month: res.token.card.expMonth,
      exp_year: res.token.card.expYear,
      card_type: res.token.card.brand
    }
    console.log('the form data==>>', data)
    const { responseJson, err } = await requestPostApi(user_payment_method, data, 'POST', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        getpaymentList()
        Toast.show({ text1: responseJson.headers.message })
        setaddpayment(false)
      } else {
        Toast.show({ text1: responseJson.headers.message })
        // Toast.show({text1: err})
        // setalert_sms(err)
        // setMy_Alert(true) 
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  };

  const placeOrder = async () => {
    console.log('checkitem', checkitem);
    if (checkitem == '') {
      Toast.show({ text1: 'Please select payment method' })
    } else {
      setLoading(true);
      var data = {
        "card_id": checkitem.card_id,
        "billing_address_id": null,
        "shipping_address_id": null,
        "business_id":props.route.params.businessid,
        // "payment_type": checkitem.id=='' ? 'cod': 'stripe',  // stripe/cod/cheque
        "payment_type": 'stripe',  // stripe/cod/cheque
        "order_type": props.route.params.orderType, //delivery/take-away 
        "schedule_date": moment(props.route.params.takeAwayDate).format('YYYY-MM-DD'),
        "schedule_time_from": props.route.params.selectedSlot.start,
        "schedule_time_to": props.route.params.selectedSlot.end,
        // "cookingInstruction" :props.route.params.cooking
      }
      console.log('placeOrder the form data==>>', data)
      const { responseJson, err } = await requestPostApi(shop_product_cart_place_order, data, 'POST', User.token)
      setLoading(false)
      console.log('the res shop_product_cart_place_order==>>', responseJson)
      if (responseJson !== null) {
        if (responseJson.headers.success == 1) {
          Toast.show({ text1: responseJson.headers.message })
          // props.navigation.navigate('ShopProduct')
          props.navigation.navigate('ShopMyOrder')
        } else {
          Toast.show({ text1: responseJson.headers.message })
          // Toast.show({text1: err})
          // setalert_sms(err)
          // setMy_Alert(true)
        }
      } else {
        setalert_sms(err)
        setMy_Alert(true)
      }

    }

  };

  const getpaymentList = async () => {

    setLoading(true)

    const { responseJson, err } = await requestGetApi(user_payment_method, '', 'GET', User.token)
    setLoading(false)
    console.log('the res user_payment_method==>>', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        // var arr=[{
        //   id: '',
        //   card_no: 'Cash Payment',
        //   exp_month:'Default method',
        //   exp_year:'',
        //   time:'Default method',
        //   img:require('../../../assets/images/cashondelivery.png'),
        // }]
        var arr = []
        for (let i = 1; i <= responseJson.body.length; i++) {
          arr.push(responseJson.body[i - 1])
        }
        console.log('all cards', arr);
        if (arr?.length > 0) {
          setcheckitem(arr[0])
        }
        setallCardList(arr)
      } else {
        Toast.show({ text1: responseJson.headers.message })
        console.log('kokokok');
        // Toast.show({text1: err})
        //  setalert_sms(err)
        //  setMy_Alert(true)
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, }}>
      <StripeContainer>
        <ScrollView
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="never"
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
            />
          }
        >
          <HomeHeader height={60} paddingHorizontal={15} backgroundColor={'#fff'}
            press1={() => { props.navigation.goBack() }} img1={require('../../../assets/arrow.png')} img1width={18} img1height={15}
            press2={() => { }} title2={'Payment'} fontWeight={'500'} img2height={20}
            press3={() => { }} img3width={25} img3height={25} />

          <View style={{ width: '92%', alignSelf: 'center' }}>

            <View style={{ width: '100%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginVertical: 15 }}>
              <Text style={{ color: Mycolors.GrayColor, fontWeight: '500', fontSize: 12 }}>CHOOSE PAYMENT OPTION</Text>
              <Text style={{ color: '#835E23', fontWeight: '500', textDecorationLine: 'underline', fontSize: 13 }} onPress={() => { setaddpayment(true) }}>Add New Card</Text>
            </View>

            {addpayment ?
              <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                keyboardVerticalOffset={20}
                style={{ flex: 1 }}>
                <View style={{}}>

                  <CardField
                    accessible={true}
                    postalCodeEnabled={false}
                    placeholder={{
                      number: '4242 4242 4242 4242',
                    }}
                    // cardStyle={{
                    //   borderRadius: 20,
                    //   // backgroundColor: '#a9bcd6',
                    //   // backgroundColor: '#7294c2',
                    //   backgroundColor:'#fff',
                    //   borderColor: Mycolors.RED,
                    //   borderWidth: 1,
                    //   textColor: Mycolors.BLACK,
                    //   placeholderColor: '#c9c9c9',
                    // }}
                    style={{
                      width: '100%',
                      height: 200,
                      marginTop: 20,
                      marginBottom: 30,
                    }}
                    onCardChange={cardDetails => {
                      setCard(cardDetails);
                      if (cardDetails?.complete) {
                        Keyboard.dismiss();
                      }
                    }}
                    onFocus={focusedField => {
                      console.log('focusField', focusedField);
                    }}
                  />


                </View>


                <View style={{ width: '100%', marginTop: -10 }}>
                  <MyButtons title="Add" height={53} width={'100%'} borderRadius={5} alignSelf="center" press={() => { handlePayClick() }} marginHorizontal={20} fontSize={14}
                    titlecolor={Mycolors.BG_COLOR} backgroundColor='#835E23' />
                </View>


              </KeyboardAvoidingView>
              : null
            }
            {
              allCardList.filter(el => el?.card_id !== checkitem?.card_id).map((item, index) => {
                return (
                  <>
                    {true ?
                      <TouchableOpacity style={{ width: '100%', borderColor: Mycolors.GrayColor, borderWidth: 0.02, flexDirection: 'row', alignItems: 'center', paddingVertical: 17, paddingHorizontal: 17, borderRadius: 7, backgroundColor: '#fff', marginTop: 15 }}
                        onPress={() => { setcheckitem(item) }}>
                        <View style={{ width: 51, height: 20 }}>
                          <Image source={require('../../../assets/visa.png')}  style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:5,resizeMode: 'stretch'}} ></Image>
                        </View>
                        <View style={{ marginLeft: 15 }}>
                          <Text style={{ color: Mycolors.TEXT_COLOR, fontWeight: '500', fontSize: 13 }}>**** **** **** {item.card_no}</Text>
                          {/* <Text style={{color:Mycolors.TEXT_COLOR,fontWeight:'500',fontSize:13}}>{item.card_id}</Text> */}
                          <Text style={{ color: Mycolors.GrayColor, fontWeight: '400', fontSize: 11, top: 2 }}>{item.id == '' ? '' : 'Expires'} {item.exp_month}{item.id == '' ? '' : '/'}{item.exp_year}</Text>
                        </View>
                      </TouchableOpacity>
                      :
                      <></>
                    }
                  </>
                )
              }
              )
            }

            <Text style={{ color: Mycolors.GrayColor, fontWeight: '300', fontSize: 12, marginVertical: 20 }}>CURRENT METHOD</Text>
            <View style={{ width: '100%', borderColor: Mycolors.RED, borderWidth: 0.2, flexDirection: 'row', alignItems: 'center', paddingVertical: 17, paddingHorizontal: 17, borderRadius: 7, backgroundColor: '#fff' }}>
              <View style={{ width: 51, height: 40 }}>
                <Image source={checkitem.img} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 5, resizeMode: 'stretch' }} ></Image>
              </View>
              <View style={{ marginLeft: 15 }}>
                <Text style={{ color: Mycolors.TEXT_COLOR, fontWeight: '500', fontSize: 13 }}>**** **** **** {checkitem.card_no}</Text>
                {/* <Text style={{color:Mycolors.TEXT_COLOR,fontWeight:'500',fontSize:13}}>{checkitem.card_id}</Text> */}
                <Text style={{ color: Mycolors.GrayColor, fontWeight: '400', fontSize: 10, top: 2 }}>{checkitem.id == '' ? '' : 'Expires'} {checkitem.exp_month}{checkitem.id == '' ? '' : '/'}{checkitem.exp_year}</Text>
              </View>
              <View style={{ width: 24, height: 24, backgroundColor: '#835E23', borderRadius: 5, position: 'absolute', right: 20, justifyContent: 'center' }}>
                <Image source={require('../../../assets/tickw.png')} style={{ width: 15, height: 15, alignSelf: 'center', borderRadius: 5, resizeMode: 'stretch' }} ></Image>
              </View>
            </View>


            <View style={{ width: '100%', marginTop: 30 }}>
              <MyButtons title="Confirm and Place Order" height={53} width={'100%'} borderRadius={5} alignSelf="center" press={() => { placeOrder() }}
                backgroundColor={'#835E23'} marginHorizontal={20} fontSize={14}
                titlecolor={Mycolors.BG_COLOR} />
            </View>



          </View>







          <View style={{ height: 100 }} />
        </ScrollView>


      </StripeContainer>
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
    height: 100,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: Mycolors.Black
  },

});


export default ShopPayment