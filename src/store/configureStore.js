'use strict';

import {createStore, compose, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers/index';
import { AsyncStorage } from 'react-native';
import {persistStore, autoRehydrate} from 'redux-persist';
var logger = require('redux-logger');


const defaultState = {

};


var createRBStore = applyMiddleware(thunk, logger())(createStore); //middleware

function configureStore(onComplete: ?() => void) {

    const store = createRBStore(rootReducer, defaultState);//, autoRehydrate());
    persistStore(store, {storage: AsyncStorage}, onComplete);

    return store;
}

export default configureStore;

