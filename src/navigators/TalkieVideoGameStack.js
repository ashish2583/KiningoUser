import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'

import VideoGameHome from '../pages/Talkie/VideoGame/VideoGameHome';
import VideoNewsfeed from '../pages/Talkie/VideoGame/VideoNewsfeed';
import VideoUpload from '../pages/Talkie/VideoGame/VideoUpload';
import VideoGamedetails from '../pages/Talkie/VideoGame/VideoGamedetails';
import SearchVideosByCategoryByName from '../pages/Talkie/VideoGame/SearchVideosByCategoryByName';
import SearchVideosByCategory from '../pages/Talkie/VideoGame/SearchVideosByCategory';
import AllVideos from '../pages/Talkie/VideoGame/AllVideos';
import VideoProfile from '../pages/Talkie/VideoGame/VideoProfile';
import VideoNotification from '../pages/Talkie/VideoGame/VideoNotification';

 

 
const VideoGameStack = (props) => {

    const Stack = createNativeStackNavigator();

    return (

        <Stack.Navigator
            screenOptions={{ headerShown: false, }}
        >
            <Stack.Screen component={VideoGameHome} name="VideoGameHome" />
            <Stack.Screen component={VideoGamedetails} name="VideoGamedetails" />
            <Stack.Screen component={VideoNewsfeed} name="VideoNewsfeed" />
            <Stack.Screen component={VideoUpload} name="VideoUpload" />
            <Stack.Screen component={SearchVideosByCategoryByName} name="SearchVideosByCategoryByName" />
            <Stack.Screen component={SearchVideosByCategory} name="SearchVideosByCategory" />
            <Stack.Screen component={AllVideos} name="AllVideos" />
            <Stack.Screen component={VideoProfile} name="VideoProfile" />
            <Stack.Screen component={VideoNotification} name="VideoNotification" />
            

        </Stack.Navigator>

    )
};
export default VideoGameStack