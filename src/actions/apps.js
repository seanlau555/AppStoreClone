import { NetInfo, AppState, Platform } from 'react-native';
import axios from 'axios';
const topFreeAppsAPI = "https://itunes.apple.com/hk/rss/topfreeapplications/limit=100/json";
const topGrossingAPI = "https://itunes.apple.com/hk/rss/topgrossingapplications/limit=10/json";

// export const ROOT_CHANGE = 'app/ROOT_CHANGE';
export const SAVE_APP_LIST = "SAVE_APP_LIST";
export const FETCH_LOADING = "FETCH_LOADING";
export const FETCH_REFRESHING = "FETCH_REFRESHING";
export const FETCH_ERROR = "FETCH_ERROR";


function renameData(array) {
  var result = [];
  for (var i = 0; i < array.length; i++) {
    var item = array[i];
    result[i] = {
      "title": item['im:name'].label,
      "category": item['category'].attributes.label,
      "author": item['im:artist'].label,
      "summary": item['summary'].label,
      "coverImage": item['im:image'][1].label
    }
  }
  return result;
}

function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (0 !== currentIndex) {

    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;

    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}

export function getAppList(refreshing) {
  return async function (dispatch, getState) {
    // console.log(1234);
    if (!refreshing)dispatch(apiCallLoading(true));
    else dispatch(apiCallRefreshing(true));

    try {
      let [freeApps, grossingApps] = await axios.all([
        axios.get(topFreeAppsAPI, { cache: false }),
        axios.get(topGrossingAPI, { cache: false }),
      ]);
      console.log(freeApps, grossingApps);
      dispatch(saveAppList(shuffle(renameData(freeApps.data.feed.entry)), renameData(grossingApps.data.feed.entry)));
      if (!refreshing) dispatch(apiCallLoading(false));
      else dispatch(apiCallRefreshing(false));
    } catch (e) {
      console.log(e);
      dispatch(fetchingError());
      if (!refreshing)dispatch(apiCallLoading(false));
      else dispatch(apiCallRefreshing(false));
    }
  };
}

export function apiCallLoading(isLoading) {
  return { type: FETCH_LOADING, isLoading };
}

export function apiCallRefreshing(isRefreshing) {
  return { type: FETCH_REFRESHING, isRefreshing };
}

export function fetchingError() {
  return { type: FETCH_ERROR };
}

export function saveAppList(freeApps, grossingApps) {
    return { type: SAVE_APP_LIST, freeApps, grossingApps };
}


