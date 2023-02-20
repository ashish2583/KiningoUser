import React, { useEffect,useState ,useRef} from 'react';
import {RefreshControl,View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider,ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import { Rating } from 'react-native-ratings';
import ViewMoreText from 'react-native-view-more-text';
import Toggle from "react-native-toggle-element";
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { setSelectedCarTab } from '../../../redux/actions/user_action'; 
import DatePicker from 'react-native-datepicker';
import { baseUrl,shop_eat_cart,user_payment_method,shop_eat_orders, shop_eat_cart_book_dining,shop_eat_cart_book_table,shop_eat_cart_id,shop_eat_business_id,shop_eat_menu_userid, requestPostApi,requestGetApi,shop_eat } from '../../../WebApi/Service'
import Loader from '../../../WebApi/Loader';
import Toast from 'react-native-simple-toast'
import MyAlert from '../../../component/MyAlert';
import { useSelector, useDispatch } from 'react-redux';


const FoodDetails = (props) => {
  const User = useSelector(state => state.user.user_details)
  const [searchValue,setsearchValue]=useState('')
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [selectedTab,setselectedTab]=useState('Take Away')
  const [cookingIns,setcookingIns]=useState('')
  const [selectedTime,setselectedTime]=useState('')
  const [selectedTime2,setselectedTime2]=useState('')
  const [counter,setcounter]=useState(1)
  const [date, setDate] = useState('')
  const [toggleValue, setToggleValue] = useState(false);
  const [modlevisual1,setmodlevisual1] = useState(false)
  const [modlevisual2,setmodlevisual2] = useState(false)
  const [modlevisual3,setmodlevisual3] = useState(false)
  const [modlevisual4,setmodlevisual4] = useState(false)
  const [upData,setupData]=useState([
    {
      id: '1',
      title: 'Hair Cut',
      desc:'',
      time:'10:00AM',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '2',
      title: 'Shaving',
      desc:'',
      time:'10:30AM',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '3',
      title: 'Facial',
      desc:'',
      time:'11:00AM',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '4',
      title: 'Hair Color',
      desc:'',
      time:'11:30AM',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '5',
      title: 'Hair wash',
      desc:'',
      time:'12:00PM',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '6',
      title: 'Beard style',
      desc:'',
      time:'12:30PM',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '7',
      title: 'Facial',
      desc:'',
      time:'01:00PM',
      img:require('../../../assets/images/images.png'),
    },
  ])
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState([])
  const [menuresData, setmenuresData] = useState([])
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [bannerimg,setbannerimg]=useState('')
  const [allImg,setAllImg] =useState([{img: ''}])
  const [ClickedItemData, setClickedItemData]=useState('')
  const [diningItens,setdiningItens]=useState([])
  const [diningItens1,setdiningItens1]=useState([])
  const [reloades,setreloades]=useState(false)
  const [cartCount, setcartCount] = useState('0')
  const [futureTimes, setfutureTimes] = useState([])
  const [imgcartCount, setimgcartCount] = useState(1)
  const [timimgs, settimimgs] = useState('')
  const [refreshing, setRefreshing] = useState(false);
  useEffect(()=>{
    vendorDetail()
    menuList()
    },[])

    const checkcon=()=>{
      vendorDetail()
      menuList()
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
    
const addMinutes=(time, minutes)=> {
  var date = new Date(new Date('01/01/2015 ' + time).getTime() + minutes * 60000);
  var tempTime = ((date.getHours().toString().length == 1) ? '0' + date.getHours() : date.getHours()) + ':' +
    ((date.getMinutes().toString().length == 1) ? '0' + date.getMinutes() : date.getMinutes()) 
     + ':' +   ((date.getSeconds().toString().length == 1) ? '0' + date.getSeconds() : date.getSeconds());
  return tempTime;
}

const setBannerImages=()=>{
  console.log('ashish kumar verma');
  var j=1
  for(j=1;j<=allImg.length;j++){
    setTimeout(()=>{
      setbannerimg(allImg[j-1])
      console.log('hii');
    },500)
    if(j==allImg.length){
      j=1
    }
  }
}

const A=()=>{
  console.log('heooop');
  setTimeout(()=>{
    var imm=allImg 
    var total_len=imm.length 
   
    console.log('total_len',total_len);
    if(total_len==imgcartCount){
      console.log('imgcartCount',imgcartCount);
      setimgcartCount(1)
    }else{
      setimgcartCount(parseInt(imgcartCount)+parseInt(1))
    }
    setbannerimg(imm[imgcartCount-1])
    setreloades(!reloades)
    console.log('imgggg',imm[parseInt(imgcartCount-1)]);
    B()
  },5000)
}

const B=()=>{
  A()
}

const bookTables = async () => {
  var td=''
  var tt=''
if(date==''){
 if(selectedTime==''){
  Toast.show('Please Select Time Slot')
 }else{
   td=new Date()
   tt=selectedTime
 }
 
}else{
  if(selectedTime2==''){
    Toast.show('Please Select Time Slot')
   }else{
    td=date
    tt=selectedTime2
   }
}
if(td!='' && tt!=''){
   setLoading(true)
  var data={
    "business_id": props.route.params.data.business_id,
    "no_of_person": counter,
    "schedule_date": td,
    "schedule_time_from": tt,
    "schedule_time_to": tt
}
console.log(data);
  const { responseJson, err } = await requestPostApi(shop_eat_cart_book_table, data, 'POST', User.token)
  setLoading(false)
  console.log('the res==>>', responseJson)
  if (responseJson.headers.success == 1) {
    // setmodlevisual3(false)
    // setmodlevisual4(true)
    // setmodlevisual1(false)
    // setmodlevisual2(false)
    Alert.alert(
      '',
      'Booking request has been sent successfully you will receive a notification once your table is finalized.', // <- this part is optional, you can pass an empty string
      [
        {text: 'OK', onPress: () => props.navigation.navigate('DiningAndBookTable')},
      ],
      // {cancelable: false},
    );
   // Alert.alert('Booking request has been sent successfully you will receive a notification once your table is finalized.')
  } else {
  setalert_sms(err)
  setMy_Alert(true)
  }
}else{
  //Toast.show('Please Select date and time')
}
 
}

const bookDiningSlote = async () => {
  
  setLoading(true)
var itemss=[]
var dd=diningItens1
var totals=0
for(let i=1;i<=dd.length;i++){
  itemss.push({
    'product_id':dd[i-1].id,
    'product_type':'simple',
    "quantity": dd[i-1].cart_quantity,
    "item_total": dd[i-1].price*dd[i-1].cart_quantity
  })
  totals=parseInt(totals) + parseInt(dd[i-1].price*dd[i-1].cart_quantity)
}

  var data={
  "business_id": props.route.params.data.business_id,
  "items" :itemss,
  "sub_total": totals,
  "total": totals
}
console.log(data);
  const { responseJson, err } = await requestPostApi(shop_eat_cart_book_dining, data, 'POST', User.token)
  setLoading(false)
  console.log('the res==>>', responseJson)
  if (responseJson.headers.success == 1) {
    Toast.show(responseJson.headers.message)
    setdiningItens1([])
    setmodlevisual3(false)
  } else {
  setalert_sms(err)
  setMy_Alert(true)
  }
}

const putcart = async (item,add) => {
   
  setLoading(true)
  var data=''
 if(add=='+'){
 data={
    id: item.cart_id,
    product_id: item.id,
    quantity: item.cart_quantity+1,
  }
 }else{
  if(item.quantity>1){
    data={
    id: item.id,
    product_id: item.product_id,
    quantity: item.cart_quantity-1,
  }
  }else{
     deletcart(item)
  }
  
 }
  
  const { responseJson, err } = await requestPostApi(shop_eat_cart_id+item.cart_id, data, 'PUT', User.token)
  setLoading(false)
  console.log('the res==>>', responseJson)
  if (responseJson.headers.success == 1) {
     Toast.show(responseJson.headers.message)
     menuList()
     setreloades(!reloades)
  } else {
  // setalert_sms(err)
  // setMy_Alert(true)
  }
}

const deletcart = async (item) => {
   
  setLoading(true)
  
  const { responseJson, err } = await requestPostApi(shop_eat_cart_id+item.cart_id, '', 'DELETE',User.token)
  setLoading(false)
  console.log('the res==>>', responseJson)
  if (responseJson.headers.success == 1) {
    // Toast.show(responseJson.headers.message)
    menuList()
    setreloades(!reloades)
  } else {
    menuList()
  // setalert_sms(err)
  // setMy_Alert(true)
  }
}

 const postcart = async (items) => {
  
  setLoading(true)
  var data={
      product_id: items.id,
      quantity: 1,
      business_id: props.route.params.data.business_id,
    }
  const { responseJson, err } = await requestPostApi(shop_eat_cart, data, 'POST', User.token)
  setLoading(false)
  console.log('the res==>>', responseJson)
  if (responseJson.headers.success == 1) {
   Toast.show(responseJson.headers.message)
   menuList()
  //  props.navigation.navigate('ShopCart')
  } else {
  setalert_sms(err)
  setMy_Alert(true)
  }
}
const myfun=(stime,etime)=>{
  var starttime = stime;
var interval = "30";
var endtime = etime;
var timeslots = [starttime];


while (starttime != endtime) {
	
  starttime = addMinutes(starttime, interval);
  timeslots.push(starttime);

}
// console.log('hello ji times',timeslots);
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

// alert(formatDate("February 04, 2011 12:00:00"));

 const vendorDetail = async () => {
   
  setLoading(true)
  
  const { responseJson, err } = await requestGetApi(shop_eat_business_id+props.route.params.data.business_id, '', 'GET', '')
  setLoading(false)
  console.log('the res shop_eat_business_id==>>', responseJson)
  if (responseJson.headers.success == 1) {
    console.log('the res shop_eat_business_id services ==>>', responseJson.body.services)
    console.log('the res features ==>>', responseJson.body.features)
  var updated=0
    for(let j=1;j<=responseJson.body.services.length;j++){
     if(responseJson.body.services[j-1].attribute_label=='Book A Table' &&  responseJson.body.services[j-1].attribute_value=='yes'){
        var stimess= myfun(responseJson.body.services[j-1].attribute_detail.substring(0,5)+':00',responseJson.body.services[j-1].attribute_detail.substring(10,15)+':00')
        setfutureTimes(stimess)
        settimimgs(responseJson.body.services[j-1].attribute_detail.substring(0,5)+':00 - '+responseJson.body.services[j-1].attribute_detail.substring(10,15)+':00')
       }
       if(responseJson.body.services[j-1].attribute_value=='yes' && updated ==0){
        setselectedTab(responseJson.body.services[j-1].attribute_label)
        updated=1
      }
     }
     setbannerimg(responseJson.body.bannerImages[0].image)
     var allimgs=[];
     for(let i=1;i<=responseJson.body.bannerImages.length;i++){
      allimgs.push({img: responseJson.body.bannerImages[i-1].image})
     }
     setAllImg(allimgs)
     setresData(responseJson.body)
    //  A()
  } else {
     setalert_sms(err)
     setMy_Alert(true)
  }
}

const menuList = async () => {
   
  setLoading(true)
  const { responseJson, err } = await requestGetApi(shop_eat_menu_userid+props.route.params.data.userid, '', 'GET', User.token)
  setLoading(false)
  console.log('the res in_cart shop_eat_menu_userid ==>>', responseJson)
  if (responseJson.headers.success == 1) {
    var counts=0
    for(let i=1;i<=responseJson.body.length;i++){
     if(responseJson.body[i-1].in_cart=='1'){
      counts=parseInt(counts)+parseInt('1')
     }
    }
    setcartCount(counts)
    setmenuresData(responseJson.body)
    setreloades(!reloades)
  } else {
     setalert_sms(err)
     setMy_Alert(true)
  }

}

const searchmenuList = async () => {
   
  setLoading(true)
  
  const { responseJson, err } = await requestGetApi(shop_eat_menu_userid+props.route.params.data.userid+'?name='+searchValue.text, '', 'GET', '')
  setLoading(false)
  console.log('the res shop_eat_menu_userid ==>>', responseJson)
  if (responseJson.headers.success == 1) {
    setmenuresData(responseJson.body)
    // setsearchValue('')
  } else {
     setalert_sms(err)
     setMy_Alert(true)
  }

}

const itemloop = (item) => {
 // diningItens.includes(item) ? true : false,
 var rdata=false
 var resdd=diningItens1
 console.log('klklkl',resdd);
 console.log('lklklklkl',item);
  for(let i=1;i<=resdd.length;i++){
   if(resdd[i-1].id==item.id){
    rdata=true
   }
  }
  return rdata ;
}

const itemqty = (item) => {
  // diningItens.includes(item) ? true : false,
  var rdata=1
  var resdd=diningItens1
   for(let i=1;i<=resdd.length;i++){
    if(resdd[i-1].id==item.id){
     rdata=resdd[i-1].cart_quantity
    }
   }
   return rdata ;
 }
 
 const plushqty = (item) => {
  // diningItens.includes(item) ? true : false,
  console.log('state1');
  var resdd=diningItens1
   for(let i=1;i<=resdd.length;i++){
    if(resdd[i-1].id==item.id){
      console.log('state2');
      resdd[i-1].cart_quantity= parseInt(resdd[i-1].cart_quantity)+1
    }
   }
   console.log('state3',resdd);
   setdiningItens1(resdd)
   setreloades(!reloades)
 }
 
 const minus = (item) => {
  // diningItens.includes(item) ? true : false,
  var resdd=diningItens1
  for(let i=1;i<=resdd.length;i++){
   if(resdd[i-1].id==item.id){
     console.log('state2');
     if(resdd[i-1].cart_quantity<=1){
      const previousSecondElementOfTheArray = resdd.splice(resdd[i-1], 1);
     }else{
       resdd[i-1].cart_quantity= parseInt(resdd[i-1].cart_quantity)-1
     }
    
   }
  }
  console.log('state3',resdd);
  setdiningItens1(resdd)
  setreloades(!reloades)
  
 }

const design=(img,ti,tit,w,imgh,imgw,bg,redious)=>{
  return(
    <View style={{flexDirection:'row',alignItems:'center',width:w,marginTop:10}}>
   <View style={{width:50,height:50,backgroundColor:bg,justifyContent:'center',borderRadius:redious,borderColor:'gray',borderWidth:0.5}}>
    <Image source={{uri:img}} style={{width:imgw,height:imgh,overflow:'hidden',alignSelf:'center'}}></Image>
   </View>
   <View style={{marginLeft:15,}}>
    <Text style={{fontSize:12,fontWeight:'bold',color:Mycolors.Black}}>{ti}</Text>
    <Text style={{fontSize:12,color:Mycolors.GrayColor,top:3}}>{tit}</Text>
   </View>
   
  </View>
  )
}
 
const flatliistDesign=(img,ti,rs,des,press,allpress,item,mpress,apress,boxcolor)=>{
  return(
    <TouchableOpacity style={{width:'95%',height:120,marginHorizontal:5,marginVertical:5, padding:10,backgroundColor:'#fff',
    borderColor:'#dee4ec',
    borderWidth:1,
    elevation: 5,borderRadius:10,alignSelf:'center',flexDirection:'row',alignItems:'center'}}
    onPress={allpress}>
<View style={{width:60,height:75,alignSelf:'center',borderRadius:5,borderWidth:3,borderColor:'#dee4ec'}}>
<Image source={{uri:img}}  style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:5,resizeMode: 'stretch'}} ></Image>
</View>
<View style={{marginLeft:10}}>
<Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:9}} >{ti}</Text>
<Text style={{color:Mycolors.RED,fontWeight:'600',fontSize:12,marginTop:9}} >{rs}</Text>
<View style={{flexDirection:'row'}}>
<Text style={{color:Mycolors.GrayColor,fontWeight:'600',fontSize:12,marginTop:9}} >Food Preparation Time:</Text>
<Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:9}} >{des}</Text>
</View>


{item.in_cart!='1' ?
<View style={{width:70}}>
<MyButtons title="ADD" height={30} width={'100%'} borderRadius={5} alignSelf="center" press={press} marginHorizontal={20} fontSize={11}
titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} />
</View>
: 
<View style={{width:100,height:30,flexDirection:'row',alignItems:'center',marginTop:5,}}>
<TouchableOpacity style={{width:30,height:30,borderRadius:20,backgroundColor:'#FFE2E6',justifyContent:'center'}}
onPress={mpress}>
<Text style={{textAlign:'center',fontSize:25,color:'red',top:-1}}>-</Text>
</TouchableOpacity>
<Text style={{marginHorizontal:10,color:Mycolors.Black}}>{item.cart_quantity}</Text>
<TouchableOpacity style={{width:30,height:30,borderRadius:20,backgroundColor:'red',justifyContent:'center'}}
onPress={apress}>
<Text style={{textAlign:'center',fontSize:25,color:'#fff',top:-1}}>+</Text>
</TouchableOpacity>
   </View>
}
</View>
  <View style={{position:'absolute',width:20,height:20,top:10,right:10,borderRadius:3,backgroundColor:boxcolor,justifyContent:'center'}}>
  <View style={{width:10,height:10,borderRadius:10,alignSelf:'center',backgroundColor:'#fff'}} />
  </View>
</TouchableOpacity>
  )
}

const DiningflatliistDesign=(img,ti,rs,des,press,allpress,border,plush,qty,minus,boxcolor)=>{
  return(
    <TouchableOpacity style={{width:'95%',height:120,marginHorizontal:5,marginVertical:5, padding:10,backgroundColor:'#fff',
    borderColor:border ? 'green' :'#dee4ec',
    borderWidth:1,
    elevation: 5,borderRadius:10,alignSelf:'center',flexDirection:'row',alignItems:'center'}}
    onPress={allpress}>
<View style={{width:60,height:75,alignSelf:'center',borderRadius:5,borderWidth:3,borderColor:'#dee4ec'}}>
<Image source={{uri:img}}  style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:5,resizeMode: 'stretch'}} ></Image>
</View>
<View style={{marginLeft:10}}>
<Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:9}} >{ti}</Text>
<Text style={{color:Mycolors.RED,fontWeight:'600',fontSize:12,marginTop:9}} >{rs}</Text>
<View style={{flexDirection:'row'}}>
<Text style={{color:Mycolors.GrayColor,fontWeight:'600',fontSize:12,marginTop:9}} >Food Preparation Time:</Text>
<Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:9}} >{des}</Text>
</View>



{!border ?
<View style={{width:70}}>
<MyButtons title="ADD" height={30} width={'100%'} borderRadius={5} alignSelf="center" press={press} marginHorizontal={20} fontSize={11}
titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} />
</View>
: 
<View style={{width:100,height:30,flexDirection:'row',alignItems:'center',marginTop:5,}}>
<TouchableOpacity style={{width:30,height:30,borderRadius:20,backgroundColor:'#FFE2E6',justifyContent:'center'}}
onPress={minus}>
<Text style={{textAlign:'center',fontSize:25,color:'red',top:-1}}>-</Text>
</TouchableOpacity>
<Text style={{marginHorizontal:10,color:Mycolors.Black}}>{qty}</Text>
<TouchableOpacity style={{width:30,height:30,borderRadius:20,backgroundColor:'red',justifyContent:'center'}}
onPress={plush}>
<Text style={{textAlign:'center',fontSize:25,color:'#fff',top:-1}}>+</Text>
</TouchableOpacity>
   </View>
}
</View>
  <View style={{position:'absolute',width:20,height:20,top:10,right:10,borderRadius:3,backgroundColor:boxcolor,justifyContent:'center'}}>
  <View style={{width:10,height:10,borderRadius:10,alignSelf:'center',backgroundColor:'#fff'}} />
  </View>
</TouchableOpacity>
  )
}
const resetStacks=(page)=>{
  props.navigation.reset({
    index: 0,
    routes: [{name: page}],
  });
 }
  return(
    <SafeAreaView style={{backgroundColor:Mycolors.BG_COLOR}}>
 <View style={{}}>
<HomeHeader height={60}  paddingHorizontal={15}
   press1={()=>{props.navigation.goBack()}} img1={require('../../../assets/arrow.png')} 
   img1width={30} img1height={30} img1backgroundColor={'#fff'} img1padding={5} img1borderRadius={4}
   press2={()=>{}} title2={resData.name} fontWeight={'bold'} img2height={20} color={Mycolors.TEXT_COLOR}
   press3={()=>{props.navigation.navigate('ShopCart')}} img3width={45} img3height={45} img3={require('../../../assets/Cart.png')} 
   img3backgroundColor={'transparent'} img3padding={8} img3borderRadius={4}/>
  {cartCount!='0' ?
  <View style={{position:'absolute',right:8,top:4,width:20,height:20,borderRadius:20,backgroundColor:'red',justifyContent:'center',zIndex:999}}>
   <Text style={{fontSize:11,textAlign:'center',color:'#fff'}}>{cartCount}</Text>
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

   <View style={{backgroundColor:'#fff',height:dimensions.SCREEN_HEIGHT*33/100,width:'100%'}}>
 

   
    <View style={{overflow:'hidden',top:0,width:'100%',alignSelf:'center',position:'absolute',zIndex:-999}}>
     <ImageSlider 
    //  localImg={true}
    data={allImg}
   // onClick={(item, index) => {alert('hello'+index)}}
    autoPlay={true}
    indicatorContainerStyle={{top:10}}
    caroselImageStyle={{resizeMode:'cover'}} 
   // onItemChanged={(item) => console.log("item", item)}
    closeIconColor="#fff"
/>
   </View>  
   </View>
<View style={{width:'96%',alignSelf:'center',backgroundColor:Mycolors.BG_COLOR}}>

<View style={{width:'100%',flexDirection:'row',justifyContent:'space-between',alignItems:'center',alignSelf:'center',backgroundColor:'#fff',borderRadius:9,paddingHorizontal:15,paddingVertical:10, top:-30}}>
  <View>
<Text style={{color:Mycolors.Black,fontSize:16,fontWeight:'600'}}>{resData.name}</Text>
<Text style={{color:Mycolors.GrayColor,fontSize:13,fontWeight:'500',marginVertical:4}}>Restaurant</Text>
                          <View style={{flexDirection:'row',marginTop:5}}>
                          <Image source={require('../../../assets/Star.png')} style={{width:18,height:18}}></Image>
                          <Text style={{color:Mycolors.Black,fontSize:14,fontWeight:'600',left:5}}>4.5</Text>
                          </View>
  </View>

  <View>
      <TouchableOpacity style={{width:25,height:25,borderRadius:5,backgroundColor:'#fff',
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 1,
      shadowOpacity: 0.3,
      justifyContent: 'center',
      elevation: 5,}}>
      <Image source={require('../../../assets/layer_9.png')} style={{width:10,height:15,alignSelf:'center'}}></Image>
      </TouchableOpacity>
  </View>

</View>


{/* 
<View style={{flexDirection:'row',justifyContent:'space-between',top:-40}}>
<View style={{width:'32%'}}>
<MyButtons title="Take Away" height={37} width={'100%'} borderRadius={5} alignSelf="center" press={()=>{setselectedTab('Take Away')}} marginHorizontal={20} fontSize={10}
  titlecolor={selectedTab=='Take Away' ? Mycolors.BG_COLOR : Mycolors.Black} marginVertical={0} hLinearColor={selectedTab=='Take Away' ?['#fd001f','#b10027']:['transparent','transparent']} backgroundColor={'transparent'}/>
</View>

<View style={{width:'32%'}}>
<MyButtons title="Dining" height={37} width={'100%'} borderRadius={5} alignSelf="center" press={()=>{setselectedTab('Dining')}} marginHorizontal={20} fontSize={12}
  titlecolor={selectedTab=='Dining' ? Mycolors.BG_COLOR : Mycolors.Black} marginVertical={0} hLinearColor={selectedTab=='Dining' ?['#fd001f','#b10027']:['transparent','transparent']} backgroundColor={'transparent'}/>
</View>

<View style={{width:'32%'}}>
<MyButtons title="Book A Table" height={37} width={'100%'} borderRadius={5} alignSelf="center" press={()=>{setselectedTab('Book A Table')}} marginHorizontal={20} fontSize={12}
  titlecolor={selectedTab=='Book A Table' ? Mycolors.BG_COLOR : Mycolors.Black} marginVertical={0} hLinearColor={selectedTab=='Book A Table' ?['#fd001f','#b10027']:['transparent','transparent']} backgroundColor={'transparent'}/>
</View>
</View> 
*/}


<View style={{width:'100%',alignSelf:'center',top:-40}}>
          <FlatList
                  data={resData.services}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  // numColumns={2}
                  renderItem={({item,index})=>{
                    return(
                      <>
                      {item.attribute_value=='yes' ?
                      <View style={{width:dimensions.SCREEN_WIDTH*32/100,marginHorizontal:10}}>
                      <MyButtons title={item.attribute_label} height={37} width={'100%'} borderRadius={5} alignSelf="center"
                       press={()=>{setselectedTab(item.attribute_label)}} marginHorizontal={20} fontSize={12}
                        titlecolor={selectedTab==item.attribute_label ? Mycolors.BG_COLOR : Mycolors.Black} marginVertical={0} hLinearColor={selectedTab==item.attribute_label ?['#fd001f','#b10027']:['transparent','transparent']} backgroundColor={'transparent'}/>
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
         </View>

 
{selectedTab=='Take Away' || selectedTab=='Delivery' ? 
<View>
<View style={{width:'95%',alignSelf:'center',top:-10}}>
<ViewMoreText
          numberOfLines={3}
          renderViewMore={(onPress)=>{
            return(
              <Text onPress={onPress} style={{color:'red',textDecorationLine: "underline",fontSize:12}}>View more</Text>
            )
          }}
          renderViewLess={(onPress)=>{
            return(
              <Text onPress={onPress} style={{color:'red',textDecorationLine: "underline",fontSize:12}}>View less</Text>
            )
           }}
          textStyle={{textAlign: 'left',width:'95%'}}
        >
          <Text style={{fontSize:11,color:Mycolors.TEXT_COLOR}}>{resData.business_info}</Text>
</ViewMoreText>
</View>
       
<View style={{width:'100%',alignSelf:'center',marginTop:10}}>
        {resData.features?
         resData.features.map((item,index)=> {
        return(
          <View style={{alignSelf:'center',width:'95%'}}>
          {design(item.attribute_image,item.attribute_value,item.attribute_detail,'45%',25,28,'transparent',40)}
          </View>
              )
            })
       : null }
   </View>

{/*  
<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:dimensions.SCREEN_WIDTH*95/100,alignSelf:'center'}}>
  {design(require('../../../assets/shape_39.png'),'Food Preparation Time','34 minutes','45%',25,28,'red',20)}
  {design(require('../../../assets/shape_40.png'),'Hygiene Food','','45%',25,28,'red',20)}
</View>
{design(require('../../../assets/shape_41.png'),'Location','Disneys Hollvwood Studios Main Entrance.Kissimmee. FL 34747. United States','95%',25,28,5)}
<View>
  {design(require('../../../assets/shape_42.png'),'Timing','Open at 10:00 AM','95%',28,28,5)}
<TouchableOpacity style={{width:100,height:30,borderColor:'red',borderWidth:0.5,position:'absolute',right:5,top:15,justifyContent:'center',borderRadius:5}}>
<Text style={{fontSize:11,textAlign:'center',color:"red",fontWeight:'bold'}}>Call Restaurant</Text>
</TouchableOpacity>
</View>
{design(require('../../../assets/shape_43.png'),'Cost','Cost for two - $24.78(approx)','95%',35,24,5)}
*/}
 
</View>
:
selectedTab=='Dining' ? 
<View>
<View style={{width:'100%',alignSelf:'center',marginTop:10}}>
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
         </View>

</View>
:
null
}
{ selectedTab!='Book A Table' ? 
<> 

<View style={{width:'95%',flexDirection:'row',justifyContent:'space-between',alignSelf:'center',marginTop:15,alignItems:'center'}}>
<Text style={{color:Mycolors.Black,fontWeight:'bold'}}>Menu</Text>
<View style={{height:40,flexDirection:'row'}}>
 <TouchableOpacity style={{width:40,height:40,backgroundColor:'transparent',justifyContent:'center'}}
 onPress={()=>{setmodlevisual1(true)}}>
    <Image source={require('../../../assets/searchblue.png')} style={{width:25,height:25,overflow:'hidden',alignSelf:'center'}}></Image>
   </TouchableOpacity>
<View style={{}}>
<Toggle
  value={toggleValue}
  onPress={(newState) => {
    setToggleValue(newState)
    console.log(newState);
  }}
  //  leftTitle="Veg"
  // rightTitle="Non-Veg"
  trackBarStyle={{
    borderColor: "red",
    width:65,height:25,
    backgroundColor:toggleValue?'red':'green'
  }}
  
  trackBar={{
    // activeBackgroundColor: "#9ee3fb",
    // inActiveBackgroundColor: "#3c4145",
    // borderActiveColor: "#86c3d7",
    // borderInActiveColor: "#1c1c1c",
    //borderWidth: 5,
    backgroundColor:'#fff',
    width: 62,
  }}

  thumbButton={{
    width: 24,
    height: 24,
    radius: 24,
    backgroundColor:'#fff',

  }}
  thumbStyle={{
    left:2,
    right:2,
    backgroundColor:'#fff',
  }}
  containerStyle={{width:70,height:40}}

/>
<View style={{position:'absolute',top:14,right:toggleValue ? 'auto' :8,left:toggleValue ? 5 :'auto'}}>
  <Text style={{color:'#fff',fontSize:toggleValue ? 8 : 12,top:toggleValue ? 0:-2 }}>{toggleValue ? 'Non-Veg' : 'Veg'}</Text>
</View>
</View>

</View>


</View>

<View style={{width:'100%',alignSelf:'center',marginTop:10}}>
    {selectedTab!='Dining' ? 
      selectedTab=='Take Away' ? 
      menuresData.map((item,index)=> {
        return(
          <View>
            {item.menuType=="Veg" && item.serviceType=='Take Away' && toggleValue==false ?
          flatliistDesign(item.image,item.name,'$'+parseFloat(Number(item.price).toFixed(2)),' 34 minutes',()=>{ postcart(item)},
          ()=>{
            setClickedItemData(item)
            setmodlevisual1(false)
            setmodlevisual2(true)
                            }  ,
               item ,()=>{putcart(item,'-')},()=>{putcart(item,'+')},'green'           
                         )       
            :
            item.menuType!="Veg" && item.serviceType=='Take Away' && toggleValue==true ?
            flatliistDesign(item.image,item.name,'$'+parseFloat(Number(item.price).toFixed(2)),' 34 minutes',()=>{postcart(item)},()=>{
              setClickedItemData(item)
              setmodlevisual1(false)
              setmodlevisual2(true)
            },
           item ,()=>{putcart(item,'-')},()=>{putcart(item,'+')},'red'   
            )
            : null
            }
           </View>
        )
      }
      )
       : 
       menuresData.map((item,index)=> {
        return(
          <View>
            {item.menuType=="Veg" && item.serviceType=='Delivery' && toggleValue==false ?
          flatliistDesign(item.image,item.name,'$'+parseFloat(Number(item.price).toFixed(2)),' 34 minutes',()=>{ postcart(item)},
          ()=>{
            setClickedItemData(item)
            setmodlevisual1(false)
            setmodlevisual2(true)
                            }  ,
               item ,()=>{putcart(item,'-')},()=>{putcart(item,'+')},'green'           
                         )       
            :
            item.menuType!="Veg" && item.serviceType=='Delivery' && toggleValue==true ?
            flatliistDesign(item.image,item.name,'$'+parseFloat(Number(item.price).toFixed(2)),' 34 minutes',()=>{postcart(item)},()=>{
              setClickedItemData(item)
              setmodlevisual1(false)
              setmodlevisual2(true)
            },
           item ,()=>{putcart(item,'-')},()=>{putcart(item,'+')},'red'   
            )
            : null
            }
           </View>
        )
      }
      )
      :
      menuresData.map((item,index)=> {
        return(
          <View>
          
            {item.menuType=="Veg" && item.serviceType=='Dinning' && toggleValue==false ?
          DiningflatliistDesign(item.image,item.name,'$'+parseFloat(Number(item.price).toFixed(2)),' 34 minutes',
          ()=>{
          // let arr=diningItens
          let arr1=diningItens1
          if(itemloop(item)){

          }else{
          // arr.push(item)
          arr1.push({
            "cart_id": item.cart_id, 
            "cart_quantity": 1, 
            "category":item.category, 
            "default_image": item.default_image,
             "id": item.id, 
             "image": item.image,
              "in_cart": item.in_cart, 
              "menuType": item.menuType, 
              "name": item.name,
               "price": item.price, 
               "product_desc":item.product_desc,
                "serviceType": item.serviceType,
                 "status": item.status,
                  "subcategory": item.subcategory
                })
          }
         
          //setdiningItens(arr)
          setdiningItens1(arr1)
          setreloades(!reloades)
          },()=>{
             setClickedItemData(item)
            // setmodlevisual1(false)
            // setmodlevisual2(true)
                            }  ,
                            itemloop(item),
                            ()=>{plushqty(item)} ,
                            itemqty(item),
                ()=>{minus(item)},'green'           
                         )       
            :
            item.menuType!="Veg" && item.serviceType=='Dinning' && toggleValue==true ?
            DiningflatliistDesign(item.image,item.name,'$'+parseFloat(Number(item.price).toFixed(2)),' 34 minutes',
            ()=>{ 
              let arr1=diningItens1
              if(itemloop(item)){
    
              }else{
                arr1.push({
                  "cart_id": item.cart_id, 
                  "cart_quantity": 1, 
                  "category":item.category, 
                  "default_image": item.default_image,
                   "id": item.id, 
                   "image": item.image,
                    "in_cart": item.in_cart, 
                    "menuType": item.menuType, 
                    "name": item.name,
                     "price": item.price, 
                     "product_desc":item.product_desc,
                      "serviceType": item.serviceType,
                       "status": item.status,
                        "subcategory": item.subcategory
                      })
              }
             
              setdiningItens1(arr1)
              setreloades(!reloades)
            },()=>{
              setClickedItemData(item)
              // setmodlevisual1(false)
              // setmodlevisual2(true)
            },  
            itemloop(item),
            ()=>{plushqty(item)} ,
            itemqty(item),
            ()=>{minus(item)} ,'red'    
            )
            : null
            }
           </View>
        )
      }
      )
    }
      
         </View>
 </>
 : null
}
 </View>

 { selectedTab=='Book A Table' ? 
<> 
<ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true} style={{paddingHorizontal:15,top:-40}}>
        
        <Text style={{fontWeight:'bold',color:Mycolors.Black,marginVertical:10}}>Book A Table</Text>
        

        <View style={{width:'95%',marginHorizontal:5,marginVertical:10, padding:10,backgroundColor:Mycolors.TimingColor,
              borderColor:Mycolors.RED,borderWidth:0.2,borderRadius:7,alignSelf:'center',}}
            >
        <Text style={{fontSize:12,fontWeight:'500',color:Mycolors.Black}}>Enter number of person</Text>
        <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center'}}>
<View style={{marginTop:10}}>
<Text style={{fontSize:11,fontWeight:'500',color:Mycolors.Black}}>Person</Text>
<Text style={{fontSize:10,fontWeight:'500',color:Mycolors.RED,marginTop:4}}>{counter}</Text>
</View>
<View style={{width:65,right:5,borderWidth:0.2,borderColor:Mycolors.RED,borderRadius:2}}>
<HomeHeader height={21}  paddingHorizontal={7}
   press1={()=>{counter<=0 ? setcounter(1) : setcounter(counter-1) }} img1={require('../../../assets/remove.png')} img1width={10} img1height={3} 
   press2={()=>{}} title2={counter} fontWeight={'500'} img2height={20} fontSize={12}
   press3={()=>{setcounter(counter+1)}} img3={require('../../../assets/add.png')} img3width={10} img3height={10} />
</View>
        </View>

          </View>

          <TouchableOpacity style={{width:'95%',height:50,marginHorizontal:5,marginVertical:10, padding:10,backgroundColor:Mycolors.TimingColor,
              borderColor:'#dee4ec',borderRadius:7,alignSelf:'center',flexDirection:'row',alignItems:'center'}}
            >
          <View style={{width:25,height:25,alignSelf:'center',top:-2}}>
          <Image source={require('../../../assets/shape_42.png')}  style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:5,resizeMode: 'stretch'}} ></Image>
          </View>
          <View style={{marginLeft:10}}>
          <Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:11,}} >Timings</Text>
          <Text style={{color:Mycolors.GrayColor,fontWeight:'400',fontSize:10,marginTop:4}} >{timimgs}</Text>
          </View>
          </TouchableOpacity>

          <View style={{width:'95%',flexDirection:'row',justifyContent:'space-between',alignSelf:'center',marginVertical:10}}>
          <Text style={{color:Mycolors.Black,fontWeight:'500',fontSize:13}}>For Today</Text>
          </View> 

          <View style={{width:'97%',alignSelf:'center'}}>
          <FlatList
                  data={futureTimes}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item,index})=>{
                    return(
                      <View style={{width:90,marginHorizontal:5}}>
          <TouchableOpacity style={{width:90,height:40,justifyContent:'center',borderWidth:0.5,borderRadius:5,borderColor:selectedTime==item ? Mycolors.RED: Mycolors.GrayColor}}
          onPress={()=>{
            setselectedTime(item)
            setselectedTime2('')
            }}>
          <Text style={{fontSize:11,color:selectedTime==item ? Mycolors.RED: Mycolors.GrayColor,textAlign:'center',fontWeight:'bold'}}>{item}</Text>
          </TouchableOpacity>
          </View>
                    )
                  }}
                  keyExtractor={item => item}
                />
         </View>

         <View style={{width:'95%',flexDirection:'row',justifyContent:'space-between',alignSelf:'center',marginVertical:10}}>
          <Text style={{color:Mycolors.Black,fontWeight:'500',fontSize:13}}>For Later</Text>
          </View> 

          <View style={{width:'95%',height:50,marginHorizontal:5,marginVertical:10, padding:10,backgroundColor:'#fff',
              borderColor:'#dee4ec',borderRadius:7,alignSelf:'center',flexDirection:'row',alignItems:'center',shadowColor: '#000',
              shadowOffset: {
                width: 0,
                height: 3
              },
              shadowRadius: 1,
              shadowOpacity: 0.1,
              justifyContent: 'center',
              elevation: 3,}}
            >

       <DatePicker
          customStyles={{
            dateInput: {borderColor:'transparent',left:-90},
            dateText: {color:Mycolors.Black},
            dateIcon: styles.dateIcon,
            dateplaceholder: {
              alignContent: 'flex-start',
             
            },
            placeholderText: {
              fontSize: 15,
              color: Mycolors.GrayColor,
              marginLeft: '5%',
              // left:100
            },
            zIndex:99999
          }}
         
          androidMode={'spinner'}
          readOnly={true}
          style={[styles.datePickerSelectInput]}
          date={date}
          mode="date"
          placeholder={'Select date'}
          minDate={new Date ()}
          format='YYYY-MM-DD'
          confirmBtnText="Confirm"
          cancelBtnText="Cancel"
          iconSource={require ('../../../assets/shape_38.png')}
          onDateChange={date => {
            setDate(date)
          }}
        />

          </View>

          <View style={{width:'97%',alignSelf:'center',marginTop:10}}>
          <FlatList
                  data={futureTimes}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  renderItem={({item,index})=>{
                    return(
                      <View style={{width:90,marginHorizontal:5}}>
          <TouchableOpacity style={{width:90,height:40,justifyContent:'center',borderWidth:0.5,borderRadius:5,borderColor:selectedTime2==item ? Mycolors.RED: Mycolors.GrayColor}}
          onPress={()=>{
            setselectedTime2(item)
            setselectedTime('')
            }}>
          <Text style={{fontSize:11,color:selectedTime2==item ? Mycolors.RED: Mycolors.GrayColor,textAlign:'center',fontWeight:'bold'}}>{item}</Text>
          </TouchableOpacity>
          </View>
                    )
                  }}
                  keyExtractor={item => item}
                />
         </View>

           <View style={{width:'95%',height:100,borderRadius:2,marginTop:25,alignSelf:'center'}}>
          <TextInput
                value={cookingIns}
                onChangeText={(e) => setcookingIns(e)}
                placeholder={'Add Cooking Instructions'}
                placeholderTextColor="#bbbbbb"
                multiline={true}
              // maxLength={500}
              // keyboardType="number-pad"
                autoCapitalize = 'none'
                style={[styles.input]}
              />

          </View>       
          <View style={{width:'95%',alignSelf:'center'}}>
          <MyButtons title="Confirm & Book a Table" height={40} width={'100%'} borderRadius={5} alignSelf="center" press={()=>{
            bookTables()
            //  setmodlevisual3(false)
            //  setmodlevisual4(true)
            //  setmodlevisual1(false)
            //  setmodlevisual2(false)

          }} marginHorizontal={20} fontSize={11}
          titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027','#fd001f']}/>
          </View>
            </ScrollView>
           
 </>
 : null
}



<View style={{height:200}} />

</ScrollView>
{selectedTab=='Dining' ? 
<View style={{width:'92%',alignSelf:'center',position:'absolute',bottom:80}}>
<MyButtons title="Confirm Order" height={45} width={'100%'} borderRadius={5} alignSelf="center"
 press={()=>{
  setmodlevisual4(false)
  setmodlevisual3(true)
  setmodlevisual1(false)
  setmodlevisual2(false)
}} marginHorizontal={20} fontSize={12}
  titlecolor={Mycolors.BG_COLOR} marginVertical={0} hLinearColor={['#fd001f','#b10027']} backgroundColor={'transparent'}/>
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
          scrollTo={() => {}}
          scrollOffset={1}
          onBackdropPress={() =>  setmodlevisual1(false)}
          propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '70%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
            <View style={{paddingHorizontal:4}}>
               <SearchInput2 marginTop={10} placeholder={'Restaurant Name. Cuisine, Dishes'} 
          serchValue={searchValue} 
          onChangeText={(e)=>{
            setsearchValue(e)
            searchmenuList()
          }} 
          press={()=>{Alert.alert('Hi')}}
          presssearch={()=>{searchmenuList()}}
          paddingLeft={50}/>
            </View>
        
         <Text style={{fontWeight:'bold',fontSize:16,marginTop:15,left:5,color:'#cbcbcb'}}>7 Result Found</Text>
        
          <View style={{width:'100%',alignSelf:'center',marginTop:10}}>
         

{
      menuresData.map((item,index)=> {
        return(
          <View>
            {
               flatliistDesign(item.image,item.name,'$'+parseFloat(Number(item.price).toFixed(2)),' 34 minutes',()=>{selectedTab=='Dining' ? '' : postcart(item)},()=>{
                setClickedItemData(item)
                setmodlevisual1(false)
                setmodlevisual2(true)
                                }  ,item,()=>{putcart(item,'-')},()=>{putcart(item,'+')},'#fff'
                             )  
            }
           </View>
        )
      }
      )
    }
         
         </View>

            <View style={{width:100,height:100}} />
            </ScrollView>
           
            </View>
</Modal>

{/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model2 Product Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
<Modal
        isVisible={modlevisual2}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual2(false)
         }}
          scrollTo={() => {}}
          scrollOffset={1}
          propagateSwipe={true}
        onBackdropPress={() =>  setmodlevisual2(false)}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '50%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        
          <TouchableOpacity style={{width:'95%',height:90,marginHorizontal:5,marginVertical:5, padding:10,backgroundColor:'#fff',
    borderColor:'#dee4ec',
    borderWidth:1,
    elevation: 5,borderRadius:10,alignSelf:'center',flexDirection:'row',alignItems:'center'}}
   >
<View style={{width:60,height:75,alignSelf:'center',borderRadius:5,borderWidth:3,borderColor:'#dee4ec'}}>
<Image source={{uri:ClickedItemData.image}}  style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:5,resizeMode: 'stretch'}} ></Image>
</View>
<View style={{marginLeft:10}}>
<Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:9}} >{ClickedItemData.name}</Text>
<View style={{flexDirection:'row'}}>
<Text style={{color:Mycolors.GrayColor,fontWeight:'600',fontSize:12,marginTop:9}} >Food Preparation Time:</Text>
<Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:9}} > 34 minutes</Text>
</View>
</View>
<View style={{position:'absolute',width:20,height:20,top:10,right:10,borderRadius:3,backgroundColor:'red',justifyContent:'center'}}>
  <View style={{width:10,height:10,borderRadius:10,alignSelf:'center',backgroundColor:'#fff'}} />
  </View>
 </TouchableOpacity>
        
          <View style={{width:'95%',height:100,borderRadius:2,marginTop:10,alignSelf:'center'}}>

          <TextInput
                value={cookingIns}
                onChangeText={(e) => setcookingIns(e)}
                placeholder={'Add Cooking Instruction'}
                placeholderTextColor="#bbbbbb"
                multiline={true}
              // maxLength={500}
              // keyboardType="number-pad"
                autoCapitalize = 'none'
                style={[styles.input]}
              />

          </View>

          <View style={{width:'95%',flexDirection:'row',justifyContent:'space-between',alignSelf:'center',marginVertical:15}}>
          <Text style={{color:Mycolors.Black,fontWeight:'500'}}>Total Payable Amount</Text>
          <Text style={{color:Mycolors.Black,fontWeight:'500'}}>${ClickedItemData.price}</Text>
          </View>        
          <View style={{width:'95%',alignSelf:'center'}}>
          <MyButtons title="Proceed to payment" height={40} width={'100%'} borderRadius={5} alignSelf="center" press={()=>{props.navigation.navigate('ShopPayment')}} marginHorizontal={20} fontSize={11}
          titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027','#fd001f']}/>
          </View>

            <View style={{width:100,height:100}} />
            </ScrollView>
           
            </View>
</Modal>

{/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model3 Book A Table sloat Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
<Modal
        isVisible={modlevisual3}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual3(false)
        }}
          scrollTo={() => {}}
          scrollOffset={1}
          onBackdropPress={() =>  setmodlevisual3(false)}
          propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '60%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        
        <Text style={{fontWeight:'bold',color:Mycolors.Black,marginVertical:10}}>Review Order</Text>
 
{diningItens1.map((item,index)=>{
  return(
//     <TouchableOpacity style={{width:'95%',height:120,marginHorizontal:5,marginVertical:5, padding:10,backgroundColor:'#fff',
//     borderColor:'#dee4ec',
//     borderWidth:1,
//     elevation: 5,borderRadius:10,alignSelf:'center',flexDirection:'row',alignItems:'center'}}
//     onPress={()=>{}}>
// <View style={{width:60,height:75,alignSelf:'center',borderRadius:5,borderWidth:3,borderColor:'#dee4ec'}}>
// <Image source={{uri:item.image}}  style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:5,resizeMode: 'stretch'}} ></Image>
// </View>
// <View style={{marginLeft:10}}>
// <Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:9}} >{item.name}</Text>
// <Text style={{color:Mycolors.RED,fontWeight:'600',fontSize:12,marginTop:9}} >{parseFloat(Number(item.price).toFixed(2))}</Text> 

// </View>
//   <View style={{position:'absolute',width:20,height:20,top:10,right:10,borderRadius:3,backgroundColor:'red',justifyContent:'center'}}>
//   <View style={{width:10,height:10,borderRadius:10,alignSelf:'center',backgroundColor:'#fff'}} />
//   </View>
// </TouchableOpacity>
<>
{
  DiningflatliistDesign(item.image,item.name,'$'+parseFloat(Number(item.price).toFixed(2)),' 34 minutes',
  ()=>{ 
    let arr1=diningItens1
    if(itemloop(item)){

    }else{
      arr1.push({
        "cart_id": item.cart_id, 
        "cart_quantity": 1, 
        "category":item.category, 
        "default_image": item.default_image,
         "id": item.id, 
         "image": item.image,
          "in_cart": item.in_cart, 
          "menuType": item.menuType, 
          "name": item.name,
           "price": item.price, 
           "product_desc":item.product_desc,
            "serviceType": item.serviceType,
             "status": item.status,
              "subcategory": item.subcategory
            })
    }
   
    setdiningItens1(arr1)
    setreloades(!reloades)
  },()=>{
    setClickedItemData(item)
    // setmodlevisual1(false)
    // setmodlevisual2(true)
  },  
  itemloop(item),
  ()=>{plushqty(item)} ,
  itemqty(item),
  ()=>{minus(item)} ,item.menuType=='Veg'?'green':'red'    
  )

}
</>

  )
})

}


           <View style={{width:'95%',height:100,borderRadius:2,marginTop:25,alignSelf:'center'}}>

          <TextInput
                value={cookingIns}
                onChangeText={(e) => setcookingIns(e)}
                placeholder={'Add Cooking Instruction'}
                placeholderTextColor="#bbbbbb"
                multiline={true}
              // maxLength={500}
              // keyboardType="number-pad"
                autoCapitalize = 'none'
                style={[styles.input]}
              />

          </View>       
          <View style={{width:'95%',alignSelf:'center'}}>
          <MyButtons title="Confirm & Place Order" height={40} width={'100%'} borderRadius={5} alignSelf="center" press={()=>{bookDiningSlote()}} marginHorizontal={20} fontSize={11}
          titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.RED} marginVertical={0} hLinearColor={['#b10027','#fd001f']}/>
          </View>

            <View style={{width:100,height:100}} />
           
            </ScrollView>
            
            </View>
 {loading ?  
  <Loader />
  :null}
</Modal>
{/* ##############&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&  Model4 Book A Sloat Clicked &&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&   */}
<Modal
        isVisible={modlevisual4}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual4(false)
        }}
          scrollTo={() => {}}
          onBackdropPress={() =>  setmodlevisual4(false)}
          scrollOffset={1}
          propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '48%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
        
        <Text style={{fontWeight:'bold',color:Mycolors.Black,marginVertical:10}}>Book A Slot</Text>
        
        <Text style={{color:Mycolors.RED,fontWeight:'400',fontSize:12,marginTop:20}}>#KIN876549</Text>
            <View>
             <View style={{flexDirection:'row',alignItems:'center',width:'100%'}}>
              <View style={{width:'50%'}}>
              <Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:15}}>Table Number</Text>
              <Text style={{color:Mycolors.GrayColor,fontSize:11,marginTop:4}}>14</Text>
              </View>
              <View style={{width:'50%'}}>
              <Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:15}}>Booking for</Text>
              <Text style={{color:Mycolors.GrayColor,fontSize:11,marginTop:4}}>3 person</Text>
              </View>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',width:'100%',marginTop:10}}>
              <View style={{width:'50%'}}>
              <Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,marginTop:15}}>Table Booking Time</Text>
              <Text style={{color:Mycolors.GrayColor,fontSize:11,marginTop:4}}>21 July 2021, 11:00 AM</Text>
              </View>
              <View style={{width:'50%'}}>
              <TouchableOpacity style={{width:120,height:40,borderColor:Mycolors.RED,borderWidth:0.5,borderRadius:4,justifyContent:'center',top:8}}>
              <Text style={{textAlign:'center',color:Mycolors.RED,fontSize:12,fontWeight:'600'}}>View Order</Text>
              </TouchableOpacity>
              </View>
              </View>

          </View>


<View style={{width:'100%',padding:10,borderRadius:15,borderColor:Mycolors.GrayColor,borderWidth:0.3,marginTop:20}}>
  <View style={{flexDirection:'row',alignItems:'center',width:'85%',marginTop:10}}>
   <View style={{width:40,height:40,backgroundColor:Mycolors.GREEN,justifyContent:'center',borderRadius:20}}>
    <Image source={require('../../../assets/shape_39.png')} style={{width:25,height:28,overflow:'hidden',alignSelf:'center'}}></Image>
   </View>
   <View style={{marginLeft:10,width:'85%'}}>
    <Text style={{fontSize:13,fontWeight:'bold',color:Mycolors.Black}}>Order Status</Text>
    <Text style={{fontSize:13,color:Mycolors.GREEN,marginTop:7,lineHeight:18}}>Accepted by restaurant vour table no 14 is booked</Text>
   </View>
   
  </View>
<View style={{flexDirection:'row',marginTop:10}}>
<Text style={{fontWeight:'600',color:Mycolors.Black,fontSize:12}}>Note:</Text>
<Text style={{fontWeight:'400',color:Mycolors.Black,fontSize:12}}> Show your booking number when asked</Text>
</View>
</View>

            <View style={{width:100,height:100}} />
            </ScrollView>
           
            </View>
</Modal>
  {loading ?  
  <Loader />
  :null}
    </SafeAreaView>
     );
  }
const styles = StyleSheet.create({
  input: {
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
    color:Mycolors.Black
  },
  dateIcon:{
    width:22,
    height:23,
    // marginRight:20
  },
  datePickerSelectInput:{
    height: 45,
    width:'100%',
    fontSize: 15,
    borderColor: null,
    backgroundColor: '#fff',
    borderRadius:10,
    color:'#fff',
  },
});
export default FoodDetails 