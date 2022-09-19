import Geolocation from 'react-native-geolocation-service';
import messaging from '@react-native-firebase/messaging';
import { Platform } from 'react-native';
import userDefaults from 'react-native-user-defaults';
import DefaultPreference from 'react-native-default-preference';
import Constant from '../CommonFiles/Constant';


const myHeaders = new Headers();
myHeaders.append("Accept", "*/*");
myHeaders.append("Content-Type", "application/json");


const userInformation = new Headers();

let CommonUtilsObj = () => {
    EmployeDetails = '';
    console.log('EmployeDetails.............', EmployeDetails)
};


// const getToken = async () => {
//     try {
//         const token = await messaging().getToken();
//         if (token) return token;
//     } catch (error) {
//         console.log(error);
//     }
// };

const setSocketConnection = () => {
    let socket = io(Constant.socketLocationURL, {
        query: { id: 29 },
        reconnectionDelayMax: 2000,
    });

    socket.on('connect', () => {
        console.log('Connection Done');
    });
}

const getLiveLocation = () => {
    return new Promise((resolve, reject) => {
        Geolocation.getCurrentPosition(
            position => {
                console.log('Position', position);
                const coords = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    heading: position.coords.heading,
                };
                resolve(coords);
            },
            error => {
                reject(error.message);
            },
            {
                enableHighAccuracy: true,
                timeout: 15000,
                maximumAge: 10000,
                distanceFilter: 100,
                //  interval: 1000
                distanceFilter: 100,
            },
        );
    });
};

const setLoggedEmployeDetails = data => {
    // CommonUtilsObj.userLoginState = Constant.KLogin;
    console.log('<--------- setLoggedUserDetails ---------->', data);
    if (Platform.OS === 'android') {
        DefaultPreference.set(Constant.KEmployeDetailsKey, data)
            .then(data => getLoggedEmployeDetails())
            .catch(function (err) {
                console.log(err);
            });
    } else {
        userDefaults
            .set(Constant.KEmployeDetailsKey, data)
            .then(data => getLoggedUserDetails())
            .catch(function (err) {
                console.log(err);
            });
    }
};

const getLoggedEmployeDetails = () => {
    console.log('Calling getLoggedEmployeDetails from CommonUtils....');

    if (Platform.OS === 'android') {
        return DefaultPreference.get(Constant.KEmployeDetailsKey)
            .then(function (data) {
                let obj = JSON.parse(data);
                console.log('Employe details -> ', JSON.stringify(obj));
                if (obj != '') {
                    CommonUtilsObj.EmployeDetails = obj;
                }
                let Data = obj[0];
                return Data
            })
            .catch(function (err) {
                console.log(err);
            });
    } else {
        return userDefaults
            .get(Constant.KEmployeDetailsKey)
            .then(data => {
                let obj = JSON.parse(data);
                console.log('Employe details -> ', JSON.stringify(obj));
                if (obj != '') {
                    CommonUtilsObj.EmployeDetails = obj;
                }
                let Data = obj[0];
                return Data
            })
            .catch(function (err) {
                console.log('Errir: ', err);
                //return undefined;
            });
    }
};

export {
    //   getFCMToken,
    myHeaders,
    userInformation,
    CommonUtilsObj,
    setLoggedEmployeDetails,
    getLoggedEmployeDetails,
    getLiveLocation
};