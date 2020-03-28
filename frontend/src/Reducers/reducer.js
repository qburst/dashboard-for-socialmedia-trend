import {
  FETCH_OVERALL_DATA_SUCCESS, REPORT_SPAM, SET_CATEGORY,
  FETCH_DATA_LOADING, FETCH_TWEET_DATA_SUCCESS, FETCH_CATEGORIES_SUCCESS, SET_USERNAME, SET_PASSWORD,
  SEND_REGISTRATION_DATA, SEND_REGISTRATION_DATA_SUCCESS, REPORT_SPAM_SUCCESS, REPORT_SPAM_FAILED, DISPLAY_SIGNIN_PAGE,
  SEND_REGISTRATION_DATA_FAILURE, ON_USER_LOGIN, DISPLAY_LOGIN_PAGE, SIDEBAR_TOGGLE,
  SEND_LOGIN_DATA_SUCCESS, SEND_LOGIN_DATA_FAILURE, ON_LOGOUT, ON_LOGOUT_SUCCESS, ON_LOGOUT_FAILURE
} from '../Actions/Actions';

export const initialState = {
  countryWiseData: [],
  overAllData: {},
  countryCount: undefined,
  spinner: false,
  isLoggedIn: false,
  userName: '',
  password: '',
  registrationSuccess: false,
  registrationFailure: false,
  errorMessageRegistration: undefined,
  showLogin: true,
  showSignup: false,
  loginFailure: false,
  errorMessageLogin: undefined,
  toggleSideBar: false,
  tweetData: [],
  isSpamReportedSuccess: false,
  category: undefined,
  navItems: [],
  createdDate: null
};

export default function reducer(state = initialState, action) {
  switch (action.type) {
    case SEND_REGISTRATION_DATA:
    case ON_USER_LOGIN:
      return {
        ...state,
        spinner: true
      }
    case FETCH_OVERALL_DATA_SUCCESS:
      return {
        ...state,
        overAllData: action.data.data,
        createdDate: action.data.created_at
      }
    case SET_USERNAME:
      return {
        ...state,
        userName: action.data
      }
    case SET_PASSWORD:
      return {
        ...state,
        password: action.data
      }
    case SEND_LOGIN_DATA_SUCCESS:
      return {
        ...state,
        isLoggedIn: true,
        loginFailure: false,
        spinner: false
      }
    case ON_LOGOUT:
      return {
        ...state,
        spinner: true
      }
    case ON_LOGOUT_SUCCESS:
      return {
        ...state,
        userName: '',
        password: '',
        isLoggedIn: false,
        spinner: false
      }
    case ON_LOGOUT_FAILURE:
      return {
        ...state,
        spinner: false
      }
    case SEND_REGISTRATION_DATA_SUCCESS:
      return {
        ...state,
        registrationSuccess: validateRegistrationResponse(action.data),
        errorMessageRegistration: '',
        registrationFailure: false,
        spinner: false
      }
    case SEND_REGISTRATION_DATA_FAILURE:
      return {
        ...state,
        registrationFailure: true,
        errorMessageRegistration: action.errorData,
        spinner: false
      }
    case DISPLAY_LOGIN_PAGE:
      return {
        ...state,
        showLogin: true,
        showSignup: false,
        registrationFailure: false,
        registrationSuccess: false
      }
    case DISPLAY_SIGNIN_PAGE:
      return {
        ...state,
        userName: '',
        password: '',
        showSignup: true,
        showLogin: false,
        loginFailure: false,
      }
    case SEND_LOGIN_DATA_FAILURE:
      return {
        ...state,
        loginFailure: true,
        errorMessageLogin: action.errorData,
        spinner: false
      }
    case SIDEBAR_TOGGLE:
      return {
        ...state,
        toggleSideBar: !state.toggleSideBar
      }
    case FETCH_DATA_LOADING:
      return {
        ...state,
        spinner: action.isLoading
      }
    case SET_CATEGORY:
      return {
        ...state,
        category: action.category
      }
    case FETCH_TWEET_DATA_SUCCESS:
      return {
        ...state,
        tweetData: action.data,
        spinner: false
      }
    case REPORT_SPAM_SUCCESS:
      return {
        ...state,
        isSpamReportedSuccess: true,
        spinner: false
      }
    case REPORT_SPAM_FAILED:
      return {
        ...state,
        isSpamReportedSuccess: false,
        spinner: false
      }
    case REPORT_SPAM:
      return {
        ...state,
        spamMessage: null,
      }
    case FETCH_CATEGORIES_SUCCESS:
      return {
        ...state,
        navItems: action.data
      }
    default:
      return state;
  }

}


export const validateRegistrationResponse = (data) => {
  return data.hasOwnProperty('id')
}
