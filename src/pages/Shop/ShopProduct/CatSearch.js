import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, StatusBar, RefreshControl } from 'react-native';
import HomeHeader from '../../../component/HomeHeader';
import ProductSearchInput from './components/ProductSearchInput';
import SearchInput2 from '../../../component/SearchInput2';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import { baseUrl, login, shop_eat_business, menu_AllCategoryNames, menu_categorySearch_attribute_name, requestPostApi, requestGetApi, shop_eat, shop_product_categories } from '../../../WebApi/Service'
import Loader from '../../../WebApi/Loader';
import MyAlert from '../../../component/MyAlert';
import { useSelector, useDispatch } from 'react-redux';
import { saveUserResult, saveUserToken, setVenderDetail, setUserType } from '../../../redux/actions/user_action';
import Toast from 'react-native-toast-message';
import Feather from 'react-native-vector-icons/Feather';

const checkIfEmpty = (data) => {
  if(data === null || (Array.isArray(data) && data?.length === 0 )){
    return true
  }else{
    return false
  }
}
const dummyLocation = true
const CatSearch = (props) => {
  const [searchValue, setsearchValue] = useState('')
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false)
  const [resData, setresData] = useState([])
  const [venderdata, setvenderdata] = useState(null)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [lat, setlat] = useState('28.6176')
  const [lan, setlan] = useState('77.422')
  const [refreshing, setRefreshing] = useState(false);
  const [relode, setrelode] = useState(false)
  const mapdata = useSelector(state => state.maplocation)

  useEffect(() => {
    console.log('hohohohoho', props.route.params.datas);
    //  setresData(props.route.params.datas)
    AllVenders()
    //    if(props.route.params.from!='search'){
    //     AllVenders()
    //    }
  }, [])
  const checkcon = () => {
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

  const homePageSearch = async (ttt) => {
    setresData([])
    const endPoint = 
      dummyLocation ? 
        shop_product_categories + '?category_name=' + ttt + '&lat=' + '28.5355' + '&long=' + '77.3910'
        :  
        shop_product_categories + '?category_name=' + ttt + '&lat=' + mapdata.restorentlocation.latitude + '&long=' + mapdata.restorentlocation.longitude  
    setLoading(true)
    // const { responseJson, err } = await requestGetApi(menu_categorySearch_attribute_name+ttt+'&lat=' +  mapdata.restorentlocation.latitude + '&long=' + mapdata.restorentlocation.longitude, '', 'GET', '')
    const { responseJson, err } = await requestGetApi(endPoint, '', 'GET', '')
    setLoading(false)
    console.log('the res==>>Home', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        setresData(responseJson.body)
        setrelode(!relode)
      } else {
        Toast.show({ text1: responseJson.headers.message })
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const AllVenders = async () => {
    console.log('the res==>>Homethe res==>>Homethe res==>>Home')
    const endPoint = 
      dummyLocation ? 
        shop_product_categories + '?lat=' + '28.5355' + '&long=' + '77.3910'
        :
        shop_product_categories + '?lat=' + mapdata.restorentlocation.latitude + '&long=' + mapdata.restorentlocation.longitude

    setLoading(true)
    //   const { responseJson, err } = await requestGetApi(menu_AllCategoryNames+'?lat=' +  mapdata.restorentlocation.latitude + '&long=' + mapdata.restorentlocation.longitude, '', 'GET', '')
    const { responseJson, err } = await requestGetApi(endPoint, '', 'GET', '')
    setLoading(false)
    console.log('the res==>>Homethe res==>>Homethe res==>>Home', responseJson)
    if (responseJson !== null) {
      if (responseJson.headers.success == 1) {
        setresData(responseJson.body)
      } else {
        Toast.show({ text1: responseJson.headers.message })
      }
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  return (
    <SafeAreaView style={{}}>

      <HomeHeader height={60} paddingHorizontal={15}
        press1={() => { props.navigation.goBack() }} img1={require('../../../assets/arrow.png')} img1width={18} img1height={15}
        press2={() => { }} title2={'Search'} fontWeight={'500'} img2height={20}
        press3={() => { }} img3width={25} img3height={25} />

      <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={onRefresh}

        />
      }
      >
        <View style={{ width: '96%', alignSelf: 'center' }}>
          {/* <SearchInput2 marginTop={10} placeholder={'Restaurant Name. Cuisine, Dishes'}
            serchValue={searchValue}
            onChangeText={(e) => {
              setsearchValue(e)
              homePageSearch(e.text)
              if (e.text.length == 0) {
                AllVenders()
              }
            }}
            press={() => { Alert.alert('Hi') }}
            presssearch={() => { homePageSearch(searchValue.text) }}
            paddingLeft={9} /> */}

          <ProductSearchInput marginTop={10} placeholder={'Search Categories'}
            serchValue={searchValue}
            onChangeText={(e) => {
              setsearchValue(e)
              homePageSearch(e.text)
              if (e.text.length == 0) {
                AllVenders()
              }
            }}
            press={() => { Alert.alert('Hi') }}
            presssearch={() => { homePageSearch(searchValue.text) }}
            paddingLeft={9} />


          <View style={{ width: '100%', marginTop: 25, alignSelf: 'center', }}>
            {!checkIfEmpty(resData) ?
              <FlatList
                data={resData}
                //horizontal={true}
                // showsHorizontalScrollIndicator={false}
                numColumns={2}
                renderItem={({ item, index }) => {
                  return (
                    <View style={{width: '49%', marginBottom:20}}>
                    <View style={{ width: '80%',alignSelf:'center', marginHorizontal: 2, marginVertical: -1, backgroundColor: 'white', borderRadius: 10, paddingBottom: 30,}}>
                      {/* <ImageBackground source={require('../../../assets/Food-Cover-image.png')} style={{ width: '100%', height: '100%', borderRadius: 10, }} resizeMode='stretch'> */}
                        <TouchableOpacity style={{
                          paddingTop: 20

                        }} onPress={() => { props.navigation.navigate('ShopProductSearch', { datas: [item], from: 'CatClick' }) }}>
                          <View style={{
                            width: 100, height: 100, alignSelf: 'center', borderRadius: 100 / 2, shadowOffset: {
                              width: 0,
                              height: 3
                            },
                            shadowRadius: 1,
                            shadowOpacity: 0.5,
                            elevation: 10,
                          }}>
                            <Image source={{ uri: item.category_image }} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 50, overflow: 'hidden' }}></Image>
                          </View>
                          <Text style={{ color: Mycolors.Black, fontWeight: '600', fontSize: 14, textAlign: 'center', marginTop: 9 }} >{item.category_name}</Text>
                          <Text style={{ color: '#0EA00E', fontWeight: '400', fontSize: 12, textAlign: 'center', marginTop: 9, }} >{item.total_vendors == 0 ? 'No Places NearBy' : item.total_vendors + ' Places NearBy'}</Text>
                        </TouchableOpacity>
                      {/* </ImageBackground> */}
                    </View>
                    <View style={styles.arrowContainer}>
                        <View style={styles.arrowContainer2}>
                          <View style={styles.arrowView}>
                            <Feather name="arrow-right-circle" color={'#0EA00E'} size={24} />
                          </View>
                        </View>
                      </View>
                    </View>
                  )
                }}
                keyExtractor={item => item.category_code}
              />
              :
              <Text style={{ color: '#835E23', fontWeight: 'bold', fontSize: 18, textAlign: 'center' }}>No Categories Found</Text> 
              }

          </View>




        </View>
        <View style={{ height: 60 }} />

      </ScrollView>

      {loading ? <Loader /> : null}
      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  arrowContainer: {
    // position: 'absolute',
    // bottom: -40 / 2,
    marginTop:-40/2,
    backgroundColor: '#F8F8F8',
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 35,
    width: 35,
    borderRadius: 35 / 2,
  },
  arrowContainer2: {
    backgroundColor: 'white',
    // backgroundColor: 'red',
    alignSelf: 'center',
    justifyContent: 'center',
    alignItems: 'center',
    height: 30,
    width: 30,
    borderRadius: 30 / 2,
  },
  arrowView: {
    height: 25,
    width: 25,
    borderRadius: 25 / 2,
    justifyContent: 'center',
    alignItems: 'center',
  }
});
export default CatSearch 