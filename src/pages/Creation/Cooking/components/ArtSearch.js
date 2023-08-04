import React from 'react'
import { View, Text, TouchableOpacity, Image, TextInput, Keyboard, StyleSheet } from 'react-native'
import { Mycolors } from '../../../../utility/Mycolors'


const ArtSearch = (props) => {
    return (

        <TouchableOpacity
            // {props.press1 ?
            //     <TouchableOpacity style={{
            //         width: props.img1width ? props.img1width : 'auto',
            //         height: props.img1height ? props.img1height : 'auto',
            //         justifyContent: 'center',
            //         padding: props.img1padding ? props.img1padding : 'auto',
            //         borderRadius: props.img1borderRadius ? props.img1borderRadius : 0,
            //         backgroundColor: props.img1backgroundColor ? props.img1backgroundColor : 'transparent'
            //     }} onPress={props.press1}></TouchableOpacity> : null}
            onPress={props.press}
            style={{
                width: '100%', height: 55, backgroundColor: '#fff', alignSelf: 'center', flexDirection: 'row',
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 3
                },
                shadowRadius: 1,
                shadowOpacity: 0.3,
                // justifyContent: 'center',
                alignItems: 'center',
                elevation: 5,
                borderRadius: 5,
                alignSelf: 'center', marginTop: props.marginTop ? props.marginTop : 'auto'
            }}  >
            <View style={{ width: '100%', height: 45, backgroundColor: Mycolors.BG_COLOR, borderRadius: 8 }}>

                <View style={{
                    width: '100%', height: 45, borderRadius: 8, backgroundColor: Mycolors.LogininputBox, alignSelf: 'center',
                    //  shadowColor: '#000',
                    //  shadowOffset: {
                    //    width: 0,
                    //    height: 3
                    //  },
                    //  shadowRadius: 1,
                    //  shadowOpacity: 0.3,
                    //  justifyContent: 'center',
                    //  elevation: 5,
                }}>
                    {/* <TextInput
                        style={[styles.input, { paddingLeft: props.paddingLeft ? props.paddingLeft : 5 }]}
                        // maxLength={ props.multiline ? 1000 : 40}
                        value={props.serchValue}
                        autoCapitalize={props.autoCapitalize}
                        numberOfLines={1}
                        //   onFocus={() =>  props.onFocus ?  props.onFocus() :  setState({isFocus:true})}
                        //   onBlur={() =>  props.onBlur ?  props.onBlur() :  setState({isFocus:false})}
                        ref={props.inputRef}
                        secureTextEntry={props.passwordType ? props.passwordType : false}
                        blurOnSubmit={props.blurOnSubmit}
                        keyboardType={props.keyboardType}
                        returnKeyType={props.returnKeyType}
                        placeholder={props.placeholder}
                        textContentType={props.textContentType}
                        onSubmitEditing={props.multiline ? null : Keyboard.dismiss}
                        placeholderTextColor={'#8F93A0'}
                        onChangeText={props.onChangeText ? (text) => props.onChangeText({ text }) : () => { }}
                        editable={props.editable}
                        multiline={props.multiline}
                    /> */}
                    <Text style={[styles.input, { paddingLeft: props.paddingLeft ? props.paddingLeft : 5 }]}>Search by categories</Text>
                    <View style={{ width: '14%', height: 45, backgroundColor: 'transparent', borderRadius: 8, right: 5, position: 'absolute' }}>
                        <TouchableOpacity style={{ width: 45, height: 45, justifyContent: 'center', backgroundColor: Mycolors.LogininputBox, borderRadius: 8 }}
                            onPress={props.presssearch}>
                            <Image source={props.searchIcon ? props.searchIcon : require('../../../../assets/images/service-search-icon.png')} style={{ width: 22, height: 22, alignSelf: 'center', tintColor: '#ED1C24' }}></Image>
                        </TouchableOpacity>
                    </View>

                </View>
            </View>
            {/* <View style={{width:'14%',height:45,backgroundColor:'transparent',borderRadius:8,left:5,}}>
    <TouchableOpacity style={{width:45,height:45,justifyContent:'center',backgroundColor:Mycolors.LogininputBox,borderRadius:8}}
    onPress={props.press}>
    <Image source={require('../assets/images/shape_32.png')} style={{ width: 18, height: 18, alignSelf: 'center'}}></Image>
    </TouchableOpacity>

</View> */}
        </TouchableOpacity>

    )
}

const styles = StyleSheet.create({

    container: {
        flex: 1,
        backgroundColor: Mycolors.BG_COLOR
    },
    input: {
        paddingRight: 10,
        height: 45,
        width: '100%',
        fontSize: 13,
        // borderColor: Mycolors.GrayColor,
        // borderWidth:1,
        backgroundColor: Mycolors.LogininputBox,
        borderRadius: 15,
        color: Mycolors.TEXT_COLOR,
        marginTop: 15,
        color: '#ED1C24'
        //   textAlignVertical: 'top',
    },
});
export default ArtSearch;









