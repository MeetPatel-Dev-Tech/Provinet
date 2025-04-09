import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Image,
  FlatList,
} from 'react-native';
import {navigationRef} from '../../Navigation/RootNavigation';
import ProgressLoader from 'rn-progress-loader';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
import * as RootNavigation from '../../Navigation/RootNavigation';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import moment from 'moment';
import {GetApi, PostApi, PostApiImage} from '../../Api/Api';
import Constant from '../../CommonFiles/Constant';
import {CommonUtilsObj, getLiveLocation} from '../../Utils/CommonUtils';
import {ErrorToast, SuccessToast} from '../ToastMessage/Toast';
export default function Attendance({navigation}) {
  const [dailyAttendance, setDailtAttendance] = useState('');
  const [punchInStatus, setPunchInStatus] = useState('');
  const [currentLatitude, setCurrentLatitude] = useState('');
  const [currentLongiTude, setCurrentLongitude] = useState('');
  const [punchInTime, setPunchInTime] = useState('');
  const [punchOutTime, setPunchOutTime] = useState('');
  const [punchInAddress, setPunchInAddress] = useState('');
  const [lastPunchInTime, setLastPunchInTime] = useState('');
  const [lastPunchOutTime, setLastPunchOutTime] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    userAllpunchInOut();
    getEmployePunchInOutDetails();
  }, []);

  const userAllpunchInOut = async () => {
    const ResponseData = await GetApi(
      Constant.DailyAttendanceURL + CommonUtilsObj.EmployeDetails[0].user,
    );
    console.log('DailyAttendanceURL', ResponseData);
    setDailtAttendance(ResponseData.data);
  };

  const DailyAttendanceWithBreakTime = ({item}) => {
    return (
      <View
        style={{
          flex: 1,
          padding: 10,
          backgroundColor: 'white',
          marginBottom: 10,
          marginTop: 10,
          marginHorizontal: 20,
          backgroundColor: 'white',
          borderRadius: 20,
          shadowColor: 'black',
          shadowOffset: {width: 2, height: 5},
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 5,
        }}>
        <TouchableOpacity
          onPress={() => navigation.navigate('DayAllPunchInOutDetail')}>
          <View>
            <Text
              style={{
                textAlign: 'center',
                color: 'black',
                marginBottom: 10,
                fontWeight: 'bold',
                fontSize: 16,
              }}>
              {DateChange(item.date)}
            </Text>
            <Text style={{fontSize: 14, color: 'black'}}>
              InTime : <Text style={{color: 'gray'}}>{item.intime}</Text>{' '}
            </Text>
            <Text style={{fontSize: 14, color: 'black'}}>
              Outime : <Text style={{color: 'gray'}}>{item.outtime}</Text>{' '}
            </Text>
            <Text style={{fontSize: 14, color: 'black'}}>
              BreakTime :{' '}
              <Text style={{color: 'gray'}}>
                {decimalToHours(item.breakTime)}
              </Text>{' '}
            </Text>
            <Text style={{fontSize: 14, color: 'black'}}>
              Hours :{' '}
              <Text style={{color: 'gray'}}>{decimalToHours(item.hours)}</Text>{' '}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    );
  };

  const decimalToHours = decimalTimeString => {
    if (
      decimalTimeString == 'NaN' ||
      decimalTimeString == null ||
      decimalTimeString == undefined
    ) {
      return '0 Hrs 0 Mins';
    } else {
      var decimalTime = parseFloat(decimalTimeString);
      decimalTime = decimalTime * 60 * 60;
      var hours = Math.floor(decimalTime / (60 * 60));
      decimalTime = decimalTime - hours * 60 * 60;
      var minutes = Math.floor(decimalTime / 60);
      decimalTime = decimalTime - minutes * 60;
      var seconds = Math.round(decimalTime);
      return `${hours} Hrs ${minutes} Mins`;
    }
  };

  const DateChange = date => {
    const new_date = moment(date);
    //   const data = new_date.add(1, 'day')
    const data1 = new_date.format('dddd Do MMMM, YYYY');
    return data1;
  };

  const getLiveLoc = async () => {
    //   setLoading(true);
    const {latitude, longitude, heading} = await getLiveLocation();
    console.log('Live Loc-----', latitude, longitude);
    getAddress(latitude, longitude);
    setCurrentLatitude(latitude);
    setCurrentLongitude(longitude);
  };

  const getAddress = async (latitude, longitude) => {
    setLoading(true);
    console.log('latitude', latitude, longitude);
    let response = await GetApi(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${Constant.KGoogleMapAPIKey}`,
    );
    //   console.log('ResLocation---------------', JSON.stringify(response));
    console.log(
      'ResLocation---------------',
      JSON.stringify(response.results[0].formatted_address),
    );
    if (response.status == 'OK') {
      setPunchInAddress(response.results[0].formatted_address);
      setLoading(false);
    }
  };

  const Opencamera = () => {
    let options = {
      storageOptions: {
        path: 'images',
        mediaType: 'photo',
      },
      includeBase64: false,
    };
    launchCamera(options, response => {
      console.log('Response = ', response);
      if (response.didCancel) {
        console.log('user cancle image picker');
      } else if (response.error) {
        console.log('imagepicker error:', response.error);
      } else if (response.customButton) {
        console.log('user taped custom button: ', response.customButton);
      } else {
        console.log('fddggg', response.assets[0]);
        // if (response.assets[0].fileSize < 3145728) {
        console.log('..................');
        //   setPunchInResponse({ uri: response.assets[0].uri });
        PunchIn(response.assets[0].uri);
        // } else {
        // ErrorToast(Message.KImageSize);
        // }
      }
    });
  };

  const PunchIn = async image => {
    console.log('..........................');
    console.log('mmmm', moment().format('HH:mm'));
    setLoading(true);
    var data = new FormData();
    data.append('image', {
      uri: image,
      type: 'image/jpeg',
      name: 'profile.jpg',
    });
    data.append('userid', CommonUtilsObj.EmployeDetails[0].user);
    data.append('latitude', currentLatitude);
    data.append('longitude', currentLongiTude);
    data.append('intime', String(moment().format('HH:mm')));
    data.append('address', punchInAddress);
    data.append('breaktime', 0);
    // const DATA = {
    //     userid: CommonUtilsObj.EmployeDetails[0].user,
    //     //    image: punchInResponse.uri,
    //     image: data,
    //     latitude: currentLatitude,
    //     longitude: currentLongiTude,
    //     intime: String(moment().format('hh:mm'))
    // }
    const ResponseData = await PostApiImage(Constant.PunchInURL, data, false);
    console.log('dddddddddd', ResponseData);
    if (ResponseData.status == 'success') {
      setPunchInStatus(ResponseData.status);
      SuccessToast('Successfully PunchIn');
      getEmployePunchInOutDetails();
      setLoading(false);
      BreakTime();
    } else {
      ErrorToast(ResponseData.message);
      setLoading(false);
    }
  };

  const BreakTime = async () => {
    const data = {
      userid: CommonUtilsObj.EmployeDetails[0].user,
    };
    const ResponseData = await PostApi(Constant.BreakTimeURL, data, true);
    console.log('BreakTime', ResponseData);
  };

  const PunchOut = async () => {
    console.log('outTime....', moment().format('HH:mm'));
    setLoading(true);
    const data = {
      userid: CommonUtilsObj.EmployeDetails[0].user,
      outtime: String(moment().format('HH:mm')),
    };
    const ResponseData = await PostApi(Constant.PunchOutURL, data, true);
    console.log('PUNCHOUT', ResponseData);
    if (ResponseData.status == 'success') {
      BreakTime();
      SuccessToast('SuccessFully PunchOut');
      setLoading(false);
      getEmployePunchInOutDetails();
    } else {
      ErrorToast(ResponseData.message);
      setLoading(false);
    }
  };

  const getEmployePunchInOutDetails = async () => {
    setLoading(true);
    const ResponseData = await GetApi(
      Constant.PunchInOutDetailsURL + CommonUtilsObj.EmployeDetails[0].user,
    );
    // console.log('GetEmployeDetails..........', ResponseData.data[ResponseData.data.length - 1]);
    if (ResponseData.status == 'success') {
      setLoading(false);
      console.log('GetEmployeDetails..........', ResponseData.status);
      console.log(
        '12 hour...............',
        moment(
          ResponseData.data[ResponseData.data.length - 1].intime,
          'hh:mm',
        ).format('hh:mm'),
      );
      setPunchInStatus(ResponseData.data[ResponseData.data.length - 1].outtime);
      setPunchInTime(
        moment(
          ResponseData.data[ResponseData.data.length - 1].intime,
          'hh:mm a',
        ).format('hh:mm a'),
      );
      setLastPunchInTime(
        moment(
          ResponseData.data[ResponseData.data.length - 1].intime,
          'HH:mm',
        ).format('HH:mm'),
      );
      setLastPunchOutTime(
        moment(
          ResponseData.data[ResponseData.data.length - 1].outtime,
          'HH:mm',
        ).format('HH:mm'),
      );
      setPunchOutTime(
        ResponseData.data[ResponseData.data.length - 1].outtime == null
          ? null
          : moment(
              ResponseData.data[ResponseData.data.length - 1].outtime,
              'hh:mm',
            ).format('hh:mm a'),
      );
    } else {
      setLoading(false);
      ErrorToast(ResponseData.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProgressLoader
        visible={loading}
        isModal={true}
        isHUD={true}
        hudColor={'#fff'}
        height={200}
        width={200}
        color={'#000'}
      />
      {!loading && (
        <>
          <View style={{marginHorizontal: 20}}>
            <View>
              <Text
                style={{
                  color: 'black',
                  fontWeight: 'bold',
                  fontSize: 20,
                  marginTop: 5,
                }}>
                PUNCH IN OUT
              </Text>
            </View>
            <View
              style={{
                marginTop: 10,
                padding: 20,
                backgroundColor: 'white',
                borderRadius: 20,
                shadowColor: 'black',
                shadowOffset: {width: 2, height: 5},
                shadowOpacity: 1,
                shadowRadius: 2,
                elevation: 5,
              }}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={{}}>
                  <Text style={{}}>PUNCH IN</Text>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {punchInTime}
                  </Text>
                </View>
                <View style={{marginLeft: 10}}>
                  <Text style={{}}>PUNCH OUT</Text>
                  <Text
                    style={{
                      color: 'white',
                      textAlign: 'center',
                      fontWeight: 'bold',
                      color: 'black',
                    }}>
                    {punchOutTime}
                  </Text>
                </View>
                <View
                  style={{
                    justifyContent: 'flex-end',
                    alignItems: 'flex-end',
                    flex: 1,
                  }}>
                  {punchInStatus == null ? (
                    <TouchableOpacity onPress={() => PunchOut()}>
                      <View
                        style={{
                          padding: 10,
                          backgroundColor: Constant.darkturquoise,
                          borderRadius: 10,
                          shadowColor: 'black',
                          shadowOffset: {width: 0, height: 3},
                          shadowOpacity: 12,
                          shadowRadius: 2,
                          elevation: 10,
                          alignItems: 'center',
                        }}>
                        <MaterialCommunityIcons name="logout" size={40} />
                        <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                          PUNCH OUT
                        </Text>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      onPress={() => {
                        getLiveLoc(), Opencamera();
                      }}>
                      <View
                        style={{
                          padding: 10,
                          backgroundColor: Constant.darkturquoise,
                          borderRadius: 10,
                          shadowColor: 'black',
                          shadowOffset: {width: 0, height: 3},
                          shadowOpacity: 1,
                          shadowRadius: 2,
                          elevation: 10,
                          alignItems: 'center',
                        }}>
                        <MaterialCommunityIcons name="logout" size={40} />

                        <Text style={{marginTop: 5, fontWeight: 'bold'}}>
                          PUNCH IN
                        </Text>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            </View>
          </View>
          <Text
            style={{
              marginTop: 10,
              fontWeight: 'bold',
              marginLeft: 20,
              fontSize: 20,
              color: 'black',
            }}>
            Details
          </Text>
          <View style={{marginTop: 5, marginBottom: 50}}>
            <FlatList
              showsVerticalScrollIndicator={false}
              data={dailyAttendance}
              renderItem={DailyAttendanceWithBreakTime}
            />
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: 'white',
  },
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    flex: 0,
    backgroundColor: '#fff',
    borderRadius: 5,
    padding: 15,
    paddingHorizontal: 20,
    alignSelf: 'center',
    margin: 20,
  },
});
