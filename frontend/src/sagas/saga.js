import { takeEvery, put, call } from "redux-saga/effects";
import { FETCH_CATEGORIES_SUCCESS, FETCH_DATA_LOADING, FETCH_OVERALL_DATA ,FETCH_OVERALL_DATA_SUCCESS, FETCH_CATEGORIES, FETCH_TWEET_DATA, FETCH_TWEET_DATA_SUCCESS, REPORT_SPAM, REPORT_SPAM_SUCCESS,
  FETCH_TWEET_DATA_CATEGORY_WISE, REPORT_SPAM_FAILED } from '../Actions/Actions';


function* fetchOverAllData(){
  const response = yield call(
    fetch,
    `http://3.7.29.98:8001/api/report/world`, 
  );
    const result = yield call([response, response.json])
    yield put({ type: FETCH_OVERALL_DATA_SUCCESS, data:result.data });
}

function* fetchTweetData(action){
  yield put({type: FETCH_DATA_LOADING, isLoading: true})
  const response = yield call(
    fetch,
    `http://3.7.29.98:8001/api/tweets/?page=`+action.page
  );
    const result = yield call([response, response.json])
    yield put({ type: FETCH_TWEET_DATA_SUCCESS, data:result });
}
function* fetchTweetDataByCategory(action){
  yield put({type: FETCH_DATA_LOADING, isLoading: true})
  const response = yield call(
    fetch,
    `http://3.7.29.98:8001/api/tweets/?category=`+action.category+`;page=`+action.page
  );
    const result = yield call([response, response.json])
    yield put({ type: FETCH_TWEET_DATA_SUCCESS, data:result });
}

function* fetchCategories(){
  const response = yield call(
    fetch,
    `http://3.7.29.98:8001/api/categories/ `
  );
    const result = yield call([response, response.json])
    yield put({ type: FETCH_CATEGORIES_SUCCESS, data:result.results });
}

function* reportTweetAsSpam(action){
  yield put({type: FETCH_DATA_LOADING, isLoading: true})
  const response = yield call(
    fetch,
    `http://3.7.29.98:8001/api/add_spam_count/?tweet_id=`+ action.id,
    { method: "PUT",headers: { "Authorization": "Token " }}
  );
    const result = yield call([response, response.json])
    if(result.status==="success"){
      yield put({ type: REPORT_SPAM_SUCCESS, data:result })
    }
    else{
      yield put({ type: REPORT_SPAM_FAILED, data:result })
    };
}

export function* saga() {
  yield takeEvery(FETCH_CATEGORIES, fetchCategories);
  yield takeEvery(FETCH_OVERALL_DATA, fetchOverAllData);
  yield takeEvery(FETCH_TWEET_DATA, fetchTweetData);
  yield takeEvery(FETCH_TWEET_DATA_CATEGORY_WISE, fetchTweetDataByCategory);
  yield takeEvery(REPORT_SPAM, reportTweetAsSpam);
}


