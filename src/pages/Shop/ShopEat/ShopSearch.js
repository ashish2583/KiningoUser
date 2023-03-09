import React, { useEffect,useState ,useRef} from 'react';
import {RefreshControl,View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground, StatusBar} from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider,ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import { baseUrl, login,shop_eat_business, requestPostApi,requestGetApi,shop_eat } from '../../../WebApi/Service'
import Loader from '../../../WebApi/Loader';
import Toast from 'react-native-simple-toast'
import MyAlert from '../../../component/MyAlert';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserResult, saveUserToken,setVenderDetail, setUserType } from '../../../redux/actions/user_action';

const ShopSearch = (props) => {
  const [searchValue,setsearchValue]=useState('')
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState([])
  const [venderdata, setvenderdata] = useState(null)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=>{
   console.log('hohohohoho',props.route.params.datas);
   setresData(props.route.params.datas)
   if(props.route.params.from!='search'){
    AllVenders()
   }
 },[])

 const checkcon=()=>{
  AllVenders()
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
 

const homePageSearch = async () => {

  setLoading(true)
  const { responseJson, err } = await requestGetApi(shop_eat+'?name='+searchValue.text+'&lat='+lat+'&long='+lan, '', 'GET', '')
  setLoading(false)
  console.log('the res==>>Home', responseJson)
  if (responseJson.headers.success == 1) {
    setresData(responseJson.body.vendors)
  } else {
     setalert_sms(err)
     setMy_Alert(true)
  }

}

const AllVenders = async () => {

  setLoading(true)
  const { responseJson, err } = await requestGetApi(shop_eat_business, '', 'GET', '')
  setLoading(false)
  console.log('the res==>>Homethe res==>>Homethe res==>>Home', responseJson)
  if (responseJson.headers.success == 1) {
    setresData(responseJson.body)
  } else {
     setalert_sms(err)
     setMy_Alert(true)
  }

}

  return(
    <SafeAreaView style={{}}>
      <ScrollView
       refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}
        />
      }
      >
    <HomeHeader height={60}  paddingHorizontal={15}
   press1={()=>{props.navigation.goBack()}} img1={require('../../../assets/arrow.png')} img1width={18} img1height={15} 
   press2={()=>{}} title2={'Product Search'} fontWeight={'500'} img2height={20}
   press3={()=>{}} img3width={25} img3height={25} />

<View style={{width:'96%',alignSelf:'center'}}>
<SearchInput2 marginTop={10} placeholder={'Restaurant Name. Cuisine, Dishes'} 
serchValue={searchValue} 
onChangeText={(e)=>{
  setsearchValue(e)
  homePageSearch()
if(e.text.length==0){
  AllVenders()
}
}} 
press={()=>{Alert.alert('Hi')}}
presssearch={()=>{homePageSearch()}}
paddingLeft={50}/>
 
         <View style={{width:'100%',alignSelf:'center',marginTop:20}}>
         {
      resData.map((item,index)=> {
        return(
       
                      <View style={{width:'90%',marginHorizontal:5,alignSelf:'center',backgroundColor:'#fff',marginVertical:10,borderRadius:7,
                      shadowColor: '#000',
                      shadowOffset: {
                        width: 0,
                        height: 3
                      },
                      shadowRadius: 1,
                      shadowOpacity: 0.3,
                      justifyContent: 'center',
                      elevation: 5,paddingBottom:15
                      }}>
          <TouchableOpacity style={{width:'100%',height:180,backgroundColor:Mycolors.LogininputBox,alignSelf:'center'}}
          onPress={()=>{
            props.navigation.navigate('FoodDetails',{data:item})
            dispatch(setVenderDetail(item))
            }}>
          <Image source={{uri:item.banner_image}} style={{width:'100%',height:'100%',alignSelf:'center',borderTopLeftRadius:7,borderTopRightRadius:7, resizeMode:'stretch'}} resizeMode={'stretch'}></Image>
         
         <View style={{position:'absolute',bottom:-5,left:5,width:80,height:60}}>
         <Image source={require('../../../assets/images/coupon.png')} style={{width:'100%',height:'100%',alignSelf:'center', resizeMode:'stretch'}} resizeMode={'stretch'}></Image>
         </View>
          </TouchableOpacity>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:5}}>
       <View style={{}}>
          <Text style={{fontSize:11,color:Mycolors.Black,marginTop:5,textAlign:'left',fontWeight:'bold',left:7}}>{item.name}</Text>
          <Text style={{fontSize:11,color:Mycolors.Black,marginTop:5,textAlign:'left',fontWeight:'300',left:7}}>{item.address_line}</Text>
          <Text style={{fontSize:11,color:Mycolors.Black,marginTop:5,textAlign:'left',fontWeight:'200',left:7,fontStyle:'italic'}}>Food Preparation Time : 34 Minutes</Text>

          </View>
          <View style={{padding:5,alignItems:'flex-end'}}>
          <TouchableOpacity style={{width:50,height:28,borderRadius:5,backgroundColor:'red',
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 3
          },
          shadowRadius: 1,
          shadowOpacity: 0.3,
          justifyContent: 'center',
          elevation: 5,flexDirection:'row',alignItems:'center'}}>

          <Text style={{fontSize:14,textAlign:'left',fontWeight:'bold',marginHorizontal:4,color:'#fff',top:1}}>4.0</Text>
          <Image source={require('../../../assets/Star.png')} style={{width:13,height:13,alignSelf:'center',marginRight:4}}></Image>
          </TouchableOpacity>
         
          <Text style={{fontSize:11,color:Mycolors.ORANGE,marginTop:5,textAlign:'left',fontWeight:'500',}}>1000+ orders served.</Text>

          </View>

            </View>

          </View>
                    )
                  })
              
                }
              
         </View>



 </View>
<View style={{height:100}} />

</ScrollView>

{loading ? <Loader /> : null}
    </SafeAreaView>
     );
  }
const styles = StyleSheet.create({

});
export default ShopSearch 