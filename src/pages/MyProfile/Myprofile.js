import React, { useEffect,useState ,useRef} from 'react';
import {KeyboardAvoidingView,RefreshControl,View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import MyButtons from '../../component/MyButtons';
import { dimensions, Mycolors } from '../../utility/Mycolors';
import Modal from 'react-native-modal';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view'
// import messaging from '@react-native-firebase/messaging';
import {  useSelector, useDispatch } from 'react-redux';
import {requestPostApi,requestGetApi, profile} from '../../WebApi/Service'
import Loader from '../../WebApi/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import MyAlert from '../../component/MyAlert';
import Toast from 'react-native-simple-toast';
import HomeHeader from '../../component/HomeHeader';
import SerchInput from '../../component/SerchInput';
import moment from 'moment'

const Myprofile = (props) => {
  const userdetaile  = useSelector(state => state.user.user_details)
  const dispatch =  useDispatch();
  const person_Image = "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60"
  const [datas, setdatas] = useState([]);

  const [loading,setLoading]=useState(false)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
 const [flData,setFtData]=useState([
  {id:'1',img:person_Image,title:'GRECA Vegetarian Greek',lable:'Table Booking',price:'$140.00',desc:'Booking date and time: 21 July 2021, 11:00 AM'},
  {id:'2',img:person_Image,title:'GRECA Vegetarian Greek',lable:'Table Booking',price:'$140.00',desc:'Booking date and time: 21 July 2021, 11:00 AM'},
  {id:'3',img:person_Image,title:'GRECA Vegetarian Greek',lable:'Table Booking',price:'$140.00',desc:'Booking date and time: 21 July 2021, 11:00 AM'},
  {id:'4',img:person_Image,title:'GRECA Vegetarian Greek',lable:'Table Booking',price:'$140.00',desc:'Booking date and time: 21 July 2021, 11:00 AM'},
  {id:'5',img:person_Image,title:'GRECA Vegetarian Greek',lable:'Table Booking',price:'$140.00',desc:'Booking date and time: 21 July 2021, 11:00 AM'},
])
const [refreshing, setRefreshing] = useState(false);
const [resData, setresData] = useState(null)
const [showEditProfileModal, setEditProfileModal] = useState(false)
const [firstName, setFirstName] = useState('')
const [lastName, setLastName] = useState('')
const [emailId, setEmailId] = useState('')

useEffect(()=>{
  getProfileDetails()
},[])

const checkcon=()=>{
  getProfileDetails()
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

const getProfileDetails = async () => {
setLoading(true)
const { responseJson, err } = await requestGetApi(profile, '', 'GET', userdetaile.token)
setLoading(false)
console.log('the res==>>profile', responseJson)
if (responseJson.headers.success == 1) {
  console.log('the res==>>body.profile', responseJson.body)
  setresData(responseJson.body)
  setFirstName(responseJson.body?.first_name)
  setLastName(responseJson.body?.last_name)
  setEmailId(responseJson.body?.emailid)
} else {
   setalert_sms(err)
   setMy_Alert(true)
}

}
const editProfileDetails = async () => {
const data = {
  first_name: firstName,
  last_name: lastName,
  username: resData?.username,
  emailid: emailId,
  country_code: resData?.country_code,
  phone: resData?.phone
}
setLoading(true)
const { responseJson, err } = await requestPostApi(profile, data, 'PUT', userdetaile.token)
setLoading(false)
setEditProfileModal(false)
console.log('the res==>>edit profile', responseJson)
if (responseJson.headers.success == 1) {
  console.log('the res==>>body.edit profile', responseJson.body)
  setalert_sms(responseJson.headers.message)
  setMy_Alert(true)
} else {
   setalert_sms(err)
   setMy_Alert(true)
}

}


  const getProfile=async()=>{
   
    setLoading(true)
    const{responseJson,err}  = await requestGetApi(driver_profile,'','GET',userdetaile.token) 
    setLoading(false)
    if(err==null){
        if(responseJson.status){
          console.log('objj==>>',responseJson.data)
          setdatas(responseJson.data)
          // if(responseJson.data.card!=''){ datas.fuel_data.fuel_cost
          setfuleCost(responseJson.data.fuel_data.fuel_cost)
           setCard( responseJson.data.card[0])
           setvehicle(responseJson.data.vehicle[0]) 
          // Toast.show(responseJson.message);
          if(responseJson.data.profile_status){
            if(responseJson.data.profile_status!='active'){
              console.log('false status==>>',responseJson)
              LogoutDriver()
            }
          }
        }else{
         
         // Toast.show(responseJson.message);
        }
    }else{
      setalert_sms(err)
            setMy_Alert(true)
    }
  }
const PhoneEmailDesign=(img,title,data)=>{
  return(
    <View style={{width:'100%',flexDirection:'row',alignItems:'center',marginTop:10}}>
<View>
<Image source={img} style={{width:22,height:22,}}></Image>
</View>
<View style={{marginLeft:10}}>
<Text style={{fontSize:12,fontWeight:'600',color:Mycolors.TEXT_COLOR}}>{title}</Text>
<Text style={{fontSize:11,color:Mycolors.TEXT_COLOR,marginTop:5}}>{data}</Text>
</View>

    </View>
  )
}

const MyorderDesign=(item)=>{
  return(
    <View style={{
      marginVertical:10,marginHorizontal:5,borderRadius:5,
      backgroundColor:'#fff',
      shadowColor: 'rgba(0, 0, 0, 0.5)',
      shadowOffset: {
        width:0,
        height:3
      }, 
      shadowRadius: 5,
      shadowOpacity: 1.0,
      justifyContent: 'center',
      elevation: 5}}>
    <View style={{width:'100%',padding:10,flexDirection:'row',alignItems:'center',borderRadius:5,overflow:'hidden'}}>
<View>
<Image source={{ uri: item.img }} style={{width:45,height:45,borderRadius:25}}></Image>
</View>
<View style={{marginLeft:10}}>
<Text style={{fontSize:13,fontWeight:'500',color:Mycolors.TEXT_COLOR}}>{item.title}</Text>
<View style={{flexDirection:'row',alignItems:'center',marginTop:7}}>
<View style={{paddingVertical:3,paddingHorizontal:8, borderRadius:20,backgroundColor:'#D2F1CE',justifyContent:'center'}}>
<Text style={{textAlign:'center',fontSize:11,color:'#29913B'}}>{item.lable}</Text>
</View>
<Text style={{marginLeft:20,fontSize:13,fontWeight:'500'}}>{item.price}</Text>
</View>
<Text style={{fontSize:10,fontWeight:'500',color:'#29913B',marginTop:8}}>{item.desc}</Text>
</View>
    </View>
    </View>
  )
}

  return(
    <SafeAreaView style={styles.container}>
      <HomeHeader height={60}  paddingHorizontal={15}
   press1={()=>{props.navigation.openDrawer()}} img1={require('../../assets/List.png')} img1width={25} img1height={25} 
   press2={()=>{}} img2={require('../../assets/Kinengo_Green.png')} img2width={95} img2height={20}
   press3={()=>{}} img3={require('../../assets/Bell.png')} img3width={25} img3height={25} />
  <ScrollView
   refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={onRefresh}
    />
  }
   style={{paddingHorizontal:20}}
   >
     <View style={{width:'99%',padding:10,marginTop:10,borderRadius:10,
     backgroundColor:'#fff',
     shadowColor: 'rgba(0, 0, 0, 0.5)',
     shadowOffset: {
       width:0,
       height:3
     }, 
     shadowRadius: 5,
     shadowOpacity: 1.0,
     justifyContent: 'center',
     elevation: 5,alignSelf:'center'}}>

<View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',width:'95%',alignSelf:'center'}}>
<View style={{flexDirection:'row',alignItems:'center'}}>
<Image source={require('../../assets/images/profileimg.png')} style={{width:50,height:50,borderRadius:25}}></Image>
<View style={{marginLeft:10}}>
  <Text style={{color:Mycolors.TEXT_COLOR,fontSize:13,fontWeight:'600'}}>{firstName + ' ' + lastName}</Text>
  <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>
  <Text style={{color:Mycolors.TEXT_COLOR,fontSize:11}}>Registered Date : {moment(resData?.created_date).format('DD-MM-YYYY')}</Text>
  </View>
  {/* <View style={{flexDirection:'row',alignItems:'center',marginTop:5}}>
  <Image source={require('../../assets/Star.png')} style={{width:15,height:15,}}></Image>
  <Text style={{color:Mycolors.TEXT_COLOR,fontSize:11,left:7}}>4.5</Text>
  </View> */}
</View>
</View>

<MyButtons title="Edit" height={30} width={60} borderRadius={30} press={()=>{setEditProfileModal(true)}} 
 titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.GREEN} fontWeight={'500'} fontSize={13} marginVertical={10}/>
</View>
<View style={{marginLeft:65,marginTop:5}}>
{PhoneEmailDesign(require('../../assets/callgreen.png'),'Phone', resData?.country_code + resData?.phone)}
{PhoneEmailDesign(require('../../assets/emailgreen.png'),'Email',emailId)}
</View>
     </View>

<View style={{width:'100%',height:45,flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:10,marginTop:20}}>
<Text style={{fontSize:14,fontWeight:'600',color:Mycolors.TEXT_COLOR}}>My Orders</Text>
<Text style={{fontSize:12,color:Mycolors.TEXT_COLOR}} onPress={()=>{Alert.alert('hi')}}>View All</Text>
</View>
  
<ScrollView style={{}}>
                  {flData.map((item, index) => (
                    // <View style={{
                    // marginVertical:10,
                    // // borderWidth: 1,
                    //  backgroundColor: Platform.OS === 'ios' ? '#fff' : null,
                    //  borderColor: '#ddd',
                    // shadowColor: Platform.OS === 'ios' ? '#000' : '#fff',
                    // shadowOffset: {
                    //   width: Platform.OS === 'ios' ? 3 : 0,
                    //   height: Platform.OS === 'ios' ? 3 : 2,
                    // },
                    // shadowOpacity: Platform.OS === 'ios' ? 1 : 0.8,
                    // shadowRadius: Platform.OS === 'ios' ? null : 40,
                    // elevation: Platform.OS === 'ios' ? null : 4,
                    // justifyContent: 'center',
                    // alignItems: 'center',
                    // // width: 300,
                    // // height: 300,
                    // }}>
                    // {MyorderDesign(item)}
                    // </View>
                    MyorderDesign(item)
                  ))}
            </ScrollView> 

     </ScrollView>
    {My_Alert ? <MyAlert sms={alert_sms} okPress={()=>{setMy_Alert(false)}} /> : null }
     {loading ?  <Loader /> : null }
     <Modal
        isVisible={showEditProfileModal}
        swipeDirection="down"
        onBackdropPress={()=>setEditProfileModal(false)}
        onSwipeComplete={(e) => {
          setEditProfileModal(false)
        }}
          scrollTo={() => {}}
          scrollOffset={1}
          propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '60%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>
          
          <View style={{flexDirection:'row',justifyContent:'center', marginBottom:30, marginTop:10}}>
            <Text style={{flex:4,color:Mycolors.Black,fontWeight:'500', textAlign:'center'}}>Edit Profile</Text>
          </View>
        
          <KeyboardAvoidingView
              style={{ flex: 1 }}
              behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
          <View style={styles.firstLastView}>
            <View style={styles.viewStyle2}>
              <TextInput
                    value={firstName}
                    onChangeText={(e) => setFirstName(e)}
                    placeholder={'First Name'}
                    placeholderTextColor="#bbbbbb"
                    autoCapitalize = 'none'
                    style={styles.input2}
                  />
              </View>
            <View style={styles.viewStyle2}>
              <TextInput
                    value={lastName}
                    onChangeText={(e) => setLastName(e)}
                    placeholder={'Last Name'}
                    placeholderTextColor="#bbbbbb"
                    autoCapitalize = 'none'
                    style={[styles.input2, {right:5}]}
                  />
              </View>
            </View>
            <View style={styles.viewStyle}>
            <TextInput
                  value={emailId}
                  onChangeText={(e) => setEmailId(e)}
                  placeholder={'Email'}
                  placeholderTextColor="#bbbbbb"
                  autoCapitalize = 'none'
                  style={styles.input2}
                />
            </View>
            <View style={styles.viewStyle}>
            <TextInput
                  value={resData?.phone}
                  editable={false}
                  placeholderTextColor="#bbbbbb"
                  autoCapitalize = 'none'
                  style={styles.input2}
                />
            </View>

            <View style={{height:30}} />

            <MyButtons title="Submit" height={45} width={'50%'} borderRadius={10} alignSelf="center" press={editProfileDetails} marginHorizontal={20} fontSize={11}
              titlecolor={Mycolors.BG_COLOR} backgroundColor={Mycolors.GREEN}  />
            </KeyboardAvoidingView>
            </ScrollView>
           
            </View>
</Modal>
    </SafeAreaView>
     );
  }
const styles = StyleSheet.create({

  container: {
    flex: 1,  
    backgroundColor:Mycolors.BG_COLOR
  },
  input: {
    height: 45,
    width: '100%',
    fontSize: 15,
    borderColor: null,
    borderRadius: 10,
    color: Mycolors.TEXT_COLOR,
    paddingLeft: 40,
    paddingRight: 5,
  },
  input2: {
    paddingLeft: 15,
    height: 55,
    width:'97%',
    fontSize: 13,
    backgroundColor: Mycolors.BG_COLOR,
    borderRadius:5,
    borderWidth: 0.2,
    borderColor: '#8e8e8e',
    color:Mycolors.TEXT_COLOR,
    textAlignVertical: 'center',


    // top:6
  },
  viewStyle:{
    width:'100%',
    height:55,
    marginTop:10,
    // borderRadius: 28,
    // marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowRadius: 5,
    // shadowOpacity: 1.0,
    // // justifyContent: 'center',
    // elevation: 5,
    alignSelf:'center',
    
},
  viewStyle2:{
    width:'48%',
    height:55,
    marginTop:10,
    // borderRadius: 28,
    // marginTop: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    // shadowColor: '#000000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowRadius: 5,
    // shadowOpacity: 1.0,
    // // justifyContent: 'center',
    // elevation: 5,
    // alignSelf:'center',
    
},
  firstLastView:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent: 'space-between',
    // marginHorizontal:5
  }
});
export default Myprofile