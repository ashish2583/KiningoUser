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
  Platform,
  PermissionsAndroid,
} from "react-native";
import HomeHeader from "../../../component/HomeHeader";
import SearchInput2 from "../../../component/SearchInput2";
// import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from "../../../utility/Mycolors";
import MyButtons from "../../../component/MyButtons";
import Share from "react-native-share";
import LinearGradient from "react-native-linear-gradient";
import Modal from "react-native-modal";
// import Toast from 'react-native-simple-toast';
import Loader from "../../../WebApi/Loader";
import { Rating, AirbnbRating } from "react-native-ratings";
import {
  creation_common_add_views,
  game_add_comment,
  game_like,
  game_review,
  game_single_video,
  requestGetApi,
  requestPostApi,
  requestPostApiMedia,
} from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Toast from "react-native-toast-message";
import MyAlert from "../../../component/MyAlert";
import moment from "moment";
import { VideoModel } from "../../../component/VideoModel";
import RNFetchBlob from 'rn-fetch-blob';

const getDiff = (created_date) => {
  let diff = null
  const diffYears = moment().diff(created_date, 'years')
  if (diffYears > 0) {
    if(diffYears > 1){
      diff = diffYears + ' yrs ago'
    }else{
      diff = diffYears + ' yr ago'
    }
    return diff
  }
  const diffMonths = moment().diff(created_date, 'months')
  if (diffMonths > 0) {
    if(diffMonths > 1){
      diff = diffMonths + ' months ago'
    }else{
      diff = diffMonths + ' month ago'
    }
    return diff
  }
  const diffdays = moment().diff(created_date, 'days')
  if (diffdays > 0) {
    if(diffdays > 1){
      diff = diffdays + ' days ago'
    }else{
      diff = diffdays + ' day ago'
    }
    return diff
  }
  const diffHours = moment().diff(created_date, 'hours')
  const diffMinutes = moment().diff(created_date, 'minutes')
  const diffOnlyMinutes = diffMinutes % 60
  if (diffHours > 0) {
    let hr = diffHours > 1 ? ' hrs ' : ' hr '
    let min = diffOnlyMinutes > 1 ? ' mins' : ' min'
    diff = diffHours + hr + diffOnlyMinutes + min +' ago'
    return diff
  }
}

const VideoGamedetails = (props) => {
  const User = useSelector((state) => state.user.user_details);
  const [My_Alert, setMy_Alert] = useState(false);
  const [alert_sms, setalert_sms] = useState("");
  const myTextInput = useRef();
  const [modlevisual1, setmodlevisual1] = useState(false);
  const [showModal, setShowModal] = useState({ isVisible: false, data: null });
  const [showReportModal, setShowReportModal] = useState(false);
  const [showAtUsername, setShowAtUsername] = useState(false);
  const [showRepliesModal, setShowRepliesModal] = useState(false);
  const [userMessage, setUserMessage] = useState("");
  const [replyingTo, setReplyingTo] = useState("");
  const [loading, setLoading] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [postDecs, setPostDesc] = useState("");
  const [videoData, setVideoData] = useState({});
  const [rating, setRating] = useState("0");
  const [showModalType, setShowModalType] = useState('');
  const [whichParentIdReplies, setWhichParentIdReplies ] = useState(null);

  const design = (img, ti, tit, w, imgh, imgw, bg, redious, press) => {
    return (
      <View
        style={{
          alignItems: "center",
          width: "32%",
          borderRadius: 15,
          height: 60,
          paddingHorizontal: 10,
        }}
      >
        <TouchableOpacity
          onPress={press ? press : () => {}}
          style={{
            width: 40,
            height: 40,
            backgroundColor: bg,
            justifyContent: "center",
            borderRadius: redious,
          }}
        >
          <Image
            source={img}
            style={{
              width: imgw,
              height: imgh,
              overflow: "hidden",
              alignSelf: "center",
            }}
          ></Image>
        </TouchableOpacity>
        <View style={{ alignItems: "center" }}>
          <Text style={{ fontSize: 10, fontWeight: "bold", color: "#D9D9D9" }}>
            {ti}
          </Text>
        </View>
        {/* <View style={{ borderWidth: 1, borderBottomColor: '#212121' }} /> */}
      </View>
    );
  };
  useEffect(() => {
    addView();
    getSingleVideo();
  }, []);
  const addView = async () => {
    const data = {
      "object_type": "game",
      "object_id" : props.route.params.videoId
    }
    console.log('addView data', data);
    setLoading2(true);
    const { responseJson, err } = await requestPostApi(
      creation_common_add_views +'43',
      data,
      "POST",
      User.token
    );
    setLoading2(false);
    console.log("addView responseJson", responseJson);
    if (responseJson.headers.success == 1) {
      // setVideoData(responseJson.body);
      //   Toast.show({ text1: responseJson.headers.message });
    } else {
      Toast.show({ text1: responseJson.headers.message });
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const getSingleVideo = async () => {
    setLoading(true);
    const { responseJson, err } = await requestGetApi(
      game_single_video + props.route.params.videoId,
      "",
      "GET",
      User.token
    );
    setLoading(false);
    console.log("getSingleVideo responseJson", responseJson);
    if (responseJson.headers.success == 1) {
      setVideoData(responseJson.body);
      //   Toast.show({ text1: responseJson.headers.message });
    } else {
      Toast.show({ text1: responseJson.headers.message });
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const replyValidation = () => {
    if (postDecs?.trim()?.length === 0) {
      Toast.show({ text1: "Please write reply" });
      return false;
    }
    return true;
  };
  const addReply = async () => {
    if(!replyValidation()){
      return
    }
    const data = {
      game_id: props.route.params.videoId,
      parent_id: replyingTo,
      comments: postDecs,
      // comment_type: "secondary",
    };
    console.log('addReply data', data);  
    const { responseJson, err } = await requestPostApi(
      game_add_comment,
      data,
      "POST",
      User.token
    );
    setLoading(false);
    console.log("addReply responseJson", responseJson);
    if (responseJson.headers.success == 1) {
      Toast.show({ text1: responseJson.headers.message });
      setPostDesc("");
      setmodlevisual1(false);
      getSingleVideo();
      //   Toast.show({ text1: responseJson.headers.message });
    } else {
      Toast.show({ text1: responseJson.headers.message });
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const MycustomonShare = async () => {
    const shareOptions = {
      title: "KinenGo Contents",
      icon: "data:<data_type>/<file_extension>;base64,<base64_data>",
      // type: 'data:image/png;base64,<imageInBase64>',
      // message: "Popfiit App",
      url: "KinenGo",
    };
    try {
      const shareResponse = await Share.open(shareOptions);

      console.log(JSON.stringify(shareResponse));
    } catch (error) {
      console.log("ERROR=>", error);
    }
  };
  const [reportReasonData, setReportReasonData] = useState([
    {
      id: "1",
      name: "I just don’t like it",
      description: "",
      selected: true,
    },
    {
      id: "2",
      name: "Nudity or pornography",
      description: "",
      selected: false,
    },
    {
      id: "3",
      name: "Hate speech or symbols",
      description: "Racist, homophobic or sexist slurs",
      selected: false,
    },
    {
      id: "4",
      name: "Violence or threat of violence",
      description: `Graphic injury, unlawful activity, dangerous or criminal organizations`,
      selected: false,
    },
    {
      id: "5",
      name: "Sale or promotion of firearms",
      description: "",
      selected: false,
    },
    {
      id: "6",
      name: "Sale or promotion of drugs",
      description: "",
      selected: false,
    },
    {
      id: "7",
      name: "Harassment or bullying",
      description: "",
      selected: false,
    },
    {
      id: "8",
      name: "Intellectual property violation",
      description: "Copyright or trademark infringement",
      selected: false,
    },
  ]);
  const [upData, setupData] = useState([
    {
      id: "1",
      name: "Maude Hall",
      message: `That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.`,
      time: "14 min",
      img: require("../../../assets/dating-home-header-left-image.png"),
      isLiked: true,
      replies: [],
    },
    {
      id: "2",
      name: "Eleanor Pena",
      message: `That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.`,
      time: "14 min",
      img: require("../../../assets/dating-home-header-left-image.png"),
      isLiked: false,
      replies: [],
    },
    {
      id: "3",
      name: "Floyd Miles",
      message: `That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.`,
      time: "14 min",
      img: require("../../../assets/dating-home-header-left-image.png"),
      isLiked: true,
      replies: [],
    },
    {
      id: "4",
      name: "Robert Fox",
      message: `That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.`,
      time: "14 min",
      img: require("../../../assets/dating-home-header-left-image.png"),
      isLiked: true,
      replies: [],
    },
  ]);
  const toggleModal = (state) => {
    setShowModal({
      isVisible: state.isVisible,
      data: state.data,
    });
  };
  const sendMessage = () => {
    if (userMessage?.trim()?.length === 0) {
      return;
    }
    if (replyingTo) {
      const upDataCopy = [...upData];
      upDataCopy.map((el) => {
        if (replyingTo === el.id) {
          el.replies.push({
            id: 99,
            name: "saurabh saneja",
            message: userMessage,
            time: "0 min",
            img: require("../../../assets/dating-home-header-left-image.png"),
            isLiked: false,
          });
          return el;
        }
      });
      setupData([...upDataCopy]);
    } else {
      const nextId = upData?.length + 1;
      setupData([
        ...upData,
        {
          id: String(nextId),
          name: "Saurabh Saneja",
          message: userMessage,
          time: "14 min",
          img: require("../../../assets/comment-person-image.png"),
          isLiked: false,
          replies: [],
        },
      ]);
    }
    Keyboard.dismiss();
    setUserMessage("");
    setReplyingTo("");
  };

  const likeChildComment = (parentId, childIndex) => {
    const upDataCopy = [...upData];
    upDataCopy.map((el) => {
      if (el.id === parentId) {
        el.replies[childIndex].isLiked = !el.replies[childIndex].isLiked;
      }
      return el;
    });
    setupData([...upDataCopy]);
  };

  const returnOneReply = (reply, fullwidth = false) => {
     console.log('reply', reply);
     const diff = getDiff(reply.created_date)
     return (
      <View style={{marginTop:10, width:fullwidth?'80%': '100%', alignSelf:'flex-end'}} >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Image
              source={{uri: reply.profile_image}}
              style={{ height: 50, width: 50 }}
            />
            <View style={{ marginLeft: 10 }}>
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: "700",
                  color: "#FFFFFF",
                }}
              >
                {reply.user_name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <Image
                  source={require("../../../assets/Star.png")}
                  style={{ width: 15, height: 15 }}
                ></Image>
                <Text
                  style={{
                    color: "#FFD037",
                    fontSize: 11,
                    left: 7,
                  }}
                >
                  {reply.star}
                </Text>
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: "400",
                    color: "#6F6D6D",
                    marginLeft: 25,
                  }}
                >
                  {diff}
                </Text>
              </View>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 10 }}>
          <Text
            style={{
              fontSize: 14,
              lineHeight: 20,
              fontWeight: "400",
              color: "#FFFFFF",
            }}
          >
            {reply.comments}
          </Text>
        </View>
      </View>
     ) 
  };
  const reviewValidation = () => {
    if (postDecs?.trim()?.length === 0) {
      Toast.show({ text1: "Please write review" });
      return false;
    }
    return true;
  };
  //   working on post review function
  const postReview = async () => {
    if (!reviewValidation()) {
      return;
    }
    setLoading(true);
    const data = {
      game_id: props.route.params.videoId,
      star: rating,
      comments: postDecs,
    };
    const { responseJson, err } = await requestPostApi(
      game_review,
      data,
      "POST",
      User.token
    );
    setLoading(false);
    console.log("postReview responseJson", responseJson);
    if (responseJson.headers.success == 1) {
      setRating("0");
      setPostDesc("");
      setmodlevisual1(false);
      getSingleVideo();
      //   Toast.show({ text1: responseJson.headers.message });
    } else {
      Toast.show({ text1: responseJson.headers.message });
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  //function : imp function
  const checkDownloadPermission = async () => {
    if (Platform.OS === 'ios') {
      downloadFile();
    } else {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {
            title: 'Storage Permission Required',
            message:
              'Application needs access to your storage to download File',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          downloadFile();
          console.log('Storage Permission Granted.');
        } else {
          Toast.show('Storage Permission Not Granted', Toast.LONG);
          // Alert.alert('Error', 'Storage Permission Not Granted');
        }
      } catch (err) {
        // To handle permission related exception
        console.log('ERROR' + err);
      }
    }
  };
  //function : service function
  const downloadFile = async () => {
    let url = videoData?.file
    let videoUrl = url;
    let DownloadDir =
      Platform.OS == 'ios'
        ? RNFetchBlob.fs.dirs.DocumentDir
        : RNFetchBlob.fs.dirs.DownloadDir;
    const {dirs} = RNFetchBlob.fs;
    const dirToSave =
      Platform.OS == 'ios' ? dirs.DocumentDir : dirs.DownloadDir;
    const configfb = {
      fileCache: true,
      useDownloadManager: true,
      notification: true,
      mediaScannable: true,
      title: 'Videogame',
      path: `${dirToSave}.mp4`,
    };
    const configOptions = Platform.select({
      ios: {
        fileCache: configfb.fileCache,
        title: configfb.title,
        path: configfb.path,
        appendExt: 'mp4',
      },
      android: configfb,
    });
    Platform.OS == 'android'
      ? RNFetchBlob.config({
          fileCache: true,
          addAndroidDownloads: {
            useDownloadManager: true,
            notification: true,
            path: `${DownloadDir}/.mp4`,
            description: 'kiningo Videogame',
            title: `${videoData?.name}video.mp4`,
            mime: 'video/mp4',
            mediaScannable: true,
          },
        })
          .fetch('GET', `${videoUrl}`)
          .catch(error => {
            console.warn(error.message);
          })
      : RNFetchBlob.config(configOptions)
          .fetch('GET', `${videoUrl}`, {})
          .then(res => {
            if (Platform.OS === 'ios') {
              RNFetchBlob.fs.writeFile(configfb.path, res.data, 'base64');
              RNFetchBlob.ios.previewDocument(configfb.path);
            }
            console.log('The file saved to ', res);
          })
          .catch(e => {
            console.log('The file saved to ERROR', e.message);
          });
  };
  const likeVideo = async () => {
    setLoading(true);
    const data = {
      game_id: props.route.params.videoId,
      reaction_type: videoData?.liked ? 'dislike' : 'like',
    };
    const { responseJson, err } = await requestPostApi(
      game_like,
      data,
      "POST",
      User.token
    );
    setLoading(false);
    console.log("likeVideo responseJson", responseJson);
    if (responseJson.headers.success == 1) {
      getSingleVideo();
      //   Toast.show({ text1: responseJson.headers.message });
    } else {
      Toast.show({ text1: responseJson.headers.message });
      setalert_sms(err);
      setMy_Alert(true);
    }
  }
  const openRepliesModal = (id) => {
    setWhichParentIdReplies(id);
    setShowRepliesModal(true);
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
            position: "relative",
          }}
        >
          <ImageBackground
            // source={require("../../../assets/images/Pubg-photo.png")}
            source={{ uri: videoData?.thumbnail }}
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
              title2={"Game Video"}
              fontWeight={"bold"}
              img2height={20}
              color={Mycolors.BG_COLOR}
              press3={() => {}}
              img3width={25}
              img3height={25}
            />

            <View style={styles.PlayIconWrapper}>
              <TouchableOpacity
                onPress={() => {
                  setShowModal({
                    isVisible: true,
                    data: videoData,
                  });
                }}
              >
                <Image
                  source={require("../../../assets/VideoGame-play-button.png")}
                  style={{ width: 50, height: 50 }}
                />
              </TouchableOpacity>
            </View>
          </ImageBackground>
        </View>
        {/* <View style={{ width: '96%', alignItems: 'flex-start', alignSelf: 'center', paddingHorizontal: 15, paddingVertical: 10, top: -130 }}>
                    <Text style={{ color: '#FFFFFF', fontSize: 26, fontWeight: '600' }}>Browse the</Text>
                    <Text style={{ color: 'red', fontSize: 26, fontWeight: '600' }}>Games Videos</Text>
                </View> */}

        <View style={{ width: "97%", alignSelf: "center" }}>
          <View
            style={{ flexDirection: "row", alignItems: "center", padding: 10 }}
          >
            <Image
              source={require("../../../assets/dating-home-header-left-image.png")}
              style={{ width: 50, height: 50, borderRadius: 25 }}
            ></Image>
            <View style={{ marginLeft: 10, width: "83%" }}>
              <Text
                style={{
                  color: Mycolors.BG_COLOR,
                  fontSize: 13,
                  fontWeight: "600",
                }}
              >
                {videoData?.name}
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  marginTop: 5,
                }}
              >
                <Image
                  source={require("../../../assets/Star.png")}
                  style={{ width: 15, height: 15 }}
                ></Image>
                <Text style={{ color: "#FFD037", fontSize: 11, left: 7 }}>
                  {videoData?.rating}
                </Text>

                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    marginLeft: 60,
                    width: "68%",
                  }}
                >
                  <Text
                    style={{
                      color: "#8F93A0",
                      fontSize: 10,
                      fontWeight: "600",
                    }}
                  >
                    {videoData?.total_views} {videoData?.total_views > 1 ? 'Views': 'View'}
                  </Text>
                  <Text
                    style={{
                      color: "#8F93A0",
                      fontSize: 10,
                      fontWeight: "600",
                    }}
                  >
                    {/* June 13, 2022 6:28AM */}
                    {moment(videoData.created_date).format(
                      "MMMM DD, YYYY hh:mm A"
                    )}
                  </Text>
                </View>
              </View>
            </View>
          </View>

          <View style={{ borderWidth: 1, borderBottomColor: "#212121" }} />
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              alignItems: "center",
              width: "80%",
            }}
          >
            {design(
              require("../../../assets/Heart-like-buttom.png"),
              videoData?.liked ? 'Liked' : "Like",
              "",
              "45%",
              25,
              28,
              "",
              20,
              () => {
                likeVideo()
              }
            )}
            {design(
              require("../../../assets/Newspaper.png"),
              "Newsfeed",
              "",
              "45%",
              25,
              28,
              "",
              20,
              () => {
                props.navigation.navigate("VideoNewsfeed");
              }
            )}
            {design(
              require("../../../assets/ArrowCircleDown.png"),
              "Download",
              "",
              "45%",
              25,
              28,
              "",
              20,
              checkDownloadPermission 
            )}
            {design(
              require("../../../assets/ShareNetwork.png"),
              "Share",
              "",
              "45%",
              25,
              28,
              "",
              20,
              () => {
                MycustomonShare();
              }
            )}
          </View>
          <View style={{ borderWidth: 1, borderBottomColor: "#212121" }} />

          <View
            style={{
              width: "96%",
              alignItems: "flex-start",
              alignSelf: "center",
              paddingHorizontal: 15,
              top: 10,
            }}
          >
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 16,
                fontWeight: "600",
                marginVertical: 10,
              }}
            >
              Description
            </Text>
            {showModal.isVisible ? (
              <VideoModel
                isVisible={showModal.isVisible}
                toggleModal={toggleModal}
                videoDetail={{ ...showModal?.data, url: showModal?.data?.file }}
                {...props}
              />
            ) : null}
            <Text
              style={{
                color: "#FFFFFF",
                fontSize: 13,
                fontWeight: "600",
                textAlign: "left",
              }}
            >
              {videoData?.description}
            </Text>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              marginTop: 25,
              width: "90%",
              marginLeft: 20,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: "500", color: "#FFFFFF" }}>
              Comments & Reviews
            </Text>
            <TouchableOpacity
              onPress={() => {
                setShowModalType('review')
                setmodlevisual1(true);
              }}
            >
              <Text
                style={{ fontSize: 13, fontWeight: "400", color: "#ED1C24" }}
              >
                Post Your Review
              </Text>
            </TouchableOpacity>
          </View>

          <View style={{ width: "100%", alignSelf: "center", marginTop: 15 }}>
            <FlatList
              data={videoData?.review}
              showsHorizontalScrollIndicator={false}
              numColumns={1}
              renderItem={({ item, index }) => {
                // console.log('moment diff', moment().diff(item.created_date, 'days'));
                const diff = getDiff(item.created_date)
                return (
                  <View
                    style={{
                      width: dimensions.SCREEN_WIDTH * 0.89,
                      marginBottom: 15,
                      alignSelf: "center",
                      backgroundColor: "#131313",
                      padding: 10,
                      borderRadius: 15,
                    }}
                  >
                    <>
                      <View>
                        <View
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <View
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={{uri: item.profile_image}}
                              style={{ height: 50, width: 50 }}
                            />
                            <View style={{ marginLeft: 10 }}>
                              <Text
                                style={{
                                  fontSize: 14,
                                  fontWeight: "700",
                                  color: "#FFFFFF",
                                }}
                              >
                                {item.user_name}
                              </Text>
                              <View
                                style={{
                                  flexDirection: "row",
                                  alignItems: "center",
                                  marginTop: 5,
                                }}
                              >
                                <Image
                                  source={require("../../../assets/Star.png")}
                                  style={{ width: 15, height: 15 }}
                                ></Image>
                                <Text
                                  style={{
                                    color: "#FFD037",
                                    fontSize: 11,
                                    left: 7,
                                  }}
                                >
                                  {item.star}
                                </Text>
                                <Text
                                  style={{
                                    fontSize: 12,
                                    fontWeight: "400",
                                    color: "#6F6D6D",
                                    marginLeft: 25,
                                  }}
                                >
                                  {diff}
                                </Text>
                              </View>
                            </View>
                          </View>
                          <TouchableOpacity
                            onPress={() => {
                              setShowModalType('reply')
                              setmodlevisual1(true)
                              setShowAtUsername(true);
                              setReplyingTo(item.id);
                              setShowRepliesModal(true);
                            }}
                            style={{
                              flexDirection: "row",
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={require("../../../assets/Videogame-reply-icon.png")}
                            />
                            <Text
                              style={{
                                fontSize: 14,
                                fontWeight: "500",
                                color: "#B4BBC6",
                                marginLeft: 10,
                              }}
                            >
                              Reply
                            </Text>
                          </TouchableOpacity>
                        </View>
                        <View style={{ marginTop: 10 }}>
                          <Text
                            style={{
                              fontSize: 14,
                              lineHeight: 20,
                              fontWeight: "400",
                              color: "#FFFFFF",
                            }}
                          >
                            {item.comments}
                          </Text>
                        </View>
                      </View>
                      {item?.reply?.length > 1 ? 
                      <TouchableOpacity onPress={()=>{openRepliesModal(item.id)}} >
                        <Text
                        style={{
                          fontSize: 14,
                          lineHeight: 20,
                          fontWeight: "400",
                          color: "#FFFFFF",
                        }}
                        >
                          View previous {item?.reply?.length - 1} replies
                        </Text>      
                      </TouchableOpacity>
                      :null}
                      {item?.reply?.length > 0 ? (
                        <>{returnOneReply(item?.reply[item?.reply?.length - 1])}</>
                      ) : null}
                    </>
                  </View>
                );
              }}
              keyExtractor={(item) => item.id}
            />
          </View>
        </View>

        <View style={{ height: 60 }} />
      </ScrollView>
      {loading || loading2 ? <Loader /> : null}

      {/* <View style={styles.addCommentView}>
        <TextInput
          ref={myTextInput}
          value={userMessage}
          onChangeText={(text) => {
            setUserMessage(text);
          }}
          placeholder="What's on your mind"
          placeholderTextColor={"#B2B7B9"}
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendButtonView}>
          <Text style={{ fontSize: 14, fontWeight: "500", color: "#fff" }}>
            Send
          </Text>
        </TouchableOpacity>
      </View> */}

      <Modal
        isVisible={showRepliesModal}
        swipeDirection="down"
        onBackdropPress={() => setShowRepliesModal(false)}
        onSwipeComplete={(e) => {
          setShowRepliesModal(false);
        }}
        scrollTo={() => {}}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor="transparent"
        style={{
          justifyContent: "flex-end",
          margin: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <View
          style={{
            height: "90%",
            backgroundColor: "#000",
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "700",
              color: "#455A64",
              textAlign: "center",
              marginBottom: 20,
              marginTop: 30,
            }}
          >
            Replies
          </Text>
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            {console.log('videoData?.review', videoData?.review)}
            {console.log('whichParentIdReplies', whichParentIdReplies)}
            <FlatList
              data={videoData?.review?.find(el=>el.id === whichParentIdReplies)?.reply}
              showsHorizontalScrollIndicator={false}
              numColumns={1}
              keyExtractor={(item) => item.id}
              style={{ marginBottom: 10 }}
              renderItem={({ item, index }) => {
                console.log('replies modal', item);
                return (
                  returnOneReply(item, true)
                );
              }}
            />
          </ScrollView>
        </View>
      </Modal>

      {/* Post your review modul */}
      <Modal
        isVisible={modlevisual1}
        swipeDirection="down"
        onSwipeComplete={(e) => {
          setmodlevisual1(false);
        }}
        scrollTo={() => {}}
        scrollOffset={1}
        propagateSwipe={true}
        coverScreen={false}
        backdropColor="transparent"
        style={{
          justifyContent: "flex-end",
          margin: 0,
          backgroundColor: "rgba(0,0,0,0.5)",
        }}
      >
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => setmodlevisual1(false)}
        ></TouchableOpacity>
        <View
          style={{
            height: "74%",
            backgroundColor: "#2A2B2C",
            borderRadius: 30,
            padding: 20,
            marginBottom: 20,
            marginHorizontal: 10,
          }}
        >
          <ScrollView
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
          >
            <View
              style={{
                width: 180,
                height: 150,
                alignSelf: "center",
                marginTop: 8,
              }}
            >
              <Image
                source={require("../../../assets/Post-Your-Review-img.png")}
                style={{
                  width: "100%",
                  height: "100%",
                  alignSelf: "center",
                  borderRadius: 7,
                }}
              ></Image>
            </View>

            <View
              style={{
                ustifyContent: "center",
                alignItems: "center",
                padding: 5,
              }}
            >
              <Text
                style={{
                  fontWeight: "bold",
                  color: "#FFFFFF",
                  marginVertical: 10,
                  paddingHorizontal: 10,
                  textAlign: "center",
                  fontSize: 18,
                }}
              >
                Your opinion matters to us!
              </Text>

              {showModalType === 'review' ?     
                <Rating
                  // type='custom'
                  // type='heart'
                  ratingCount={5}
                  imageSize={50}
                  startingValue={1}
                  // ratingBackgroundColor={'#455A64'}
                  tintColor={"#2A2B2C"}
                  style={{ paddingVertical: 10 }}
                  onSwipeRating={(d) => {
                    setRating(d);
                  }}
                  onFinishRating={(d) => {
                    setRating(d);
                  }}
                  // readonly={true}
                  // showRating
                  //onFinishRating={this.ratingCompleted}
                />
              :null}
              <View
                style={{
                  width: "93%",
                  height: 100,
                  borderRadius: 5,
                  marginTop: 20,
                  alignSelf: "center",
                  backgroundColor: "#2A2B2C",
                  borderWidth: 1,
                  borderColor: "#455A64",
                }}
              >
                <TextInput
                  value={postDecs}
                  textAlignVertical="top"
                  onChangeText={(e) => setPostDesc(e)}
                  placeholder={`Write Your ${showModalType === 'review' ?'review':'reply'} here…`}
                  placeholderTextColor="#bbbbbb"
                  multiline={true}
                  // maxLength={500}
                  // keyboardType="number-pad"
                  autoCapitalize="none"
                  style={[styles.inputDesc]}
                />
              </View>
            </View>

            <View
              style={{
                width: "90%",
                height: 50,
                justifyContent: "center",
                position: "absolute",
                bottom: 30,
                marginHorizontal: 10,
                alignSelf: "center",
              }}
            >
              <MyButtons
                title={`Post Your ${showModalType === 'review' ?'Review':'Reply'}`}
                height={50}
                width={"100%"}
                borderRadius={5}
                press={() => {
                  //   props.navigation.navigate(" "), setmodlevisual1(false);
                  showModalType === 'review' ? postReview() : addReply()
                }}
                fontSize={13}
                titlecolor={Mycolors.BG_COLOR}
                marginVertical={0}
                backgroundColor={"#ED1C24"}
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
    marginTop: 25,
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
});
export default VideoGamedetails;
