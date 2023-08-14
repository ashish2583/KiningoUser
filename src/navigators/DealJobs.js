import React, { useEffect, useState } from  'react' ;
import { createNativeStackNavigator} from '@react-navigation/native-stack'


import JobsHome from '../pages/Deal/Jobs/JobsHome';
import SearchJobs from '../pages/Deal/Jobs/SearchJobs';
import Profile from '../pages/Deal/Jobs/Profile';
import EditProfile from '../pages/Deal/Jobs/EditProfile';

const DealLearning=(props)=>{
   
    const Stack = createNativeStackNavigator();

    return(
       
           <Stack.Navigator
            screenOptions={{ headerShown:false,}}
             >
            <Stack.Screen component = {JobsHome} name="JobsHome" />
            <Stack.Screen component = {SearchJobs} name="SearchJobs" />
            <Stack.Screen component = {Profile} name="Profile" />
            <Stack.Screen component = {EditProfile} name="EditProfile" />
            

        </Stack.Navigator>

)
}




export default DealLearning