import { takeEvery, put, call } from "redux-saga/effects";
import Axios from 'axios';
import {
  FETCH_OVERALL_DATA, FETCH_OVERALL_DATA_SUCCESS, FETCH_TWEET_DATA_CATEGORY_WISE, REPORT_SPAM,
  FETCH_DATA_LOADING, FETCH_TWEET_DATA_SUCCESS, FETCH_CATEGORIES_SUCCESS,
  SEND_REGISTRATION_DATA, SEND_REGISTRATION_DATA_SUCCESS, REPORT_SPAM_SUCCESS, REPORT_SPAM_FAILED,
  SEND_REGISTRATION_DATA_FAILURE, ON_USER_LOGIN, FETCH_CATEGORIES, FETCH_TWEET_DATA,
  SEND_LOGIN_DATA_SUCCESS, SEND_LOGIN_DATA_FAILURE, ON_LOGOUT, ON_LOGOUT_SUCCESS, ON_LOGOUT_FAILURE
} from '../Actions/Actions';
import {baseURL} from './baseURL';

const getURL = (apiEndPoint) => {
  if(apiEndPoint.includes('users')){
    return baseURL + apiEndPoint;
  } else {
    return baseURL + 'api/' + apiEndPoint;
  }
}

const triggerOverAllDataApi = () => {
  let url = getURL("report/world");
  return Axios.post(url)
    .then(response => response.data)
}

function* fetchOverAllData() {
  const response = yield call(triggerOverAllDataApi);
  yield put({ type: FETCH_OVERALL_DATA_SUCCESS, data: response });
}

const triggerRegistrationApi = (action) => {
  let url = getURL("users/profile/");
  return Axios.post(url, {
    name: action.data.userName,
    email: action.data.emailId,
    password: action.data.password
  })
    .then(response => response.data)
}

function* sendRegistrationData(type, action) {
  try {
    const response = yield call(triggerRegistrationApi, type, action);
    yield put({ type: SEND_REGISTRATION_DATA_SUCCESS, data: response });
  }
  catch (error) {
    let errorMsg;
    error.response && error.response.status === 404 ? errorMsg = 'Kindly Try After Sometime' : errorMsg = error.response && error.response.data.email[0]
    yield put({ type: SEND_REGISTRATION_DATA_FAILURE, errorData: errorMsg });
  }
}

const triggerLoginApi = (action) => {
  let url = getURL("users/login/");
  return Axios.post(url, {
    username: action.userName,
    password: action.password
  })
    .then(response => {
      return response.data
    })
}

function* sendLoginData(action) {
  try {
    const response = yield call(triggerLoginApi, action);
    if (response.token) {
      sessionStorage.setItem('Token', response.token)
      sessionStorage.setItem('Username', response.name)
      action.history.push('/dashboard');
    }
    yield put({ type: SEND_LOGIN_DATA_SUCCESS, data: action.history })
  }
  catch (error) {
    let errorMsg;
    error.response && error.response.status === 404 ? errorMsg = 'Kindly Try After Sometime' : errorMsg = error.response && error.response.data.non_field_errors[0]
    yield put({ type: SEND_LOGIN_DATA_FAILURE, errorData: errorMsg });
  }
}

const logout = () => {
  let url = getURL("users/logout/");
  let token = sessionStorage.getItem('Token')
  return Axios.get(url, { headers: { "Authorization": `Token ${token}` } })
    .then(response => response.data)
}

function* userLogout(action) {
  try {
    const res = yield call(logout)
    if (res === 'Logged Out Successfully') {
      sessionStorage.removeItem('Token');
      action.history.push('/');
    }
    yield put({ type: ON_LOGOUT_SUCCESS, data: action })
  }
  catch (error) {
    yield put({ type: ON_LOGOUT_FAILURE, errorData: error });
  }
}

const getTweetDataAPI = (action) => {
  let url = getURL("tweets/?page=") + action.page
  return Axios.get(url)
    .then(response => response.data)
}
function* fetchTweetData(action) {
  yield put({ type: FETCH_DATA_LOADING, isLoading: true })
  const response = yield call(getTweetDataAPI, action);
  yield put({ type: FETCH_TWEET_DATA_SUCCESS, data: response });
}

const getTweetDataByCategoryAPI = (action) => {
  let url = getURL("tweets/?category=") + action.category + ";page=" + action.page
  return Axios.get(url)
    .then(response => response.data)
}
function* fetchTweetDataByCategory(action) {
  yield put({ type: FETCH_DATA_LOADING, isLoading: true })
  const response = yield call(getTweetDataByCategoryAPI, action);
  yield put({ type: FETCH_TWEET_DATA_SUCCESS, data: response });
}

const getCategoryAPI = () => {
  let url = getURL("categories/");
  return Axios.get(url)
    .then(response => response.data)
}
function* fetchCategories() {
  const response = yield call(getCategoryAPI);
  yield put({ type: FETCH_CATEGORIES_SUCCESS, data: response.results });
}

const getSpamReportAPI = (action) => {
  let url = getURL("add_spam_count/?tweet_id=") + action.id;
  let token = sessionStorage.getItem('Token')
  return Axios.put(url, {}, { headers: { "Authorization": `Token ${token}` } })
    .then(response => response.data)
}
function* reportTweetAsSpam(action) {
  try {
    yield put({ type: FETCH_DATA_LOADING, isLoading: true })
    yield call(getSpamReportAPI, action);
    yield put({ type: REPORT_SPAM_SUCCESS});
  }
  catch (error) {
    yield put({ type: REPORT_SPAM_FAILED})
  };
}

export function* saga() {
  yield takeEvery(FETCH_OVERALL_DATA, fetchOverAllData);
  yield takeEvery(SEND_REGISTRATION_DATA, sendRegistrationData);
  yield takeEvery(ON_USER_LOGIN, sendLoginData);
  yield takeEvery(ON_LOGOUT, userLogout);
  yield takeEvery(FETCH_CATEGORIES, fetchCategories);
  yield takeEvery(FETCH_TWEET_DATA, fetchTweetData);
  yield takeEvery(FETCH_TWEET_DATA_CATEGORY_WISE, fetchTweetDataByCategory);
  yield takeEvery(REPORT_SPAM, reportTweetAsSpam);

}


