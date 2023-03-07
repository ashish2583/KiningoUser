import React, { useEffect,useState ,useRef} from 'react';
import {View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider,ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import Loader from '../../../WebApi/Loader';
import { baseUrl, login,shop_eat_business, requestPostApi,requestGetApi,shop_product_cart, shop_product_delete_cart_item } from '../../../WebApi/Service'
import MyAlert from '../../../component/MyAlert'
import {  useSelector, useDispatch } from 'react-redux';

const ShopProduct = (props) => {
  const userdetaile  = useSelector(state => state.user.user_details)
  const [searchValue,setsearchValue]=useState('')
  let selectedIndex = -1;
  let row = [];
  let prevOpenedRow;
  const [cartItems, setCartItems] = useState([
    {
        id: '1',
        title: 'Intel 3rd Gen Motherboard',
        price: 140,
        quantity:1,
        img:require('../../../assets/images/images.png'),
    },
    {
        id: '2',
        title: 'Intel 3rd Gen Motherboard',
        price: 140,
        quantity:1,
        img:require('../../../assets/images/images.png'),
    },
    {
        id: '3',
        title: 'Intel 3rd Gen Motherboard',
        price: 140,
        quantity:1,
        img:require('../../../assets/images/images.png'),
    },
  ])

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
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState(null)
  useEffect(()=>{
    getCartItems()
 },[])
 const getCartItems = async () => {
  setLoading(true)
  const { responseJson, err } = await requestGetApi(shop_product_cart, '', 'GET', userdetaile.token)
  setLoading(false)
  console.log('the res==>>shop cart', responseJson)
  if (responseJson.headers.success == 1) {
    console.log('the res==>>Home.body.cartData', responseJson.body)
    setresData(responseJson.body.items)
  } else {
     setalert_sms(err)
     setMy_Alert(true)
  }

}
 const deleteCartItems = async (id) => {
  setLoading(true)
  const { responseJson, err } = await requestPostApi(shop_product_delete_cart_item+id, '', 'DELETE', userdetaile.token)
  setLoading(false)
  console.log('the res==>>shop delete cart', responseJson)
  if (responseJson.headers.success == 1) {
    console.log('the res==>>Home.body.delete cart', responseJson.body)
    getCartItems()
  } else {
     setalert_sms(err)
     setMy_Alert(true)
  }

}
 const deleteItem = ({item,  index}) =>{
    // console.log('deleteItem item', item);
    deleteCartItems(item.id)
    // const cartItemsCopy = [...cartItems]
    // const remainingItems = cartItemsCopy.filter(el=>el.id !== item.id)
    // setCartItems(remainingItems)
 }

 const renderItem = ({ item, index }, onClick) => {
    const closeRow = (index) => {
        console.log('closerow');
        selectedIndex = index;
        if (prevOpenedRow && prevOpenedRow !== row[index]) {
          prevOpenedRow.close();
        }
        prevOpenedRow = row[index];
      };
      const renderRightActions = (progress, dragX, onClick) => {
        return (
          <View
            style={{
              backgroundColor: '#FFC40C',
              justifyContent: 'center',
              alignItems: 'flex-end',
              width:100,
              paddingRight:30,
              borderTopRightRadius:15,
              borderBottomRightRadius:15
            }}
            
          >
            <TouchableOpacity  onPress={onClick}>
                <Image resizeMode="contain" source={require('../../../assets/images/prod_delete_icon.png')} style={{width:40, height:40}}/>
            </TouchableOpacity>
          </View>
        );
      };

      const mpress = async (id) => {
        const selectedItem = resData.find(el=>el.id===id)
        if(selectedItem.quantity === 1){
          Alert.alert('cannot reduce quantity')
          return
        }
        const data = {
          id: selectedItem.id,
          product_id: selectedItem.product_id,
          quantity: selectedItem.quantity - 1
        }
        setLoading(true)
        const { responseJson, err } = await requestPostApi(shop_product_delete_cart_item+ selectedItem.id, data, 'PUT', userdetaile.token)
        setLoading(false)
        console.log('the res==>>shop update cart', responseJson)
        if (responseJson.headers.success == 1) {
          console.log('the res==>>Home.body.update cart', responseJson.body)
          getCartItems()
        } else {
           setalert_sms(err)
           setMy_Alert(true)
        }

      }
      const apress = async (id) => {
        const selectedItem = resData.find(el=>el.id===id)
        const data = {
          id: selectedItem.id,
          product_id: selectedItem.product_id,
          quantity: selectedItem.quantity + 1
        }
        setLoading(true)
        const { responseJson, err } = await requestPostApi(shop_product_delete_cart_item+ selectedItem.id, data, 'PUT', userdetaile.token)
        setLoading(false)
        console.log('the res==>>shop update cart', responseJson)
        if (responseJson.headers.success == 1) {
          console.log('the res==>>Home.body.update cart', responseJson.body)
          getCartItems()
        } else {
           setalert_sms(err)
           setMy_Alert(true)
        } 
      }
    return(
        <View style={{width:'90%', height:200, alignSelf:'center'}}>
           <Swipeable
            renderRightActions={(progress, dragX) =>
                renderRightActions(progress, dragX, onClick)
              }
              onSwipeableOpen={() => closeRow(index)}
        ref={(ref) => (row[index] = ref)}
        rightOpenValue={-100}
        >
            <View
            style={{
                paddingHorizontal: 10,
                paddingVertical: 20,
                backgroundColor: 'white',
                borderRadius:15,
                flexDirection:'row',
            }}
            >
                <View style={{borderWidth:5,borderRadius:5,borderColor:'rgba(255, 196, 12, 0.2)',marginRight:20, justifyContent:'center', borderRadius:20, height:100}}>
                    <Image source={{uri:item.image}} resizeMode='contain' style={{width:50, height:50, marginHorizontal:10}}/>
                </View>
                <View>
                    <Text style={{ fontSize: 16, color:'#263238' }}>{item.name}</Text>
                    <Text style={{ fontSize: 16, color:'#263238', marginTop:5 }}>${item.item_total.toFixed(2)}</Text>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop:15}}>
                    <View style={{flexDirection:'row', alignItems:'center', marginTop:15}}>
                        <Text style={{ fontSize: 12, color:Mycolors.GrayColor, marginRight:10 }}>Quantity</Text>
                      <View style={{flexDirection:'row', alignItems:'center', marginTop:15}}>
                      <TouchableOpacity style={{width:30,height:30,borderRadius:20,backgroundColor:'#FFE2E6',justifyContent:'center', alignItems:'center', marginRight:10}}
                          onPress={()=>mpress(item.id)}>
                          <Text style={{textAlign:'center',fontSize:25,color:'red'}}>-</Text>
                          </TouchableOpacity>
                          <Text style={{ fontSize: 12, color:'#263238' }}>{item.quantity}</Text>
                          <TouchableOpacity style={{width:30,height:30,borderRadius:20,backgroundColor:'red',justifyContent:'center', alignItems:'center', marginLeft:10}}
                          onPress={()=>apress(item.id)}>
                          <Text style={{textAlign:'center',fontSize:25,color:'#fff'}}>+</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>
                    <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between',marginTop:10, width:'70%'}}>
                        <Text style={{ fontSize: 12, color:'#263238', textDecorationColor:'#263238', textDecorationLine:'underline', fontWeight:'bold' }}>View Breakup Amount</Text>
                        {/* <Image resizeMode="contain" source={index == selectedIndex ? require('../../../assets/images/prod_unsel_circle.png') : require('../../../assets/images/prod_sel_circle.png')} style={{width:30, height:30}}/> */}
                        <Image resizeMode="contain" source={false ? require('../../../assets/images/prod_unsel_circle.png') : require('../../../assets/images/prod_sel_circle.png')} style={{width:30, height:30}}/>
                    </View>
            </View>
            </View>
        </Swipeable>         
        </View>
        )
 }

  return(
    <SafeAreaView style={{}}>
      <ScrollView>
    <HomeHeader height={60}  paddingHorizontal={15}
   press1={()=>{props.navigation.goBack()}} img1={require('../../../assets/arrow.png')} img1width={18} img1height={15} 
   press2={()=>{}} title2={'Cart'} fontWeight={'500'} img2height={20}
   press3={()=>{}} img3width={25} img3height={25} backgroundColor='#fff'/>

<View style={{width:'96%',alignSelf:'center', marginTop:20}}>
 
<View style={{flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:15}}>
    <Text style={{fontSize:16,color:Mycolors.Black,marginTop:5, fontWeight:'bold'}}>Total 3 items</Text>
    <Text style={{fontSize:13,color:'#FFC40C',marginTop:5, textDecorationColor:'#FFC40C', textDecorationLine:'underline'}}>Select All</Text>
</View>

<View style={{marginTop:40}}>
    <FlatList
    data={resData}
    numColumns={1}
    keyExtractor={item => item.id}
    renderItem={(v) =>
        renderItem(v, () => {
        //   console.log('Pressed', v);
          deleteItem(v);
        })
      }
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