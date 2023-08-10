import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  ActivityIndicator
} from "react-native";
import HomeHeader from "../../../component/HomeHeader";
import SearchInput2 from "../../../component/SearchInput2";
// import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from "../../../utility/Mycolors";
import MyButtons from "../../../component/MyButtons";

import LinearGradient from "react-native-linear-gradient";
// import Toast from 'react-native-simple-toast';
import Loader from "../../../WebApi/Loader";
import VideoPlayer from "react-native-video-player";

import { VideoModel } from "../../../component/VideoModel";
import { launchCamera, launchImageLibrary } from "react-native-image-picker";
import Toast from "react-native-toast-message";
import MyAlert from "../../../component/MyAlert";
import moment from "moment";
import { createThumbnail } from "react-native-create-thumbnail";
import { useSelector } from "react-redux";
import { TextInput } from "react-native-paper";
import { requestPostApi, game } from "../../../WebApi/Service";
import axios from "axios";
import Animated from "react-native-reanimated";
import { CommonActions } from "@react-navigation/native";
import DocumentPicker from "react-native-document-picker";
import Video from 'react-native-video';

const VideoUpload = (props) => {
  const User = useSelector((state) => state.user.user_details);
  const [videoTitle, setVideoTitle] = useState(
    props.route.params?.type == "add" ? "" : props.route.params?.data?.name
  );
  const [selectedCategory, setSelectedCategory] = useState(
    props.route.params?.type == "add"
      ? null
      : props.route.params?.data?.category_id
  );
  const [videoDecs, setVideoDesc] = useState(
    props.route.params?.type == "add"
      ? ""
      : props.route.params?.data?.description
  );
  const [loading, setLoading] = useState(false);
  const [thumbnail, setThumbnail] = useState({});
  const [pick, setpick] = useState(props.route.params?.type == "add" ? [] : [{uri: props.route.params?.data.file}]);
  const [filepath, setfilepath] = useState(null);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");
  const scrollX = React.useRef(new Animated.Value(0)).current;
  const isAutoScrolling = React.useRef(true);
  const activeIndex = React.useRef(0);
  const flatListRef = React.useRef(null);

  const [courseData, setCourseData] = useState(props.route.params.courseData);
  //     {
  //       id: "1",
  //       title: "Sandbox",
  //       desc: "",
  //       time: "",
  //       img: require("../../../assets/images/Sandboximage.png"),
  //     },
  //     {
  //       id: "2",
  //       title: "Battle Games",
  //       desc: "",
  //       time: "",
  //       img: require("../../../assets/images/BattleGames.png"),
  //     },
  //     {
  //       id: "3",
  //       title: "Puzzlers",
  //       desc: "",
  //       time: "",
  //       img: require("../../../assets/images/Puzzlers.png"),
  //     },
  //     {
  //       id: "4",
  //       title: "Sandbox",
  //       desc: "",
  //       time: "",
  //       img: require("../../../assets/images/Sandboximage.png"),
  //     },
  //     {
  //       id: "5",
  //       title: "Battle Games",
  //       desc: "",
  //       time: "",
  //       img: require("../../../assets/images/BattleGames.png"),
  //     },
  //   ]);
  const [videoOpacity, setVideoOpacity] = useState(1)
  
  props.route.params?.type == "edit" &&
    useEffect(() => {
      const index = props.route.params.courseData?.findIndex(
        (el) => el.id === props.route.params?.data?.category_id
      );
      console.log("index", index);
      startAutoScroll(index);
    }, []);
  const generateThumb = async (path) => {
    console.log("generateThumb path", path);
    try {
      const thumb = await createThumbnail({
        url: path,
        timeStamp: 1000,
      });
      console.log("thumb", thumb);
      // const updatedThumb  = {...thumb, path: thumb.path + '.' + thumb.mime?.split('/')[1]}
      // console.log("thumb", updatedThumb);
      setThumbnail(thumb);
    } catch (error) {
      console.log("error creating thumbnail", error);
    }
  };
  const startAutoScroll = (toIndex) => {
    if (props.route.params.courseData.length > 0) {
      isAutoScrolling.current = true;
      activeIndex.current = toIndex;
      if (activeIndex.current > props.route.params.courseData.length - 1) {
        activeIndex.current = 0;
      }
      flatListRef?.current?.scrollToIndex({
        animated: true,
        index: activeIndex.current,
        viewPosition: 0.5,
      });
    }
  };
  const resetIndexGoToHome = CommonActions.reset({
    index: 1,
    routes: [{ name: "VideoGameHome" }],
  });
  const Validation = () => {
    if (selectedCategory === null) {
      Toast.show({ text1: "Please choose Category" });
      return false;
    } 
    else if (videoTitle?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter Video Title" });
      return false;
    } 
    else if (videoDecs?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter Video Description" });
      return false;
    } else if (typeof pick !== "object" || Object.keys(pick)?.length === 0) {
      Toast.show({ text1: "Please upload Video" });
      return false;
    }
    return true;
  };
  const onUpload = async () => {
    if (!Validation()) {
      return;
    }
    const formdata = new FormData();
    formdata.append(`category_id`, selectedCategory);
    formdata.append(`name`, videoTitle);
    formdata.append(`published_date`, moment().format("YYYY-MM-DD hh:mm:ss"));
    formdata.append(`created_date`, moment().format("YYYY-MM-DD hh:mm:ss"));
    formdata.append(`published_channel`, props.route.params?.type == "edit" ? props.route.params?.data?.published_channel : "kids");
    formdata.append(`description`, videoDecs);
    if(props.route.params?.type == "add"){
      formdata.append(`files`, {
        name: pick[0].name,
        type: pick[0].type,
        uri: pick[0].uri,
      });
      formdata.append(`image`, {
        name: thumbnail.path.slice(
          thumbnail.path.lastIndexOf("/"),
          thumbnail.path.length
        ),
        uri: thumbnail.path,
        type: thumbnail.mime,
      });
    }
    formdata.append(`status`, "1");
    console.log("onUpload formdata", formdata);
    setLoading(true);
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${User.token}`,
    };
    let url = "http://54.153.75.225/backend/api/v1/" + game;
    if (props.route.params?.type == "edit") {
      url += "/id/" + props.route.params?.data?.id;
    }
    console.log("onUpload url", url);
    try {
      const response = await fetch(url, {
        method: props.route.params?.type == "edit" ? 'PUT' : "POST",
        headers,
        body: formdata,
      });
      const responseJson = await response.json();
      console.log("onUpload responseJson", responseJson);
      if (responseJson?.headers?.success == 1) {
        if (props.route.params?.type == "edit") {
          props.navigation.dispatch(resetIndexGoToHome);
        } else {
          props.navigation.goBack();
        }
        Toast.show({ text1: responseJson?.headers?.message });
      } else {
        Toast.show({ text1: responseJson?.headers?.message });
      }
    } catch (error) {
      Toast.show({ text1: "Network type error" });
      console.log("Error uploading data:", error);
    }
    setLoading(false);
  };
  const handleVideoUpload = async () => {
    try {
      const res = await DocumentPicker.pick({
        type: [DocumentPicker.types.video],
      });
      // The selected video can be accessed using 'res.uri'
      console.log("Selected Video URI:", res[0].uri);
      setpick(res);
      generateThumb(res[0].uri);
    } catch (err) {
      if (DocumentPicker.isCancel(err)) {
        // User canceled the picker
        console.log("User canceled video picker");
      } else {
        // Error occurred while picking the video
        console.log("Error picking video:", err);
      }
    }
  };
  const openLibrary = async () => {
    let options = {
      title: "Select Video",
      mediaType: "video",
      customButtons: [
        {
          name: "customOptionKey",
          title: "Choose Photo from Custom Option",
        },
      ],
      //   maxWidth: 500,
      //   maxHeight: 500,
      storageOptions: {
        skipBackup: true,
        path: "images",
      },
    };

    launchImageLibrary(options, (image) => {
      if (!image.didCancel) {
        console.log("image", image);
        console.log("the ddd==", image.assets[0].uri);
        var photo = {
          // uri: image.assets[0].uri,
          uri: image.assets[0].uri + "." + image.assets[0].type?.split("/")[1],
          type: image.assets[0].type,
          name: image.assets[0].fileName,
        };
        console.log("photo", photo);
        setpick(photo);
        setfilepath(image);
        generateThumb(image.assets[0].uri);
        // Toast.show({ text1: "Video added successfully" });
      }
    });
  };
  const onLoadStart = () => {
    setVideoOpacity(1)
  }
  
  const onLoad = () => {
    setVideoOpacity(0)
  }
  
  const onBuffer = ({isBuffering}) => {
    setVideoOpacity(isBuffering ? 1 : 0)
  }

  return (
    <SafeAreaView
      style={{
        backgroundColor: "#000",
        height: (dimensions.SCREEN_HEIGHT * 100) / 100,
        width: "100%",
      }}
    >
      <ScrollView>
        <View
          style={{
            backgroundColor: "#fff",
            height: (dimensions.SCREEN_HEIGHT * 28) / 100,
            width: "100%",
          }}
        >
          <ImageBackground
            source={require("../../../assets/images/Gamewallpaper.png")}
            style={{ width: "100%", height: "100%", overflow: "hidden" }}
            resizeMode="stretch"
          >
            <HomeHeader
              height={60}
              paddingHorizontal={15}
              press1={() => {
                props.navigation.goBack();
              }}
              img1={require("../../../assets/service-header-back-button.png")}
              img1width={30}
              img1height={30}
              img1backgroundColor={"transparent"}
              img1padding={5}
              img1borderRadius={4}
              press2={() => {}}
              title2={`${
                props.route.params.type == "add" ? "Add" : "Update"
              } Game Video`}
              fontWeight={"bold"}
              img2height={20}
              color={Mycolors.BG_COLOR}
              press3={() => {}}
              img3width={25}
              img3height={25}
            />
          </ImageBackground>
        </View>
        <View
          style={{
            width: "96%",
            alignItems: "flex-start",
            alignSelf: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            top: -130,
          }}
        >
          <Text style={{ color: "#FFFFFF", fontSize: 18, fontWeight: "600" }}>
            Choose Category
          </Text>
        </View>

        <View style={{ width: "90%", alignSelf: "center" }}>
          <View
            style={{
              width: dimensions.SCREEN_WIDTH * 0.99,
              alignSelf: "flex-start",
              marginTop: 0,
              marginBottom: 10,
              top: -130,
            }}
          >
            <Animated.FlatList
              ref={flatListRef}
              data={courseData}
              showsHorizontalScrollIndicator={true}
              horizontal
              onScroll={Animated.event(
                [{ nativeEvent: { contentOffset: { x: scrollX } } }],
                { useNativeDriver: false }
              )}
              initialScrollIndex={activeIndex.current}
              onScrollToIndexFailed={(info) => {
                const wait = new Promise((resolve) => setTimeout(resolve, 500));
                wait.then(() => {
                  flatListRef.current?.scrollToIndex({
                    index: info.index,
                    animated: true,
                  });
                });
              }}
              keyExtractor={(item) => item.id}
              renderItem={({ item, index }) => {
                return (
                  <LinearGradient
                    colors={[
                      "rgba(255, 255, 255, 1)",
                      "rgba(249, 249, 249, 1)",
                    ]}
                    style={{
                      width: dimensions.SCREEN_WIDTH / 3.2,
                      marginRight: 10,
                      borderRadius: 15,
                      shadowColor: "#000",
                      shadowOffset: { width: 0, height: 3 },
                      shadowRadius: 1,
                      shadowOpacity: 0.03,
                      elevation: 1,
                    }}
                  >
                    <TouchableOpacity
                      style={{
                        width: dimensions.SCREEN_WIDTH / 3.2,
                        height: 130,
                        alignItems: "center",
                        borderRadius: 15,
                        paddingHorizontal: 10,
                        justifyContent: "center",
                        overflow: "hidden",
                        position: "relative",
                      }}
                      onPress={() => {
                        if (props.route.params?.type == "edit") {
                          Toast.show({
                            text1: `While editing video, category cannot be changed`,
                          });
                          return;
                        }
                        setSelectedCategory(item.id);
                      }}
                    >
                      <LinearGradient
                        colors={["rgba(0, 0, 0, 0)", "rgba(0, 0, 0, 0.43)"]}
                        style={{
                          position: "absolute",
                          top: -3,
                          bottom: 0,
                          left: 0,
                          right: -5,
                          zIndex: 1,
                        }}
                      >
                        {selectedCategory === item.id ? (
                          <View
                            style={{
                              flex: 1,
                              flexDirection: "column",
                              borderColor:
                                selectedCategory === item.id ? "red" : "white",
                              borderWidth: 1,
                            }}
                          >
                            <Image
                              source={require("../../../assets/Video-selected-category-check-circle.png")}
                              style={{
                                alignSelf: "flex-end",
                                top: 10,
                                right: 10,
                              }}
                            />
                          </View>
                        ) : null}
                      </LinearGradient>

                      <Image
                        source={{ uri: item.image }}
                        style={{ width: 75, height: 75 }}
                        resizeMode="contain"
                      ></Image>

                      <Text
                        style={{
                          fontSize: 13,
                          fontWeight: "500",
                          color: "#263238",
                          marginTop: 5,
                          textAlign: "center",
                        }}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  </LinearGradient>
                );
              }}
            />
          </View>

          <View
            style={{
              width: "100%",
              alignItems: "center",
              justifyContent: "flex-start",
              top: -128,
            }}
          >
            <View style={styles.BoxView}>
              <TextInput
                mode="flar"
                label="Video Title"
                theme={{ colors: { primary: "#ED1C24" } }}
                underlineColor="red"
                underlineColorAndroid="black"
                textColor="black"
                value={videoTitle}
                topPosition={10}
                onChangeText={(text) => {
                  setVideoTitle(text);
                }}
                style={[styles.input, { width: "100%" }]}
                multiline
              />
            </View>

            <View
              style={{
                width: "93%",
                height: 100,
                borderRadius: 5,
                marginTop: 10,
                alignSelf: "center",
                // backgroundColor: "#fff",
              }}
            >
              <TextInput
                mode="flat"
                label="Video Description"
                underlineColor="yellow"
                theme={{ colors: { primary: "#ED1C24" } }}
                underlineColorAndroid="transparent"
                value={videoDecs}
                textAlignVertical="top"
                textColor="black"
                onChangeText={(e) => setVideoDesc(e)}
                multiline={true}
                // maxLength={500}
                // keyboardType="number-pad"
                autoCapitalize="none"
                style={[styles.inputDesc]}
              />
            </View>
          </View>
          {props.route.params?.type == "add" ? 
          <TouchableOpacity
            style={styles.uploadButtonView}
            onPress={() => {
              handleVideoUpload();
              // openLibrary();
            }}
          >
            <Image
              source={require("../../../assets/upload-button-white.png")}
            />
            <Text
              style={{
                fontSize: 14,
                fontWeight: "500",
                color: "#FFFFFF",
                marginLeft: 10,
              }}
            >
              {pick?.length > 0
                ? "Change "
                : "Upload "}
              Video
            </Text>
          </TouchableOpacity>
          :null}
          {/* {console.log('pick[0]?.uri', pick[0]?.uri)} */}
          {pick?.length > 0 ? (
            <View
              style={{
                height: 70,
                width: 80,
                position: "relative",
                marginRight: 29,
                marginTop: 22,
                alignSelf:'center',
                marginTop: props.route.params?.type == "add" ? 22 : -100
              }}
            >
              <Video
                source={{ uri: pick[0].uri }}
                style={{ width: 90, height: 90 }}
                resizeMode="cover"
                onBuffer={onBuffer}
                onLoadStart={onLoadStart}
                onLoad={onLoad}
              />
              <ActivityIndicator
                animating
                size="large"
                color={'white'}
                style={[styles.activityIndicator, {opacity: videoOpacity}]}
              />
              {props.route.params?.type == "add" ? 
              <TouchableOpacity
                onPress={() => {
                  setpick([])
                  Toast.show({ text1: "Video has been deleted" });
                }}
                style={styles.deleteButtonn}
              >
                <Image
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: 10,
                    left: 78,
                    alignItems: "center",
                    backgroundColor: "white",
                    top: -98,
                  }}
                  source={require("../../../assets/cutRed.png")}
                />
              </TouchableOpacity>
              :null}
            </View>
          ) : null}
        </View>
        <View style={{ height: 40 }} />
        <View
          style={{
            width: "85%",
            height: 60,
            flexDirection: "row",
            justifyContent: "space-between",
            alignSelf: "center",
          }}
        >
          <MyButtons
            title={props.route.params?.type == "edit" ? 'Update' : "Save"}
            height={50}
            width={"100%"}
            borderRadius={5}
            press={onUpload}
            fontSize={13}
            titlecolor={Mycolors.BG_COLOR}
            marginVertical={0}
            backgroundColor={"#ED1C24"}
          />
        </View>
      </ScrollView>
      {My_Alert ? (
        <MyAlert
          sms={alert_sms}
          okPress={() => {
            setMy_Alert(false);
          }}
        />
      ) : null}
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  VideoThumbWrapper: {
    position: "relative",
    // width: '48%',
    // marginRight: 8,
    marginBottom: 4,

    width: dimensions.SCREEN_WIDTH / 2.3,
    height: 190,
    marginRight: 16,
    borderRadius: 15,
    // shadowColor:'#000',
    // shadowOffset: {width: 0,height: 3},
    // shadowRadius: 1,
    // shadowOpacity: 0.03,
    // elevation: 1,
  },
  PlayIconContainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    zIndex: 1,
  },
  PlayIconWrapper: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  BackGroundImage: {
    backgroundColor: "gray",
    width: "100%",
    height: 190,
    justifyContent: "center",
    borderRadius: 15,
  },
  BoxView: {
    marginTop: 15,
    width: "93%",
    height: 60,
    paddingVertical: 10,
    // backgroundColor: "#fff",
    // padding:15,
    // flexDirection: 'row',
    marginHorizontal: 15,
    alignItems: "center",
    borderRadius: 5,
    justifyContent: "center",
    // shadowColor: '#000',
    // shadowOffset: {
    //   width: 0,
    //   height: 3
    // },
    // shadowRadius: 1,
    // shadowOpacity: 0.3,
    // elevation: 5,
  },
  input: {
    // paddingLeft: 20,
    fontSize: 13,
    fontWeight: "400",
    color: "#000",
  },
  inputDesc: {
    // paddingLeft: 20,
    width: "100%",
    fontSize: 13,
    color: "#fff",
    height: 100,
  },
  uploadButtonView: {
    marginTop: -100,
    height: 50,
    width: "92%",
    alignSelf: "center",
    backgroundColor: "#302e2e",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFFFFF",
    borderStyle: "dashed",
    borderRadius: 5,

    // shadowColor: '#000',
    // shadowOffset: {
    // width:0,
    // height:3
    // },
    // shadowRadius: 5,
    // shadowOpacity: 0.10,
    // elevation: 5,
  },
  deleteButtonn: {
    width: 20,
    height: 20,
    borderRadius: 10,
    right: -12,
    alignItems: 'center',
    backgroundColor: 'white',
    top: 1,
  },
  activityIndicator: {
    position: 'absolute',
    top: 70,
    left: 70,
    right: 70,
    height: 50,
},
});
export default VideoUpload;
