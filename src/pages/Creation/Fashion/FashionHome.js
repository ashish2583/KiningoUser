import React, { useEffect,useState ,useRef} from 'react';
import {View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground} from 'react-native';
import HomeHeaderRoundBottom from '../../../component/HomeHeaderRoundBottom';
import SearchInput2 from '../../../component/SearchInput2';
import SearchInputEnt from '../../../component/SearchInputEnt';
import FashionSearch from './components/FashionSearch';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider,ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Modal from 'react-native-modal';
// import Toast from 'react-native-simple-toast'
import LinearGradient from 'react-native-linear-gradient'
import AppIntroSlider from 'react-native-app-intro-slider';
import IconFontAwesome from 'react-native-vector-icons/FontAwesome';
import Loader from '../../../WebApi/Loader';
import VideoPlayer from 'react-native-video-player'
// import { createThumbnail } from "react-native-create-thumbnail";
import ViewMoreText from 'react-native-view-more-text';

const FashionHome = (props) => {
  const [searchValue,setsearchValue]=useState('')
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const myTextInput = useRef()
  const [multiSliderValue, setMultiSliderValue] = useState([0, 100])
  const [showChooseMilesModal, setShowChooseMilesModal] = useState(false)
  const [selectedCategory, setSelectedCategory]=useState('1')
  const [loading, setLoading] = useState(false)
  const [showModal, setShowModal] = useState({isVisible: false, data: null});
  const [showVideoModal, setShowVideoModal] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState({})
  const [showReportModal, setShowReportModal] = useState(false)
  const [selectedReasonId, setSelectedReasonId]=useState(null)
  const [reportReasonData, setReportReasonData]=useState([
    {
      id: '1',
      name: 'I just don’t like it',
      description: '',
      selected: true
    },
    {
      id: '2',
      name: 'Nudity or pornography',
      description: '',
      selected: false
    },
    {
      id: '3',
      name: 'Hate speech or symbols',
      description: 'Racist, homophobic or sexist slurs',
      selected: false
    },
    {
      id: '4',
      name: 'Violence or threat of violence',
      description: `Graphic injury, unlawful activity, dangerous or criminal organizations`,
      selected: false
    },
    {
      id: '5',
      name: 'Sale or promotion of firearms',
      description: '',
      selected: false
    },
    {
      id: '6',
      name: 'Sale or promotion of drugs',
      description: '',
      selected: false
    },
    {
      id: '7',
      name: 'Harassment or bullying',
      description: '',
      selected: false
    },
    {
      id: '8',
      name: 'Intellectual property violation',
      description: 'Copyright or trademark infringement',
      selected: false
    },
  ])
  const [videoDetails, setVideoDetails] = useState([
    {url: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`},
    {url: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`},
    {url: `http://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4`},
  ])
const [classesList, setClassesList]=useState([
  {
      id: '1',
      title: 'Graphic Design Class',
      price:949,
      desc:['Get 2x deeper dust removal with unique foam je technology', 'Recommended for ACs serviced more than 6 months ago'],
      distance:'3 kms away',
      img:require('../../../assets/images/service-product-image.png'),
  },
  {
      id: '2',
      title: 'Graphic Design Class',
      price:949,
      desc:['Get 2x deeper dust removal with unique foam je technology', 'Recommended for ACs serviced more than 6 months ago'],
      distance:'3 kms away',
      img:require('../../../assets/images/service-product-image.png'),
  },
  {
      id: '3',
      title: 'Graphic Design Class',
      price:949,
      desc:['Get 2x deeper dust removal with unique foam je technology', 'Recommended for ACs serviced more than 6 months ago'],
      distance:'3 kms away',
      img:require('../../../assets/images/service-product-image.png'),
  },
])
  const [aroundTheWorldData, setAroundTheWorldData]=useState([
    {
      id: '1',
      name: 'Leslie Alexander',
      desc:'',
      time:'14 hours ago',
      img:require('../../../assets/images/fashion-around-the-world-image.png'),
      likes: '4k',
      dislikes: '1k',
    },
    {
      id: '2',
      name: 'Leslie Alexander',
      desc:'',
      time:'14 hours ago',
      img:require('../../../assets/images/fashion-around-the-world-image.png'),
      likes: '4k',
      dislikes: '1k',
    },
    {
      id: '3',
      name: 'Leslie Alexander',
      desc:'',
      time:'14 hours ago',
      img:require('../../../assets/images/fashion-around-the-world-image.png'),
      likes: '4k',
      dislikes: '1k',
    },
  ])
  const [courseData, setCourseData]=useState([
    {
      id: '1',
      title: 'Celebrity Style',
      desc:'',
      time:'',
      img:require('../../../assets/images/fashion-celebrity-style.png'),
    },
    {
      id: '2',
      title: 'Street Style',
      desc:'',
      time:'',
      img:require('../../../assets/images/fashion-celebrity-style.png'),
    },
    {
      id: '3',
      title: 'Models',
      desc:'',
      time:'',
      img:require('../../../assets/images/fashion-celebrity-style.png'),
    },
  ])
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

 },[])

 const _renderItem = ({ item }) => {
  return (
      <Image source={{uri: item.image}} style={{width:'100%',height:170, borderRadius:20, alignSelf:'center'}}/>
    // <View key={item.key} style={styles.slide}>
    //   <Text style={styles.title}>{item.title}</Text>
    //   <Text style={styles.text}>{item.text}</Text>
    // </View>
  );
}

  return(
    <SafeAreaView scrollEnabled={scrollEnabled} style={{height:'100%', backgroundColor: '#F8F8F8'}}>
      <ScrollView>
      <HomeHeaderRoundBottom height={100} extraStyle={{paddingtop:10, paddingBottom:25}}  paddingHorizontal={15} borderBottomLeftRadius={20} borderBottomRightRadius={20} backgroundColor='#0089CF'
   press1={()=>{props.navigation.goBack()}} img1={require('../../../assets/images/service-header-back-button.png')} img1width={25} img1height={18} 
   press2={()=>{}} title2={'Fashion'} fontWeight={'500'} img2height={20} color={'#fff'}
   press3={()=>{}} img3={require('../../../assets/images/fashion-bell-icon.png')} img3width={25} img3height={22} />

<View style={{width:'85%',alignSelf:'center'}}>
<View style={{top:-20}}>
    <FashionSearch marginTop={0} placeholder={'Search here'} 
    serchValue={searchValue}
    searchIcon={require('../../../assets/images/fashion-search-icon.png')} 
    onChangeText={(e)=>{setsearchValue(e)}} 
    press={()=>{Alert.alert('Hi')}}
    presssearch={()=>{Alert.alert('Search Pressed')}}
    paddingLeft={20}/>
</View>
 
<View style={{width:dimensions.SCREEN_WIDTH*0.9,alignSelf:'flex-start',marginTop:0, marginBottom:10, marginTop:10}}>
          <FlatList
                  data={courseData}
                  showsHorizontalScrollIndicator={true}
                  horizontal
                  renderItem={({item,index})=>{
                    return(
                      
          <TouchableOpacity style={{width:dimensions.SCREEN_WIDTH/2.8,height:160,marginRight:15, borderRadius:10,overflow:'hidden',position: 'relative', alignItems:'center', borderRadius:15, paddingHorizontal:10}}
          onPress={()=>{}}>
          <Image source={item.img} style={{width:dimensions.SCREEN_WIDTH/2.8,height:160}} resizeMode='contain'></Image>
          <LinearGradient
          colors={['rgba(0, 0, 0, 0)', 'rgba(0, 0, 0, 0.43)']}
          style={{position: 'absolute',top: 0,bottom: 0,left: 0,right: 0,zIndex: 1, }}
         >
            <View style={{flex: 1,flexDirection: 'column',justifyContent: 'flex-end',alignItems: 'center',}}>
              <Text style={{fontSize:14,fontWeight:'500',color:'#fff',bottom:20}}>{item.title}</Text>
            </View>
         </LinearGradient>
          </TouchableOpacity>
                    )
                  }}
                  keyExtractor={item => item.id}
                />
         </View>

         <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginTop:20, marginBottom:10}}>
   <Text style={{fontSize:16,fontWeight:'500',color:'#263238'}}>Around the world</Text>
   <TouchableOpacity onPress={()=>{}}>
     <Text style={{fontSize:13,fontWeight:'400',color:'#0089CF'}}>View all</Text>
   </TouchableOpacity>
</View>

<View style={{width:dimensions.SCREEN_WIDTH*0.9,alignSelf:'flex-start', marginTop:10}}>
          <FlatList
                  data={aroundTheWorldData}
                  showsHorizontalScrollIndicator={true}
                  horizontal
                  renderItem={({item,index})=>{
                    return(
                      
          <View style={{width:dimensions.SCREEN_WIDTH/1.5,marginRight:15}}
          onPress={()=>{}}>
          <TouchableOpacity onPress={()=>{props.navigation.navigate('FashionPost')}}>
            <Image source={item.img} style={{width:dimensions.SCREEN_WIDTH/1.5,height:160, borderRadius:4}}></Image>
          </TouchableOpacity>
          
          <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginVertical:10}}>
            <View style={{flexDirection:'row', alignItems:'center'}}>
              <Image source={require('../../../assets/images/dating-home-header-left-image.png')} style={{height:40, width:40, borderRadius:20}}  />
              <Text style={{fontSize:12,fontWeight:'400',color:'#000', marginLeft:10,}}>{item.name}</Text>
            </View>
              <Text style={{fontSize:12,fontWeight:'400',color:'#B2B7B9'}}>{item.time}</Text>
          </View>

          <ViewMoreText
            numberOfLines={3}
            renderViewMore={(onPress)=>{
              return(
                <Text onPress={onPress} style={{fontSize:14,color:'#0089CF',textDecorationLine: "underline"}}>View more</Text>
              )
            }}
            renderViewLess={(onPress)=>{
              return(
                <Text onPress={onPress} style={{fontSize:14,color:'#0089CF',textDecorationLine: "underline"}}>View less</Text>
              )
            }}
            textStyle={{textAlign: 'left',width:'95%'}}
          >
            <Text style={{fontSize:14,fontWeight:'400', color:'#455A64'}}>
            In publishing and graphic design, Lorem ipsum is a place-
            holder text commonly used to demonstrate the visual form
            of a document or a typeface without relying on meaningful
            of a document or a typeface without relying on meaningful
            content.
            </Text>
          </ViewMoreText>

          <View style={styles.buttonsRow}>
            <TouchableOpacity style={styles.buttonView}>
              <Image source={require('../../../assets/images/fashion-like-button.png')} style={{height:20, width:20}} />
              <Text style={styles.buttonText}>{item.likes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonView}>
              <Image source={require('../../../assets/images/fashion-dislike-button.png')} style={{height:20, width:20}} />
              <Text style={styles.buttonText}>{item.dislikes}</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.buttonView}>
              <Image source={require('../../../assets/images/fashion-share-button.png')} style={{height:20, width:20}} />
              <Text style={styles.buttonText}>Share</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={()=>{setShowReportModal(true)}} style={styles.buttonView}>
              <Image source={require('../../../assets/images/fashion-report-button.png')} style={{height:20, width:20}} />
              <Text style={styles.buttonText}>Report</Text>
            </TouchableOpacity>
          </View>

          </View>
                    )
                  }}
                  keyExtractor={item => item.id}
                />
         </View>

<View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between', marginBottom:10, marginTop:35}}>
   <Text style={{fontSize:16,fontWeight:'500',color:'#263238'}}>Recommended for you</Text>
   <TouchableOpacity onPress={()=>{}}>
     <Text style={{fontSize:13,fontWeight:'400',color:'#0089CF'}}>View all</Text>
   </TouchableOpacity>
</View>

<View style={{width:dimensions.SCREEN_WIDTH*0.9,alignSelf:'flex-start',marginTop:0, marginBottom:10, marginTop:10}}>
          <FlatList
                  data={aroundTheWorldData}
                  showsHorizontalScrollIndicator={true}
                  horizontal
                  renderItem={({item,index})=>{
                    return(
                      
          <View style={{width:dimensions.SCREEN_WIDTH/1.5,height:160,marginRight:15}}
          onPress={()=>{}}>
          <Image source={item.img} style={{width:dimensions.SCREEN_WIDTH/1.5,height:160, borderRadius:4}}></Image>
          
          </View>
                    )
                  }}
                  keyExtractor={item => item.id}
                />
         </View>


  <View style={{height:10}}/> 


 </View>
<View style={{height:100}} />
</ScrollView>
{/* <TouchableOpacity onPress={()=>props.navigation.navigate('ShopProdCart')} style={{width:'80%',height:60,flexDirection:'row',justifyContent:'flex-end',position:'absolute',bottom:40, right:20, shadowColor: '#FFD037', shadowOffset: {width: 0,height: 3},shadowRadius: 1,shadowOpacity: 0.1,elevation: 5}}> */}
<TouchableOpacity onPress={()=>{props.navigation.navigate('FashionUpload')}} style={{bottom:60,right:20,position:'absolute',alignSelf:'flex-end',width:80, height:80, borderRadius:80/2, backgroundColor:'#0089CF', justifyContent:'center', alignItems:'center', shadowColor: '#FFD037', shadowOffset: {width: 0,height: 3},shadowRadius: 1,shadowOpacity: 0.1,elevation: 5}}>
  <Image source={require('../../../assets/images/fashion-upload-icon.png')} style={{width:40,height:40 }}/>
</TouchableOpacity>
{/* </TouchableOpacity> */}
{loading ? <Loader /> : null}
<Modal
        isVisible={showReportModal}
        swipeDirection="down"
        onBackdropPress={()=>setShowReportModal(false)}
        onSwipeComplete={(e) => {
          setShowReportModal(false)
        }}
          scrollTo={() => {}}
          scrollOffset={1}
          propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '90%', backgroundColor: '#fff', borderTopLeftRadius: 30, borderTopRightRadius: 30 }}>
          <Text style={{fontSize:18, fontWeight:'700', color:'#455A64',textAlign:'center',marginBottom:20, marginTop:30}}>Report</Text>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

            <FlatList
              data={reportReasonData}
              showsHorizontalScrollIndicator={false}
              numColumns={1}
              keyExtractor={item => item.id}
              style={{marginBottom:10}}
              renderItem={({item,index})=>{
                return(
                  <TouchableOpacity key={item.id} onPress={()=>setSelectedReasonId(item.id)} style={selectedReasonId === item.id ? styles.selectedReasonView : styles.reasonView}>
                    <Image source={selectedReasonId === item.id ? require('../../../assets/images/fastion-selected-reason-icon.png') :require('../../../assets/images/fastion-reason-icon.png')} />
                    <View style={{marginLeft:10}}>
                      <Text style={{fontSize:14, lineHeight:14, fontWeight:'400', color:'#455A64'}}>{item.name}</Text>
                      {item.description ?
                      <Text style={{fontSize:12, lineHeight:12, fontWeight:'400', color:'#C5C6C9', marginTop:2}}>{item.description}</Text>
                      :null}
                    </View>
                  </TouchableOpacity>
                  )
                }}
              />

            <TouchableOpacity style={styles.reportButtonView}>
              <Text style={{fontSize:15, fontWeight:'500', color:'#fff',}}>Report</Text>
            </TouchableOpacity>    

            </ScrollView>
           
            </View>
</Modal>
    </SafeAreaView>
     );
  }
const styles = StyleSheet.create({
  unselectedTabText:{
    fontSize:14,
    fontWeight:'500',
    color: '#263238'
  },
  requestCallView:{
    marginTop:10,
    width:140,
    height:30,
    borderRadius:15,
    backgroundColor:'#29913C',
    alignItems:'center',
    justifyContent:'center',
    shadowColor:'#6D2F91',
    shadowOffset: {width:3,height:3}, 
    shadowRadius: 5,
    shadowOpacity: 0.17,
    elevation: 2
  },
  VideoThumbWrapper: {
    position: 'relative',
    // width: '48%',
    // marginRight: 8,
    marginBottom: 4,

    width:dimensions.SCREEN_WIDTH/1.5,
    height:160,
    marginRight: 20,
    borderRadius:15, 
    // shadowColor:'#000',
    // shadowOffset: {width: 0,height: 3},
    // shadowRadius: 1,
    // shadowOpacity: 0.03,
    // elevation: 1,
  },
  PlayIconContainer: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  PlayIconWrapper: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  BackGroundImage: {
    width: '100%',
    height: 160,
    justifyContent: 'center',
    borderRadius:15
  },
  buttonsRow:{
    flexDirection:'row', 
    justifyContent:'space-between', 
    alignItems:'center', 
    marginTop:20
  },
  buttonView:{
    flexDirection:'row', 
    alignItems:'center'
  },
  buttonText:{
    fontSize:10, 
    fontWeight:'500', 
    color:'#8F93A0', 
    marginLeft:5
  },
  reasonView:{
    alignSelf:'center',
    flexDirection:'row', 
    alignItems:'center', 
    backgroundColor:'#fff',
    marginBottom:15,
    // paddingVertical:10,
    paddingHorizontal:10,
    width:'90%',
    height:60, 
  },
  selectedReasonView:{
    alignSelf:'center',
    flexDirection:'row', 
    alignItems:'center', 
    backgroundColor:'#fff',
    marginBottom:15,
    // paddingVertical:10,
    paddingHorizontal:10,
    width:'90%',
    height:60,
    borderColor:'#E7F7FF', 
    borderWidth:1,
    shadowColor:'#455A64',
    shadowOffset: {width:3,height:3}, 
    shadowRadius: 5,
    shadowOpacity: 0.10,
    elevation: 1
  },
  reportButtonView:{
    height:60,
    width:'90%',
    alignSelf:'center',
    backgroundColor:'#0089CF',
    alignItems:'center',
    justifyContent:'center',
    borderRadius:5,
    marginBottom:30,
    shadowColor:'#000',
    shadowOffset: {width:3,height:3}, 
    shadowRadius: 5,
    shadowOpacity: 0.10,
    elevation: 2
  }
});
export default FashionHome 