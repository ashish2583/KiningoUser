import React, { useEffect, useState, useRef } from "react";
import {
  View,
  Image,
  Text,
  StyleSheet,
  SafeAreaView,
  TextInput,
  FlatList,
  Alert,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
} from "react-native";
import HomeHeader from "../../../component/HomeHeader";
import SearchInput2 from "../../../component/SearchInput2";
// import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from "../../../utility/Mycolors";
import MyButtons from "../../../component/MyButtons";
import Modal from "react-native-modal";
// import Toast from 'react-native-simple-toast';
import Loader from "../../../WebApi/Loader";
import Search from "./components/Search";
import { useSelector } from "react-redux";
import { game_video, requestGetApi } from "../../../WebApi/Service";
import LinearGradient from "react-native-linear-gradient";
import { VideoModel } from "../../../component/VideoModel";

const AllVideos = (props) => {
  const User = useSelector((state) => state.user.user_details);
  const [loading, setLoading] = useState(false);
  const [searchValue, setsearchValue] = useState("");
  const [videoData, setVideoData] = useState("");
  const [showModal, setShowModal] = useState({ isVisible: false, data: null });
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    getGameVideo(searchValue);
  }, []);

  const getGameVideo = async (name) => {
    let endPoint = game_video;
    let dataObj = {};
    if (name != "") {
      dataObj.name = name;
    }
    console.log('dataObj', dataObj);
    if (Object.keys(dataObj)?.length > 0) {
      let i = 0;
      for (const [key, value] of Object.entries(dataObj)) {
        if ((i == 0)) {
          endPoint += '?'
        }else {
          endPoint += '&'
        }
        endPoint += `${key}=${value}`
        console.log(`${key}: ${value}`);
        i += 1;
      }
      // endPoint += objToQueryString(dataObj);
    }
    setLoading(true);
    const { responseJson, err } = await requestGetApi(
      endPoint,
      "",
      "GET",
      User.token
    );
    setLoading(false);
    console.log("getGameVideo responseJson", responseJson);
    if (responseJson.headers.success == 1) {
      setVideoData(responseJson.body?.data);
      //   Toast.show({ text1: responseJson.headers.message });
    } else {
      Toast.show({ text1: responseJson.headers.message });
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const toggleModal = (state) => {
    setShowModal({
      isVisible: state.isVisible,
      data: state.data,
    });
  };
  return (
    <SafeAreaView
      style={{
        backgroundColor: "#000",
        height: (dimensions.SCREEN_HEIGHT * 100) / 100,
        width: "100%",
      }}
    >
      <ScrollView>
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
          title2={"All Videos"}
          fontWeight={"bold"}
          img2height={20}
          color={Mycolors.BG_COLOR}
          press3={() => {}}
          img3width={25}
          img3height={25}
        />
        <Search
          searchIcon={require("../../../assets/Search-icon-red.png")}
          marginTop={10}
          placeholder={"Search video by title"}
          serchValue={searchValue}
          onChangeText={(e) => {
            console.log('onChangeText', e);
            setsearchValue(e?.text);
            getGameVideo(e?.text);
          }}
          press={() => {
            Alert.alert("Hi");
          }}
          presssearch={() => {
            Alert.alert("Search Pressed");
          }}
          paddingLeft={20}
        />
        <View
          style={{
            width: dimensions.SCREEN_WIDTH * 0.99,
            alignSelf: "flex-start",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
        </View>
        {showModal.isVisible ? (
          <VideoModel
            isVisible={showModal.isVisible}
            toggleModal={toggleModal}
            videoDetail={{ ...showModal?.data, url: showModal?.data?.file }}
            {...props}
          />
        ) : null}
        <View
          style={{
            // width: dimensions.SCREEN_WIDTH * 0.97,
            width:'100%',
            alignItems: 'center',
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          {videoData?.length > 0 ? (
            <FlatList
              data={videoData}
              numColumns={1}
              renderItem={({ item }) => (
                <View style={styles.VideoThumbWrapper}>
                  <TouchableOpacity
                    onPress={() => {
                      setShowModal({
                        isVisible: true,
                        data: item,
                      });
                    }}
                  >
                    <View style={styles.PlayIconContainer}>
                      <View style={styles.PlayIconWrapper}>
                        {/* <PlayIcon width={28} height={28} /> */}
                        <View
                          style={{
                            width: 55,
                            height: 55,
                            borderRadius: 55 / 2,
                            ju: "center",
                            justifyContent: "center",
                          }}
                        >
                          <Image
                            source={require("../../../assets/VideoGame-play-button.png")}
                            style={{ width: 30, height: 30 }}
                          />
                        </View>
                      </View>
                      <LinearGradient
                        colors={["#000", "transparent"]}
                        style={{
                          height: 60,
                          width: dimensions.SCREEN_WIDTH,
                          borderRadius: 15,
                          paddingHorizontal: 15,
                          justifyContent: "center",
                        }}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 0.2, y: 0 }}
                      >
                        <TouchableOpacity
                          onPress={() => {
                            props.navigation.navigate("VideoGamedetails", {
                              videoId: item.id,
                            });
                          }}
                        >
                          <View style={{ width: "100%" }}>
                            <Text
                              style={{ color: Mycolors.BG_COLOR, fontSize: 12 }}
                            >
                              {item.name}
                            </Text>
                          </View>
                          <Text
                            style={{
                              fontSize: 12,
                              marginTop: 14,
                              color: Mycolors.BG_COLOR,
                            }}
                          >
                            {item.user_name}
                          </Text>
                        </TouchableOpacity>
                      </LinearGradient>
                    </View>
                    <Image
                      style={styles.BackGroundImage}
                      // theme={theme}
                      source={{ uri: item?.thumbnail }}
                      resizeMode={"cover"}
                    />
                  </TouchableOpacity>
                </View>
              )}
              keyExtractor={(item) => item.id}
            />
          ) : (
            <Text style={{ color: "white", fontSize: 20, textAlign: "center" }}>
              No Videos found
            </Text>
          )}
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
    </SafeAreaView>
  );
};
const styles = StyleSheet.create({
  VideoThumbWrapper: {
    position: "relative",
    marginBottom: 10,
    width: dimensions.SCREEN_WIDTH*0.9,
    height: 220,
    borderRadius: 15,
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
    height: 50,
    marginTop: 65,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 999,
  },
  BackGroundImage: {
    backgroundColor: "gray",
    width: dimensions.SCREEN_WIDTH*0.9,
    height: 220,
    justifyContent: "center",
    borderRadius: 15,
  },
  inputDesc: {
    paddingLeft: 20,
    textAlign: "left",
    width: "100%",
    fontSize: 13,
    borderColor: "rgba(0,0,0,0.2)",
    borderWidth: 0.5,
    // backgroundColor: '#34333a',
    color: "#fff",
    height: 100,
    borderRadius: 5,
    paddingHorizontal: 15,
    paddingVertical: 10,
    color: Mycolors.Black,
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
});
export default AllVideos;

const objToQueryString = (obj) => {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(
      encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
    );
  }
  return keyValuePairs.length == 0 ? "" : "?" + keyValuePairs.join("&");
};
