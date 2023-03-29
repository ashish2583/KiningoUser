import React, { useEffect,useState ,useRef} from 'react';
import {View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground, RefreshControl} from 'react-native';
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
import { requestGetApi, shop_product_category_names } from '../../../WebApi/Service';
import Loader from '../../../WebApi/Loader';

const ShopCategoryAll = (props) => {
  const [searchValue,setsearchValue]=useState('')
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const myTextInput = useRef()
  const [multiSliderValue, setMultiSliderValue] = useState([0, 100])
  const [showChooseMilesModal, setShowChooseMilesModal] = useState(false)
  const [selectedCategory, setSelectedCategory]=useState('1')
  const [refreshing, setRefreshing] = useState(false);
  const [loading, setLoading] = useState(false);
  // const [categoryData, setCategoryData]=useState([
  //   {
  //     id: '1',
  //     title: 'Electronics',
  //     desc:'',
  //     time:'',
  //     img:require('../../../assets/images/farmland.jpg'),
  //   },
  //   {
  //     id: '2',
  //     title: 'Farm, Pet & Ranch',
  //     desc:'',
  //     time:'',
  //     img:require('../../../assets/images/farmland.jpg'),
  //   },
  //   {
  //     id: '3',
  //     title: 'Hand Tool',
  //     desc:'',
  //     time:'',
  //     img:require('../../../assets/images/farmland.jpg'),
  //   },
  //   {
  //     id: '4',
  //     title: 'Hardware',
  //     desc:'',
  //     time:'',
  //     img:require('../../../assets/images/farmland.jpg'),
  //   },
  // ])
  const [resData, setresData] = useState(null)
  const [filteredData, setFilteredData] = useState([])
  const [categoryData, setCategoryData]=useState([])
  const [upData,setupData]=useState([
    {
      id: '1',
      catId: '1',
      title: 'Intel 3rd Gen Motherboard',
      desc:'',
      price:'$140.00',
      time:'',
      img:require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '2',
      catId: '2',
      title: 'Intel 3rd Gen Motherboard',
      desc:'',
      price:'$140.00',
      time:'',
      img:require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '3',
      catId: '3',
      title: 'Intel 3rd Gen Motherboard',
      desc:'',
      price:'$140.00',
      time:'',
      img:require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '4',
      catId: '4',
      title: 'Intel 3rd Gen Motherboard',
      desc:'',
      price:'$140.00',
      time:'',
      img:require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '5',
      catId: '1',
      title: 'Intel 3rd Gen Motherboard',
      desc:'',
      price:'$140.00',
      time:'',
      img:require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '6',
      catId: '2',
      title: 'Intel 3rd Gen Motherboard',
      desc:'',
      price:'$140.00',
      time:'',
      img:require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '7',
      catId: '3',
      title: 'Intel 3rd Gen Motherboard',
      desc:'',
      price:'$140.00',
      time:'',
      img:require('../../../assets/images/intel_motherboard.png'),
    },
  ])
  const multiSliderValuesChange = (values) => {setMultiSliderValue(values)}
  useEffect(()=>{
    // getCategories()
    setresData(props.route.params.datas)
    setFilteredData(props.route.params.datas)
 },[])
 const checkcon=()=>{
  getCategories()
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
const getCategories = async () => {

setLoading(true)

// const { responseJson, err } = await requestGetApi(shop_product_productlist+'12', '', 'GET', '')
const { responseJson, err } = await requestGetApi(shop_product_category_names, '', 'GET', '')
setLoading(false)
// console.log('the res==>>Home', responseJson)
if (responseJson.headers.success == 1) {
  console.log('the res==>>category all', responseJson.body)
  setCategoryData(responseJson.body)
  setresData(responseJson.body)
    const data = responseJson.body.filter(el=>
      el.name?.toLowerCase()?.includes(String(searchTerm.text?.toLowerCase())?.trim()) ||
      el.category_name?.toLowerCase()?.includes(String(searchTerm.text?.toLowerCase())?.trim())
    )
  setFilteredData([...data])
} else {
  Toast.show({text1: err})
  // setalert_sms(err)
  // setMy_Alert(true)
}

}
const getDataBasedOfSearch = (searchTerm) => {
  // console.log('resData', resData);
  // console.log('searchTerm', searchTerm);
  const data = resData.filter(el=>
    // el.name?.toLowerCase()?.includes(String(searchTerm.text?.toLowerCase())?.trim()) ||
    el.category_name?.toLowerCase()?.includes(String(searchTerm.text?.toLowerCase())?.trim())
  )
  setFilteredData([...data])
}
  return(
    <SafeAreaView scrollEnabled={scrollEnabled} style={{height:'100%', backgroundColor: '#F8F8F8'}}>
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
   press2={()=>{}} title2={'Search Categories'} fontWeight={'500'} img2height={20}
   press3={()=>{}} />

<View style={{width:'96%',alignSelf:'center'}}>
<SearchInputEnt marginTop={10} placeholder={'Search Categories'} 
serchValue={searchValue}
searchIcon={require('../../../assets/images/product_search_icon.png')} 
onChangeText={(e)=>{setsearchValue(e); getDataBasedOfSearch(e)}} 
press={()=>{Alert.alert('Hi')}}
presssearch={()=>{Alert.alert('Search Pressed')}}
paddingLeft={50}/>
{/* <TouchableOpacity style={{width:'98%',height:50,borderRadius:10,backgroundColor:'#fff',flexDirection:'row',alignItems:'center',alignSelf:'center',marginTop:10}}
onPress={()=>{props.navigation.navigate('CategorySearch',{vendorId:props.route.params.vendorId, vendorName:props.route.params.vendorName})}}>
<View style={{padding:5,marginLeft:10}}>
  <Image source={require('../../../assets/ent_search_icon.png')} style={{width:20,height:20}}></Image>
</View>
<View style={{padding:5}}>
  <Text style={{color:'gray',fontSize:12}}>Search Categories</Text>
</View>
</TouchableOpacity> */}
 

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

<View style={{width:'100%',alignSelf:'center',marginTop:20}}>
          <FlatList
                  data={filteredData}
                  showsHorizontalScrollIndicator={false}
                  numColumns={1}
                  renderItem={({item,index})=>{
                    return(
                      <View style={{width:dimensions.SCREEN_WIDTH*0.9,marginHorizontal:5,marginVertical:5, alignSelf:'center'}}>
          <TouchableOpacity style={{width:'100%',height:200,backgroundColor:'#fff', alignItems:'center', borderRadius:15}}
          onPress={()=>{props.navigation.navigate('ShopCategoryProducts', {name: item.category_name, vendorId:props.route.params.vendorId, vendorName:props.route.params.vendorName})}}>
          <Image source={item.category_image} style={{width:120,height:120,borderRadius:60, marginTop:20}}></Image>
          <Text style={{fontSize:12,color:'#263238',marginTop:5,textAlign:'left',fontWeight:'600', marginTop:15}}>{item.category_name}</Text>
          </TouchableOpacity>
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
    </SafeAreaView>
     );
  }
const styles = StyleSheet.create({

});
export default ShopCategoryAll 