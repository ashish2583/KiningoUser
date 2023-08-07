import React, { useEffect, useState } from  'react' ;
import { createNativeStackNavigator} from '@react-navigation/native-stack'


import JobsHome from '../pages/Deal/Jobs/JobsHome';
import SearchJobs from '../pages/Deal/Jobs/SearchJobs';

const DealLearning=(props)=>{
   
    const Stack = createNativeStackNavigator();

    return(
       
           <Stack.Navigator
            screenOptions={{ headerShown:false,}}
             >
            <Stack.Screen component = {JobsHome} name="JobsHome" />
            <Stack.Screen component = {SearchJobs} name="SearchJobs" />
            

        </Stack.Navigator>

)
}




export default DealLearning