import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import SearchInput2 from '../../../component/SearchInput2';
import SearchInputEnt from '../../../component/SearchInputEnt';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Modal from 'react-native-modal';
import Toast from 'react-native-simple-toast'
import { requestGetApi, shop_product_productlist } from '../../../WebApi/Service';
import Loader from '../../../WebApi/Loader';

const ShopProductDetails = (props) => {
  const [searchValue, setsearchValue] = useState('')
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const myTextInput = useRef()
  const [multiSliderValue, setMultiSliderValue] = useState([0, 100])
  const [showChooseMilesModal, setShowChooseMilesModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('1')
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [loading, setLoading] = useState(false);
  const [resData, setresData] = useState([]);
  const [categorylist, setCategorylist] = useState([])
  const [categoryData, setCategoryData] = useState([
    {
      id: '1',
      title: 'Electronics',
      desc: '',
      time: '',
      img: require('../../../assets/images/farmland.jpg'),
    },
    {
      id: '2',
      title: 'Farm, Pet & Ranch',
      desc: '',
      time: '',
      img: require('../../../assets/images/farmland.jpg'),
    },
    {
      id: '3',
      title: 'Hand Tool',
      desc: '',
      time: '',
      img: require('../../../assets/images/farmland.jpg'),
    },
    {
      id: '4',
      title: 'Hardware',
      desc: '',
      time: '',
      img: require('../../../assets/images/farmland.jpg'),
    },
  ])
  const [upData, setupData] = useState([
    {
      id: '1',
      catId: '1',
      title: 'Intel 3rd Gen Motherboard',
      desc: '',
      price: '$140.00',
      time: '',
      img: require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '2',
      catId: '2',
      title: 'Intel 3rd Gen Motherboard',
      desc: '',
      price: '$140.00',
      time: '',
      img: require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '3',
      catId: '3',
      title: 'Intel 3rd Gen Motherboard',
      desc: '',
      price: '$140.00',
      time: '',
      img: require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '4',
      catId: '4',
      title: 'Intel 3rd Gen Motherboard',
      desc: '',
      price: '$140.00',
      time: '',
      img: require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '5',
      catId: '1',
      title: 'Intel 3rd Gen Motherboard',
      desc: '',
      price: '$140.00',
      time: '',
      img: require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '6',
      catId: '2',
      title: 'Intel 3rd Gen Motherboard',
      desc: '',
      price: '$140.00',
      time: '',
      img: require('../../../assets/images/intel_motherboard.png'),
    },
    {
      id: '7',
      catId: '3',
      title: 'Intel 3rd Gen Motherboard',
      desc: '',
      price: '$140.00',
      time: '',
      img: require('../../../assets/images/intel_motherboard.png'),
    },
  ])
  const multiSliderValuesChange = (values) => { setMultiSliderValue(values) }
  useEffect(() => {
    StoreDetails()
  }, [])
  console.log("categorylist",categorylist);
  const StoreDetails = async () => {

    setLoading(true)

    // const { responseJson, err } = await requestGetApi(shop_product_productlist+'12', '', 'GET', '')
    const { responseJson, err } = await requestGetApi(shop_product_productlist+props.route.params.vendorId, '', 'GET', '')
    setLoading(false)
    // console.log('the res==>>Home', responseJson)
    if (responseJson.headers.success == 1) {
      // console.log('the res==>>Home.body.vendors', responseJson.body)
      setresData(responseJson.body)
      const updatedData = responseJson.body.map(el => el.category)
      const cateList = [... new Set(updatedData)]
      console.log("cateList",cateList);
      setCategorylist(cateList)
      if(cateList?.length > 0){
        setSelectedCategory(cateList[0])
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }

  }

  return (
    <SafeAreaView scrollEnabled={scrollEnabled} style={{ height: '100%', backgroundColor: '#F8F8F8' }}>
      <ScrollView>
        <HomeHeader height={60} paddingHorizontal={15}
          press1={() => { props.navigation.goBack() }} img1={require('../../../assets/arrow.png')} img1width={18} img1height={15}
          press2={() => { }} title2={'24/7 Hardware Store'} fontWeight={'500'} img2height={20}
          press3={() => { }} img3={require('../../../assets/images/layer_9.png')} img3width={15} img3height={18} />

        <View style={{ width: '96%', alignSelf: 'center' }}>
          <SearchInputEnt marginTop={10} placeholder={'Enter Keyword'}
            serchValue={searchValue}
            searchIcon={require('../../../assets/images/product_search_icon.png')}
            onChangeText={(e) => { setsearchValue(e) }}
            press={() => { Alert.alert('Hi') }}
            presssearch={() => { Alert.alert('Search Pressed') }}
            paddingLeft={50} />


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

          <View style={{ width: '96%', flexDirection: 'row', justifyContent: 'space-between', alignSelf: 'center', marginTop: 20 }}>
            <Text style={{ color: Mycolors.Black, fontWeight: '500' }}>Pick from wide range of categories</Text>
            <Text style={{ color: '#FFC40C', fontWeight: '500', textDecorationLine: "underline", textDecorationColor: '#FFC40C' }}
              onPress={() => { props.navigation.navigate('ShopCategoryAll') }}>View More</Text>
          </View>

          <View style={{ width: '100%', alignSelf: 'center', marginTop: 10, backgroundColor: '#F8F8F8' }}>
            <FlatList
              data={categorylist}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              // numColumns={2}
              renderItem={({ item, index }) => {
               
                return (
                  <View style={{ width: 100, marginHorizontal: 5 }}>
                    <TouchableOpacity style={{ width: 100, height: 80, backgroundColor: '#F8F8F8', alignSelf: 'center' }}
                      onPress={() => { setSelectedCategory(item) }}>
                      <Image source={{ uri:  'https://plus.unsplash.com/premium_photo-1668383210338-ac32c65c99e3?ixlib=rb-4.0.3&ixi[…]MXx8bWVufGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=600&q=60' }} style={{ width: "100%", height: "100%", alignSelf: 'center', borderRadius: 7 }}></Image>
                    </TouchableOpacity>
                    <View style={{}}>
                      <Text style={{ fontSize: 11, color: (selectedCategory === item) ? '#FFC40C' : Mycolors.Black, marginTop: 5, textAlign: 'center', fontWeight: 'bold' }}>{item}</Text>
                    </View>
                  </View>
                )
              }}
              keyExtractor={item => item.id}
            />
          </View>

          <View style={{ width: '100%', alignSelf: 'center', marginTop: 20 }}>
            <FlatList
              data={resData?.filter(el => el.category === selectedCategory)}
              // data={resData}

              showsHorizontalScrollIndicator={false}
              numColumns={2}
              renderItem={({ item, index }) => {
                return (
                  <View style={{ width: dimensions.SCREEN_WIDTH / 2.2, marginHorizontal: 5 }}>
                    <TouchableOpacity style={{ width: dimensions.SCREEN_WIDTH / 2.2, height: 170, backgroundColor: '#fff', alignSelf: 'center', borderRadius: 15, overflow: 'hidden' }}
                      onPress={() => { props.navigation.navigate('ShopProductDetails') }}>
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
              }}
              keyExtractor={item => item.id}
            />
          </View>






        </View>
        <View style={{ height: 100 }} />

      </ScrollView>
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({

});
export default ShopProductDetails 