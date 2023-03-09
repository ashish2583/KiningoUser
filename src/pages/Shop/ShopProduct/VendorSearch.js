import React, { useEffect,useState ,useRef} from 'react';
import {RefreshControl,View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SearchInputEnt from '../../../component/SearchInputEnt';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider,ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast'
import Loader from '../../../WebApi/Loader';
import { baseUrl, login,shop_eat_business, requestPostApi,requestGetApi,shop_product_business } from '../../../WebApi/Service'
import GetLocation from 'react-native-get-location'
import MyAlert from '../../../component/MyAlert'

const ShopProduct = (props) => {
  const [searchValue,setsearchValue]=useState('')
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const myTextInput = useRef()
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
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [isLatlong, setIsLatlong] = useState(true)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [refreshing, setRefreshing] = useState(false);

  useEffect(()=>{
    console.log('hohohohoho',props.route.params.datas);
    setresData(props.route.params.datas)
    setFilteredData(props.route.params.datas)
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
  const endPoint = isLatlong ? `${shop_product_business}?lat=${lat}&long=${lan}` : `${shop_product_business}?name=Nile`
  console.log('endPoint', endPoint);
  setLoading(true)
  const { responseJson, err } = await requestGetApi(endPoint, '', 'GET', '')
  setLoading(false)
  console.log('the res==>>Home', responseJson)
  if (responseJson.headers.success == 1) {
    console.log('the res==>>Home.body.vendors', responseJson.body)
    setresData(responseJson.body)
    setFilteredData(responseJson.body.filter(el=>el.name?.toLowerCase()?.includes(String(searchTerm.text?.toLowerCase())?.trim())))
  } else {
     setalert_sms(err)
     setMy_Alert(true)
  }

}

const getDataBasedOfSearch = (searchTerm) => {
  // console.log('resData', resData);
  // console.log('searchTerm', searchTerm);
  setFilteredData(resData.filter(el=>el.name?.toLowerCase()?.includes(String(searchTerm.text?.toLowerCase())?.trim())))
}
  const handleNavigate = (latitude, longitude) => {

  }

  return(
    <SafeAreaView scrollEnabled={scrollEnabled} style={{height:'100%',backgroundColor:'#F8F8F8'}}>
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
   press2={()=>{}} title2={'Vendor Search'} fontWeight={'500'} img2height={20}
   press3={()=>{}} img3width={25} img3height={25} />

<View style={{width:'96%',alignSelf:'center'}}>
{/* <SearchInputEnt marginTop={10} placeholder={'Restaurant Name. Cuisine, Dishes'} 
serchValue={searchValue} 
searchIcon={require('../../../assets/images/product_search_icon.png')}
onChangeText={(e)=>{setsearchValue(e)}} 
press={()=>{Alert.alert('Hi')}}
presssearch={()=>{Alert.alert('Search Pressed')}}
paddingLeft={50}/> */}
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

  {/* <View style={{height:140,borderRadius:10,overflow:'hidden',marginVertical:10,width:'98%',alignSelf:'center'}}>
     <ImageSlider 
    //  localImg={true}
    data={[
        // require('../../assets/Group75972.png'),
        {img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ5a5uCP-n4teeW2SApcIqUrcQApev8ZVCJkA&usqp=CAU'},
        {img: 'https://thumbs.dreamstime.com/b/environment-earth-day-hands-trees-growing-seedlings-bokeh-green-background-female-hand-holding-tree-nature-field-gra-130247647.jpg'},
        {img: 'https://cdn.pixabay.com/photo/2015/04/19/08/32/marguerite-729510__340.jpg'}
    ]}
    onClick={(item, index) => {Alert.alert('hello'+index)}}
    autoPlay={true}
   // onItemChanged={(item) => console.log("item", item)}
    closeIconColor="transparent"
/>
   </View> */}

<View style={{width:'100%',alignSelf:'center',marginTop:20, backgroundColor:'#F8F8F8'}}>
          <FlatList
                  data={filteredData}
                  showsHorizontalScrollIndicator={false}
                  numColumns={2}
                  renderItem={({item,index})=>{
                    return(
                      <View style={{width:dimensions.SCREEN_WIDTH/2.2,marginHorizontal:5}}>
          <TouchableOpacity style={{width:dimensions.SCREEN_WIDTH/2.2,height:170,backgroundColor:'#F8F8F8',alignSelf:'center'}}
          // onPress={()=>{props.navigation.navigate('FoodDetails')}}>
          onPress={()=>{props.navigation.navigate('ShopProductAll', {vendorId: item.userid, vendorName: item.name})}}>
          <Image source={{uri:item.banner_image}} style={{width:'100%',height:'100%',alignSelf:'center',borderRadius:7}}></Image>
          </TouchableOpacity>
          <View style={{}}>
          <Text style={{fontSize:11,color:Mycolors.Black,marginTop:5,textAlign:'left',fontWeight:'bold'}}>{item.name}</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',padding:5,paddingLeft:0,top:-10}}>
          <Text style={{fontSize:9,color:'#FFC40C',marginTop:5,textAlign:'left',}}>Cafe</Text>
          <TouchableOpacity onPress={()=>handleNavigate(item.latitude, item.longitude)} style={{width:25,height:25,borderRadius:5,backgroundColor:'#fff',shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 3
      },
      shadowRadius: 1,
      shadowOpacity: 0.3,
      justifyContent: 'center',
      elevation: 5,}}>
          <Image source={require('../../../assets/images/layer_9.png')} style={{width:10,height:15,alignSelf:'center'}}></Image>
          </TouchableOpacity>
          </View>
          </View>
                    )
                  }}
                  keyExtractor={item => item.id}
                />
         </View>






 </View>
<View style={{height:100}} />

</ScrollView>
{loading ? <Loader /> : null}
{My_Alert ? <MyAlert sms={alert_sms} okPress={()=>{setMy_Alert(false)}} /> : null }
    </SafeAreaView>
     );
  }
const styles = StyleSheet.create({

});
export default ShopProduct 