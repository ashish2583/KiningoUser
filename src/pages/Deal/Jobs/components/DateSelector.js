import {View, Text, TouchableOpacity, StyleSheet, Image} from 'react-native';
import React from 'react';

const DateSelector = ({Title = 'Today', onPress = () => {}, calendarViewStyle = {}}) => {
  return (
    <TouchableOpacity onPress={onPress} style={[styles.calendarView, calendarViewStyle]}>
      <View style={styles.selectedDateView}>
        <Text style={styles.dateText}>{Title}</Text>
      </View>
      <TouchableOpacity onPress={onPress}>
        <Image source={require('../assets/images/jobs-date-icon.png')} />
      </TouchableOpacity>
    </TouchableOpacity>
  );
};

export default DateSelector;

const styles = StyleSheet.create({
  calendarView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
    // marginVertical: 10,
    // shadowColor: '#000',
    // shadowOffset: {width: 0, height: 2},
    // shadowOpacity: 0.1,
    // shadowRadius: 15,
    // elevation: 2,
  },
  selectedDateView: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '85%',
    // borderWidth: 0.5,
    borderRadius: 10,
    paddingHorizontal: 10,
    height: 40,
  },
  calendarIcon: {
    backgroundColor: 'red',
    borderRadius: 5,
  },
  dateText:{
    color:'#AAA6B9',
    fontSize:12,
    fontWeight:'400'
  }
});
