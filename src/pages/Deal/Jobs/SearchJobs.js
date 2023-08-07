import React, { useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
} from "react-native";
import JobsHeader from "./components/JobsHeader";
import JobsSearch from "./components/JobsSearch";
import { dimensions } from "../../../utility/Mycolors";

const recentJobList = [
  {
    id: "1",
    icon: require("./assets/images/google-icon.png"),
    companyName: "Google",
    jobTitle: "UI Designer",
    tags: ["Senior", "Full-Time", "Remote"],
    salary: "$8K/Month",
    location: "California, USA",
  },
  {
    id: "2",
    icon: require("./assets/images/google-icon.png"),
    companyName: "Google",
    jobTitle: "UI Designer",
    tags: ["Senior", "Full-Time", "Remote"],
    salary: "$8K",
    salaryMonth: "/Month",
    location: "California, USA",
  },
];

const JobsHome = (props) => {
  const [searchText, setSearchText] = useState("");

  const renderRecentJob = ({ item }) => {
    return (
      <View style={styles.recentJobsContainer}>
        <View style={styles.featuredTopRow}>
          <View style={styles.featuredTopLeftRow}>
            <View style={styles.recentIconBg}>
              <Image source={item.icon} />
            </View>
            <View style={{ marginLeft: 10 }}>
              <Text style={styles.recentCompN}>{item.companyName}</Text>
              <Text style={styles.recentLocation}>{item.location}</Text>
            </View>
          </View>
          <TouchableOpacity>
            <Image source={require("./assets/images/bookmark-2.png")} />
          </TouchableOpacity>
        </View>

        <View style={styles.recentMiddle}>
          <Text style={styles.recentBottomT}>{item.jobTitle}</Text>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            {item.tags?.map((el, index) => (
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Text style={styles.recentTagT}>{el}</Text>
                {!(item.tags.length - 1 === index) ? (
                  <View style={styles.tagDot}></View>
                ) : null}
              </View>
            ))}
          </View>
        </View>

        <View style={styles.recentBottomRow}>
          <MyButton text="Apply Now" style={{ width: "50%", backgroundColor:'#0089CF', paddingVertical: 11 }} />
          <Text style={styles.recentBottomT}>{item.salary}<Text style={styles.recentBottomT2}>{item.salaryMonth}</Text></Text>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={styles.mainView}
      >
        <JobsHeader text="Home" />
        <View style={styles.mainView2}>
          <JobsSearch value={searchText} setValue={setSearchText} />
          <FlatList
            data={recentJobList}
            style={{ marginTop: 10 }}
            keyExtractor={(item) => item.id}
            renderItem={renderRecentJob}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};
export default JobsHome;

const MyButton = ({ text, onPress, style = {} }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonT}>{text}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  safeView: {
    backgroundColor: "#F8F8F8",
    flex: 1,
  },
  mainView: {
    paddingBottom: "30%",
    alignItems: "center",
  },
  mainView2: {
    padding: 20,
    paddingTop: 0,
    marginTop: -30,
  },
  featuredTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  featuredTopLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  recentIconBg: {
    height: 40,
    width: 40,
    borderRadius: 40 / 2,
    backgroundColor: "rgba(153, 151, 239, 0.1)",
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    backgroundColor: "#FFC40C",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonT: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  recentJobsContainer: {
    padding: 14,
    width:'100%',
    // width: dimensions.SCREEN_WIDTH * 0.6,
    height: 203,
    marginBottom: 15,
    borderRadius: 10,
    backgroundColor: "white",
    shadowColor: "rgb(26, 42, 97)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5,
  },
  recentJobT: {
    color: "#171716",
    fontSize: 14,
    fontWeight: "500",
  },
  recentCompN: {
    color: "#171716",
    fontSize: 16,
    fontWeight: "400",
  },
  recentLocation: {
    color: "rgba(23, 23, 22, 0.75)",
    fontSize: 12,
    fontWeight: "400",
  },
  recentTagT: {
    color: "rgba(23, 23, 22, 0.75)",
    fontSize: 14,
    fontWeight: "400",
  },
  tagDot: {
    backgroundColor: "#BFD4E4",
    height: 4,
    width: 4,
    borderRadius: 4 / 2,
    marginHorizontal: 10,
  },
  recentBottomT: {
    color: "black",
    fontSize: 16,
    fontWeight: "500",
  },
  recentBottomT2: {
    color: "rgba(23, 23, 22, 0.75)",
    fontSize: 12,
    fontWeight: "500",
  },
  recentMiddle: {
    marginTop: 22,
  },
  recentBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 21,
  },
});
