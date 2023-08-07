import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";

const JobsSearch = ({ value, setValue }) => {
  return (
    <View style={styles.searchContainer}>
      <View style={styles.searchLeftContainer}>
        <Image source={require("../assets/images/jobs-search.png")} />
        <TextInput
          placeholder="Search a job or position"
          placeholderTextColor="#95969D"
          value={value}
          onChangeText={(e) => {
            setValue(e);
          }}
          style={styles.inputStyle}
        />
      </View>
      <TouchableOpacity style={styles.filterView} >
        <Image source={require("../assets/images/jobs-filter.png")} />
      </TouchableOpacity>
    </View>
  );
};
export default JobsSearch;

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    // width: "90%",
  },
  searchLeftContainer: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    width: "75%",
    borderRadius: 10,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  inputStyle: {
    backgroundColor: "white",
    fontSize: 14,
    fontWeight: "400",
    color: "#95969D",
    // width: "100%",
    marginLeft:13,
  },
  filterView:{
    alignItems:'center',
    justifyContent:'center',
    backgroundColor:'white',
    borderRadius:10,
    width: "15%",
    paddingVertical:15
  }
});
