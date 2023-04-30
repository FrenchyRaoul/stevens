// const redux = require('redux');
// const reducers = require('../reducers');
// const store = redux.createStore(reducers);
import {createStore} from 'redux';
import {composeWithDevTools} from 'redux-devtools-extension'
import rootReducer from '../reducers'

const store = createStore(rootReducer, composeWithDevTools)

export default store;