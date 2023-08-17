// Saurabh Saneja August 14, 2023 edit profile
import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  ImageBackground,
  Image,
  FlatList,
  Keyboard,
  TouchableWithoutFeedback,
} from "react-native";
import JobsHeader from "./components/JobsHeader";
import JobsSearch from "./components/JobsSearch";
import { dimensions } from "../../../utility/Mycolors";
import MyAlert from '../../../component/MyAlert';
import { requestGetApi, deal_job_profile, requestPostApi, deal_job_work_experience, deal_job_education, deal_job_skills } from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from '../../../WebApi/Loader';
import DateSelector from "./components/DateSelector";
import DatePicker from 'react-native-date-picker';
import moment from "moment";

const selectedSkills = [
  {
    id:'1',
    name: 'Leadership'
  },
  {
    id:'2',
    name: 'Teamwork'
  },
  {
    id:'3',
    name: 'Visioner'
  },
  {
    id:'5',
    name: 'Consistent'
  },
]
const allSkills = [
  {
    id:'1',
    name: 'Leadership'
  },
  {
    id:'2',
    name: 'Teamwork'
  },
  {
    id:'3',
    name: 'Visioner'
  },
  {
    id:'4',
    name: 'Good communication skills'
  },
  {
    id:'5',
    name: 'Consistent'
  },
]
const AddSkills = (props) => {
  const userdetaile  = useSelector(state => state.user.user_details)
  const [loading, setLoading] = useState(false)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [educationLevel, setEducationLevel] = useState('')
  const [institutionName, setInstitutionName] = useState('')
  const [fieldOfStudy, setFieldOfStudy] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isStartDateOpen, setIsStartDateOpen] = useState('')
  const [isEndDateOpen, setIsEndDateOpen] = useState('')
  const [description, setDescription] = useState('')
  const [isChecked, setIsChecked] = useState(true)
  const [searchText, setSearchText] = useState('')
  const [allSkillData, setAllSkillData] = useState([])

  const institutionNameRef = useRef()
  const fieldOfStudyRef = useRef()

  useEffect(()=> {
    getSkills()
  }, [])
  const getSkills = async () => {
    setLoading(true)
    const { responseJson, err } = await requestGetApi(deal_job_skills, '', 'GET', userdetaile.token)
    setLoading(false)
    console.log('getSkills responseJson', responseJson)
    if (responseJson.headers.success == 1) {
      setAllSkillData(responseJson.success)
    } else {
      setalert_sms(err)
      setMy_Alert(true)
    }
  }
  // Saurabh Saneja August 16, 2023 validate fields before calling api
  const validation = () => {
    if (educationLevel?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter Job Title" });
      return false;
    } else if (institutionName?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter Company" });
      return false; 
    } else if (fieldOfStudy?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter Field of study" });
      return false;
    } else if (startDate === '') {
      Toast.show({ text1: "Please select Start Date" });
      return false;
    } else if (endDate === '') {
      Toast.show({ text1: "Please select End Date" });
      return false;
    } else if (description?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter description" });
      return false;
    }
    return true;
  };
  // Saurabh Saneja August 16, 2023 send work experience data to backend
  const handleAdd = async () => {
    if (!validation()) {
      return;
    }
    setLoading(true);
    const data = {
      "candidate_id": userdetaile.userid,
      "degree": fieldOfStudy,
      "college": institutionName,
      "year": 2021,
      "marks_type": "Percentage",
      "marks": 85,
      "from_date": moment(startDate).format('YYYY-MM-DD'),
      "end_date": moment(endDate).format('YYYY-MM-DD'),
      "status": isChecked ? 1 : 0
    };
    console.log("handleAdd data", data);
    const { responseJson, err } = await requestPostApi(
      deal_job_education,
      data,
      "POST",
      userdetaile.token
    );
    setLoading(false);
    console.log("handleAdd responseJson", responseJson);
    if (responseJson.headers.success == 1) {
      Toast.show({ text1: responseJson.headers.message });
      props.navigation.goBack()
    } else {
      Toast.show({ text1: responseJson.headers.message });
      setalert_sms(err);
      setMy_Alert(true);
    }
  };
  const deleteSkill = (id) => {

  }
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={styles.mainView}
      >
        <JobsHeader text="Skills" />
        <View style={styles.mainView2}>
          <Text style={styles.title}>Add Skills</Text>

          <Search value={searchText} setValue={setSearchText} />
          <View style={styles.skillTextContainer}>
            {allSkillData?.map((el) => {
              return (
                <View style={styles.skillTextView}>
                  <Text style={styles.skillText2}>{el.skill}</Text>
                  <TouchableOpacity onPress={()=>{deleteSkill(el.id)}} style={{marginLeft: 8}} >
                    <Image source={require('./assets/images/jobs-cross-icon.png')} />
                  </TouchableOpacity>
                </View>
              );
            })}
          </View>  
          <MyButton text="SAVE" onPress={handleAdd} style={{ backgroundColor:'#0089CF', paddingVertical: 20, marginTop: 40 }} />
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}
    </SafeAreaView>
  );
};
export default AddSkills;

const MyButton = ({ text, onPress, style = {} }) => {
  return (
    <TouchableOpacity style={[styles.button, style]} onPress={onPress}>
      <Text style={styles.buttonT}>{text}</Text>
    </TouchableOpacity>
  );
};

const Search = ({value, setValue}) => {
  return (
    <View style={styles.searchView}>
      <Image source={require('./assets/images/jobs-search-icon.png')} />
      <TextInput
        value={value}
        onChangeText={(e)=>setValue(e)}
        placeholder="Search skills"
        placeholderTextColor='#95969D'
        style={styles.inputStyle}
      />
    </View>
  )
}

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
  },
  title:{
    color:'#150B3D',
    fontSize: 16,
    fontWeight: '700',
    marginTop: 18,
    marginBottom: 3
  },
  button: {
    backgroundColor: "#FFC40C",
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: 'black',
    shadowOffset: {
    width:0,
    height:3
    }, 
    shadowRadius: 5,
    shadowOpacity: 0.1,
    elevation: 1,
  },
  buttonT: {
    color: "white",
    fontSize: 13,
    fontWeight: "500",
  },
  searchView:{
    flexDirection:'row',
    alignItems:'center',
    backgroundColor:'white',
    paddingHorizontal:14,
    height: 48,
    borderRadius: 10,
    marginTop: 19,
    marginBottom: 27
  },
  inputStyle: {
    backgroundColor: "white",
    fontSize: 14,
    fontWeight: "400",
    color: "#95969D",
    width: "80%",
    marginLeft:13,
  },
  skillTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    // width:'80%'
  },
  skillTextView: {
    backgroundColor: "#0089CF",
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 97,
    flexDirection:'row',
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
    marginRight: 10,
  },
  skillText2: {
    color: "white",
    fontSize: 14,
    fontWeight: "400",
  },
});
