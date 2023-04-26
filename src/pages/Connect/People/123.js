// //import :react components
// import React, { useRef, useState } from 'react';
// import {
//   View,
//   KeyboardAvoidingView,
//   Platform,
//   ScrollView,
//   TouchableOpacity,
//   Alert,
//   Keyboard,
//   PermissionsAndroid,
//   Image
// } from 'react-native';
// //import : custom components
// import SearchLocation from 'modals/SearchLocation/SearchLocation';
// import MyButton from 'components/MyButton/MyButton';
// import MyHeader from 'components/MyHeader/MyHeader';
// import MyText from 'components/MyText/MyText';
// import MyTextInput from 'components/MyTextInput/MyTextInput';
// import TextInputWithFlag from 'components/TextInputWithFlag/TextInputWithFlag';
// import DateSelector from 'components/DateSelector/DateSelector';
// import CustomLoader from 'components/CustomLoader/CustomLoader';
// import SelectAddress from 'modals/SelectAddress/SelectAddress';
// import SelectImageSource from 'modals/SelectImageSource/SelectImageSource';
// //import : third parties
// import {GooglePlacesAutocomplete} from 'react-native-google-places-autocomplete';
// import Toast from 'react-native-simple-toast';
// import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import moment from 'moment';
// import DatePicker from 'react-native-date-picker';
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import CountryPicker from 'react-native-country-codes-picker';
// import Geolocation from 'react-native-geolocation-service';
// import Geocoder from 'react-native-geocoding';
// //import : globals
// import { Colors, Constant, MyIcon, ScreenNames, Service } from 'global/Index';
// //import : styles
// import { styles } from './EditProfileStyle';
// //import : redux
// import { connect, useDispatch, useSelector } from 'react-redux';
// import { setUser } from 'src/reduxToolkit/reducer/user';
// import { showToast } from 'src/reduxToolkit/reducer/customToast';

// const EditProfile = ({ navigation }) => {
//   Geocoder.init('AIzaSyBJqbxRoFBbpmwDrHOtVM26s9R1Fh5UWp0');
//   const GOOGLE_MAPS_APIKEY = 'AIzaSyACzgsZq8gI9VFkOw_fwLJdmezbc4iUxiM';
//   //ref
//   const firstNameRef = useRef();
//   const lastNameRef = useRef();
//   const emailAddressRef = useRef();
//   const phoneNumberRef = useRef();
//   const addressRef = useRef();
//   //variables : redux variables
//   const dispatch = useDispatch();
//   const userInfo = useSelector(state => state.user.userInfo);
//   const userToken = useSelector(state => state.user.userToken);
//   //states
//   const [firstName, setFirstName] = useState(userInfo.first_name ? userInfo.first_name : '');
//   const [lastName, setLastName] = useState(userInfo.last_name ? userInfo.last_name : '');
//   const [emailAddress, setEmailAddress] = useState('');
//   const [phoneNumber, setPhoneNumber] = useState(userInfo.phone ? userInfo.phone : '');
//   const [filePath, setFilePath] = useState('');
//   const [gender, setGender] = useState(userInfo.gender ? userInfo.gender : 1);
//   const [date, setDate] = useState(
//     userInfo.dob ? new Date(userInfo.dob) : new Date(),
//   );
//   const [oldAddress, setOldAddress] = useState(userInfo.location ? userInfo.location : '');
//   const [address, setAddress] = useState('');
//   const [latLng, setLatLng] = useState({lat:userInfo.lat, lng:userInfo.long});
//   const [showSelectAddress, setShowSelectAddress] = useState(false);
//   const [allCurrentLocations, setAllCurrentLocations] = useState([]);
//   //hook : states : modal states
//   const [open, setOpen] = useState(false);
//   const [showLoader, setShowLoader] = useState(false);
//   const [show, setShow] = useState(false);
//   const [selectedCountry, setSelectedCountry] = useState({dial_code: userInfo.country_code, flag: userInfo.country_flag });
//   const [showImageSourceModal, setShowImageSourceModal] = useState(false);
//   const [showLocationModal, setShowLocationModal] = useState(false);
//   //function : navigation function
//   const gotoProfile = () => navigation.navigate(ScreenNames.USER_PROFILE);
//   //function : imp function
//   const openLibrary = () => {
//     let options = {
//       title: 'Select Image',
//       customButtons: [
//         {
//           name: 'customOptionKey',
//           title: 'Choose Photo from Custom Option',
//         },
//       ],
//       storageOptions: {
//         skipBackup: true,
//         path: 'images',
//       },
//     };
//     launchImageLibrary(options, response => {
//       if (response.didCancel) {
//         // Alert.alert('User cancelled camera picker');
//         setShowImageSourceModal(false)
//         Alert.alert('User cancelled picking image');
//         return;
//       } else if (response.errorCode == 'camera_unavailable') {
//         setShowImageSourceModal(false)
//         Alert.alert('Camera not available on device');
//         return;
//       } else if (response.errorCode == 'permission') {
//         setShowImageSourceModal(false)
//         Alert.alert('Permission not satisfied');
//         return;
//       } else if (response.errorCode == 'others') {
//         setShowImageSourceModal(false)
//         Alert.alert(response.errorMessage);
//         return;
//       } else {
//         setFilePath(response.assets[0]);
//       }
//       setShowImageSourceModal(false)
//     });
//   };
//   //function : imp function
//   const openCamera = ()=>{
//     const options= {
//       width: 1080,
//         height: 1080,
//         cropping: true,
//         mediaType: 'photo',
//         compressImageQuality: 1,
//         compressImageMaxHeight: 1080 / 2,
//         compressImageMaxWidth: 1080 / 2,
//     }
//     launchCamera(options, response => {
//       if (response.didCancel) {
//         // Alert.alert('User cancelled camera picker');
//         setShowImageSourceModal(false)
//         Alert.alert('User cancelled picking image');
//         return;
//       } else if (response.errorCode == 'camera_unavailable') {
//         setShowImageSourceModal(false)
//         Alert.alert('Camera not available on device');
//         return;
//       } else if (response.errorCode == 'permission') {
//         setShowImageSourceModal(false)
//         Alert.alert('Permission not satisfied');
//         return;
//       } else if (response.errorCode == 'others') {
//         setShowImageSourceModal(false)
//         Alert.alert(response.errorMessage);
//         return;
//       }
//       console.log('Response = ', response.assets[0]);
//       setFilePath(response.assets[0]);
//       setShowImageSourceModal(false)
//     });
//   }
//   //function : imp function
//   const checkCameraPermission = async () => {
//     if (Platform.OS === 'ios') {
//       openCamera();
//     } else {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.CAMERA,
//           {
//             title: 'Storage Permission Required',
//             message:
//               'Application needs access to your storage to access camera',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           openCamera();
//           console.log('Storage Permission Granted.');
//         } else {
//           Alert.alert('Error', 'Storage Permission Not Granted');
//         }
//       } catch (err) {
//         // To handle permission related exception
//         console.log('ERROR' + err);
//       }
//     }
//   };

  
//   //function : imp function
//   const Validation = () => {
//     if (phoneNumber !== '' && phoneNumber?.length < 10) {
//       Alert.alert('', 'Phone number should be 10 digits long');
//     } else return true;
//   };
//   //function : service function
//   const editProfile = async () => {
//     if (Validation()) {
//       setShowLoader(true);
//       const editProfileData = new FormData();
//       editProfileData.append(
//         'first_name',
//         firstName == '' ? userInfo.first_name : firstName,
//       );
//       editProfileData.append(
//         'last_name',
//         lastName == '' ? userInfo.last_name : lastName,
//       );
//       editProfileData.append(
//         'phone',
//         phoneNumber == '' ? userInfo.phone : phoneNumber,
//       );
//       editProfileData.append('email', userInfo.email);
//       editProfileData.append('country_code', selectedCountry.dial_code);
//       editProfileData.append('country_flag', selectedCountry.flag);
//       editProfileData.append('dob', moment(date).format('YYYY-MM-DD'));
//       editProfileData.append('latitude', latLng.lat);
//       editProfileData.append('longtitude', latLng.lng);
//       if (filePath != '') {
//         const imageName = filePath.uri.slice(
//           filePath.uri.lastIndexOf('/'),
//           filePath.uri.length,
//         );
//         editProfileData.append('profile_image', {
//           name: imageName,
//           type: filePath.type,
//           uri: filePath.uri,
//         });
//       }  
//       address?.trim()?.length > 0 && editProfileData.append('address', address);
//       editProfileData.append('gender', gender);
//       console.log('user edit editProfileData', editProfileData);
//       console.log('user userToken', userToken);
//       try {
//         const resp = await Service.postApiWithToken(
//           userToken,
//           Service.UPDATE_PROFILE,
//           editProfileData,
//         );
//         console.log('resp', resp);
//         if (resp.data.status) {
//           // console.warn('resp-->', resp.data.data);
//           const jsonValue = JSON.stringify(resp.data.data);
//           console.log('user edit jsonValue', jsonValue);
//           await AsyncStorage.setItem('userInfo', jsonValue);
//           dispatch(setUser(resp.data.data));
//           // dispatch(showToast({ text: resp.data.message, duration: 2000 }));
//           Toast.show(resp.data.message, Toast.SHORT)
//           // Alert.alert('', resp.data.message);
//           gotoProfile();
//         } else {
//           // Alert.alert('', resp.data.message);
//           Toast.show(resp.data.message, Toast.SHORT)
//         }
//       } catch (error) {
//         console.log('error in editProfile', error);
//       }
//       setShowLoader(false);
//     }
//   };
//   const requestLocationPermission = async () => {
//     if (Platform.OS === 'android') {
//       try {
//         const granted = await PermissionsAndroid.request(
//           PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
//           {
//             title: 'Location Access Required',
//             message: 'This App needs to Access your location',
//           },
//         );
//         if (granted === PermissionsAndroid.RESULTS.GRANTED) {
//           getCurrentLocation();
//         } else {
//           Alert.alert('', 'Location permission denied');
//         }
//       } catch (err) {
//         console.warn(err);
//       }
//     }
//   };
//   const getCurrentLocation = () => {
//     setShowLoader(true);
//     try {
//       Geolocation.getCurrentPosition(
//         position => {
//           Geocoder.from(position.coords.latitude, position.coords.longitude)
//             .then(json => {
//               if (json.status == 'OK') {
//                 // setAllCurrentLocations(json.results);
//                 var addressComponent = json.results[0].formatted_address;
//                 setAddress(json.results[0].formatted_address)
//                 setLatLng(json.results[0].geometry.location)
//                 setShowLocationModal(true)
//                 console.log(addressComponent);
//                 setShowLoader(false);
//                 // setShowSelectAddress(true);
//               }
//             })
//             .catch(error => console.warn(error));
//         },
//         error => {
//           setShowLoader(false);
//           // See error code charts below.
//           console.log(error.code, error.message);
//         },
//         { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
//       );
//     } catch (error) {
//       setShowLoader(false);
//       console.log('error in updateLocation', error);
//     }
//   };
//   //UI
//   return (
//     <View style={styles.container}>
//       <MyHeader Title="Edit Profile" />
//       <KeyboardAvoidingView
//         style={styles.container}
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
//         <ScrollView
//           keyboardShouldPersistTaps='always'
//           contentContainerStyle={{ paddingBottom: 40 }}
//           style={styles.mainView}>
//           {filePath == '' ? (
//             // <TouchableOpacity onPress={chooseFile} style={styles.uploadProfile}>
//             //   <MyText
//             //     text={
//             //       filePath == '' ? 'Upload Profile Picture' : filePath.fileName
//             //     }
//             //     style={{
//             //       width: '85%',
//             //     }}
//             //   />
//             //   <MyIcon.AntDesign
//             //     name="upload"
//             //     size={20}
//             //     color={Colors.THEME_GREEN}
//             //   />
//             // </TouchableOpacity>
//             <View style={styles.imageViewStyle}>
//               <Image
//                 resizeMode="cover"
//                 borderRadius={100}
//                 source={(userInfo.profile_image == "" || userInfo.profile_image == `${Service.BASE_URL.replace('api/','')}public`) ? require('assets/images/profile_pic.png') : {uri: userInfo.profile_image}}
//                 style={{
//                   height: '100%',
//                   width: '100%',
//                 }}
//               />
//               <TouchableOpacity
//                 // onPress={chooseFile}
//                 onPress={()=>{setShowImageSourceModal(true)}}
//                 style={styles.addButtonStyle}>
//                 <MyIcon.AntDesign
//                   name="plus"
//                   color={Colors.THEME_GREEN}
//                   size={24}
//                 />
//               </TouchableOpacity>
//             </View>
//           ) : (
//             <View style={styles.imageViewStyle}>
//               <Image
//                 resizeMode="cover"
//                 borderRadius={100}
//                 source={{uri: filePath.uri}}
//                 style={{height: '100%', width: '100%'}}
//               />
//               <TouchableOpacity
//                 onPress={() => setFilePath('')}
//                 style={styles.deleteButtonStyle}>
//                 <MyIcon.MaterialIcons
//                   name="delete"
//                   color={Colors.RED}
//                   size={24}
//                 />
//               </TouchableOpacity>
//             </View>
//           )}
//           <MyTextInput
//             inputRef={firstNameRef}
//             Title="First Name"
//             placeholder={
//               'Enter First Name'
//             }
//             value={firstName}
//             onChangeText={text => setFirstName(text)}
//             onSubmitEditing={() => lastNameRef.current.focus()}
//           />
//           <MyTextInput
//             inputRef={lastNameRef}
//             Title="Last Name"
//             placeholder={'Enter Last Name'}
//             value={lastName}
//             onChangeText={text => setLastName(text)}
//             onSubmitEditing={() => emailAddressRef.current.focus()}
//           />
//           <MyTextInput
//             inputRef={emailAddressRef}
//             Title="Email Address"
//             placeholder={
//               userInfo.email ? userInfo.email : 'Enter Email Address'
//             }
//             editable={false}
//             onChangeText={text => setEmailAddress(text)}
//             onSubmitEditing={() => phoneNumberRef.current.focus()}
//             Icon={
//               <MyIcon.AntDesign
//                 name="checkcircleo"
//                 size={24}
//                 color={Colors.THEME_GREEN}
//               />
//             }
//           />
//           <TextInputWithFlag
//             inputRef={phoneNumberRef}
//             value={phoneNumber}
//             Flag={selectedCountry.flag ? selectedCountry.flag : userInfo.country_flag}
//             CountryCode={selectedCountry.dial_code ? selectedCountry.dial_code: userInfo.country_code}
//             placeholder={'Enter phone number'}
//             // placeholderTextColor={Colors.BLACK}
//             onPress={() => setShow(true)}
//             onChangeText={text => setPhoneNumber(text)}
//             onSubmitEditing={() => Keyboard.dismiss()}
//             keyboardType="number-pad"
//             maxLength={10}
//           />
//           <MyText text="Gender" fontFamily="bold" />
//           <View style={styles.genderView}>
//             {Constant.Gender.map((item, index) => {
//               return (
//                 <TouchableOpacity
//                   onPress={() => setGender(index + 1)}
//                   key={item.id.toString()}
//                   style={{
//                     flexDirection: 'row',
//                     alignItems: 'center',
//                   }}>
//                   <MyIcon.Ionicons
//                     name={
//                       gender == index + 1
//                         ? 'radio-button-on'
//                         : 'radio-button-off'
//                     }
//                     color={Colors.THEME_GREEN}
//                     size={24}
//                   />
//                   <MyText text={item.name} />
//                 </TouchableOpacity>
//               );
//             })}
//           </View>
//           <MyText text="Birthdate" fontFamily="bold" />
//           <DateSelector
//             Title={
//               moment(date).format('YYYY-MM-DD') ==
//                 moment(new Date()).format('YYYY-MM-DD')
//                 ? 'Select Date'
//                 // : moment(date).format('MMMM Do YYYY')
//                 : moment(date).format('DD-MM-YYYY')
//             }
//             onPress={() => setOpen(true)}
//           />
//           <MyText text="Location" fontFamily="bold" marginBottom={10} />
//           {/* <TouchableOpacity
//             onPress={requestLocationPermission}
//             style={{
//               backgroundColor: Colors.WHITE,
//               flexDirection: 'row',
//               alignItems: 'center',
//               justifyContent: 'center',
//               shadowColor: '#000',
//               shadowOffset: { width: 0, height: 2 },
//               shadowOpacity: 0.1,
//               elevation: 2,
//               padding: 10,
//               borderRadius: 10,
//             }}>
//             <MyIcon.FontAwesome5 name="map-marker-alt" size={20} />
//             <MyText
//               text="Change Location"
//               marginHorizontal={10}
//               fontFamily="bold"
//             />
//           </TouchableOpacity>
//           <MyTextInput
//             inputRef={addressRef}
//             value={address}
//             placeholder={
//               // (userInfo.location == '' || userInfo.location == null)  ? 'Enter Address' : userInfo.location
//               userInfo.location
//             }
//             multiline={true}
//             onChangeText={text => setAddress(text)}
//             onSubmitEditing={() => passwordRef.current.focus()}
//           /> */}
//           <GooglePlacesAutocomplete
//             placeholder={oldAddress}
//             textInputProps={{
//               // placeholderTextColor: '#c9c9c9',
//               placeholderTextColor: Colors.LITE_GREY,
//               returnKeyType: 'search',
//               // onFocus: () => setShowPlacesList(true),
//               // onBlur: () => setShowPlacesList(false),
//               multiline:true,
//               // onTouchStart: ()=>{downButtonHandler()}
//               height:55,
//             }}
//             enablePoweredByContainer={false}
//             listViewDisplayed={'auto'}
//             styles={styles.searchbar}
//             onPress={(data, details = null) => {
//               // 'details' is provided when fetchDetails = true
//               // setShowPlacesList(false)
//               setLatLng({
//                 lat: details.geometry.location.lat,
//                 lng: details.geometry.location.lng,
//               });
//               setAddress(data?.description);
//             }}
//             GooglePlacesDetailsQuery={{
//               fields: 'geometry',
//             }}
//             fetchDetails={true}
//             query={{
//               key: GOOGLE_MAPS_APIKEY,
//               language: 'en',
//             }}
//           />
//           {/* <MyText text={"Current Location"} fontFamily="bold" marginBottom={10} marginTop={5}/>
//           <MyTextInput
//             inputRef={addressRef}
//             value={oldAddress}
//             placeholder={
//               // userInfo.location == '' ? 'Enter Address' : userInfo.location
//               userInfo.location
//             }
//             editable={false}
//             multiline={true}
//             onChangeText={text => setOldAddress(text)}
//             onSubmitEditing={() => passwordRef.current.focus()}
//           /> */}
//           {/* <View style={styles.birthDateView}>
//             <MyTextInput
//               inputRef={dobMonthRef}
//               Title="Month"
//               placeholder="00"
//               onChangeText={text => setDobMonth(text)}
//               onSubmitEditing={() => dobDateRef.current.focus()}
//               maxLength={2}
//               keyboardType="number-pad"
//               Icon={
//                 <MyIcon.AntDesign
//                   name="rightcircle"
//                   size={24}
//                   color={Colors.LITE_GREY}
//                 />
//               }
//               width="30%"
//             />
//             <MyTextInput
//               inputRef={dobDateRef}
//               Title="Date"
//               placeholder="00"
//               onChangeText={text => setDobDate(text)}
//               onSubmitEditing={() => dobYearRef.current.focus()}
//               maxLength={2}
//               keyboardType="number-pad"
//               Icon={
//                 <MyIcon.AntDesign
//                   name="rightcircle"
//                   size={24}
//                   color={Colors.LITE_GREY}
//                 />
//               }
//               width="30%"
//             />
//             <MyTextInput
//               inputRef={dobYearRef}
//               Title="Year"
//               placeholder="0000"
//               onChangeText={text => setDobYear(text)}
//               onSubmitEditing={() => Keyboard.dismiss()}
//               maxLength={4}
//               keyboardType="number-pad"
//               Icon={
//                 <MyIcon.AntDesign
//                   name="rightcircle"
//                   size={24}
//                   color={Colors.LITE_GREY}
//                 />
//               }
//               width="30%"
//             />
//           </View> */}
//           <View style={{ height: 20 }} />
//           <MyButton Title="Save" onPress={editProfile} />
//         </ScrollView>
//       </KeyboardAvoidingView>
//       <CustomLoader showLoader={showLoader} />
//       <DatePicker
//         modal
//         mode="date"
//         open={open}
//         date={date}
//         onConfirm={date => {
//           if (moment().diff(date, 'years', true) < 18) {
//             setOpen(false);
//             dispatch(
//               showToast({
//                 text: 'Your age must be at least 18 years',
//                 duration: 1000,
//               }),
//             );
//           } else {
//             setOpen(false);
//             setDate(date);
//           }
//         }}
//         onCancel={() => {
//           setOpen(false);
//         }}
//       />
//       <CountryPicker
//         show={show}
//         disableBackdrop={false}
//         style={styles.countrySilderStyle}
//         // when picker button press you will get the country object with dial code
//         pickerButtonOnPress={item => {
//           // console.warn('item', item);
//           // setCountryCode(item.dial_code);
//           setSelectedCountry(item);
//           setShow(false);
//         }}
//         placeholderTextColor={'#c9c9c9'}
//         color={Colors.BLACK}
//         onBackdropPress={() => setShow(false)}
//       />
//       <SelectAddress
//         visible={showSelectAddress}
//         setVisibility={setShowSelectAddress}
//         Addresses={allCurrentLocations}
//         setValue={setAddress}
//         setLatLng={setLatLng}
//       />
//       <SelectImageSource
//         visible={showImageSourceModal}
//         setVisibility={setShowImageSourceModal}
//         openLibrary={openLibrary}
//         openCamera={checkCameraPermission}
//       />
//       <SearchLocation
//         visible={showLocationModal}
//         setVisibility={setShowLocationModal}
//         setAddress={setAddress}
//         setLatLng={setLatLng}
//       />
//     </View>
//   );
// };

// export default EditProfile;