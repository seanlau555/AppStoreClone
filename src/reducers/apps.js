
var Actions = require('../actions/apps');
import { REHYDRATE } from 'redux-persist/constants'


const initialState = {
  isLoading: false,
  isRefreshing: false,
  fetchError: false,
  freeApps: [],
  grossingApps: [],
};

export default function app(state = initialState, action = {}) {
  switch (action.type) {
    // case REHYDRATE:
    //   return {
    //     ...state,
    //     startInit: true,
    //     appList: []
    //   };


    case Actions.SAVE_APP_LIST:
      return {
        ...state,
        fetchError: false,
        freeApps: action.freeApps,
        grossingApps: action.grossingApps
      }

    case Actions.FETCH_LOADING:
      return {
        ...state,
        isLoading: action.isLoading
      }
    
    case Actions.FETCH_REFRESHING:
    return {
        ...state,
        isRefreshing: action.isRefreshing
      }

    case Actions.FETCH_ERROR:
      return {
        ...state,
        fetchError: true
      }


    default:
      return state;
  }
}
