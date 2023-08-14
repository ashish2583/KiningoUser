import React from "react"
import {View, Text, StyleSheet, Image, TouchableOpacity} from 'react-native'
import { useNavigation } from "@react-navigation/native"

const THEME_BLUE = `#0089CF`

const JobsHeader = ({text}) => {
    const navigation = useNavigation()
    const goBack = () => {navigation.goBack()}
    return (
        <View style={styles.headerContainer} >
            <TouchableOpacity onPress={goBack} >
                <Image source={require('../assets/images/arrow-left.png')} />
            </TouchableOpacity>
            <Text style={styles.headerText}>{text}</Text>
            <Image source={require('../assets/images/arrow-left.png')} style={{opacity:0}}/>
        </View>
    )
}
export default JobsHeader

const styles = StyleSheet.create({
    headerContainer:{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'space-between',
        backgroundColor: THEME_BLUE,
        borderBottomRightRadius:20,
        borderBottomLeftRadius:20,
        paddingHorizontal:20,
        paddingTop:16.6,
        paddingBottom:66.6,
        width:'100%',
        zIndex: -10,

        shadowColor: '#E0E0E0',
        shadowOffset: {
        width:0,
        height:3
        }, 
        shadowRadius: 5,
        shadowOpacity: 1,
        elevation: 5,
    },
    headerText:{
        color:'white', 
        fontSize:16,
        fontWeight:'500',
    }
})