import { Dimensions, Platform } from 'react-native';
import { CommonUtilsObj } from '../Utils/CommonUtils';

const KBaseURL = 'http://45.80.152.23:4553/api/';
//const KBaseURL = 'http://192.168.1.32:4553/api/';

const KUserURL = KBaseURL + 'user/';
const KBasePunchInOutURL = KBaseURL + 'PunchInOut/';
const KBreakURL = KBaseURL + 'userbreak/';
const KBaseLeaveURL = KBaseURL + 'leaves/';
const KBaseDashBoardURL = KBaseURL + 'dashboard/';
const KViewURL = KBaseURL + 'PunchInOut/getpunchinoutimage?filename=';
//const KViewURL = 'http://45.80.152.23:4560/';
const KSocketUrl = 'http://45.80.152.23:4553';
//const KSocketUrl = 'http://192.168.1.32:4553';

const headerFormData = {
  Accept: '*/*',
  'Content-Type': 'application/json',
};
const headerURLEncoded = {
  Accept: 'application/json',
  'Content-Type': 'application/x-www-form-urlencoded',
  Authorization: 'Bearer ',
};

const headerJSON = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
  //"Authorization": 'Bearer ',
};

class Constant {
  static KGoogleMapAPIKey = 'AIzaSyCw_5YoOp78lvq1Dgfri-TnDjRSf1cguf0';
  static KGoogleMapAPIKey2 = 'GAIzaSyDJSh-VKoe-_3loUSCEyVvXQT7vsw-2yYQ';
  static headerFormData = headerFormData;
  static headerURLEncoded = headerURLEncoded;
  static headerJSON = headerJSON;

  static socketLocationURL = KSocketUrl;
  static KViewURL = KViewURL;
  static KLoginURL = KUserURL + 'login';

  static ImageURL = KBasePunchInOutURL + 'addimagepunchinout/'
  static PunchInURL = KBasePunchInOutURL + 'addattendence'
  static BreakTimeURL = KBreakURL + 'userupdatebreak'
  static PunchOutURL = KBasePunchInOutURL + 'updatepunchout/'
  static AllPunchOutURL = KBasePunchInOutURL + 'userallpunchinout/'
  static PunchInOutDetailsURL = KBasePunchInOutURL + 'userattendenceactivity/'
  static WeeklyWorkingHoureURL = KBasePunchInOutURL + 'userweeklyworkinghour/'
  static DailyAttendanceURL = KBasePunchInOutURL + 'userallpunchinoutwithbreak/'
  static UsermonthlyworkinghourURL = KBasePunchInOutURL + 'usermonthlyworkinghour/'

  static GettotalleavesURL = KBaseLeaveURL + 'gettotalleaves/';
  static GetUserLeaveURL = KBaseLeaveURL + 'getuserleaves/';
  static DeleteUserLeaveURL = KBaseLeaveURL + 'deleteleaves/';
  static ApplyLeaveURL = KBaseLeaveURL + 'applyforleave';
  static UpdateLeaveURL = KBaseLeaveURL + 'updateleaves';

  static NewsURL = KBaseDashBoardURL + 'getnews';
  static NewsImageURL = KBaseURL + 'dashboard/getnewsimage?filename=';
  static HolidayURL = KBaseDashBoardURL + 'allholidays';

  static socketIdURL = KBaseURL + 'userprofile/getalluser?userid=';
  static udateStatusURL = KBaseURL + 'chat/updatestatus';

  static getProfilePicURL = KBaseURL + 'userprofile/getprofilepic?filename='

  static KEmployeDetailsKey = 'EmployeDetails';
  static KLoginStatusKey = 'LoginStatus';
  static KLogin = 'Login';
  static KLogout = 'Logout';
  static KTrue = true;
  static KFalse = false;
  static KSuccessCode = 200;
  static KErrorCode = 401;

  static width = Dimensions.get('window').width;
  static height = Dimensions.get('window').height;

  static theme = {
    roundness: 10,
    colors: {
      background: 'white',
      // primary: Constant.textColor7,
      // underlineColor: Constant.textColor4,
    },
  };

  static backgroundColor = '#F5F9FF';
  static backgroundColor2 = '#ffffff';
  static backgroundColor3 = '#FAFCFF';
  static backgroundColor4 = '#EAECEF';
  static backgroundColor5 = '#262626';

  static gray = 'gray';
  static gray2 = '#AFAFAF';
  static gray3 = '#F1F1F1';
  static white = 'white';
  static black = 'black';
  static primaryGray = '#F4F4F4';
  static secondaryGray = '#ECECEC';

  static red = 'red';

  static darkturquoise = '#00E6DF';
  static primaryGreen = '#47CA6C';
  static secondaryGreen = '#8EE000';

  static textColor1 = '#FFFFFF';
  static textColor2 = '#3A3335';
  static textColor3 = '#857E80';
  static textColor4 = '#A0A4A8';
  static textColor5 = '#929292';
  static textColor6 = '#DDE2E8';
  static textColor7 = '#5D5859';
  static textColor8 = '#A1979A';
  static textColor9 = '#EFF4F9';
  static textColor10 = '#000';
  static textColor11 = '#A3A9B5';
  static textColor12 = '#505254';
  static textColor13 = '#EBEFF5';
  static textColor14 = '#EBEBEB';
  static textColor15 = '#161617';
  static textColor16 = '#F8F9FA';
  static textColor17 = '#D3D6E3';
  static textColor18 = '#8E95A4';
  static textColor19 = '#B7BECB';
  static textColor20 = '#717578';
  static textColor21 = '#838995';
  static textColor22 = '#5D6168';
  static textColor23 = '#939DB2';
  static textColor24 = '#3F4244';

  static topBarTxtColor1 = '#646C7D';
  static topBarTxtColor2 = '#B5BAC5';
  static topBarBottomBorderColor = '#8E95A4';

  static borderColor = '#F5F6F8';
  static borderColor2 = '#DCE0E8';

  static unSelectedratingsColor = '#CFD5DC';

  static buttonColor1 = '#505254';
  static buttonColor2 = '#111213';
  static buttonColor3 = '#00000029';

  static KChatInComingMsgColor = '#CFD5DC';
  static KChatOutgoingMsgColor = '#505254';

  //   static fontSizeHeading =
  //     Platform.isPad || DeviceInfo.isTablet()
  //       ? (Dimensions.get('window').width * 3.8) / 100
  //       : (Dimensions.get('window').width * 5.2) / 100;
  //   static fontSizeLarge =
  //     Platform.isPad || DeviceInfo.isTablet()
  //       ? (Dimensions.get('window').width * 3.1) / 100
  //       : (Dimensions.get('window').width * 4.3) / 100;
  //   static fontSizeMedium =
  //     Platform.isPad || DeviceInfo.isTablet()
  //       ? (Dimensions.get('window').width * 2.8) / 100
  //       : (Dimensions.get('window').width * 4.1) / 100;
  //   static fontSizeSmall =
  //     Platform.isPad || DeviceInfo.isTablet()
  //       ? (Dimensions.get('window').width * 2.5) / 100
  //       : (Dimensions.get('window').width * 3.8) / 100;

  static KSpecialCharRegex = /[`~<>;':"/[\]|{}()=+]/;
  // /^[[\]\{\}\&\[|]\#\+\*\;\>\<\(\)\$\`\~\%\:\}\{\"\'\]*$/; ///[[&\/\\#,+()$~%'":*?<>{};]/;
  static KEmailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
  static KPasswordRegex = /^(?=.*\d)(?=.*[aA-zZ]).{6,20}$/;
  static KCurrency = '$';
}

export default Constant;
