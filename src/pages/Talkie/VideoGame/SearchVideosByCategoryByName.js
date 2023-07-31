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
import Feather from 'react-native-vector-icons/Feather';

const SearchVideosByCategoryByName = (props) => {
  const User = useSelector((state) => state.user.user_details);
  const [loading, setLoading] = useState(false);
  const [searchValue, setsearchValue] = useState("");
  const [videoData, setVideoData] = useState("");
  const [showModal, setShowModal] = useState({ isVisible: false, data: null });
  const [selectedCategory, setSelectedCategory] = useState('');
  const [categoryModal, openCategoryModal] = useState(false)

  useEffect(() => {
    getGameVideo();
  }, []);

  const getGameVideo = async (cat) => {
    let endPoint = game_video;
    let dataObj = {};
    if (cat != null) {
      dataObj.category_id = cat;
    }
    // if (name != "") {
    //   dataObj.name = name;
    // }
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
  const removeCategoryFilter = () => {
    setSelectedCategory('')
    // getDropdownData()
  }
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
          title2={"Search Videos By Category"}
          fontWeight={"bold"}
          img2height={20}
          color={Mycolors.BG_COLOR}
          press3={() => {}}
          img3width={25}
          img3height={25}
        />
        {/* <Search
          searchIcon={require("../../../assets/Search-icon-red.png")}
          marginTop={10}
          placeholder={"Search video"}
          serchValue={searchValue}
          onChangeText={(e) => {
            console.log('onChangeText', e);
            setsearchValue(e?.text);
            getGameVideo(e?.text, selectedCategory);
          }}
          press={() => {
            Alert.alert("Hi");
          }}
          presssearch={() => {
            Alert.alert("Search Pressed");
          }}
          paddingLeft={20}
        /> */}
         <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginHorizontal: 10, marginTop: 20, }}>
          <Text style={{ color: 'white', fontWeight: '500', width: '50%' }} >Pick from a wide range of categories</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {selectedCategory ?
              <TouchableOpacity onPress={removeCategoryFilter} style={styles.refreshView}>
                <Feather name="refresh-cw" color={'black'} size={16} />
                {/* <Image source={require('../../../assets/product_refresh.png')} ></Image> */}
                <Text style={{ color: 'black', fontSize: 12, fontWeight: '400', marginLeft: 10 }} >Clear</Text>
              </TouchableOpacity>
              :
              null
            }
            <TouchableOpacity onPress={() => { openCategoryModal(true) }}>
              <Text style={{ color: 'white', fontWeight: '500', textDecorationLine: "underline", textDecorationColor: 'white' }} >View All</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View
          style={{
            width: dimensions.SCREEN_WIDTH * 0.99,
            alignSelf: "flex-start",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          <FlatList
            data={props.route.params.courseData}
            showsHorizontalScrollIndicator={true}
            horizontal
            keyExtractor={(item) => item.id}
            renderItem={({ item, index }) => {
              return (
                <LinearGradient
                  colors={["rgba(255, 255, 255, 1)", "rgba(249, 249, 249, 1)"]}
                  style={[{
                    width: dimensions.SCREEN_WIDTH / 3.2,
                    marginRight: 10,
                    borderRadius: 15,
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 3 },
                    shadowRadius: 1,
                    shadowOpacity: 0.03,
                    elevation: 1,
                  }, selectedCategory === item?.id ? styles.categorySelectedStyle : null]}
                >
                  <TouchableOpacity
                    style={{
                      width: dimensions.SCREEN_WIDTH / 3.2,
                      height: 130,
                      alignItems: "center",
                      borderRadius: 15,
                      paddingHorizontal: 10,
                      justifyContent: "center",
                    }}
                    onPress={() => {
                      setSelectedCategory(item.id);
                      getGameVideo(item.id);
                    }}
                  >
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
            width: dimensions.SCREEN_WIDTH * 0.97,
            alignSelf: "flex-start",
            marginTop: 20,
            marginBottom: 10,
          }}
        >
          {videoData?.length > 0 ? (
            <FlatList
              data={videoData}
              showsHorizontalScrollIndicator={true}
              horizontal
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
                            alignItems: "center",
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
                          width: dimensions.SCREEN_WIDTH - 80,
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
                          <View style={{ width: "52%" }}>
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
                            {`${item.first_name} ${item.last_name}`}
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
      <Modal
        isVisible={categoryModal}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          openCategoryModal(false)
        }}
        scrollTo={() => { }}
        onBackdropPress={() => openCategoryModal(false)}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor='transparent'
        style={{ justifyContent: 'flex-end', margin: 0, backgroundColor: 'rgba(0,0,0,0.5)' }}
      >
        <View style={{ height: '80%', backgroundColor: '#fff', borderTopLeftRadius: 15, borderTopRightRadius: 15, padding: 20 }}>
          <ScrollView showsVerticalScrollIndicator={false} nestedScrollEnabled={true}>

            <Text style={{ color: Mycolors.Black, fontWeight: '500', fontSize: 22, textAlign: 'center' }} >Pick from a wide range of categories</Text>

            <View style={{ width: '100%', alignSelf: 'center', marginTop: 10 }}>
              <FlatList
                data={props.route.params.courseData}
                renderItem={({ item, index }) => {
                  return (
                    <TouchableOpacity
                      style={[{
                        width: '96%', marginHorizontal: 10, flexDirection: 'row', alignItems: 'center', borderRadius: 10, marginBottom: 20,
                        overflow: 'hidden',
                        // borderWidth:1, borderColor:'black'
                        shadowColor: '#E0E0E0',
                        shadowOffset: {
                          width: 0,
                          height: 3
                        },
                        shadowRadius: 5,
                        shadowOpacity: 0.6,
                        elevation: 3,
                      }, selectedCategory === item.id ? styles.categorySelectedStyle : null]}
                      onPress={() => { setSelectedCategory(item.id); openCategoryModal(false) }}
                    >
                      <Image source={{ uri: item.image }} style={{ width: '40%', height: 100, borderRadius: 7 }} resizeMode='stretch' ></Image>
                      <View style={{ justifyContent: 'center', alignItems: 'center', width: "60%" }}>
                        <Text style={{ fontSize: 14, color: (selectedCategory === item?.id) ? '#835E23' : Mycolors.Black, marginTop: 5, textAlign: 'center', fontWeight: 'bold' }}>{item?.name}</Text>
                      </View>
                    </TouchableOpacity>
                  )
                }}
              />
            </View>


            <View style={{ width: 100, height: 100 }} />
          </ScrollView>

        </View>
      </Modal>
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
    height: 50,
    marginTop: 65,
    justifyContent: "flex-start",
    alignItems: "center",
    zIndex: 999,
  },
  BackGroundImage: {
    backgroundColor: "gray",
    width: "100%",
    height: 190,
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
  categorySelectedStyle: {
    borderWidth: 2,
    borderColor: 'white',
    // borderRadius: 10
  },
  refreshView: {
    flexDirection: 'row',
    alignItems: 'center',
    // width: '25%',
    // marginTop: 10,
    marginRight: 10,
    backgroundColor: 'white',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 50
  },
});
export default SearchVideosByCategoryByName;

const objToQueryString = (obj) => {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(
      encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
    );
  }
  return keyValuePairs.length == 0 ? "" : "?" + keyValuePairs.join("&");
};
