import React, { Component } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Modal, Image } from 'react-native';
import { dimensions, Mycolors } from '../utility/Mycolors';

const Loader2 = ({text = ''}) => {
    

        
        return (
                <>
                  
                            <View style={{elevation:3,position:'absolute',height:dimensions.SCREEN_HEIGHT,width:'100%', flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', alignItems: 'center' }}>

                            {/* <View style={{ backgroundColor: 'white', borderRadius: 10, height: 130, width: 130, justifyContent: 'center', alignItems: 'center' }}>

                               
                                <Text style={{ textAlign: 'center', padding: 8 }} >Loading...</Text>

                            </View> */}
                            {/* <ActivityIndicator size="large" color='#FFF' /> */}
                            <View style={{backgroundColor:'white', height:200, width:'96%', borderRadius:20,justifyContent:'center', alignItems:'center'}}>
                            <Image 
                                source={require('../assets/fetchingLoader.gif')}  
                                style={{width: 100, height: 100 }}
                            />
                                <Text style={{color:'black', fontSize:20, fontWeight:'bold'}}>Fetching</Text>
                                <Text style={{color:Mycolors.GrayColor, fontSize:16, fontStyle: 'italic'}}>{text}...</Text>
                            </View>
                            </View>

                </>
        );
    
}

export default Loader2

