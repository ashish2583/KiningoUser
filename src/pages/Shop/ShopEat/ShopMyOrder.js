import React, { useEffect, useState, useRef } from 'react';
import { RefreshControl, View, Image, Text, Platform, Linking, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, KeyboardAvoidingView, TouchableWithoutFeedback } from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import Modal from 'react-native-modal';
import DatePicker from 'react-native-datepicker';
import { baseUrl, shop_eat_cart, user_payment_method, cancelOrders, shop_eat_orders, shop_eat_cart_book_dining, shop_eat_cart_book_table, shop_eat_cart_id, shop_eat_business_id, shop_eat_menu_userid, requestPostApi, requestGetApi, shop_eat } from '../../../WebApi/Service'
import { useSelector, useDispatch } from 'react-redux';
import Loader from '../../../WebApi/Loader';
import Toast from 'react-native-simple-toast';
import { Rating, AirbnbRating } from 'react-native-ratings';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import DropDownPicker from 'react-native-dropdown-picker';

const ShopMyOrder = (props) => {
  const [searchValue, setsearchValue] = useState('')
  const [modlevisual1, setmodlevisual1] = useState(false)
  const [modlevisual2, setmodlevisual2] = useState(false)
  const [checkitem, setcheckitem] = useState('')
  const [reson, setreson] = useState(' ')
  const [date, setDate] = useState('')
  const [orderDate, setOrderDate] = useState('')
  const User = useSelector(state => state.user.user_details)
  const [drvRating,setdrvRating]=useState('0')
  const [showFiltersModal, setShowFiltersModal] = useState(false);
  const [orderTypeOpen, setOrderTypeOpen] = useState(false);
  const [orderTypeValue, setOrderTypeValue] = useState('');
  const [orderTypeData, setOrderTypeData] = useState([
    // {label: 'Dining', value: 'dining'},
    {label: 'Delivery', value: 'delivery'},
    // {label: 'Table Booking', value: 'booked-table'},
    {label: 'Take Away', value: 'take-away'},
  ]);
  const [timeDurationOpen, setTimeDurationOpen] = useState(false);
  const [timeDurationValue, setTimeDurationValue] = useState('');
  const [timeDurationData, setTimeDurationData] = useState([
    {label: 'Today', value: 'Today'},
    {label: '30 days', value: '30 day'},
    {label: '60 days', value: '60 day'},
    {label: '120 days', value: '120 day'},
    {label: 'Last Year', value: 'Last Year'},
    {label: 'Last 3 Years', value: 'Last 3 Years'},
  ]);
  const [statusOpen, setStatusOpen] = useState(false);
  const [statusValue, setStatusValue] = useState('');
  const [statusData, setStatusData] = useState([
    {label: 'Pending', value: '0'},
    {label: 'Accepted', value: '1'},
    {label: 'Rejected', value: '2'},
    {label: 'Preparing', value: '3'},
    {label: 'Cancelled', value: '6'},
    {label: 'Delivered', value: '12'},
  ]);
 
  const [keyword, setKeyword] = useState('');
  
  
  const [upData, setupData] = useState([
    {
      id: '1',
      title: 'Dining',
      desc: 'Order placed by mistake',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    {
      id: '2',
      title: 'Table',
      desc: 'Food preparation time was to late',
      time: '',
      img: require('../../../assets/images/images.png'),
    },
    // {
    //   id: '3',
    //   title: 'Dining',
    //   desc:'Restaurant manager behaviour was not good',
    //   time:'',
    //   img:require('../../../assets/images/images.png'),
    // },
    {
      id: '4',
      title: 'Table',
      desc: 'Changed my mind',
      time: '',
      img: require('../../../assets/images/images.png'),
    },

  ])
  const [loading, setLoading] = useState(false)
  const [orderData, setorderData] = useState([])
  const [refreshing, setRefreshing] = useState(false);
  const [cancleitem, setcancleitem] = useState('');
  useEffect(() => {
    orderList()
  }, [])

  const checkcon = () => {
    orderList()
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

  const dialCall = (number) => {
    let phoneNumber = '';

    if (Platform.OS === 'android') {
      phoneNumber = 'tel:${' + number + '}';
    }
    else {
      phoneNumber = 'telprompt:${' + number + '}';
    }
    Linking.openURL(phoneNumber);
  };

  const cancleOrder = async () => {

    setLoading(true)
    var data = {
      notes: reson,
    }
    const { responseJson, err } = await requestPostApi(cancelOrders + '/' + cancleitem.id + '/cancel', data, 'POST', User.token)
    setLoading(false)
    console.log('the res shop_eat_orders cancle==>>', responseJson)
    if (responseJson.headers.success == 1) {
      orderList()
      Toast.show(responseJson.headers.message)
      setmodlevisual1(false)
    } else {
      // setalert_sms(err)
      // setMy_Alert(true)
    }


  }

  const orderList = async (filters = false, closeModal = false) => {
    let endPoint =  shop_eat_orders
    if(filters){
      const data = {}
      if(orderTypeValue !== ''){
        data['order_type'] = orderTypeData.find(el=>el.label === orderTypeValue).value
      }
      if(timeDurationValue !== ''){
        data['from_date'] = timeDurationData.find(el=>el.label === timeDurationValue).value
      }
      if(orderDate !== ''){
        data['order_date'] = orderDate
      }
      if(keyword !== ''){
        data['keyword'] = keyword
      }
      if(statusValue !== ''){
        data['status'] = statusData.find(el=>el.label === statusValue).value
      }
      if(Object.keys(data)?.length > 0){
        endPoint +='?'  
      }
      for (const [key, value] of Object.entries(data)) {
        if(endPoint?.includes('=')){
          endPoint +=`&${key}=${value}` 
        }else{
          endPoint +=`${key}=${value}` 
        }
        console.log(`${key}: ${value}`);
      }

    }
    console.log('orderList endPoint', endPoint);
    // return
    setLoading(true)

    const { responseJson, err } = await requestGetApi(shop_eat_orders, '', 'GET', User.token)
    setLoading(false)
    console.log('the res shop_eat_orders ==>>', responseJson.body[0].items)
    if (responseJson.headers.success == 1) {
      setorderData(responseJson.body)
    } else {
      //  setalert_sms(err)
      //  setMy_Alert(true)
    }
    if(filters || closeModal){
      setShowFiltersModal(false)
    }
  }

  const resetFilter = () => {
    setKeyword('')
    setOrderTypeValue('')
    setTimeDurationValue('')
    setOrderDate('')
    setStatusValue('')
    orderList(false, true)
  }

  const design = (img, ti, tit, w, imgh, imgw, bg, redious) => {
    return (
      <View style={{ flexDirection: 'row', width: w, marginTop: 10, backgroundColor: Mycolors.TimingColor, paddingVertical: 20, borderRadius: 10, alignSelf: 'center', paddingHorizontal: 10 }}>
        <View style={{ width: 40, height: 40, backgroundColor: bg, justifyContent: 'center', borderRadius: redious }}>
          <Image source={img} style={{ width: imgw, height: imgh, overflow: 'hidden', alignSelf: 'center' }}></Image>
        </View>
        <View style={{ marginLeft: 15, width: '80%' }}>
          <Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black }}>{ti}</Text>
          <Text style={{ fontSize: 12, color: Mycolors.GrayColor, top: 3, lineHeight: 18 }}>{tit}</Text>
        </View>

      </View>
    )
  }

  const flatliistDesign = (img, ti, rs, des, press, allpress) => {
    return (
      <TouchableOpacity style={{
        width: '100%', height: 120, marginVertical: 5, backgroundColor: 'transparent',
        borderColor: '#dee4ec',

        elevation: 5, borderRadius: 10, alignSelf: 'center', flexDirection: 'row', alignItems: 'center'
      }}
        onPress={allpress}>
        <View style={{ width: 60, height: 75, alignSelf: 'center', borderRadius: 5, borderWidth: 3, borderColor: '#dee4ec' }}>
          <Image source={{ uri: img }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 5, resizeMode: 'stretch' }} ></Image>
        </View>
        <View style={{ marginLeft: 10 }}>
          <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, }} >{ti}</Text>
          <Text style={{ color: Mycolors.RED, fontWeight: '600', fontSize: 12, }} >{rs}</Text>
          <View style={{ flexDirection: 'row', top: -6 }}>
            <Text style={{ color: Mycolors.GrayColor, fontWeight: '600', fontSize: 12, }} >{des}</Text>
            <Text style={{ color: Mycolors.GrayColor, fontWeight: '600', fontSize: 12, }} > Person Serve</Text>
          </View>



          {press ?
            <View style={{ width: 120, }}>
              <MyButtons title="Call Restaurant" height={30} width={'100%'} borderRadius={5} alignSelf="center" press={press} marginHorizontal={20} fontSize={11}
                titlecolor={Mycolors.RED} backgroundColor={'transparent'} marginVertical={0} borderColor={Mycolors.RED} borderWidth={0.4} />
            </View>
            : null
          }
        </View>
        {/* <View style={{position:'absolute',width:20,height:20,top:10,right:10,borderRadius:3,backgroundColor:'red',justifyContent:'center'}}>
  <View style={{width:10,height:10,borderRadius:10,alignSelf:'center',backgroundColor:'#fff'}} />
  </View> */}
      </TouchableOpacity>
    )
  }

  const cancleDesign = (title, press, check) => {
    return (
      <TouchableOpacity style={{ width: '100%', height: 50, flexDirection: 'row', alignItems: 'center', borderRadius: 7, borderColor: check ? Mycolors.RED : Mycolors.GrayColor, borderWidth: 0.5, paddingHorizontal: 10, marginTop: 10 }}
        onPress={press}>
        <View style={{ width: 25, height: 25, borderColor: check ? Mycolors.RED : Mycolors.GrayColor, borderWidth: 0.3, justifyContent: 'center', borderRadius: 20, }}>
          {check ?
            <View style={{ width: 15, height: 15, borderRadius: 15, backgroundColor: Mycolors.RED, alignSelf: 'center' }} />
            : null
          }
        </View>
        <View>
          <Text style={{ color: Mycolors.Black, fontSize: 13, marginLeft: 10, fontWeight: '300' }}>{title}</Text>
        </View>
      </TouchableOpacity>
    )
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}

          />
        }
      >
        <HomeHeader height={60} paddingHorizontal={15}// backgroundColor={'#fff'}
          press1={() => { props.navigation.goBack() }} img1={require('../../../assets/arrow.png')} img1width={18} img1height={15}
          press2={() => { }} title2={'My Orders'} fontWeight={'500'} img2height={20}
          press3={() => { }} img3width={25} img3height={25} />
          <TouchableOpacity onPress={()=>{setShowFiltersModal(true)}} style={styles.iconView}>
            <AntDesign name="filter" color={'#fff'} size={24} />
          </TouchableOpacity>
        {/* <View style={{ width: '95%', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.025)', borderRadius: 10, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 0.2 }}>
          <HomeHeader height={40} paddingHorizontal={15}
            press1={() => { }} img1={require('../../../assets/calendar.png')} img1width={22} img1height={22}
            press2={() => { }} title2={''} fontWeight={'500'} img2height={20} right={dimensions.SCREEN_WIDTH * 28 / 100} fontSize={10} color={Mycolors.GrayColor}
            press3={() => { }} img3={require('../../../assets/shape_32.png')} img3width={25} img3height={25} />

          <View style={{ position: 'absolute' }}>
            <DatePicker
              customStyles={{
                dateInput: { borderColor: 'transparent', },
                dateText: { color: Mycolors.GrayColor },
                dateIcon: styles.dateIcon,
                dateplaceholder: {
                  alignContent: 'flex-start',
                },
                placeholderText: {
                  fontSize: 10,
                  color: Mycolors.GrayColor,
                  //marginLeft: '1%',
                  left: -5
                },
                zIndex: 99999
              }}
              showIcon={false}
              androidMode={'spinner'}
              readOnly={true}
              style={[styles.datePickerSelectInput, { fontSize: 11, color: Mycolors.GrayColor, left: 15 }]}
              date={date}
              mode="date"
              placeholder={'Pick a Date'}
              minDate={new Date()}
              format='YYYY-MM-DD'
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              //iconSource={require ('../../../assets/shape_38.png')}
              onDateChange={date => {
                setDate(date)
              }}
            />
          </View>
        </View> */}



        <View style={{ width: '90%', alignSelf: 'center' }}>

          {
            orderData.map((item, index) => {
              return (

                <>
                  {item.order_type == 'take-away' || item.order_type == 'delivery' ?
                    <View style={{ marginVertical: 10, backgroundColor: '#fff', padding: 15, borderRadius: 10, borderColor: 'rgba(0,0,0,0.2)', borderWidth: 0.5 }}>
                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 14 }}>{item.business_name}</Text>

                        <View style={{ paddingHorizontal: 10, justifyContent: 'center', borderRadius: 10, backgroundColor: 'rgba(130,213,112,0.2)', borderColor: Mycolors.GrayColor, borderWidth: 0.2 }}>
                          <Text style={{ color: Mycolors.GREEN, fontSize: 11, textAlign: 'center', lineHeight: 22 }}>{item.order_type_label}</Text>
                        </View>
                      </View>
                      <Text style={{ color: Mycolors.RED, fontWeight: '400', fontSize: 12, marginTop: 5 }}>Order ID : #{item.id}</Text>
                      {item.order_type != 'booked-table' ?
                        <>

                          <TouchableOpacity style={{
                            width: '100%',
                            //  height: 120,
                            padding:15,
                             marginVertical: 5,
                             backgroundColor: 'transparent',
                             borderColor: '#dee4ec',
                             elevation: 3,
                             borderRadius: 2,
                             alignSelf: 'center',
                             flexDirection: 'row',
                             alignItems: 'center'
                          }}
                            onPress={() => { }}>
                            <View style={{ width: 60, height: 75, alignSelf: 'center', borderRadius: 5, borderWidth: 1, borderColor: '#dee4ec', }}>
                              <Image source={{ uri: item.banner_image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 5, resizeMode: 'stretch' }} ></Image>
                            </View>
                            <View style={{ marginLeft: 10 }}>
                                      {item.items.map((sitem, index) => {
                                return (
                                  <View style={{ flexDirection: 'row', top: -6, marginTop: 4 }}>
                                    <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 13, }} >{sitem.quantity}</Text>
                                    <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 13, }} > X {sitem.product_name}</Text>
                                  </View>
                                )
                              })}
                              <Text style={{ color: Mycolors.Black, fontWeight: '400', fontSize: 12, }} >Total Amount - ${item.amount}</Text>

                              <View style={{ width: 120, }}>
                                <MyButtons title="Call Restaurant" height={30} width={'100%'} borderRadius={5} alignSelf="center" press={() => { dialCall(item.business_phone) }} marginHorizontal={20} fontSize={11}
                                  titlecolor={Mycolors.RED} backgroundColor={'transparent'} marginVertical={0} borderColor={Mycolors.RED} borderWidth={0.4} />
                              </View>

                            </View>
                          </TouchableOpacity>

                        </>
                        :
                       null
                      }
                      <View style={{ borderColor: Mycolors.GrayColor, borderWidth: 1, borderStyle: 'dashed', }} />

                      {design(require('../../../assets/shape_39.png'), 'Order Status', item.status_label, '100%', 25, 28, 'red', 20)}

                      <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', alignSelf: 'center', marginTop: 15 }}>
                         {/* {item.status!= 5 ?
                         <MyButtons title={"Cancel Order"} height={45} width={'47%'} borderRadius={5} alignSelf="center" press={() => {
                            setcancleitem(item)
                            setmodlevisual1(true)
                          }} fontSize={11}
                            titlecolor={Mycolors.RED} backgroundColor={'transparent'} marginVertical={0} borderColor={Mycolors.RED} borderWidth={0.2} />
                       : null
                          } */}

                        {item.order_type == 'take-away' && item.business_rating== null ?
                          <MyButtons title="Submit Review" height={45} width={'47%'} borderRadius={5} alignSelf="center" press={() => {
                              if(item.business_rating== null){
                             props.navigation.navigate('ShopReview', { data: item, from: 'myOrder' })
                              }
                          }} fontSize={11}
                            titlecolor={Mycolors.RED} backgroundColor={'transparent'} marginVertical={0} borderColor={Mycolors.RED} borderWidth={0.2} />
                          : null
                        }

                        {item.order_type == 'delivery' && item.status!= 5 && item.status!= 0 && item.driver_id != null ?
                          <MyButtons title="Navigate" height={45} width={'47%'} borderRadius={5} alignSelf="center" press={() => {
                            props.navigation.navigate('Traking',{data:item})
                           }} fontSize={11}
                            titlecolor={Mycolors.RED} backgroundColor={'transparent'} marginVertical={0} borderColor={Mycolors.RED} borderWidth={0.2} />
                          :
                          item.order_type == 'delivery' && item.status== 5 && item.business_rating== null ?
                          <MyButtons title="Submit Review" height={45} width={'47%'} borderRadius={5} alignSelf="center" press={() => {
                            if(item.business_rating== null){
                           props.navigation.navigate('ShopReview', { data: item, from: 'myOrder' })
                            }
                        }} fontSize={11}
                          titlecolor={Mycolors.RED} backgroundColor={'transparent'} marginVertical={0} borderColor={Mycolors.RED} borderWidth={0.2} />
                        : null

                        }
                        {   item.order_type == 'delivery' && item.status== 5 ?
<View style={{paddingHorizontal:10}}>
                          <MyButtons title="Driver Review" height={45} width={'100%'} paddingHorizontal={10} borderRadius={5} alignSelf="center" press={() => {
                           setmodlevisual2(true)
                            }} fontSize={11}
                          titlecolor={Mycolors.RED} backgroundColor={'transparent'} marginVertical={0} borderColor={Mycolors.RED} borderWidth={0.2} />
</View>
: null }
                      </View>
{   item.order_type == 'delivery' && item.status== 5 ?
null
:
item.order_type == 'delivery' && item.status!= 5 && item.status!= 0 && item.driver_id != null ?
<MyButtons title="Message" height={45} width={'47%'} borderRadius={5} alignSelf="center" press={() => {
         props.navigation.navigate('Chat', { data: item, from: 'myOrder' })

                        }} fontSize={11}
                          titlecolor={Mycolors.RED} backgroundColor={'transparent'} marginVertical={0} borderColor={Mycolors.RED} borderWidth={0.2} />
:null
}


                      {item.business_rating!= null ?
                      <View style={{marginVertical:10,paddingHorizontal:5,backgroundColor:'#fff',alignItems:'flex-start',flexDirection:'row'}}>
                      <Text style={{fontSize:13,color:'#000',marginRight:5}}>You Rated</Text>
                          <Rating
                                type='custom'
                                ratingCount={5}
                                imageSize={16}
                                startingValue={item.business_rating}
                              // style={{alignSelf:'flex-start',backgroundColor:'red'}}
                             
                               readonly={true}
                             />
                      </View>
                      :
                      null
                      }
                    </View>
                    :
                    null
                  }
                </>




              )
            }
            )
          }



        </View>
        <View style={{ height: 100 }} />
      </ScrollView>


      {/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model1 Cancle Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
      <Modal
        isVisible={modlevisual1}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual1(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >

        <View style={{ height: '70%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, }}>
          <View style={{ width: '100%', height: 50, backgroundColor: Mycolors.TimingColor, borderTopLeftRadius: 30, borderTopRightRadius: 30, justifyContent: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 14, marginTop: 5, color: Mycolors.Black, textAlign: 'center' }}>Cancel Order</Text>
          </View>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} style={{ paddingHorizontal: 20 }}>
            <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 12, marginTop: 10 }} >Select Specific reason for cancel order</Text>
            <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
              {
                upData.map((item, index) => {
                  return (
                    <View>
                      {cancleDesign(item.desc, () => { setcheckitem(item) }, checkitem == item ? true : false)}

                    </View>
                  )
                }
                )
              }
            </View>
            <Text style={{ fontWeight: '600', fontSize: 14, marginTop: 20, color: Mycolors.Black, }}>Other Reason</Text>

            <View style={{ width: '100%', height: 100, borderRadius: 2, marginTop: 10, alignSelf: 'center' }}>
              <TextInput
                value={reson}
                onChangeText={(e) => setreson(e)}
                placeholder={'Type here'}
                placeholderTextColor="#bbbbbb"
                multiline={true}
                // maxLength={500}
                // keyboardType="number-pad"
                autoCapitalize='none'
                style={[styles.input]}
              />

            </View>

            <View style={{ width: '100%' }}>
              <MyButtons title="Cancel order" height={50} width={'100%'} borderRadius={5} alignSelf="center" press={() => { cancleOrder() }} marginHorizontal={20} fontSize={14}
                titlecolor={Mycolors.BG_COLOR} hLinearColor={['#b10027', '#fd001f']} />
            </View>

            <View style={{ width: '100%', flexDirection: 'row', alignItems: 'center', marginTop: 20, backgroundColor: Mycolors.TimingColor, borderRadius: 5, padding: 10 }}>
              <View style={{ width: 22, height: 22, backgroundColor: Mycolors.RED, borderRadius: 20, justifyContent: 'center' }}>
                <Image source={require('../../../assets/info.png')} style={{ width: 13, height: 13, alignSelf: 'center' }}></Image>
              </View>
              <View style={{ marginLeft: 10, width: '80%' }}>
                <Text style={{ color: Mycolors.Black, fontWeight: '300', fontSize: 12, lineHeight: 14, fontStyle: 'italic' }}>Note: Cancellation fees of $5.00 for courier's time
                  might apply if 10 minutes had elapsed since your
                  order was placed.</Text>
              </View>
            </View>

            <View style={{ width: 100, height: 100 }} />
          </ScrollView>

        </View>
        {loading ? <Loader /> : null}
      </Modal>

{/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model1 Submit Driver Review Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
  <Modal
        isVisible={modlevisual2}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual2(false)
        }}
        scrollTo={() => { }}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >

        <View style={{ height: '30%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, }}>
          <View style={{ width: '100%', height: 50, backgroundColor: Mycolors.TimingColor, borderTopLeftRadius: 30, borderTopRightRadius: 30, justifyContent: 'center' }}>
            <Text style={{ fontWeight: '600', fontSize: 14, marginTop: 5, color: Mycolors.Black, textAlign: 'center' }}>Submit Driver Review</Text>
          </View>
       
          {/* <Text style={{fontWeight:'500',fontSize:13,marginTop:20,color:Mycolors.Black,lineHeight:20}}>Please provide rating for the restaurant here.</Text> */}
              <View style={{marginTop:20,paddingHorizontal:5,backgroundColor:'#fff',alignItems:'flex-start',alignSelf:'center'}}>

              <Rating
                 type='custom'
                 ratingCount={5}
                 imageSize={25}
                 startingValue={0}
               // style={{alignSelf:'flex-start',backgroundColor:'red'}}
                onSwipeRating={(d)=>{setdrvRating(d)}}
                // onFinishRating={(d)=>{setdrvRating(d)}}
                //readonly={true}
              />
              </View>

              <View style={{ width: '100%' ,marginTop:10}}>
              <MyButtons title="Submit" height={45} width={'70%'} borderRadius={5} alignSelf="center" press={() => { setmodlevisual2(false) }} marginHorizontal={20} fontSize={14}
                titlecolor={Mycolors.BG_COLOR} hLinearColor={['#b10027', '#fd001f']} />
            </View>


        </View>



        {loading ? <Loader /> : null}
      </Modal>

      <Modal
        isVisible={showFiltersModal}
        swipeDirection="down"
        onBackdropPress={()=>setShowFiltersModal(false)}
        onSwipeComplete={(e) => {
          setShowFiltersModal(false)
        }}
          scrollTo={() => {}}
          scrollOffset={1}
          propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '90%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
         
          <View style={{flexDirection:'row',justifyContent:'center', marginBottom:5, marginTop:10}}>
            <Text style={{flex:4,color:Mycolors.Black,fontWeight:'500', textAlign:'center'}}>Filter</Text>
          </View>
       
          <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>

{/* <View style={{ width: '100%', height: 100, borderRadius: 2, marginTop: 10, alignSelf: 'center' }}> */}
<Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black, marginTop:10, marginBottom:5 }}>Keyword</Text>
              <TextInput
                value={keyword}
                onChangeText={(e) => setKeyword(e)}
                placeholder={'Type Keyword'}
                placeholderTextColor="#bbbbbb"
                // multiline={true}
                // maxLength={500}
                // keyboardType="number-pad"
                autoCapitalize='none'
                style={[styles.input, {height:50}]}
              />

            {/* </View> */}

{/* <DropDownPicker
    open={orderTypeOpen}
    value={orderTypeValue}
    items={orderTypeData}
   //multiple={true}
    setOpen={()=>{timeDurationOpen && setTimeDurationOpen(false); statusOpen && setStatusOpen(false); setOrderTypeOpen(!orderTypeOpen)}}
    setValue={(v)=>{setOrderTypeValue(v)}}
    setItems={(i)=>{setOrderTypeData(i)}}
   // listMode="MODAL"
    placeholder="Select Order Type"
    onChangeValue={(value) => {
      setOrderTypeValue(value)
      console.log('hihiihi',value)
      // getData(makeUrl(value))
      // setreloades(!reloades)
    }}
    dropDownDirection="BOTTOM"
    placeholderStyle={{
      color: '#000',
      fontSize:12,
      fontWeight: "600"
    }}
    textStyle={{
      color: '#000',
    //  fontSize:5
    }}
    style={{borderColor:'transparent',backgroundColor:'transparent',height:30, zIndex: (timeDurationOpen || statusOpen) ?99:999,top:-5,right:-4}}
    containerStyle={{
      borderColor:'red',
      height:30,
      zIndex: (timeDurationOpen || statusOpen) ?99:999
    }}
    disabledStyle={{
      opacity: 0.5
    }}
    dropDownContainerStyle={{
      backgroundColor: "#fff",
      borderColor:'#000',
      // height:360,
      borderWidth:0.2,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 5,
      shadowOpacity: 1.0,
      elevation: 5,
      zIndex: (timeDurationOpen || statusOpen) ?99:999
    }}
  /> */}
  <Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black, marginTop:10, marginBottom:5 }}>Order Type</Text>
  <FlatList
    data={orderTypeData}
      numColumns={2}
      keyExtractor={item => item.label}
    renderItem={({item, index}) => {
      return (
        <TouchableWithoutFeedback onPress={()=>{setOrderTypeValue(item.label)}}>
          
        <View style={[styles.radioButtonContainer, {width:'50%'}]}>
        <MaterialCommunityIcons name={item.label === orderTypeValue ? "radiobox-marked":"radiobox-blank"} color={Mycolors.RED} size={24} />
        <Text style={{ color: Mycolors.RED, fontWeight: '600', fontSize: 12, marginLeft:5}} >{item.label}</Text>
      </View>
        </TouchableWithoutFeedback>
      );
    }}
  />
{/* <DropDownPicker
    open={timeDurationOpen}
    value={timeDurationValue}
    items={timeDurationData}
   //multiple={true}
    setOpen={()=>{orderTypeOpen && setOrderTypeOpen(false); statusOpen && setStatusOpen(false); setTimeDurationOpen(!timeDurationOpen)}}
    setValue={(v)=>{setTimeDurationValue(v)}}
    setItems={(i)=>{setTimeDurationData(i)}}
   // listMode="MODAL"
    placeholder="Select Time Duration"
    onChangeValue={(value) => {
      setTimeDurationValue(value)
      console.log('hihiihi',value)
      // getData(makeUrl(value))
      // setreloades(!reloades)
    }}
    dropDownDirection="BOTTOM"
    placeholderStyle={{
      color: '#000',
      fontSize:12,
      fontWeight: "600"
    }}
    textStyle={{
      color: '#000',
    //  fontSize:5
    }}
    style={{borderColor:'transparent',backgroundColor:'transparent',height:30, zIndex: (orderTypeOpen || statusOpen) ?99:999,top:-5,right:-4}}
    containerStyle={{
      borderColor:'red',
      height:30,
      zzIndex: (orderTypeOpen || statusOpen) ?99:999
    }}
    disabledStyle={{
      opacity: 0.5
    }}
    dropDownContainerStyle={{
      backgroundColor: "#fff",
      borderColor:'#000',
      // height:360,
      borderWidth:0.2,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 5,
      shadowOpacity: 1.0,
      elevation: 5,
      zIndex: (orderTypeOpen || statusOpen) ?99:999
    }}
  /> */}
  <Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black, marginTop:10, marginBottom:5  }}>Time Duration</Text>
  <FlatList
    data={timeDurationData}
      numColumns={2}
      keyExtractor={item => item.label}
    renderItem={({item, index}) => {
      return (
        <TouchableWithoutFeedback onPress={()=>{setTimeDurationValue(item.label)}}>
          
        <View style={[styles.radioButtonContainer, {width:'50%'}]}>
        <MaterialCommunityIcons name={item.label === timeDurationValue ? "radiobox-marked":"radiobox-blank"} color={Mycolors.RED} size={24} />
        <Text style={{ color: Mycolors.RED, fontWeight: '600', fontSize: 12, marginLeft:5}} >{item.label}</Text>
      </View>
        </TouchableWithoutFeedback>
      );
    }}
  />
{/* <DropDownPicker
    open={statusOpen}
    value={statusValue}
    items={statusData}
   //multiple={true}
    setOpen={()=>{orderTypeOpen && setOrderTypeOpen(false); timeDurationOpen && setTimeDurationOpen(false);setStatusOpen(!statusOpen)}}
    setValue={(v)=>{setStatusValue(v)}}
    setItems={(i)=>{setStatusData(i)}}
   // listMode="MODAL"
    placeholder="Select Status"
    onChangeValue={(value) => {
      setStatusValue(value)
      console.log('hihiihi',value)
      // getData(makeUrl(value))
      // setreloades(!reloades)
    }}
    dropDownDirection="BOTTOM"
    placeholderStyle={{
      color: '#000',
      fontSize:12,
      fontWeight: "600"
    }}
    textStyle={{
      color: '#000',
    //  fontSize:5
    }}
    style={{borderColor:'transparent',backgroundColor:'transparent',height:30, zIndex: (orderTypeOpen || timeDurationOpen) ?99:999,top:-5,right:-4}}
    containerStyle={{
      borderColor:'red',
      height:30,
      zIndex: (orderTypeOpen || timeDurationOpen) ?99:999
    }}
    disabledStyle={{
      opacity: 0.5
    }}
    dropDownContainerStyle={{
      backgroundColor: "#fff",
      borderColor:'#000',
      // height:360,
      borderWidth:0.2,
      shadowColor: '#000000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 5,
      shadowOpacity: 1.0,
      elevation: 5,
      zIndex: (orderTypeOpen || timeDurationOpen) ?99:999
    }}
  /> */}
  <Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black, marginTop:10, marginBottom:5 }}>Status</Text>
  <FlatList
    data={statusData}
      numColumns={2}
      keyExtractor={item => item.label}
    renderItem={({item, index}) => {
      return (
        <TouchableWithoutFeedback onPress={()=>{setStatusValue(item.label)}}>
          
        <View style={[styles.radioButtonContainer, {width:'50%'}]}>
        <MaterialCommunityIcons name={item.label === statusValue ? "radiobox-marked":"radiobox-blank"} color={Mycolors.RED} size={24} />
        <Text style={{ color: Mycolors.RED, fontWeight: '600', fontSize: 12, marginLeft:5}} >{item.label}</Text>
      </View>
        </TouchableWithoutFeedback>
      );
    }}
  />
  <Text style={{ fontSize: 13, fontWeight: 'bold', color: Mycolors.Black, marginTop:10, marginBottom:5 }}>Order Date</Text>
<View style={{ width: '100%', alignSelf: 'center', backgroundColor: 'rgba(0,0,0,0.025)', borderRadius: 10, borderBottomColor: 'rgba(0,0,0,0.5)', borderBottomWidth: 0.2 }}>
          <HomeHeader height={40} paddingHorizontal={15}
            press1={() => { }} img1={require('../../../assets/calendar.png')} img1width={22} img1height={22}
            press2={() => { }} title2={''} fontWeight={'500'} img2height={20} right={dimensions.SCREEN_WIDTH * 28 / 100} fontSize={10} color={Mycolors.GrayColor}
            // press3={() => { }} img3={require('../../../assets/shape_32.png')} img3width={25} img3height={25} 
            />
<View style={{ position: 'absolute' }}>
<DatePicker
              customStyles={{
                dateInput: { borderColor: 'transparent', },
                dateText: { color: Mycolors.GrayColor },
                dateIcon: styles.dateIcon,
                dateplaceholder: {
                  alignContent: 'flex-start',
                },
                placeholderText: {
                  fontSize: 10,
                  color: Mycolors.GrayColor,
                  //marginLeft: '1%',
                  left: -5
                },
                zIndex: 99999
              }}
              showIcon={false}
              androidMode={'spinner'}
              readOnly={true}
              style={[styles.datePickerSelectInput, { fontSize: 11, color: Mycolors.GrayColor, left: 15 }]}
              date={orderDate}
              mode="date"
              placeholder={'Pick a Date'}
              minDate={new Date()}
              format='YYYY-MM-DD'
              confirmBtnText="Confirm"
              cancelBtnText="Cancel"
              //iconSource={require ('../../../assets/shape_38.png')}
              onDateChange={date => {
                setOrderDate(date)
              }}
            />
            </View>
            </View>

            <View style={{height:30}} />

            <MyButtons title="Submit" height={45} width={'50%'} borderRadius={10} alignSelf="center" press={()=>{orderList(true)}} marginHorizontal={20} fontSize={11}
              titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.GREEN}  />
            <MyButtons title="Reset" height={45} width={'50%'} borderRadius={10} alignSelf="center" press={resetFilter} marginHorizontal={20} fontSize={11}
              titlecolor={'black'} backgroundColor={'transparent'}  />
            </KeyboardAvoidingView>
            </ScrollView>
           
            </View>
</Modal>

      {loading ? <Loader /> : null}

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
  // datePickerSelectInput:{
  //   height: 45,
  //   width:'100%',
  //   fontSize: 15,
  //   borderColor: null,
  // //  backgroundColor: '#fff',
  //   borderRadius:10,
  //   color:Mycolors.GrayColor,
  // },
  iconView:{
    height:50,
    width:50,
    borderRadius: 5,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:Mycolors.RED,
    width:'18%',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 15,
    elevation: 2,
  },
  radioButtonContainer:{
    flexDirection:'row',
    alignItems:'center',
  }
});
export default ShopMyOrder