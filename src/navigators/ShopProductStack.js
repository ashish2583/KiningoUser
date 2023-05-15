import React, { useEffect, useState } from  'react' ;
import { createNativeStackNavigator} from '@react-navigation/native-stack'


import Shop from '../pages/Shop/Shop';
import ShopProduct from '../pages/Shop/ShopProduct/ShopProduct';
import ShopProductDetails from '../pages/Shop/ShopProduct/ShopProductDetails';
import ShopProductAll from '../pages/Shop/ShopProduct/ShopProductAll';
import ShopCategoryAll from '../pages/Shop/ShopProduct/ShopCategoryAll';
import ShopCategoryProducts from '../pages/Shop/ShopProduct/ShopCategoryProducts';
import ShopMyOrder from '../pages/Shop/ShopProduct/ShopMyOrder';
import ShopReview from '../pages/Shop/ShopProduct/ShopReview';
import ShopPayment from '../pages/Shop/ShopProduct/ShopPayment';
import ShopProdCart from '../pages/Shop/ShopProduct/ShopProdCart';
import ShopSearch from '../pages/Shop/ShopProduct/ShopSearch';
import VendorSearch from '../pages/Shop/ShopProduct/VendorSearch';
import CategorySearch from '../pages/Shop/ShopProduct/CategorySearch';
import ShopProductSearch from '../pages/Shop/ShopProduct/ShopProductSearch';
import CatSearch from '../pages/Shop/ShopProduct/CatSearch';
import ShopMyOrderDetails from '../pages/Shop/ShopProduct/ShopMyOrderDetails';
import ShopProductFilter from '../pages/Shop/ShopProduct/ShopProductFilter';
const ShopProductStack=(props)=>{
   
    const Stack = createNativeStackNavigator();

    return(
       
           <Stack.Navigator
            screenOptions={{ headerShown:false,}}
             >
            <Stack.Screen component = {ShopProduct} name="ShopProduct" />
            <Stack.Screen component = {ShopProductDetails} name="ShopProductDetails" />
            <Stack.Screen component = {ShopProductAll} name="ShopProductAll" />
            <Stack.Screen component = {ShopCategoryAll} name="ShopCategoryAll" />
            <Stack.Screen component = {ShopCategoryProducts} name="ShopCategoryProducts" />
            <Stack.Screen component = {ShopMyOrder} name="ShopMyOrder" options={{gestureEnabled: false}} />
            <Stack.Screen component = {ShopReview} name="ShopReview" />
            <Stack.Screen component = {ShopPayment} name="ShopPayment" />
            <Stack.Screen component = {ShopProdCart} name="ShopProdCart" />
            <Stack.Screen component = {ShopSearch} name="ShopSearch" />
            <Stack.Screen component = {VendorSearch} name="VendorSearch" />
            <Stack.Screen component = {CategorySearch} name="CategorySearch" />
            <Stack.Screen component = {ShopProductSearch} name="ShopProductSearch" />
            <Stack.Screen component = {CatSearch} name="CatSearch" />
            <Stack.Screen component = {ShopMyOrderDetails} name="ShopMyOrderDetails" />
            <Stack.Screen component = {ShopProductFilter} name="ShopProductFilter" />
            <Stack.Screen component = {Shop} name="Shop" />
            

        </Stack.Navigator>

)
}




export default ShopProductStack