import React, { useEffect,useState ,useRef} from 'react';
import {View,Image,Text,StyleSheet,SafeAreaView,TextInput,FlatList,Alert,TouchableOpacity, ScrollView, ImageBackground, Keyboard} from 'react-native';
import HomeHeaderRoundBottom from '../../../component/HomeHeaderRoundBottom';
import SearchInput2 from '../../../component/SearchInput2';
import SearchInputEnt from '../../../component/SearchInputEnt';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider,ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Modal from 'react-native-modal';
// import Toast from 'react-native-simple-toast'
import LinearGradient from 'react-native-linear-gradient'
import {launchCamera,launchImageLibrary} from 'react-native-image-picker';
import VideoPlayer from 'react-native-video-player'

const image1 = require('../../../assets/images/people-following-person.png')

const PeopleCreatePost = (props) => {
  const [searchValue,setsearchValue]=useState('')
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const myTextInput = useRef()
  const [userMessage, setUserMessage] = useState('')
  const [multiSliderValue, setMultiSliderValue] = useState([0, 100])
  const [showChooseMilesModal, setShowChooseMilesModal] = useState(false)
  const [pick, setpick] = useState('')
  const [capturedVideo, setcapturedVideo] = useState('')
  const [filepath, setfilepath] = useState(null)

  const openLibrary = async () => {
    setmodlevisual(false)
    let options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option'
        },
      ],
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
  
    launchImageLibrary(options, (image) => {
      if (!image.didCancel) {
        console.log('the ddd==', image.assets[0].uri)
        var photo = {
          uri: image.assets[0].uri,
          type: "image/jpeg",
          name: image.assets[0].fileName
        };
        setpick(photo)
        setfilepath(image)
      }
    })
  
  
  }
  const requestCameraPermission = async () => {
    opencamera()
    // try {
    //   const granted = await PermissionsAndroid.request(
    //     PermissionsAndroid.PERMISSIONS.CAMERA,
    //     {
    //       title: "App Camera Permission",
    //       message:"App needs access to your camera ",
    //       buttonNeutral: "Ask Me Later",
    //       buttonNegative: "Cancel",
    //       buttonPositive: "OK"
    //     }
    //   );
    //   console.log("CPermissionsAndroid.RESULTS",PermissionsAndroid.RESULTS.GRANTED);
    //   console.log("CPermissionsAndroid.RESULTS",granted);
    //   if (granted === PermissionsAndroid.RESULTS.GRANTED) {
    //     console.log("Camera permission given");
    //     opencamera()
    //   } else {
    //     console.log("Camera permission denied");
    //     // opencamera()
    //   }
    // } catch (err) {
    //   console.warn(err);
    // }
  };
  const opencamera = async () => {
    // setmodlevisual(false)
  
    let options = {
      title: 'Select Image',
      customButtons: [
        {
          name: 'customOptionKey',
          title: 'Choose Photo from Custom Option'
        },
      ],
      mediaType:'video',
      maxWidth: 500,
      maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: 'images',
      },
    };
    
    if(true){
      launchCamera(options, (video) => {
        if (!video.didCancel) {
          console.log('the ddd==', video)
          var obj = {
            uri: video.assets[0].uri,
            type: "video/mp4",
            name: video.assets[0].fileName
          };
          setcapturedVideo(obj)
          setfilepath(video)
        }
    
      })
    }else{
      launchCamera(options, (image) => {
        if (!image.didCancel) {
          console.log('the ddd==', image)
          var photo = {
            uri: image.assets[0].uri,
            type: "image/jpeg",
            name: image.assets[0].fileName
          };
          setpick(photo)
          setfilepath(image)
        }
    
      })
    }
  }

  return(
    <SafeAreaView scrollEnabled={scrollEnabled} style={{backgroundColor:'#F8F8F8'}}>
      <ScrollView>
      <HomeHeaderRoundBottom height={80}  paddingHorizontal={15} backgroundColor='#fff'
   press1={()=>{props.navigation.goBack()}} img1={require('../../../assets/images/events_arrow.png')} img1width={25} img1height={20} 
   press2={()=>{}} title2={'Create Post'} fontWeight={'500'} img2height={20} color='#455A64'
   press3={()=>{}} img3width={25} img3height={25} borderBottomLeftRadius={25} borderBottomRightRadius={25} />
<View style={{width:'90%',alignSelf:'center', marginTop:20}}>
  


<View style={{width:'100%',alignSelf:'center',marginTop:20, backgroundColor:'#F8F8F8'}}>

  <View style={styles.rowWithImageView}>
    
    <View style={{flexDirection:'row', alignItems:'center',}}>
      <Image source={image1}/>
      <Text style={{fontSize:14, fontWeight:'600', color:'#455A64', marginLeft:10}}>Aayav Nadkarni</Text>
    </View>
    
    <View style={styles.eyeView}>
      <Image source={require('../../../assets/images/people-eye-image.png')}/>
      <Text style={{fontSize:14, fontWeight:'400', color:'#fff', marginLeft:10}}>View Profile</Text>
    </View>
  </View>

  <View style={{marginTop:10, marginBottom:20}}>
    <TextInput
        //  value={reson}
        //  onChangeText={(e) => setreson(e)}
        placeholder={`What's on your mind`}
        placeholderTextColor="#bbbbbb"
        multiline={true}
      // maxLength={500}
      // keyboardType="number-pad"
        autoCapitalize = 'none'
        style={[styles.input]}
      />  
  </View>  

  <LinearGradient
    colors={['rgba(255, 255, 255, 1)', 'rgba(249, 249, 249, 1)']}
    style={styles.uploadImageView}>
    <View style={{flexDirection:'row', alignItems:'center'}}>
      <View style={styles.imageView}>
        <Image source={require('../../../assets/images/people-upload-photo-video.png')}/>
      </View>
      <Text style={styles.imageText}>Photo/Video</Text>
    </View>
    <Image source={require('../../../assets/images/people-right-arrow.png')}/>
  </LinearGradient>

  <LinearGradient
    colors={['rgba(255, 255, 255, 1)', 'rgba(249, 249, 249, 1)']}
    style={[styles.uploadImageView, {marginTop:10}]}>  
    <TouchableOpacity style={{flexDirection:'row', alignItems:'center'}} onPress={()=>requestCameraPermission()}>
      <View style={styles.imageView}>
        <Image source={require('../../../assets/images/people-camera-image.png')}/>
      </View>
      <Text style={styles.imageText}>Camera</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>requestCameraPermission()}>
      <Image source={require('../../../assets/images/people-right-arrow.png')}/>
    </TouchableOpacity>
  </LinearGradient> 

</View>






 </View>
<View style={{height:100}} />

</ScrollView>

    </SafeAreaView>
     );
  }
const styles = StyleSheet.create({
  searchView:{
    flexDirection:'row',
    justifyContent:'space-between',
    alignItems:'center',
    width:'100%',
    height:50,
  },
  searchLeftSubView:{
    width:'83%',
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'#fff',
    paddingVertical:5, 
    paddingLeft:10, 
    borderRadius:10,
    shadowColor: '#000000',
    shadowOffset: {
      width:0,
      height:3
    }, 
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 5,
  },
  rowWithImageView:{
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    backgroundColor:'#fff', 
    padding:10, 
    borderRadius:10,
    shadowColor: '#000000',
    shadowOffset: {
      width:0,
      height:3
    }, 
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  eyeView:{
    flexDirection:'row', 
    alignItems:'center',
    backgroundColor:'#0089CF', 
    borderRadius:20,
    paddingVertical:10,
    paddingHorizontal:12,
  },
  input: {
    paddingLeft: 15,
    width:'100%',
    fontSize: 14,
    backgroundColor: '#fff',
    height:200,
    borderRadius:5,
    paddingHorizontal:15,
    paddingVertical:10,
    color:Mycolors.Black,
    borderRadius:10,
    shadowColor: '#000000',
    shadowOffset: {
      width:0,
      height:3
    }, 
    shadowRadius: 5,
    shadowOpacity: 0.05,
    elevation: 2,
  },
  uploadImageView:{
    flexDirection:'row', 
    alignItems:'center', 
    justifyContent:'space-between', 
    backgroundColor:'#fff', 
    borderRadius:10, 
    paddingVertical:10,
    paddingHorizontal:20,
    shadowColor: '#000000',
    shadowOffset: {
      width:0,
      height:3
    }, 
    shadowRadius: 5,
    shadowOpacity: 0.03,
    elevation: 1,
  },
  imageView:{
    justifyContent:'center', 
    alignItems:'center', 
    backgroundColor:'#F8F8F8', 
    padding:10, 
    width: 60, 
    height:60, 
    borderRadius:30,
  },
  imageText:{
    fontSize:14, 
    fontWeight:'500', 
    color:'#455A64', 
    marginLeft:10
  }
});
export default PeopleCreatePost 