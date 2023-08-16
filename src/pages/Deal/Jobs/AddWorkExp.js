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
import { requestGetApi, deal_job_profile, requestPostApi, deal_work_experience } from "../../../WebApi/Service";
import { useSelector } from "react-redux";
import Loader from '../../../WebApi/Loader';
import DateSelector from "./components/DateSelector";
import DatePicker from 'react-native-date-picker';
import moment from "moment";

const AddWorkExp = (props) => {
  const userdetaile  = useSelector(state => state.user.user_details)
  const [loading, setLoading] = useState(false)
  const [My_Alert, setMy_Alert] = useState(false)
  const [alert_sms, setalert_sms] = useState('')
  const [jobTitle, setJobTitle] = useState('')
  const [company, setCompany] = useState('')
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [isStartDateOpen, setIsStartDateOpen] = useState('')
  const [isEndDateOpen, setIsEndDateOpen] = useState('')
  const [description, setDescription] = useState('')
  const [isChecked, setIsChecked] = useState(true)

  const companyRef = useRef()

  useEffect(()=> {
  }, [])
  // Saurabh Saneja August 16, 2023 validate fields before calling api
  const validation = () => {
    if (jobTitle?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter Job Title" });
      return false;
    } else if (company?.trim()?.length === 0) {
      Toast.show({ text1: "Please enter Company" });
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
      "company": company,
      "from_date": moment(startDate).format('YYYY-MM-DD'),
      "end_date": moment(endDate).format('YYYY-MM-DD'),
      "title": jobTitle,
      "status": isChecked
    };
    const { responseJson, err } = await requestPostApi(
      deal_work_experience,
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
  return (
    <SafeAreaView style={styles.safeView}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={{ width: "100%" }}
        contentContainerStyle={styles.mainView}
      >
        <JobsHeader text="Work Experience" />
        <View style={styles.mainView2}>
          <Text style={styles.title}>Add work experience</Text>

          <Text style={styles.inputTitle}>Job Title</Text>
          <MyTextInput
            placeholder='Job title'
            value={jobTitle}
            setValue={setJobTitle}
            onSubmitEditing={()=>{companyRef.current.focus()}}
            />
          <Text style={styles.inputTitle}>Company</Text>
          <MyTextInput
            inputRef={companyRef}
            placeholder='Company'
            value={company}
            setValue={setCompany}
            onSubmitEditing={()=>{Keyboard.dismiss()}}
          />
          <View style={styles.dateRow}>
            <View style={{width:'48%'}}>
            <Text style={styles.inputTitle}>Start Date</Text>
              <DateSelector
                Title={
                  startDate == ''
                  ? 'Select Start Date'
                  : // : moment(startDate).format('MMMM Do YYYY')
                  moment(startDate).format('DD-MM-YYYY')
                }
                onPress={() => setIsStartDateOpen(true)}
              />
            </View>
            <View style={{width:'48%'}}>
            <Text style={styles.inputTitle}>End Date</Text>
              <DateSelector
                Title={
                 endDate == ''
                  ? 'Select End Date'
                  : // : moment(endDate).format('MMMM Do YYYY')
                  moment(endDate).format('DD-MM-YYYY')
                }
                onPress={() => setIsEndDateOpen(true)}
                />
            </View>
          </View>

          <TouchableWithoutFeedback onPress={()=>{setIsChecked(!isChecked)}} >
            <View style={styles.checkMyPosition}>
              <Image source={isChecked ? require('./assets/images/jobs-blue-checked.png') : require('./assets/images/jobs-blue-unchecked.png')} />
              <Text style={styles.myPostionText}>This is my position now</Text>
            </View>
          </TouchableWithoutFeedback>

          <Text style={styles.inputTitle}>Description</Text>      
          <TextInput
            placeholder={'Write additional information here'}
            placeholderTextColor='#AAA6B9'
            value={description}
            onChangeText={(e)=>setDescription(e)}
            multiline
            style={styles.descInput}
          />

          <MyButton text="SAVE" onPress={handleAdd} style={{ backgroundColor:'#0089CF', paddingVertical: 20, marginTop: 40 }} />
        </View>
      </ScrollView>
      {loading ? <Loader /> : null}
      {My_Alert ? <MyAlert sms={alert_sms} okPress={() => { setMy_Alert(false) }} /> : null}
      <DatePicker
        modal
        mode="date"
        open={isStartDateOpen}
        date={startDate === '' ? new Date() : startDate}
        onConfirm={date => {
          setIsStartDateOpen(false);
          setStartDate(date);
        }}
        onCancel={() => {
          setIsStartDateOpen(false);
        }}
      />
      <DatePicker
        modal
        mode="date"
        open={isEndDateOpen}
        date={endDate === '' ? new Date() : endDate}
        onConfirm={date => {
          setIsEndDateOpen(false);
          setEndDate(date);
        }}
        onCancel={() => {
          setIsEndDateOpen(false);
        }}
      />
    </SafeAreaView>
  );
};
export default AddWorkExp;

const MyTextInput = ({placeholder, value, setValue, inputRef, onSubmitEditing}) => {
  return (
    <TextInput
      ref={inputRef}
      placeholder={placeholder}
      placeholderTextColor='#AAA6B9'
      value={value}
      onChangeText={(e)=>setValue(e)}
      onSubmitEditing={onSubmitEditing}
      style={styles.input}
    />
  )
}

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
  inputTitle:{
    color:'#150B3D',
    fontSize: 13,
    fontWeight: '500',
    marginTop: 15,
    marginBottom:5
  },
  input:{
    color:'#150B3D',
    fontSize:12,
    fontWeight:'400',
    backgroundColor:'white',
    borderRadius:5,
    paddingVertical:15,
    paddingHorizontal:10
  },
  descInput:{
    color:'#150B3D',
    fontSize:12,
    fontWeight:'400',
    backgroundColor:'white',
    borderRadius:5,
    height: 100,
    paddingHorizontal:10
  },
  dateRow:{
    flexDirection:'row',
    alignItems:'center',
    justifyContent:'space-between'
  },
  checkMyPosition:{
    flexDirection:'row',
    alignItems:'center',
    marginTop:16
  },
  myPostionText:{
    color:'#524B6B',
    fontSize:12,
    fontWeight:'400',
    marginLeft: 15
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
});
