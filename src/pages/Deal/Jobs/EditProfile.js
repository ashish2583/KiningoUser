// Saurabh Saneja August 14, 2023 edit profile
import React, { useEffect, useState } from "react";
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
import MyAlert from '../../../component/MyAlert';
import { requestGetApi, deal_job_profile } from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from '../../../WebApi/Loader';

const skills = [
  {
    id: "1",
    name: "Leadership",
  },
  {
    id: "2",
    name: "Teamwork",
  },
  {
    id: "3",
    name: "Visioner",
  },
  {
    id: "4",
    name: "Target oriented",
  },
  {
    id: "5",
    name: "Consistent",
  },
  {
    id: "6",
    name: "Leadership",
  },
  {
    id: "7",
    name: "Teamwork",
  },
  {
    id: "8",
    name: "Visioner",
  },
];
const languages = [
  {
    id: "1",
    name: "English",
  },
  {
    id: "2",
    name: "German",
  },
  {
    id: "3",
    name: "Spanish",
  },
  {
    id: "4",
    name: "Mandarin",
  },
  {
    id: "5",
    name: "Italian",
  },
];
const EditProfile = (props) => {
  const userdetaile  = useSelector(state => state.user.user_details)
  const [showMoreSkills, setShowMoreSkills] = useState(false);
  const [showMoreLanguages, setShowMoreLanguages] = useState(false);
  const [loading, setLoading] = useState(false)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [profileData, setProfileData] = useState({});

  useEffect(()=> {
  }, [])

  const getSkillsMoreThanFive = () => {
    // Saurabh Saneja August 14, 2023
    // get first 5 skills using slice method, then add remaining number (for example 3) at the end
    return [
      ...skills?.slice(0, 5),
      { id: skills?.length, name: skills.length - 5 },
    ];
  };
  const getLanguagesMoreThanFive = () => {
    // Saurabh Saneja August 14, 2023
    // get first 5 languages using slice method, then add remaining number (for example 3) at the end
    return [
      ...languages?.slice(0, 5),
      { id: languages?.length, name: languages.length - 5 },
    ];
  };
  const gotoAddWorkExp = () => {
    props.navigation.navigate('AddWorkExp')
  }
  const gotoAddWorkEducation = () => {
    props.navigation.navigate('AddEducation')
  }
  const gotoAddAppreciaton = () => {
    props.navigation.navigate('AddAppreciaton')
  }

  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={styles.mainView}
      >
        <JobsHeader text="Profile" />
        <View style={styles.mainView2}>
          <View style={styles.profileContainer}>
            <View style={styles.profileTopRow}>
              <Image
                source={{ uri: person_Image }}
                style={styles.profileImageStyle}
              />
              <View style={styles.profileTopRightRow}>
                <TouchableOpacity>
                  <Image
                    source={require("./assets/images/jobs-icon-shared.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginLeft: 16 }}>
                  <Image
                    source={require("./assets/images/jobs-icon-setting.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
            <Text style={styles.name}>Orlando Diggs</Text>
            <Text style={styles.location}>California, USA</Text>
            <TouchableOpacity style={styles.editProfileButton}>
              <Text style={styles.editProfileText}>Edit profile</Text>
              <Image
                source={require("./assets/images/jobs-icon-edit-profile.png")}
              />
            </TouchableOpacity>
          </View>

          <View style={styles.aboutMeContainer}>
            <View style={styles.aboutMeTopRow}>
            <View style={styles.aboutMeTopLeftRow}>
              <Image
                source={require("./assets/images/jobs-icon-about-me.png")}
              />
              <Text style={styles.aboutMeText}>About me</Text>
            </View>
            <Image
                source={require("./assets/images/jobs-icon-edit-profile.png")}
              />
            </View>
            <Divider style={{ marginVertical: 20 }} />
            <Text style={styles.aboutMeLongText}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Lectus id
              commodo egestas metus interdum dolor.
            </Text>
          </View>

          <View style={styles.workExpContainer}>
            <View style={[styles.workExpTopRow, {justifyContent:'space-between'}]}>
              <View style={styles.workExpTopRow}>
                <Image
                  source={require("./assets/images/jobs-icon-work-experience.png")}
                />
                <Text style={styles.workExpText}>Work experience</Text>
              </View>
              <TouchableOpacity onPress={gotoAddWorkExp} >
                <Image
                  source={require("./assets/images/jobs-add-icon.png")}
                />
              </TouchableOpacity>
            </View>
            <Divider style={{ marginVertical: 20 }} />
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}} >
              <Text style={styles.managerText}>Manager</Text>
              <Image
                source={require("./assets/images/jobs-icon-edit-profile.png")}
              />
            </View>
            <Text style={[styles.workExpSmallText, { marginTop: 13 }]}>
              Amazon Inc
            </Text>
            <View style={styles.workExpBottomRow}>
              <Text style={styles.workExpSmallText}>Jan 2015 - Feb 2022</Text>
              <View style={styles.dot}></View>
              <Text
                style={[
                  styles.workExpSmallText,
                  { marginLeft: 5, marginTop: 7 },
                ]}
              >
                5 Years
              </Text>
            </View>
          </View>

          <View style={styles.eduContainer}>
            <View style={[styles.eduTopRow, {justifyContent:'space-between'}]}>
              <View style={styles.eduTopLeftRow}>
                <Image
                  source={require("./assets/images/jobs-icon-education.png")}
                />
                <Text style={styles.eduText}>Education</Text>
              </View>
              <TouchableOpacity onPress={gotoAddWorkEducation}>
                <Image
                  source={require("./assets/images/jobs-add-icon.png")}
                />
              </TouchableOpacity>
            </View>
            <Divider style={{ marginVertical: 20 }} />
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}} >
              <Text style={styles.managerText}>Information Technology</Text>
              <Image
                source={require("./assets/images/jobs-icon-edit-profile.png")}
              />
            </View>
            <Text style={[styles.eduSmallText, { marginTop: 13 }]}>
              University of Oxford
            </Text>
            <View style={styles.eduBottomRow}>
              <Text style={styles.eduSmallText}>Jan 2015 - Feb 2022</Text>
              <View style={styles.dot}></View>
              <Text
                style={[styles.eduSmallText, { marginLeft: 5, marginTop: 7 }]}
              >
                5 Years
              </Text>
            </View>
          </View>

          <View style={styles.skillContainer}>
            <View style={[styles.skillTopRow, {justifyContent:'space-between'}]}>
              <View style={styles.skillTopLeftRow}>
                <Image source={require("./assets/images/jobs-icon-skill.png")} />
                <Text style={[styles.skillText, { marginLeft: 10 }]}>Skill</Text>
              </View>
              <Image
                source={require("./assets/images/jobs-icon-edit-profile.png")}
              />
            </View>
            <Divider style={{ marginVertical: 20 }} />
            <View style={{}}>
              {/* Saurabh Saneja August 14, 2023 */}
              {/* only show truncated skills if see more button not pressed */}
              {skills?.length > 5 && !showMoreSkills ? (
                <View>
                  <View style={styles.skillTextContainer}>
                    {getSkillsMoreThanFive()?.map((el, index) => {
                      // console.log("skill el index", el, index);
                      return (
                        <View
                          style={[
                            styles.skillTextView,
                            index === 5
                              ? { backgroundColor: "transparent" }
                              : null,
                          ]}
                        >
                          {index === 5 ? (
                            <Text style={styles.skillText2}>
                              + {el.name} more
                            </Text>
                          ) : (
                            <Text style={styles.skillText2}>{el.name}</Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMoreSkills(true);
                    }}
                  >
                    <Text style={styles.seeMoreText}>See More</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.skillTextContainer}>
                  {skills?.map((el) => {
                    return (
                      <View style={styles.skillTextView}>
                        <Text style={styles.skillText2}>{el.name}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          <View style={styles.skillContainer}>
            <View style={[styles.skillTopRow, {justifyContent:'space-between'}]}>
              <View style={styles.skillTopLeftRow}>
                <Image
                  source={require("./assets/images/jobs-icon-language.png")}
                  style={{ height: 24, width: 24 }}
                />
                <Text style={[styles.skillText, { marginLeft: 10 }]}>
                  Language
                </Text>
              </View>
              <Image
                source={require("./assets/images/jobs-icon-edit-profile.png")}
              />
            </View>
            <Divider style={{ marginVertical: 20 }} />
            <View style={{}}>
              {/* Saurabh Saneja August 14, 2023 */}
              {/* only show truncated languages if see more button not pressed */}
              {languages?.length > 5 && !showMoreLanguages ? (
                <View>
                  <View style={styles.skillTextContainer}>
                    {getLanguagesMoreThanFive()?.map((el, index) => {
                      // console.log("languages el index", el, index);
                      return (
                        <View
                          style={[
                            styles.skillTextView,
                            index === 5
                              ? { backgroundColor: "transparent" }
                              : null,
                          ]}
                        >
                          {index === 5 ? (
                            <Text style={styles.skillText2}>
                              + {el.name} more
                            </Text>
                          ) : (
                            <Text style={styles.skillText2}>{el.name}</Text>
                          )}
                        </View>
                      );
                    })}
                  </View>
                  <TouchableOpacity
                    onPress={() => {
                      setShowMoreLanguages(true);
                    }}
                  >
                    <Text style={styles.seeMoreText}>See More</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.skillTextContainer}>
                  {languages?.map((el) => {
                    return (
                      <View style={styles.skillTextView}>
                        <Text style={styles.skillText2}>{el.name}</Text>
                      </View>
                    );
                  })}
                </View>
              )}
            </View>
          </View>

          <View style={styles.aprctinContainer}>
            <View style={[styles.aprctinTopRow, {justifyContent:'space-between'}]}>
              <View style={styles.aprctinTopLeftRow}>
                <Image
                  source={require("./assets/images/jobs-icon-appreciation.png")}
                />
                <Text style={styles.aprctinText}>Appreciation</Text>
              </View>
              <TouchableOpacity onPress={gotoAddAppreciaton} >
                <Image
                  source={require("./assets/images/jobs-add-icon.png")}
                />
              </TouchableOpacity>
            </View>
            <Divider style={{ marginVertical: 20 }} />
            <View style={{flexDirection:'row', alignItems:'center', justifyContent:'space-between'}} >
              <Text style={styles.managerText}>Wireless Symposium (RWS)</Text>
              <Image
                source={require("./assets/images/jobs-icon-edit-profile.png")}
              />
            </View>
            <Text style={[styles.aprctinSmallText, { marginTop: 13 }]}>
              Young Scientist
            </Text>
            <View style={styles.aprctinBottomRow}>
              <Text style={styles.aprctinSmallText}>2014</Text>
            </View>
          </View>

          <View style={styles.aprctinContainer}>
            <View style={[styles.aprctinTopRow, {justifyContent:'space-between'}]}>
              <View style={styles.aprctinTopLeftRow}>
                <Image
                  source={require("./assets/images/jobs-icon-resume.png")}
                  style={{ width: 24, height: 24 }}
                />
                <Text style={styles.aprctinText}>Resume</Text>
              </View>
              <Image
                source={require("./assets/images/jobs-add-icon.png")}
              />
            </View>
            <Divider style={{ marginVertical: 20 }} />
            <View style={styles.resumeBottomRow}>
              <View style={styles.resumeBottomLeftRow}>
                <Image
                  source={require("./assets/images/jobs-pdf-icon.png")}
                  style={{ width: 33, height: 44 }}
                />
                <View style={{ marginLeft: 20, width: "70%" }}>
                  <Text style={styles.resumeTitle}>
                    Jamet kudasi - CV - UI/UX Designer
                  </Text>
                  <Text style={[styles.aprctinSmallText, { marginTop: 5 }]}>
                    867 Kb . 14 Feb 2022 at 11:30 am
                  </Text>
                </View>
              </View>
              <Image
                source={require("./assets/images/jobs-resume-delete.png")}
                style={{ width: 24, height: 24 }}
              />
            </View>
          </View>
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}
    </SafeAreaView>
  );
};
export default EditProfile;

const Divider = ({ borderColor = "#DEE1E7", style = {} }) => {
  return (
    <View
      style={{
        width: "100%",
        borderWidth: 0.5,
        borderColor: borderColor,
        alignSelf: "center",
        ...style,
      }}
    />
  );
};

const person_Image =
  "https://images.unsplash.com/photo-1491349174775-aaafddd81942?ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8cGVyc29ufGVufDB8fDB8fA%3D%3D&ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60";

const styles = StyleSheet.create({
  safeView: {
    backgroundColor: "#F8F8F8",
    flex: 1,
  },
  mainView: {
    paddingBottom: "30%",
    // alignItems: "center",
  },
  mainView2: {
    padding: 20,
    paddingTop: 0,
    marginTop: -30,
  },
  profileContainer: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    width: dimensions.SCREEN_WIDTH - 40,
    marginRight: 15,
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
  profileTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  profileTopRightRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  profileImageStyle: {
    height: 52,
    width: 52,
    borderRadius: 52 / 2,
  },
  name: {
    color: "#455A64",
    fontSize: 14,
    fontWeight: "500",
    marginTop: 12,
  },
  location: {
    color: "#455A64",
    fontSize: 12,
    fontWeight: "400",
  },
  editProfileButton: {
    width: 120,
    height: 30,
    backgroundColor: "rgba(0, 137, 207, 0.1)",
    borderRadius: 5,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 15,
    paddingVertical: 6.5,
    marginTop: 20,
  },
  editProfileText: {
    color: "#0089CF",
    fontSize: 12,
    fontWeight: "400",
    marginRight: 10,
  },
  aboutMeContainer: {
    paddingTop: 23,
    paddingBottom: 45,
    paddingHorizontal: 20,
    width: dimensions.SCREEN_WIDTH - 40,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 22,
    shadowColor: "rgb(26, 42, 97)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5,
  },
  aboutMeTopRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between'
  },
  aboutMeTopLeftRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent:'space-between'
  },
  aboutMeText: {
    color: "#150B3D",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },
  aboutMeLongText: {
    color: "#524B6B",
    fontSize: 14,
    fontWeight: "400",
  },
  workExpContainer: {
    paddingTop: 23,
    paddingBottom: 22,
    paddingHorizontal: 20,
    width: dimensions.SCREEN_WIDTH - 40,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 22,
    shadowColor: "rgb(26, 42, 97)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5,
  },
  workExpTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  workExpTopLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  workExpText: {
    color: "#150B3D",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },
  managerText: {
    color: "#150B3D",
    fontSize: 14,
    fontWeight: "700",
  },
  workExpSmallText: {
    color: "#524B6B",
    fontSize: 12,
    fontWeight: "400",
  },
  workExpBottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    backgroundColor: "#524B6B",
    width: 2,
    height: 2,
    borderRadius: 1,
    marginLeft: 8,
  },

  eduContainer: {
    paddingTop: 23,
    paddingBottom: 22,
    paddingHorizontal: 20,
    width: dimensions.SCREEN_WIDTH - 40,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 22,
    shadowColor: "rgb(26, 42, 97)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5,
  },
  eduTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eduTopLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  eduText: {
    color: "#150B3D",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },
  managerText: {
    color: "#150B3D",
    fontSize: 14,
    fontWeight: "700",
  },
  eduSmallText: {
    color: "#524B6B",
    fontSize: 12,
    fontWeight: "400",
  },
  eduBottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  aprctinContainer: {
    paddingTop: 23,
    paddingBottom: 22,
    paddingHorizontal: 20,
    width: dimensions.SCREEN_WIDTH - 40,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 22,
    shadowColor: "rgb(26, 42, 97)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5,
  },
  aprctinTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  aprctinTopLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  aprctinText: {
    color: "#150B3D",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },
  managerText: {
    color: "#150B3D",
    fontSize: 14,
    fontWeight: "700",
  },
  aprctinSmallText: {
    color: "#524B6B",
    fontSize: 12,
    fontWeight: "400",
  },
  aprctinBottomRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  skillContainer: {
    paddingTop: 23,
    paddingBottom: 22,
    paddingHorizontal: 20,
    width: dimensions.SCREEN_WIDTH - 40,
    marginRight: 15,
    borderRadius: 10,
    backgroundColor: "white",
    marginTop: 22,
    shadowColor: "rgb(26, 42, 97)",
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowRadius: 5,
    shadowOpacity: 1,
    elevation: 5,
  },
  skillTopRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  skillTopLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  skillText: {
    color: "#150B3D",
    fontSize: 14,
    fontWeight: "700",
    marginLeft: 10,
  },
  skillText2: {
    color: "#524B6B",
    fontSize: 14,
    fontWeight: "400",
  },
  skillTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    // width:'80%'
  },
  skillTextView: {
    backgroundColor: "rgba(203, 201, 212, 0.2)",
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginRight: 10,
  },
  seeMoreText: {
    color: "#0089CF",
    fontSize: 12,
    fontWeight: "400",
    textAlign: "center",
    marginTop: 30,
  },
  resumeBottomRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  resumeBottomLeftRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  resumeTitle: {
    color: "#150B3D",
    fontSize: 12,
    fontWeight: "400",
  },
});
