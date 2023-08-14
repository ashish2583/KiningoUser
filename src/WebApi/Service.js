import React, { useEffect, useState, useRef } from "react";
import { View, useColorScheme } from "react-native";
import { useSelector, useDispatch } from "react-redux";
// import * as types  from '../redux/types';

export const baseUrl = "http://54.153.75.225/backend/api/v1/";
// shop/eat
//API END POINT LISTS

export const register = "auth/register";
export const login = "auth/login";
export const verify_otp = "auth/verify-otp";
export const shop_eat = "shop/eat";
export const vendor_lists_subcat = "shop/eat/vendor-lists?subcat=";
export const shop_eat_business = "shop/eat/business";
export const shop_eat_business_id = "shop/eat/business/id/";
export const shop_eat_menu_userid = "shop/eat/vendor-menu/";
export const shop_eat_cart = "shop/eat/cart";
export const shop_eat_cart_id = "shop/eat/cart/id/";
export const shop_eat_coupons_userid = "shop/eat/coupons/userid/";
export const shop_eat_cart_apply_coupon = `shop/eat/cart/apply-coupon`;
export const user_payment_method = `user/payment-method`;
export const user_address = `user/address`;
export const shop_eat_cart_place_order = `shop/eat/cart/place-order`;
export const shop_eat_cart_book_dining = `shop/eat/cart/book-dining`;
export const shop_eat_cart_book_table = `shop/eat/cart/book-table`;
export const shop_eat_orders = `shop/eat/orders`;
export const delete_Update_Address = `user/address/id/`;
export const cancelOrders = `orders`;
export const vendor_reviews = `vendor/reviews`;
export const shop_eat_menu = `shop/eat/menu/userid/`;
export const auth_send_otp = `auth/send-otp`;
export const profile = "user/profile";
export const menu_AllCategoryNames = `menu/AllCategoryNames`;
export const menu_categorySearch_attribute_name = `menu/categorySearch?attribute_name=`;
export const driver_reviews = `user/review`;
export const shop_remove_coupon = `shop/eat/cart/remove-coupon`;
export const notification_list = `/user/notification/list`;
export const shop_product = "shop/product/";
export const shop_product_business = "shop/product/business";
export const shop_product_business_userid = "shop/product/business/userid/";
export const shop_product_cart = "shop/product/cart";
export const shop_product_productlist = `shop/product/productList/userid/`;
export const shop_product_delete_cart_item = `shop/product/cart/id/`;
export const shop_product_details = `shop/product/productDetails/id/`;
export const shop_product_cart_place_order = `shop/product/cart/place-order`;
export const shop_product_remove_coupon = `shop/product/cart/remove-coupon`;
// start: new apis yet to be created
export const shop_product_coupons_userid = "shop/product/coupons/userid/";
export const shop_product_cart_apply_coupon = `shop/product/cart/apply-coupon`;
// end: new apis yet to be created
export const shop_product_similar_Products = `shop/product/similar-products?name=`;
export const shop_product_category_names = `shop/product/AllCategoryNames`;
export const user_selected_address = `user/selectedAddress/`;
export const user_selectedAddress = `user/selectedAddress`;
export const selectAddress_id = `user/selectAddress/id/`;
export const shop_product_home = `shop/product/home`;
export const shop_vendor_details = `shop/product/business/id/`;
export const shop_product_categories = `shop/product/categories`;
export const shop_product_business_bycategory = `shop/product/business/byCategory?`;
export const shop_product_orders = `shop/product/orders`;

export const driver_corporate_vehicle = `driver/corporate_vehicle`;
export const buy_subscription = `driver/buy_subscription`;
export const buy_corporate_subscription = `driver/buy_corporate_subscription`;
export const auth_resend_otp = `auth/resend_otp`;
export const driver_dashboard = `driver/dashboard`;
export const driver_corporate_dashboard = `driver/corporate_dashboard`;
export const booking_complete_ride = `booking/complete_ride`;
export const driver_rides = `driver/rides`;
export const driver_ride_details = `driver/ride_details?ride_id=`;
export const user_notifications = "user/notifications";
export const user_notification_change = "user/notification_change";
export const driver_logout = "driver/logout";
export const driver_change_status = "driver/change_status";
export const booking_bid_price = "booking/bid_price?ride_id=";
export const driver_fuel_cost = "driver/fuel_cost";
export const driver_referral_earning = "driver/referral_earning";
export const driver_change_account_status = "driver/change_account_status";

export const add_movie = "talkie/movie";
export const get_movies = "talkie/movie";
export const get_single_movie_video = "talkie/movie-video/id/";
export const post_movie_review = "talkie/movie-review";

export const game_category = "common/talkie/game-category";
export const game_video = "talkie/game-video";
export const game = "talkie/game";
export const game_single_video = "talkie/game-video/id/";
export const game_review = "talkie/game-review";
export const get_banner_image = `/admin/banner-image-upload/id/`
export const game_add_comment = `talkie/add-comment-game`
export const creation_common_add_views = "creation/common/add-views/";
export const game_profile = "talkie/game/dashboard";
export const game_like = "talkie/react-game";

export const deal_job_profile = "deal/job/demand/profile/";


export const creation_categories = `/creation/common/categories`
export const creation_home = `/creation/common/home-page/51`
export const creation_Commonhome = `/creation/common/home-page/`
export const creation_react = `/creation/common/react-article/`
export const creation_get_report = `/creation/common/report-reasons`
export const creation_post_report = `/creation/common/report-article/`
export const creation_article = `creation/common/get-article/`
export const creation_addPhoto = `/creation/common/add-profile-image`
export const creation_profile = `/creation/common/user-profile/`
export const creation_delete = `/creation/common/delete-article/`
export const creation_addViews = `/creation/common/add-views/`
export const creation_getNotifications = `/creation/common/get-notificationlist/`
export const creation_addComments = `/creation/common/add-comment/`
export const creation_reactComment = `/creation/common/react-comment/`
export const creation_getComment = `/creation/common/all-comments/`
export const creation_editComment = `/creation/common/edit-comment/`
export const creation_deleteComment = `/creation/common/delete-comment/`
export const creation_editArticle = `/creation/common/edit-article/`
export const creation_addView = `/creation/common/add-views/`
export const creation_getView = `/creation/common/suggested-articles-bycategory/`
export const creation_searchHome = `/creation/common/home-page/51?page_no=1&limit=10`
export const creation_deletenoti = `/creation/common/clear-notifications/`

export const requestPostApi = async (endPoint, body, method, token) => {
  console.log("the token is :-", token);
  var header = {};
  if (token != "" && token != undefined) {
    header = {
      "Content-Type": "application/json",
      Authorization: "Bearer " + token,
      "Cache-Control": "no-cache",
    };
  } else {
    header = { "Content-Type": "application/json", Accept: "application/json" };
  }

  var url = baseUrl + endPoint;
  console.log("post Request Url:-" + url + "\n");
  console.log("the body data", body);
  // console.log(header + '\n')
  try {
    let response = await fetch(url, {
      method: method,
      body: body == "" ? "" : JSON.stringify(body),
      headers: header,
    });
    let code = await response.status;
    console.log("the api responce is", code);
    //  let responseJ = await response.json();
    //  console.log('the api responce is',responseJ.headers)
    if (code == 200) {
      let responseJson = await response.json();
      console.log(responseJson);
      return { responseJson: responseJson, err: null };
    } else if (code == 400 || code == 402) {
      let responseJson = await response.json();
      //Completion block
      return { responseJson: responseJson, err: responseJson.headers.message };
    } else {
      let responseJson = await response.json();
      // console.log(responson)
      return { responseJson: responseJson, err: responseJson.headers.message };
    }
  } catch (error) {
    console.log("the error is", error);
    return {
      responseJson: null,
      err: "Something Went Wrong! Please check your internet connection.",
    };
    // return {responseJson:null,err:error}
  }
};

export const requestGetApi = async (endPoint, body, method, token) => {
  console.log("the token is :-", token);
  var header = {};
  var url = baseUrl + endPoint;
  if (token != "" && token != undefined) {
    header = {
      "Content-Type": "multipart/form-data",
      Accept: "application/json",
      Authorization: "Bearer " + token,
      "Cache-Control": "no-cache",
    };
  } else {
    header = {};
  }

  //url = url + objToQueryString(body)
  console.log("Request Url:-" + url + "\n");
  try {
    let response = await fetch(url, {
      method: method,
      headers: header,
    });
    let code = await response.status;
    console.log(code);
    if (code == 200) {
      let responseJson = await response.json();
      console.log("Code 200==>>", responseJson);
      return { responseJson: responseJson, err: null, code: code };
    } else if (code == 400) {
      return { responseJson: null, err: responseJson.message, code: code };
    } else if (code == 500) {
      console.log(response);

      return { responseJson: null, err: "Something Went Wrong", code: code };
    } else {
      console.log(response);

      return { responseJson: null, err: "Something went wrong!", code: code };
    }
  } catch (error) {
    console.error(error);
    return {
      responseJson: null,
      err: "Something Went Wrong! Please check your internet connection.",
      code: 500,
    };
  }
};

export const requestPostApiMedia = async (
  endPoint,
  formData,
  method,
  token
) => {
  var header = {};

  if (token != "" && token != undefined) {
    header = {
      "Content-type": "multipart/form-data",
      apitoken: token,
      "Cache-Control": "no-cache",
    };
  } else {
    if (endPoint != signUpApi) {
      header = {
        "Content-type": "multipart/form-data",
        "Cache-Control": "no-cache",
      };
    }
  }

  var url = baseUrl + endPoint;
  console.log("Request Url:-" + url + "\n");
  console.log(formData + "\n");

  try {
    let response = await fetch(url, {
      method: method,
      body: formData,

      headers: header,
    });

    let code = await response.status;
    console.log(code);

    if (code == 200) {
      let responseJson = await response.json();
      console.log(responseJson);
      return { responseJson: responseJson, err: null };
    } else if (code == 400) {
      let responseJson = await response.json();
      return { responseJson: null, err: responseJson.message };
    } else {
      return { responseJson: null, err: "Something went wrong!" };
    }
  } catch (error) {
    console.error("the error of the uploade image is ==>>", error);
    return {
      responseJson: null,
      err: "Something Went Wrong! Please check your internet connection.",
    };
  }
};

export const requestPostApiSignUp = async (endPoint, formData, method) => {
  var url = baseUrl + endPoint;
  console.log("Request Url:-" + url + "\n");
  console.log(formData + "\n");

  try {
    let response = await fetch(url, {
      method: method,
      body: formData,
    });

    let code = await response.status;
    console.log(code);

    if (code == 200) {
      let responseJson = await response.json();
      console.log(responseJson);
      return { responseJson: responseJson, err: null };
    } else if (code == 400 || 402) {
      let responseJson = await response.json();
      console.log(responseJson);

      return { responseJson: null, err: responseJson.msg };
    } else {
      return { responseJson: null, err: "Something went wrong!" };
    }
  } catch (error) {
    return {
      responseJson: null,
      err: "Something Went Wrong! Please check your internet connection.",
    };
    console.error(error);
  }
};

const objToQueryString = (obj) => {
  const keyValuePairs = [];
  for (const key in obj) {
    keyValuePairs.push(
      encodeURIComponent(key) + "=" + encodeURIComponent(obj[key])
    );
  }
  return keyValuePairs.length == 0 ? "" : "?" + keyValuePairs.join("&");
};

//function : get api
export const getApi = (endPoint) =>
  axios
    .get(`${baseUrl}${endPoint}`)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error == `Error: Network Error`) {
        Alert.alert(
          "",
          `Internet connection appears to be offline. Please check your internet connection and try again.`
        );
      }
      console.log("data", error.response.data);
      console.log("status", error.response.status);
      console.log("headers", error.response.headers);
      return error;
    });
//function : post api
export const postApi = (endPoint, data) =>
  axios
    .post(`${baseUrl}${endPoint}`, data)
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error == `Error: Network Error`) {
        Alert.alert(
          "",
          `Internet connection appears to be offline. Please check your internet connection and try again.`
        );
      }
      console.log("data", error.response.data);
      console.log("status", error.response.status);
      console.log("headers", error.response.headers);
      return error;
    });
//function : get api with token
export const getApiWithToken = (token, endPoint) =>
  axios
    .get(`${baseUrl}${endPoint}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error == `Error: Network Error`) {
        Alert.alert(
          "",
          `Internet connection appears to be offline. Please check your internet connection and try again.`
        );
      }
      console.log("data", error.response.data);
      console.log("status", error.response.status);
      console.log("headers", error.response.headers);
      return error;
    });
//function : post api with token
export const postApiWithToken = (token, endPoint, data) =>
  axios
    .post(`${baseUrl}${endPoint}`, data, {
      headers: {
        Authorization: `Bearer${token}`,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error == `Error: Network Error`) {
        Alert.alert(
          "",
          `Internet connection appears to be offline. Please check your internet connection and try again.`
        );
      }
      console.log("data", error.response.data);
      console.log("status", error.response.status);
      console.log("headers", error.response.headers);
      return error;
    });
//function : put api with token
export const putApiWithToken = (token, endPoint, data) =>
  axios
    .put(`${baseUrl}${endPoint}`, data, {
      headers: {
        Authorization: `Bearer${token}`,
      },
    })
    .then((res) => {
      return res;
    })
    .catch((error) => {
      if (error == `Error: Network Error`) {
        Alert.alert(
          "",
          `Internet connection appears to be offline. Please check your internet connection and try again.`
        );
      }
      console.log("data", error.response.data);
      console.log("status", error.response.status);
      console.log("headers", error.response.headers);
      return error;
    });
