import 'react-native-gesture-handler';
import React, { useEffect, useState, useRef } from 'react'
import { View, Text, Alert, PermissionsAndroid, Platform, AppState } from "react-native"
import { NavigationContainer } from '@react-navigation/native';
import { RootSiblingParent } from 'react-native-root-siblings';
import { io } from 'socket.io-client';
import SplashScreen from 'react-native-splash-screen';
import Geolocation from 'react-native-geolocation-service';
import StackNavigation from './src/Navigation/StackNavigation/StackNavigation';
import { CommonUtilsObj, getLoggedEmployeDetails } from './src/Utils/CommonUtils';
import { navigationRef } from './src/Navigation/RootNavigation';
import { CredentialsContext } from './src/Components/Context/CredentialsContext';
import NavigationController from './src/Navigation/NavigationControler';
import Constant from './src/CommonFiles/Constant';

const App = () => {

  const [storedCredentials, setStoredCredentials] = useState('');
  const [storeData, setStoreData] = useState(true);
  const [group, setGroup] = useState(false);
  const appState = useRef(AppState.currentState);
  const [appStateVisible, setAppStateVisible] = useState(appState.current);

  useEffect(() => {
    getCurrentLocationLatLong();
    getLoginStatus();
    setTimeout(() => {
      SplashScreen.hide();
    }, 3000);
  }, []);
  useEffect(() => {
    setTimeout(() => {
      onlineStatus();
    }, 3000);
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener("change", nextAppState => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App has come to the foreground!");
        onlineStatus()
      }

      appState.current = nextAppState;
      setAppStateVisible(appState.current);
      console.log("AppState", appState.current);
      {
        appState.current == 'background' &&
          offlineStatus()
      }
    });

    return () => {
      subscription.remove();
    };
  }, []);

  const offlineStatus = () => {
    if (CommonUtilsObj.EmployeDetails != null) {
      console.log('userid', CommonUtilsObj.EmployeDetails[0].user)
      let socket = io(Constant.socketLocationURL, {
        query: { id: CommonUtilsObj.EmployeDetails[0].user },
        reconnectionDelayMax: 2000,
      });

      socket.emit('offline', CommonUtilsObj.EmployeDetails[0].user)

      // socket.on('offline', ex => {
      //   console.log('response', ex)
      // })
    }
  }
  const onlineStatus = () => {
    console.log('gg', CommonUtilsObj.EmployeDetails)
    if (CommonUtilsObj.EmployeDetails != null) {
      console.log('userid', CommonUtilsObj.EmployeDetails[0].user)
      console.log('socketId', CommonUtilsObj.EmployeDetails[0].socketid)
      let socket = io(Constant.socketLocationURL, {
        query: { id: CommonUtilsObj.EmployeDetails[0].user },
        reconnectionDelayMax: 2000,
      });

      socket.emit('online', CommonUtilsObj.EmployeDetails[0].user)

      // socket.on('online', ex => {
      //   console.log('dddddd', ex)
      // })

    }
  }

  const getCurrentLocationLatLong = async () => {
    //Alert.alert("getCurrentLocationLatLong called...");
    if (Platform.OS === 'android') {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: '',
            message: 'Need access to your location ',
          },
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          console.log('fffffffff', PermissionsAndroid.RESULTS.GRANTED);
          Geolocation.getCurrentPosition(
            position => {
              // console.log(position)
              // Constant.latLong.latitude = position.coords.latitude;
              // Constant.latLong.longitude = position.coords.longitude;
            },
            error => {
              Alert.alert(error);
            },
            { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
          );
        } else {
          // CommonUtilsObj.showErrorToast(Message.userLocationDenied)
          console.log('location permission denied');
        }
      } catch (err) {
        Alert.alert(err);
      }
    } else {
      const auth = await Geolocation.requestAuthorization('whenInUse');
      //console.log("auth: ", auth);
      if (auth === 'granted') {
        Geolocation.getCurrentPosition(
          position => {
            //Alert.alert("getCurrentLocationLatLong - position Granted")
            console.log('location api called...');
            // Constant.latLong.latitude = position.coords.latitude;
            // Constant.latLong.longitude = position.coords.longitude;
          },
          error => {
            //Alert.alert("getCurrentLocationLatLong - Location permission denined");
            console.log('location permission denied' + error);
          },
          { enableHighAccuracy: true, timeout: 20000, maximumAge: 10000 },
        );
      }
    }
  };

  const getLoginStatus = async () => {
    let Data = await getLoggedEmployeDetails();
    setStoredCredentials(Data != undefined ? Data : null);
    console.log('Data', Data);
  }


  return (
    <CredentialsContext.Provider
      value={{ storedCredentials, setStoredCredentials, storeData, setStoreData, group, setGroup }}>
      <NavigationContainer ref={navigationRef}>
        <RootSiblingParent>
          <NavigationController />
        </RootSiblingParent>
      </NavigationContainer>
    </CredentialsContext.Provider>
  )
}

export default App;