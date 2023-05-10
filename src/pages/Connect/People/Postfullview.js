import React, { useEffect, useState, useRef } from 'react';
import { View, Image, Text, StyleSheet, SafeAreaView, TextInput, FlatList, Alert, RefreshControl, TouchableOpacity, ScrollView, ImageBackground } from 'react-native';
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
import ViewMoreText from 'react-native-view-more-text';
import ReadMoreComponent from './Components/ReadMoreComponent';
import VideoPlayer from 'react-native-video-player'
import { connect_people_dislike_post, connect_people_follow_user, connect_people_home_page, connect_people_like_post, connect_people_react_post, connect_people_save_post, connect_people_unfollow_user, requestGetApi, requestPostApi, } from '../../../WebApi/Service';
import Loader from '../../../WebApi/Loader';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { saveUserResult, saveUserToken, setVenderDetail, onLogoutUser, setUserType } from '../../../redux/actions/user_action';
import { useSelector, useDispatch } from 'react-redux';
import Share from 'react-native-share';

const Postfullview = (props) => {
  const dispatch = useDispatch();
  const User = useSelector(state => state.user.user_details)
  

  
   
   
   
  return (
    <>
    </>
  );
}
const styles = StyleSheet.create({
  topButtonView: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    shadowColor: '#0089CF',
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 1,
    shadowOpacity: 0.1,
    elevation: 5,
  },
   
});
export default Postfullview 