import React, { useState } from "react";
import { View, Text, SafeAreaView, StyleSheet, ScrollView } from "react-native";
import JobsHeader from "./components/JobsHeader";
import JobsSearch from "./components/JobsSearch";

const JobsHome = (props) => {
  const [searchText, setSearchText] = useState("");
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={{ paddingBottom: "30%", alignItems: "center" }}
      >
        <JobsHeader text="Home" />
        <JobsSearch value={searchText} setValue={setSearchText}  />
        <Text style={{ color: "black", fontSize: 16 }}>JobsHome</Text>
      </ScrollView>
    </SafeAreaView>
  );
};
export default JobsHome;

const styles = StyleSheet.create({
  safeView: {
    backgroundColor: "#F8F8F8",
    flex: 1,
  },
});
