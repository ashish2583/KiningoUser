import React, { useEffect,useState ,useRef} from 'react';
import {RefreshControl,View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground, StatusBar} from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SearchInputEnt from '../../../component/SearchInputEnt';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider,ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import { baseUrl, login,shop_product_business, requestPostApi,requestGetApi,shop_product, shop_product_productlist } from '../../../WebApi/Service'
import Loader from '../../../WebApi/Loader';
import Toast from 'react-native-toast-message'
import MyAlert from '../../../component/MyAlert';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserResult, saveUserToken,setVenderDetail, setUserType } from '../../../redux/actions/user_action';

const ShopSearch = (props) => {
  const [searchValue,setsearchValue]=useState('')
  // const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState([])
  const [filteredData, setFilteredData] = useState([])
  const [venderdata, setvenderdata] = useState(null)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=>{
   console.log('hohohohoho',props.route.params.datas);
   setresData(props.route.params.datas)
   setFilteredData(props.route.params.datas)
 },[])

 const checkcon=()=>{
  getProducts()
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
 
const getProducts = async () => {

  setLoading(true)

  // const { responseJson, err } = await requestGetApi(shop_product_productlist+'12', '', 'GET', '')
  const { responseJson, err } = await requestGetApi(shop_product_productlist+props.route.params.vendorId, '', 'GET', '')
  setLoading(false)
  // console.log('the res==>>Home', responseJson)
  if (responseJson.headers.success == 1) {
    // console.log('the res==>>Home.body.vendors', responseJson.body)
    setresData(responseJson.body)
    setFilteredData(responseJson.body.filter(el=>el.name?.toLowerCase()?.includes(String(searchTerm.text?.toLowerCase())?.trim())))
  } else {
    Toast.show({text1: err})
    // setalert_sms(err)
    // setMy_Alert(true)
  }

}

const getDataBasedOfSearch = (searchTerm) => {
  // console.log('resData', resData);
  // console.log('searchTerm', searchTerm);
  setFilteredData(resData.filter(el=>el.name?.toLowerCase()?.includes(String(searchTerm.text?.toLowerCase())?.trim())))
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
   press2={()=>{}} title2={'Search'} fontWeight={'500'} img2height={20}
   press3={()=>{}} img3width={25} img3height={25} />

<View style={{width:'96%',alignSelf:'center'}}>

<SearchInputEnt marginTop={10} 
// placeholder={'Restaurant Name. Cuisine, Dishes'} 
placeholder={'Search Products'} 
serchValue={searchValue} 
onChangeText={(e)=>{
  setsearchValue(e)
  getDataBasedOfSearch(e)
}} 
press={()=>{Alert.alert('Hi')}}
// presssearch={()=>{homePageSearch()}}
paddingLeft={50}/>
 
         <View style={{width:'100%',alignSelf:'center',marginTop:20}}>
         {
      filteredData.map((item,index)=> {
        return(
       
          <View style={{ width: '90%', marginHorizontal: 5, alignSelf:'center', marginVertical:10 }}>
          <TouchableOpacity style={{ width: '100%', height: 170, backgroundColor: '#fff', alignSelf: 'center', borderRadius: 15, overflow: 'hidden' }}
            onPress={() => { props.navigation.navigate('ShopProductDetails', {category: item.category, productName:item.name, vendorId:props.route.params.vendorId, vendorName:props.route.params.vendorName}) }}>
            <Image source={{ uri: `${item.image}` }} style={{ width: '100%', height: '100%', alignSelf: 'center' }}></Image>
          </TouchableOpacity>
          <View style={{}}>
            <Text style={{ fontSize: 11, color: Mycolors.Black, marginTop: 5, textAlign: 'left', fontWeight: 'bold' }}>{item.name}</Text>
          </View>
          <View style={{ padding: 5, paddingLeft: 0, top: -5 }}>
            <Text style={{ fontSize: 9, color: Mycolors.GrayColor, marginTop: 5, textAlign: 'left', }}>{parseFloat(Number(item.price).toFixed(2))}</Text>
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