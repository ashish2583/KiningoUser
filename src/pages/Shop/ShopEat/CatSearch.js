import React, { useEffect,useState ,useRef} from 'react';
import {View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground, StatusBar} from 'react-native';
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

const CatSearch = (props) => {
  const [searchValue,setsearchValue]=useState('')
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState([])
  const [venderdata, setvenderdata] = useState(null)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  useEffect(()=>{
   console.log('hohohohoho',props.route.params.datas);
   setresData(props.route.params.datas)
//    if(props.route.params.from!='search'){
//     AllVenders()
//    }
 },[])

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
    
    <HomeHeader height={60}  paddingHorizontal={15}
   press1={()=>{props.navigation.goBack()}} img1={require('../../../assets/arrow.png')} img1width={18} img1height={15} 
   press2={()=>{}} title2={'Search'} fontWeight={'500'} img2height={20}
   press3={()=>{}} img3width={25} img3height={25} />

<View style={{width:'96%',alignSelf:'center'}}>
<SearchInput2 marginTop={10} placeholder={'Restaurant Name. Cuisine, Dishes'} 
serchValue={searchValue} 
onChangeText={(e)=>{
  setsearchValue(e)
//   homePageSearch()
// if(e.text.length==0){
//   AllVenders()
// }
}} 
press={()=>{Alert.alert('Hi')}}
presssearch={()=>{homePageSearch()}}
paddingLeft={50}/>
 
        
<View style={{width:'100%',marginTop:10,alignSelf:'center'}}>
{resData!=null ?
          <FlatList
                  data={resData}
                  //horizontal={true}
                 // showsHorizontalScrollIndicator={false}
                   numColumns={2}
                  renderItem={({item,index})=>{
                    return(
                      <TouchableOpacity style={{width:'47%',height:160,marginHorizontal:5,marginVertical:5, padding:10,backgroundColor:'#fff',
                      shadowOffset: {
                      width: 0,
                      height: 3
                    },
                    shadowRadius: 1,
                    shadowOpacity: 0.3,
                    alignSelf:'center',
                   // justifyContent: 'center',
                    elevation: 5,borderRadius:10}} onPress={()=>{props.navigation.navigate('ShopSearch',{datas:[],from:'CatClick'})}}>
          <View style={{width:100,height:100,alignSelf:'center',marginTop:5}}>
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



{loading ? <Loader /> : null}
    </SafeAreaView>
     );
  }
const styles = StyleSheet.create({

});
export default CatSearch 