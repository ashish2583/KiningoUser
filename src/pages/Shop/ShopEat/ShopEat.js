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
import GetLocation from 'react-native-get-location'

const ShopEat = (props) => {
  const [searchValue,setsearchValue]=useState('')
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [upData,setupData]=useState([
    {
      id: '1',
      title: 'Hair Cut',
      desc:'',
      time:'',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '2',
      title: 'Shaving',
      desc:'',
      time:'',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '3',
      title: 'Facial',
      desc:'',
      time:'',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '4',
      title: 'Hair Color',
      desc:'',
      time:'',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '5',
      title: 'Hair wash',
      desc:'',
      time:'',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '6',
      title: 'Beard style',
      desc:'',
      time:'',
      img:require('../../../assets/images/images.png'),
    },
    {
      id: '7',
      title: 'Facial',
      desc:'',
      time:'',
      img:require('../../../assets/images/images.png'),
    },
  ])
  const [resData, setresData] = useState(null)
  const [venderdata, setvenderdata] = useState(null)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=>{
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
    homePage()
    // venderList()
 },[])

 const checkcon=()=>{
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



 const homePage = async () => {
   
    setLoading(true)
    
    const { responseJson, err } = await requestGetApi(shop_eat, '', 'GET', '')
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
  const { responseJson, err } = await requestGetApi(shop_eat+'?name='+searchValue.text+'&lat='+lat+'&long='+lan, '', 'GET', '')
  setLoading(false)
  console.log('the res==>>Home ?name=', responseJson)
  if (responseJson.headers.success == 1) {
    props.navigation.navigate('ShopSearch',{datas:responseJson.body.vendors})
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
   press2={()=>{}} title2={'Food'} fontWeight={'500'} img2height={20}
   press3={()=>{}} img3width={25} img3height={25} />
<View style={{width:'95%',alignSelf:'center',backgroundColor:'rgba(0,0,0,0.025)',borderRadius:10,borderBottomColor:'rgba(0,0,0,0.5)',borderBottomWidth:0.2}}>
  <HomeHeader height={40}  paddingHorizontal={15}
   press1={()=>{}} img1={require('../../../assets/shape_33.png')} img1width={11} img1height={15} 
   press2={()=>{}} title2={'New Yark USA'} fontWeight={'500'} img2height={20} right={dimensions.SCREEN_WIDTH*26/100} fontSize={10} color={Mycolors.GrayColor}
   press3={()=>{props.navigation.navigate('ShopEatFilter')}} img3={require('../../../assets/shape_32.png')} img3width={25} img3height={25} />
</View>

<View style={{width:'96%',alignSelf:'center'}}>
{/* <SearchInput2 marginTop={10} placeholder={'Restaurant Name. Cuisine, Dishes'} 
serchValue={searchValue} 
onChangeText={(e)=>{ props.navigation.navigate('ShopSearch',{datas:[],from:'search'})}} 
press={()=>{Alert.alert('Hi')}}
presssearch={()=>{homePageSearch()}}
paddingLeft={50}/> */}

<TouchableOpacity style={{width:'98%',height:50,borderRadius:10,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',alignSelf:'center',marginTop:10}}
onPress={()=>{props.navigation.navigate('ShopSearch',{datas:[],from:'search'})}}>
<View style={{padding:5,marginLeft:10}}>
  <Image source={require('../../../assets/shape_7.png')} style={{width:20,height:20}}></Image>
</View>
<View style={{padding:5}}>
  <Text style={{color:'gray',fontSize:12}}>Restaurant Name. Cuisine, Dishes</Text>
</View>
</TouchableOpacity>
 


<View style={{width:'100%',alignSelf:'center',marginTop:15}}>
        {resData!=null ?
          <FlatList
                  data={resData.coupons}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  // numColumns={2}
                  renderItem={({item,index})=>{
                    return(
                      <View style={{width:250,marginHorizontal:5}}>
          <TouchableOpacity style={{width:250,height:155,backgroundColor:Mycolors.LogininputBox,alignSelf:'center'}}
          onPress={()=>{props.navigation.navigate('ShopSearch',{datas:[],from:''})}}>
          <Image source={{uri:item.image}} style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:20,resizeMode: 'stretch'}}></Image>
          </TouchableOpacity>
          </View>
                    )
                  }}
                  keyExtractor={item => item.id}
                />
              : null  }
         </View>


  <View style={{width:'95%',flexDirection:'row',justifyContent:'space-between',alignSelf:'center',marginTop:20}}>
<Text style={{color:Mycolors.Black,fontWeight:'500'}}>Explore Nearby</Text>
<Text style={{color:Mycolors.RED,fontWeight:'500',textDecorationLine: "underline"}} 
 onPress={()=>{props.navigation.navigate('ShopSearch',{datas:[],from:'search'})}}>View More</Text>
</View>


<View style={{width:'100%',alignSelf:'center',marginTop:20}}>
{resData !=null ? 
          <FlatList
                  data={resData.vendors}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  // numColumns={2}
                  renderItem={({item,index})=>{
                    return(
                      <View style={{width:160,marginHorizontal:5}}>
          <TouchableOpacity style={{width:160,height:130,backgroundColor:Mycolors.LogininputBox,alignSelf:'center'}}
          onPress={()=>{
            props.navigation.navigate('FoodDetails',{data:item})
            dispatch(setVenderDetail(item))
            }}>
          <Image source={{uri:item.banner_image}} style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:7}}></Image>
          </TouchableOpacity>
          <View style={{}}>
          <Text style={{fontSize:11,color:Mycolors.Black,marginTop:5,textAlign:'left',fontWeight:'bold'}}>{item.name}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:5,top:-10}}>
          <Text style={{fontSize:9,color:Mycolors.RED,marginTop:5,textAlign:'left',}}></Text>
          <TouchableOpacity style={{width:25,height:25,borderRadius:5,backgroundColor:'#fff',shadowColor: '#000',
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
                    )
                  }}
                  keyExtractor={item => item.id}
                />

                : null}
         </View>


         <View style={{width:'95%',flexDirection:'row',justifyContent:'space-between',alignSelf:'center',marginTop:20}}>
<Text style={{color:Mycolors.Black,fontWeight:'500'}}>Eat what makes you happy</Text>
<Text style={{color:Mycolors.RED,fontWeight:'500',textDecorationLine: "underline"}} 
 onPress={()=>{props.navigation.navigate('CatSearch',{datas:resData.categories,from:''})}}>View More</Text>
</View>

<View style={{width:'100%',alignSelf:'center',marginTop:10}}>
{resData!=null ?
          <FlatList
                  data={resData.categories}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  // numColumns={2}
                  renderItem={({item,index})=>{
                    return(
                      <TouchableOpacity style={{width:130,height:150,marginHorizontal:5,marginVertical:5, padding:10,backgroundColor:'#fff',
                      shadowOffset: {
                      width: 0,
                      height: 3
                    },
                    shadowRadius: 1,
                    shadowOpacity: 0.3,
                   // justifyContent: 'center',
                    elevation: 5,borderRadius:10}} onPress={()=>{props.navigation.navigate('ShopSearch',{datas:[],from:'CatClick'})}}>
          <View style={{width:80,height:80,alignSelf:'center',marginTop:5}}>
          <Image source={{uri:item.category_image}} style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:10,overflow:'hidden'}}></Image>
          </View>
        <Text style={{color:Mycolors.Black,fontWeight:'600',fontSize:12,textAlign:'center',marginTop:9}} >{item.category_name}</Text>
          </TouchableOpacity>
                    )
                  }}
                  keyExtractor={item => item.id}
                />
:null}

         </View>

 </View>
<View style={{height:100}} />

</ScrollView>
<View style={{width:'95%',height:60,flexDirection:'row',justifyContent:'space-between',position:'absolute',bottom:5,alignSelf:'center'}}>
<View style={{width:'47%'}}>
<MyButtons title="Dining & Booked Table" height={45} width={'100%'} borderRadius={10} alignSelf="center" press={()=>{props.navigation.navigate('DiningAndBookTable')}} marginHorizontal={20} fontSize={11}
  titlecolor={Mycolors.BG_COLOR}  hLinearColor={['#fd001f','#b10027']}/>
</View>

<View style={{width:'47%'}}>
<MyButtons title="My Orders" height={45} width={'100%'} borderRadius={10} alignSelf="center" press={()=>{props.navigation.navigate('ShopMyOrder')}} marginHorizontal={20} fontSize={11}
  titlecolor={Mycolors.BG_COLOR}   hLinearColor={['#000000','#000000']}/>
    
</View>

</View>
{loading ? <Loader /> : null}
    </SafeAreaView>
     );
  }
const styles = StyleSheet.create({

});
export default ShopEat 