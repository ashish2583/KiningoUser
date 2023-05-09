import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, RefreshControl, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, ImageEditor, Keyboard, } from 'react-native';
import HomeHeaderRoundBottom from '../../../component/HomeHeaderRoundBottom';
import SearchInput2 from '../../../component/SearchInput2';
import SearchInputEnt from '../../../component/SearchInputEnt';
import SerchInput from '../../../component/SerchInput';
import { dimensions, Mycolors } from '../../../utility/Mycolors';
import { ImageSlider, ImageCarousel } from "react-native-image-slider-banner";
import MyButtons from '../../../component/MyButtons';
import MultiSlider from '@ptomasroos/react-native-multi-slider';
import Modal from 'react-native-modal';
import Toast from 'react-native-toast-message';
import RepliesModal from './modals/RepliesModal';
import { connect_people_all_comments, connect_people_dislike_post, connect_people_like_post, requestPostApi, requestGetApi, connect_people_add_comment, connect_people_Delet_post } from '../../../WebApi/Service';
import Loader from '../../../WebApi/Loader';
import { useSelector, useDispatch } from 'react-redux';

// let replyingTo = ''

const PeopleComments = (props) => {
  const User = useSelector(state => state.user.user_details)
  const [loading, setLoading] = useState(false);
  const [searchValue, setsearchValue] = useState('')
  const [scrollEnabled, setScrollEnabled] = useState(false)
  const myTextInput = useRef()
  const [multiSliderValue, setMultiSliderValue] = useState([0, 100])
  const [showChooseMilesModal, setShowChooseMilesModal] = useState(false)
  const [userMessage, setUserMessage] = useState('')
  const [replyingTo, setReplyingTo] = useState('')
  const [showAtUsername, setShowAtUsername] = useState(false)
  const [showRepliesModal, setShowRepliesModal] = useState(false)
  const [Data, setData] = useState(props.route.params.data.id);
  const [commentdata, setCommentdata] = useState([])
  const [commenttype, setCommenttype] = useState('');
  const [commentid, setCommentid] = useState('');
  const [viewmore, setviewmore] = useState(true)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [upData, setupData] = useState([
    {
      id: '1',
      name: 'Maude Hall',
      message: `That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.`,
      time: '14 min',
      img: require('../../../assets/images/comment-person-image.png'),
      isLiked: true,
      replies: []
    },
    {
      id: '2',
      name: 'Eleanor Pena',
      message: `That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.`,
      time: '14 min',
      img: require('../../../assets/images/comment-person-image.png'),
      isLiked: false,
      replies: []
    },
    {
      id: '3',
      name: 'Floyd Miles',
      message: `That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.`,
      time: '14 min',
      img: require('../../../assets/images/comment-person-image.png'),
      isLiked: true,
      replies: []
    },
    {
      id: '4',
      name: 'Robert Fox',
      message: `That's a fantastic new app feature. You and your team did an excellent job of incorporating user testing feedback.`,
      time: '14 min',
      img: require('../../../assets/images/comment-person-image.png'),
      isLiked: true,
      replies: []
    },

  ])
  const multiSliderValuesChange = (values) => { setMultiSliderValue(values) }
  //   useEffect(()=>{
  //     console.log("DATA SHARE HOME PAGE",props.route.params.data);
  //     console.log('upData changed', upData);
  //  },[upData])
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      GetComments()
    });
    return unsubscribe;

  }, []);


  const [refreshing, setRefreshing] = React.useState(false);
  const checkcon = () => {
    GetComments()
  }
  const wait = (timeout) => {
    return new Promise(resolve => setTimeout(resolve, timeout));
  }

  const onRefresh = React.useCallback(() => {
    checkcon()
    wait(2000).then(() => {

      setRefreshing(false)

    });
  }, []);

  const GetComments = async () => {

    console.log("DATA SHARE HOME PAGE", Data);
    setLoading(true)
    const { responseJson, err } = await requestGetApi(connect_people_all_comments + Data, '', 'GET', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.success == 1) {
      setCommentdata(responseJson.data.comments);
      setCommenttype(responseJson.data?.comments.comment_type);
      setCommentid(responseJson.data?.comments.parent_id);

      console.log("response Comment TYPE", responseJson.data?.comments.parent_id);
      // Toast.show({ text1: responseJson.headers.message });
    } else {

      setalert_sms(err)
      setMy_Alert(true)
    }
  }
  const Sendcomment = async () => {
    console.log("Sendcomment CLICK:::", commentid, commenttype);
    if (userMessage == '') {
      Toast.show({ text1: 'Write something before Comment!' });
    } else {
      setLoading(true)
      var data = {
        post_id: Data,
        parent_id: commentid == undefined ? null : commentid,
        comment_type: null,
        comment: userMessage
      }
      console.log('Sendcomment===================================');
      console.log(data);
      console.log('====================================Sendcomment');

      const { responseJson, err } = await requestPostApi(connect_people_add_comment, data, 'POST', User.token)
      setLoading(false)
      console.log('the res==>>', responseJson)
      if (responseJson.headers.success == 1) {
        setUserMessage('')
        // replyingTo == ''
        setReplyingTo('')
        GetComments()
        Keyboard.dismiss()
        // Toast.show({ text1: responseJson.headers.message });
      } else {

        setalert_sms(err)
        setMy_Alert(true)
      }
    }
  }

  const Likepost = async (items) => {
    console.log("LIKE CLICK:::", items.id, items.post_id);

    setLoading(true)
    var data = {
      post_id: items.post_id,
      comment_id: items.id,
      reaction_type: "like"
    }
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    const { responseJson, err } = await requestPostApi(connect_people_like_post, data, 'POST', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.headers.success == 1) {
      GetComments()
      // Toast.show({ text1: responseJson.headers.message });
    } else {

      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const Dislikepost = async (items) => {
    console.log("DISLIKE CLICK:::", items.id, items.post_id);

    setLoading(true)
    var data = {
      post_id: items.post_id,
      comment_id: items.id,
      reaction_type: "dislike"
    }
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    const { responseJson, err } = await requestPostApi(connect_people_dislike_post, data, 'POST', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.headers.success == 1) {
      GetComments()
      // Toast.show({ text1: responseJson.headers.message });
    } else {

      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const handlerClick = (id) => {
    console.log('handlerClick Pressed!', id)
    Alert.alert('', 'Delete comment',
      [
        { text: 'Cancel', onPress: () => console.log('Cancel Pressed!') },
        { text: 'OK', onPress: () => { DeletePost(id) } },

      ]
    );
  };

  const DeletePost = async (id) => {
    console.log('DeletePost Pressed!', id)

    setLoading(true)
    const { responseJson, err } = await requestGetApi(connect_people_Delet_post + id, '', 'DELETE', User.token)
    setLoading(false)
    console.log('the DeletePost==>>', responseJson)
    if (responseJson.headers.success == 1) {
      GetComments()
      Toast.show({ text1: responseJson.headers.message });
    } else {

      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  // const sendMessage = () => {
  //   if (userMessage?.trim()?.length === 0) {
  //     return
  //   }
  //   if (replyingTo) {
  //     const upDataCopy = [...upData]
  //     upDataCopy.map(el => {
  //       if (replyingTo === el.id) {
  //         el.replies.push({
  //           id: 99,
  //           name: 'saurabh saneja',
  //           message: userMessage,
  //           time: '0 min',
  //           img: require('../../../assets/images/people-sender-image.png'),
  //           isLiked: false
  //         })
  //         return el
  //       }
  //     })
  //     setupData([...upDataCopy])
  //   } else {
  //     const nextId = upData?.length + 1
  //     setupData([...upData,
  //     {
  //       id: String(nextId),
  //       name: 'Saurabh Saneja',
  //       message: userMessage,
  //       time: '14 min',
  //       img: require('../../../assets/images/comment-person-image.png'),
  //       isLiked: false,
  //       replies: []
  //     },
  //     ])
  //   }
  //   Keyboard.dismiss()
  //   setUserMessage('')
  //   setReplyingTo('')
  // }
  const likeChildComment = (parentId, childIndex) => {
    const upDataCopy = [...upData]
    upDataCopy.map(el => {
      if (el.id === parentId) {
        el.replies[childIndex].isLiked = !el.replies[childIndex].isLiked
      }
      return el
    })
    setupData([...upDataCopy])
  }

  const returnOneReply = (itemid) => {

    const replies = commentdata?.find(el => el.id === itemid)?.replyComments
    console.log("returnOneReply", replies);
    if (replies?.length === 0) {
      return
    }

    return (
      replies.map((item, index) => {
        <>
          <View style={{ width: '90%', marginLeft: 30, marginTop: 10 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Image source={require('../../../assets/images/people-sender-image.png')} style={{ height: 40, width: 40 }} />
              <Text style={{ fontSize: 18, fontWeight: '500', color: '#000', marginLeft: 10 }}>{replies.first_name + '' + replies.last_name}</Text>
              <Text style={{ fontSize: 12, fontWeight: '400', color: '#B4BBC6', marginLeft: 20 }}>{replies.created_date?.slice(11, 16)}</Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <Text style={{ fontSize: 14, fontWeight: '400', color: '#272727' }}>{replies.comment}</Text>
            </View>
            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity onPress={() => { likeChildComment(id, index) }}>
                  <Image source={item.isLiked ? require('../../../assets/images/people-sel-heart.png') : require('../../../assets/images/people-unsel-heart.png')} style={{ width: 30, height: 30 }} />
                </TouchableOpacity>
                <Text style={{ fontSize: 14, fontWeight: '500', color: '#B4BBC6', marginLeft: 10 }}>Like</Text>
              </View>

            </View>
          </View>
        </>
      })

    )
  }
  return (
    <SafeAreaView scrollEnabled={scrollEnabled} style={{ backgroundColor: 'transparent', flex: 1 }}>

      <ScrollView style={{ marginBottom: 20, flex: 1 }}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}

          />
        }
      >
        <HomeHeaderRoundBottom height={80} paddingHorizontal={15} backgroundColor='#fff'
          press1={() => { props.navigation.goBack() }} img1={require('../../../assets/images/events_arrow.png')} img1width={25} img1height={20}
          press2={() => { }} title2={'Comments'} fontWeight={'500'} img2height={20} color='#455A64'
          press3={() => { }} img3width={25} img3height={25} />

        {
          commentdata.length != 0 ?
            <View style={{ width: '96%', alignSelf: 'center', marginTop: 10, height: '100%', paddingBottom: 40 }}>


              <View style={{ width: '100%', alignSelf: 'center', }}>
                <FlatList
                  data={commentdata}
                  showsHorizontalScrollIndicator={false}
                  numColumns={1}
                  keyExtractor={item => item.id}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity onLongPress={() => {  }} style={{ width: dimensions.SCREEN_WIDTH * 0.9, marginHorizontal: 5, marginBottom: 15, paddingHorizontal: 20 }}>
                        <>
                          <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Image source={require('../../../assets/images/comment-person-image.png')} />
                              <Text style={{ fontSize: 18, fontWeight: '500', color: '#000', marginLeft: 10 }}>{item.first_name + ' ' + item.last_name}</Text>
                              <Text style={{ fontSize: 12, fontWeight: '400', color: '#B4BBC6', marginLeft: 20 }}>{item.created_date.slice(11, 16)}</Text>
                              <View style={{ flexDirection: 'row',position:'absolute',right:-10  }}>
                                <TouchableOpacity onPress={() => {DeletePost(item.id) }} style={[styles.rightButtonsView, { marginRight: 0 }]}>
                                  <Image source={require('../../../assets/ent_delete_image.png')} style={{ width: 29, height: 29 }} />
                                </TouchableOpacity>

                              </View>

                            </View>

                            <View style={{ marginTop: 10 }}>
                              <Text style={{ fontSize: 14, fontWeight: '400', color: '#272727' }}>{item.comment}</Text>
                            </View>
                            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { item.isLiked ? Dislikepost(item) : Likepost(item) }} style={{ marginRight: 10 }}>
                                  <Image source={item.isLiked ? require('../../../assets/images/people-sel-heart.png') : require('../../../assets/images/people-like.png')} style={{ width: 25, height: 25 }} />
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => { setupData(upData.map((el, elIndex) => index === elIndex ? { ...el, isLiked: !item.isLiked } : el)) }}>
                    <Image source={item.isLiked ? require('../../../assets/images/people-unsel-heart.png') : require('../../../assets/images/people-sel-heart.png')} style={{ width: 30, height: 30 }} />
                  </TouchableOpacity> */}
                                <Text style={{ fontSize: 14, fontWeight: '500', color: '#B4BBC6', marginLeft: 10 }}>Like</Text>
                              </View>
                              <TouchableOpacity onPress={() => {
                                // setShowAtUsername(true);
                                console.log("item.id", item.id);
                                setUserMessage(`@${commentdata?.find(el => el.id === item.id)?.first_name}`)
                                myTextInput.current.focus()
                                setCommentid(item.id)
                                // replyingTo = item.id
                                // setReplyingTo(item);
                                // setShowRepliesModal(true); 
                              }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../../assets/images/people-reply-image.png')} />
                                <Text style={{ fontSize: 14, fontWeight: '500', color: '#B4BBC6', marginLeft: 10 }}>Reply</Text>
                              </TouchableOpacity>

                            </View>
                            <View>


                            </View>
                          </View>
                          <View style={{ borderBottomColor: '#E0E0E0', borderBottomWidth: 1, marginTop: 10 }} />

                          {item?.replyComments?.length > 0 ?
                            <>
                              {/* <View style={{ alignItems: 'flex-end', right: -10 }}>
                                <Text onPress={() => { setviewmore(!viewmore) }} style={{ color: '#835E23', textDecorationLine: "underline", fontSize: 12, }}>{viewmore ? 'View less' : 'View more'}</Text>
                              </View> */}
                              {
                                item?.replyComments?.map((item, index) => {

                                  return (
                                    <>
                                      {
                                        viewmore ?
                                          (<>
                                            <View style={{ width: '90%', marginLeft: 30, marginTop: 10 }}>
                                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                <Image source={require('../../../assets/images/people-sender-image.png')} style={{ height: 40, width: 40 }} />
                                                <Text style={{ fontSize: 18, fontWeight: '500', color: '#000', marginLeft: 10 }}>{item.first_name + '' + item.last_name}</Text>
                                                <Text style={{ fontSize: 12, fontWeight: '400', color: '#B4BBC6', marginLeft: 20 }}>{item.created_date?.slice(11, 16)}</Text>

                                              </View>
                                              <View style={{ marginTop: 10 }}>
                                                <Text style={{ fontSize: 14, fontWeight: '400', color: '#272727' }}>{item.comment}</Text>
                                              </View>
                                              <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                                  {/* <TouchableOpacity onPress={() => { likeChildComment(id, index) }}>
                                                <Image source={item.isLiked ? require('../../../assets/images/people-sel-heart.png') : require('../../../assets/images/people-unsel-heart.png')} style={{ width: 30, height: 30 }} />
                                              </TouchableOpacity> */}
                                                  <TouchableOpacity onPress={() => { item.isLiked ? Dislikepost(item) : Likepost(item) }} style={{ marginRight: 10 }}>
                                                    <Image source={item.isLiked ? require('../../../assets/images/people-sel-heart.png') : require('../../../assets/images/people-like.png')} style={{ width: 25, height: 25 }} />
                                                  </TouchableOpacity>
                                                  <Text style={{ fontSize: 14, fontWeight: '500', color: '#B4BBC6', marginLeft: 10 }}>Like</Text>
                                                </View>
                                                {/* <TouchableOpacity onPress={() => {
                                              console.log("replyComments.id", item.id);
                                              setUserMessage(`@${ item.id != null ?item.first_name : item.first_name}`)
                                              myTextInput.current.focus()
                                              replyingTo = item.id
                                            }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                              <Image source={require('../../../assets/images/people-reply-image.png')} />
                                              <Text style={{ fontSize: 14, fontWeight: '500', color: '#B4BBC6', marginLeft: 10 }}>Reply</Text>
                                            </TouchableOpacity> */}
                                              </View>
                                            </View>
                                            <View style={{ borderBottomColor: '#E0E0E0', borderBottomWidth: 1, marginTop: 10 }} />
                                          </>)
                                          :
                                          null
                                      }
                                    </>
                                  )

                                })}
                            </>
                            : null}
                        </>
                      </TouchableOpacity>
                    )
                  }}

                />
              </View>



            </View>

            :
            <View style={{ width: '100%', alignSelf: 'center', height: '100%' }}>
              <Text style={{ fontSize: 14, fontWeight: '500', color: '#B4BBC6', marginLeft: 10 }}></Text>
            </View>
        }


      </ScrollView>
      {/* <View style={{ height: 0,backgroundColor:'red' }} /> */}
      <View style={styles.addCommentView}>
        <TextInput
          ref={myTextInput}
          value={userMessage}
          onChangeText={(text) => {
            setUserMessage(text)
          }}
          placeholder="What's on your mind"
          placeholderTextColor={'#B2B7B9'}
          style={styles.input}
          multiline
        />
        <TouchableOpacity onPress={() => { Sendcomment() }} style={styles.sendButtonView}>
          <Text style={{ fontSize: 14, fontWeight: '500', color: '#fff' }}>Send</Text>
        </TouchableOpacity>
      </View>
      {/* {console.log('replyingTo....replyingTo', replyingTo)}
      {

        console.log('commentdata....commentdata', commentdata)
      } */}
      {/* <RepliesModal
        isVisible={showRepliesModal}
        setIsVisible={setShowRepliesModal}
        data={commentdata}
        setData={setCommentdata}
        replyingTo={replyingTo}
        // setReplyingTo={setReplyingTo}
        showAtUsername={showAtUsername}
        likeChildComment={likeChildComment}
      // startFromIndex={startFromIndex}
      /> */}

      {loading ?
        <Loader />
        : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  addCommentView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    backgroundColor: '#ffff',
    padding: 15,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
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
    paddingLeft: 20,
    fontSize: 14,
    fontWeight: '500',
    color: '#000',
    flex: 7
  },
  sendButtonView: {
    backgroundColor: '#0089CF',
    paddingHorizontal: 30,
    paddingVertical: 10,
    borderRadius: 5,
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});
export default PeopleComments 