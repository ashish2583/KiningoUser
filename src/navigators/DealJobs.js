import React, { useEffect, useState } from  'react' ;
import { createNativeStackNavigator} from '@react-navigation/native-stack'


import JobsHome from '../pages/Deal/Jobs/JobsHome';
import SearchJobs from '../pages/Deal/Jobs/SearchJobs';
import Profile from '../pages/Deal/Jobs/Profile';
import EditProfile from '../pages/Deal/Jobs/EditProfile';
import AddWorkExp from '../pages/Deal/Jobs/AddWorkExp';
import AddEducation from '../pages/Deal/Jobs/AddEducation';
import AddAppreciaton from '../pages/Deal/Jobs/AddAppreciaton';

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
            <Stack.Screen component = {AddWorkExp} name="AddWorkExp" />
            <Stack.Screen component = {AddEducation} name="AddEducation" />
            <Stack.Screen component = {AddAppreciaton} name="AddAppreciaton" />
            

        </Stack.Navigator>

)
}




export default DealLearning