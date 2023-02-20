import React, { useEffect } from 'react';
import {SafeAreaView,LogBox,StatusBar,useColorScheme,View,} from 'react-native';
import MainNav from './src/navigators/MainNav'
import store from './src/redux/store/store';
import 'react-native-gesture-handler';
import 'react-native-get-random-values'
import {StripeProvider} from '@stripe/stripe-react-native';
import { NavigationContainer,DefaultTheme } from '@react-navigation/native'
import {Provider} from 'react-redux';

const App = () => {
  LogBox.ignoreAllLogs()
  //UI
  return (
    <StripeProvider
    publishableKey="pk_test_4sjCZIFhfIeMDj3bpJsFapZf"
    urlScheme="your-url-scheme" // required for 3D Secure and bank redirects
    merchantIdentifier="merchant.com.{{YOUR_APP_NAME}}" // required for Apple Pay
  >
    <Provider store={store}>
    <NavigationContainer theme={DefaultTheme}>
    <MainNav/>
   </NavigationContainer>
  </Provider>
  </StripeProvider>
  );
};

export default App;
