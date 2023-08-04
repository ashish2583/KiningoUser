import React, { useEffect, useState } from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack'



import CookingPost from '../pages/Creation/Cooking/CookingPost';

import CookingUpload from '../pages/Creation/Cooking/CookingUpload';

import CookingCategories from '../pages/Creation/Cooking/CookingCategories';

import CookingViewAll from '../pages/Creation/Cooking/CookingViewAll';

import CookingProfile from '../pages/Creation/Cooking/CookingProfile';

import CookingEditArticle from '../pages/Creation/Cooking/CookingEditArticle';

import AllCookingSuggested from '../pages/Creation/Cooking/AllCookingSuggested';

import CookingNotifications from '../pages/Creation/Cooking/CookingNotifications';
import CookingHome from '../pages/Creation/Cooking/CookingHome';
const CreationCooking = (props) => {

    const Stack = createNativeStackNavigator();

    return (

        <Stack.Navigator
            screenOptions={{ headerShown: false, }}
        >
            <Stack.Screen component={CookingHome} name="CookingHome" />
            <Stack.Screen component={CookingPost} name="CookingPost" />
            <Stack.Screen component={CookingUpload} name="CookingUpload" />
            <Stack.Screen component={CookingCategories} name="CookingCategories" />
            <Stack.Screen component={CookingViewAll} name="CookingViewAll" />
            <Stack.Screen component={CookingProfile} name="CookingProfile" />
            <Stack.Screen component={CookingEditArticle} name="CookingEditArticle" />
            <Stack.Screen component={AllCookingSuggested} name="AllCookingSuggested" />
            <Stack.Screen component={CookingNotifications} name="CookingNotifications" />


        </Stack.Navigator>

    )
}




export default CreationCooking