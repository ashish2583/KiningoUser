// import React from 'react'
// import { View, Text, TouchableOpacity, Image } from 'react-native'
// import { dimensions, Mycolors } from '../utility/Mycolors';


// const HomeHeader = (props) => {
//     return (
//         <View
//             style={{
//                 height: props.height ? props.height : 'auto',
//                 width: '100%',
//                 padding: props.padding ? props.padding : 'auto',
//                 paddingVertical: props.paddingVertical ? props.paddingVertical : 'auto',
//                 paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 'auto',
//                 backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent',
//                 flexDirection: "row",
//                 justifyContent: 'space-between',
//                 alignItems: "center",
//             }}
//         >
//             {props.press1 ?
//                 <TouchableOpacity style={{
//                     width: props.img1width ? props.img1width : 'auto',
//                     height: props.img1height ? props.img1height : 'auto',
//                     justifyContent: 'center',
//                     padding: props.img1padding ? props.img1padding : 'auto',
//                     borderRadius: props.img1borderRadius ? props.img1borderRadius : 0,
//                     backgroundColor: props.img1backgroundColor ? props.img1backgroundColor : 'transparent'
//                 }} onPress={props.press1}>
//                     {props.img1 ?
//                         <Image source={props.img1} style={{ width: '100%', height: '100%', alignSelf: 'center' }}></Image>
//                         : null}
//                 </TouchableOpacity>
//                 : null
//             }

//             {props.press2 ?
//                 <TouchableOpacity style={{
//                     width: props.img2width ? props.img2width : 'auto',
//                     height: props.img2height ? props.img2height : 'auto',
//                     justifyContent: 'center',
//                 }} onPress={props.press2}>
//                     {props.img2 ?
//                         <Image source={props.img2} style={{ width: '100%', height: '100%', alignSelf: 'center' }}></Image>
//                         : null}
//                     {props.title2 ?
//                         <View style={{}}>
//                             <Text style={{ fontWeight: props.fontWeight ? props.fontWeight : 'normal', fontSize: props.fontSize ? props.fontSize : 14, color: props.color ? props.color : Mycolors.Black, right: props.right ? props.right : 'auto' }}>{props.title2}</Text>
//                         </View>
//                         : null}
//                 </TouchableOpacity>
//                 : null
//             }

//             {props.press3 ?
//                 <TouchableOpacity style={{
//                     width: props.img3width ? props.img3width : 'auto',
//                     height: props.img3height ? props.img3height : 'auto',
//                     justifyContent: 'center',
//                     padding: props.img3padding ? props.img3padding : 'auto',
//                     borderRadius: props.img3borderRadius ? props.img3borderRadius : 0,
//                     backgroundColor: props.img3backgroundColor ? props.img3backgroundColor : 'transparent'

//                 }} onPress={props.press3}>
//                     {props.img3 ?
//                         <Image source={props.img3} style={{ width: '100%', height: '100%', alignSelf: 'center' }}></Image>
//                         : null}
//                 </TouchableOpacity>
//                 : null
//             }

//         </View>
//     )
// }

// export default HomeHeader;


import React from 'react'
import { View, Text, TouchableOpacity, Image } from 'react-native'
//import { dimensions, Mycolors } from '../utility/Mycolors';
import { dimensions, Mycolors } from '../../../../utility/Mycolors';
import { useSelector, useDispatch } from 'react-redux';


const HomeHeader = (props) => {
    const dispatch = useDispatch();
    const chatindictor = useSelector(state => state.user.cooking_counter);
    console.log('User from header', chatindictor);
    return (
        <View
            style={[{
                height: props.height ? props.height : 'auto',
                width: '100%',
                padding: props.padding ? props.padding : 'auto',
                paddingVertical: props.paddingVertical ? props.paddingVertical : 'auto',
                paddingHorizontal: props.paddingHorizontal ? props.paddingHorizontal : 'auto',
                backgroundColor: props.backgroundColor ? props.backgroundColor : 'transparent',
                borderBottomLeftRadius: props.borderBottomLeftRadius ? props.borderBottomLeftRadius : 0,
                borderBottomRightRadius: props.borderBottomRightRadius ? props.borderBottomRightRadius : 0,
                flexDirection: "row",
                justifyContent: 'space-between',
                alignItems: "center",
                shadowColor: '#E0E0E0',
                shadowOffset: {
                    width: 0,
                    height: 3
                },
                shadowRadius: 5,
                shadowOpacity: 1,
                elevation: 5,
            }, props.extraStyle]}
        >
            {props.press1 ?
                <TouchableOpacity style={{
                    width: props.img1width ? props.img1width : 'auto',
                    height: props.img1height ? props.img1height : 'auto',
                    justifyContent: 'center',
                    padding: props.img1padding ? props.img1padding : 'auto',
                    borderRadius: props.img1borderRadius ? props.img1borderRadius : 0,
                    backgroundColor: props.img1backgroundColor ? props.img1backgroundColor : 'transparent'
                }} onPress={props.press1}>
                    {props.img1 ?
                        <Image source={props.img1} style={{ width: '100%', height: '100%', alignSelf: 'center' }}></Image>
                        : null}

                </TouchableOpacity>
                : null
            }

            {props.press2 ?
                <TouchableOpacity style={{
                    width: props.img2width ? props.img2width : 'auto',
                    height: props.img2height ? props.img2height : 'auto',
                    justifyContent: 'center',
                }} onPress={props.press2}>
                    {props.img2 ?
                        <Image source={props.img2} style={{ width: '100%', height: '100%', alignSelf: 'center' }}></Image>
                        : null}
                    {props.title2 ?
                        <View style={{}}>
                            <Text style={{ fontWeight: props.fontWeight ? props.fontWeight : 'normal', fontSize: props.fontSize ? props.fontSize : 14, color: props.color ? props.color : Mycolors.Black, right: props.right ? props.right : 'auto' }}>{props.title2}</Text>
                        </View>
                        : null}
                </TouchableOpacity>
                : null
            }
            <View style={{ flexDirection: 'row', }}>
                {props.press4 ?
                    <TouchableOpacity style={{
                        width: props.img4width ? props.img4width : 'auto',
                        height: props.img4height ? props.img4height : 'auto',
                        justifyContent: 'center',


                    }} onPress={props.press4}>
                        {props.img4 ?
                            <Image source={props.img4} style={{ width: '100%', height: '100%', alignSelf: 'center', borderRadius: 30, marginRight: 34 }}></Image>
                            : null}
                    </TouchableOpacity>
                    : null
                }
                {props.press3 ?
                    <TouchableOpacity style={{
                        width: props.img3width ? props.img3width : 'auto',
                        height: props.img3height ? props.img3height : 'auto',
                        justifyContent: 'center',
                    }} onPress={props.press3}>
                        {props.img3 ?
                            <>
                                <Image source={props.img3} style={{ width: '100%', height: '100%', alignSelf: 'center' }}></Image>
                                {chatindictor > 0 ? <View style={{ position: 'absolute', right: -5, top: -10, width: 20, height: 20, borderRadius: 20, backgroundColor: 'white', justifyContent: 'center', zIndex: 999 }}>
                                </View> : null}
                            </> : null}

                    </TouchableOpacity>
                    : null
                }

            </View>
        </View>
    )
}
export default HomeHeader;


