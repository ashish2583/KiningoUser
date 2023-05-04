import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, TouchableOpacity, ScrollView, ImageBackground, ImageEditor, Keyboard } from 'react-native';
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
import { connect_people_all_comments, connect_people_dislike_post, connect_people_like_post, requestPostApi, requestGetApi, connect_people_add_comment } from '../../../WebApi/Service';
import Loader from '../../../WebApi/Loader';
import { useSelector, useDispatch } from 'react-redux';

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
  const [commentid, setCommentid] = useState('')
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
    // setData(props.route.params.data.id)
    GetComments()
  }, [])

  const GetComments = async () => {

    console.log("DATA SHARE HOME PAGE", Data);
    setLoading(true)
    const { responseJson, err } = await requestGetApi(connect_people_all_comments + Data, '', 'GET', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.success == 1) {
      setCommentdata(responseJson.data.comments);
      setCommenttype(responseJson.data?.comments[0]?.comment_type);
      setCommentid(responseJson.data?.comments[0]?.id);

      // console.log("response hOME", responseJson.body.posts);
      // Toast.show({ text1: responseJson.headers.message });
    } else {

      setalert_sms(err)
      setMy_Alert(true)
    }
  }
  const Sendcomment = async () => {
    console.log("Sendcomment CLICK:::", commenttype, commentid);

    setLoading(true)
    var data = {
      post_id: Data,
      parent_id: commentid != null ? commentid : null ,
      comment_type: commenttype,
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
      GetComments()
      Toast.show({ text1: responseJson.headers.message });
    } else {

      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const Likepost = async (items) => {
    console.log("LIKE CLICK:::", isLiked);

    setLoading(true)
    var data = {
      post_id: items,
      reaction_type: "like"
    }
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    const { responseJson, err } = await requestPostApi(connect_people_like_post, data, 'POST', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.headers.success == 1) {
      setData([...Data])
      Toast.show({ text1: responseJson.headers.message });
    } else {

      setalert_sms(err)
      setMy_Alert(true)
    }
  }

  const Dislikepost = async (items) => {
    console.log("DISLIKE CLICK:::", isLiked);

    setLoading(true)
    var data = {
      post_id: items,
      reaction_type: "dislike"
    }
    console.log('====================================');
    console.log(data);
    console.log('====================================');
    const { responseJson, err } = await requestPostApi(connect_people_dislike_post, data, 'POST', User.token)
    setLoading(false)
    console.log('the res==>>', responseJson)
    if (responseJson.headers.success == 1) {
      setData([...Data])
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
  // const likeChildComment = (parentId, childIndex) => {
  //   const upDataCopy = [...upData]
  //   upDataCopy.map(el => {
  //     if (el.id === parentId) {
  //       el.replies[childIndex].isLiked = !el.replies[childIndex].isLiked
  //     }
  //     return el
  //   })
  //   setupData([...upDataCopy])
  // }

  const returnOneReply = (itemid) => {
    // const replies = commentdata?.find(el => el.id === itemid)?.replyComments
    // if (replies?.length === 0) {
    //   return
    // }
    // return (

    //   <View style={{ width: '90%', marginLeft: 30, marginTop: 10 }}>
    //     {replies?.length > 1 ?
    //       <TouchableOpacity onPress={() => { setShowAtUsername(false); setReplyingTo(itemid); setShowRepliesModal(true) }} style={{ marginBottom: 10 }}>
    //         <Text style={{ fontSize: 14, fontWeight: '500', color: '#0089CF' }}>{`View previous ${replies?.length - 1} replies`}</Text>
    //       </TouchableOpacity>
    //       : null}
    //     <View style={{ flexDirection: 'row', alignItems: 'center' }}>
    //       <Image style={{ height: 40, width: 40 }} source={replies[0].img} />
    //       <Text style={{ fontSize: 18, fontWeight: '500', color: '#000', marginLeft: 10 }}>{replies[0].name}</Text>
    //       <Text style={{ fontSize: 12, fontWeight: '400', color: '#B4BBC6', marginLeft: 20 }}>{replies[0].time}</Text>
    //     </View>
    //     <View style={{ marginTop: 10 }}>
    //       <Text numberOfLines={1} style={{ fontSize: 14, fontWeight: '400', color: '#272727' }}>{replies[0].message}</Text>
    //     </View>
    //     {/* <View style={{marginTop:15, flexDirection:'row', alignItems:'center', justifyContent:'space-between'}}>
    //   <View style={{flexDirection:'row', alignItems:'center'}}>
    //     <TouchableOpacity onPress={()=>{likeChildComment(itemid, index)}}>
    //       <Image source={replies[0].isLiked ? require('../../../assets/images/people-sel-heart.png') : require('../../../assets/images/people-unsel-heart.png')} style={{width:30, height:30}}/>
    //     </TouchableOpacity>
    //     <Text style={{fontSize:14, fontWeight:'500', color:'#B4BBC6', marginLeft:10}}>Like</Text>
    //   </View>
    //   <TouchableOpacity onPress={()=>{myTextInput.current.focus(); setUserMessage(`@${replies[0].name}`); setReplyingTo(itemid)}} style={{flexDirection:'row', alignItems:'center'}}>
    //     <Image source={require('../../../assets/images/people-reply-image.png')}/>
    //     <Text style={{fontSize:14, fontWeight:'500', color:'#B4BBC6', marginLeft:10}}>Reply</Text>
    //   </TouchableOpacity>
    // </View> */}
    //   </View>
    // )
  }
  return (
    <SafeAreaView scrollEnabled={scrollEnabled} style={{ backgroundColor: 'transparent' }}>
      {!showRepliesModal ?
        <HomeHeaderRoundBottom height={80} paddingHorizontal={15} backgroundColor='#fff'
          press1={() => { props.navigation.goBack() }} img1={require('../../../assets/images/events_arrow.png')} img1width={25} img1height={20}
          press2={() => { }} title2={'Comments'} fontWeight={'500'} img2height={20} color='#455A64'
          press3={() => { }} img3width={25} img3height={25} />
        : null}
      <ScrollView>
      {
            commentdata.length != 0 ?
        <View style={{ width: '95%', alignSelf: 'center', marginTop: 10,height:'auto' }}>

          
              <View style={{ width: '100%', alignSelf: 'center', }}>
                <FlatList
                  data={commentdata}
                  showsHorizontalScrollIndicator={false}
                  numColumns={1}
                  keyExtractor={item => item.id}
                  renderItem={({ item, index }) => {
                    return (
                      <View style={{ width: dimensions.SCREEN_WIDTH * 0.9, marginHorizontal: 5, marginBottom: 15, paddingHorizontal: 20 }}>
                        <>
                          <View>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                              <Image source={require('../../../assets/images/comment-person-image.png')} />
                              <Text style={{ fontSize: 18, fontWeight: '500', color: '#000', marginLeft: 10 }}>{item.first_name + '' + item.last_name}</Text>
                              <Text style={{ fontSize: 12, fontWeight: '400', color: '#B4BBC6', marginLeft: 20 }}>{item.created_date.slice(11, 16)}</Text>
                            </View>
                            <View style={{ marginTop: 10 }}>
                              <Text style={{ fontSize: 14, fontWeight: '400', color: '#272727' }}>{item.comment}</Text>
                            </View>
                            <View style={{ marginTop: 15, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <TouchableOpacity onPress={() => { item.is_liked ? Dislikepost(item.id) : Likepost(item.id) }} style={{ marginRight: 10 }}>
                                  <Image source={item.is_liked ? require('../../../assets/images/people-sel-heart.png') : require('../../../assets/images/people-like.png')} style={{ width: 25, height: 25 }} />
                                </TouchableOpacity>
                                {/* <TouchableOpacity onPress={() => { setupData(upData.map((el, elIndex) => index === elIndex ? { ...el, isLiked: !item.isLiked } : el)) }}>
                    <Image source={item.isLiked ? require('../../../assets/images/people-unsel-heart.png') : require('../../../assets/images/people-sel-heart.png')} style={{ width: 30, height: 30 }} />
                  </TouchableOpacity> */}
                                <Text style={{ fontSize: 14, fontWeight: '500', color: '#B4BBC6', marginLeft: 10 }}>Like</Text>
                              </View>
                              <TouchableOpacity onPress={() => { setShowAtUsername(true); setReplyingTo(item.id); setShowRepliesModal(true); }} style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <Image source={require('../../../assets/images/people-reply-image.png')} />
                                <Text style={{ fontSize: 14, fontWeight: '500', color: '#B4BBC6', marginLeft: 10 }}>Reply</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                          <View style={{ borderBottomColor: '#E0E0E0', borderBottomWidth: 1, marginTop: 10 }} />
                          {item?.replyComments?.length > 0 ?
                            <>
                              {returnOneReply(item.post_id)}
                            </>
                            : null}
                        </>
                      </View>
                    )
                  }}

                />
              </View>
             


        </View>
        
         :
         <View style={{ width: '100%', alignSelf: 'center',height:'100%' }}>
         <Text style={{ fontSize: 14, fontWeight: '500', color: '#B4BBC6', marginLeft: 10 }}> </Text>
         </View>
     }
        
        <View style={{ height: 180 }} />
      </ScrollView>
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
      <View style={{height:'90%',justifyContent:'flex-end'}}>
      <RepliesModal
        isVisible={showRepliesModal}
        setIsVisible={setShowRepliesModal}
        data={commentdata}
        setData={setCommentdata}
        replyingTo={replyingTo}
        setReplyingTo={setReplyingTo}
        showAtUsername={showAtUsername}
      // likeChildComment={likeChildComment}
      // startFromIndex={startFromIndex}
      />
      </View>
      {loading ?
        <Loader />
        : null}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  addCommentView: {
    position: 'absolute',
    bottom: 80,
    width: '100%',
    backgroundColor: '#fff',
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