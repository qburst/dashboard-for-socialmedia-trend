import { REPORT_SPAM_SUCCESS, FETCH_OVERALL_DATA_SUCCESS, FETCH_TWEET_DATA_SUCCESS,REPORT_SPAM,
   FETCH_CATEGORIES_SUCCESS, TOGGLE_SIDEBAR, SET_CATEGORY,FETCH_DATA_LOADING, REPORT_SPAM_FAILED } from '../Actions/Actions';

const initialState = {
countryWiseData:[],
overAllData:{},
spinner:false,
tweetData:[],
isSpamReportedSuccess: false,
countryCount:undefined,
menuVisible: false,
category: 'DASHBOARD',
navItems: [{_id : 'DASHBOARD'}]
};

const reducer = (state = initialState, action) => {
console.log(action.data,'val')
  switch (action.type) {
    case TOGGLE_SIDEBAR:
      return{ 
        ...state,
        menuVisible : !state.menuVisible
      }
    case FETCH_DATA_LOADING:
      return{
        ...state,
        spinner : action.isLoading
      }
    case SET_CATEGORY:
      return{
        ...state,
        category : action.category
      }
    case FETCH_TWEET_DATA_SUCCESS:
    return{
      ...state,
      tweetData : action.data,
      spinner: false
    }
    case REPORT_SPAM_SUCCESS:
      return{
        ...state,
        isSpamReportedSuccess : true,
        spinner: false
      }
      case REPORT_SPAM_FAILED:
        return{
          ...state,
          isSpamReportedSuccess : false,
          spinner: false
        }
      case REPORT_SPAM:
      return{
        ...state,
        spamMessage : null,
      }
      case FETCH_OVERALL_DATA_SUCCESS:
      return{
        ...state,
        overAllData : action.data
      }
      case FETCH_CATEGORIES_SUCCESS:
        state.navItems.push(...action.data);
        return{
          ...state,
          navItems : Object.assign([],state.navItems)
        }
    default:
    return state;
    }

};

export default reducer;
